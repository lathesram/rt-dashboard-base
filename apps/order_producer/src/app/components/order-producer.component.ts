import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  isConfigExpanded = false;
  
  constructor() {
    this.ordersGenerated = 0;
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
  
  formatTimestamp(date: Date): string {
    return date.toLocaleTimeString();
  }
}
