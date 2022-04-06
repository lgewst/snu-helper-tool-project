import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';

const FolderPage = () => {
  const [folderList, setFolderList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const history = useHistory();
  const location = useLocation();

  const init = async () => {
    const path = location.pathname.slice(5);
    console.log(typeof location.pathname, 'path', path);

    const response = axios
      .get('/chromium/dir/', { params: { path: path } })
      .then((res) => {
        console.log(res.data);
        setFolderList(res.data.directories);
        setFileList(res.data.files);
      })
      .catch((err) => {
        console.log(err.response.data.message);
        history.push('/error/'); //redirects but does not refresh
      });
  };
  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <div className="folderList">
        {folderList.map((folder) => (
          <a className="folder" href={'/path/' + folder.path} key={folder.name}>
            {folder.name}
            <br />
          </a>
        ))}
      </div>
      <div className="fileList">
        {fileList.map((file) => (
          <a className="file" href={'/file/' + file.path} key={file.name}>
            {file.name}
            <br />
          </a>
        ))}
      </div>
    </div>
  );
};

export default FolderPage;
