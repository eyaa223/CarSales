// src/app/app.module.ts
import { NgModule , LOCALE_ID} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule , HTTP_INTERCEPTORS} from '@angular/common/http';


import { CommonModule } from '@angular/common';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { CarDetailsComponent } from './components/car-details/car-details.component';
import { AddCarComponent } from './pages/add-car/add-car.component';
import { CarCardComponent } from './components/car-card/car-card.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './pages/login/login.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CartComponent } from './pages/cart/cart.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EditCarComponent } from './pages/dashboard/edit-car/edit-car.component';
import { StatsComponent } from './pages/dashboard/stats/stats.component';
import { FooterComponent } from './components/footer/footer.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LandingComponent } from './pages/landing/landing.component';
import { TruncatePipe } from './pipes/truncate.pipe';
 import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);
// Services
import { CarService } from './services/car.service';
import { AboutComponent } from './pages/about/about.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';

@NgModule({
  declarations: [
    AppComponent,
    CarDetailsComponent,
    AddCarComponent,
    CarCardComponent,
    NavbarComponent,
    LoginComponent,
    GalleryComponent,
    ContactComponent,
    CartComponent,
    DashboardComponent,
    EditCarComponent,
    StatsComponent,
    FooterComponent,
    SignupComponent,
    LandingComponent,
        HomeComponent,
        AboutComponent,
        CheckoutComponent,
        MyOrdersComponent

     

    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    CommonModule,
    TruncatePipe

  ],
  providers: [
     { provide: LOCALE_ID, useValue: 'fr-FR' },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ], 
  bootstrap: [AppComponent]
})
export class AppModule {}
