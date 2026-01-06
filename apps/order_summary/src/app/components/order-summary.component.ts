import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Data interfaces
interface OrderSummary {
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
  trends: {
    totalChange: number; // percentage
    newToday: number;
    completedToday: number;
  };
  performance: {
    avgProcessingTime: number; // minutes
    computationCount: number;
    lastCalculationMs: number;
  };
}

type TimeRange = 'hour' | 'day' | 'week' | 'all';

interface ActivityItem {
  message: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning';
}

@Component({
  selector: 'rt-order-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent {
  // Summary data (mock)
  summary: OrderSummary;
  
  // UI state
  selectedTimeRange: TimeRange = 'day';
  lastUpdated = new Date();
  isAutoRefresh = true;
  
  // Activity timeline
  activityTimeline: ActivityItem[] = [];
  
  // Time range options
  timeRangeOptions = [
    { label: 'Last Hour', value: 'hour' as TimeRange },
    { label: 'Last 24h', value: 'day' as TimeRange },
    { label: 'Last 7 days', value: 'week' as TimeRange },
    { label: 'All Time', value: 'all' as TimeRange }
  ];
  
  constructor() {
    this.summary = this.generateMockSummary();
    this.generateActivityTimeline();
  }
  
  // Generate realistic mock summary data
  private generateMockSummary(): OrderSummary {
    return {
      total: 1247,
      byStatus: {
        new: 423,
        processing: 568,
        completed: 256
      },
      revenue: {
        total: 127450.00,
        average: 102.25,
        highest: 4850.00
      },
      trends: {
        totalChange: 12,
        newToday: 50,
        completedToday: 120
      },
      performance: {
        avgProcessingTime: 45,
        computationCount: 1,
        lastCalculationMs: 2.5
      }
    };
  }
  
  // Generate activity timeline
  private generateActivityTimeline(): void {
    const now = Date.now();
    this.activityTimeline = [
      {
        message: `${this.summary.trends.newToday} orders created in last hour`,
        timestamp: new Date(now - 3600000),
        type: 'info'
      },
      {
        message: `${this.summary.trends.completedToday} orders completed today`,
        timestamp: new Date(now - 7200000),
        type: 'success'
      },
      {
        message: `Average processing time: ${this.summary.performance.avgProcessingTime} min`,
        timestamp: new Date(now - 10800000),
        type: 'info'
      },
      {
        message: 'Peak order volume detected',
        timestamp: new Date(now - 14400000),
        type: 'warning'
      },
      {
        message: 'System performance optimal',
        timestamp: new Date(now - 18000000),
        type: 'success'
      }
    ];
  }
  
  // Recalculate summary (simulated)
  private recalculateSummary(): void {
    const startTime = performance.now();
    
    // TODO: Calculate from real-time state instead of using mock data
    // This would aggregate all orders from the state and compute statistics
    
    this.summary.performance.computationCount++;
    this.summary.performance.lastCalculationMs = performance.now() - startTime;
    this.lastUpdated = new Date();
  }
  
  // Time range change handler
  onTimeRangeChange(): void {
    console.log('Time range changed to:', this.selectedTimeRange);
    this.recalculateSummary();
    // TODO: Dispatch action to filter orders by time range and recalculate
  }
  
  // Calculate percentages
  get statusPercentages() {
    const total = this.summary.total;
    return {
      new: (this.summary.byStatus.new / total) * 100,
      processing: (this.summary.byStatus.processing / total) * 100,
      completed: (this.summary.byStatus.completed / total) * 100
    };
  }
  
  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  }
  
  // Format large numbers
  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
  }
  
  // Format percentage
  formatPercentage(num: number): string {
    return num.toFixed(1) + '%';
  }
  
  // Get trend indicator
  getTrendIcon(change: number): string {
    return change >= 0 ? '↑' : '↓';
  }
  
  getTrendClass(change: number): string {
    return change >= 0 ? 'trend-up' : 'trend-down';
  }
  
  // Get activity type class
  getActivityTypeClass(type: ActivityItem['type']): string {
    const typeMap = {
      'info': 'activity-info',
      'success': 'activity-success',
      'warning': 'activity-warning'
    };
    return typeMap[type];
  }
  
  // Format timestamp
  formatTimestamp(date: Date): string {
    return date.toLocaleTimeString();
  }
  
  // Get time ago
  getTimeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }
  
  // Get seconds since update
  get secondsSinceUpdate(): number {
    return Math.floor((Date.now() - this.lastUpdated.getTime()) / 1000);
  }
  
  // Mock memory usage (for demonstration)
  get memoryUsagePercentage(): number {
    return 45; // Mock value
  }
}
