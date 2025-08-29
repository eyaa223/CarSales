// src/app/pages/dashboard/stats/stats.component.ts
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import Swal from 'sweetalert2';
import { Chart, registerables } from 'chart.js';
import { CarService } from '../../../services/car.service';
import { Car } from '../../../models/car.model';

Chart.register(...registerables);

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit, AfterViewInit {
  cars: Car[] = [];
  @ViewChild('chartCanvas') private chartCanvas!: ElementRef;
  private chart: Chart | null = null;

  constructor(private carService: CarService) {}

  ngOnInit(): void {
    this.loadCars();
  }

  ngAfterViewInit(): void {}

  loadCars(): void {
    this.carService.getCars().subscribe({
      next: (data) => {
        this.cars = data;
        if (this.chartCanvas) this.renderChart();
      },
      error: (err) => {
        console.error('❌ Erreur de chargement des voitures', err);
        Swal.fire('Erreur', 'Impossible de charger les données', 'error');
      }
    });
  }

  get topSellingCar(): Car | null {
    return this.cars.length
      ? [...this.cars].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))[0]
      : null;
  }

  get mostExpensiveCar(): Car | null {
    return this.cars.length
      ? [...this.cars].sort((a, b) => b.price - a.price)[0]
      : null;
  }

  get averagePrice(): number {
    return this.cars.reduce((sum, car) => sum + car.price, 0) / this.cars.length || 0;
  }

  get totalValue(): number {
    return this.cars.reduce((sum, car) => sum + car.price, 0);
  }

  private renderChart(): void {
    if (!this.chartCanvas || !this.chartCanvas.nativeElement) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (this.chart) this.chart.destroy();

    const labels = this.cars.map(car => `${car.brand} ${car.model}`);
    const data = this.cars.map(car => car.price);

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Prix (TND)',
          data,
          backgroundColor: 'rgba(52, 152, 219, 0.8)',
          borderColor: 'rgba(41, 128, 185, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          tooltip: { enabled: true }
        },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Prix (TND)' } }
        }
      }
    });
  }

  // ✅ Méthode unique pour vendre une voiture
  sellCar(car: Car) {
    this.carService.sellCar(car.id).subscribe({
      next: () => {
        Swal.fire('✅ Vendue !', `${car.brand} ${car.model} est maintenant marquée comme vendue.`, 'success');
        this.loadCars(); // Rafraîchir
      },
      error: (err) => {
        Swal.fire('❌ Erreur', 'Impossible de vendre la voiture.', 'error');
      }
    });
  }
}