import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from '../../alert/services/alert.service';
import { AuthService } from '../../auth/services/auth.service';
import { IProject } from '../../models/project';
import { ITask } from '../../models/task';
import { ProjectService } from '../../project/services/project.service';
import { TaskService } from '../../project/task/services/task.service';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private sub!: Subscription;
  managedProjects: IProject[] = [];
  ongoingTasks: ITask[] = [];
  role: string = "";
  faEye = faEye;

  constructor(private authService: AuthService, private projectService: ProjectService, private alertService: AlertService,
    private taskService: TaskService, private translateService: TranslateService, private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.role = this.getRole();
    this.spinnerService.show();
    if (this.role === "Project Manager") {
      this.sub = this.projectService.getList().subscribe({
        next: projects => {
          this.spinnerService.hide();
          this.managedProjects = projects.filter(p => p.projectManagerUserName == this.getUserName());
        },
        error: error => {
          this.spinnerService.hide();
          this.alertService.addError(error);
        }
      });
    }
    else {
      this.getDeveloperTasks();
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe;
  }

  getRole(): string {
    return this.authService.getRole();
  }

  getUserName(): string {
    return this.authService.getUserName();
  }

  updateTaskState(task: ITask): void {
    this.spinnerService.show();
    this.taskService.update(task, this.authService.getUserName() , task.id, "tasks").subscribe({
      next: () => {
        this.spinnerService.hide();
        this.getDeveloperTasks();
        this.alertService.addMessage(this.translateService.instant('alert.message.task-state'));
      },
      error: error => {
        this.spinnerService.hide();
        this.alertService.addError(error);
      }
    });
  }

  getDeveloperTasks(): void {
    this.spinnerService.show();
    this.sub = this.taskService.getList(this.authService.getUserName(), "tasks").subscribe({
      next: tasks => {
        this.spinnerService.hide();
        this.ongoingTasks = tasks.filter(t => t.state == false);
      },
      error: error => {
        this.spinnerService.hide();
        this.alertService.addError(error);
      }
    });
  }
}
