import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrderSummaryState } from './order-summary.state';
import { selectAllOrders, selectOrderSummary as selectGlobalOrderSummary, Order } from '@rt-dashboard/shared/data-access-orders';

export const selectOrderSummaryState = createFeatureSelector<OrderSummaryState>('orderSummary');

// Local state selectors
export const selectSelectedTimeRange = createSelector(
  selectOrderSummaryState,
  (state) => state.selectedTimeRange
);

export const selectLastUpdated = createSelector(
  selectOrderSummaryState,
  (state) => state.lastUpdated
);

export const selectTimeRangeOptions = createSelector(
  selectOrderSummaryState,
  (state) => state.timeRangeOptions
);

// Combined selectors (global orders + local time range filter)
export const selectFilteredOrdersByTimeRange = createSelector(
  selectAllOrders,
  selectSelectedTimeRange,
  (orders: Order[], timeRange) => {
    if (timeRange === 'all') {
      return orders;
    }

    const now = new Date();
    let cutoffTime: Date;

    switch (timeRange) {
      case 'hour':
        cutoffTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case 'day':
        cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        cutoffTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        return orders;
    }

    return orders.filter((order: Order) => order.createdAt >= cutoffTime);
  }
);

export const selectSecondsSinceUpdate = createSelector(
  selectLastUpdated,
  (lastUpdated) => Math.floor((Date.now() - lastUpdated.getTime()) / 1000)
);

// Re-export global summary for convenience
export const selectOrderSummary = selectGlobalOrderSummary;
