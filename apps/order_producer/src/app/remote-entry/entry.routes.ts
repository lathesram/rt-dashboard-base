import { Route } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { RemoteEntry } from './entry';
import { orderProducerReducer } from '../store/order-producer.reducer';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: RemoteEntry,
    providers: [
      provideStore({ orderProducer: orderProducerReducer }),
      provideStoreDevtools({ maxAge: 25 })
    ]
  }
];
