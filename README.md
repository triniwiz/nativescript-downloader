# NativeScript Downloader

[![npm](https://img.shields.io/npm/v/nativescript-downloader.svg)](https://www.npmjs.com/package/nativescript-downloader)
[![npm](https://img.shields.io/npm/dt/nativescript-downloader.svg?label=npm%20downloads)](https://www.npmjs.com/package/nativescript-downloader)
[![Build Status](https://travis-ci.org/triniwiz/nativescript-downloader.svg?branch=master)](https://travis-ci.org/triniwiz/nativescript-downloader)

## Installation

#### NativeScript 4x

* `tns plugin add nativescript-downloader`

#### NativeScript 3x

* `tns plugin add nativescript-downloader@1.1.0`

## Usage

### TypeScript

```typescript
import { Downloader } from 'nativescript-downloader';
Downloader.init(); // <= Try calling this after the app launches to start the downloader service
Downloader.setTimeout(120); //Increase timeout default 60s
```

```typescript
import { Downloader, ProgressEventData, DownloadEventData } from 'nativescript-downloader';
const downloader = new Downloader();
const imageDownloaderId = Downloader.createDownload({
  url:
    'https://wallpaperscraft.com/image/hulk_wolverine_x_men_marvel_comics_art_99032_3840x2400.jpg'
});

downloader
  .start(imageDownloaderId, (progressData: ProgressEventData) => {
    console.log(`Progress : ${progressData.value}%`);
    console.log(`Current Size : ${progressData.currentSize}%`);
    console.log(`Total Size : ${progressData.totalSize}%`);
    console.log(`Download Speed in bytes : ${progressData.speed}%`);
  })
  .then((completed: DownloadEventData) => {
    console.log(`Image : ${completed.path}`);
  })
  .catch(error => {
    console.log(error.message);
  });
```

### JavaScript

```js
var Downloader = require('nativescript-downloader').Downloader;
Downloader.Downloader.init(); // <= Try calling this after the app launches to start the downloader service
Downloader.setTimeout(120); //Increase timeout default 60s
```

```js
var Downloader = require('nativescript-downloader').Downloader;
var downloader = new Downloader();
var imageDownloaderId = downloadManager.createDownload({
  url:
    'https://wallpaperscraft.com/image/hulk_wolverine_x_men_marvel_comics_art_99032_3840x2400.jpg'
});

downloader
  .start(imageDownloaderId, progressData => {
    console.log(`Progress : ${progressData.value}%`);
  })
  .then(completed => {
    console.log(`Image : ${completed.path}`);
  })
  .catch(error => {
    console.log(error.message);
  });
```

## Api

| Method                                   | Default | Type                         | Description                                           |
| ---------------------------------------- | ------- | ---------------------------- | ----------------------------------------------------- |
| createDownload(options: DownloadOptions) |         | `string`                     | Creates a download task it returns the id of the task |
| getStatus(id: string)                    |         | `StatusCode`                 | Gets the status of a download task.                   |
| start(id: string, progress?: Function)   |         | `Promise<DownloadEventData>` | Starts a download task.                               |  |
| resume(id: string)                       |         | `void`                       | Resumes a download task.                              |
| cancel(id: string)                       |         | `void`                       | Cancels a download task.                              |
| pause(id: string)                        |         | `void`                       | Pauses a download task.                               |
| getPath(id: string)                      |         | `void`                       | Return the path of a download task.                   |

## Example Image

| IOS                                     | Android                                     |
| --------------------------------------- | ------------------------------------------- |
| ![IOS](https://i.imgur.com/WQqhhXF.gif) | ![Android](https://i.imgur.com/fE9rBvl.gif) |

# TODO

* [ ] Local Notifications
