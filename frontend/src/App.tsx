import './App.css';
import FolderPage from './Containers/FolderPage/FolderPage';
import FilePage from './Containers/FilePage/FilePage';
import ErrorPage from './Containers/ErrorPage/ErrorPage';
import DiffPage from './Containers/DiffPage/DiffPage';

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import InitPage from './Containers/InitPage/InitPage';
import { useEffect, useState } from 'react';

function App() {
  const [initialized, setinit] = useState<boolean>(false);
  const init = {
    chromium_repo: '',
    webosose_repo: '',
    current_version: '',
    target_version: '',
  };

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
              render={() => <InitPage initVal={init} setinit={setinit} />}
            />
            <Redirect from="/" to="/init" />
          </Switch>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
