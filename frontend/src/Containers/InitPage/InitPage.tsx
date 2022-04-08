import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './InitPage.css';

interface Props {
  initialized: boolean;
  setinit: (e: boolean) => void;
}

const InitPage = ({ initialized, setinit }: Props) => {
  const history = useHistory();
  const [initState, setinitState] = useState({
    chromium_repo: '',
    webosose_repo: '',
    current_version: '',
    target_version: '',
  });

  const { chromium_repo, webosose_repo, current_version, target_version } =
    initState;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setinitState({
      ...initState,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .get('/chromium/init', { params: initState })
      .then((res) => {
        alert(res.data.message);
        setinit(true);
        localStorage.setItem('initialized', 'true');
        // TODO 조ㅛ
        // store data somewhere
        history.push('/path');
      })
      .catch((err) => {
        //TODO how to let user know error
        console.log('err', err);
        alert(err.response.data.message);
      });
  };

  const init = async () => {};

  useEffect(() => {
    init();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="chromium">chromium repo path: </label>
      <input
        type="text"
        id="chromium"
        name="chromium_repo"
        placeholder="ex. /home/seunghan/chromium/src"
        onChange={onChange}
        value={chromium_repo}
      ></input>
      <br />
      <label htmlFor="webosose">webosose repo path: </label>
      <input
        type="text"
        id="webosose"
        name="webosose_repo"
        placeholder="ex. /home/seunghan/chromium91"
        onChange={onChange}
        value={webosose_repo}
      ></input>
      <br />
      <label htmlFor="cur_ver">current version: </label>
      <input
        type="text"
        id="cur_ver"
        name="current_version"
        placeholder="ex. 91.0.4472.0"
        onChange={onChange}
        value={current_version}
      ></input>
      <br />
      <label htmlFor="tar_ver">target version: </label>
      <input
        type="text"
        id="tar_ver"
        name="target_version"
        placeholder="ex. 92.0.4515.0"
        onChange={onChange}
        value={target_version}
      ></input>
      <br />
      <br />
      <input
        type="submit"
        value="Submit"
        disabled={
          !(
            initState.webosose_repo &&
            initState.chromium_repo &&
            initState.target_version &&
            initState.current_version
          )
        }
      />
    </form>
  );
};

export default InitPage;
