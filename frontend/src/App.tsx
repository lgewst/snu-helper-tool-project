import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import DiffPage from './Containers/DiffPage/DiffPage';
import ErrorPage from './Containers/ErrorPage/ErrorPage';
import FilePage from './Containers/FilePage/FilePage';
import FolderPage from './Containers/FolderPage/FolderPage';
import InitPage from './Containers/InitPage/InitPage';

function App() {
  const [initialized, setinit] = useState<boolean>(false);

  useEffect(() => {
    const localinit = localStorage.getItem('initialized');
    const init = localinit ? true : false;
    setinit(init);
  }, []);

  return (
    <div className="App">
      {initialized ? (
        <BrowserRouter>
          <Switch>
            <Route
              path="/path"
              render={() => <FolderPage setinit={setinit} />}
            />
            <Route path="/file" render={() => <FilePage setinit={setinit} />} />
            <Route path="/error" render={() => <ErrorPage />} />
            <Route path="/diff" render={() => <DiffPage />} />
            <Redirect from="/" to="/path" />
          </Switch>
        </BrowserRouter>
      ) : (
        <BrowserRouter>
          <Switch>
            <Route
              path="/init"
              exact
              render={() => <InitPage setinit={setinit} />}
            />
            <Redirect from="/" to="/init" />
          </Switch>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
