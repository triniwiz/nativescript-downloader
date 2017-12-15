import './bundle-config';
import * as application from 'tns-core-modules/application';
import { Downloader } from 'nativescript-downloader';
Downloader.init();
application.start({ moduleName: 'main-page' });
