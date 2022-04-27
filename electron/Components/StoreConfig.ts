import Store from 'electron-store';
import { StoreType, GetDefaultConfig } from "../../src/Models";

const StoreConfig: Store<StoreType> = new Store<StoreType>({
  defaults: GetDefaultConfig(),
	migrations: {
		// '0.0.1': store => {
		// 	store.set('debugPhase', true);
		// },
		// '1.0.0': store => {
		// 	store.delete('debugPhase');
		// 	store.set('phase', '1.0.0');
		// },
		// '1.0.2': store => {
		// 	store.set('phase', '1.0.2');
		// },
		'2.1.0': store => {
			store.set('AudioHardware', []);
      store.set('CamerasHardware', [
        {
          title: 'Field',
          active: true,
          deviceid: 'OBS Virtual Camera:'
        }
      ]);
		}
	}
});

export default StoreConfig;