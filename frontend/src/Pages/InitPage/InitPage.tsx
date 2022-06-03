import { Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { get } from 'lodash';
import { ChangeEvent, FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';

import { useInitContext } from '../../Contexts/initContext';
import { StorageKey } from '../../Utils/storageKey';
import './InitPage.css';

const InitPage = () => {
  const history = useHistory();
  const { setInit } = useInitContext();
  const [isLoading, setIsLoading] = useState(false);
  const [initState, setinitState] = useState({
    chromium_repo: '',
    webosose_repo: '',
    current_version: '',
    target_version: '',
    webosose_patchId: '',
  });

  const { chromium_repo, webosose_repo, current_version, target_version, webosose_patchId } =
    initState;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setinitState({
      ...initState,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const { data } = await axios.get<{ message: 'initialized!' }>('/chromium/init', {
        params: initState,
      });

      toast.success(data.message);
      localStorage.setItem(StorageKey.CHROMIUM_REPO, initState.chromium_repo);
      localStorage.setItem(StorageKey.WEBOSOSE_REPO, initState.webosose_repo);
      localStorage.setItem(StorageKey.CURRENT_VERSION, initState.current_version);
      localStorage.setItem(StorageKey.TARGET_VERSION, initState.target_version);
      localStorage.setItem(StorageKey.WEBOSOSE_PATCHID, initState.webosose_patchId);
      setInit(true);

      history.push('/path');
    } catch (err) {
      const message = get(err, ['response', 'data', 'message'], '오류가 발생했습니다.');
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const textFieldProps = {
    className: 'input',
    size: 'small',
    variant: 'outlined',
    type: 'text',
    onChange,
  } as const;

  return (
    <form className="form" onSubmit={handleSubmit}>
      <Typography variant="h4">Init</Typography>
      <TextField
        label="chromium repo path"
        id="chromium"
        name="chromium_repo"
        placeholder="ex. /home/seunghan/chromium/src"
        value={chromium_repo}
        {...textFieldProps}
      />
      <TextField
        label="webosose repo path"
        id="webosose"
        name="webosose_repo"
        placeholder="ex. /home/seunghan/chromium91"
        value={webosose_repo}
        {...textFieldProps}
      />
      <TextField
        label="current version"
        id="cur_ver"
        name="current_version"
        placeholder="ex. 91.0.4472.0"
        value={current_version}
        {...textFieldProps}
      />
      <TextField
        label="target version"
        id="tar_ver"
        name="target_version"
        placeholder="ex. 92.0.4515.0"
        value={target_version}
        {...textFieldProps}
      />
      <TextField
        label="webosose patchId"
        id="tar_ver"
        name="webosose_patchId"
        placeholder="ex. 7cef9376f8f6f59d7dc8f572716c1aaf28b3d9b2"
        value={webosose_patchId}
        {...textFieldProps}
      />
      <Button
        className="button"
        type="submit"
        variant="contained"
        disabled={
          !(
            initState.webosose_repo &&
            initState.chromium_repo &&
            initState.target_version &&
            initState.current_version &&
            initState.webosose_patchId
          ) || isLoading
        }
      >
        {!isLoading ? 'submit' : 'loading...'}
      </Button>
    </form>
  );
};

export default InitPage;
