import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction, TransactionType } from '../models/transaction.model';
import { AuthService } from './auth.service';

interface TransactionResponse {
  success: boolean;
  message?: string;
  transactionId?: number;
}

interface GetTransactionsResponse {
  success: boolean;
  transactions: Transaction[];
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private readonly API_URL = 'http://localhost:5000/api/transactions';

  private allTransactions = signal<Transaction[]>([]);

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  // Only this user's transactions, newest first
  transactions = computed(() =>
    this.allTransactions()
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
  );

  totalIncome = computed(() =>
    this.transactions()
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0)
  );

  totalExpense = computed(() =>
    this.transactions()
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0)
  );

  balance = computed(() =>
    this.totalIncome() - this.totalExpense()
  );

  // Get transactions from MySQL
loadTransactions(): void {
  this.http.get<GetTransactionsResponse>(
    this.API_URL,
    { withCredentials: true }
  ).subscribe({
    next: (response) => {
      if (response.success) {
        const transactions = response.transactions.map(tx => ({
          ...tx,
          id: Number(tx.id),
          amount: Number(tx.amount)
        }));

        this.allTransactions.set(transactions);
      }
    },
    error: (error) => {
      console.error('Failed to load transactions:', error);
      this.allTransactions.set([]);
    }
  });
}

  // Add transaction to MySQL
  add(
    type: TransactionType,
    category: string,
    amount: number,
    date: string
  ): void {

    const transaction = {
      type,
      category,
      amount,
      date
    };

    this.http.post<TransactionResponse>(
      this.API_URL,
      transaction,
      { withCredentials: true }
    ).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Transaction saved:', response);

          // Reload from backend so UI contains DB data
          this.loadTransactions();
        }
      },
      error: (error) => {
        console.error('Failed to create transaction:', error);
      }
    });
  }

  // Delete transaction from MySQL
  delete(id: number | string): void {

    this.http.delete<TransactionResponse>(
      `${this.API_URL}/${id}`,
      { withCredentials: true }
    ).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Transaction deleted');

          // Reload from backend
          this.loadTransactions();
        }
      },
      error: (error) => {
        console.error('Failed to delete transaction:', error);
      }
    });
  }
}