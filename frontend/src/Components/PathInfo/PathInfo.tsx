import { useLocation, Link } from 'react-router-dom';
import './PathInfo.css';

const PathInfo = () => {
  const location = useLocation();
  const path: string = location.pathname.slice(6);
  const eachPath: string[] = path.split('/').filter((p) => p);

  return (
    <div className="path">
      <Link to="/path/" className="path_name">
        home
      </Link>

      {eachPath.map((path, i) => {
        const isFolder = i !== eachPath.length - 1;
        const to = (isFolder ? '/path/' : '/file/') + eachPath.slice(0, i + 1).join('/');

        return (
          <Link key={to} to={to} className="path_name">
            {path}
          </Link>
        );
      })}
    </div>
  );
};

export default PathInfo;
