import './App.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import { useInitContext } from './Contexts/initContext';
import DiffPage from './Pages/DiffPage/DiffPage';
import FilePage from './Pages/FilePage/FilePage';
import FolderPage from './Pages/FolderPage/FolderPage';
import HistoryPage from './Pages/HistoryPage/HistoryPage';
import InitPage from './Pages/InitPage/InitPage';

function App() {
  const { initialized } = useInitContext();

  return (
    <div className="App">
      {initialized ? (
        <BrowserRouter>
          <Switch>
            <Route path="/path" render={() => <FolderPage />} />
            <Route path="/file" render={() => <FilePage />} />
            <Route path="/diff" render={() => <DiffPage />} />
            <Route path="/func" render={() => <HistoryPage />} />
            <Redirect from="/" to="/path" />
          </Switch>
        </BrowserRouter>
      ) : (
        <BrowserRouter>
          <Switch>
            <Route path="/init" exact render={() => <InitPage />} />
            <Redirect from="/" to="/init" />
          </Switch>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
