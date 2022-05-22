import axios from 'axios';
import { useState, useEffect } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';

import PathInfo from '../../Components/PathInfo/PathInfo';
import reinitialize from '../../Components/Reinitialize/Reinitialize';

interface Folder {
  name: string;
  path: string;
}

interface File {
  name: string;
  path: string;
}

const FolderPage = ({ setinit }: { setinit: (e: boolean) => void }) => {
  const [folderList, setFolderList] = useState<Folder[]>([]);
  const [fileList, setFileList] = useState<File[]>([]);
  const history = useHistory();
  const location = useLocation();
  const path: string = location.pathname.slice(6);

  const init = () => {
    axios
      .get('/chromium/dir/', { params: { path: path } })
      .then((res) => {
        setFolderList(res.data.directories);
        setFileList(res.data.files);
      })
      .catch((err) => {
        if (err.response.data.error_code === 10000) {
          reinitialize({ setinit });
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
            <Link className="folder" to={`/path/${folder.path}`} key={folder.name}>
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
