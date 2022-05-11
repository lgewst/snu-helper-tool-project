import React, { useState, useEffect } from 'react';
import { useHistory, useLocation, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import PathInfo from '../../Components/PathInfo/PathInfo';

interface Folder {
  name: string;
  path: string;
}

interface File {
  name: string;
  path: string;
}

const FolderPage = () => {
  const [folderList, setFolderList] = useState<Folder[]>([]);
  const [fileList, setFileList] = useState<File[]>([]);
  const history = useHistory();
  const location = useLocation();
  const path: string = location.pathname.slice(6);

  const init = async () => {
    axios
      .get('/chromium/dir/', { params: { path: path } })
      .then((res) => {
        setFolderList(res.data.directories);
        setFileList(res.data.files);
      })
      .catch((err) => {
        if (err.response.data.error_code === 10000) {
          localStorage.setItem('initialized', 'false');
        }
        //TODO how to let user know error
        else history.push('/error/');
      });
  };
  useEffect(() => {
    init();
  }, [location.pathname]);

  return (
    <div className="wrapper">
      <div className="pathlist">
        <div className="folderList">
          {folderList.map((folder) => (
            <Link
              className="folder"
              to={`/path/${folder.path}`}
              key={folder.name}
            >
              {folder.name}
              <br />
            </Link>
          ))}
        </div>
        <div className="fileList">
          {fileList.map((file) => (
            <Link className="file" to={`/file/${file.path}`} key={file.name}>
              {file.name}
              <br />
            </Link>
          ))}
        </div>
      </div>

      <PathInfo></PathInfo>
    </div>
  );
};

export default FolderPage;
