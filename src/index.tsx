import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from 'app/providers/store';
import { ErrorBoundary } from 'app/providers/error-boundary';
import { App } from './app';
import { cfg } from 'app/config';
import { __devLog } from 'shared/lib/tests/__dev-log';
import 'regenerator-runtime/runtime';

/* eslint-disable-next-line no-console */
console.log(`Version: ${cfg.VERSION}\nRelease: ${cfg.ASSEMBLY_DATE}`);
__devLog('index', 'Status: ', cfg.IS_DEV ? 'OFFLINE' : 'ONLINE');


const container = document.getElementById('root');

if (! container) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(container);


root.render(
  <BrowserRouter>
    <StoreProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StoreProvider>
  </BrowserRouter>
);



// git add . && git commit -m "started ArticlesListPage" && git push -u origin main
