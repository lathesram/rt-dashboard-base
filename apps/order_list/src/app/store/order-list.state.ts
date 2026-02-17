export type SortField = 'id' | 'createdAt' | 'amount';
export type SortDirection = 'asc' | 'desc';
export type StatusFilter = 'All' | 'New' | 'Processing' | 'Completed';

export interface OrderListState {
  searchQuery: string;
  statusFilter: StatusFilter;
  sortField: SortField;
  sortDirection: SortDirection;
  pageSize: number;
  currentPage: number;
  pageSizeOptions: number[];
  renderCount: number;
  lastUpdated: Date;
}

export const initialOrderListState: OrderListState = {
  searchQuery: '',
  statusFilter: 'All',
  sortField: 'createdAt',
  sortDirection: 'desc',
  pageSize: 25,
  currentPage: 1,
  pageSizeOptions: [10, 25, 50, 100],
  renderCount: 0,
  lastUpdated: new Date()
};
