import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrdersState, ordersAdapter } from './orders.reducer';
import { OrderSummary } from './models';

// Feature selector
export const selectOrdersFeature = createFeatureSelector<OrdersState>('orders');

// Entity selectors
const { selectAll, selectEntities, selectIds, selectTotal } = ordersAdapter.getSelectors();

// Orders selectors
export const selectOrdersState = createSelector(
  selectOrdersFeature,
  (state) => state.orders
);

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

export const selectOrderById = (id: string) =>
  createSelector(
    selectOrderEntities,
    (entities) => entities[id]
  );

export const selectOrdersLoading = createSelector(
  selectOrdersState,
  (state) => state.loading
);

export const selectOrdersError = createSelector(
  selectOrdersState,
  (state) => state.error
);

// Producer selectors
export const selectProducerState = createSelector(
  selectOrdersFeature,
  (state) => state.producer
);

export const selectProducerStatus = createSelector(
  selectProducerState,
  (producer) => producer.status
);

export const selectGeneratedCount = createSelector(
  selectProducerState,
  (producer) => producer.generatedCount
);

export const selectGenerationRate = createSelector(
  selectProducerState,
  (producer) => producer.generationRate
);

export const selectProducerConfig = createSelector(
  selectProducerState,
  (producer) => producer.config
);

export const selectLastGeneratedAt = createSelector(
  selectProducerState,
  (producer) => producer.lastGeneratedAt
);

// Filter selectors
export const selectFiltersState = createSelector(
  selectOrdersFeature,
  (state) => state.filters
);

export const selectSearchTerm = createSelector(
  selectFiltersState,
  (filters) => filters.searchTerm
);

export const selectStatusFilter = createSelector(
  selectFiltersState,
  (filters) => filters.statusFilter
);

export const selectSortBy = createSelector(
  selectFiltersState,
  (filters) => filters.sortBy
);

export const selectSortDirection = createSelector(
  selectFiltersState,
  (filters) => filters.sortDirection
);

// Computed selectors
export const selectFilteredOrders = createSelector(
  selectAllOrders,
  selectFiltersState,
  (orders, filters) => {
    let filtered = orders;

    // Apply status filter
    if (filters.statusFilter !== 'All') {
      filtered = filtered.filter(order => order.status === filters.statusFilter);
    }

    // Apply search term
    if (filters.searchTerm.trim()) {
      const query = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.amount.toString().includes(query)
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'id':
          comparison = a.id.localeCompare(b.id);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
      }

      return filters.sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }
);

export const selectOrderSummary = createSelector(
  selectAllOrders,
  (orders): OrderSummary => {
    const startTime = performance.now();
    
    const total = orders.length;
    const byStatus = {
      new: orders.filter(o => o.status === 'New').length,
      processing: orders.filter(o => o.status === 'Processing').length,
      completed: orders.filter(o => o.status === 'Completed').length,
    };

    const amounts = orders.map(o => o.amount);
    const totalRevenue = amounts.reduce((sum, amount) => sum + amount, 0);
    const averageRevenue = total > 0 ? totalRevenue / total : 0;
    const highestRevenue = amounts.length > 0 ? Math.max(...amounts) : 0;

    const endTime = performance.now();
    const calculationTime = endTime - startTime;

    return {
      total,
      byStatus,
      revenue: {
        total: totalRevenue,
        average: averageRevenue,
        highest: highestRevenue,
      },
      performance: {
        computationCount: total,
        lastCalculationMs: calculationTime,
      },
    };
  }
);

// Status-specific selectors
export const selectNewOrders = createSelector(
  selectAllOrders,
  (orders) => orders.filter(o => o.status === 'New')
);

export const selectProcessingOrders = createSelector(
  selectAllOrders,
  (orders) => orders.filter(o => o.status === 'Processing')
);

export const selectCompletedOrders = createSelector(
  selectAllOrders,
  (orders) => orders.filter(o => o.status === 'Completed')
);

// Convenience selectors
export const selectOrdersCount = createSelector(
  selectAllOrders,
  (orders) => orders.length
);

export const selectHasOrders = createSelector(
  selectOrdersCount,
  (count) => count > 0
);

export const selectIsProducerActive = createSelector(
  selectProducerStatus,
  (status) => status === 'Active'
);

export const selectCanStartProducer = createSelector(
  selectProducerStatus,
  (status) => 
    status === 'Stopped' || status === 'Paused'
);
