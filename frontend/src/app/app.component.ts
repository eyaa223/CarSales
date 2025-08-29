import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  showNavbar = true;
  title='CarSales';

  constructor(private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Cacher la navbar pour certaines routes
        this.showNavbar = !['/login'].includes(event.url);
      }
    });
  }
}
