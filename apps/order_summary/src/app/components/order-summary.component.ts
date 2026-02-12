import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersFacade, OrderSummary } from '@rt-dashboard/shared/data-access-orders';
import { Observable, Subscription, interval } from 'rxjs';
import { map } from 'rxjs/operators';

type TimeRange = 'hour' | 'day' | 'week' | 'all';

@Component({
  selector: 'rt-order-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent implements OnInit, OnDestroy {
  private facade = inject(OrdersFacade);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);
  private autoRefreshSubscription?: Subscription;

  // State from store
  summary$: Observable<OrderSummary> = this.facade.orderSummary$;
  statusPercentages$!: Observable<{new: number, processing: number, completed: number}>;
  
  // Local properties for template binding
  summary: OrderSummary = {
    total: 0,
    byStatus: { new: 0, processing: 0, completed: 0 },
    revenue: { total: 0, average: 0, highest: 0 },
    performance: { computationCount: 0, lastCalculationMs: 0 }
  };
  percentages = { new: 0, processing: 0, completed: 0 };
  
  selectedTimeRange: TimeRange = 'day';
  lastUpdated = new Date();
  timeRangeOptions = [
    { label: 'Last Hour', value: 'hour' as TimeRange },
    { label: 'Last 24h', value: 'day' as TimeRange },
    { label: 'Last 7 days', value: 'week' as TimeRange },
    { label: 'All Time', value: 'all' as TimeRange }
  ];
  
  ngOnInit(): void {
    // Calculate percentages from summary
    this.statusPercentages$ = this.summary$.pipe(
      map(summary => {
        const total = summary.total || 1; // Avoid division by zero
        return {
          new: (summary.byStatus.new / total) * 100,
          processing: (summary.byStatus.processing / total) * 100,
          completed: (summary.byStatus.completed / total) * 100
        };
      })
    );

    // Subscribe to summary and update local properties
    this.summary$.subscribe(summary => {
      this.zone.run(() => {
        this.summary = summary;
        this.lastUpdated = new Date();
        this.cdr.detectChanges();
      });
    });
    
    // Subscribe to percentages and update local property
    this.statusPercentages$.subscribe(percentages => {
      this.zone.run(() => {
        this.percentages = percentages;
        this.cdr.detectChanges();
      });
    });
    
    // Start auto-refresh
    this.autoRefreshSubscription = interval(1000).subscribe(() => {
      this.zone.run(() => {
        this.cdr.detectChanges();
      });
    });
  }
  
  ngOnDestroy(): void {
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
    }
  }
  
  onTimeRangeChange(): void {
    this.lastUpdated = new Date();
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
