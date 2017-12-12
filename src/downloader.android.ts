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
declare const com;
export class Downloader extends DownloaderBase {
  private fetch;
  downloadsId: Map<String, any>;
  constructor() {
    super();
    this.downloads = new Map();
    this.downloadsData = new Map();
  }
  public createDownload(options: DownloadOptions): string {
    if (options && !options.url) throw new Error('Url missing');

    const id = this.generateId();

    this.downloadsData.set(id, {
      status: StatusCode.PENDING,
      options: options
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
    return new Promise((resolve, reject) => {
      if (id && this.downloadsData.has(id)) {
        const data = this.downloadsData.get(id);
      } else {
        reject({ message: 'Download ID not found.' });
      }
    });
  }
  public resume(id: string) {
    if (id && this.downloads.has(id)) {
      const download = this.downloads.get(id);
    }
  }
  public retry(id: string) {
    if (id && this.downloads.has(id)) {
      const download = this.downloads.get(id);
    }
  }
  public cancel(id: string) {
    if (id && this.downloads.has(id)) {
      const download = this.downloads.get(id);
    }
  }
  public pause(id: string) {
    if (id && this.downloads.has(id)) {
      const download = this.downloads.get(id);
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
