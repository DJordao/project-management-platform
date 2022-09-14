import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AlertService } from '../../alert/services/alert.service';
import { AuthService } from '../services/auth.service';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  private sub!: Subscription;
  loginForm!: UntypedFormGroup;
  faSignInAlt = faSignInAlt;

  constructor(private fb: UntypedFormBuilder, private authService: AuthService, private router: Router,
    private alertService: AlertService, private translateService: TranslateService,
    private spinnerService: NgxSpinnerService) { }
    
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(32)]],
      password: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(32)]],
      rememberMe: false
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe;
    }
  }

  login(): void {
    this.spinnerService.show();
    this.sub = this.authService.login(this.loginForm.value).subscribe({
      next: result => {
        this.spinnerService.hide();
        if (result) {
          localStorage.setItem("username", result.username);
          localStorage.setItem("role", result.role);
        }
        this.authService.sessionChange.emit(true);
        this.alertService.addMessage(this.translateService.instant('alert.message.login'));
        this.router.navigate(["/"]);
        
      },
      error: error => {
        this.spinnerService.hide();
        this.alertService.addError(error);
      }
    });
  }
}
