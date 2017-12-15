import * as platform from 'tns-core-modules/platform';

function downloadFile(msg) {}

(<any>global).onmessage = (msg: MessageEvent) => {
  switch (msg.data.action) {
    case 'download':
      downloadFile(msg);
      break;
  }
};
