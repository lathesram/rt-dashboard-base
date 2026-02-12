// Order domain models
export interface Order {
  id: string;
  customer: string;
  amount: number;
  status: 'New' | 'Processing' | 'Completed';
  createdAt: Date;
}

export type OrderStatus = 'New' | 'Processing' | 'Completed';

// Producer state
export type ProducerStatus = 'Active' | 'Paused' | 'Stopped';

export interface ProducerConfig {
  interval: number;  // milliseconds
  batchSize: number; // orders per batch
}

export interface ProducerState {
  status: ProducerStatus;
  generatedCount: number;
  generationRate: number; // calculated rate
  config: ProducerConfig;
  lastGeneratedAt: Date | null;
}

// Filters state
export type SortField = 'id' | 'createdAt' | 'amount';
export type SortDirection = 'asc' | 'desc';
export type StatusFilter = 'All' | 'New' | 'Processing' | 'Completed';

export interface FiltersState {
  searchTerm: string;
  statusFilter: StatusFilter;
  sortBy: SortField;
  sortDirection: SortDirection;
}

// Order summary (computed)
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
  performance: {
    computationCount: number;
    lastCalculationMs: number;
  };
}
