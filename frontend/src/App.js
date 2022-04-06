import './App.css';
import Foldername from './Components/FolderName/FolderName';
import Path from './Components/Path/Path';
import ConflictInfo from './Components/ConflictInfo/ConflictInfo';
import FolderPage from './Containers/FolderPage/FolderPage';
import FilePage from './Containers/FilePage/FilePage';
import ErrorPage from './Containers/ErrorPage/ErrorPage';

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import InitPage from './Containers/InitPage/InitPage';
import { useState } from 'react';

function App() {
  const [initialized, setinit] = useState(true);
  console.log('init', initialized);

  return (
    <div className="App">
      {initialized ? (
        <div>
          <BrowserRouter>
            <Switch>
              <Route
                path="/path"
                render={() => <FolderPage title="FolderPage" />}
              />
              <Route
                path="/file"
                render={() => <FilePage title="FilePage" />}
              />
              <Route
                path="/error"
                render={() => <ErrorPage title="ErrorPage" />}
              />
              <Redirect from="/" to="/path" />
            </Switch>
          </BrowserRouter>
        </div>
      ) : (
        <BrowserRouter>
          <Switch>
            <Route
              path="/init"
              exact
              render={() => <InitPage title="InitPage" />}
              initialized={initialized}
              setinit={setinit}
            />
            <Redirect from="/" to="/init" />
          </Switch>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
