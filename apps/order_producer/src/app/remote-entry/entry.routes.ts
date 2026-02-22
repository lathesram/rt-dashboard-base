import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { RemoteEntry } from './entry';
import { orderProducerReducer } from '../store/order-producer.reducer';
import { OrderProducerEffects } from '../store/order-producer.effects';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: RemoteEntry,
    providers: [
      provideState('orderProducer', orderProducerReducer),
      provideEffects(OrderProducerEffects),
    ]
  }
];
