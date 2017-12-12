import { DownloaderBase } from './downloader.common';
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

export interface DownloadEventError {
  status: string;
  message: string;
}

export interface DownloadEventData {
  status: string;
  path: string;
  message: string;
}
export interface ProgressEventData {
  value: number;
}

export interface StatusData extends Observable {
  value: any;
  error?: any;
}
export enum StatusCode {
  PENDING = 'pending',
  PAUSED = 'paused',
  DOWNLOADING = 'downloading',
  COMPLETED = 'completed',
  ERROR = 'error'
}

export interface DownloadOptions {
  url: string;
  query?: Object | string;
  headers?: Object;
  path?: string;
  fileName?: string;
}
