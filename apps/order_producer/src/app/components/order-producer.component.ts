import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  generationStatus: GenerationStatus = 'Stopped';
  ordersGenerated = 0;
  generationRate = '1 order/sec';
  lastGenerated = new Date();
  generationInterval = 1000;
  batchSize = 1;
  maxOrders = 100;
  
  intervalOptions = [
    { label: '500ms', value: 500 },
    { label: '1000ms (1 sec)', value: 1000 },
    { label: '2000ms (2 sec)', value: 2000 }
  ];
  
  batchSizeOptions = [1, 5, 10];
  activityLog: Order[] = [];
  isConfigExpanded = false;
  
  constructor() {
    this.activityLog = [
      { id: 'ORD-001', status: 'Completed', timestamp: new Date(Date.now() - 300000), amount: 150.50, customer: 'Alice Johnson' },
      { id: 'ORD-002', status: 'Processing', timestamp: new Date(Date.now() - 240000), amount: 275.00, customer: 'Bob Smith' },
      { id: 'ORD-003', status: 'New', timestamp: new Date(Date.now() - 180000), amount: 89.99, customer: 'Carol Williams' },
      { id: 'ORD-004', status: 'Completed', timestamp: new Date(Date.now() - 120000), amount: 450.25, customer: 'David Brown' },
      { id: 'ORD-005', status: 'Processing', timestamp: new Date(Date.now() - 60000), amount: 199.99, customer: 'Eve Davis' },
      { id: 'ORD-006', status: 'New', timestamp: new Date(Date.now() - 30000), amount: 325.50, customer: 'Frank Miller' },
      { id: 'ORD-007', status: 'Completed', timestamp: new Date(Date.now() - 15000), amount: 550.00, customer: 'Grace Wilson' }
    ];
    this.ordersGenerated = this.activityLog.length;
  }
  
  onStartGeneration(): void {
    this.generationStatus = 'Active';
  }
  
  onPauseGeneration(): void {
    this.generationStatus = 'Paused';
  }
  
  onStopGeneration(): void {
    this.generationStatus = 'Stopped';
  }
  
  onResetCounter(): void {
    this.ordersGenerated = 0;
    this.activityLog = [];
  }
  
  onIntervalChange(): void {
    this.updateGenerationRate();
  }
  
  onBatchSizeChange(): void {
    this.updateGenerationRate();
  }
  
  onMaxOrdersChange(): void {
    // Config updated
  }
  
  toggleConfig(): void {
    this.isConfigExpanded = !this.isConfigExpanded;
  }
  
  private updateGenerationRate(): void {
    const rate = (this.batchSize / this.generationInterval) * 1000;
    this.generationRate = `${rate.toFixed(2)} orders/sec`;
  }
  
  getStatusClass(status: Order['status']): string {
    return `status-${status.toLowerCase()}`;
  }
  
  formatTimestamp(date: Date): string {
    return date.toLocaleTimeString();
  }
  
  getTimeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }
}
