import { ResponsiveService } from './../services/responsive.service';
import { SigninFormComponent } from './../signin-form/signin-form.component';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedModule } from '../shared/shared.module';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CreateAccountFormComponent } from '../create-account-form/create-account-form.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    SharedModule,
    SigninFormComponent,
    CreateAccountFormComponent,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  responsiveService = inject(ResponsiveService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  formSubmitted = false;

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  isCreateAccountState = false;

  toggleForm(): void {
    this.isCreateAccountState = !this.isCreateAccountState;
  }

  ngOnInit(): void {
    this.subscription.add(
      this.authService.isAuthenticated().subscribe((isAuth) => {
        if (isAuth) {
          this.router.navigate(['/link-sharing-dashboard']);
        }
      })
    );
    this.subscription.add(
      this.route.url.subscribe((urlSegments) => {
        this.isCreateAccountState = urlSegments.some(
          (segment) => segment.path === 'create-account'
        );
      })
    );
    this.subscription.add(
      this.responsiveService.isCustomMax500.subscribe((isCustomMax500) => {
        const newBackgroundColor = isCustomMax500
          ? 'var(--white)'
          : 'var(--dark-white)';
        document.body.style.backgroundColor = newBackgroundColor;
      })
    );
  }
}
