declare namespace co {
  export namespace fitcom {
    export namespace fancydownloader {
      export class BuildConfig {
        public static DEBUG: boolean;
        public static APPLICATION_ID: string;
        public static BUILD_TYPE: string;
        public static FLAVOR: string;
        public static VERSION_CODE: number;
        public static VERSION_NAME: string;
        public constructor();
      }
    }
  }
}

import javalangException = java.lang.Exception;
/// <reference path="./java.lang.Exception.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
declare namespace co {
  export namespace fitcom {
    export namespace fancydownloader {
      export class DownloadCallback {
        /**
         * Constructs a new instance of the co.fitcom.fancydownloader.DownloadCallback interface with the provided implementation.
         */
        public constructor(implementation: {
          onProgress(
            param0: string,
            param1: number,
            param2: number,
            param3: number
          ): void;
          onComplete(param0: string): void;
          onError(param0: string, param1: javalangException): void;
        });
        public onProgress(
          param0: string,
          param1: number,
          param2: number,
          param3: number
        ): void;
        public onComplete(param0: string): void;
        public onError(param0: string, param1: javalangException): void;
      }
    }
  }
}

/// <reference path="./java.lang.Exception.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
declare namespace co {
  export namespace fitcom {
    export namespace fancydownloader {
      export abstract class DownloadListener {
        public onProgress(
          param0: string,
          param1: number,
          param2: number,
          param3: number
        ): void;
        public onComplete(param0: string): void;
        public onError(param0: string, param1: javalangException): void;
        public constructor();
      }
    }
  }
}

/// <reference path="./java.lang.Exception.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
declare namespace co {
  export namespace fitcom {
    export namespace fancydownloader {
      export abstract class DownloadListenerUI extends co.fitcom.fancydownloader
        .DownloadListener {
        public onProgress(
          param0: string,
          param1: number,
          param2: number,
          param3: number
        ): void;
        public onUIProgress(
          param0: string,
          param1: number,
          param2: number,
          param3: number
        ): void;
        public onUIError(param0: string, param1: javalangException): void;
        public onComplete(param0: string): void;
        public onError(param0: string, param1: javalangException): void;
        public onUIComplete(param0: string): void;
        public constructor();
      }
    }
  }
}

import okhttp3MediaType = okhttp3.MediaType;
import okioBufferedSource = okio.BufferedSource;
/// <reference path="./okhttp3.MediaType.d.ts" />
/// <reference path="./okio.BufferedSource.d.ts" />
declare namespace co {
  export namespace fitcom {
    export namespace fancydownloader {
      export class DownloadResponseBody {
        public contentLength(): number;
        public contentType(): okhttp3MediaType;
        public source(): okioBufferedSource;
      }
    }
  }
}

import androidcontentContext = android.content.Context;
/// <reference path="./android.content.Context.d.ts" />
/// <reference path="./co.fitcom.fancydownloader.Request.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
declare namespace co {
  export namespace fitcom {
    export namespace fancydownloader {
      export class Manager {
        public static DB_NAME: string;
        public static DB_PROP_NAME: string;
        public static DB_PROP_CALL: string;
        public static DB_PROP_BUILDER: string;
        public static DB_PROP_REQUEST: string;
        public create(param0: co.fitcom.fancydownloader.Request): string;
        public static getInstance(): co.fitcom.fancydownloader.Manager;
        public resume(param0: string): void;
        public cancel(param0: string): void;
        public cancelAll(): void;
        public pauseAll(): void;
        public start(param0: string): void;
        public pause(param0: string): void;
        public static init(param0: androidcontentContext): void;
        public cleanUp(): void;
      }
    }
  }
}

import androidcontentIntent = android.content.Intent;
import androidosIBinder = android.os.IBinder;
/// <reference path="./android.content.Intent.d.ts" />
/// <reference path="./android.os.IBinder.d.ts" />
/// <reference path="./co.fitcom.fancydownloader.Request.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
declare namespace co {
  export namespace fitcom {
    export namespace fancydownloader {
      export class ManagerService {
        public create(param0: co.fitcom.fancydownloader.Request): string;
        public onStartCommand(
          param0: androidcontentIntent,
          param1: number,
          param2: number
        ): number;
        public resume(param0: string): void;
        public onBind(param0: androidcontentIntent): androidosIBinder;
        public cancel(param0: string): void;
        public cancelAll(): void;
        public pauseAll(): void;
        public generateId(): string;
        public start(param0: string): void;
        public pause(param0: string): void;
        public cleanUp(): void;
        public constructor();
      }
      export namespace ManagerService {
        export class ManagerBinder {}
      }
    }
  }
}

import javautilHashMap = java.util.HashMap;
/// <reference path="./co.fitcom.fancydownloader.DownloadListener.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./java.util.HashMap.d.ts" />
declare namespace co {
  export namespace fitcom {
    export namespace fancydownloader {
      export class Request {
        public addHeader(param0: string, param1: string): void;
        public getFileName(): string;
        public setListener(
          param0: co.fitcom.fancydownloader.DownloadListener
        ): void;
        public constructor(
          param0: string,
          param1: javautilHashMap<any, any>,
          param2: co.fitcom.fancydownloader.DownloadListener
        );
        public getUrl(): string;
        public getListener(): co.fitcom.fancydownloader.DownloadListener;
        public removeListener(): void;
        public constructor(param0: string, param1: javautilHashMap<any, any>);
        public constructor(param0: string);
        public getHeaders(): javautilHashMap<any, any>;
        public setFileName(param0: string): void;
        public getFilePath(): string;
        public setFilePath(param0: string): void;
        public setHeaders(param0: javautilHashMap<any, any>): void;
        public setUrl(param0: string): void;
      }
    }
  }
}

import okhttp3Request = okhttp3.Request;
import okhttp3Call = okhttp3.Call;
/// <reference path="./co.fitcom.fancydownloader.Request.d.ts" />
/// <reference path="./okhttp3.Call.d.ts" />
/// <reference path="./okhttp3.Request.d.ts" />
declare namespace co {
  export namespace fitcom {
    export namespace fancydownloader {
      export class Task {
        public getDownloaderRequest(): co.fitcom.fancydownloader.Request;
        public getOkRequest(): okhttp3Request;
        public setCall(param0: okhttp3Call): void;
        public setOkRequest(param0: okhttp3Request): void;
        public getCall(): okhttp3Call;
        public setDownloaderRequest(
          param0: co.fitcom.fancydownloader.Request
        ): void;
      }
    }
  }
}
