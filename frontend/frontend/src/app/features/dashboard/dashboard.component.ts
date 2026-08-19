import { Component, computed, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { TransactionService } from '../../core/services/transaction.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {

  constructor(
    public auth: AuthService,
    public txService: TransactionService
  ) {}

  ngOnInit(): void {
    // Load transactions when dashboard opens
    this.txService.loadTransactions();
  }

  // Convert MySQL amount/string values to number
  amountNumber(value: number | string): number {
    return Number(value);
  }

  // Latest 5 transactions
  recentTransactions = computed(() =>
    this.txService.transactions().slice(0, 5)
  );

  // Maximum value for bar chart
  maxBarValue = computed(() => {
    const income = this.amountNumber(this.txService.totalIncome());
    const expense = this.amountNumber(this.txService.totalExpense());

    return Math.max(income, expense, 1);
  });

  // Income bar height
  incomeBarHeight = computed(() => {
    const income = this.amountNumber(this.txService.totalIncome());

    if (income <= 0) {
      return 0;
    }

    return Math.min(
      100,
      Math.round((income / this.maxBarValue()) * 100)
    );
  });

  // Expense bar height
  expenseBarHeight = computed(() => {
    const expense = this.amountNumber(this.txService.totalExpense());

    if (expense <= 0) {
      return 0;
    }

    return Math.min(
      100,
      Math.round((expense / this.maxBarValue()) * 100)
    );
  });

  // Expense breakdown
  expenseBreakdown = computed(() => {

    const expenses = this.txService
      .transactions()
      .filter(t => t.type === 'expense');

    const total = expenses.reduce(
      (sum, t) => sum + this.amountNumber(t.amount),
      0
    );

    if (total === 0) {
      return [];
    }

    const byCategory = new Map<string, number>();

    for (const t of expenses) {

      const amount = this.amountNumber(t.amount);

      byCategory.set(
        t.category,
        (byCategory.get(t.category) ?? 0) + amount
      );
    }

    const colors = [
      '#4361ee',
      '#2a9d5c',
      '#f4a261',
      '#e63946',
      '#9d4edd'
    ];

    return Array.from(byCategory.entries()).map(
      ([category, amount], i) => ({
        category,
        amount,
        percent: Math.round((amount / total) * 100),
        color: colors[i % colors.length]
      })
    );
  });

  // Pie chart gradient
  pieGradient = computed(() => {

    const segments = this.expenseBreakdown();

    let cumulative = 0;

    const stops = segments.map(segment => {

      const start = cumulative;

      cumulative += segment.percent;

      return `${segment.color} ${start}% ${cumulative}%`;
    });

    return `conic-gradient(${stops.join(', ')})`;
  });

  // Savings rate
  savingsRate = computed(() => {

    const income = this.amountNumber(
      this.txService.totalIncome()
    );

    if (income === 0) {
      return 0;
    }

    const balance = this.amountNumber(
      this.txService.balance()
    );

    return Math.round((balance / income) * 100);
  });
}