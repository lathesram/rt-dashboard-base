import { createReducer, on } from '@ngrx/store';
import { OrderProducerState, initialOrderProducerState } from './order-producer.state';
import * as OrderProducerActions from './order-producer.actions';

export const orderProducerReducer = createReducer(
  initialOrderProducerState,

  on(OrderProducerActions.startGeneration, (state): OrderProducerState => ({
    ...state,
    generationStatus: 'Active'
  })),

  on(OrderProducerActions.stopGeneration, (state): OrderProducerState => ({
    ...state,
    generationStatus: 'Stopped'
  })),

  on(OrderProducerActions.pauseGeneration, (state): OrderProducerState => ({
    ...state,
    generationStatus: 'Paused'
  })),

  on(OrderProducerActions.resetCounter, (state): OrderProducerState => ({
    ...state,
    ordersGenerated: 0
  })),

  on(OrderProducerActions.setGenerationInterval, (state, { interval }): OrderProducerState => {
    const rate = (state.batchSize / interval) * 1000;
    return {
      ...state,
      generationInterval: interval,
      generationRate: `${rate.toFixed(2)} orders/sec`
    };
  }),

  on(OrderProducerActions.setBatchSize, (state, { size }): OrderProducerState => {
    const rate = (size / state.generationInterval) * 1000;
    return {
      ...state,
      batchSize: size,
      generationRate: `${rate.toFixed(2)} orders/sec`
    };
  }),

  on(OrderProducerActions.toggleConfig, (state): OrderProducerState => ({
    ...state,
    isConfigExpanded: !state.isConfigExpanded
  })),

  on(OrderProducerActions.incrementOrdersGenerated, (state, { count }): OrderProducerState => ({
    ...state,
    ordersGenerated: state.ordersGenerated + count
  })),

  on(OrderProducerActions.updateLastGenerated, (state): OrderProducerState => ({
    ...state,
    lastGenerated: new Date()
  }))
);
