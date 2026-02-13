import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrderProducerState } from './order-producer.state';

export const selectOrderProducerState = createFeatureSelector<OrderProducerState>('orderProducer');

export const selectGenerationStatus = createSelector(
  selectOrderProducerState,
  (state) => state.generationStatus
);

export const selectOrdersGenerated = createSelector(
  selectOrderProducerState,
  (state) => state.ordersGenerated
);

export const selectGenerationRate = createSelector(
  selectOrderProducerState,
  (state) => state.generationRate
);

export const selectLastGenerated = createSelector(
  selectOrderProducerState,
  (state) => state.lastGenerated
);

export const selectGenerationInterval = createSelector(
  selectOrderProducerState,
  (state) => state.generationInterval
);

export const selectBatchSize = createSelector(
  selectOrderProducerState,
  (state) => state.batchSize
);

export const selectIntervalOptions = createSelector(
  selectOrderProducerState,
  (state) => state.intervalOptions
);

export const selectBatchSizeOptions = createSelector(
  selectOrderProducerState,
  (state) => state.batchSizeOptions
);

export const selectIsConfigExpanded = createSelector(
  selectOrderProducerState,
  (state) => state.isConfigExpanded
);
