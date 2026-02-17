import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Order } from './models';
import { OrdersActions } from './orders.actions';

// Orders entity state
export interface OrdersState extends EntityState<Order> {
  loading: boolean;
  error: string | null;
}

// Entity adapter
export const ordersAdapter: EntityAdapter<Order> = createEntityAdapter<Order>({
  selectId: (order: Order) => order.id,
  sortComparer: (a: Order, b: Order) => b.createdAt.getTime() - a.createdAt.getTime(),
});

// Initial state
export const initialOrdersState: OrdersState = ordersAdapter.getInitialState({
  loading: false,
  error: null,
});

// Reducer
export const ordersReducer = createReducer(
  initialOrdersState,

  // Order CRUD
  on(OrdersActions.addOrder, (state, { order }) =>
    ordersAdapter.addOne(order, state)
  ),

  on(OrdersActions.addOrders, (state, { orders }) =>
    ordersAdapter.addMany(orders, state)
  ),

  on(OrdersActions.updateOrder, (state, { id, changes }) =>
    ordersAdapter.updateOne({ id, changes }, state)
  ),

  on(OrdersActions.removeOrder, (state, { id }) =>
    ordersAdapter.removeOne(id, state)
  ),

  on(OrdersActions.loadOrders, (state, { orders }) =>
    ordersAdapter.setAll(orders, state)
  ),

  on(OrdersActions.clearOrders, (state) =>
    ordersAdapter.removeAll(state)
  )
);
