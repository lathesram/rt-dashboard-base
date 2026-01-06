import { Route } from '@angular/router';
import { HomeComponent } from './components/home.component';

export const appRoutes: Route[] = [
  {
    path: 'order_summary',
    loadChildren: () =>
      import('order_summary/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'order_list',
    loadChildren: () =>
      import('order_list/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'order_producer',
    loadChildren: () =>
      import('order_producer/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: '',
    component: HomeComponent,
  },
];
