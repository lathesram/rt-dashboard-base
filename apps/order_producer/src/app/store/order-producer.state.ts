export type GenerationStatus = 'Active' | 'Paused' | 'Stopped';

export interface OrderProducerState {
  generationStatus: GenerationStatus;
  ordersGenerated: number;
  generationRate: string;
  lastGenerated: Date;
  generationInterval: number;
  batchSize: number;
  intervalOptions: { label: string; value: number }[];
  batchSizeOptions: number[];
  isConfigExpanded: boolean;
}

export const initialOrderProducerState: OrderProducerState = {
  generationStatus: 'Stopped',
  ordersGenerated: 0,
  generationRate: '1 order/sec',
  lastGenerated: new Date(),
  generationInterval: 1000,
  batchSize: 1,
  intervalOptions: [
    { label: '500ms', value: 500 },
    { label: '1000ms (1 sec)', value: 1000 },
    { label: '2000ms (2 sec)', value: 2000 }
  ],
  batchSizeOptions: [1, 5, 10],
  isConfigExpanded: false
};
