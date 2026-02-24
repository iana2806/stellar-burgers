import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch, RootState } from '../../services/store';
import { clearConstructor } from '../../services/slices/constructorSlice';
import { createOrder } from '../../services/slices/currentOrderSlice';
import {
  orderModalDataSelector,
  orderRequestSelector
} from '../../services/slices/currentOrderSlice';
import { closeOrderModal } from '../../services/slices/currentOrderSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { getProfileSelector } from '../../services/slices/profileSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const constructorItems = useSelector((state: RootState) => ({
    bun: state.burgerConstructor.bun || null,
    ingredients: state.burgerConstructor.ingredients || []
  }));
  const orderRequest = useSelector(orderRequestSelector);
  const orderModalData = useSelector(orderModalDataSelector);
  const user = useSelector(getProfileSelector);

  const onOrderClick = async () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((i) => i._id),
      constructorItems.bun._id
    ];

    try {
      await dispatch(createOrder(ingredientIds)).unwrap();
      dispatch(clearConstructor());
    } catch (err: any) {
      if (err === 'Ошибка авторизации') {
        navigate('/login', { state: { from: location.pathname } });
      } else {
        console.error('Ошибка оформления заказа:', err);
      }
    }
  };

  const handlecloseOrderModal = () => {
    dispatch(closeOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={handlecloseOrderModal}
    />
  );
};
