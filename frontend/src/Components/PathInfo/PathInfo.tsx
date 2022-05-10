import { useState, useEffect } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';
import './PathInfo.css';

const PathInfo = () => {
  const location = useLocation();
  const path: string = location.pathname.slice(6);
  const eachPath: string[] = path.split('/').filter((p) => p);

  useEffect(() => {}, [location.pathname]);

  return (
    <div className="path">
      <a href="/path/" className="path_name">
        home
      </a>

      {eachPath.map((path, i) => (
        <a
          key={path + i}
          href={'/path/' + eachPath.slice(0, i + 1).join('/')}
          className="path_name"
        >
          {path}
        </a>
      ))}
    </div>
  );
};

export default PathInfo;
