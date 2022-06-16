import { InsertDriveFile } from '@mui/icons-material';
import FolderIcon from '@mui/icons-material/Folder';
import { Button, List, ListItem, ListItemAvatar, ListItemText, ListSubheader } from '@mui/material';
import axios from 'axios';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLocation, NavLink, useHistory } from 'react-router-dom';

import PathInfo from '../../Components/PathInfo/PathInfo';
import { useInitContext } from '../../Contexts/initContext';

import './FolderPage.css';

interface Folder {
  name: string;
  path: string;
}

interface File {
  name: string;
  path: string;
}

const FolderPage = () => {
  const { reinitialize } = useInitContext();
  const [folderList, setFolderList] = useState<Folder[]>([]);
  const [fileList, setFileList] = useState<File[]>([]);
  const location = useLocation();
  const path = location.pathname.slice(6);
  const history = useHistory();

  const init = () => {
    axios
      .get('/chromium/dir/', { params: { path: path } })
      .then((res) => {
        setFolderList(res.data.directories);
        setFileList(res.data.files);
      })
      .catch((err) => {
        if (err.response.data.error_code === 10000) {
          reinitialize();
        }
        //TODO how to let user know error
        else {
          toast.error('error');
        }
      });
  };
  useEffect(() => {
    init();
  }, [location.pathname]);

  const listItemStyle = {
    padding: 0,
    paddingLeft: '20px',
    transition: '0.2s',

    ':hover': {
      backgroundColor: '#f0f0f0',
    },
  };

  return (
    <div className="wrapper">
      <List
        className="pathlist"
        subheader={
          <ListSubheader component="div">
            {folderList?.length} folders / {fileList?.length} files
            <Button
              variant="contained"
              sx={{ position: 'absolute', right: '10px' }}
              onClick={() => {
                history.push('/diff');
              }}
            >
              Diff page
            </Button>
          </ListSubheader>
        }
        sx={{ bgcolor: 'background.paper' }}
      >
        {folderList.map((folder) => (
          <ListItem key={folder.name} sx={listItemStyle}>
            <ListItemAvatar>
              <FolderIcon />
            </ListItemAvatar>
            <ListItemText>
              <NavLink className="list_item_link folder" to={`/path/${folder.path}`}>
                {folder.name}
              </NavLink>
            </ListItemText>
          </ListItem>
        ))}
        {fileList.map((file) => (
          <ListItem key={file.name} sx={listItemStyle}>
            <ListItemAvatar>
              <InsertDriveFile />
            </ListItemAvatar>
            <ListItemText>
              <NavLink className="list_item_link file" to={`/file/${file.path}`}>
                {file.name}
              </NavLink>
            </ListItemText>
          </ListItem>
        ))}
      </List>

      <PathInfo />
    </div>
  );
};

export default FolderPage;
