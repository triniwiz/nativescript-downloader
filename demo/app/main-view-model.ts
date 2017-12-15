import { Observable } from 'tns-core-modules/data/observable';
import {
  Downloader,
  ProgressEventData,
  DownloadEventData,
  DownloadEventError
} from 'nativescript-downloader';
import * as frame from 'tns-core-modules/ui/frame';
export class HelloWorldModel extends Observable {
  public downloadManager: Downloader;
  fileDownloaderId: string;
  imageDownloaderId: string;
  constructor() {
    super();
  }

  generateDownloads() {
    this.downloadManager = new Downloader();
    this.set('fileProgress', 0);
    this.set('imageProgress', 0);

    this.imageDownloaderId = this.downloadManager.createDownload({
      url:
        'https://wallpaperscraft.com/image/hulk_wolverine_x_men_marvel_comics_art_99032_3840x2400.jpg'
    });
    console.log(`Image Id :${this.imageDownloaderId} `);

    this.fileDownloaderId = this.downloadManager.createDownload({
      url: 'http://ipv4.download.thinkbroadband.com/50MB.zip'
    });
    console.log(`File Id :${this.fileDownloaderId} `);
  }

  generateAndStart() {
    this.generateDownloads();
    this.downloadFile();
    this.downloadImage();
  }

  downloadFile() {
    this.downloadManager
      .start(this.fileDownloaderId, (progressData: ProgressEventData) => {
        this.notifyPropertyChange('fileProgress', progressData.value);
      })
      .then(completed => {
        console.log(`File : ${completed.path}`);
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  pauseFile() {
    this.downloadManager.pause(this.fileDownloaderId);
  }

  resumeFile() {
    this.downloadManager.resume(this.fileDownloaderId);
  }

  downloadImage() {
    this.downloadManager
      .start(this.imageDownloaderId, (progressData: ProgressEventData) => {
        this.set('imageProgress', progressData.value);
      })
      .then((completed: DownloadEventData) => {
        console.log(`Image : ${completed.path}`);
        this.set('image', completed.path);
      })
      .catch(error => {
        console.log(error.message);
      });
  }
}
