import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrderListState } from './order-list.state';

export const selectOrderListState = createFeatureSelector<OrderListState>('orderList');

export const selectAllOrders = createSelector(
  selectOrderListState,
  (state) => state.allOrders
);

export const selectDisplayedOrders = createSelector(
  selectOrderListState,
  (state) => state.displayedOrders
);

export const selectIsLoading = createSelector(
  selectOrderListState,
  (state) => state.isLoading
);

export const selectRenderCount = createSelector(
  selectOrderListState,
  (state) => state.renderCount
);

export const selectLastUpdated = createSelector(
  selectOrderListState,
  (state) => state.lastUpdated
);

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

export const selectPaginatedOrders = createSelector(
  selectDisplayedOrders,
  selectPageSize,
  selectCurrentPage,
  (orders, pageSize, currentPage) => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return orders.slice(startIndex, endIndex);
  }
);

export const selectTotalPages = createSelector(
  selectDisplayedOrders,
  selectPageSize,
  (orders, pageSize) => Math.ceil(orders.length / pageSize)
);
