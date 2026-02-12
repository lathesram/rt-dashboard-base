import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Order, ProducerConfig, OrderStatus, SortField, SortDirection, StatusFilter } from './models';

export const OrdersActions = createActionGroup({
  source: 'Orders',
  events: {
    // Order CRUD
    'Add Order': props<{ order: Order }>(),
    'Add Orders': props<{ orders: Order[] }>(),
    'Update Order': props<{ id: string; changes: Partial<Order> }>(),
    'Update Order Status': props<{ id: string; status: OrderStatus }>(),
    'Remove Order': props<{ id: string }>(),
    'Load Orders': props<{ orders: Order[] }>(),
    'Clear Orders': emptyProps(),

    // Producer control
    'Start Producer': emptyProps(),
    'Pause Producer': emptyProps(),
    'Stop Producer': emptyProps(),
    'Reset Producer': emptyProps(),
    'Update Producer Config': props<{ config: Partial<ProducerConfig> }>(),
    'Update Generated Count': props<{ count: number }>(),

    // Filters
    'Set Search Term': props<{ searchTerm: string }>(),
    'Set Status Filter': props<{ statusFilter: StatusFilter }>(),
    'Set Sort By': props<{ sortBy: SortField }>(),
    'Set Sort Direction': props<{ direction: SortDirection }>(),
    'Toggle Sort Direction': emptyProps(),
    'Reset Filters': emptyProps(),
  }
});
