import { createAction, props } from '@ngrx/store';

export const startGeneration = createAction(
  '[Order Producer] Start Generation'
);

export const stopGeneration = createAction(
  '[Order Producer] Stop Generation'
);

export const pauseGeneration = createAction(
  '[Order Producer] Pause Generation'
);

export const resetCounter = createAction(
  '[Order Producer] Reset Counter'
);

export const setGenerationInterval = createAction(
  '[Order Producer] Set Generation Interval',
  props<{ interval: number }>()
);

export const setBatchSize = createAction(
  '[Order Producer] Set Batch Size',
  props<{ size: number }>()
);

export const toggleConfig = createAction(
  '[Order Producer] Toggle Config'
);

export const incrementOrdersGenerated = createAction(
  '[Order Producer] Increment Orders Generated',
  props<{ count: number }>()
);

export const updateLastGenerated = createAction(
  '[Order Producer] Update Last Generated'
);
