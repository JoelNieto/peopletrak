import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';

import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import es from '../../public/i18n/es.json';

@Component({
    imports: [RouterOutlet, NgxSpinnerComponent],
    providers: [MessageService],
    selector: 'app-root',
    template: ` <router-outlet />
    <ngx-spinner type="ball-scale-multiple" bdColor="rgb(99, 102, 241, 0.8)">
      <p class="text-white">Cargando...</p></ngx-spinner
    >`,
    styles: ``
})
export class AppComponent implements OnInit {
  private config = inject(PrimeNGConfig);
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);

  ngOnInit() {
    this.router.initialNavigation();
    this.config.setTranslation(es);
    this.spinner.show();
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 2000);
  }
}
