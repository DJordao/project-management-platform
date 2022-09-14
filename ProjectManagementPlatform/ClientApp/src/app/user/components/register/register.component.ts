import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AlertService } from '../../../alert/services/alert.service';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeveloperService } from '../../services/developer/developer.service';
import { ProjectManagerService } from '../../services/project-manager/project-manager.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  private sub!: Subscription;
  registerForm!: FormGroup;

  isInvalidFullName: boolean | undefined;
  errorFullNameRequired: boolean | undefined;
  isInvalidUserName: boolean | undefined;
  errorUserNameRequired: boolean | undefined;
  errorUserNameMinLength: boolean | undefined;
  isInvalidEmail: boolean | undefined;
  errorEmailRequired: boolean | undefined;
  errorEmail: boolean | undefined;
  isInvalidPassword: boolean | undefined;
  errorPasswordRequired: boolean | undefined;
  errorPasswordMinLength: boolean | undefined;
  errorPasswordPattern: boolean | undefined;
  isInvalidRole: boolean | undefined;
  errorRoleRequired: boolean | undefined;

  faAddressCard = faAddressCard;

  constructor(private fb: FormBuilder, private projectManagerService: ProjectManagerService,
    private router: Router, private developerService: DeveloperService,
    private alertService: AlertService, private translateService: TranslateService,
    private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fullName: ["", [Validators.required, Validators.maxLength(64)]],
      username: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(32)]],
      email: ["", [Validators.required, Validators.email, Validators.maxLength(32)]],
      password: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(32),
      Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$")]],
      role: ["", Validators.required]
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe;
    }
  }

  resetValidation(): void {
    this.isInvalidFullName =
      this.errorFullNameRequired =
    this.isInvalidUserName =
    this.errorUserNameRequired =
    this.errorUserNameMinLength =
    this.isInvalidEmail =
    this.errorEmailRequired =
      this.errorEmail =
    this.isInvalidPassword =
    this.errorPasswordRequired =
    this.errorPasswordMinLength =
    this.errorPasswordPattern =
    this.isInvalidRole =
    this.errorRoleRequired =
      undefined;
  }

  checkFullNameErrors(time?: number): void {
    setTimeout(() => {
      this.isInvalidFullName = (!this.registerForm.get('fullName')?.valid);
      if (this.registerForm.get('fullName')?.errors?.required) {
        this.errorFullNameRequired = true;
      }
      else {
        this.errorFullNameRequired = false;
      }
    }, time);
  }

  checkUserNameErrors(time?: number): void {
    setTimeout(() => {
      this.isInvalidUserName = (!this.registerForm.get('username')?.valid);
      if (this.registerForm.get('username')?.errors?.required) {
        this.errorUserNameRequired = true;
      }
      else {
        this.errorUserNameRequired = false;
      }
      if (this.registerForm.get('username')?.errors?.minlength) {
        this.errorUserNameMinLength = true;
      }
      else {
        this.errorUserNameMinLength = false;
      }
    }, time);
  }

  checkEmailErrors(time?: number): void {
    setTimeout(() => {
      this.isInvalidEmail = (!this.registerForm.get('email')?.valid);
      if (this.registerForm.get('email')?.errors?.required) {
        this.errorEmailRequired = true;
      }
      else {
        this.errorEmailRequired = false;
      }
      if (this.registerForm.get('email')?.errors?.email) {
        this.errorEmail = true;
      }
      else {
        this.errorEmail = false;
      }
    }, time);
  }

  checkPasswordErrors(time?: number): void {
    setTimeout(() => {
      this.isInvalidPassword = (!this.registerForm.get('password')?.valid);
      if (this.registerForm.get('password')?.errors?.required) {
        this.errorPasswordRequired = true;
      }
      else {
        this.errorPasswordRequired = false;
      }
      if (this.registerForm.get('password')?.errors?.minlength) {
        this.errorPasswordMinLength = true;
      }
      else {
        this.errorPasswordMinLength = false;
      }
      if (this.registerForm.get('password')?.errors?.pattern) {
        this.errorPasswordPattern = true;
      }
      else {
        this.errorPasswordPattern = false;
      }
    }, time);
  }

  checkRoleErrors(time?: number): void {
    setTimeout(() => {
      this.isInvalidRole = (!this.registerForm.get('role')?.valid);
      if (this.registerForm.get('role')?.errors?.required) {
        this.errorRoleRequired = true;
      }
      else {
        this.errorRoleRequired = false;
      }
    }, time);
  }

  register(): void {
    this.spinnerService.show();
    let service;
    if (this.registerForm.get("role")?.value === "developers") {
      service = this.developerService;
    }
    else {
      service = this.projectManagerService;
    }
    this.sub = service.add(this.registerForm.value).subscribe({
      next: () => {
        this.spinnerService.hide();
        this.alertService.addMessage(this.translateService.instant("alert.message.register"));
        this.router.navigate(["/"])
      },
      error: error => {
        this.spinnerService.hide();
        this.alertService.addError(error);
      }
    });
  }
}
