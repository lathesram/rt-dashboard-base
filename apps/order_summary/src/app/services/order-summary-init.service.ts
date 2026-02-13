import { Injectable, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { OrderBroadcastService } from './order-broadcast.service';
import * as OrderSummaryActions from '../store/order-summary.actions';

@Injectable()
export class OrderSummaryInitService {
  private initialized = false;

  constructor(
    private orderBroadcastService: OrderBroadcastService,
    private store: Store,
    private ngZone: NgZone
  ) {
    console.log('[Order Summary Init Service] ===== SERVICE CONSTRUCTOR CALLED =====');
    console.log('[Order Summary Init Service] Store:', this.store);
    console.log('[Order Summary Init Service] Broadcast Service:', this.orderBroadcastService);
    this.initialize();
  }

  private initialize(): void {
    if (this.initialized) {
      console.log('[Order Summary Init Service] Already initialized, skipping');
      return;
    }

    console.log('[Order Summary Init Service] Initializing persistent listener');
    
    // Set up persistent listener that lasts for the lifetime of the app
    this.orderBroadcastService.onOrderCreated((order) => {
      this.ngZone.run(() => {
        console.log('[Order Summary Init Service] ===== RECEIVED ORDER =====', order);
        console.log('[Order Summary Init Service] Store available:', !!this.store);
        console.log('[Order Summary Init Service] Dispatching addOrder action...');
        this.store.dispatch(OrderSummaryActions.addOrder({ 
          order: { 
            status: order.status, 
            amount: order.amount 
          } 
        }));
        console.log('[Order Summary Init Service] Action dispatched successfully for:', order.id);
      });
    });

    this.initialized = true;
    console.log('[Order Summary Init Service] Initialization complete - listener is now persistent');
  }
}
