import { createAction, props } from '@ngrx/store';
import { TimeRange, OrderSummary } from './order-summary.state';

export const setTimeRange = createAction(
  '[Order Summary] Set Time Range',
  props<{ timeRange: TimeRange }>()
);

export const updateSummary = createAction(
  '[Order Summary] Update Summary',
  props<{ summary: OrderSummary }>()
);

export const toggleAutoRefresh = createAction(
  '[Order Summary] Toggle Auto Refresh'
);

export const refreshSummary = createAction(
  '[Order Summary] Refresh Summary'
);

export const addOrder = createAction(
  '[Order Summary] Add Order',
  props<{ order: { status: 'New' | 'Processing' | 'Completed'; amount: number } }>()
);
