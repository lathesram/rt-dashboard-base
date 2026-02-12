import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersFacade, ProducerStatus } from '@rt-dashboard/shared/data-access-orders';
import { Observable, Subscription, interval } from 'rxjs';


@Component({
  selector: 'rt-order-producer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-producer.component.html',
  styleUrls: ['./order-producer.component.scss']
})
export class OrderProducerComponent implements OnInit, OnDestroy {
  private facade = inject(OrdersFacade);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);
  private autoRefreshSubscription?: Subscription;

  // State from store
  generationStatus$: Observable<ProducerStatus> = this.facade.producerStatus$;
  ordersGenerated$: Observable<number> = this.facade.generatedCount$;
  generationRate$: Observable<number> = this.facade.generationRate$;
  lastGenerated$: Observable<Date | null> = this.facade.lastGeneratedAt$;
  
  // Local config state (synced with store)
  generationInterval = 1000;
  batchSize = 1;
  
  intervalOptions = [
    { label: '500ms', value: 500 },
    { label: '1000ms (1 sec)', value: 1000 },
    { label: '2000ms (2 sec)', value: 2000 }
  ];
  
  batchSizeOptions = [1, 5, 10];
  isConfigExpanded = false;
  
  ngOnInit(): void {
    // Initialize config from store
    this.facade.producerConfig$.subscribe(config => {
      this.zone.run(() => {
        this.generationInterval = config.interval;
        this.batchSize = config.batchSize;
        this.cdr.detectChanges();
      });
    });
    
    // Start auto-refresh for real-time updates
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
  
  onStartGeneration(): void {
    this.facade.startProducer();
  }
  
  onStopGeneration(): void {
    this.facade.stopProducer();
  }
  
  onResetCounter(): void {
    this.facade.resetProducer();
  }
  
  onIntervalChange(): void {
    this.facade.updateProducerConfig({ interval: this.generationInterval });
  }
  
  onBatchSizeChange(): void {
    this.facade.updateProducerConfig({ batchSize: this.batchSize });
  }
  
  toggleConfig(): void {
    this.isConfigExpanded = !this.isConfigExpanded;
  }
  
  formatTimestamp(date: Date | null): string {
    if (!date) return 'Never';
    return date.toLocaleTimeString();
  }

  formatRate(rate: number | null): string {
    if (!rate) return '0.00 orders/sec';
    return `${rate.toFixed(2)} orders/sec`;
  }
}
