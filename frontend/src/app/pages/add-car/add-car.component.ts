// src/app/pages/add-car/add-car.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  color: string;
  fuelType: string;
  transmission: string;
  mileage: number;
  price: number;
  imageUrl: string;
  description: string;
  status: string;
}

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css']
})
export class AddCarComponent {
  car: Car = {
    id: 0,
    brand: '',
    model: '',
    year: 0,
    color: '',
    fuelType: '',
    transmission: '',
    mileage: 0,
    price: 0,
    imageUrl: '',
    description: '',
    status: ''
  };

  selectedFile: File | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  addCar() {
    if (!this.selectedFile) {
      alert('Veuillez sélectionner une image');
      return;
    }

    if (!this.car.brand || !this.car.model || !this.car.year || !this.car.price) {
      alert('Veuillez remplir les champs obligatoires : marque, modèle, année, prix.');
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);
    formData.append('brand', this.car.brand);
    formData.append('model', this.car.model);
    formData.append('year', this.car.year.toString());
    formData.append('color', this.car.color || 'Unknown');
    formData.append('fuelType', (this.car.fuelType || 'GASOLINE').toUpperCase());
    formData.append('transmission', (this.car.transmission || 'AUTOMATIC').toUpperCase());
    formData.append('mileage', this.car.mileage.toString());
    formData.append('price', this.car.price.toString());
    formData.append('description', this.car.description || '');
    formData.append('status', (this.car.status || 'AVAILABLE'));

    this.http.post<Car>('http://localhost:8080/api/cars', formData)
      .subscribe({
        next: (res) => {
          console.log('✅ Voiture ajoutée:', res);
          alert('🚗 Voiture ajoutée avec succès !');
          this.resetForm();
        },
        error: (err) => {
          console.error('❌ Erreur:', err);
          if (err.status === 400) {
            alert('Erreur 400 : Vérifiez les champs (prix, type de carburant, etc.)');
          } else {
            alert('Erreur lors de l’ajout de la voiture.');
          }
        }
      });
  }

  resetForm() {
    this.car = {
      id: 0,
      brand: '',
      model: '',
      year: 0,
      color: '',
      fuelType: '',
      transmission: '',
      mileage: 0,
      price: 0,
      imageUrl: '',
      description: '',
      status: ''
    };
    this.selectedFile = null;
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
}