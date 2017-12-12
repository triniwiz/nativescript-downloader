import { Observable } from 'tns-core-modules/data/observable';
import { DownloadOptions, DownloadEventData, StatusCode } from '.';
export abstract class DownloaderBase extends Observable {
  downloads: Map<String, any>;
  downloadsData: Map<String, any>;
  /**
   * Native android instance
   */
  android: any;

  /**
   * Native ios instance of [AFURLSessionManager](http://cocoadocs.org/docsets/AFNetworking/3.1.0/Classes/AFURLSessionManager.html)
   */
  ios: any;
  constructor() {
    super();
  }
  public abstract createDownload(options: DownloadOptions): string;
  public abstract start(
    id: string,
    progress?: Function
  ): Promise<DownloadEventData>;
  public abstract retry(id: string): void;
  public abstract resume(id: string): void;
  public abstract pause(id: string): void;
  public abstract cancel(id: string): void;
  public generateId(): string {
    return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  public abstract getStatus(id: string): StatusCode;
  public abstract getPath(id: string): string;
}
