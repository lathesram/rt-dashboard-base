import { Component } from '@angular/core';
import { OrderProducerComponent } from '../components/order-producer.component';

@Component({
  standalone: true,
  imports: [OrderProducerComponent],
  selector: 'rt-order_producer-entry',
  template: `<rt-order-producer></rt-order-producer>`,
})
export class RemoteEntry {}
