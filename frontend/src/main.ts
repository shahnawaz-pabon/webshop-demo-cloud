import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';
import { AppStateService } from './app/services/app-state.service';
import { FirebaseService } from './app/services/firebase.service';
import { RestService } from './app/services/rest.service';
import { GuardService } from './app/services/guard.service';
import { ErrorsHandlingService } from './app/services/errors-handling.service';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {

  providers: [
    provideRouter(appRoutes),
    provideHttpClient(),
    { provide: AppStateService },
    { provide: FirebaseService },
    { provide: RestService },
    { provide: GuardService },
    { provide: ErrorsHandlingService }
  ]
}).catch(err => console.error(err));
