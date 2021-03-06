import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Toaster } from 'react-hot-toast';

import App from './App';
import { InitContextProvider } from './Contexts/initContext';
import reportWebVitals from './reportWebVitals';

import './index.css';

ReactDOM.render(
  <StrictMode>
    <InitContextProvider>
      <App />
      <Toaster />
    </InitContextProvider>
  </StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
