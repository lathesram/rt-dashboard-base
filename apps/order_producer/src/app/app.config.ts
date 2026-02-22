import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { appRoutes } from './app.routes';
import { orderProducerReducer } from './store/order-producer.reducer';
import { OrderProducerEffects } from './store/order-producer.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    // Root store for standalone mode only — remotes use provideState() when loaded via shell
    provideStore({ orderProducer: orderProducerReducer }),
    provideStoreDevtools({ maxAge: 25 }),
    provideEffects(OrderProducerEffects),
  ],
};
