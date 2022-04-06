import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';

const FilePage = () => {
  const [conflictList, setConflictList] = useState([]);
  const history = useHistory();
  const location = useLocation();

  const init = async () => {
    const path = location.pathname.slice(5);
    console.log(typeof location.pathname, 'filepath', path);

    const response = axios
      .get('/chromium/file/', { params: { path: path } })
      .then((res) => {
        console.log(res.data);
        setConflictList(res.data.conflicts);
      })
      .catch((err) => {
        console.log(err.response.data.message);
        //history.push('/error/'); //redirects but does not refresh
      });
  };
  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <div className="fileList">
        {conflictList.map((conflict) => (
          <div></div>
        ))}
      </div>
    </div>
  );
};

export default FilePage;
