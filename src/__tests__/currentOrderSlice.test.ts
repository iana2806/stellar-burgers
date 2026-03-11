import { describe, expect, test } from '@jest/globals';
import {
  currentOrderReducer,
  createOrder,
  closeOrderModal,
  clearCurrentOrder
} from '../services/slices/currentOrderSlice';
import { TOrder } from '@utils-types';

describe('currentOrderSlice', () => {
  // начальное состояние
  const initialState = {
    orderRequest: false,
    orderModalData: null,
    currentOrder: null,
    isOrderLoading: false,
    error: null
  };

  test('тест на состояние при начале запроса', () => {
    const stateWithError = {
      ...initialState,
      error: 'Ошибка'
    };

    const actualState = currentOrderReducer(
      stateWithError,
      createOrder.pending('', [])
    );

    expect(actualState).toEqual({
      ...initialState,
      orderRequest: true,
      error: null
    });
  });

  test('тест на состояние при успешном создании заказа', () => {
    const testOrder: TOrder = {
      _id: 'order1',
      status: 'done',
      name: 'Тестовый заказ',
      createdAt: '2026-03-07T11:52:54.300Z',
      updatedAt: '2026-03-07T11:52:54.512Z',
      number: 123456,
      ingredients: ['ingredient1', 'ingredient2']
    };

    const actualState = currentOrderReducer(
      { ...initialState, orderRequest: true },
      createOrder.fulfilled(testOrder, '', [])
    );

    expect(actualState).toEqual({
      ...initialState,
      orderRequest: false,
      orderModalData: testOrder
    });
  });

  test('тест на состояние при ошибке', () => {
    const testError = new Error('Не удалось оформить заказ');

    const actualState = currentOrderReducer(
      { ...initialState, orderRequest: true },
      createOrder.rejected(testError, '', [])
    );

    expect(actualState).toMatchObject({
      ...initialState,
      orderRequest: false,
      error: 'Не удалось оформить заказ'
    });
  });

  test('тест на закрытие модального окна заказа', () => {
    const testOrder: TOrder = {
      _id: 'order1',
      status: 'done',
      name: 'Тестовый заказ',
      createdAt: '2026-03-07T11:52:54.300Z',
      updatedAt: '2026-03-07T11:52:54.512Z',
      number: 123456,
      ingredients: ['ingredient1', 'ingredient2']
    };

    const stateWithModal = { ...initialState, orderModalData: testOrder };

    const newState = currentOrderReducer(stateWithModal, closeOrderModal());

    expect(newState.orderModalData).toBeNull();
    expect(newState.orderRequest).toBe(false);
  });

  test('тест на очистку текущего заказа', () => {
    const testOrder: TOrder = {
      _id: 'order1',
      status: 'done',
      name: 'Тестовый заказ',
      createdAt: '2026-03-07T11:52:54.300Z',
      updatedAt: '2026-03-07T11:52:54.512Z',
      number: 123456,
      ingredients: ['ingredient1', 'ingredient2']
    };

    const stateWithOrder = {
      ...initialState,
      orderModalData: testOrder,
      orderRequest: false,
      currentOrder: null,
      isOrderLoading: false,
      error: null
    };

    const newState = currentOrderReducer(stateWithOrder, clearCurrentOrder());

    expect(newState.currentOrder).toBeNull();
    expect(newState.orderModalData).toBe(testOrder);
  });
});
