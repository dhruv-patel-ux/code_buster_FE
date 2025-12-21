import { Component, inject, signal } from '@angular/core';
import { TodoInterface, Todo } from '../../services/todo';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
@Component({
    selector: 'app-todo-list',
    imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatDialogContent, MatDialogActions],
    templateUrl: './create-todo.html',
    styleUrls: ['./create-todo.css'],
    providers: [provideNativeDateAdapter()],
})
export class CreateTodo {
    todoService = inject(Todo);
    readonly dialogRef = inject(MatDialogRef<CreateTodo>);
    formBuilder = inject(FormBuilder);

    todoForm = this.formBuilder.group({
        title: [''],
        dueDate: [new Date()],
    });
    
    addTodo(): void {
        if (!this.todoForm.get('title')?.value?.trim()) return;
        this.todoService.addTodo(this.todoForm.value);
        this.todoForm.reset()
        this.dialogRef.close();
    }
}