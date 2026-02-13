import { createAction, props } from '@ngrx/store';
import { Order, SortField, SortDirection } from './order-list.state';

export const initializeOrders = createAction(
  '[Order List] Initialize Orders',
  props<{ orders: Order[] }>()
);

export const setSearchQuery = createAction(
  '[Order List] Set Search Query',
  props<{ query: string }>()
);

export const setStatusFilter = createAction(
  '[Order List] Set Status Filter',
  props<{ status: 'All' | 'New' | 'Processing' | 'Completed' }>()
);

export const setSortField = createAction(
  '[Order List] Set Sort Field',
  props<{ field: SortField }>()
);

export const setSortDirection = createAction(
  '[Order List] Set Sort Direction',
  props<{ direction: SortDirection }>()
);

export const setPageSize = createAction(
  '[Order List] Set Page Size',
  props<{ size: number }>()
);

export const setCurrentPage = createAction(
  '[Order List] Set Current Page',
  props<{ page: number }>()
);

export const applyFiltersAndSort = createAction(
  '[Order List] Apply Filters And Sort'
);

export const addOrder = createAction(
  '[Order List] Add Order',
  props<{ order: Order }>()
);
