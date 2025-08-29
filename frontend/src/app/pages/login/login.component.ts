// src/app/pages/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onLogin(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    const username = this.f['username'].value;
    const password = this.f['password'].value;

    this.authService.login(username, password).subscribe({
      next: (response) => {
        console.log('✅ Connecté', response);
        if (this.authService.isAdmin()) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        Swal.fire('❌ Erreur', 'Identifiants invalides', 'error');
      }
    });
  }
}