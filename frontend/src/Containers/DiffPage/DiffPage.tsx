import React, { useState, useEffect } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import './DiffPage.css';

interface Dir {
  name: String;
  path: String;
  insertion: number;
  deletion: number;
}

interface File {
  name: String;
  path: String;
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

const DiffPage = () => {
  const [diffList, setDiffList] = useState<Diff>({
    total_insertion: 0,
    total_deletion: 0,
    current_version: '',
    target_version: '',
    directories: [],
    files: [],
  });
  const location = useLocation();
  const history = useHistory();

  const init = () => {
    const path = location.pathname.slice(6);
    axios
      .get('/diff/dir/', { params: { path: path } })
      .then((res) => {
        console.log(res.data);
        //TODO let user know loading
        setDiffList(res.data);
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
  }, [location.pathname]);

  return (
    <div className="diff">
      <div className="summary">
        <div className="version">
          {diffList.current_version} ➔ {diffList.target_version}
        </div>
        <div className="insertion"> +{diffList.total_insertion}</div>
        <div className="deletion"> - {diffList.total_deletion}</div>
      </div>
      <br />
      <div className="diff_header">
        <div className="diff_name">name</div>
        <div className="insertion">insertion</div>
        <div className="deletion">deletion</div>
      </div>
      <div>
        {diffList.directories.map((dir, i) => (
          <div className="diff_dir" key={i}>
            <Link className="dirname" to={`/diff/${dir.path}`} key={i}>
              {dir.name}
              <br />
            </Link>
            <div className="insertion">+{dir.insertion}</div>
            <div className="deletion">-{dir.deletion}</div>
          </div>
        ))}
      </div>
      <div>
        {diffList.files.map((file, i) => (
          <div className="diff_file" key={i}>
            <div className="filename">{file.name}</div>
            <div className="insertion">+{file.insertion}</div>
            <div className="deletion">-{file.deletion}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiffPage;
