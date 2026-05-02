// src/index.tsx

import { createRoot } from 'react-dom/client';
import { StoreProvider } from 'app/providers/store';
import { ErrorBoundary } from 'app/providers/error-boundary';
import { App } from './app';
import { cfg } from 'app/config';
import { __devLog } from 'shared/lib/tests/__dev-log';
import './index.module.scss';
// @ts-ignore
import './tailwind.css';



/* eslint-disable-next-line no-console */
console.log(`Version: ${cfg.VERSION}\nRelease: ${cfg.ASSEMBLY_DATE}`);
__devLog('index', 'Status: ', cfg.IS_DEV ? 'OFFLINE' : 'ONLINE');


const container = document.getElementById('root');

if (! container) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(container);


root.render(
  <StoreProvider>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StoreProvider>
);



// git add . && git commit -m "refacted RichTextRenderer & added 2 articles" && git push -u origin main
