import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getProfileSelector } from '../../services/slices/profileSlice';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyAuth?: boolean;
};

export const ProtectedRoute = ({ onlyAuth = false }: ProtectedRouteProps) => {
  const { user, isAuthChecked } = useSelector(getProfileSelector);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (!onlyAuth && user) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};
