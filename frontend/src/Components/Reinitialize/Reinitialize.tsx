import axios from 'axios';

import { useHistory } from 'react-router-dom';

interface Init {
  chromium_repo: string;
  webosose_repo: string;
  current_version: string;
  target_version: string;
}

const reinitialize = ({ setinit }: { setinit: (e: boolean) => void }) => {
  //const history = useHistory();
  if (
    localStorage.getItem('chromium_repo') != null &&
    localStorage.getItem('webosose_repo') != null &&
    localStorage.getItem('current_version') != null &&
    localStorage.getItem('target_version') != null
  ) {
    axios
      .get('/chromium/init', {
        params: {
          chromium_repo: localStorage.getItem('chromium_repo'),
          webosose_repo: localStorage.getItem('webosose_repo'),
          current_version: localStorage.getItem('current_version'),
          target_version: localStorage.getItem('target_version'),
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
