import { createReducer, on } from '@ngrx/store';
import { initialOrderProducerState } from './order-producer.state';
import * as OrderProducerActions from './order-producer.actions';

function calculateGenerationRate(batchSize: number, interval: number): string {
  const rate = (batchSize / interval) * 1000;
  return `${rate.toFixed(2)} orders/sec`;
}

export const orderProducerReducer = createReducer(
  initialOrderProducerState,
  
  on(OrderProducerActions.startGeneration, (state) => ({
    ...state,
    generationStatus: 'Active' as const
  })),
  
  on(OrderProducerActions.stopGeneration, (state) => ({
    ...state,
    generationStatus: 'Stopped' as const
  })),
  
  on(OrderProducerActions.pauseGeneration, (state) => ({
    ...state,
    generationStatus: 'Paused' as const
  })),
  
  on(OrderProducerActions.resetCounter, (state) => ({
    ...state,
    ordersGenerated: 0
  })),
  
  on(OrderProducerActions.setGenerationInterval, (state, { interval }) => ({
    ...state,
    generationInterval: interval,
    generationRate: calculateGenerationRate(state.batchSize, interval)
  })),
  
  on(OrderProducerActions.setBatchSize, (state, { size }) => ({
    ...state,
    batchSize: size,
    generationRate: calculateGenerationRate(size, state.generationInterval)
  })),
  
  on(OrderProducerActions.toggleConfig, (state) => ({
    ...state,
    isConfigExpanded: !state.isConfigExpanded
  })),
  
  on(OrderProducerActions.incrementOrdersGenerated, (state, { count }) => ({
    ...state,
    ordersGenerated: state.ordersGenerated + count
  })),
  
  on(OrderProducerActions.updateLastGenerated, (state) => ({
    ...state,
    lastGenerated: new Date()
  }))
);
