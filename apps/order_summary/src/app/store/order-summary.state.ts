export type TimeRange = 'hour' | 'day' | 'week' | 'all';

export interface OrderSummaryState {
  selectedTimeRange: TimeRange;
  lastUpdated: Date;
  timeRangeOptions: { label: string; value: TimeRange }[];
}

export const initialOrderSummaryState: OrderSummaryState = {
  selectedTimeRange: 'day',
  lastUpdated: new Date(),
  timeRangeOptions: [
    { label: 'Last Hour', value: 'hour' },
    { label: 'Last 24h', value: 'day' },
    { label: 'Last 7 days', value: 'week' },
    { label: 'All Time', value: 'all' }
  ]
};
