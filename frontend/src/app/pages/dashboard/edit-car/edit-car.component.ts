// src/app/pages/dashboard/edit-car/edit-car.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarService } from '../../../services/car.service';
import { Car } from '../../../models/car.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-car',
  templateUrl: './edit-car.component.html',
  styleUrls: ['./edit-car.component.css']
})
export class EditCarComponent implements OnInit {
  car: Car = this.createEmptyCar();
  isLoading = true;
  selectedFile: File | null = null;

  constructor(
    private carService: CarService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const carId = Number(idParam);

    if (!idParam || isNaN(carId) || carId <= 0) {
      Swal.fire('❌ Erreur', 'ID de voiture invalide', 'error').then(() => this.router.navigate(['/dashboard']));
      return;
    }

    this.carService.getCarById(carId).subscribe({
      next: (data: Car) => {
        this.car = { ...data };
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement de la voiture:', err);
        Swal.fire('❌ Erreur', 'Impossible de charger les détails de la voiture', 'error').then(() => this.router.navigate(['/dashboard']));
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  saveCar(): void {
    if (!this.isValidCar()) return;

    Swal.fire({
      title: 'Tu es sûr(e) ?',
      text: 'Veux-tu vraiment mettre à jour cette voiture ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '✅ Oui, mettre à jour',
      cancelButtonText: '❌ Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;

        if (this.selectedFile) {
          this.uploadImageAndSave();
        } else {
          this.saveCarWithoutImage();
        }
      }
    });
  }

  private uploadImageAndSave(): void {
    const formData = new FormData();
    formData.append('image', this.selectedFile!);

    this.carService.uploadImage(this.car.id, formData).subscribe({
      next: (imageUrl) => {
        this.car.imageUrl = imageUrl;
        this.saveCarWithoutImage();
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire('❌ Erreur', 'Échec du téléchargement de l’image', 'error');
      }
    });
  }

  private saveCarWithoutImage(): void {
    this.carService.updateCar(this.car).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire('✅ Succès', 'Voiture mise à jour avec succès !', 'success').then(() => this.router.navigate(['/dashboard']));
      },
      error: (err) => {
        this.isLoading = false;
        console.error('❌ Erreur lors de la mise à jour:', err);
        Swal.fire('❌ Erreur', 'Échec de la mise à jour de la voiture', 'error');
      }
    });
  }

  private isValidCar(): boolean {
    if (!this.car.brand || !this.car.model || !this.car.year || !this.car.price) {
      Swal.fire('⚠️ Attention', 'Veuillez remplir tous les champs obligatoires', 'warning');
      return false;
    }
    return true;
  }

  private createEmptyCar(): Car {
    return {
      id: 0,
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      fuelType: '',
      transmission: '',
      color: '',
      description: '',
      imageUrl: '',
      status: 'AVAILABLE',
      soldCount: 0 
    };
  }
}