// src/app/pages/contact/contact.component.ts
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  name = '';
  email = '';
  message = '';
  success = false;

  onSubmit() {
    if (this.name && this.email && this.message) {
      // Ici, envoyez le message (ex: via un service)
      console.log('Message envoyé:', { name: this.name, email: this.email, message: this.message });
      this.success = true;
      // Réinitialiser le formulaire
      this.name = '';
      this.email = '';
      this.message = '';
      
      // Cacher le message de succès après 5 secondes
      setTimeout(() => {
        this.success = false;
      }, 5000);
    }
  }

  // Header fixed on scroll
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const header = document.querySelector('.contact-header');
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }
}