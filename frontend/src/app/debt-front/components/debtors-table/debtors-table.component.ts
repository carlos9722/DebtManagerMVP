import { Component, input, output } from '@angular/core';
import { Debtor } from '../../interfaces/debtor.interface';

@Component({
  selector: 'app-debtors-table',
  imports: [],
  templateUrl: './debtors-table.component.html',
})
export class DebtorsTableComponent {
  debtors = input.required<Debtor[]>();
  isLoading = input<boolean>(false);
  
  onEdit = output<Debtor>();
  onDelete = output<Debtor>();
}

