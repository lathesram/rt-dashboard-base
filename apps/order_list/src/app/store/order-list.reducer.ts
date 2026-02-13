import { createReducer, on } from '@ngrx/store';
import { initialOrderListState } from './order-list.state';
import * as OrderListActions from './order-list.actions';

export const orderListReducer = createReducer(
  initialOrderListState,
  
  on(OrderListActions.initializeOrders, (state, { orders }) => ({
    ...state,
    allOrders: orders,
    displayedOrders: orders,
    renderCount: state.renderCount + 1
  })),
  
  on(OrderListActions.setSearchQuery, (state, { query }) => ({
    ...state,
    searchQuery: query
  })),
  
  on(OrderListActions.setStatusFilter, (state, { status }) => ({
    ...state,
    statusFilter: status
  })),
  
  on(OrderListActions.setSortField, (state, { field }) => ({
    ...state,
    sortField: field
  })),
  
  on(OrderListActions.setSortDirection, (state, { direction }) => ({
    ...state,
    sortDirection: direction
  })),
  
  on(OrderListActions.setPageSize, (state, { size }) => ({
    ...state,
    pageSize: size,
    currentPage: 1
  })),
  
  on(OrderListActions.setCurrentPage, (state, { page }) => ({
    ...state,
    currentPage: page
  })),
  
  on(OrderListActions.applyFiltersAndSort, (state) => {
    console.log('[Order List Reducer] applyFiltersAndSort action received');
    console.log('[Order List Reducer] All orders count:', state.allOrders.length);
    
    let filtered = state.allOrders;
    
    // Apply status filter
    if (state.statusFilter !== 'All') {
      filtered = filtered.filter(order => order.status === state.statusFilter);
    }
    
    // Apply search query
    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.amount.toString().includes(query)
      );
    }
    
    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      let val = 0;
      if (state.sortField === 'id') val = a.id.localeCompare(b.id);
      else if (state.sortField === 'timestamp') val = a.createdAt.getTime() - b.createdAt.getTime();
      else val = a.amount - b.amount;
      return state.sortDirection === 'asc' ? val : -val;
    });
    
    console.log('[Order List Reducer] Filtered orders count:', filtered.length);
    
    return {
      ...state,
      displayedOrders: filtered,
      currentPage: 1,
      lastUpdated: new Date(),
      renderCount: state.renderCount + 1
    };
  }),

  on(OrderListActions.addOrder, (state, { order }) => {
    console.log('[Order List Reducer] addOrder action received');
    console.log('[Order List Reducer] Current orders count:', state.allOrders.length);
    console.log('[Order List Reducer] Adding order:', order);
    
    const allOrders = [order, ...state.allOrders];
    
    console.log('[Order List Reducer] New orders count:', allOrders.length);
    
    return {
      ...state,
      allOrders
    };
  })
);
