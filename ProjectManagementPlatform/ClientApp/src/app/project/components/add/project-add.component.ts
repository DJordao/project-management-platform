import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { ProjectService } from '../../services/project.service';
import { AlertService } from '../../../alert/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { faPlus, faBan } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-project-add',
  templateUrl: './project-add.component.html',
  styleUrls: ['./project-add.component.css']
})
export class ProjectAddComponent implements OnInit, OnDestroy {
  private sub!: Subscription;
  projectForm!: FormGroup;

  isInvalidName: boolean | undefined;
  errorNameRequired: boolean | undefined;
  errorNameMinLength: boolean | undefined;
  isInvalidBudget: boolean | undefined;
  errorBudgetRequired: boolean | undefined;
  errorBudgetMin: boolean | undefined;
  errorBudgetMax: boolean | undefined;

  faPlus = faPlus;
  faBan = faBan;

  constructor(private fb: FormBuilder, private projectService: ProjectService, private authService: AuthService,
    private router: Router, private alertService: AlertService, private translateService: TranslateService,
    private spinnerService: NgxSpinnerService) { }
    

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(128)]],
      budget: [ , [Validators.required, Validators.min(0), Validators.max(Number.MAX_SAFE_INTEGER)]],
      description: ["", Validators.maxLength(512)]
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe;
    }
  }

  resetValidation(): void {
    this.isInvalidName =
      this.errorNameRequired =
      this.errorNameMinLength =
      this.isInvalidBudget =
      this.errorBudgetRequired =
      this.errorBudgetMin =
      this.errorBudgetMax =
      undefined;
  }

  checkNameErrors(time?: number): void {
    setTimeout(() => {this.isInvalidName = (!this.projectForm.get('name')?.valid); 
    if (this.projectForm.get('name')?.errors?.required) {
      this.errorNameRequired = true;
    }
    else {
      this.errorNameRequired = false;
    }

    if (this.projectForm.get('name')?.errors?.minlength) {
      this.errorNameMinLength = true;
    }
    else {
      this.errorNameMinLength = false;
      }
    }, time);
  }

  checkBudgetErrors(time?: number): void {
    setTimeout(() => {this.isInvalidBudget = (!this.projectForm.get('budget')?.valid);
    if (this.projectForm.get('budget')?.errors?.required) {
      this.errorBudgetRequired = true;
    }
    else {
      this.errorBudgetRequired = false;
    }

    if (this.projectForm.get('budget')?.errors?.min) {
      this.errorBudgetMin = true;
    }
    else {
      this.errorBudgetMin = false;
    }

    if (this.projectForm.get('budget')?.errors?.max) {
      this.errorBudgetMax = true;
    }
    else {
      this.errorBudgetMax = false;
      }
    }, time);
  }

  addProject(): void {
    const newProject = { ...this.projectForm.value, "projectManagerUserName": this.authService.getUserName() };
    this.spinnerService.show();
    this.sub = this.projectService.add(newProject).subscribe({
      next: () => {
        this.spinnerService.hide();
        this.alertService.addMessage(this.translateService.instant("alert.message.project-add"));
        this.router.navigate(["/"]);
      },
      error: error => {
        this.spinnerService.hide();
        this.alertService.addError(error);
      }
    });
  }
}
