import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'rt-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  features = [
    {
      title: 'Order Producer',
      description: 'Generate and manage orders with real-time controls. Start, pause, or stop order generation with configurable settings.',
      icon: '⚡',
      route: '/order_producer',
      color: '#667eea'
    },
    {
      title: 'Order List',
      description: 'View all orders in a comprehensive table. Search, filter by status, and sort with advanced pagination controls.',
      icon: '📋',
      route: '/order_list',
      color: '#f093fb'
    },
    {
      title: 'Order Summary',
      description: 'Monitor key performance indicators and analytics. Track revenue, order trends, and system performance metrics.',
      icon: '📊',
      route: '/order_summary',
      color: '#4facfe'
    }
  ];
}
