import { functions as log } from 'electron-log';
import Main from './Components/App';

// Here we go!
log.info('%c[STARTUP] Starting app', 'color: blue');
try {
  let main = new Main();
  main.init();
} catch (error) {
  console.log('error at startup !');
}