import { Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const isAuth = true;

  return isAuth ? <Outlet /> : 'Not Authenticated';
};

export default ProtectedRoute;
