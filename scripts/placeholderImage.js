const fs = require('fs').promises;

(async () => {
  try {
    console.log('* Setting placeholder images...');
    console.log('** Copying team image...');
    await fs.copyFile('../assets/appDatas/placeholder_team.png', '../assets/appDatas/home.png');
    await fs.rename('../assets/appDatas/placeholder_team.png', '../assets/appDatas/away.png');
    console.log('** Copying team image OK!');
    console.log('** copying background image...');
    await fs.rename('../assets/appDatas/placeholder_bg.png', '../assets/appDatas/bg.jpg');
    console.log('** Copying background image OK!');
    console.log('* Setting placeholder images OK!');
  } catch (error) {
    console.error(error)
  }
})();
