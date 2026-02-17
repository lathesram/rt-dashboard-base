import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as OrderProducerActions from '../store/order-producer.actions';
import * as OrderProducerSelectors from '../store/order-producer.selectors';
import { GenerationStatus } from '../store/order-producer.state';

@Component({
  selector: 'rt-order-producer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-producer.component.html',
  styleUrls: ['./order-producer.component.scss']
})
export class OrderProducerComponent implements OnInit, OnDestroy {
  // Observables from local store
  generationStatus$: Observable<GenerationStatus>;
  ordersGenerated$: Observable<number>;
  generationRate$: Observable<string>;
  lastGenerated$: Observable<Date>;
  generationInterval$: Observable<number>;
  batchSize$: Observable<number>;
  intervalOptions$: Observable<{ label: string; value: number }[]>;
  batchSizeOptions$: Observable<number[]>;
  isConfigExpanded$: Observable<boolean>;
  
  // Current values for ngModel binding
  generationStatus: GenerationStatus = 'Stopped';
  generationInterval = 1000;
  batchSize = 1;
  
  private subscriptions = new Subscription();
  
  constructor(
    private store: Store
  ) {
    // Initialize observables
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
    // Subscribe to generation status for local state
    this.subscriptions.add(
      this.generationStatus$.subscribe(status => {
        this.generationStatus = status;
      })
    );
    
    // Subscribe to interval and batch size for ngModel binding
    this.subscriptions.add(
      this.generationInterval$.subscribe(interval => {
        this.generationInterval = interval;
      })
    );
    
    this.subscriptions.add(
      this.batchSize$.subscribe(size => {
        this.batchSize = size;
      })
    );
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
    this.store.dispatch(OrderProducerActions.setGenerationInterval({ interval: this.generationInterval }));
  }
  
  onBatchSizeChange(): void {
    this.store.dispatch(OrderProducerActions.setBatchSize({ size: this.batchSize }));
  }
  
  toggleConfig(): void {
    this.store.dispatch(OrderProducerActions.toggleConfig());
  }
  
  formatTimestamp(date: Date): string {
    return date.toLocaleTimeString();
  }
}
