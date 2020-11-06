const fs = require('fs').promises;
const path = require('path');

(async () => {
  try {
    console.log('* Setting placeholder images...');
    console.log('** Copying team image...');
    await fs.copyFile(path.join(__dirname, '../assets/appDatas/placeholder_team.png'), path.join(__dirname, '../assets/appDatas/home.png'));
    await fs.rename(path.join(__dirname, '../assets/appDatas/placeholder_team.png'), path.join(__dirname, '../assets/appDatas/away.png'));
    console.log('** Copying team image OK!');
    console.log('** copying background image...');
    await fs.rename(path.join(__dirname, '../assets/appDatas/placeholder_bg.png'), path.join(__dirname, '../assets/appDatas/bg.jpg'));
    console.log('** Copying background image OK!');
    console.log('* Setting placeholder images OK!');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
