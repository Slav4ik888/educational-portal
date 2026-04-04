import { RouterProvider } from 'react-router-dom';
import { router } from './providers/router/config';



export function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}
