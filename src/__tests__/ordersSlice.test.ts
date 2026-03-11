import { describe, expect, test } from '@jest/globals';
import {
  ordersReducer,
  getOrders,
  getOrderByNumber
} from '../services/slices/ordersSlice';
import { TOrder } from '@utils-types';

describe('ordersSlice', () => {
  const initialState = {
    // начальное состояние
    orders: [],
    total: 0,
    totalToday: 0,
    isOrdersLoading: false,
    error: null
  };

  const testOrder: TOrder = {
    _id: 'order1',
    status: 'done',
    name: 'Тестовый заказ',
    createdAt: '2026-03-07T11:52:54.300Z',
    updatedAt: '2026-03-07T11:52:54.512Z',
    number: 123456,
    ingredients: ['ingredient1', 'ingredient2']
  };

  // тесты getOrders
  test('тест на состояние при начале запроса', () => {
    const actualState = ordersReducer(initialState, getOrders.pending(''));

    expect(actualState).toEqual({
      ...initialState,
      isOrdersLoading: true,
      error: null
    });
  });

  test('тест на состояние при успешной загрузке', () => {
    const payload = {
      orders: [testOrder],
      total: 1,
      totalToday: 1
    };

    const actualState = ordersReducer(
      { ...initialState, isOrdersLoading: true },
      getOrders.fulfilled(payload, '')
    );

    expect(actualState).toEqual({
      orders: [testOrder],
      total: 1,
      totalToday: 1,
      isOrdersLoading: false,
      error: null
    });
  });

  test('тест на состояние при ошибке', () => {
    const testError = new Error('Ошибка при загрузке заказов');

    const actualState = ordersReducer(
      { ...initialState, isOrdersLoading: true },
      getOrders.rejected(testError, '')
    );

    expect(actualState).toMatchObject({
      ...initialState,
      isOrdersLoading: false,
      error: 'Ошибка при загрузке заказов'
    });
  });

  // тесты getOrderByNumber
  test('тест на состояние при начале запроса', () => {
    const actualState = ordersReducer(
      initialState,
      getOrderByNumber.pending('', 123456)
    );

    expect(actualState).toEqual({
      ...initialState,
      isOrdersLoading: true,
      error: null
    });
  });

  test('тест на состояние при успешной загрузке', () => {
    const actualState = ordersReducer(
      initialState,
      getOrderByNumber.fulfilled(testOrder, '', 123456)
    );

    expect(actualState.orders).toContainEqual(testOrder);
    expect(actualState.isOrdersLoading).toBe(false);
  });

  test('тест на состояние при ошибке', () => {
    const testError = new Error('Ошибка при загрузке заказа');

    const actualState = ordersReducer(
      { ...initialState, isOrdersLoading: true },
      getOrderByNumber.rejected(testError, '', 123456)
    );

    expect(actualState).toMatchObject({
      ...initialState,
      isOrdersLoading: false,
      error: 'Ошибка при загрузке заказа'
    });
  });
});
