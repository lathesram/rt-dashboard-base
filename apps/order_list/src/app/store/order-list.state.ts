export interface Order {
  id: string;
  customer: string;
  amount: number;
  status: 'New' | 'Processing' | 'Completed';
  createdAt: Date;
}

export type SortField = 'id' | 'timestamp' | 'amount';
export type SortDirection = 'asc' | 'desc';

export interface OrderListState {
  allOrders: Order[];
  displayedOrders: Order[];
  isLoading: boolean;
  renderCount: number;
  lastUpdated: Date;
  searchQuery: string;
  statusFilter: 'All' | 'New' | 'Processing' | 'Completed';
  sortField: SortField;
  sortDirection: SortDirection;
  pageSize: number;
  currentPage: number;
  pageSizeOptions: number[];
}

export const initialOrderListState: OrderListState = {
  allOrders: [],
  displayedOrders: [],
  isLoading: false,
  renderCount: 0,
  lastUpdated: new Date(),
  searchQuery: '',
  statusFilter: 'All',
  sortField: 'id',
  sortDirection: 'desc',
  pageSize: 25,
  currentPage: 1,
  pageSizeOptions: [10, 25, 50, 100]
};
