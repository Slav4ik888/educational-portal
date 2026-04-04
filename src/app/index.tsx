import { RouterProvider } from 'react-router-dom';
import { router } from './providers/router/config';
import './app.scss';



export function App() {
  return (
    <div className='app'>
      <RouterProvider router={router} />
    </div>
  );
}
