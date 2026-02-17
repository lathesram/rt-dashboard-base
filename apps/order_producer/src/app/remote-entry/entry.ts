import { Component } from '@angular/core';
import { OrderProducerComponent } from '../components/order-producer.component';
import { OrderGenerationService } from '../services/order-generation.service';

@Component({
  standalone: true,
  imports: [OrderProducerComponent],
  selector: 'rt-order_producer-entry',
  template: `<rt-order-producer></rt-order-producer>`,
})
export class RemoteEntry {
  // Inject the service to ensure it's instantiated and starts listening to store changes
  constructor(private orderGenerationService: OrderGenerationService) {}
}
