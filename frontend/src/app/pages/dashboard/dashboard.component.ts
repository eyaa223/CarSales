import { Component, OnInit } from '@angular/core';
import { CarService } from '@app/services/car.service';
import { Car } from '@app/models/car.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  cars: Car[] = [];
  backendUrl = 'http://localhost:8080'; // <-- ajoute l'URL de ton backend ici

  constructor(
    private carService: CarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.carService.getCars().subscribe({
      next: (cars) => {
        this.cars = cars;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des voitures', err);
      }
    });
  }

  deleteCar(id: number): void {
    if (confirm('Tu es sûr de vouloir supprimer cette voiture ?')) {
      this.carService.deleteCar(id).subscribe({
        next: () => {
          this.loadCars(); // Rafraîchit la liste
        },
        error: (err) => {
          alert('Erreur lors de la suppression');
        }
      });
    }
  }

  getCarImageUrl(car: Car): string {
    return car.imageUrl ? `${this.backendUrl}${car.imageUrl}` : 'https://via.placeholder.com/300x200?text=No+Image';
  }
}
