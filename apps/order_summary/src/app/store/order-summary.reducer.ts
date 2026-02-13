import { createReducer, on } from '@ngrx/store';
import { initialOrderSummaryState } from './order-summary.state';
import * as OrderSummaryActions from './order-summary.actions';

export const orderSummaryReducer = createReducer(
  initialOrderSummaryState,
  
  on(OrderSummaryActions.setTimeRange, (state, { timeRange }) => ({
    ...state,
    selectedTimeRange: timeRange,
    lastUpdated: new Date()
  })),
  
  on(OrderSummaryActions.updateSummary, (state, { summary }) => ({
    ...state,
    summary,
    lastUpdated: new Date()
  })),
  
  on(OrderSummaryActions.toggleAutoRefresh, (state) => ({
    ...state,
    isAutoRefresh: !state.isAutoRefresh
  })),
  
  on(OrderSummaryActions.refreshSummary, (state) => ({
    ...state,
    lastUpdated: new Date()
  })),

  on(OrderSummaryActions.addOrder, (state, { order }) => {
    console.log('[Order Summary Reducer] addOrder action received');
    console.log('[Order Summary Reducer] Current total:', state.summary.total);
    console.log('[Order Summary Reducer] Order details:', order);
    
    // Deep copy nested objects for immutability
    const newByStatus = { ...state.summary.byStatus };
    const newRevenue = { ...state.summary.revenue };
    const newTrends = { ...state.summary.trends };
    
    let newTotal = state.summary.total + 1;
    
    // Update by status
    if (order.status === 'New') {
      newByStatus.new += 1;
      newTrends.newToday += 1;
    } else if (order.status === 'Processing') {
      newByStatus.processing += 1;
    } else if (order.status === 'Completed') {
      newByStatus.completed += 1;
      newTrends.completedToday += 1;
    }
    
    // Update revenue
    newRevenue.total += order.amount;
    newRevenue.average = newRevenue.total / newTotal;
    if (order.amount > newRevenue.highest) {
      newRevenue.highest = order.amount;
    }
    
    // Update trends
    newTrends.totalChange += 1;
    
    const newSummary = {
      total: newTotal,
      byStatus: newByStatus,
      revenue: newRevenue,
      trends: newTrends
    };
    
    console.log('[Order Summary Reducer] New total:', newSummary.total);
    console.log('[Order Summary Reducer] New revenue total:', newSummary.revenue.total);
    console.log('[Order Summary Reducer] New summary object:', newSummary);
    
    return {
      ...state,
      summary: newSummary,
      lastUpdated: new Date()
    };
  })
);
