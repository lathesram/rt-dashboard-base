import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Order } from '@rt-dashboard/shared/data-access-orders';
import * as OrderListActions from '../store/order-list.actions';
import * as OrderListSelectors from '../store/order-list.selectors';
import { SortField, SortDirection, StatusFilter } from '../store/order-list.state';

@Component({
  selector: 'rt-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, OnDestroy {
  // Observables from stores
  filteredOrders$: Observable<Order[]>;
  paginatedOrders$: Observable<Order[]>;
  searchQuery$: Observable<string>;
  statusFilter$: Observable<StatusFilter>;
  sortField$: Observable<SortField>;
  sortDirection$: Observable<SortDirection>;
  pageSize$: Observable<number>;
  currentPage$: Observable<number>;
  pageSizeOptions$: Observable<number[]>;
  renderCount$: Observable<number>;
  lastUpdated$: Observable<Date>;
  totalPages$: Observable<number>;
  filteredOrdersCount$: Observable<number>;
  
  // Current values for ngModel binding
  searchQuery = '';
  statusFilter: StatusFilter = 'All';
  sortField: SortField = 'createdAt';
  sortDirection: SortDirection = 'desc';
  pageSize = 25;
  currentPage = 1;
  totalPages = 1;
  
  // Subscription
  private subscriptions = new Subscription();
  
  constructor(private store: Store) {
    // Initialize observables
    this.filteredOrders$ = this.store.select(OrderListSelectors.selectFilteredOrders);
    this.paginatedOrders$ = this.store.select(OrderListSelectors.selectPaginatedOrders);
    this.searchQuery$ = this.store.select(OrderListSelectors.selectSearchQuery);
    this.statusFilter$ = this.store.select(OrderListSelectors.selectStatusFilter);
    this.sortField$ = this.store.select(OrderListSelectors.selectSortField);
    this.sortDirection$ = this.store.select(OrderListSelectors.selectSortDirection);
    this.pageSize$ = this.store.select(OrderListSelectors.selectPageSize);
    this.currentPage$ = this.store.select(OrderListSelectors.selectCurrentPage);
    this.pageSizeOptions$ = this.store.select(OrderListSelectors.selectPageSizeOptions);
    this.renderCount$ = this.store.select(OrderListSelectors.selectRenderCount);
    this.lastUpdated$ = this.store.select(OrderListSelectors.selectLastUpdated);
    this.totalPages$ = this.store.select(OrderListSelectors.selectTotalPages);
    this.filteredOrdersCount$ = this.store.select(OrderListSelectors.selectFilteredOrdersCount);
  }
  
  ngOnInit(): void {
    // Subscribe to store values for ngModel binding
    this.subscriptions.add(
      this.searchQuery$.subscribe(query => this.searchQuery = query)
    );
    
    this.subscriptions.add(
      this.statusFilter$.subscribe(filter => this.statusFilter = filter)
    );
    
    this.subscriptions.add(
      this.sortField$.subscribe(field => this.sortField = field)
    );
    
    this.subscriptions.add(
      this.sortDirection$.subscribe(direction => this.sortDirection = direction)
    );
    
    this.subscriptions.add(
      this.pageSize$.subscribe(size => this.pageSize = size)
    );
    
    this.subscriptions.add(
      this.currentPage$.subscribe(page => this.currentPage = page)
    );
    
    this.subscriptions.add(
      this.totalPages$.subscribe(pages => this.totalPages = pages)
    );
    
    // Increment render count on init
    this.store.dispatch(OrderListActions.incrementRenderCount());
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  
  onSearch(): void {
    this.store.dispatch(OrderListActions.setSearchQuery({ query: this.searchQuery }));
    this.store.dispatch(OrderListActions.incrementRenderCount());
  }
  
  onStatusFilterChange(): void {
    this.store.dispatch(OrderListActions.setStatusFilter({ filter: this.statusFilter }));
    this.store.dispatch(OrderListActions.incrementRenderCount());
  }
  
  onSortChange(field: SortField, direction: SortDirection): void {
    this.store.dispatch(OrderListActions.setSortField({ field }));
    this.store.dispatch(OrderListActions.setSortDirection({ direction }));
    this.store.dispatch(OrderListActions.incrementRenderCount());
  }
  
  onPageSizeChange(): void {
    this.store.dispatch(OrderListActions.setPageSize({ size: this.pageSize }));
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.store.dispatch(OrderListActions.setCurrentPage({ page }));
    }
  }
  
  previousPage(): void {
    if (this.currentPage > 1) {
      this.store.dispatch(OrderListActions.setCurrentPage({ page: this.currentPage - 1 }));
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.store.dispatch(OrderListActions.setCurrentPage({ page: this.currentPage + 1 }));
    }
  }
  
  get visiblePages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(this.totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }
  
  getStatusClass(status: Order['status']): string {
    return `status-${status.toLowerCase()}`;
  }
  
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }
  
  getRelativeTime(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return date.toLocaleDateString();
  }
  
  get secondsSinceUpdate(): number {
    return Math.floor((Date.now() - Date.now()) / 1000);
  }
}
