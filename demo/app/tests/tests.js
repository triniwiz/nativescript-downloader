var Downloader = require('nativescript-downloader').Downloader;
var downloader;
var downloadId;
var progressDownloadId;
var downloadErrorId;
var downloadPauseResumeId;
var TEST_URL = 'http://ipv4.download.thinkbroadband.com/5MB.zip';
var TEST_URL_PAUSE_RESUME = 'http://ipv4.download.thinkbroadband.com/10MB.zip';
var TEST_URL_PROGRESS = 'https://i.imgur.com/fE9rBvl.gif';
var TEST_URL_ERROR = 'http://ipv4.download.thinkbroadband.com/5 MB.zip';
var pausedProgress;
var types = require('tns-core-modules/utils/types');
describe('download function', function(){
  // Needs timeout to simulate a startup similar to initiating on app launch
  it('starts the download service', function(done) {
    var error;
    try {
      Downloader.init();
    } catch (ex) {
      error = ex;
    } finally {
      setTimeout(function() {
        expect(error).toBeUndefined();
        done();
      }, 3000);
    }
  });

  it('creates a download manager', function() {
    downloader = new Downloader();
    expect(downloader).toBeDefined();
  });

  it('create downloads', function() {
    downloadId = downloader.createDownload({
      url: TEST_URL
    });
    progressDownloadId = downloader.createDownload({ url: TEST_URL_PROGRESS });
    downloadErrorId = downloader.createDownload({ url: TEST_URL_ERROR });
    downloadPauseResumeId = downloader.createDownload({
      url: TEST_URL_PAUSE_RESUME
    });
    expect(downloadId).toBeDefined();
    expect(progressDownloadId).toBeDefined();
    expect(downloadErrorId).toBeDefined();
    expect(downloadPauseResumeId).toBeDefined();
  });

  it('downloads a file and report the progress', function() {
    downloader
      .start(progressDownloadId, function(progress) {
        if (expect(progress.value).toBeGreaterThan(0)) {
          downloader.pause(progressDownloadId);
        }
      })
      .then(function(completed) {})
      .catch(function() {
        fail(`Download with progress failed with error message: ${e.message}`);
      });
  });

  it('downloads a file and report and when it is completed', function() {
    downloader
      .start(downloadId)
      .then(function(completed) {
        expect(completed.path).toBeDefined();
      })
      .catch(function() {
        fail(`Download with completed path failed with error message: ${e.message}`);
      });
  });

  it('pauses a download after 2 seconds then resumes it after 1 second', function() {
    downloader
      .start(downloadPauseResumeId, function(progress) {
        // Pause after 2 seconds
        setTimeout(function() {
          pausedProgress = progress.value;
          downloader.pause(downloadPauseResumeId);
          // Resume after 1 second
          setTimeout(function() {
            downloader.resume(downloadPauseResumeId);
            // Check progress 1 second after resuming
            setTimeout(function() {
              expect(progress.value).toBeGreaterThan(pausedProgress);
            }, 1000);
          }, 1000);
        }, 2000);
      })
      .then(function(completed) {})
      .catch(function(e) {
        fail(`Download with resume failed with error message: ${e.message}`);
      });
  });

});
