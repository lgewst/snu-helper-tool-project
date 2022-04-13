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
        console.log(res.data);
        setConflictList(res.data.conflicts);
      })
      .catch((err) => {
        //TODO how to let user know error
        history.push('/error/');
      });
  };
  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <div className="header">
        <div className="header line">Line</div>
        <div className="header code">Code</div>
        <div className="header id">commit_id</div>
        <div className="header author">author_name</div>
        <div className="header date">date</div>
      </div>
      <ConflictInfo conflictList={conflictList} />
    </div>
  );
};

export default FilePage;
