import { CircularProgress } from '@mui/material';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import ConflictInfo from '../../Components/ConflictInfo/ConflictInfo';
import PathInfo from '../../Components/PathInfo/PathInfo';
import reinitialize from '../../Utils/reinitialize';

import './Filepage.css';

interface Code {
  line: number;
  content: string;
  function: string;
}
interface Blame {
  commit_id: string;
  commit_url: string;
  review_url: string;
  author_url: string;
  line_start: number;
  line_end: number;
  author_name: string;
  author_email: string;
  date: string;
  commit_msg: {
    detail: string;
    release: string;
  };
}
interface Conflict {
  id: string;
  code: Code[];
  blame: Blame[];
}

const FilePage = ({ setinit }: { setinit: (e: boolean) => void }) => {
  const [conflictList, setConflictList] = useState<Conflict[]>();
  const location = useLocation();
  const history = useHistory();

  const init = () => {
    const path = location.pathname.slice(6);

    axios
      .get('/chromium/file/', { params: { path: path } })
      .then((res) => setConflictList(res.data.conflicts))
      .catch((err) => {
        if (err.response.data.error_code === 10000) {
          reinitialize({ setinit });
        }
        if (err.response.data.error_code === 10004) {
          alert('invalid path');
          history.push('/error/');
        }
      });
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="wrapper">
      <div className="filepage">
        <div className="header">
          <div className="header line">Line</div>
          <div className="header code">Code</div>
          <div className="header id"> </div>
          <div className="header author">author_email</div>
          <div className="header date">commit_date</div>
          <div className="header msg"> commit_msg</div>
        </div>

        {conflictList?.map((conflict) => (
          <ConflictInfo conflict={conflict} key={conflict.id} />
        )) ?? <CircularProgress sx={{ position: 'fixed', left: 'calc(50vw - 30px)', top: 100 }} />}
      </div>
      <PathInfo></PathInfo>
    </div>
  );
};

export default FilePage;
