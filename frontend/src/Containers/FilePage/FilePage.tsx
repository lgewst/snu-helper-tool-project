import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import ConflictInfo from '../../Components/ConflictInfo/ConflictInfo';

const FilePage = () => {
  const [conflictList, setConflictList] = useState([]);
  const location = useLocation();

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
        console.log(err.response.data.message);
        //TODO history.push('/error/'); //redirects but does not refresh
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
