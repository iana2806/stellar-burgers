import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getProfileSelector } from '../../services/slices/profileSlice';

export const AppHeader: FC = () => {
  const { user } = useSelector(getProfileSelector);

  return <AppHeaderUI userName={user?.name || ''} />;
};
