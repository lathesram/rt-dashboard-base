import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Order {
  id: string;
  customer: string;
  amount: number;
  status: 'New' | 'Processing' | 'Completed';
  createdAt: Date;
}

type SortField = 'id' | 'timestamp' | 'amount';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'rt-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent {
  allOrders: Order[] = [];
  displayedOrders: Order[] = [];
  isLoading = false;
  renderCount = 0;
  lastUpdated = new Date();
  searchQuery = '';
  statusFilter: 'All' | 'New' | 'Processing' | 'Completed' = 'All';
  sortField: SortField = 'id';
  sortDirection: SortDirection = 'desc';
  pageSize = 25;
  currentPage = 1;
  pageSizeOptions = [10, 25, 50, 100];
  
  constructor() {
    this.generateMockOrders();
    this.applyFiltersAndSort();
    this.renderCount++;
  }
  
  private generateMockOrders(): void {
    const names = ['John Smith', 'Jane Johnson', 'Alice Williams', 'Bob Brown', 'Charlie Jones', 
                   'Diana Garcia', 'Eve Miller', 'Frank Davis', 'Grace Rodriguez', 'Henry Martinez'];
    const now = Date.now();
    
    for (let i = 1; i <= 75; i++) {
      const rand = Math.random();
      const status = rand < 0.4 ? 'New' : rand < 0.75 ? 'Processing' : 'Completed';
      
      this.allOrders.push({
        id: `ORD-${String(i).padStart(4, '0')}`,
        customer: names[Math.floor(Math.random() * names.length)],
        amount: Math.floor(Math.random() * 4950) + 50,
        status,
        createdAt: new Date(now - Math.random() * 86400000)
      });
    }
    
    this.allOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  applyFiltersAndSort(): void {
    this.renderCount++;
    let filtered = this.allOrders;
    
    if (this.statusFilter !== 'All') {
      filtered = filtered.filter(order => order.status === this.statusFilter);
    }
    
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.amount.toString().includes(query)
      );
    }
    
    filtered = [...filtered].sort((a, b) => {
      let val = 0;
      if (this.sortField === 'id') val = a.id.localeCompare(b.id);
      else if (this.sortField === 'timestamp') val = a.createdAt.getTime() - b.createdAt.getTime();
      else val = a.amount - b.amount;
      return this.sortDirection === 'asc' ? val : -val;
    });
    
    this.displayedOrders = filtered;
    this.currentPage = 1;
    this.lastUpdated = new Date();
  }
  
  onSearch(): void {
    this.applyFiltersAndSort();
  }
  
  onStatusFilterChange(): void {
    this.applyFiltersAndSort();
  }
  
  onSortChange(field: SortField, direction: SortDirection): void {
    this.sortField = field;
    this.sortDirection = direction;
    this.applyFiltersAndSort();
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
    this.currentPage = 1;
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  
  previousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
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
