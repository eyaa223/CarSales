import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '@app/services/auth.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, 
    private router: Router            
  ) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Raccourci pour les contrôles
  get f() {
    return this.signupForm.controls;
  }

  //  Appelée quand le formulaire est soumis
  onSubmit(): void {
    this.submitted = true;

    if (this.signupForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir correctement tous les champs.'
      });
      return;
    }

    //  Appel au backend
    this.authService.register(
      this.f['username'].value,
      this.f['email'].value,
      this.f['password'].value
    ).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Inscription réussie !',
          html: 'Vous pouvez maintenant vous <a href="/login">connecter</a>.',
          timer: 4000,
          timerProgressBar: true,
          willClose: () => {
            this.signupForm.reset();
            this.submitted = false;
            this.router.navigate(['/login']);
          }
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Échec de l’inscription',
          text: err.error?.message || 'Une erreur est survenue.'
        });
      }
    });
  }
}