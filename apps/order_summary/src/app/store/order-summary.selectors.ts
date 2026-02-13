import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrderSummaryState } from './order-summary.state';

export const selectOrderSummaryState = createFeatureSelector<OrderSummaryState>('orderSummary');

export const selectSummary = createSelector(
  selectOrderSummaryState,
  (state) => state.summary
);

export const selectSelectedTimeRange = createSelector(
  selectOrderSummaryState,
  (state) => state.selectedTimeRange
);

export const selectLastUpdated = createSelector(
  selectOrderSummaryState,
  (state) => state.lastUpdated
);

export const selectIsAutoRefresh = createSelector(
  selectOrderSummaryState,
  (state) => state.isAutoRefresh
);

export const selectTimeRangeOptions = createSelector(
  selectOrderSummaryState,
  (state) => state.timeRangeOptions
);

export const selectStatusPercentages = createSelector(
  selectSummary,
  (summary) => {
    const total = summary.total;
    return {
      new: (summary.byStatus.new / total) * 100,
      processing: (summary.byStatus.processing / total) * 100,
      completed: (summary.byStatus.completed / total) * 100
    };
  }
);

export const selectSecondsSinceUpdate = createSelector(
  selectLastUpdated,
  (lastUpdated) => Math.floor((Date.now() - lastUpdated.getTime()) / 1000)
);
