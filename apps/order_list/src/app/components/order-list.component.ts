import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersFacade, Order, SortField, SortDirection, StatusFilter } from '@rt-dashboard/shared/data-access-orders';
import { Observable, Subscription, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'rt-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, OnDestroy {
  private facade = inject(OrdersFacade);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);
  private autoRefreshSubscription?: Subscription;

  // State from store
  allOrders$: Observable<Order[]> = this.facade.filteredOrders$;
  displayedOrders$: Observable<Order[]> = this.facade.filteredOrders$;
  totalOrders$: Observable<number> = this.facade.filteredOrders$.pipe(
    map(orders => orders.length)
  );
  
  // Local properties for template binding
  displayedOrders: Order[] = [];
  paginatedOrders: Order[] = [];
  totalPages = 0;
  visiblePages: number[] = [];
  paginationInfo = '';
  
  isLoading = false;
  renderCount = 0;
  lastUpdated = new Date();
  
  // Filter state (local for two-way binding)
  searchQuery = '';
  statusFilter: StatusFilter = 'All';
  sortField: SortField = 'createdAt';
  sortDirection: SortDirection = 'desc';
  
  pageSize = 25;
  currentPage = 1;
  pageSizeOptions = [10, 25, 50, 100];
  
  ngOnInit(): void {
    // Sync local filter state with store
    this.facade.filtersState$.subscribe(filters => {
      this.searchQuery = filters.searchTerm;
      this.statusFilter = filters.statusFilter;
      this.sortField = filters.sortBy;
      this.sortDirection = filters.sortDirection;
    });

    // Subscribe to displayedOrders and update local properties
    this.displayedOrders$.subscribe(orders => {
      this.zone.run(() => {
        this.displayedOrders = orders;
        this.renderCount++;
        this.lastUpdated = new Date();
        this.updatePagination();
        this.cdr.detectChanges();
      });
    });
    
    // Start auto-refresh by default
    this.startAutoRefresh();
  }
  
  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }
  
  private startAutoRefresh(): void {
    this.stopAutoRefresh();
    // Update every second for real-time feel
    this.autoRefreshSubscription = interval(1000).subscribe(() => {
      this.zone.run(() => {
        // Force update of relative times and last updated timestamp
        this.lastUpdated = new Date();
        this.cdr.detectChanges();
      });
    });
  }
  
  private stopAutoRefresh(): void {
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
      this.autoRefreshSubscription = undefined;
    }
  }
  
  private updatePagination(): void {
    this.totalPages = Math.ceil(this.displayedOrders.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedOrders = this.displayedOrders.slice(start, start + this.pageSize);
    this.visiblePages = this.calculateVisiblePages();
    const displayStart = (this.currentPage - 1) * this.pageSize + 1;
    const displayEnd = Math.min(displayStart + this.pageSize - 1, this.displayedOrders.length);
    this.paginationInfo = `Showing ${displayStart}-${displayEnd} of ${this.displayedOrders.length} orders`;
  }
  
  private calculateVisiblePages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(this.totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }
  
  onSearch(): void {
    this.facade.setSearchTerm(this.searchQuery);
    this.currentPage = 1;
    this.updatePagination();
  }
  
  onStatusFilterChange(): void {
    this.facade.setStatusFilter(this.statusFilter);
    this.currentPage = 1;
    this.updatePagination();
  }
  
  onSortChange(field: SortField, direction: SortDirection): void {
    this.sortField = field;
    this.sortDirection = direction;
    this.facade.setSortBy(field);
    this.facade.setSortDirection(direction);
    this.currentPage = 1;
    this.updatePagination();
  }
  
  onPageSizeChange(): void {
    this.currentPage = 1;
    this.updatePagination();
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }
  
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
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
