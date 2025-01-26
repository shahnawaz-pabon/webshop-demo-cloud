import { Component, OnInit } from '@angular/core';
import { AppStateService } from '../../../services/app-state.service';
import { NavigationItemsComponent } from './navigation-items/navigation-items.component';
import { NgClass, NgIf, NgStyle, Location } from '@angular/common';
import { BackArrowIconComponent } from '../../../shared/components/icons/back-arrow-icon/back-arrow-icon.component';
import { RouterLink, Router } from '@angular/router';
import { WindowUtils } from '../../../shared/utils/window.utils';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    NgStyle,
    NavigationItemsComponent,
    BackArrowIconComponent,
    RouterLink
  ],
})
export class HeaderComponent implements OnInit {
  isMobileView = window.innerWidth < 900;

  constructor(
    public appState: AppStateService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit() {
    // Set initial mobile menu state
    this.appState.setMobileMenu(this.isMobileView);

    // Listen for window resize
    window.addEventListener('resize', () => {
      this.isMobileView = window.innerWidth < 900;
      this.appState.setMobileMenu(this.isMobileView);
    });
  }

  toggleMobileMenu(mobileMenuElement: HTMLElement) {
    const isOpen = !this.appState.isMobileMenuOpen();
    this.appState.setMobileMenu(isOpen);
  }

  closeMobileMenu() {
    this.appState.setMobileMenu(false);
  }

  back() {
    this.router.navigate(['/']);
  }

  getMobileActionButtonsMargin(): string {
    return this.appState.isMobileMenuOpen() ? '0' : '1rem';
  }

}
