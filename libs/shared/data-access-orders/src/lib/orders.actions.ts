import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Order } from './models';

export const OrdersActions = createActionGroup({
  source: 'Orders',
  events: {
    // Order CRUD
    'Add Order': props<{ order: Order }>(),
    'Add Orders': props<{ orders: Order[] }>(),
    'Update Order': props<{ id: string; changes: Partial<Order> }>(),
    'Remove Order': props<{ id: string }>(),
    'Load Orders': props<{ orders: Order[] }>(),
    'Clear Orders': emptyProps(),
  }
});
