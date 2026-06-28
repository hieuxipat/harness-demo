import { HomeMajor } from '@shopify/polaris-icons';
import { PATH } from 'app:constants';
import { IRouter } from 'interfaces/route';
import { lazy } from 'react';

const DashboardPage = lazy(() => import('pages/Dashboard'));
const ExamplePage = lazy(() => import('pages/Example'));

const routerList: Array<IRouter> = [
  {
    name: 'Dashboard',
    path: PATH.DASHBOARD,
    element: <DashboardPage />,
    icon: HomeMajor
  },
  {
    name: 'Example',
    path: PATH.EXAMPLE,
    element: <ExamplePage />,
    icon: HomeMajor
  }
];

export default routerList;
