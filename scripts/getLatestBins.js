const fs = require('fs').promises;
const { Octokit } = require("@octokit/rest");
const { createActionAuth } = require("@octokit/auth-action");
const Axios = require('axios');
const extract = require('extract-zip');
const path = require('path');
const isCI = require('is-ci');

(async () => {
  try {
    let authentication;
    if(isCI) { 
      const auth = createActionAuth();
      authentication = await auth();
    }
    else { 
      authentication = { token: process.env.GH_TOKEN };
    }
    const octokit = new Octokit({
      auth: authentication.token,
    });

    // OBS
    console.log('* getting latest Obs');
    console.log('** getting latest Obs release');
    let releaseObs = await octokit.request('GET /repos/{owner}/{repo}/releases/tags/{tag}', {
      owner: 'obsproject',
      repo: 'obs-studio',
      tag: '27.2.4',
    });
    console.log('** getting latest Obs release zip url');
    let downloadOBSUrl = releaseObs.data.assets.find(item => item.browser_download_url.endsWith('-Full-x64.zip')).browser_download_url;
    console.log('** getting latest Obs release zip');
    await downloadFile(downloadOBSUrl, path.join(__dirname, './latest-obs.zip'));
    console.log('** unzip and move Obs release');
    await extract(path.join(__dirname, './latest-obs.zip'), { dir: path.join(__dirname, '../assets/bin/obs') });
    console.log('** latest Obs release OK!');
    console.log('* getting latest Obs Websocket');
    console.log('** getting latest Obs Websocket release');

    // Obs websocket plugin
    let releaseObsWebsocket = await octokit.request('GET /repos/{owner}/{repo}/releases/tags/{tag}', {
      owner: 'obsproject',
      repo: 'obs-websocket',
      tag: '5.0.0-beta1'
    });
    console.log('** getting latest Obs Websocket release zip url');
    let downloadOBSWebsocketUrl = releaseObsWebsocket.data.assets.find(item => (item.browser_download_url.endsWith('-Windows.zip') && !item.browser_download_url.includes('compat'))).browser_download_url;
    console.log('** getting latest Obs Websocket release zip');
    await downloadFile(downloadOBSWebsocketUrl, path.join(__dirname, './latest-obs-websocket.zip'));
    console.log('** unzip and move Obs Websocket release');
    await extract(path.join(__dirname, './latest-obs-websocket.zip'), { dir: path.join(__dirname, '../assets/bin/obs') });
    console.log('** v' + releaseObsWebsocket.data.tag_name + ' Obs Websocket release OK!');

    // Obs Replay plugin
    console.log('* getting latest Obs Replay');
    console.log('** getting latest Obs Replay release');
    let latestReleaseTagObsReplay = await octokit.request('GET /repos/{owner}/{repo}/releases/tags/{tag}', {
      owner: 'exeldro',
      repo: 'obs-replay-source',
      tag: '1.6.10'
    });    
    let latestReleaseTagObsReplayw = await octokit.request('GET /repos/{owner}/{repo}/git/ref/tags/{tag_name}', {
      owner: 'exeldro',
      repo: 'obs-replay-source',
      tag_name: latestReleaseTagObsReplay.data.tag_name
    });
    let ref;
    if(latestReleaseTagObsReplayw.data.object.type === 'commit') {
      ref = latestReleaseTagObsReplayw.data.object.sha
    } 
    // else {
    //   ref = await octokit.request('GET /repos/{owner}/{repo}/git/tags/{tag_sha}', {
    //     owner: 'exeldro',
    //     repo: 'obs-replay-source',
    //     tag_sha: latestReleaseTagObsReplayw.data.object.sha
    //   });
    // }
    let commit = await octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', {
      owner: 'exeldro',
      repo: 'obs-replay-source',
      ref
    })
    let releaseObsReplay = await octokit.request('GET /repos/{owner}/{repo}/actions/artifacts', {
      owner: 'exeldro',
      repo: 'obs-replay-source'
    });
    console.log('** getting latest Obs Replay release zip url');
    let latestReleaseObsReplay = releaseObsReplay.data.artifacts.sort((a, b) => b.id - a.id).slice(0, 3).find(artifact => artifact.name.endsWith(`${commit.data.sha}-windows`));
    // .sort((a, b) => b.id - a.id).slice(0, 3).find(item => item.name.endsWith('-windows'));
    console.log('** getting latest Obs Replay release zip');
    let latestReleaseObsReplayZip = await octokit.request('GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}', {
      owner: 'exeldro',
      repo: 'obs-replay-source',
      artifact_id: latestReleaseObsReplay.id,
      archive_format: 'zip'
    });
    await fs.writeFile(path.join(__dirname, './latest-obs-replay.zip'), Buffer.from(latestReleaseObsReplayZip.data));
    console.log('** unzip and move Obs Replay release');
    await extract(path.join(__dirname, './latest-obs-replay.zip'), { dir: path.join(__dirname, '../assets/bin/obs') });
    console.log('** latest Obs Replay release OK!');
    console.log('* Cleaning files');
    await fs.unlink(path.join(__dirname, './latest-obs.zip'));
    await fs.unlink(path.join(__dirname, './latest-obs-websocket.zip'));
    await fs.unlink(path.join(__dirname, './latest-obs-replay.zip'));
    console.log('* Cleaning files OK!');
    console.log('-------------------------------------------------------');
    console.log('-------------------------------------------------------');
    console.log('          Obs : v' + releaseObs.data.tag_name);
    console.log('          Obs websocket : v' + releaseObsWebsocket.data.tag_name);
    console.log('          Obs replay source : v' + latestReleaseTagObsReplay.data.tag_name);
    console.log('-------------------------------------------------------');
    console.log('-------------------------------------------------------');
  } catch (error) {
    console.error(error);
    process.exit(1);
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
