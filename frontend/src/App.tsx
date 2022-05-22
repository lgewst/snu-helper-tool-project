import './App.css';
import { useState } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import DiffPage from './Pages/DiffPage/DiffPage';
import ErrorPage from './Pages/ErrorPage/ErrorPage';
import FilePage from './Pages/FilePage/FilePage';
import FolderPage from './Pages/FolderPage/FolderPage';
import InitPage from './Pages/InitPage/InitPage';
import { StorageKey } from './Utils/storageKey';

function App() {
  const [initialized, setinit] = useState<boolean>(
    !!localStorage.getItem(StorageKey.CURRENT_VERSION),
  );

  return (
    <div className="App">
      {initialized ? (
        <BrowserRouter>
          <Switch>
            <Route path="/path" render={() => <FolderPage setinit={setinit} />} />
            <Route path="/file" render={() => <FilePage setinit={setinit} />} />
            <Route path="/error" render={() => <ErrorPage />} />
            <Route path="/diff" render={() => <DiffPage />} />
            <Redirect from="/" to="/path" />
          </Switch>
        </BrowserRouter>
      ) : (
        <BrowserRouter>
          <Switch>
            <Route path="/init" exact render={() => <InitPage setinit={setinit} />} />
            <Redirect from="/" to="/init" />
          </Switch>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
