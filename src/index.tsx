import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Bus from './utils/eventBus';
import './assets/styles/base.less';

// @ts-ignore
React.bus = Bus

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// 模块热替换的 API
// @ts-ignore
if (module && module.hot) {
  // @ts-ignore
  module.hot.accept();
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
