import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Data interfaces
interface Order {
  id: string;
  status: 'New' | 'Processing' | 'Completed';
  timestamp: Date;
  amount: number;
  customer: string;
}

type GenerationStatus = 'Active' | 'Paused' | 'Stopped';

@Component({
  selector: 'rt-order-producer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-producer.component.html',
  styleUrls: ['./order-producer.component.scss']
})
export class OrderProducerComponent {
  // UI State (mock data - no real state management)
  generationStatus: GenerationStatus = 'Stopped';
  ordersGenerated = 0;
  generationRate = '1 order/sec';
  lastGenerated = new Date();
  
  // Configuration
  generationInterval = 1000; // milliseconds
  batchSize = 1;
  maxOrders = 100;
  
  // Configuration options
  intervalOptions = [
    { label: '500ms', value: 500 },
    { label: '1000ms (1 sec)', value: 1000 },
    { label: '2000ms (2 sec)', value: 2000 }
  ];
  
  batchSizeOptions = [1, 5, 10];
  
  // Activity log
  activityLog: Order[] = [];
  
  // UI state
  isConfigExpanded = false;
  
  constructor() {
    this.initializeMockData();
  }
  
  // Initialize with mock orders for demonstration
  private initializeMockData(): void {
    const mockOrders: Order[] = [
      {
        id: 'ORD-001',
        status: 'Completed',
        timestamp: new Date(Date.now() - 300000),
        amount: 150.50,
        customer: 'Alice Johnson'
      },
      {
        id: 'ORD-002',
        status: 'Processing',
        timestamp: new Date(Date.now() - 240000),
        amount: 275.00,
        customer: 'Bob Smith'
      },
      {
        id: 'ORD-003',
        status: 'New',
        timestamp: new Date(Date.now() - 180000),
        amount: 89.99,
        customer: 'Carol Williams'
      },
      {
        id: 'ORD-004',
        status: 'Completed',
        timestamp: new Date(Date.now() - 120000),
        amount: 450.25,
        customer: 'David Brown'
      },
      {
        id: 'ORD-005',
        status: 'Processing',
        timestamp: new Date(Date.now() - 60000),
        amount: 199.99,
        customer: 'Eve Davis'
      },
      {
        id: 'ORD-006',
        status: 'New',
        timestamp: new Date(Date.now() - 30000),
        amount: 325.50,
        customer: 'Frank Miller'
      },
      {
        id: 'ORD-007',
        status: 'Completed',
        timestamp: new Date(Date.now() - 15000),
        amount: 550.00,
        customer: 'Grace Wilson'
      }
    ];
    
    this.activityLog = mockOrders;
    this.ordersGenerated = mockOrders.length;
  }
  
  // TODO: Connect to state management - dispatch start generation action
  onStartGeneration(): void {
    console.log('Start Generation clicked');
    this.generationStatus = 'Active';
    // TODO: Dispatch action to start order generation
  }
  
  // TODO: Connect to state management - dispatch pause action
  onPauseGeneration(): void {
    console.log('Pause Generation clicked');
    this.generationStatus = 'Paused';
    // TODO: Dispatch action to pause order generation
  }
  
  // TODO: Connect to state management - dispatch stop action
  onStopGeneration(): void {
    console.log('Stop Generation clicked');
    this.generationStatus = 'Stopped';
    // TODO: Dispatch action to stop order generation
  }
  
  // TODO: Connect to state management - dispatch reset action
  onResetCounter(): void {
    console.log('Reset Counter clicked');
    this.ordersGenerated = 0;
    this.activityLog = [];
    // TODO: Dispatch action to reset counter and clear history
  }
  
  // Configuration handlers
  onIntervalChange(): void {
    console.log('Generation interval changed to:', this.generationInterval);
    this.updateGenerationRate();
    // TODO: Dispatch action to update generation interval
  }
  
  onBatchSizeChange(): void {
    console.log('Batch size changed to:', this.batchSize);
    this.updateGenerationRate();
    // TODO: Dispatch action to update batch size
  }
  
  onMaxOrdersChange(): void {
    console.log('Max orders changed to:', this.maxOrders);
    // TODO: Dispatch action to update max orders limit
  }
  
  toggleConfig(): void {
    this.isConfigExpanded = !this.isConfigExpanded;
  }
  
  // Helper to update generation rate display
  private updateGenerationRate(): void {
    const ordersPerSecond = (this.batchSize / this.generationInterval) * 1000;
    this.generationRate = `${ordersPerSecond.toFixed(2)} orders/sec`;
  }
  
  // Get status badge CSS class
  getStatusClass(status: Order['status']): string {
    const statusMap = {
      'New': 'status-new',
      'Processing': 'status-processing',
      'Completed': 'status-completed'
    };
    return statusMap[status];
  }
  
  // Format timestamp for display
  formatTimestamp(date: Date): string {
    return date.toLocaleTimeString();
  }
  
  // Get time ago string
  getTimeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }
}
