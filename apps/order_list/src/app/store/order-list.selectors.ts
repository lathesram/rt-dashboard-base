import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrderListState } from './order-list.state';
import { selectAllOrders, Order } from '@rt-dashboard/shared/data-access-orders';

export const selectOrderListState = createFeatureSelector<OrderListState>('orderList');

// Local state selectors
export const selectSearchQuery = createSelector(
  selectOrderListState,
  (state) => state.searchQuery
);

export const selectStatusFilter = createSelector(
  selectOrderListState,
  (state) => state.statusFilter
);

export const selectSortField = createSelector(
  selectOrderListState,
  (state) => state.sortField
);

export const selectSortDirection = createSelector(
  selectOrderListState,
  (state) => state.sortDirection
);

export const selectPageSize = createSelector(
  selectOrderListState,
  (state) => state.pageSize
);

export const selectCurrentPage = createSelector(
  selectOrderListState,
  (state) => state.currentPage
);

export const selectPageSizeOptions = createSelector(
  selectOrderListState,
  (state) => state.pageSizeOptions
);

export const selectRenderCount = createSelector(
  selectOrderListState,
  (state) => state.renderCount
);

export const selectLastUpdated = createSelector(
  selectOrderListState,
  (state) => state.lastUpdated
);

// Combined selectors (global orders + local filters)
export const selectFilteredOrders = createSelector(
  selectAllOrders,
  selectSearchQuery,
  selectStatusFilter,
  selectSortField,
  selectSortDirection,
  (orders: Order[], searchQuery, statusFilter, sortField, sortDirection) => {
    let filtered = [...orders];

    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.amount.toString().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'id') {
        comparison = a.id.localeCompare(b.id);
      } else if (sortField === 'createdAt') {
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
      } else if (sortField === 'amount') {
        comparison = a.amount - b.amount;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }
);

export const selectPaginatedOrders = createSelector(
  selectFilteredOrders,
  selectPageSize,
  selectCurrentPage,
  (orders, pageSize, currentPage) => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return orders.slice(startIndex, endIndex);
  }
);

export const selectTotalPages = createSelector(
  selectFilteredOrders,
  selectPageSize,
  (orders, pageSize) => Math.ceil(orders.length / pageSize)
);

export const selectFilteredOrdersCount = createSelector(
  selectFilteredOrders,
  (orders) => orders.length
);
