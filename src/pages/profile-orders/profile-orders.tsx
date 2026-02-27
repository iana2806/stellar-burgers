import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getOrders,
  getOrdersSelector
} from '../../services/slices/ordersSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const { orders, isOrdersLoading } = useSelector(getOrdersSelector);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  if (isOrdersLoading) return <Preloader />;

  return <ProfileOrdersUI orders={orders} />;
};
