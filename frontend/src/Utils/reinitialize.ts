import axios from 'axios';
import { toast } from 'react-hot-toast';

import { StorageKey } from './storageKey';

/**
 * @param setInit setter function of init state
 */
const reinitialize = (setInit: (e: boolean) => void) => {
  if (
    localStorage.getItem(StorageKey.CHROMIUM_REPO) != null &&
    localStorage.getItem(StorageKey.CURRENT_VERSION) != null &&
    localStorage.getItem(StorageKey.TARGET_VERSION) != null &&
    localStorage.getItem(StorageKey.WEBOSOSE_REPO) != null
  ) {
    axios
      .get('/chromium/init', {
        params: {
          chromium_repo: localStorage.getItem(StorageKey.CHROMIUM_REPO),
          webosose_repo: localStorage.getItem(StorageKey.WEBOSOSE_REPO),
          current_version: localStorage.getItem(StorageKey.CURRENT_VERSION),
          target_version: localStorage.getItem(StorageKey.TARGET_VERSION),
        },
      })
      .then((res) => {
        toast.error(res.data.message);
      });
  } else {
    toast.error('nothing on local storage');
    setInit(false);
  }
};

export default reinitialize;
