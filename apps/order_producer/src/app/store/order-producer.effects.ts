import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { timer } from 'rxjs';
import { switchMap, withLatestFrom, concatMap, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import * as OrderProducerActions from './order-producer.actions';
import * as OrderProducerSelectors from './order-producer.selectors';
import { OrderBroadcastService, Order } from '../services/order-broadcast.service';

const CUSTOMERS = [
  'Alice Johnson', 'Bob Smith', 'Carol White', 'David Brown',
  'Emma Davis', 'Frank Miller', 'Grace Wilson', 'Henry Moore',
  'Isla Taylor', 'Jack Anderson',
];

const STATUSES: Order['status'][] = ['New', 'Processing', 'Completed'];

function generateOrder(sequenceStart: number, index: number): Order {
  const seq = sequenceStart + index + 1;
  return {
    id: `ORD-${String(seq).padStart(5, '0')}`,
    customer: CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)],
    amount: parseFloat((Math.random() * 490 + 10).toFixed(2)),
    status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
    createdAt: new Date(),
  };
}

@Injectable()
export class OrderProducerEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private broadcastService = inject(OrderBroadcastService);

  startGeneration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderProducerActions.startGeneration),
      switchMap(() =>
        this.store.select(OrderProducerSelectors.selectGenerationInterval).pipe(
          distinctUntilChanged(),
          switchMap((intervalMs) =>
            timer(0, intervalMs).pipe(
              withLatestFrom(
                this.store.select(OrderProducerSelectors.selectBatchSize),
                this.store.select(OrderProducerSelectors.selectOrdersGenerated)
              ),
              concatMap(([, batchSize, ordersGenerated]) => {
                const orders = Array.from({ length: batchSize }, (_, i) =>
                  generateOrder(ordersGenerated, i)
                );
                orders.forEach(order => this.broadcastService.broadcastOrder(order));
                return [
                  OrderProducerActions.incrementOrdersGenerated({ count: batchSize }),
                  OrderProducerActions.updateLastGenerated(),
                ];
              }),
            )
          ),
          takeUntil(
            this.actions$.pipe(
              ofType(OrderProducerActions.stopGeneration, OrderProducerActions.pauseGeneration)
            )
          ),
        )
      )
    )
  );
}
