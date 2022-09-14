import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IProject } from '../../../models/project';
import { IUser } from '../../../models/user';
import { ProjectService } from '../../services/project.service';
import { AlertService } from '../../../alert/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { faSave, faBan } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProjectManagerService } from '../../../user/services/project-manager/project-manager.service';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css']
})
export class ProjectEditComponent implements OnInit, OnChanges, OnDestroy {
  private sub!: Subscription;
  projectForm!: FormGroup;
  @Input() project!: IProject;
  @Output() projectChange = new EventEmitter<IProject>();
  projectManagers!: IUser[];

  isInvalidName: boolean | undefined;
  errorNameRequired: boolean | undefined;
  errorNameMinLength: boolean | undefined;
  isInvalidBudget: boolean | undefined;
  errorBudgetRequired: boolean | undefined;
  errorBudgetMin: boolean | undefined;
  errorBudgetMax: boolean | undefined;

  faSave = faSave;
  faBan = faBan;

  constructor(private fb: FormBuilder, private projectService: ProjectService,
    private projectManagerService: ProjectManagerService, private alertService: AlertService,
    private translateService: TranslateService, private spinnerService: NgxSpinnerService) { }


  ngOnInit(): void {
    this.projectForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(128)]],
      projectManagerUserName: "",
      budget: ["", [Validators.required, Validators.min(0), Validators.max(Number.MAX_SAFE_INTEGER)]],
      description: ["", Validators.maxLength(512)]
    });
  }

  ngOnChanges(): void {
    if (this.project) {
      this.populateForm();
      this.getProjectManagers();
    }
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe;
    }
  }

  reset(): void {
    this.populateForm();
    this.resetValidation();
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

  checkNameErrors(): void {
    this.isInvalidName = (!this.projectForm.get('name')?.valid);
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
  }

  checkBudgetErrors(): void {
    this.isInvalidBudget = (!this.projectForm.get('budget')?.valid);
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
  }

  formUnchanged(): boolean {
    if (this.projectForm.get("name")?.value == this.project.name &&
      this.projectForm.get("projectManagerUserName")?.value == this.project.projectManagerUserName &&
      this.projectForm.get("budget")?.value == this.project.budget &&
      this.projectForm.get("description")?.value == this.project.description) {

      return true;
    }
    else {
      return false;
    }
  }

  getProject(id: number): void {
    this.spinnerService.show();
    this.projectService.get(id).subscribe({
      next: project => {
        this.project = project;
        this.populateForm();
        this.getProjectManagers();
        this.spinnerService.hide();
      },
      error: error => {
        this.spinnerService.hide();
        this.alertService.addError(error);
      }
    });
  }

  populateForm(): void {
    this.projectForm.patchValue({
      name: this.project.name,
      projectManagerUserName: this.project.projectManagerUserName,
      budget: this.project.budget,
      description: this.project.description
    });
  }

  getProjectManagers() {
    this.spinnerService.show();
    this.projectManagerService.getList().subscribe({
      next: projectManagers => {
        this.spinnerService.hide();
        this.projectManagers = projectManagers
          },
      error: error => {
        this.spinnerService.hide();
        this.alertService.addError(error);
      }
    });
  }

  projectUpdated(updatedProject: IProject) {
    this.projectChange.emit(updatedProject);
  }

  updateProject(): void {
    const updatedProject = { ...this.projectForm.value, "id": this.project.id, "tasks": this.project.tasks };
    this.spinnerService.show();
    this.sub = this.projectService.update(updatedProject, updatedProject.id).subscribe({
      next: () => {
        this.spinnerService.hide();
        this.projectUpdated(updatedProject);
        this.alertService.addMessage(this.translateService.instant("alert.message.project-edit"));
        },
      error: error => {
        this.populateForm();
        this.spinnerService.hide();
        this.alertService.addError(error);
      }
    });
  }
}
