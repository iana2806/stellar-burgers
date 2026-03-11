import { describe, expect, test } from '@jest/globals';
import {
  ingredientsReducer,
  fetchIngredients
} from '../services/slices/ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('ingredientsSlice', () => {
  // начальное состояние
  const initialState = {
    items: [],
    isIngredientsLoading: false,
    error: null
  };

  test('тест на состояние при начале запроса', () => {
    const stateWithError = {
      ...initialState,
      error: 'Ошибка'
    };

    const actualState = ingredientsReducer(
      stateWithError,
      fetchIngredients.pending('')
    );

    expect(actualState).toEqual({
      items: [],
      isIngredientsLoading: true,
      error: null
    });
  });

  test('тест на состояние при успешном выполнении запроса', () => {
    const testIngredient: TIngredient[] = [
      {
        _id: '2',
        name: 'Тестовая начинка',
        type: 'main',
        proteins: 25,
        fat: 15,
        carbohydrates: 45,
        calories: 350,
        price: 250,
        image: 'image2',
        image_large: 'large2',
        image_mobile: 'mobile2'
      }
    ];

    const actualState = ingredientsReducer(
      { ...initialState, isIngredientsLoading: true },
      fetchIngredients.fulfilled(testIngredient, '')
    );

    expect(actualState).toEqual({
      items: testIngredient,
      isIngredientsLoading: false,
      error: null
    });
  });

  test('тест на состояние при ошибке', () => {
    const testError = new Error('Ошибка при загрузке ингредиентов');

    const actualState = ingredientsReducer(
      { ...initialState, isIngredientsLoading: true },
      fetchIngredients.rejected(testError, '')
    );

    expect(actualState).toMatchObject({
      items: [],
      isIngredientsLoading: false,
      error: 'Ошибка при загрузке ингредиентов'
    });
  });
});
