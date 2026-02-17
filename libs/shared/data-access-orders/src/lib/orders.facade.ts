import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OrdersActions } from './orders.actions';
import {
  selectAllOrders,
  selectOrderById,
  selectOrderSummary,
  selectOrdersByStatus,
  selectOrdersLoading,
  selectOrdersError,
  selectTotalOrders,
} from './orders.selectors';
import { Order, OrderSummary } from './models';

/**
 * Facade service for Orders state management
 * Provides a clean API for components to interact with the global store
 */
@Injectable({
  providedIn: 'root'
})
export class OrdersFacade {
  // Order observables
  allOrders$: Observable<Order[]>;
  totalOrders$: Observable<number>;
  ordersLoading$: Observable<boolean>;
  ordersError$: Observable<string | null>;
  orderSummary$: Observable<OrderSummary>;

  constructor(private store: Store) {
    this.allOrders$ = this.store.select(selectAllOrders);
    this.totalOrders$ = this.store.select(selectTotalOrders);
    this.ordersLoading$ = this.store.select(selectOrdersLoading);
    this.ordersError$ = this.store.select(selectOrdersError);
    this.orderSummary$ = this.store.select(selectOrderSummary);
  }

  // Order selectors with parameters
  getOrderById(id: string): Observable<Order | undefined> {
    return this.store.select(selectOrderById(id));
  }

  getOrdersByStatus(status: 'New' | 'Processing' | 'Completed'): Observable<Order[]> {
    return this.store.select(selectOrdersByStatus(status));
  }

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

  removeOrder(id: string): void {
    this.store.dispatch(OrdersActions.removeOrder({ id }));
  }

  loadOrders(orders: Order[]): void {
    this.store.dispatch(OrdersActions.loadOrders({ orders }));
  }

  clearOrders(): void {
    this.store.dispatch(OrdersActions.clearOrders());
  }
}
