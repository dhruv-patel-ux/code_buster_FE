import { computed, Injectable, signal } from '@angular/core';

export interface TodoInterface {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class Todo {
  storageKey = signal<string>('todos_list');
  todos = signal<TodoInterface[]>(this.loadTodos());
  state = computed(() =>{
     const todos = this.todos();
    return {
      total: todos.length,
      completed: todos.filter((t) => t.completed).length,
      pending: todos.filter((t) => !t.completed).length,
    };
  })

  constructor() {}

  private loadTodos(): TodoInterface[] {
    const stored = localStorage.getItem(this.storageKey());
    return stored ? JSON.parse(stored) : [];
  }

  addTodo(data: any): void {
    const { title, dueDate } = data ;
    const newTodo: TodoInterface = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date(),
      dueDate,
    };
    this.todos.set([newTodo, ...this.todos()]);
    this.saveTodos();
  }
  updateTodo(id: string, updates: Partial<TodoInterface>): void {
    const updated = this.todos().map((todo) =>
      todo.id === id ? { ...todo, ...updates } : todo
    );
    this.todos.set([...updated]);
    this.saveTodos();
  }

  deleteTodo(id: string): void {
    this.todos.set(this.todos().filter((todo) => todo.id !== id));
    this.saveTodos();
  }

  toggleTodo(id: string): void {
    this.updateTodo(id, {
      completed: !this.todos().find((t) => t.id === id)?.completed,
    });
  }

  clearCompleted(): void {
    this.todos.set(this.todos().filter((t) => !t.completed));
    this.saveTodos();
  }

  getStats() {
    const todos = this.todos();
    return {
      total: todos.length,
      completed: todos.filter((t) => t.completed).length,
      pending: todos.filter((t) => !t.completed).length,
    };
  }

  private saveTodos(): void {
    localStorage.setItem(this.storageKey(), JSON.stringify(this.todos()));
  }
}
