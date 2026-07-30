import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  showIncomeForm = false;
  showExpenseForm = false;

  transactions: { description: string; amount: number; category: string; date: string; type: string }[] = [];

  incomeForm = new FormGroup({
    description: new FormControl('', Validators.required),
    amount: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    category: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    notes: new FormControl(''),
  });

  expenseForm = new FormGroup({
    description: new FormControl('', Validators.required),
    amount: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    category: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    notes: new FormControl(''),
  });

  openIncomeForm() { this.showIncomeForm = true; }
  openExpenseForm() { this.showExpenseForm = true; }
  closeIncomeForm() { this.showIncomeForm = false; }
  closeExpenseForm() { this.showExpenseForm = false; }

  saveIncome() {
    if (this.incomeForm.valid) {
      const v = this.incomeForm.value;
      this.transactions.unshift({
        description: v.description!, amount: Number(v.amount), category: v.category!, date: v.date!, type: 'Income'
      });
      this.incomeForm.reset();
      this.showIncomeForm = false;
    }
  }

  saveExpense() {
    if (this.expenseForm.valid) {
      const v = this.expenseForm.value;
      this.transactions.unshift({
        description: v.description!, amount: Number(v.amount), category: v.category!, date: v.date!, type: 'Expense'
      });
      this.expenseForm.reset();
      this.showExpenseForm = false;
    }
  }

  get monthlyIncome() {
    return this.transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
  }

  get monthlyExpenses() {
    return this.transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
  }
}