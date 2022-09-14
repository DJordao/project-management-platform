import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ITask } from '../../../../models/task';
import { IUser } from '../../../../models/user';
import { editFutureDate } from '../../../../validators/date.validator';
import { ProjectService } from '../../../services/project.service';
import { formatDate } from '@angular/common';
import { AlertService } from '../../../../alert/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { faSave, faBan } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { IProject } from '../../../../models/project';
import { DeveloperService } from '../../../../user/services/developer/developer.service';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit, OnChanges, OnDestroy {
  private sub!: Subscription;
  taskForm!: UntypedFormGroup;
  @Input() task!: ITask;
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

  faSave = faSave;
  faBan = faBan;

  constructor(private fb: UntypedFormBuilder, private projectService: ProjectService,
    private developerService: DeveloperService, private alertService: AlertService,
    private translateService: TranslateService, private spinnerService: NgxSpinnerService)
  { }


  ngOnInit(): void {
    this.taskForm = this.fb.group({
      name: ["", [Validators.required, Validators.maxLength(128)]],
      developerUserName: ["", Validators.required],
      deadline: ["", Validators.required],
      description: ["", Validators.maxLength(512)]
    });
  }

  ngOnChanges(): void {
    if (this.task) {
      this.populateForm();
      this.getDevelopers();
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
      this.isInvalidDeveloper =
      this.errorDeveloperRequired =
      this.isInvalidDeadline =
      this.errorDeadlineRequired =
      this.errorDeadlineFutureDate =
      undefined;
  }

  checkNameErrors(): void {
      this.isInvalidName = (!this.taskForm.get('name')?.valid);
      if (this.taskForm.get('name')?.errors?.required) {
        this.errorNameRequired = true;
      }
      else {
        this.errorNameRequired = false;
      }
  }

  checkDeveloperErrors(): void {
      this.isInvalidDeveloper = (!this.taskForm.get('developerUserName')?.valid);
      if (this.taskForm.get('developerUserName')?.errors?.required) {
        this.errorDeveloperRequired = true;
      }
      else {
        this.errorDeveloperRequired = false;
      }
  }

  checkDeadlineErrors(): void {
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
      }
  }

  formUnchanged(): boolean {
    if (this.taskForm.get("name")?.value == this.task.name &&
      this.taskForm.get("developerUserName")?.value == this.task.developerUserName &&
      this.taskForm.get("deadline")?.value == this.task.deadline.toString().split('T')[0] &&
      this.taskForm.get("description")?.value == this.task.description) {
      
      return true;
    }
    else {
      return false;
    }
  }

  populateForm(): void {
    this.taskForm.patchValue({
      name: this.task.name,
      developerUserName: this.task.developerUserName,
      deadline: formatDate(this.task.deadline, "yyyy-MM-dd", "en-US"),
      description: this.task.description
    });

    this.taskForm.get("deadline")?.setValidators(editFutureDate(this.taskForm.get("deadline")?.value));
  }

  getDevelopers() {
    this.spinnerService.show();
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

  updateTask(): void {
    const updatedTask = {
      ...this.taskForm.value, "id": this.task.id, "projectId": this.task.projectId,
      "developerId": this.developers.find(d => d.userName == this.taskForm.get("developerUserName")?.value)?.id
    };

    this.spinnerService.show();
    this.sub = this.projectService.update(updatedTask, updatedTask.projectId, updatedTask.id, "tasks").subscribe({
      next: task => {
        this.spinnerService.hide();
        this.alertService.addMessage(this.translateService.instant("alert.message.task-edit"));
        this.project.tasks.filter(t => t.id == task.id).map(t => {
          t.name = task.name;
          t.description = task.description;
          t.deadline = task.deadline;
          t.developerId = task.developerId;
          t.developerUserName = task.developerUserName;
        });
        this.projectUpdated(this.project);
      },
      error: error => {
        this.populateForm();
        this.spinnerService.hide();
        this.alertService.addError(error);
      }
    });
  }
}
