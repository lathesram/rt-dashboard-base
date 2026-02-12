import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OrdersActions } from './orders.actions';
import {
  selectAllOrders,
  selectFilteredOrders,
  selectOrderById,
  selectOrderSummary,
  selectProducerStatus,
  selectGeneratedCount,
  selectGenerationRate,
  selectProducerConfig,
  selectLastGeneratedAt,
  selectFiltersState,
  selectSearchTerm,
  selectStatusFilter,
  selectSortBy,
  selectSortDirection,
  selectOrdersLoading,
  selectOrdersError,
  selectTotalOrders,
  selectIsProducerActive,
  selectCanStartProducer,
  selectProducerState,
} from './orders.selectors';
import { Order, OrderSummary, ProducerState, ProducerConfig, FiltersState, OrderStatus, SortField, SortDirection, StatusFilter, ProducerStatus } from './models';

/**
 * Facade service for Orders state management
 * Provides a clean API for components to interact with the store
 */
@Injectable({
  providedIn: 'root'
})
export class OrdersFacade {
  // Order observables
  allOrders$: Observable<Order[]> = this.store.select(selectAllOrders);
  filteredOrders$: Observable<Order[]> = this.store.select(selectFilteredOrders);
  totalOrders$: Observable<number> = this.store.select(selectTotalOrders);
  ordersLoading$: Observable<boolean> = this.store.select(selectOrdersLoading);
  ordersError$: Observable<string | null> = this.store.select(selectOrdersError);

  // Producer observables
  producerState$: Observable<ProducerState> = this.store.select(selectProducerState);
  producerStatus$: Observable<ProducerStatus> = this.store.select(selectProducerStatus);
  generatedCount$: Observable<number> = this.store.select(selectGeneratedCount);
  generationRate$: Observable<number> = this.store.select(selectGenerationRate);
  producerConfig$: Observable<ProducerConfig> = this.store.select(selectProducerConfig);
  lastGeneratedAt$: Observable<Date | null> = this.store.select(selectLastGeneratedAt);
  isProducerActive$: Observable<boolean> = this.store.select(selectIsProducerActive);
  canStartProducer$: Observable<boolean> = this.store.select(selectCanStartProducer);

  // Filter observables
  filtersState$: Observable<FiltersState> = this.store.select(selectFiltersState);
  searchTerm$: Observable<string> = this.store.select(selectSearchTerm);
  statusFilter$: Observable<StatusFilter> = this.store.select(selectStatusFilter);
  sortBy$: Observable<SortField> = this.store.select(selectSortBy);
  sortDirection$: Observable<SortDirection> = this.store.select(selectSortDirection);

  // Summary observables
  orderSummary$: Observable<OrderSummary> = this.store.select(selectOrderSummary);

  constructor(private store: Store) {}

  // Order actions
  addOrder(order: Order): void {
    this.store.dispatch(OrdersActions.addOrder({ order }));
  }

  addOrders(orders: Order[]): void {
    this.store.dispatch(OrdersActions.addOrders({ orders }));
  }

  updateOrder(id: string, changes: Partial<Order>): void {
    this.store.dispatch(OrdersActions.updateOrder({ id, changes }));
  }

  updateOrderStatus(id: string, status: OrderStatus): void {
    this.store.dispatch(OrdersActions.updateOrderStatus({ id, status }));
  }

  removeOrder(id: string): void {
    this.store.dispatch(OrdersActions.removeOrder({ id }));
  }

  loadOrders(orders: Order[]): void {
    this.store.dispatch(OrdersActions.loadOrders({ orders }));
  }

  clearOrders(): void {
    this.store.dispatch(OrdersActions.clearOrders());
  }

  // Producer actions
  startProducer(): void {
    this.store.dispatch(OrdersActions.startProducer());
  }

  pauseProducer(): void {
    this.store.dispatch(OrdersActions.pauseProducer());
  }

  stopProducer(): void {
    this.store.dispatch(OrdersActions.stopProducer());
  }

  resetProducer(): void {
    this.store.dispatch(OrdersActions.resetProducer());
  }

  updateProducerConfig(config: Partial<ProducerConfig>): void {
    this.store.dispatch(OrdersActions.updateProducerConfig({ config }));
  }

  // Filter actions
  setSearchTerm(searchTerm: string): void {
    this.store.dispatch(OrdersActions.setSearchTerm({ searchTerm }));
  }

  setStatusFilter(statusFilter: StatusFilter): void {
    this.store.dispatch(OrdersActions.setStatusFilter({ statusFilter }));
  }

  setSortBy(sortBy: SortField): void {
    this.store.dispatch(OrdersActions.setSortBy({ sortBy }));
  }

  setSortDirection(direction: SortDirection): void {
    this.store.dispatch(OrdersActions.setSortDirection({ direction }));
  }

  toggleSortDirection(): void {
    this.store.dispatch(OrdersActions.toggleSortDirection());
  }

  resetFilters(): void {
    this.store.dispatch(OrdersActions.resetFilters());
  }

  // Selector methods
  getOrderById(id: string): Observable<Order | undefined> {
    return this.store.select(selectOrderById(id));
  }
}
