import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { isDevMode } from '@angular/core';
import { RemoteEntry } from './entry';
import { ordersReducer } from '@rt-dashboard/shared/data-access-orders';
import { orderSummaryReducer } from '../store/order-summary.reducer';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: RemoteEntry,
    providers: [
      provideState({ name: 'orders', reducer: ordersReducer }),
      provideState({ name: 'orderSummary', reducer: orderSummaryReducer }),
      provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    ],
  },
];
