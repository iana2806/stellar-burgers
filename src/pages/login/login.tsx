import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  getProfileSelector,
  loginUser
} from '../../services/slices/profileSlice';

export const Login: FC = () => {
  const dispatch = useDispatch();

  const { user, error } = useSelector(getProfileSelector);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    dispatch(loginUser({ email, password }))
      .unwrap()
      .catch((err: string) => {
        console.error('Ошибка авторизации: ', err);
      });
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
