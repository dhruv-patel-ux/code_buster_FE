import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../../core/services/auth';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  formBuilder = inject(FormBuilder);
  authService = inject(Auth);
  router = inject(Router);

  loginForm = this.formBuilder.group({
    email: [''],
    password: [''],
  });

  loading = signal(false);
  error = '';

  constructor(
  ) { }

  onLogin(): void {
    this.loading.set(true);
    this.error = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/todos']);
      },
      error: (error) => {
        this.error = error.error?.error || 'Login failed';
        this.loading.set(false);
      },
    });
  }
  onRegister() {
    this.router.navigate(['/register']);
  }
}
