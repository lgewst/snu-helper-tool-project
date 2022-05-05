import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import ConflictInfo from '../../Components/ConflictInfo/ConflictInfo';
import './Filepage.css';

interface Code {
  line: number;
  content: string;
}
interface Blame {
  commit_id: string;
  commit_url: string;
  review_url: string;
  line_start: number;
  line_end: number;
  author_name: string;
  author_email: string;
  date: string;
}
interface Conflict {
  id: string;
  code: Code[];
  blame: Blame[];
}

const FilePage = () => {
  const [conflictList, setConflictList] = useState<Conflict[]>([]);
  const location = useLocation();
  const history = useHistory();

  const init = () => {
    const path = location.pathname.slice(6);
    console.log(typeof location.pathname, 'filepath', path);

    axios
      .get('/chromium/file/', { params: { path: path } })
      .then((res) => {
        //console.log(res.data);
        //TODO let user know loading
        setConflictList(res.data.conflicts);
      })
      .catch((err) => {
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
    <div className="filepage">
      <div className="header">
        <div className="header line">Line</div>
        <div className="header code">Code</div>
        <div className="header id">commit_id</div>
        <div className="header author">author_email</div>
        <div className="header date">date</div>
      </div>

      {conflictList.map((conflict) => (
        <ConflictInfo conflict={conflict} key={conflict.id} />
      ))}
    </div>
  );
};

export default FilePage;
