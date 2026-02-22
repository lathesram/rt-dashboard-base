import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import { RemoteEntry } from './entry';
import { orderSummaryReducer } from '../store/order-summary.reducer';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: RemoteEntry,
    providers: [
      provideState('orderSummary', orderSummaryReducer),
    ]
  }
];
