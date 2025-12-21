import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { TodoInterface, Todo } from '../../services/todo';
import { Auth } from '../../../../core/services/auth';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-todo-list',
  imports: [CommonModule, FormsModule, RouterModule, MatDialogModule, MatCheckboxModule, MatIconModule, MatButtonModule],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
})
export class TodoList {
  readonly dialog = inject(MatDialog);
  readonly authService = inject(Auth);
  readonly router = inject(Router);
  readonly todoService = inject(Todo);
  todos = signal<TodoInterface[]>([]);
  filter = signal<'all' | 'pending' | 'completed'>('all');
  filteredTodos = computed<TodoInterface[]>(() =>{
    const todos = this.todos();
    switch (this.filter()) {
      case 'completed':
        return todos.filter((t) => t.completed);
      case 'pending':
        return todos.filter((t) => !t.completed);
      default:
        return todos;
    }
  });

  constructor() {
    effect(() => {
      const todo: TodoInterface[] = this.todoService.todos();
      if (!todo) return;
      untracked(() => {
        this.todos.set([...todo]);
      })
    })
  }

  toggleTodo(id: string): void {
    this.todoService.toggleTodo(id);
  }

  deleteTodo(id: string): void {
    this.todoService.deleteTodo(id);
  }

  setFilter(filter: 'all' | 'pending' | 'completed'): void {
    this.filter.set(filter);
  }

  clearCompleted(): void {
    this.todoService.clearCompleted();
  }

  async addTodo(): Promise<void> {
    const { CreateTodo } = await import('../create-todo/create-todo');
    this.dialog.open(CreateTodo);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
