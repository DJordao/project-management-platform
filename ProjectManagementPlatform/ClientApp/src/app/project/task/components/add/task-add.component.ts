import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IProject } from '../../../../models/project';
import { IUser } from '../../../../models/user';
import { ProjectService } from '../../../services/project.service';
import { futureDate } from '../../../../validators/date.validator';
import { AlertService } from '../../../../alert/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { faPlus, faBan } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeveloperService } from '../../../../user/services/developer/developer.service';

@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.component.html',
  styleUrls: ['./task-add.component.css']
})
export class TaskAddComponent implements OnInit, OnDestroy {
  private sub!: Subscription;
  taskForm!: FormGroup;
  @Input() project!: IProject;
  @Output() projectChange = new EventEmitter<IProject>();
  developers!: IUser[];

  isInvalidName: boolean | undefined;
  errorNameRequired: boolean | undefined;
  isInvalidDeveloper: boolean | undefined;
  errorDeveloperRequired: boolean | undefined;
  isInvalidDeadline: boolean | undefined;
  errorDeadlineRequired: boolean | undefined;
  errorDeadlineFutureDate: boolean | undefined;

  faPlus = faPlus;
  faBan = faBan;

  constructor(private fb: FormBuilder, private projectService: ProjectService,
    private developerService: DeveloperService, private alertService: AlertService,
    private translateService: TranslateService, private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.resetForm();
    this.getDevelopers();
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe;
    }
  }

  resetValidation(): void {
    this.isInvalidName =
    this.errorNameRequired =
    this.isInvalidDeveloper =
    this.errorDeveloperRequired =
    this.isInvalidDeadline =
    this.errorDeadlineRequired =
    this.errorDeadlineFutureDate =
      undefined;
  }

  checkNameErrors(time?: number): void {
    setTimeout(() => {this.isInvalidName = (!this.taskForm.get('name')?.valid);
    if (this.taskForm.get('name')?.errors?.required) {
      this.errorNameRequired = true;
    }
    else {
      this.errorNameRequired = false;
      }
    }, time);
  }

  checkDeveloperErrors(time?: number): void {
    setTimeout(() => {
    this.isInvalidDeveloper = (!this.taskForm.get('developerUserName')?.valid);
    if (this.taskForm.get('developerUserName')?.errors?.required) {
      this.errorDeveloperRequired = true;
    }
    else {
      this.errorDeveloperRequired = false;
      }
    }, time);
  }

  checkDeadlineErrors(time?: number): void {
    setTimeout(() => {
      this.isInvalidDeadline = (!this.taskForm.get('deadline')?.valid);
      if (this.taskForm.get('deadline')?.errors?.required) {
        this.errorDeadlineRequired = true;
      }
      else {
        this.errorDeadlineRequired = false;
      }

      if (this.taskForm.get('deadline')?.errors?.futureDate) {
        this.errorDeadlineFutureDate = true;
      }
      else {
        this.errorDeadlineFutureDate = false;
      } }, time);
  }

  resetForm(): void {
    this.taskForm = this.fb.group({
      name: ["", [Validators.required, Validators.maxLength(128)]],
      developerUserName: ["", Validators.required],
      deadline: ["", [Validators.required, futureDate]],
      description: ["", Validators.maxLength(512)]
    });
  }

  getProject(id: number): void {
    this.projectService.get(id).subscribe({
      next: project => {
        this.project = project;
      },
      error: error => {
        this.spinnerService.hide();
        this.alertService.addError(error);
      }
    });
  }

  getDevelopers(): void {
    this.developerService.getList().subscribe({
      next: developers => {
        this.spinnerService.hide();
        this.developers = developers;
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

  addTask(): void {
    const newTask = {
      ...this.taskForm.value, "projectId": this.project.id,
      "developerId": this.developers.find(d => d.userName == this.taskForm.get("developerUserName")?.value)?.id
    };
    this.spinnerService.show();
    this.sub = this.projectService.add(newTask, newTask.projectId, "tasks").subscribe({
      next: task => {
        this.spinnerService.hide();
        this.alertService.addMessage(this.translateService.instant("alert.message.task-add"));
        this.project.tasks.push(task);
        this.projectUpdated(this.project);
        this.resetForm();
      },
      error: error => {
        this.spinnerService.hide();
        this.alertService.addError(error);
      }
    });
  }
}
