import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { interval, EMPTY } from 'rxjs';
import { switchMap, withLatestFrom, takeUntil } from 'rxjs/operators';
import { OrdersActions } from './orders.actions';
import { selectProducerConfig, selectGeneratedCount, selectProducerStatus } from './orders.selectors';
import { Order } from './models';

@Injectable()
export class OrdersEffects {
  // Customer names for random generation
  private readonly customerNames = [
    'John Smith', 'Jane Johnson', 'Alice Williams', 'Bob Brown', 'Charlie Jones',
    'Diana Garcia', 'Eve Miller', 'Frank Davis', 'Grace Rodriguez', 'Henry Martinez',
    'Ivy Anderson', 'Jack Taylor', 'Kate Thomas', 'Leo Jackson', 'Mia White',
    'Noah Harris', 'Olivia Martin', 'Peter Thompson', 'Quinn Garcia', 'Rachel Martinez'
  ];

  // Order generation effect
  generateOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.startProducer),
      switchMap(() =>
        this.store.select(selectProducerConfig).pipe(
          switchMap(config =>
            interval(config.interval).pipe(
              withLatestFrom(
                this.store.select(selectGeneratedCount),
                this.store.select(selectProducerStatus)
              ),
              switchMap(([, currentCount, status]) => {
                // Stop if paused or stopped
                if (status !== 'Active') {
                  return EMPTY;
                }

                // Generate batch of orders
                const orders = this.generateOrderBatch(config.batchSize, currentCount);
                const newCount = currentCount + orders.length;

                return [
                  OrdersActions.addOrders({ orders }),
                  OrdersActions.updateGeneratedCount({ count: newCount })
                ];
              }),
              takeUntil(
                this.actions$.pipe(
                  ofType(
                    OrdersActions.pauseProducer,
                    OrdersActions.stopProducer
                  )
                )
              )
            )
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store
  ) {}

  /**
   * Generate a batch of random orders
   */
  private generateOrderBatch(batchSize: number, startIndex: number): Order[] {
    const orders: Order[] = [];
    
    for (let i = 0; i < batchSize; i++) {
      const orderNumber = startIndex + i + 1;
      orders.push(this.generateRandomOrder(orderNumber));
    }

    return orders;
  }

  /**
   * Generate a single random order
   */
  private generateRandomOrder(orderNumber: number): Order {
    const statusRand = Math.random();
    const status = statusRand < 0.4 ? 'New' : statusRand < 0.75 ? 'Processing' : 'Completed';
    
    return {
      id: `ORD-${String(orderNumber).padStart(5, '0')}`,
      customer: this.getRandomCustomerName(),
      amount: this.getRandomAmount(),
      status,
      createdAt: new Date(),
    };
  }

  /**
   * Get random customer name
   */
  private getRandomCustomerName(): string {
    return this.customerNames[Math.floor(Math.random() * this.customerNames.length)];
  }

  /**
   * Get random order amount between $50 and $5000
   */
  private getRandomAmount(): number {
    return Math.floor(Math.random() * 4950) + 50;
  }
}
