const fs = require('fs').promises;
const { Octokit } = require("@octokit/rest");
const Axios = require('axios');
const extract = require('extract-zip');
const path = require('path');

const octokit = new Octokit();

(async () => {
  try {
    console.log('* getting latest Obs');
    console.log('** getting latest Obs release');
    let releaseObs = await octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
      owner: 'obsproject',
      repo: 'obs-studio'
    });
    console.log('** getting latest Obs release zip url');
    let downloadOBSUrl = releaseObs.data.assets.find(item => item.browser_download_url.endsWith('-Full-x64.zip')).browser_download_url;
    console.log('** getting latest Obs release zip');
    await downloadFile(downloadOBSUrl, './scripts/latest-obs.zip');
    console.log('** unzip and move Obs release');
    await extract('./scripts/latest-obs.zip', { dir: path.join(__dirname, '../assets/bin/obs') });
    console.log('** latest Obs release OK!');
    console.log('* getting latest Obs Websocket');
    console.log('** getting latest Obs Websocket release');
    let releaseObsWebsocket = await octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
      owner: 'Palakis',
      repo: 'obs-websocket'
    });
    console.log('** getting latest Obs Websocket release zip url');
    let downloadOBSWebsocketUrl = releaseObsWebsocket.data.assets.find(item => item.browser_download_url.endsWith('-Windows.zip')).browser_download_url;
    console.log('** getting latest Obs Websocket release zip');
    await downloadFile(downloadOBSWebsocketUrl, './scripts/latest-obs-websocket.zip');
    console.log('** unzip and move Obs Websocket release');
    await extract('./scripts/latest-obs-websocket.zip', { dir: path.join(__dirname, '../assets/bin/obs') });
    console.log('** latest Obs Websocket release OK!');
    console.log('* getting latest Obs Replay');
    console.log('** getting latest Obs Replay release');
    let releaseObsReplay = await octokit.request('GET /repos/{owner}/{repo}/actions/artifacts', {
      owner: 'exeldro',
      repo: 'obs-replay-source'
    });
    console.log('** getting latest Obs Replay release zip url');
    let downloadOBSReplayUrl = releaseObsReplay.data.artifacts.sort((a, b) => b.id - a.id).slice(0, 5).find(item => item.name.endsWith('-win64.zip')).archive_download_url;
    console.log('** getting latest Obs Replay release zip');
    await downloadFile(downloadOBSReplayUrl, './scripts/latest-obs-replay.zip');
    console.log('** unzip and move Obs Replay release');
    await extract('./scripts/latest-obs-replay.zip', { dir: path.join(__dirname, '../assets/bin/obs') });
    console.log('** latest Obs Replay release OK!');
    console.log('* Cleaning files');
    await fs.unlink('./scripts/latest-obs.zip');
    await fs.unlink('./scripts/latest-obs-websocket.zip');
    await fs.unlink('./scripts/latest-obs-replay.zip');
    console.log('* Cleaning files OK!');
  } catch (error) {
    console.error(error)
  }
})();

async function downloadFile(url, dest) {
  try {
    const response = await Axios({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer'
    });
    await fs.writeFile(dest, response.data);
    return;
  } catch (error) {
    throw error;
  }
}
