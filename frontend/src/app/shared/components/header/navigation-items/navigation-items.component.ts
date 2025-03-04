import { NgClass, NgIf, NgStyle, Location, AsyncPipe } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppStateService } from '../../../../services/app-state.service';
import { GuardService } from '../../../../services/guard.service';
import { RestService } from '../../../../services/rest.service';
import { BackArrowIconComponent } from '../../../../shared/components/icons/back-arrow-icon/back-arrow-icon.component';
import { WindowUtils } from '../../../../shared/utils/window.utils';

@Component({
  selector: 'app-navigation-items',
  templateUrl: './navigation-items.component.html',
  styleUrls: ['./navigation-items.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    NgStyle,
    RouterLink,
    BackArrowIconComponent,
    AsyncPipe
  ]
})
export class NavigationItemsComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  isMobileMenu = false;

  subscriptions: Subscription[] = [];

  static controlCartRecovery_INIT: boolean = false;

  isInventorySubmenuOpen = false;

  cartCount$ = this.appState.cartCount$;

  constructor(
    public appState: AppStateService,
    private restService: RestService,
    private guardService: GuardService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.logState();
    
    // Add debug logging for cart count
    this.cartCount$.subscribe(count => {
        console.log('Current cart count:', count);
    });

    if (!NavigationItemsComponent.controlCartRecovery_INIT) {
        this.controlCartRecovery();
        NavigationItemsComponent.controlCartRecovery_INIT = true;
    }

    this.appState.logState();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isMobileMenu']) {
      this.logState();
    }
  }

  private logState() {
    console.log({
      isMobileMenu: this.isMobileMenu,
      isInitDone: this.appState.isInitDone(),
      isUserAuth: this.appState.isUserAuth(),
      isUserAdmin: this.appState.isUserAdmin()
    });
  }

  toggleSubmenu(event: Event) {
    event.preventDefault();
    this.isInventorySubmenuOpen = !this.isInventorySubmenuOpen;
  }

  closeMobileMenu() {
    this.isInventorySubmenuOpen = false;
    this.appState.setMobileMenu(false);
    WindowUtils.setBodyOverflow('visible');
  }

  logout() {
    // Implement logout logic
    this.appState.setUserAuth(false);
    this.appState.setUserAdmin(false);
    this.router.navigate(['/']);
  }

  controlCartRecovery() {
    this.appState.controlCartRecovery.subscribe(
      (dataId: number) => {
        //ask the server to recover the cart from cache after it was destroyed. The cart is then placed in the session again
        const observableRequest = this.restService.getFlashingRequestBuilder().flashCart(dataId);
        const responseHandler = this.restService.getFlashingResponseHandler();

        console.log('SENT FLASH CART REQUEST');

        //send request
        const sub = observableRequest.subscribe({

          next: (httpResponse: HttpResponse<void>) => {
            responseHandler.flashCart_OK(httpResponse);
          },

          error: (httpErrorResponse) => {
            responseHandler.flashCart_ERROR(httpErrorResponse);
          }

        });

        //save subs
        this.subscriptions.push(sub);
        this.guardService.addSubscriptionFromOutside(sub);
      }
    );
  }

  back() {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

}
