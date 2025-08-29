// src/app/pages/gallery/gallery.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { CarService } from '../../services/car.service';
import { Car } from '../../models/car.model';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  cars: Car[] = [];
  isLoading = true;
  filteredCars: Car[] = [];
  selectedFilter: string = 'all';

  constructor(private carService: CarService) {}

  ngOnInit(): void {
    this.carService.getCars().subscribe({
      next: (data: Car[]) => {
        this.cars = data;
        this.filteredCars = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des voitures:', err);
        this.isLoading = false;
      }
    });
  }

  // Filtrer les voitures par type (basé sur la marque ou le modèle)
  filterCars(type: string): void {
    this.selectedFilter = type;
    if (type === 'all') {
      this.filteredCars = this.cars;
    } else if (type === 'suv') {
      this.filteredCars = this.cars.filter(car => 
        car.model.toLowerCase().includes('suv') || 
        car.model.toLowerCase().includes('x5') ||
        car.model.toLowerCase().includes('q7')
      );
    } else if (type === 'sedan') {
      this.filteredCars = this.cars.filter(car => 
        car.model.toLowerCase().includes('sedan') || 
        car.model.toLowerCase().includes('series') ||
        car.model.toLowerCase().includes('class')
      );
    } else if (type === 'sport') {
      this.filteredCars = this.cars.filter(car => 
        car.model.toLowerCase().includes('sport') || 
        car.model.toLowerCase().includes('gt') ||
        car.model.toLowerCase().includes('rs')
      );
    } else if (type === 'luxury') {
      this.filteredCars = this.cars.filter(car => 
        car.brand.toLowerCase().includes('mercedes') || 
        car.brand.toLowerCase().includes('bmw') ||
        car.brand.toLowerCase().includes('audi') ||
        car.brand.toLowerCase().includes('lexus')
      );
    }
  }

  // Gestion des erreurs d'image
  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/400x250/333333/ffffff?text=Image+Indisponible';
  }

  // Header fixed on scroll
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const header = document.querySelector('.gallery-header');
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }
}