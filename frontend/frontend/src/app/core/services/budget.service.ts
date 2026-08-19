import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Budget } from '../models/budget.model';
import { TransactionService } from './transaction.service';

export interface BudgetProgress extends Budget {
  spent: number;
  remaining: number;
  percentUsed: number;
}

interface BudgetResponse {
  success: boolean;
  message?: string;
  budgetId?: number;
}

interface GetBudgetsResponse {
  success: boolean;
  budgets: Budget[];
}

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  // IMPORTANT: no [ ] or ( ) around the URL
  private readonly API_URL = 'http://localhost:5000/api/budgets';

  private allBudgets = signal<Budget[]>([]);

  selectedMonth = signal<string>(this.currentMonthString());

  constructor(
    private http: HttpClient,
    private txService: TransactionService
  ) {}

  private currentMonthString(): string {
    const now = new Date();

    return `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, '0')}`;
  }

  // Load budgets from MySQL
  loadBudgets(): void {

    this.http.get<GetBudgetsResponse>(
      this.API_URL,
      { withCredentials: true }
    ).subscribe({

      next: (response) => {

        console.log('BUDGET API RESPONSE:', response);

        if (response.success) {

          const budgets = response.budgets.map(budget => ({
            ...budget,
            id: Number(budget.id),
            limit: Number(budget.limit),
            month: String(budget.month).slice(0, 7)
          }));

          console.log('BUDGETS AFTER MAPPING:', budgets);
          console.log('SELECTED MONTH:', this.selectedMonth());

          this.allBudgets.set(budgets);
        }
      },

      error: (error) => {
        console.error('FAILED TO LOAD BUDGETS:', error);
        this.allBudgets.set([]);
      }
    });
  }

  // Budgets for selected month + spending calculation
  budgetsWithProgress = computed<BudgetProgress[]>(() => {

    const month = this.selectedMonth();

    const monthBudgets = this.allBudgets().filter(
      b => b.month === month
    );

    const monthExpenses = this.txService
      .transactions()
      .filter(
        t =>
          t.type === 'expense' &&
          t.date.startsWith(month)
      );

    return monthBudgets.map(b => {

      const spent = monthExpenses
        .filter(t => t.category === b.category)
        .reduce(
          (sum, t) => sum + Number(t.amount),
          0
        );

      return {
        ...b,
        spent,
        remaining: b.limit - spent,
        percentUsed: b.limit > 0
          ? Math.min(
              100,
              Math.round((spent / b.limit) * 100)
            )
          : 0
      };
    });
  });

  // Categories already having a budget
  budgetedCategories = computed(() =>
    new Set(
      this.budgetsWithProgress().map(
        b => b.category
      )
    )
  );

  // Create or update budget
  setLimit(category: string, limit: number): void {

    const month = this.selectedMonth();

    const existing = this.allBudgets().find(
      b =>
        b.month === month &&
        b.category === category
    );

    // Update existing budget
    if (existing) {

      this.http.put<BudgetResponse>(
        `${this.API_URL}/${existing.id}`,
        {
          category,
          limit,
          month: `${month}-01`
        },
        { withCredentials: true }
      ).subscribe({

        next: (response) => {

          console.log('UPDATE BUDGET RESPONSE:', response);

          if (response.success) {
            this.loadBudgets();
          }
        },

        error: (error) => {
          console.error(
            'FAILED TO UPDATE BUDGET:',
            error
          );
        }
      });

      return;
    }

    // Create new budget
    this.http.post<BudgetResponse>(
      this.API_URL,
      {
        category,
        limit,
        month: `${month}-01`
      },
      { withCredentials: true }
    ).subscribe({

      next: (response) => {

        console.log('CREATE BUDGET RESPONSE:', response);

        if (response.success) {
          this.loadBudgets();
        }
      },

      error: (error) => {
        console.error(
          'FAILED TO CREATE BUDGET:',
          error
        );
      }
    });
  }

  // Delete budget
  delete(id: number): void {

    this.http.delete<BudgetResponse>(
      `${this.API_URL}/${id}`,
      { withCredentials: true }
    ).subscribe({

      next: (response) => {

        console.log('DELETE BUDGET RESPONSE:', response);

        if (response.success) {
          this.loadBudgets();
        }
      },

      error: (error) => {
        console.error(
          'FAILED TO DELETE BUDGET:',
          error
        );
      }
    });
  }
}