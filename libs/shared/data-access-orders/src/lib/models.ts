export interface Order {
  id: string;
  customer: string;
  amount: number;
  status: OrderStatus;
  createdAt: Date;
}

export type OrderStatus = 'New' | 'Processing' | 'Completed';
export type StatusFilter = 'All' | OrderStatus;
export type SortField = 'id' | 'createdAt' | 'amount';
export type SortDirection = 'asc' | 'desc';
export type ProducerStatus = 'Active' | 'Paused' | 'Stopped';

export interface ProducerConfig {
  interval: number;
  batchSize: number;
}

export interface ProducerState {
  status: ProducerStatus;
  generatedCount: number;
  generationRate: number;
  config: ProducerConfig;
  lastGeneratedAt: Date | null;
}

export interface FiltersState {
  searchTerm: string;
  statusFilter: StatusFilter;
  sortBy: SortField;
  sortDirection: SortDirection;
}

export interface OrderSummary {
  total: number;
  byStatus: {
    new: number;
    processing: number;
    completed: number;
  };
  revenue: {
    total: number;
    average: number;
    highest: number;
  };
  trends: {
    totalChange: number;
    newToday: number;
    completedToday: number;
  };
}
