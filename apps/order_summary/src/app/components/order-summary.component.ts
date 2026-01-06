import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface OrderSummary {
  total: number;
  byStatus: { new: number; processing: number; completed: number };
  revenue: { total: number; average: number; highest: number };
  trends: { totalChange: number; newToday: number; completedToday: number };
}

type TimeRange = 'hour' | 'day' | 'week' | 'all';

@Component({
  selector: 'rt-order-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent {
  summary: OrderSummary;
  selectedTimeRange: TimeRange = 'day';
  lastUpdated = new Date();
  isAutoRefresh = true;
  timeRangeOptions = [
    { label: 'Last Hour', value: 'hour' as TimeRange },
    { label: 'Last 24h', value: 'day' as TimeRange },
    { label: 'Last 7 days', value: 'week' as TimeRange },
    { label: 'All Time', value: 'all' as TimeRange }
  ];
  
  constructor() {
    this.summary = {
      total: 1247,
      byStatus: { new: 423, processing: 568, completed: 256 },
      revenue: { total: 127450.00, average: 102.25, highest: 4850.00 },
      trends: { totalChange: 12, newToday: 50, completedToday: 120 }
    };
  }
  
  onTimeRangeChange(): void {
    this.lastUpdated = new Date();
  }
  
  get statusPercentages() {
    const total = this.summary.total;
    return {
      new: (this.summary.byStatus.new / total) * 100,
      processing: (this.summary.byStatus.processing / total) * 100,
      completed: (this.summary.byStatus.completed / total) * 100
    };
  }
  
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount);
  }
  
  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
  }
  
  formatPercentage(num: number): string {
    return num.toFixed(1) + '%';
  }
  
  getTrendIcon(change: number): string {
    return change >= 0 ? '↑' : '↓';
  }
  
  getTrendClass(change: number): string {
    return change >= 0 ? 'trend-up' : 'trend-down';
  }
  
  get secondsSinceUpdate(): number {
    return Math.floor((Date.now() - this.lastUpdated.getTime()) / 1000);
  }
}
