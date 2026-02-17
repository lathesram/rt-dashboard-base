import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrdersState, ordersAdapter } from './orders.reducer';
import { OrderSummary } from './models';

// Feature selector
export const selectOrdersState = createFeatureSelector<OrdersState>('orders');

// Entity selectors
const { selectAll, selectEntities, selectIds, selectTotal } = ordersAdapter.getSelectors();

// Base selectors
export const selectAllOrders = createSelector(
  selectOrdersState,
  selectAll
);

export const selectOrderEntities = createSelector(
  selectOrdersState,
  selectEntities
);

export const selectOrderIds = createSelector(
  selectOrdersState,
  selectIds
);

export const selectTotalOrders = createSelector(
  selectOrdersState,
  selectTotal
);

export const selectOrdersLoading = createSelector(
  selectOrdersState,
  (state) => state.loading
);

export const selectOrdersError = createSelector(
  selectOrdersState,
  (state) => state.error
);

// Derived selectors
export const selectOrderById = (id: string) => createSelector(
  selectOrderEntities,
  (entities) => entities[id]
);

export const selectOrdersByStatus = (status: 'New' | 'Processing' | 'Completed') => createSelector(
  selectAllOrders,
  (orders) => orders.filter(order => order.status === status)
);

export const selectOrderSummary = createSelector(
  selectAllOrders,
  (orders): OrderSummary => {
    const total = orders.length;
    const byStatus = {
      new: orders.filter(o => o.status === 'New').length,
      processing: orders.filter(o => o.status === 'Processing').length,
      completed: orders.filter(o => o.status === 'Completed').length,
    };

    const amounts = orders.map(o => o.amount);
    const totalRevenue = amounts.reduce((sum, amt) => sum + amt, 0);
    const avgRevenue = total > 0 ? totalRevenue / total : 0;
    const maxRevenue = amounts.length > 0 ? Math.max(...amounts) : 0;

    // Calculate trends (simplified - compare with baseline)
    const baseline = 100; // Mock baseline
    const totalChange = total - baseline;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const newToday = orders.filter(o => o.createdAt >= today && o.status === 'New').length;
    const completedToday = orders.filter(o => o.createdAt >= today && o.status === 'Completed').length;

    return {
      total,
      byStatus,
      revenue: {
        total: totalRevenue,
        average: avgRevenue,
        highest: maxRevenue,
      },
      trends: {
        totalChange,
        newToday,
        completedToday,
      },
    };
  }
);
