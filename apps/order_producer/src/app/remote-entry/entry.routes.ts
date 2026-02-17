import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { isDevMode } from '@angular/core';
import { RemoteEntry } from './entry';
import { ordersReducer } from '@rt-dashboard/shared/data-access-orders';
import { orderProducerReducer } from '../store/order-producer.reducer';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: RemoteEntry,
    providers: [
      provideState({ name: 'orders', reducer: ordersReducer }),
      provideState({ name: 'orderProducer', reducer: orderProducerReducer }),
      provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    ],
  },
];
