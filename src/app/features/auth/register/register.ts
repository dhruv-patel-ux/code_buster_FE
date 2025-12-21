import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../../core/services/auth';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  formBuilder = inject(FormBuilder);
  authService = inject(Auth);
  router = inject(Router);

  registerForm = this.formBuilder.group({
    email: [''],
    password: [''],
  });

  loading = signal(false);
  error = '';
  success = '';

  onRegister(): void {
    this.loading.set(true);
    this.error = '';
    this.success = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.success = 'Registration successful! Redirecting to todos...';
        setTimeout(() => this.router.navigate(['/todos']), 2000);
      },
      error: (error) => {
        this.error = error.error?.error || 'Registration failed';
        this.loading.set(false);
      },
    });
  }
  onLogin(){
    this.router.navigate(['/login']);
  }
}
