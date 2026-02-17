import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { OrderSummary } from '@rt-dashboard/shared/data-access-orders';
import * as OrderSummaryActions from '../store/order-summary.actions';
import * as OrderSummarySelectors from '../store/order-summary.selectors';
import { TimeRange } from '../store/order-summary.state';

@Component({
  selector: 'rt-order-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent implements OnInit, OnDestroy {
  // Observables from stores
  summary$: Observable<OrderSummary>;
  selectedTimeRange$: Observable<TimeRange>;
  lastUpdated$: Observable<Date>;
  timeRangeOptions$: Observable<{ label: string; value: TimeRange }[]>;
  secondsSinceUpdate$: Observable<number>;
  
  // Current values for ngModel binding
  selectedTimeRange: TimeRange = 'day';
  
  private subscriptions = new Subscription();
  
  constructor(private store: Store) {
    // Initialize observables
    this.summary$ = this.store.select(OrderSummarySelectors.selectOrderSummary);
    this.selectedTimeRange$ = this.store.select(OrderSummarySelectors.selectSelectedTimeRange);
    this.lastUpdated$ = this.store.select(OrderSummarySelectors.selectLastUpdated);
    this.timeRangeOptions$ = this.store.select(OrderSummarySelectors.selectTimeRangeOptions);
    this.secondsSinceUpdate$ = this.store.select(OrderSummarySelectors.selectSecondsSinceUpdate);
  }
  
  ngOnInit(): void {
    // Subscribe to time range for ngModel binding
    this.subscriptions.add(
      this.selectedTimeRange$.subscribe(timeRange => {
        this.selectedTimeRange = timeRange;
      })
    );
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  
  onTimeRangeChange(): void {
    this.store.dispatch(OrderSummaryActions.setTimeRange({ timeRange: this.selectedTimeRange }));
  }
  
  getStatusPercentages(summary: OrderSummary) {
    const total = summary.total || 1;
    return {
      new: (summary.byStatus.new / total) * 100,
      processing: (summary.byStatus.processing / total) * 100,
      completed: (summary.byStatus.completed / total) * 100
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
}
