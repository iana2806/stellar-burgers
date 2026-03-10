import { describe, expect, test } from '@jest/globals';
import { feedReducer, fetchFeeds } from '../services/slices/feedSlice';
import { TOrder, TOrdersData } from '@utils-types';

describe('feedSlice', () => {
  // начальное состояние
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null
  };

  test('тест на состояние при начале запроса', () => {
    const actualState = feedReducer(initialState, fetchFeeds.pending(''));

    expect(actualState).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  test('тест на состояние при успешной загрузке', () => {
    const testData: TOrdersData = {
      orders: [
        {
          _id: 'order1',
          status: 'done',
          name: 'Тестовый заказ',
          createdAt: '2026-03-07T11:52:54.300Z',
          updatedAt: '2026-03-07T11:52:54.512Z',
          number: 123456,
          ingredients: ['ingredient1', 'ingredient2']
        } as TOrder
      ],
      total: 100,
      totalToday: 20
    };

    const actualState = feedReducer(
      { ...initialState, isLoading: true },
      fetchFeeds.fulfilled(testData, '')
    );

    expect(actualState).toEqual({
      orders: testData.orders,
      total: testData.total,
      totalToday: testData.totalToday,
      isLoading: false,
      error: null
    });
  });

  test('тест на состояние при ошибке', () => {
    const testError = new Error('Ошибка загрузки ленты');

    const actualState = feedReducer(
      { ...initialState, isLoading: true },
      fetchFeeds.rejected(testError, '')
    );

    expect(actualState).toMatchObject({
      ...initialState,
      isLoading: false,
      error: 'Ошибка загрузки ленты'
    });
  });
});
