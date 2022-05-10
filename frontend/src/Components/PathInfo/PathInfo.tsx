import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './PathInfo.css';

const PathInfo = () => {
  const [pathRec, setPathRec] = useState<string>('/path/');
  const location = useLocation();
  const path: string = location.pathname.slice(6);
  const eachPath: string[] = path.split('/');
  const realPath: string[] = [];

  const init = () => {
    eachPath.forEach((path) => {
      setPathRec(pathRec + path);
      realPath.push(pathRec + path);
      console.log(pathRec);
    });
  };

  useEffect(() => {
    init();
  }, [location.pathname]);

  return (
    <div className="path">
      <div className="home">
        <a href="/path/">home/</a>
      </div>

      {realPath.forEach((path) => console.log('hi', path))}

      {eachPath.map((pathname, i) => (
        <div className="path_folder" key={i}>
          <Link to={realPath[i]}>
            {i}
            {realPath[i]}
            {pathname}/
          </Link>
        </div>
      ))}
    </div>
  );
};

export default PathInfo;
