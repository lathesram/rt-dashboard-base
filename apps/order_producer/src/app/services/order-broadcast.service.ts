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
    console.log('[Broadcast Service] ===== BROADCASTING ORDER =====');
    console.log('[Broadcast Service] Order details:', order);
    console.log('[Broadcast Service] Window object:', typeof window);
    
    const event = new CustomEvent(this.ORDER_CREATED_EVENT, {
      detail: order,
      bubbles: true,
      composed: true
    });
    
    console.log('[Broadcast Service] CustomEvent created:', event);
    console.log('[Broadcast Service] Event type:', event.type);
    console.log('[Broadcast Service] Event detail:', event.detail);
    
    const dispatched = window.dispatchEvent(event);
    console.log('[Broadcast Service] Event dispatched on window:', dispatched);
    console.log('[Broadcast Service] ================================');
  }

  broadcastOrders(orders: Order[]): void {
    orders.forEach(order => this.broadcastOrder(order));
  }

  onOrderCreated(callback: (order: Order) => void): () => void {
    console.log('[Broadcast Service] Registering listener for:', this.ORDER_CREATED_EVENT);
    console.log('[Broadcast Service] Listener registered on window:', typeof window);
    
    const handler = (event: Event) => {
      console.log('[Broadcast Service] Event received!', event);
      const customEvent = event as CustomEvent<Order>;
      console.log('[Broadcast Service] Custom event detail:', customEvent.detail);
      callback(customEvent.detail);
    };
    
    window.addEventListener(this.ORDER_CREATED_EVENT, handler);
    console.log('[Broadcast Service] Listener registered successfully');
    
    // Return cleanup function
    return () => {
      console.log('[Broadcast Service] Removing listener');
      window.removeEventListener(this.ORDER_CREATED_EVENT, handler);
    };
  }
}
