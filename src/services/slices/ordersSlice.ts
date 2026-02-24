import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrderByNumberApi, getOrdersApi } from '@api';
import { TOrder, TOrdersData } from '@utils-types';
import { RootState } from '../store';

// Асинхронный экшен для получения всех заказов
export const getOrders = createAsyncThunk<TOrdersData>(
  'orders/getOrders',
  async () => {
    const orders = await getOrdersApi();
    return {
      orders,
      total: orders.length,
      totalToday: orders.length
    };
  }
);

// Асинхронный экшен для поиска заказа по номеру
export const getOrderByNumber = createAsyncThunk<TOrder, number>(
  'orders/getOrderByNumber',
  async (number, { rejectWithValue }) => {
    const data = await getOrderByNumberApi(number);

    if (!data.orders.length) {
      return rejectWithValue('Заказ не найден');
    }

    return data.orders[0];
  }
);

type OrdersState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isOrdersLoading: boolean;
  error: string | null;
};

const initialState: OrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isOrdersLoading: false,
  error: null
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //все заказы
    builder
      .addCase(getOrders.pending, (state) => {
        state.isOrdersLoading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.error = action.error.message || 'Ошибка при загрузке заказов';
      });
    //заказ по номеру
    builder
      .addCase(getOrderByNumber.pending, (state) => {
        state.isOrdersLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isOrdersLoading = false;

        const exists = state.orders.find(
          (order) => order.number === action.payload.number
        );

        if (!exists) {
          state.orders.push(action.payload);
        }
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.error = action.error.message || 'Ошибка при загрузке заказа';
      });
  }
});

export const getOrdersSelector = (state: RootState) => state.orders;

export const ordersReducer = ordersSlice.reducer;
