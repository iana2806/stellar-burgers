import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

type OrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  currentOrder: TOrder | null;
  isOrderLoading: boolean;
  error: string | null;
};

const initialState: OrderState = {
  orderRequest: false,
  orderModalData: null,
  currentOrder: null,
  isOrderLoading: false,
  error: null
};

// Асинхронный экшен для создания заказа
export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { state: RootState; rejectValue: string }
>('order/createOrder', async (ingredientIds, { getState, rejectWithValue }) => {
  const user = getState().profile.user;

  if (!user) {
    return rejectWithValue('Ошибка авторизации');
  }

  try {
    const data = await orderBurgerApi(ingredientIds);
    return data.order;
  } catch {
    return rejectWithValue('Ошибка создания заказа');
  }
});

export const currentOrderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.orderModalData = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Не удалось оформить заказ';
      });
  }
});

export const { closeOrderModal, clearCurrentOrder } = currentOrderSlice.actions;

export const orderModalDataSelector = (state: RootState) =>
  state.currentOrder.orderModalData;
export const orderRequestSelector = (state: RootState) =>
  state.currentOrder.orderRequest;

export const currentOrderReducer = currentOrderSlice.reducer;
