import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getProfileSelector } from '../../services/slices/profileSlice';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyAuth?: boolean;
};

export const ProtectedRoute = ({ onlyAuth = false }: ProtectedRouteProps) => {
  const { user, isAuthChecked } = useSelector(getProfileSelector);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyAuth && !user) {
    return <Navigate to='/login' replace />;
  }

  if (!onlyAuth && user) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};
