import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import ConflictInfo from '../../Components/ConflictInfo/ConflictInfo';

const FilePage = () => {
  const [conflictList, setConflictList] = useState([]);
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
      <ConflictInfo conflictList={conflictList} />
    </div>
  );
};

export default FilePage;
