import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import { RemoteEntry } from './entry';
import { orderListReducer } from '../store/order-list.reducer';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: RemoteEntry,
    providers: [
      provideState('orderList', orderListReducer),
    ]
  }
];
