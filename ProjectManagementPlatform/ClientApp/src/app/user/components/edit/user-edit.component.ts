import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { AlertService } from '../../../alert/services/alert.service';
import { IUser } from '../../../models/user';
import { TranslateService } from '@ngx-translate/core';
import { faSave, faBan } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProjectManagerService } from '../../services/project-manager/project-manager.service';
import { DeveloperService } from '../../services/developer/developer.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit, OnDestroy, OnChanges {
  private sub!: Subscription;
  private userService: ProjectManagerService | DeveloperService;
  userForm!: FormGroup;
  @Input() user!: IUser;
  @Output() userChange = new EventEmitter<IUser>();

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

  faSave = faSave;
  faBan = faBan;

  constructor(private fb: FormBuilder, private projectManagerService: ProjectManagerService,
    private authService: AuthService, private developerService: DeveloperService,
    private alertService: AlertService, private translateService: TranslateService, private spinnerService: NgxSpinnerService)
  {
    if (this.authService.getRoleUrl() === "developers") {
      this.userService = this.developerService;
    }
    else {
      this.userService = this.projectManagerService;
    }
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      fullName: ["", [Validators.required, Validators.maxLength(64)]],
      username: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(32)]],
      email: ["", [Validators.required, Validators.email, Validators.maxLength(32)]],
      password: ["", [Validators.minLength(8), Validators.maxLength(32),
        Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$")]],
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe;
    }
  }

  ngOnChanges(): void {
    if (this.user) {
      this.user.role = this.authService.getRole();
      this.populateForm();
    }
  }

  reset(): void {
    this.populateForm();
    this.resetValidation();
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
      this.errorPasswordMinLength =
      this.errorPasswordPattern =
      undefined;
  }

  checkFullNameErrors(): void {
      this.isInvalidFullName = (!this.userForm.get('fullName')?.valid);
      if (this.userForm.get('fullName')?.errors?.required) {
        this.errorFullNameRequired = true;
      }
      else {
        this.errorFullNameRequired = false;
      }
  }

  checkUserNameErrors(): void {
      this.isInvalidUserName = (!this.userForm.get('username')?.valid);
      if (this.userForm.get('username')?.errors?.required) {
        this.errorUserNameRequired = true;
      }
      else {
        this.errorUserNameRequired = false;
      }
      if (this.userForm.get('username')?.errors?.minlength) {
        this.errorUserNameMinLength = true;
      }
      else {
        this.errorUserNameMinLength = false;
      }
  }

  checkEmailErrors(): void {
      this.isInvalidEmail = (!this.userForm.get('email')?.valid);
      if (this.userForm.get('email')?.errors?.required) {
        this.errorEmailRequired = true;
      }
      else {
        this.errorEmailRequired = false;
      }
      if (this.userForm.get('email')?.errors?.email) {
        this.errorEmail = true;
      }
      else {
        this.errorEmail = false;
      }
  }

  checkPasswordErrors(): void {
      this.isInvalidPassword = (!this.userForm.get('password')?.valid);
      if (this.userForm.get('password')?.errors?.minlength) {
        this.errorPasswordMinLength = true;
      }
      else {
        this.errorPasswordMinLength = false;
      }
      if (this.userForm.get('password')?.errors?.pattern) {
        this.errorPasswordPattern = true;
      }
      else {
        this.errorPasswordPattern = false;
      }
  }

  userUpdated(updatedUser: IUser) {
    this.userChange.emit(updatedUser);
  }

  populateForm(): void {
    this.userForm.patchValue({
      fullName: this.user.fullName,
      username: this.user.userName,
      email: this.user.email,
      password: ""
    });
  }

  updateUser(): void {
    const updatedUser = { ...this.userForm.value, "id": this.user.id, "role": this.authService.getRoleUrl() };
    this.spinnerService.hide();
    this.sub = this.userService.update(updatedUser, updatedUser.id).subscribe({
      next: user => {
        this.spinnerService.hide();
        this.userUpdated(user);
        if (user.userName != this.user.userName) {
          this.authService.updateUserName(user.userName);
        }
        this.alertService.addMessage(this.translateService.instant("alert.message.user-edit"))
        //this.location.back()
      },
      error: error => {
        this.populateForm();
        this.spinnerService.hide();
        this.alertService.addError(error);
      }
    });
  }
}
