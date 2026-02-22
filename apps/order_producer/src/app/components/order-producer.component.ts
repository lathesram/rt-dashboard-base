import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GenerationStatus } from '../store/order-producer.state';
import * as OrderProducerActions from '../store/order-producer.actions';
import * as OrderProducerSelectors from '../store/order-producer.selectors';

@Component({
  selector: 'rt-order-producer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-producer.component.html',
  styleUrls: ['./order-producer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderProducerComponent implements OnInit {
  generationStatus$: Observable<GenerationStatus>;
  ordersGenerated$: Observable<number>;
  generationRate$: Observable<string>;
  lastGenerated$: Observable<Date>;
  generationInterval$: Observable<number>;
  batchSize$: Observable<number>;
  intervalOptions$: Observable<{ label: string; value: number }[]>;
  batchSizeOptions$: Observable<number[]>;
  isConfigExpanded$: Observable<boolean>;

  // Local properties for bindings
  generationStatus: GenerationStatus = 'Stopped';
  ordersGenerated = 0;
  generationRate = '1 order/sec';
  lastGenerated = new Date();
  generationInterval = 1000;
  batchSize = 1;
  intervalOptions = [
    { label: '500ms', value: 500 },
    { label: '1000ms (1 sec)', value: 1000 },
    { label: '2000ms (2 sec)', value: 2000 }
  ];
  batchSizeOptions = [1, 5, 10];
  isConfigExpanded = false;
  
  constructor(private store: Store, private cdr: ChangeDetectorRef, private ngZone: NgZone) {
    this.generationStatus$ = this.store.select(OrderProducerSelectors.selectGenerationStatus);
    this.ordersGenerated$ = this.store.select(OrderProducerSelectors.selectOrdersGenerated);
    this.generationRate$ = this.store.select(OrderProducerSelectors.selectGenerationRate);
    this.lastGenerated$ = this.store.select(OrderProducerSelectors.selectLastGenerated);
    this.generationInterval$ = this.store.select(OrderProducerSelectors.selectGenerationInterval);
    this.batchSize$ = this.store.select(OrderProducerSelectors.selectBatchSize);
    this.intervalOptions$ = this.store.select(OrderProducerSelectors.selectIntervalOptions);
    this.batchSizeOptions$ = this.store.select(OrderProducerSelectors.selectBatchSizeOptions);
    this.isConfigExpanded$ = this.store.select(OrderProducerSelectors.selectIsConfigExpanded);
  }

  ngOnInit(): void {
    // Subscribe to store values for two-way binding
    this.generationStatus$.subscribe(s => this.ngZone.run(() => { this.generationStatus = s; this.cdr.markForCheck(); }));
    this.ordersGenerated$.subscribe(o => this.ngZone.run(() => { this.ordersGenerated = o; this.cdr.markForCheck(); }));
    this.generationRate$.subscribe(r => this.ngZone.run(() => { this.generationRate = r; this.cdr.markForCheck(); }));
    this.lastGenerated$.subscribe(l => this.ngZone.run(() => { this.lastGenerated = l; this.cdr.markForCheck(); }));
    this.generationInterval$.subscribe(i => this.ngZone.run(() => { this.generationInterval = i; this.cdr.markForCheck(); }));
    this.batchSize$.subscribe(b => this.ngZone.run(() => { this.batchSize = b; this.cdr.markForCheck(); }));
    this.intervalOptions$.subscribe(o => this.ngZone.run(() => { this.intervalOptions = o; this.cdr.markForCheck(); }));
    this.batchSizeOptions$.subscribe(o => this.ngZone.run(() => { this.batchSizeOptions = o; this.cdr.markForCheck(); }));
    this.isConfigExpanded$.subscribe(e => this.ngZone.run(() => { this.isConfigExpanded = e; this.cdr.markForCheck(); }));
  }
  
  onStartGeneration(): void {
    this.store.dispatch(OrderProducerActions.startGeneration());
  }
  
  onStopGeneration(): void {
    this.store.dispatch(OrderProducerActions.stopGeneration());
  }
  
  onResetCounter(): void {
    this.store.dispatch(OrderProducerActions.resetCounter());
  }
  
  onIntervalChange(): void {
    this.store.dispatch(OrderProducerActions.setGenerationInterval({ interval: +this.generationInterval }));
  }
  
  onBatchSizeChange(): void {
    this.store.dispatch(OrderProducerActions.setBatchSize({ size: +this.batchSize }));
  }
  
  toggleConfig(): void {
    this.store.dispatch(OrderProducerActions.toggleConfig());
  }
  
  formatTimestamp(date: Date): string {
    return date.toLocaleTimeString();
  }
}
