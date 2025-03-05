import { Component, HostListener, OnInit } from '@angular/core';
import { AppStateService } from './services/app-state.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { LoaderComponent } from './shared/components/animations/loader/loader.component';
import { NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { WindowUtils } from './shared/utils/window.utils';
import { NavComponent } from './shared/components/nav/nav.component';

import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    NgIf,
    RouterOutlet,
    HeaderComponent,
    LoaderComponent,
    NavComponent
  ]
})
export class AppComponent implements OnInit {

  constructor(
    public appState: AppStateService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.cartService.getCart().subscribe((data) => {
      const totalQuantity = data.data.cart
        .map(item => item.quantity)
        .reduce((acc, curr) => acc + curr, 0);
      this.appState.updateCartCount(totalQuantity);
    });

  }

  @HostListener('window-resize')
  onWindowResize() {
    if (window.innerWidth >= 900) {
      this.closeMobileMenu();
    }
  }

  closeMobileMenu() {
    this.appState.setMobileMenu(false);
    WindowUtils.setBodyOverflow('visible');
  }

}
