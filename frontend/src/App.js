import './App.css';
import Foldername from './Components/FolderName/FolderName';
import Path from './Components/Path/Path';
import ConflictInfo from './Components/ConflictInfo/ConflictInfo';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import InitPage from './Containers/InitPage/InitPage';

function App() {
  const init = false;

  return (
    <div className="App">
      {init ? (
        <div>
          <Path></Path>
          <Foldername></Foldername>
          <ConflictInfo></ConflictInfo>
        </div>
      ) : (
        <BrowserRouter>
          <Switch>
            <Route
              path="/init"
              exact
              render={() => <InitPage title="InitPage" />}
            />
          </Switch>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
