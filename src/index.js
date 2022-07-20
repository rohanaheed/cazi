import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
//import ReactNotification from "react-notifications-component";
import { MetamaskStateProvider } from "use-metamask";
//import 'react-notifications-component/dist/theme.css'
import { getLibrary } from "./provider.js";
import { Web3ReactProvider } from "@web3-react/core";
ReactDOM.render(
     <Web3ReactProvider getLibrary={getLibrary}>
        <BrowserRouter>
        {/* <HashRouter> */}
          {/* <ReactNotification /> */}
          <MetamaskStateProvider>
            <App />
          </MetamaskStateProvider>
        {/* </HashRouter> */}
        </BrowserRouter>
    </Web3ReactProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
