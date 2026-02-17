import { createAction, props } from '@ngrx/store';
import { SortField, SortDirection, StatusFilter } from './order-list.state';

export const setSearchQuery = createAction(
  '[Order List] Set Search Query',
  props<{ query: string }>()
);

export const setStatusFilter = createAction(
  '[Order List] Set Status Filter',
  props<{ filter: StatusFilter }>()
);

export const setSortField = createAction(
  '[Order List] Set Sort Field',
  props<{ field: SortField }>()
);

export const setSortDirection = createAction(
  '[Order List] Set Sort Direction',
  props<{ direction: SortDirection }>()
);

export const toggleSortDirection = createAction(
  '[Order List] Toggle Sort Direction'
);

export const setPageSize = createAction(
  '[Order List] Set Page Size',
  props<{ size: number }>()
);

export const setCurrentPage = createAction(
  '[Order List] Set Current Page',
  props<{ page: number }>()
);

export const incrementRenderCount = createAction(
  '[Order List] Increment Render Count'
);

export const updateLastUpdated = createAction(
  '[Order List] Update Last Updated'
);

export const resetFilters = createAction(
  '[Order List] Reset Filters'
);
