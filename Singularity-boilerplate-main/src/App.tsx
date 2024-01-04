import { Dashboard } from './Dashboard';
import * as SnetSDK from 'snet-sdk';


import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate
} from "react-router-dom";
import { SponsoredGasExample } from './examples/SponsoredGasExample';
import { BatchExample } from './examples/BatchExample';


const links = [
  { path: '/gas-free', label: 'Pay Gas for Users', element: <SponsoredGasExample /> },
  { path: '/service', label: 'AI Services', element: <BatchExample /> },
];

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard children={<Outlet />}
      links={links} />,
    errorElement: <Navigate to={'/'} replace />,
    children: [
      {
        index: true,
        element: <Navigate to={links[0].path} replace />
      },
      ...links
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />
}

export default App;
