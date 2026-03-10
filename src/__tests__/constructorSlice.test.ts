import { describe, expect, test } from '@jest/globals';
import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredientDown,
  moveIngredientUp,
  clearConstructor
} from '../services/slices/constructorSlice';
import { TIngredient } from '@utils-types';

describe('constructorSlice', () => {
  // начальное состояние
  const initialState = {
    bun: null,
    ingredients: [],
    orderRequest: false,
    orderModalData: null,
    error: null
  };

  // тестовая булка
  const testBun: TIngredient = {
    _id: '1',
    name: 'Тестовая булка',
    type: 'bun',
    proteins: 10,
    fat: 20,
    carbohydrates: 30,
    calories: 200,
    price: 100,
    image: 'image1',
    image_large: 'large1',
    image_mobile: 'mobile1'
  };

  // тестовая начинка
  const testIngredient: TIngredient = {
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
  };

  test('добавляет булку в конструктор', () => {
    const actualState = constructorReducer(
      initialState,
      addIngredient(testBun)
    );

    expect(actualState.bun).toEqual(
      expect.objectContaining({ name: 'Тестовая булка', type: 'bun' })
    );
  });

  test('добавляет начинку в конструктор', () => {
    const actualState = constructorReducer(
      initialState,
      addIngredient(testIngredient)
    );

    expect(actualState.ingredients[0]).toEqual(
      expect.objectContaining({ name: 'Тестовая начинка', type: 'main' })
    );
  });

  test('удаляет булку из конструктора', () => {
    const stateWithBun = constructorReducer(
      initialState,
      addIngredient(testBun)
    );

    expect(stateWithBun.bun).not.toBeNull();

    const stateWithoutBun = constructorReducer(
      stateWithBun,
      clearConstructor()
    );

    expect(stateWithoutBun.bun).toBeNull();
  });

  test('удаляет начинку из конструктора по id', () => {
    const stateWithIngredient = constructorReducer(
      initialState,
      addIngredient(testIngredient)
    );

    const ingredientId = stateWithIngredient.ingredients[0].id;

    const stateWithoutIngredient = constructorReducer(
      stateWithIngredient,
      removeIngredient(ingredientId)
    );

    expect(stateWithoutIngredient.ingredients).toHaveLength(0);
  });

  test('перемещает начинку вверх', () => {
    const stateWithTwoIngredients = {
      ...initialState,
      ingredients: [
        { ...testIngredient, id: '1' },
        { ...testIngredient, id: '2', name: 'Вторая начинка' }
      ]
    };

    const newState = constructorReducer(
      stateWithTwoIngredients,
      moveIngredientUp(1)
    );

    expect(newState.ingredients[0].id).toBe('2');
    expect(newState.ingredients[1].id).toBe('1');
  });

  test('перемещает начинку вниз', () => {
    const stateWithTwoIngredients = {
      ...initialState,
      ingredients: [
        { ...testIngredient, id: '1' },
        { ...testIngredient, id: '2', name: 'Вторая начинка' }
      ]
    };

    const newState = constructorReducer(
      stateWithTwoIngredients,
      moveIngredientDown(0)
    );

    expect(newState.ingredients[0].id).toBe('2');
    expect(newState.ingredients[1].id).toBe('1');
  });
});
