import {
  DownloaderBase,
  DownloadOptions,
  StatusCode,
  ProgressEventData,
  DownloadEventData
} from './downloader.common';
import * as app from 'tns-core-modules/application';
import { fromObject } from 'tns-core-modules/data/observable';
import * as fs from 'tns-core-modules/file-system';
import * as utils from 'tns-core-modules/utils/utils';
declare const com, co;
export class Downloader extends DownloaderBase {
  private fetch;
  downloadsId: Map<String, any>;
  private manager;
  constructor() {
    super();
    this.downloads = new Map();
    this.downloadsData = new Map();
    /*
    Need to use worker;
    */
  }
  public static init() {
    co.fitcom.fancydownloader.Manager.init(utils.ad.getApplicationContext());
  }
  public createDownload(options: DownloadOptions): string {
    if (options && !options.url) throw new Error('Url missing');
    if (!this.manager) {
      this.manager = co.fitcom.fancydownloader.Manager.getInstance();
    }
    const id = this.generateId();
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

    const request = new co.fitcom.fancydownloader.Request(url);
    let path = '';
    if (options.path) {
      request.setPath(options.path);
    }
    if (options.fileName) {
      request.setFileName(options.fileName);
    }
    if (options.headers) {
      const keysArray = Object.keys(options.headers);
      const headers = new java.util.HashMap();
      for (let key of keysArray) {
        headers.put(key, options.headers[key]);
      }
      request.setHeaders(headers);
    }
    const task = this.manager.create(request);

    path = fs.path.join(request.getFilePath(), request.getFileName());
    this.downloads.set(id, task);
    this.downloadsData.set(id, {
      status: StatusCode.PENDING,
      options: options,
      path: path,
      request: request
    });

    return id;
  }

  public getStatus(id: string): StatusCode {
    if (id && this.downloads.has(id)) {
      const data = this.downloadsData.get(id);
      return data.status;
    }
    return StatusCode.PENDING;
  }

  public start(id: string, progress?: Function): Promise<DownloadEventData> {
    const ref = new WeakRef(this);
    return new Promise((_resolve, _reject) => {
      if (id && this.downloadsData.has(id)) {
        const data = this.downloadsData.get(id);
        this.downloadsData.set(
          id,
          Object.assign({}, data, {
            reject: _reject,
            resolve: _resolve,
            callback: progress
          })
        );
        const downloadId = this.downloads.get(id);
        const listener = co.fitcom.fancydownloader.DownloadListenerUI.extend({
          owner: ref.get(),
          onUIProgress(
            task: string,
            currentBytes: number,
            totalBytes: number,
            speed: number
          ) {
            const current = Math.floor(
              Math.round(currentBytes / totalBytes * 100)
            );
            if (this.owner.downloadsData.has(task)) {
              const data = this.owner.downloadsData.get(task);
              if (data) {
                if (data.status && data.status !== StatusCode.DOWNLOADING) {
                  this.owner.downloadsData.set(
                    task,
                    Object.assign({}, data, {
                      status: StatusCode.DOWNLOADING
                    })
                  );
                }
              }

              const callback = data.callback;
              if (callback && typeof callback === 'function') {
                callback(<ProgressEventData>{ value: current });
              }
            }
          },

          onUIComplete(task: string) {
            if (this.owner.downloadsData.has(task)) {
              const data = this.owner.downloadsData.get(task);
              const resolve = data.resolve;
              resolve(<DownloadEventData>{
                status: StatusCode.COMPLETED,
                message: null,
                path: fs.path.join(
                  data.request.getFilePath(),
                  data.request.getFileName()
                )
              });
            }
          },

          onUIError(task: string, error: java.lang.Exception) {
            if (this.owner.downloadsData.has(task)) {
              const data = this.owner.downloadsData.get(task);
              const reject = data.reject;
              reject({
                status: StatusCode.ERROR,
                message: error.getLocalizedMessage()
              });
            }
          }
        });
        data.request.setListener(new listener());

        this.manager.start(downloadId);
      } else {
        _reject({ message: 'Download ID not found.' });
      }
    });
  }

  public resume(id: string) {
    if (id && this.downloads.has(id)) {
      const downloadId = this.downloads.get(id);
      this.manager.resume(downloadId);
    }
  }

  public cancel(id: string) {
    if (id && this.downloads.has(id)) {
      const downloadId = this.downloads.get(id);
      this.manager.cancel(downloadId);
    }
  }
  public pause(id: string) {
    if (id && this.downloads.has(id)) {
      const downloadId = this.downloads.get(id);
      this.manager.pause(downloadId);
      setTimeout(() => {
        const data = this.downloadsData.get(id);
        if (data) {
          this.downloadsData.set(
            id,
            Object.assign({}, data, {
              status: StatusCode.PAUSED
            })
          );
        }
      }, 10);
    }
  }
  public getPath(id: string): string {
    if (id && this.downloadsData.has(id)) {
      const download = this.downloadsData.get(id);
      return download.path;
    }
    return null;
  }
}
