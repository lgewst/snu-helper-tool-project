import axios from 'axios';

import { StorageKey } from '../../Utils/storageKey';

const reinitialize = ({ setinit }: { setinit: (e: boolean) => void }) => {
  //const history = useHistory();
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
        alert(res.data.message);
        //history.push('/path');
      });
  } else {
    alert('nothing on local storage');
    setinit(false);
  }
};

export default reinitialize;
