import { Routes as ReactRoutes, Route } from 'react-router-dom';
import { IndexPage } from './pages/Index';

export const Routes = () => {
  return (
    <ReactRoutes>
      <Route path="/" element={<IndexPage />} />
    </ReactRoutes>
  );
};
