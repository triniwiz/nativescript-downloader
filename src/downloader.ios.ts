import {
  DownloaderBase,
  DownloadOptions,
  DownloadEventData,
  StatusCode,
  ProgressEventData,
  generateId
} from './downloader.common';
import * as fs from 'tns-core-modules/file-system';
import { fromObject } from 'tns-core-modules/data/observable/observable';
const main_queue = dispatch_get_current_queue();
// declare const AFURLSessionManager, NSURLSessionConfiguration, NSURLRequest;
export class Downloader extends DownloaderBase {
  constructor() {
    super();
    this.downloads = new Map();
    this.downloadsData = new Map();
  }
  public static init() {}
  public createDownload(options: DownloadOptions): string {
    if (options && !options.url) throw new Error('Url missing');
    const id = generateId();
    const configuration = NSURLSessionConfiguration.defaultSessionConfiguration;
    const download = AFURLSessionManager.alloc().initWithSessionConfiguration(
      configuration
    );

    let url;
    let query;
    if (options.query) {
      if (typeof options.query === 'object') {
        const keysArray = Object.keys(options.query);
        query = '';
        for (let key of keysArray) {
          query += key + '=' + options.query[key] + '&';
        }
      } else if (typeof options.query === 'string') {
        query = options.query;
      }
      url = encodeURI(options.url + query);
    } else {
      url = options.url;
    }

    const request = NSURLRequest.requestWithURL(NSURL.URLWithString(url));

    let path = '';
    if (options.path && options.fileName) {
      path = fs.path.join(options.path, options.fileName);
    } else if (!options.path && options.fileName) {
      path = fs.path.join(fs.knownFolders.temp().path, options.fileName);
    } else if (options.path && !options.fileName) {
      path = fs.path.join(options.path, `${generateId()}`);
    } else {
      path = fs.path.join(fs.knownFolders.temp().path, `${generateId()}`);
    }

    const ref = new WeakRef(this);
    let lastRefreshTime = 0;
    let lastBytesWritten = 0;
    const task = download.downloadTaskWithRequestProgressDestinationCompletionHandler(
      request,
      progress => {
        dispatch_async(main_queue, () => {
          const owner = ref.get();
          if (task && task.state === NSURLSessionTaskState.Running) {
            const current = Math.floor(
              Math.round(progress.fractionCompleted * 100)
            );
            if (owner.downloadsData.has(id)) {
              const data = owner.downloadsData.get(id);
              if (data) {
                if (data.status && data.status !== StatusCode.DOWNLOADING) {
                  owner.downloadsData.set(
                    id,
                    Object.assign({}, data, {
                      status: StatusCode.DOWNLOADING
                    })
                  );
                }
              }
              const callback = data.callback;
              let speed;
              const currentBytes = task.countOfBytesReceived;
              const totalBytes = progress.totalUnitCount;
              let currentTime = Date.now();
              let minTime = 100;

              if (
                currentTime - lastRefreshTime >= minTime ||
                currentBytes === totalBytes
              ) {
                let intervalTime = currentTime - lastRefreshTime;
                if (intervalTime === 0) {
                  intervalTime += 1;
                }
                const updateBytes = currentBytes - lastBytesWritten;
                speed = Math.floor(Math.round(updateBytes / intervalTime));

                if (callback && typeof callback === 'function') {
                  callback(<ProgressEventData>{
                    value: current,
                    speed: speed,
                    currentSize: currentBytes,
                    totalSize: progress.totalUnitCount
                  });
                }

                lastRefreshTime = Date.now();
                lastBytesWritten = currentBytes;
              }

            }
          } else if (task.state === NSURLSessionTaskState.Suspended) {
            const data = owner.downloadsData.get(id);
            if (data) {
              owner.downloadsData.set(
                id,
                Object.assign({}, data, {
                  status: StatusCode.PAUSED
                })
              );
            }
          }
        });
      },
      (targetPath, response) => {
        const owner = ref.get();
        return NSURL.fileURLWithPath(path);
      },
      (response, filePath, error) => {
        const owner = ref.get();
        if (error) {
          if (owner.downloadsData.has(id)) {
            const data = owner.downloadsData.get(id);
            const reject = data.reject;
            reject({
              status: StatusCode.ERROR,
              message: error.localizedDescription
            });
          }
        } else {
          if (
            task &&
            task.state === NSURLSessionTaskState.Completed &&
            !task.error
          ) {
            if (owner.downloadsData.has(id)) {
              const data = owner.downloadsData.get(id);
              const resolve = data.resolve;
              resolve(<DownloadEventData>{
                status: StatusCode.COMPLETED,
                message: null,
                path: data.path
              });
            }
          }
        }
      }
    );
    this.downloads.set(id, task);

    this.downloadsData.set(id, {
      status: StatusCode.PENDING,
      path: path
    });
    return id;
  }

  public start(id: string, progress?: Function): Promise<DownloadEventData> {
    return new Promise((resolve, reject) => {
      if (id && this.downloads.has(id)) {
        const data = this.downloadsData.get(id);
        this.downloadsData.set(
          id,
          Object.assign({}, data, {
            reject: reject,
            resolve: resolve,
            callback: progress
          })
        );
        const task = this.downloads.get(id);
        if (task) {
          task.resume();
        }
      } else {
        reject({ message: 'Download ID not found.' });
      }
    });
  }

  public getStatus(id: string): StatusCode {
    if (id && this.downloads.has(id)) {
      const download = this.downloadsData.get(id);
      return download.status;
    }
    return StatusCode.PENDING;
  }

  public pause(id: string) {
    if (id && this.downloads.has(id)) {
      const task = this.downloads.get(id);
      if (task) {
        task.suspend();
        const data = this.downloadsData.get(id);
        if (data) {
          this.downloadsData.set(
            id,
            Object.assign({}, data, {
              status: StatusCode.PAUSED
            })
          );
        }
      }
    }
  }

  public resume(id: string): void {
    if (id && this.downloads.has(id)) {
      const task = this.downloads.get(id);
      if (task) {
        task.resume();
      }
    }
  }

  public cancel(id: string): void {
    if (id && this.downloads.has(id)) {
      const task = this.downloads.get(id);
      if (task) {
        task.cancel();
      }
    }
  }

  public getPath(id: string): string {
    if (id && this.downloadsData.has(id)) {
      const data = this.downloadsData.get(id);
      if (data) {
        return data.path;
      }
      return null;
    }
    return null;
  }
}
