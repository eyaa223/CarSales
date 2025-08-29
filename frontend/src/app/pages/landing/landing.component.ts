// src/app/pages/landing/landing.component.ts
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialisation si nécessaire
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const header = document.querySelector('.landing-header');
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }

  scrollToGallery(): void {
    this.router.navigate(['/gallery']);
  }
}