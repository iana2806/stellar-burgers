import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/ingredientsSlice';
import { ordersReducer } from './slices/ordersSlice';
import { constructorReducer } from './slices/constructorSlice';
import { profileReducer } from './slices/profileSlice';
import { feedReducer } from './slices/feedSlice';
import { currentOrderReducer } from './slices/currentOrderSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  orders: ordersReducer,
  currentOrder: currentOrderReducer,
  burgerConstructor: constructorReducer,
  profile: profileReducer,
  feed: feedReducer
});
