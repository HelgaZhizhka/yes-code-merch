import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import '@app/styles/index.css';
import { TanStackQueryProvider } from '@shared/api/tanstack-query';
import { reportWebVitals } from '@shared/lib/utils';
import { router } from '@shared/routing';

const rootElement = document.querySelector('#app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <TanStackQueryProvider.Provider>
        <RouterProvider router={router} />
      </TanStackQueryProvider.Provider>
    </StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
