import { Component, OnInit } from '@angular/core';
import { OrderListComponent } from '../components/order-list.component';
import { OrderListInitService } from '../services/order-list-init.service';

@Component({
  standalone: true,
  imports: [OrderListComponent],
  selector: 'rt-order_list-entry',
  template: `<rt-order-list></rt-order-list>`,
})
export class RemoteEntry implements OnInit {
  constructor(private initService: OrderListInitService) {
    console.log('[Order List Entry] ===== ENTRY CONSTRUCTOR =====');
    console.log('[Order List Entry] Init service injected:', !!initService);
  }
  
  ngOnInit(): void {
    console.log('[Order List Entry] ===== ENTRY ngOnInit =====');
    console.log('[Order List Entry] Listener should be active now');
  }
}
