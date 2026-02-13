import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OrderSummary, TimeRange } from '../store/order-summary.state';
import * as OrderSummaryActions from '../store/order-summary.actions';
import * as OrderSummarySelectors from '../store/order-summary.selectors';
import { OrderBroadcastService } from '../services/order-broadcast.service';

@Component({
  selector: 'rt-order-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent implements OnInit, OnDestroy {
  summary$: Observable<OrderSummary>;
  selectedTimeRange$: Observable<TimeRange>;
  lastUpdated$: Observable<Date>;
  isAutoRefresh$: Observable<boolean>;
  timeRangeOptions$: Observable<{ label: string; value: TimeRange }[]>;
  statusPercentages$: Observable<{ new: number; processing: number; completed: number }>;

  // Local properties for bindings
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
  
  constructor(
    private store: Store, 
    private orderBroadcastService: OrderBroadcastService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    console.log('[Order Summary] Constructor called - Component initializing');
    
    this.summary$ = this.store.select(OrderSummarySelectors.selectSummary);
    this.selectedTimeRange$ = this.store.select(OrderSummarySelectors.selectSelectedTimeRange);
    this.lastUpdated$ = this.store.select(OrderSummarySelectors.selectLastUpdated);
    this.isAutoRefresh$ = this.store.select(OrderSummarySelectors.selectIsAutoRefresh);
    this.timeRangeOptions$ = this.store.select(OrderSummarySelectors.selectTimeRangeOptions);
    this.statusPercentages$ = this.store.select(OrderSummarySelectors.selectStatusPercentages);

    this.summary = {
      total: 0,
      byStatus: { new: 0, processing: 0, completed: 0 },
      revenue: { total: 0, average: 0, highest: 0 },
      trends: { totalChange: 0, newToday: 0, completedToday: 0 }
    };
  }

  ngOnInit(): void {
    console.log('[Order Summary] ===== ngOnInit START =====');
    
    // Subscribe to store values for two-way binding
    this.summary$.subscribe(s => {
      this.ngZone.run(() => {
        console.log('[Order Summary] ===== SUMMARY STATE CHANGED =====');
        console.log('[Order Summary] Previous summary:', this.summary);
        console.log('[Order Summary] New summary:', s);
        this.summary = s;
        console.log('[Order Summary] Summary updated - total:', s.total, 'new:', s.byStatus.new, 'processing:', s.byStatus.processing, 'completed:', s.byStatus.completed);
        this.cdr.markForCheck();
      });
    });
    this.selectedTimeRange$.subscribe(t => {
      this.ngZone.run(() => {
        this.selectedTimeRange = t;
        this.cdr.markForCheck();
      });
    });
    this.lastUpdated$.subscribe(l => {
      this.ngZone.run(() => {
        this.lastUpdated = l;
        this.cdr.markForCheck();
      });
    });
    
    console.log('[Order Summary] ngOnInit complete');
    console.log('[Order Summary] Initial total orders:', this.summary.total);
    console.log('[Order Summary] ===== ngOnInit END =====');
  }

  ngOnDestroy(): void {
    console.log('[Order Summary] Component destroying');
  }
  
  onTimeRangeChange(): void {
    this.store.dispatch(OrderSummaryActions.setTimeRange({ timeRange: this.selectedTimeRange }));
  }
  
  get statusPercentages() {
    const total = this.summary.total;
    if (total === 0) {
      return {
        new: 0,
        processing: 0,
        completed: 0
      };
    }
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
