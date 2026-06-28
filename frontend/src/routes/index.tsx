import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PATH } from 'app:constants';
import { LazyLoading, ProtectedRoute } from 'components';
import AdminLayout from 'layout';
import routerList from './routes';

const AppRoutes = () => {
  return (
    <Suspense fallback={<LazyLoading />}>
      <Routes>
        <Route path="/" element={<Navigate replace to={PATH.DASHBOARD} />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AdminLayout />}>
            {routerList.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Route>
        </Route>

        <Route path="*" element={<Navigate replace to={PATH.DASHBOARD} />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
