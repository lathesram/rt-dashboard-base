import { createReducer, on } from '@ngrx/store';
import { OrderListState, initialOrderListState } from './order-list.state';
import * as OrderListActions from './order-list.actions';

export const orderListReducer = createReducer(
  initialOrderListState,

  on(OrderListActions.setSearchQuery, (state, { query }): OrderListState => ({
    ...state,
    searchQuery: query,
    currentPage: 1,
    lastUpdated: new Date()
  })),

  on(OrderListActions.setStatusFilter, (state, { filter }): OrderListState => ({
    ...state,
    statusFilter: filter,
    currentPage: 1,
    lastUpdated: new Date()
  })),

  on(OrderListActions.setSortField, (state, { field }): OrderListState => ({
    ...state,
    sortField: field,
    lastUpdated: new Date()
  })),

  on(OrderListActions.setSortDirection, (state, { direction }): OrderListState => ({
    ...state,
    sortDirection: direction,
    lastUpdated: new Date()
  })),

  on(OrderListActions.toggleSortDirection, (state): OrderListState => ({
    ...state,
    sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc',
    lastUpdated: new Date()
  })),

  on(OrderListActions.setPageSize, (state, { size }): OrderListState => ({
    ...state,
    pageSize: size,
    currentPage: 1,
    lastUpdated: new Date()
  })),

  on(OrderListActions.setCurrentPage, (state, { page }): OrderListState => ({
    ...state,
    currentPage: page
  })),

  on(OrderListActions.incrementRenderCount, (state): OrderListState => ({
    ...state,
    renderCount: state.renderCount + 1
  })),

  on(OrderListActions.updateLastUpdated, (state): OrderListState => ({
    ...state,
    lastUpdated: new Date()
  })),

  on(OrderListActions.resetFilters, (state): OrderListState => ({
    ...state,
    searchQuery: '',
    statusFilter: 'All',
    sortField: 'createdAt',
    sortDirection: 'desc',
    currentPage: 1,
    lastUpdated: new Date()
  }))
);
