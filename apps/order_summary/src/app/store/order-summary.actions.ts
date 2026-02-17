import { createAction, props } from '@ngrx/store';
import { TimeRange } from './order-summary.state';

export const setTimeRange = createAction(
  '[Order Summary] Set Time Range',
  props<{ timeRange: TimeRange }>()
);

export const updateLastUpdated = createAction(
  '[Order Summary] Update Last Updated'
);
