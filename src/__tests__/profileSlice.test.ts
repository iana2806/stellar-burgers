import { describe, expect, test } from '@jest/globals';
import {
  profileReducer,
  loginUser,
  registerUser,
  logoutUser,
  fetchUser,
  updateUser,
  forgotPassword,
  resetPassword
} from '../services/slices/profileSlice';
import { TUser } from '@utils-types';
import { TLoginData, TRegisterData } from '@api';

describe('profileSlice', () => {
  // начальное состояние
  const initialState = {
    user: null,
    isLoading: false,
    error: null,
    isAuthChecked: false
  };

  // тестовый пользователь
  const testUser: TUser = {
    name: 'Test User',
    email: 'test@test.com'
  };

  // логин
  test('тест на состояние при начале запроса', () => {
    const actualState = profileReducer(
      initialState,
      loginUser.pending('', {
        email: 'test@test.com',
        password: '12345678'
      } as TLoginData)
    );

    expect(actualState).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  test('тест на состояние при успешной авторизации', () => {
    const actualState = profileReducer(
      initialState,
      loginUser.fulfilled(testUser, '', {} as TLoginData)
    );

    expect(actualState).toEqual({
      user: testUser,
      isLoading: false,
      error: null,
      isAuthChecked: true
    });
  });

  test('тест на состояние при ошибке', () => {
    const testError = new Error('Ошибка авторизации');

    const actualState = profileReducer(
      initialState,
      loginUser.rejected(testError, '', {} as TLoginData)
    );

    expect(actualState).toEqual({
      user: null,
      isLoading: false,
      error: 'Ошибка авторизации',
      isAuthChecked: true
    });
  });

  // регистрация
  test('тест на состояние при начале запроса', () => {
    const actualState = profileReducer(
      initialState,
      registerUser.pending('', {} as TRegisterData)
    );

    expect(actualState).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  test('тест на состояние при успешной регистрации', () => {
    const actualState = profileReducer(
      initialState,
      registerUser.fulfilled(testUser, '', {} as TRegisterData)
    );

    expect(actualState).toEqual({
      user: testUser,
      isLoading: false,
      error: null,
      isAuthChecked: true
    });
  });

  test('тест на состояние при ошибке', () => {
    const testError = new Error('Ошибка регистрации');

    const actualState = profileReducer(
      initialState,
      registerUser.rejected(testError, '', {} as any)
    );

    expect(actualState).toEqual({
      user: null,
      isLoading: false,
      error: 'Ошибка регистрации',
      isAuthChecked: true
    });
  });

  // выход из профиля
  test('тест на состояние при начале запроса', () => {
    const actualState = profileReducer(
      initialState,
      logoutUser.pending('', {} as any)
    );

    expect(actualState).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  test('тест на состояние при успешном выходе', () => {
    const actualState = profileReducer(
      { ...initialState, user: testUser },
      logoutUser.fulfilled(undefined, '', {} as any)
    );

    expect(actualState).toEqual({
      user: null,
      isLoading: false,
      error: null,
      isAuthChecked: true
    });
  });

  test('тест на состояние при ошибке', () => {
    const testError = new Error('Ошибка');

    const actualState = profileReducer(
      { ...initialState, user: testUser },
      logoutUser.rejected(testError, '', undefined)
    );

    expect(actualState).toEqual({
      user: null,
      isLoading: false,
      error: null,
      isAuthChecked: true
    });
  });

  // получение данных
  test('тест на состояние при начале запроса', () => {
    const actualState = profileReducer(
      initialState,
      fetchUser.pending('', {} as any)
    );

    expect(actualState).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  test('тест на состояние при успешном получении', () => {
    const actualState = profileReducer(
      initialState,
      fetchUser.fulfilled(testUser, '', {} as any)
    );

    expect(actualState).toEqual({
      user: testUser,
      isLoading: false,
      error: null,
      isAuthChecked: true
    });
  });

  test('тест на состояние при ошибке', () => {
    const testError = new Error('Ошибка загрузки данных');

    const actualState = profileReducer(
      initialState,
      fetchUser.rejected(testError, '', {} as any)
    );

    expect(actualState).toEqual({
      user: null,
      isLoading: false,
      error: 'Ошибка загрузки данных',
      isAuthChecked: true
    });
  });

  // обновление
  test('тест на состояние при начале запроса', () => {
    const actualState = profileReducer(
      initialState,
      updateUser.pending('', {} as any)
    );

    expect(actualState).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  test('тест на состояние при успешном обновлении', () => {
    const actualState = profileReducer(
      initialState,
      updateUser.fulfilled(testUser, '', {} as any)
    );

    expect(actualState).toEqual({
      ...initialState,
      user: testUser,
      isLoading: false,
      error: null
    });
  });

  test('тест на состояние при ошибке', () => {
    const testError = new Error('Ошибка обновления данных');

    const actualState = profileReducer(
      initialState,
      updateUser.rejected(testError, '', {} as any)
    );

    expect(actualState).toEqual({
      ...initialState,
      isLoading: false,
      error: 'Ошибка обновления данных'
    });
  });

  // восстановление пароля
  test('тест на состояние при начале запроса', () => {
    const actualState = profileReducer(
      initialState,
      forgotPassword.pending('', 'test@test.com')
    );

    expect(actualState).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  test('тест на состояние при успешном запросе', () => {
    const actualState = profileReducer(
      initialState,
      forgotPassword.fulfilled(undefined, '', {} as any)
    );

    expect(actualState).toEqual({
      ...initialState,
      user: null,
      isAuthChecked: false,
      isLoading: false,
      error: null
    });
  });

  test('тест на состояние при ошибке', () => {
    const testError = new Error('Ошибка восстановления пароля');

    const actualState = profileReducer(
      initialState,
      forgotPassword.rejected(testError, '', 'test@test.com')
    );

    expect(actualState).toEqual({
      ...initialState,
      isLoading: false,
      error: 'Ошибка восстановления пароля'
    });
  });

  // сброс пароля
  test('тест на состояние при начале запроса', () => {
    const actualState = profileReducer(
      initialState,
      resetPassword.pending('', { password: '12345678', token: 'abc123' })
    );

    expect(actualState).toEqual({
      user: null,
      isAuthChecked: false,
      isLoading: true,
      error: null
    });
  });

  test('тест на состояние при успешном запросе', () => {
    const actualState = profileReducer(
      initialState,
      resetPassword.fulfilled(undefined, '', {} as any)
    );

    expect(actualState).toEqual({
      ...initialState,
      user: null,
      isAuthChecked: false,
      isLoading: false,
      error: null
    });
  });

  test('тест на состояние при ошибке', () => {
    const testError = new Error('Ошибка сброса пароля');

    const actualState = profileReducer(
      initialState,
      resetPassword.rejected(testError, '', {
        password: '12345678',
        token: 'abc123'
      })
    );

    expect(actualState).toEqual({
      ...initialState,
      isLoading: false,
      error: 'Ошибка сброса пароля'
    });
  });
});
