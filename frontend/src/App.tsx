import './App.css';
import FolderPage from './Containers/FolderPage/FolderPage';
import FilePage from './Containers/FilePage/FilePage';
import ErrorPage from './Containers/ErrorPage/ErrorPage';

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import InitPage from './Containers/InitPage/InitPage';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [initialized, setinit] = useState<boolean>();

  useEffect(() => {
    axios.get('/chromium/file/').catch((err) => {
      if (err.response.data.error_code === 10000) {
        localStorage.setItem('initialized', 'false');
        setinit(false);
      }
    });
    const localinit = localStorage.getItem('initialized');
    const init = localinit === 'true' ? true : false;
    setinit(init);
  }, []);

  if (initialized === undefined) return null;

  return (
    <div className="App">
      {initialized ? (
        <BrowserRouter>
          <Switch>
            <Route path="/path" render={() => <FolderPage />} />
            <Route path="/file" render={() => <FilePage />} />
            <Route path="/error" render={() => <ErrorPage />} />
            <Redirect from="/" to="/path" />
          </Switch>
        </BrowserRouter>
      ) : (
        <BrowserRouter>
          <Switch>
            <Route
              path="/init"
              exact
              render={() => (
                <InitPage initialized={initialized} setinit={setinit} />
              )}
            />
            <Redirect from="/" to="/init" />
          </Switch>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
