import { describe, expect, test } from '@jest/globals';
import { rootReducer } from '../services/rootReducer';

describe('[rootReducer] проверка инициализации', () => {
  test('возвращает начальное состояние при неизвестном экшене', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual({
      burgerConstructor: {
        bun: null,
        ingredients: [],
        orderRequest: false,
        orderModalData: null,
        error: null
      },
      currentOrder: {
        orderRequest: false,
        orderModalData: null,
        currentOrder: null,
        isOrderLoading: false,
        error: null
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: null
      },
      ingredients: {
        items: [],
        isIngredientsLoading: false,
        error: null
      },
      orders: {
        orders: [],
        total: 0,
        totalToday: 0,
        isOrdersLoading: false,
        error: null
      },
      profile: {
        user: null,
        isLoading: false,
        error: null,
        isAuthChecked: false
      }
    });
  });
});
