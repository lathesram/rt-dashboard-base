import { Component } from '@angular/core';
import { OrderSummaryComponent } from '../components/order-summary.component';

@Component({
  standalone: true,
  imports: [OrderSummaryComponent],
  selector: 'rt-order_summary-entry',
  template: `<rt-order-summary></rt-order-summary>`,
})
export class RemoteEntry {}
