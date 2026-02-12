import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Order, ProducerState, FiltersState } from './models';
import { OrdersActions } from './orders.actions';

// Orders entity state
export interface OrdersEntityState extends EntityState<Order> {
  loading: boolean;
  error: string | null;
}

// Combined state
export interface OrdersState {
  orders: OrdersEntityState;
  producer: ProducerState;
  filters: FiltersState;
}

// Entity adapter
export const ordersAdapter: EntityAdapter<Order> = createEntityAdapter<Order>({
  selectId: (order: Order) => order.id,
  sortComparer: false, // We'll handle sorting in selectors
});

// Initial states
const initialOrdersState: OrdersEntityState = ordersAdapter.getInitialState({
  loading: false,
  error: null,
});

const initialProducerState: ProducerState = {
  status: 'Stopped',
  generatedCount: 0,
  generationRate: 1,
  config: {
    interval: 1000,
    batchSize: 1,
  },
  lastGeneratedAt: null,
};

const initialFiltersState: FiltersState = {
  searchTerm: '',
  statusFilter: 'All',
  sortBy: 'createdAt',
  sortDirection: 'desc',
};

export const initialState: OrdersState = {
  orders: initialOrdersState,
  producer: initialProducerState,
  filters: initialFiltersState,
};

// Reducer
export const ordersReducer = createReducer(
  initialState,

  // Order CRUD
  on(OrdersActions.addOrder, (state, { order }) => ({
    ...state,
    orders: ordersAdapter.addOne(order, state.orders),
  })),

  on(OrdersActions.addOrders, (state, { orders }) => ({
    ...state,
    orders: ordersAdapter.addMany(orders, state.orders),
  })),

  on(OrdersActions.updateOrder, (state, { id, changes }) => ({
    ...state,
    orders: ordersAdapter.updateOne({ id, changes }, state.orders),
  })),

  on(OrdersActions.updateOrderStatus, (state, { id, status }) => ({
    ...state,
    orders: ordersAdapter.updateOne({ id, changes: { status } }, state.orders),
  })),

  on(OrdersActions.removeOrder, (state, { id }) => ({
    ...state,
    orders: ordersAdapter.removeOne(id, state.orders),
  })),

  on(OrdersActions.loadOrders, (state, { orders }) => ({
    ...state,
    orders: ordersAdapter.setAll(orders, state.orders),
  })),

  on(OrdersActions.clearOrders, (state) => ({
    ...state,
    orders: ordersAdapter.removeAll(state.orders),
    producer: {
      ...state.producer,
      generatedCount: 0,
      lastGeneratedAt: null,
    },
  })),

  // Producer control
  on(OrdersActions.startProducer, (state) => ({
    ...state,
    producer: {
      ...state.producer,
      status: 'Active',
    },
  })),

  on(OrdersActions.pauseProducer, (state) => ({
    ...state,
    producer: {
      ...state.producer,
      status: 'Paused',
    },
  })),

  on(OrdersActions.stopProducer, (state) => ({
    ...state,
    producer: {
      ...state.producer,
      status: 'Stopped',
    },
  })),

  on(OrdersActions.resetProducer, (state) => ({
    ...state,
    producer: {
      ...state.producer,
      generatedCount: 0,
      lastGeneratedAt: null,
    },
  })),

  on(OrdersActions.updateProducerConfig, (state, { config }) => {
    const newConfig = { ...state.producer.config, ...config };
    const rate = (newConfig.batchSize / newConfig.interval) * 1000;
    return {
      ...state,
      producer: {
        ...state.producer,
        config: newConfig,
        generationRate: rate,
      },
    };
  }),

  on(OrdersActions.updateGeneratedCount, (state, { count }) => ({
    ...state,
    producer: {
      ...state.producer,
      generatedCount: count,
      lastGeneratedAt: new Date(),
    },
  })),

  // Filters
  on(OrdersActions.setSearchTerm, (state, { searchTerm }) => ({
    ...state,
    filters: {
      ...state.filters,
      searchTerm,
    },
  })),

  on(OrdersActions.setStatusFilter, (state, { statusFilter }) => ({
    ...state,
    filters: {
      ...state.filters,
      statusFilter,
    },
  })),

  on(OrdersActions.setSortBy, (state, { sortBy }) => ({
    ...state,
    filters: {
      ...state.filters,
      sortBy,
    },
  })),

  on(OrdersActions.setSortDirection, (state, { direction }) => ({
    ...state,
    filters: {
      ...state.filters,
      sortDirection: direction,
    },
  })),

  on(OrdersActions.toggleSortDirection, (state) => ({
    ...state,
    filters: {
      ...state.filters,
      sortDirection: state.filters.sortDirection === 'asc' ? 'desc' : 'asc',
    },
  })),

  on(OrdersActions.resetFilters, (state) => ({
    ...state,
    filters: initialFiltersState,
  }))
);
