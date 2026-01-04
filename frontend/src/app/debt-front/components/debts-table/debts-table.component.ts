import { Component, input, output } from '@angular/core';
import { Debt } from '../../interfaces/debt.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-debts-table',
  imports: [DatePipe],
  templateUrl: './debts-table.component.html',
})
export class DebtsTableComponent {
  debts = input.required<Debt[]>();
  isLoading = input<boolean>(false);
  
  onEdit = output<Debt>();
  onDelete = output<Debt>();
  onPay = output<Debt>();
}

