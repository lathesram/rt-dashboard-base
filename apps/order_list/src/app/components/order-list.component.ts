import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Order, SortField, SortDirection } from '../store/order-list.state';
import * as OrderListActions from '../store/order-list.actions';
import * as OrderListSelectors from '../store/order-list.selectors';
import { OrderBroadcastService } from '../services/order-broadcast.service';

@Component({
  selector: 'rt-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, OnDestroy {
  allOrders$: Observable<Order[]>;
  displayedOrders$: Observable<Order[]>;
  isLoading$: Observable<boolean>;
  renderCount$: Observable<number>;
  lastUpdated$: Observable<Date>;
  searchQuery$: Observable<string>;
  statusFilter$: Observable<'All' | 'New' | 'Processing' | 'Completed'>;
  sortField$: Observable<SortField>;
  sortDirection$: Observable<SortDirection>;
  pageSize$: Observable<number>;
  currentPage$: Observable<number>;
  pageSizeOptions$: Observable<number[]>;
  paginatedOrders$: Observable<Order[]>;
  totalPages$: Observable<number>;

  // Local properties for bindings
  searchQuery = '';
  statusFilter: 'All' | 'New' | 'Processing' | 'Completed' = 'All';
  sortField: SortField = 'id';
  sortDirection: SortDirection = 'desc';
  pageSize = 25;
  currentPage = 1;
  pageSizeOptions = [10, 25, 50, 100];
  allOrders: Order[] = [];
  displayedOrders: Order[] = [];
  isLoading = false;
  renderCount = 0;
  lastUpdated = new Date();
  
  constructor(
    private store: Store, 
    private orderBroadcastService: OrderBroadcastService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    console.log('[Order List] Constructor called - Component initializing');
    
    this.allOrders$ = this.store.select(OrderListSelectors.selectAllOrders);
    this.displayedOrders$ = this.store.select(OrderListSelectors.selectDisplayedOrders);
    this.isLoading$ = this.store.select(OrderListSelectors.selectIsLoading);
    this.renderCount$ = this.store.select(OrderListSelectors.selectRenderCount);
    this.lastUpdated$ = this.store.select(OrderListSelectors.selectLastUpdated);
    this.searchQuery$ = this.store.select(OrderListSelectors.selectSearchQuery);
    this.statusFilter$ = this.store.select(OrderListSelectors.selectStatusFilter);
    this.sortField$ = this.store.select(OrderListSelectors.selectSortField);
    this.sortDirection$ = this.store.select(OrderListSelectors.selectSortDirection);
    this.pageSize$ = this.store.select(OrderListSelectors.selectPageSize);
    this.currentPage$ = this.store.select(OrderListSelectors.selectCurrentPage);
    this.pageSizeOptions$ = this.store.select(OrderListSelectors.selectPageSizeOptions);
    this.paginatedOrders$ = this.store.select(OrderListSelectors.selectPaginatedOrders);
    this.totalPages$ = this.store.select(OrderListSelectors.selectTotalPages);
  }

  ngOnInit(): void {
    // Subscribe to store values for two-way binding
    this.searchQuery$.subscribe(q => {
      this.ngZone.run(() => {
        this.searchQuery = q;
        this.cdr.markForCheck();
      });
    });
    this.statusFilter$.subscribe(f => {
      this.ngZone.run(() => {
        this.statusFilter = f;
        this.cdr.markForCheck();
      });
    });
    this.sortField$.subscribe(f => {
      this.ngZone.run(() => {
        this.sortField = f;
        this.cdr.markForCheck();
      });
    });
    this.sortDirection$.subscribe(d => {
      this.ngZone.run(() => {
        this.sortDirection = d;
        this.cdr.markForCheck();
      });
    });
    this.pageSize$.subscribe(s => {
      this.ngZone.run(() => {
        this.pageSize = s;
        this.cdr.markForCheck();
      });
    });
    this.currentPage$.subscribe(p => {
      this.ngZone.run(() => {
        this.currentPage = p;
        this.cdr.markForCheck();
      });
    });
    this.pageSizeOptions$.subscribe(o => {
      this.ngZone.run(() => {
        this.pageSizeOptions = o;
        this.cdr.markForCheck();
      });
    });
    this.displayedOrders$.subscribe(o => {
      this.ngZone.run(() => {
        this.displayedOrders = o;
        this.cdr.markForCheck();
      });
    });
    this.allOrders$.subscribe(o => {
      this.ngZone.run(() => {
        this.allOrders = o;
        this.cdr.markForCheck();
      });
    });
    this.isLoading$.subscribe(l => {
      this.ngZone.run(() => {
        this.isLoading = l;
        this.cdr.markForCheck();
      });
    });
    this.renderCount$.subscribe(r => {
      this.ngZone.run(() => {
        this.renderCount = r;
        this.cdr.markForCheck();
      });
    });
    this.lastUpdated$.subscribe(u => {
      this.ngZone.run(() => {
        this.lastUpdated = u;
        this.cdr.markForCheck();
      });
    });
    
    console.log('[Order List] ngOnInit complete');
    console.log('[Order List] Current order count:', this.allOrders.length);
  }

  ngOnDestroy(): void {
    console.log('[Order List] Component destroying');
  }
  
  applyFiltersAndSort(): void {
    this.store.dispatch(OrderListActions.applyFiltersAndSort());
  }
  
  onSearch(): void {
    this.store.dispatch(OrderListActions.setSearchQuery({ query: this.searchQuery }));
    this.store.dispatch(OrderListActions.applyFiltersAndSort());
  }
  
  onStatusFilterChange(): void {
    this.store.dispatch(OrderListActions.setStatusFilter({ status: this.statusFilter }));
    this.store.dispatch(OrderListActions.applyFiltersAndSort());
  }
  
  onSortChange(field: SortField, direction: SortDirection): void {
    this.store.dispatch(OrderListActions.setSortField({ field }));
    this.store.dispatch(OrderListActions.setSortDirection({ direction }));
    this.store.dispatch(OrderListActions.applyFiltersAndSort());
  }
  
  get totalPages(): number {
    return Math.ceil(this.displayedOrders.length / this.pageSize);
  }
  
  get paginatedOrders(): Order[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.displayedOrders.slice(start, start + this.pageSize);
  }
  
  get paginationInfo(): string {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(start + this.pageSize - 1, this.displayedOrders.length);
    return `Showing ${start}-${end} of ${this.displayedOrders.length} orders`;
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
    return Math.floor((Date.now() - this.lastUpdated.getTime()) / 1000);
  }
}
