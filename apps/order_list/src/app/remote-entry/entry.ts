import { Component } from '@angular/core';
import { OrderListComponent } from '../components/order-list.component';

@Component({
  standalone: true,
  imports: [OrderListComponent],
  selector: 'rt-order_list-entry',
  template: `<rt-order-list></rt-order-list>`,
})
export class RemoteEntry {}
