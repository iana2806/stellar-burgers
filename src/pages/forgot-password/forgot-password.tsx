import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  getProfileSelector,
  forgotPassword
} from '../../services/slices/profileSlice';

import { ForgotPasswordUI } from '@ui-pages';

export const ForgotPassword: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error } = useSelector(getProfileSelector);

  const [email, setEmail] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email) return;

    dispatch(forgotPassword(email))
      .unwrap()
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      })
      .catch((err: string) => {
        console.error('Ошибка восстановления пароля: ', err);
      });
  };

  return (
    <ForgotPasswordUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
