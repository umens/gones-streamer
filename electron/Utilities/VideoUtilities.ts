import ffmpeg, { setFfmpegPath, setFfprobePath } from 'fluent-ffmpeg';
import { replace } from 'ffmpeg-static';
import { path } from 'ffprobe-static';
import log from 'electron-log';
import isDev from 'electron-is-dev';

// const ffmpegPath = replace(
//   'app.asar',
//   'app.asar.unpacked'
// );
// const ffprobePath = path.replace(
//   'app.asar',
//   'app.asar.unpacked'
// );
// //tell the ffmpeg package where it can find the needed binaries.
// setFfmpegPath(ffmpegPath);
// setFfprobePath(ffprobePath);

class VideoUtilities {

  constructor() {
    if(!isDev) {
      const ffmpegPath = replace(
        'app.asar',
        'app.asar.unpacked'
      );
      const ffprobePath = path.replace(
        'app.asar',
        'app.asar.unpacked'
      );
      // this.ffmpeg = ffmpeg;
      //tell the ffmpeg package where it can find the needed binaries.
      setFfmpegPath(ffmpegPath);
      setFfprobePath(ffprobePath);
    }
    else {
      setFfmpegPath('C:/FFmpeg/bin/ffmpeg.exe');
      setFfprobePath('C:/FFmpeg/bin/ffprobe.exe');
    }
  }

  makeScreenshotsPreview = async ({ mediaPath, screenshotNumber = 5, destPath }: { mediaPath: string, screenshotNumber?: number, destPath: string }): Promise<void> => {
    return new Promise((resolve, reject) => {
      if(mediaPath) {
        let path = mediaPath.split('\\');
        console.log(path)
        let file = path.pop()!;
        console.log(file)
        ffmpeg(mediaPath)
          .on('filenames', function(filenames) {
            log.verbose('[ffmpeg] Will generate ' + filenames.join(', '))
          })
          .on('start', function(commandLine) {
            log.verbose('[ffmpeg] Spawned Ffmpeg with command: ' +commandLine)
          })
          .on('progress', (progress) => {
            log.verbose(`[ffmpeg] ${progress.percent}% done`);
          })
          // .on('stderr', function(stderrLine) {
          //   log.info(`[ffmpeg] Stderr output: ${stderrLine}`);
          //   reject(stderrLine);
          // })
          .on('error', (err) => {
            log.info(`[ffmpeg] error: ${err.message}`);
            reject(err);
          })
          .on('end', () => {
            log.verbose('[ffmpeg] Screenshots taken');
            resolve();
          })
          .screenshots({
            count: screenshotNumber,
            folder: destPath,
            filename: `${file.substr(0,file.lastIndexOf('.'))}_thumb-%i.jpg`,
            size: '246x139'
          });
      }
      else {
        reject('No media');
      }
    });
  }

  getVideoDuration = async (mediaPath?: string): Promise<number> => {
    return new Promise((resolve, reject) => {
      if(mediaPath) {
        ffmpeg.ffprobe(mediaPath, function(err, metadata) {
          if(err) {            
            log.info(`[ffmpeg] error: ${err.message}`);
            reject(err);
          }
          log.verbose(`[ffmpeg] ${JSON.stringify(metadata)}`);
          if(metadata.format.duration) {
            resolve(metadata.format.duration);
          } else {
            reject('[ffmpeg] undefined duration');
          }          
        });
      }
      else {
        reject('No media');
      }
    });
  }

}

export { VideoUtilities };