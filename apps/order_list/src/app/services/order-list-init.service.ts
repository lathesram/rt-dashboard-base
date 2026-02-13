import { Injectable, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { OrderBroadcastService } from './order-broadcast.service';
import * as OrderListActions from '../store/order-list.actions';

@Injectable()
export class OrderListInitService {
  private initialized = false;

  constructor(
    private orderBroadcastService: OrderBroadcastService,
    private store: Store,
    private ngZone: NgZone
  ) {
    console.log('[Order List Init Service] ===== SERVICE CONSTRUCTOR CALLED =====');
    console.log('[Order List Init Service] Store:', this.store);
    console.log('[Order List Init Service] Broadcast Service:', this.orderBroadcastService);
    this.initialize();
  }

  private initialize(): void {
    if (this.initialized) {
      console.log('[Order List Init Service] Already initialized, skipping');
      return;
    }

    console.log('[Order List Init Service] Initializing persistent listener');
    
    // Set up persistent listener that lasts for the lifetime of the app
    this.orderBroadcastService.onOrderCreated((order) => {
      this.ngZone.run(() => {
        console.log('[Order List Init Service] ===== RECEIVED ORDER =====', order);
        console.log('[Order List Init Service] Store available:', !!this.store);
        console.log('[Order List Init Service] Dispatching addOrder action...');
        this.store.dispatch(OrderListActions.addOrder({ order }));
        console.log('[Order List Init Service] Dispatching applyFiltersAndSort action...');
        this.store.dispatch(OrderListActions.applyFiltersAndSort());
        console.log('[Order List Init Service] Actions dispatched successfully for:', order.id);
      });
    });

    this.initialized = true;
    console.log('[Order List Init Service] Initialization complete - listener is now persistent');
  }
}
