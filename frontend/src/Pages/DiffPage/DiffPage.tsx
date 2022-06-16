import { InsertDriveFile } from '@mui/icons-material';
import FolderIcon from '@mui/icons-material/Folder';
import { CircularProgress, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import axios from 'axios';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLocation, NavLink } from 'react-router-dom';
import './DiffPage.css';

interface Dir {
  name: string;
  path: string;
  insertion: number;
  deletion: number;
}

interface File {
  name: string;
  path: string;
  insertion: number;
  deletion: number;
}

interface Diff {
  total_insertion: number;
  total_deletion: number;
  current_version: string;
  target_version: string;
  directories: Dir[];
  files: File[];
}
const listItemStyle = {
  padding: 0,
  paddingLeft: '20px',
  transition: '0.2s',

  ':hover': {
    backgroundColor: '#f0f0f0',
  },
};

const DiffPage = () => {
  const [diffList, setDiffList] = useState<Diff>();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const init = () => {
    const path = location.pathname.slice(6);
    axios
      .get('/diff/dir/', { params: { path: path } })
      .then((res) => {
        console.log(res.data);
        setDiffList(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.response.data.error_code === 10004) {
          toast.error('invalid path');
        }
      });
  };
  useEffect(() => {
    init();
  }, [location.pathname]);

  return isLoading ? (
    <CircularProgress sx={{ position: 'fixed', left: 'calc(50vw - 30px)', top: 100 }} />
  ) : (
    <div className="diff">
      <div className="summary">
        <div className="version">
          Version: {diffList?.current_version} ➔ {diffList?.target_version}
        </div>
        <div className="insertion"> +{diffList?.total_insertion}</div>
        <div className="deletion"> - {diffList?.total_deletion}</div>
      </div>
      <br />
      <div className="diff_header">
        <div className="diff_name">name</div>
        <div className="insertion">insertion</div>
        <div className="deletion">deletion</div>
      </div>
      <div>
        {diffList?.directories.map((dir) => (
          <ListItem key={dir.name} sx={listItemStyle}>
            <div className="dirname">
              <ListItemAvatar>
                <FolderIcon />
              </ListItemAvatar>
              <ListItemText>
                <NavLink to={`/diff/${dir.path}`}>{dir.name}</NavLink>
              </ListItemText>
            </div>
            <div className="insertion">+{dir.insertion}</div>
            <div className="deletion">-{dir.deletion}</div>
          </ListItem>
        ))}
      </div>
      <div>
        {diffList?.files.map((file) => (
          <ListItem key={file.name} sx={listItemStyle}>
            <div className="dirname">
              <ListItemAvatar>
                <InsertDriveFile />
              </ListItemAvatar>
              <ListItemText>{file.name}</ListItemText>
            </div>
            <div className="insertion">+{file.insertion}</div>
            <div className="deletion">-{file.deletion}</div>
          </ListItem>
        ))}
      </div>
    </div>
  );
};

export default DiffPage;
