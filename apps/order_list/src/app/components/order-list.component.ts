import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Data interface
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
  // All orders (mock data)
  allOrders: Order[] = [];
  
  // Display state
  displayedOrders: Order[] = [];
  isLoading = false;
  renderCount = 0;
  lastUpdated = new Date();
  
  // Filters
  searchQuery = '';
  statusFilter: 'All' | 'New' | 'Processing' | 'Completed' = 'All';
  
  // Sorting
  sortField: SortField = 'id';
  sortDirection: SortDirection = 'desc';
  
  // Settings
  autoRefresh = false;
  pageSize = 25;
  currentPage = 1;
  
  // Pagination options
  pageSizeOptions = [10, 25, 50, 100];
  
  constructor() {
    this.generateMockOrders();
    this.applyFiltersAndSort();
    this.renderCount++;
  }
  
  // Generate 50-100 mock orders with realistic data
  private generateMockOrders(): void {
    const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const statusDistribution = [0.4, 0.35, 0.25]; // 40% New, 35% Processing, 25% Completed
    
    const orderCount = 75; // Generate 75 orders
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    for (let i = 1; i <= orderCount; i++) {
      // Determine status based on distribution
      const rand = Math.random();
      let status: Order['status'];
      if (rand < statusDistribution[0]) {
        status = 'New';
      } else if (rand < statusDistribution[0] + statusDistribution[1]) {
        status = 'Processing';
      } else {
        status = 'Completed';
      }
      
      // Random timestamp within last 24 hours
      const randomTime = now - Math.random() * oneDayMs;
      
      const order: Order = {
        id: `ORD-${String(i).padStart(4, '0')}`,
        customer: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        amount: Math.floor(Math.random() * 4950) + 50, // $50 - $5000
        status: status,
        createdAt: new Date(randomTime)
      };
      
      this.allOrders.push(order);
    }
    
    // Sort by creation time (newest first) initially
    this.allOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  // TODO: Connect to state management - subscribe to order state
  // Filter and sort orders
  applyFiltersAndSort(): void {
    this.renderCount++;
    
    // Filter
    let filtered = this.allOrders;
    
    // Status filter
    if (this.statusFilter !== 'All') {
      filtered = filtered.filter(order => order.status === this.statusFilter);
    }
    
    // Search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.amount.toString().includes(query)
      );
    }
    
    // Sort
    filtered = [...filtered].sort((a, b) => {
      let compareValue = 0;
      
      switch (this.sortField) {
        case 'id':
          compareValue = a.id.localeCompare(b.id);
          break;
        case 'timestamp':
          compareValue = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'amount':
          compareValue = a.amount - b.amount;
          break;
      }
      
      return this.sortDirection === 'asc' ? compareValue : -compareValue;
    });
    
    this.displayedOrders = filtered;
    this.currentPage = 1; // Reset to first page
    this.lastUpdated = new Date();
  }
  
  // Search handler
  onSearch(): void {
    console.log('Search query:', this.searchQuery);
    this.applyFiltersAndSort();
    // TODO: Dispatch search action or apply client-side filter from state
  }
  
  // Status filter handler
  onStatusFilterChange(): void {
    console.log('Status filter changed to:', this.statusFilter);
    this.applyFiltersAndSort();
    // TODO: Dispatch filter action
  }
  
  // Sort change handler
  onSortChange(field: SortField, direction: SortDirection): void {
    console.log(`Sort changed to: ${field} ${direction}`);
    this.sortField = field;
    this.sortDirection = direction;
    this.applyFiltersAndSort();
    // TODO: Dispatch sort action
  }
  
  // Toggle auto-refresh
  toggleAutoRefresh(): void {
    this.autoRefresh = !this.autoRefresh;
    console.log('Auto-refresh:', this.autoRefresh);
    // TODO: Start/stop auto-refresh subscription to state updates
  }
  
  // Pagination
  get totalPages(): number {
    return Math.ceil(this.displayedOrders.length / this.pageSize);
  }
  
  get paginatedOrders(): Order[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.displayedOrders.slice(start, end);
  }
  
  get paginationInfo(): string {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(start + this.pageSize - 1, this.displayedOrders.length);
    return `Showing ${start}-${end} of ${this.displayedOrders.length} orders`;
  }
  
  onPageSizeChange(): void {
    console.log('Page size changed to:', this.pageSize);
    this.currentPage = 1;
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  
  // Get visible page numbers for pagination
  get visiblePages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }
  
  // Action handlers
  onViewDetails(order: Order): void {
    console.log('View details for order:', order.id);
    // TODO: Navigate to order details or dispatch action
  }
  
  onChangeStatus(order: Order): void {
    console.log('Change status for order:', order.id);
    // TODO: Dispatch action to change order status
  }
  
  // Get status badge class
  getStatusClass(status: Order['status']): string {
    const statusMap = {
      'New': 'status-new',
      'Processing': 'status-processing',
      'Completed': 'status-completed'
    };
    return statusMap[status];
  }
  
  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
  
  // Get relative time
  getRelativeTime(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return date.toLocaleDateString();
  }
  
  // Get last updated seconds
  get secondsSinceUpdate(): number {
    return Math.floor((Date.now() - this.lastUpdated.getTime()) / 1000);
  }
}
