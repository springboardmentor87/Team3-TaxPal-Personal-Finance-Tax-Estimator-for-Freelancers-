import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../../core/services/transaction.service';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css',
})
export class TransactionListComponent implements OnInit {

  constructor(public txService: TransactionService) {}

  ngOnInit(): void {
    this.txService.loadTransactions();
  }

  delete(id: number): void {
    this.txService.delete(id);
  }
}