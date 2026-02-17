import { createReducer, on } from '@ngrx/store';
import { OrderSummaryState, initialOrderSummaryState } from './order-summary.state';
import * as OrderSummaryActions from './order-summary.actions';

export const orderSummaryReducer = createReducer(
  initialOrderSummaryState,

  on(OrderSummaryActions.setTimeRange, (state, { timeRange }): OrderSummaryState => ({
    ...state,
    selectedTimeRange: timeRange,
    lastUpdated: new Date()
  })),

  on(OrderSummaryActions.updateLastUpdated, (state): OrderSummaryState => ({
    ...state,
    lastUpdated: new Date()
  }))
);
