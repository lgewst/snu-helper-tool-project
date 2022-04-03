import './App.css';
import Foldername from './Components/FolderName/FolderName';
import Path from './Components/Path/Path';
import ConflictInfo from './Components/ConflictInfo/ConflictInfo';

function App() {
  return (
    <div className="App">
      <Path></Path>
      <Foldername></Foldername>
      <ConflictInfo></ConflictInfo>
    </div>
  );
}

export default App;
