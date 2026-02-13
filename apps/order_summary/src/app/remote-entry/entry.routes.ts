import { Route } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { RemoteEntry } from './entry';
import { orderSummaryReducer } from '../store/order-summary.reducer';
import { OrderSummaryInitService } from '../services/order-summary-init.service';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: RemoteEntry,
    providers: [
      provideStore({ orderSummary: orderSummaryReducer }),
      provideStoreDevtools({ maxAge: 25 }),
      OrderSummaryInitService // Scoped to this route
    ]
  }
];
