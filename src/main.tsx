import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { App } from '@app/index';
import '@app/styles/index.css';

import { RootElementClassNames, RootElementId } from '@shared/config/constants';
import { reportWebVitals } from '@shared/lib/report-web-vitals';

const rootElement =
  document.querySelector(`#${RootElementId}`) ??
  ((): HTMLDivElement => {
    const element = document.createElement('div');
    element.id = RootElementId;
    element.className = RootElementClassNames;
    document.body.append(element);
    return element;
  })();
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
