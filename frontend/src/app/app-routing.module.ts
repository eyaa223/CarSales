// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { CarDetailsComponent } from './components/car-details/car-details.component';
import { AddCarComponent } from './pages/add-car/add-car.component';
import { LoginComponent } from './pages/login/login.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CartComponent } from './pages/cart/cart.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EditCarComponent } from './pages/dashboard/edit-car/edit-car.component';
import { StatsComponent } from './pages/dashboard/stats/stats.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LandingComponent } from './pages/landing/landing.component';
import { AboutComponent } from './pages/about/about.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ThankYouComponent } from './pages/thank-you/thank-you.component'; 
import { AuthGuard } from './guards/auth.guard';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';


export const routes: Routes = [
  { path: '', component: LandingComponent }, 
  { path: 'home', component: HomeComponent }, 
  { path: 'about', component: AboutComponent },
  { path: 'gallery', component: GalleryComponent }, 
  { path: 'contact', component: ContactComponent }, 
  { path: 'cart', component: CartComponent }, 
  { path: 'car-details/:id', component: CarDetailsComponent }, 
  { path: 'car/:id', component: CarDetailsComponent }, 

  // 🔐 Réservé ADMIN
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' } },
  { path: 'add-car', component: AddCarComponent, canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' } },
  { path: 'dashboard/edit/:id', component: EditCarComponent, canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' } },
  { path: 'dashboard/stats', component: StatsComponent, canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' } },

  // 🚪 Authentification
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // 💳 Processus de commande
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'thank-you', component: ThankYouComponent, canActivate: [AuthGuard] }, 
  { path: 'my-orders', component: MyOrdersComponent, canActivate: [AuthGuard] },

  // 🔄 Redirection
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }