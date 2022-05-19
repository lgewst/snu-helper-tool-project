import axios from 'axios';
import { get } from 'lodash';
import { ChangeEvent, FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';
import './InitPage.css';

const InitPage = ({ setinit }: { setinit: (e: boolean) => void }) => {
  const history = useHistory();
  const [initState, setinitState] = useState({
    chromium_repo: '',
    webosose_repo: '',
    current_version: '',
    target_version: '',
  });

  const { chromium_repo, webosose_repo, current_version, target_version } =
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
      const { data } = await axios.get<{ message: 'initialized!' }>(
        '/chromium/init',
        { params: initState },
      );

      toast.success(data.message);
      localStorage.setItem('chromium_repo', initState.chromium_repo);
      localStorage.setItem('webosose_repo', initState.webosose_repo);
      localStorage.setItem('current_version', initState.current_version);
      localStorage.setItem('target_version', initState.target_version);
      setinit(true);

      history.push('/path');
    } catch (err) {
      const message = get(
        err,
        ['response', 'data', 'message'],
        '오류가 발생했습니다.',
      );
      toast.error(message);
    }
  };

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
      <button
        type="submit"
        disabled={
          !(
            initState.webosose_repo &&
            initState.chromium_repo &&
            initState.target_version &&
            initState.current_version
          )
        }
      >submit</button>
    </form>
  );
};

export default InitPage;
