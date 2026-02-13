import { Route } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { RemoteEntry } from './entry';
import { orderListReducer } from '../store/order-list.reducer';
import { OrderListInitService } from '../services/order-list-init.service';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: RemoteEntry,
    providers: [
      provideStore({ orderList: orderListReducer }),
      provideStoreDevtools({ maxAge: 25 }),
      OrderListInitService // Scoped to this route
    ]
  }
];
