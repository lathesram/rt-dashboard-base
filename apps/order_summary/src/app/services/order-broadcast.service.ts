import { Injectable } from '@angular/core';

export interface Order {
  id: string;
  customer: string;
  amount: number;
  status: 'New' | 'Processing' | 'Completed';
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class OrderBroadcastService {
  private readonly ORDER_CREATED_EVENT = 'order-created';

  broadcastOrder(order: Order): void {
    const event = new CustomEvent(this.ORDER_CREATED_EVENT, {
      detail: order,
      bubbles: true,
      composed: true
    });
    window.dispatchEvent(event);
  }

  broadcastOrders(orders: Order[]): void {
    orders.forEach(order => this.broadcastOrder(order));
  }

  onOrderCreated(callback: (order: Order) => void): () => void {
    console.log('[Order Summary Broadcast Service] Registering listener for:', this.ORDER_CREATED_EVENT);
    
    const handler = (event: Event) => {
      console.log('[Order Summary Broadcast Service] Event received!', event);
      const customEvent = event as CustomEvent<Order>;
      console.log('[Order Summary Broadcast Service] Custom event detail:', customEvent.detail);
      callback(customEvent.detail);
    };
    
    window.addEventListener(this.ORDER_CREATED_EVENT, handler);
    console.log('[Order Summary Broadcast Service] Listener registered on window successfully');
    
    // Return cleanup function
    return () => {
      console.log('[Order Summary Broadcast Service] Removing listener');
      window.removeEventListener(this.ORDER_CREATED_EVENT, handler);
    };
  }
}
