import { StatusCode } from './downloader.common';

export interface DownloadsData {
  status?: StatusCode;
  resolve?: Function;
  reject?: Function;
  callback?: Function;
  request?: any;
  path?: string;
}
