import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-statistics-card',
  imports: [NgClass],
  templateUrl: './statistics-card.component.html',
})
export class StatisticsCardComponent {
  title = input.required<string>();
  value = input.required<string | number>();
  iconColor = input<string>('blue');
  valueColor = input<string>('slate-800');
  valueSize = input<'sm' | 'lg'>('lg');
}

