export interface OrderSummary {
  total: number;
  byStatus: { new: number; processing: number; completed: number };
  revenue: { total: number; average: number; highest: number };
  trends: { totalChange: number; newToday: number; completedToday: number };
}

export type TimeRange = 'hour' | 'day' | 'week' | 'all';

export interface OrderSummaryState {
  summary: OrderSummary;
  selectedTimeRange: TimeRange;
  lastUpdated: Date;
  isAutoRefresh: boolean;
  timeRangeOptions: { label: string; value: TimeRange }[];
}

export const initialOrderSummaryState: OrderSummaryState = {
  summary: {
    total: 0,
    byStatus: { new: 0, processing: 0, completed: 0 },
    revenue: { total: 0, average: 0, highest: 0 },
    trends: { totalChange: 0, newToday: 0, completedToday: 0 }
  },
  selectedTimeRange: 'day',
  lastUpdated: new Date(),
  isAutoRefresh: true,
  timeRangeOptions: [
    { label: 'Last Hour', value: 'hour' },
    { label: 'Last 24h', value: 'day' },
    { label: 'Last 7 days', value: 'week' },
    { label: 'All Time', value: 'all' }
  ]
};
