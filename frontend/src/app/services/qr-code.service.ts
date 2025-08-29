import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {
  private baseUrl = 'http://localhost:8080/api/qr';

  constructor(private http: HttpClient) {}

  getPng(carId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${carId}`, { responseType: 'blob' });
  }
}
