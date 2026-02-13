import { Component, OnInit } from '@angular/core';
import { OrderSummaryComponent } from '../components/order-summary.component';
import { OrderSummaryInitService } from '../services/order-summary-init.service';

@Component({
  standalone: true,
  imports: [OrderSummaryComponent],
  selector: 'rt-order_summary-entry',
  template: `<rt-order-summary></rt-order-summary>`,
})
export class RemoteEntry implements OnInit {
  constructor(private initService: OrderSummaryInitService) {
    console.log('[Order Summary Entry] ===== ENTRY CONSTRUCTOR =====');
    console.log('[Order Summary Entry] Init service injected:', !!initService);
  }
  
  ngOnInit(): void {
    console.log('[Order Summary Entry] ===== ENTRY ngOnInit =====');
    console.log('[Order Summary Entry] Listener should be active now');
  }
}
