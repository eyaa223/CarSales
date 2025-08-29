// src/app/services/car.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Car } from '../models/car.model';
import { map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private readonly baseUrl = 'http://localhost:8080/api/cars';

  constructor(private http: HttpClient) {}

  // ✅ Récupère toutes les voitures
  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.baseUrl);
  }

  // ✅ Récupère une voiture par ID
  getCarById(id: number): Observable<Car> {
    return this.http.get<Car>(`${this.baseUrl}/${id}`);
  }

  // ✅ Crée une nouvelle voiture (ADMIN)
  createCar(car: Car): Observable<Car> {
    return this.http.post<Car>(this.baseUrl, car);
  }

  // ✅ Met à jour une voiture (ADMIN)
  updateCar(car: Car): Observable<Car> {
    return this.http.put<Car>(`${this.baseUrl}/${car.id}`, car);
  }

  // ✅ Supprime une voiture (ADMIN)
  deleteCar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // ✅ Marque une voiture comme vendue (ADMIN)
  sellCar(carId: number): Observable<Car> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.post<Car>(`${this.baseUrl}/${carId}/sell`, {}, { headers });
  }

  // ✅ Télécharge une image de voiture (ADMIN)
  uploadImage(carId: number, formData: FormData): Observable<string> {
    return this.http.post<{ imageUrl: string }>(`${this.baseUrl}/${carId}/upload`, formData).pipe(
      map(response => response.imageUrl)
    );
  }

  // ✅ Génère un QR code pour une voiture
  getQrCodeImage(carId: number): Observable<string> {
    return this.http.get<{ qrcode: string }>(`${this.baseUrl}/${carId}/qrcode`).pipe(
      map(response => 'data:image/png;base64,' + response.qrcode.trim())
    );
  }
}