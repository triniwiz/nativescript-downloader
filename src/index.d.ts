import {
  DownloaderBase,
  DownloadEventData,
  DownloadOptions,
  StatusCode
} from './downloader.common';
export {
  DownloadEventData,
  DownloadOptions,
  StatusCode,
  DownloadEventError,
  ProgressEventData
} from './downloader.common';
export const PROGRESS_EVENT = 'progress';
export const STATUS_EVENT = 'status';
export declare class Downloader extends DownloaderBase {
  constructor();
  createDownload(options: DownloadOptions): string;
  getStatus(id: string): StatusCode;
  start(id: string, progress?: Function): Promise<DownloadEventData>;
  retry(id: string): void;
  resume(id: string): void;
  cancel(id: string): void;
  pause(id: string): void;
  getPath(id: string): string;
}
