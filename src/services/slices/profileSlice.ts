import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getUserApi,
  updateUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  TRegisterData,
  TLoginData
} from '@api';
import { TUser } from '@utils-types';
import { RootState } from '../store';
import { setCookie, deleteCookie } from '../../utils/cookie';

// Авторизация
export const loginUser = createAsyncThunk<TUser, TLoginData>(
  'profile/loginUser',
  async (data) => {
    const response = await loginUserApi(data);

    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response.user;
  }
);

// Регистрация
export const registerUser = createAsyncThunk<TUser, TRegisterData>(
  'profile/registerUser',
  async (data) => {
    const response = await registerUserApi(data);

    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response.user;
  }
);

// Выход из профиля
export const logoutUser = createAsyncThunk('profile/logoutUser', async () => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (refreshToken) {
    await logoutApi();
  }

  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

// Получение данных пользователя
export const fetchUser = createAsyncThunk<TUser>(
  'profile/fetchUser',
  async () => {
    const data = await getUserApi();
    return data.user;
  }
);

// Обновление данных пользователя
export const updateUser = createAsyncThunk<
  TUser,
  { name?: string; email?: string; password?: string }
>('profile/updateUser', async (userData) => {
  const data = await updateUserApi(userData);
  return data.user;
});

// Восстановление пароля
export const forgotPassword = createAsyncThunk<void, string>(
  'profile/forgotPassword',
  async (email) => {
    await forgotPasswordApi({ email });
  }
);

// Сброс пароля
export const resetPassword = createAsyncThunk<
  void,
  { password: string; token: string }
>('profile/resetPassword', async (data) => {
  await resetPasswordApi(data);
});

type ProfileState = {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthChecked: boolean;
};

const initialState: ProfileState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthChecked: false
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.isLoading = false;
      state.isAuthChecked = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // логин
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка авторизации';
        state.isAuthChecked = true;
      })

      // регистрация
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка регистрации';
        state.isAuthChecked = true;
      })

      // выход из профиля
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = true;
      })

      // получение данных
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = action.error.message || 'Ошибка загрузки данных';
        state.isAuthChecked = true;
      })

      // обновление
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка обновления данных';
      })

      // восстановление пароля
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка восстановления пароля';
      })

      // сброс пароля
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка сброса пароля';
      });
  }
});

export const { logout } = profileSlice.actions;

export const getProfileSelector = (state: RootState) => state.profile;

export const profileReducer = profileSlice.reducer;
