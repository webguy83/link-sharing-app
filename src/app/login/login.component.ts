import { SigninFormComponent } from './../signin-form/signin-form.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ResponsiveService } from '../services/responsive.service';
import { Subscription } from 'rxjs';
import { SharedModule } from '../shared/shared.module';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CreateAccountFormComponent } from '../create-account-form/create-account-form.component';

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

  formSubmitted = false;

  constructor(
    public responsiveService: ResponsiveService,
    private route: ActivatedRoute
  ) {}

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

  onSubmit(form: FormGroup) {
    this.formSubmitted = true;

    console.log(form);
  }
}
