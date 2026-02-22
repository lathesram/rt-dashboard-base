import { Injectable, OnDestroy, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { interval, Subscription, combineLatest } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { Order, OrdersFacade } from '@rt-dashboard/shared/data-access-orders';
import * as OrderProducerSelectors from '../store/order-producer.selectors';
import * as OrderProducerActions from '../store/order-producer.actions';

/**
 * Service that manages order generation independently of component lifecycle.
 * This ensures order generation continues even when navigating away from the producer page.
 */
@Injectable({
  providedIn: 'root'
})
export class OrderGenerationService implements OnDestroy {
  private store = inject(Store);
  private ordersFacade = inject(OrdersFacade);

  private subscriptions = new Subscription();
  private generationTimer?: Subscription;
  private currentInterval = 1000;
  private currentBatchSize = 1;
  private orderCounter = 1;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize the service by subscribing to store state changes.
   * Batch size updates independently so the timer isn't restarted needlessly.
   * Status + interval are combined so the timer always uses the latest interval.
   */
  private initialize(): void {
    // Track batch size changes without restarting the timer
    this.subscriptions.add(
      this.store.select(OrderProducerSelectors.selectBatchSize)
        .pipe(distinctUntilChanged())
        .subscribe(batchSize => {
          this.currentBatchSize = batchSize;
        })
    );

    // Start/stop/restart the timer when status or interval changes
    this.subscriptions.add(
      combineLatest([
        this.store.select(OrderProducerSelectors.selectGenerationStatus),
        this.store.select(OrderProducerSelectors.selectGenerationInterval).pipe(distinctUntilChanged()),
      ]).subscribe(([status, genInterval]) => {
        this.currentInterval = genInterval;
        if (status === 'Active') {
          // Restarts with the new interval (stopGenerationTimer is called inside)
          this.startGenerationTimer();
        } else {
          this.stopGenerationTimer();
        }
      })
    );
  }
  
  /**
   * Start the generation timer with the current interval
   */
  private startGenerationTimer(): void {
    this.stopGenerationTimer();
    
    this.generationTimer = interval(this.currentInterval)
      .subscribe(() => {
        this.generateOrders();
      });
  }
  
  /**
   * Stop the generation timer
   */
  private stopGenerationTimer(): void {
    if (this.generationTimer) {
      this.generationTimer.unsubscribe();
      this.generationTimer = undefined;
    }
  }
  
  /**
   * Generate a batch of random orders and dispatch them to the store
   */
  private generateOrders(): void {
    const orders: Order[] = [];
    const customerNames = [
      'John Smith', 'Jane Johnson', 'Alice Williams', 'Bob Brown', 'Charlie Jones',
      'Diana Garcia', 'Eve Miller', 'Frank Davis', 'Grace Rodriguez', 'Henry Martinez'
    ];
    const statuses: ('New' | 'Processing' | 'Completed')[] = ['New', 'Processing', 'Completed'];
    
    for (let i = 0; i < this.currentBatchSize; i++) {
      const orderId = `ORD-${String(this.orderCounter++).padStart(5, '0')}`;
      const order: Order = {
        id: orderId,
        customer: customerNames[Math.floor(Math.random() * customerNames.length)],
        amount: Math.floor(Math.random() * 4950) + 50,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: new Date()
      };
      orders.push(order);
    }
    
    // Dispatch orders to global store
    this.ordersFacade.addOrders(orders);
    
    // Update local producer state
    this.store.dispatch(OrderProducerActions.incrementOrdersGenerated({ count: this.currentBatchSize }));
    this.store.dispatch(OrderProducerActions.updateLastGenerated());
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.stopGenerationTimer();
  }
}
