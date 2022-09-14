import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AlertService } from '../../../alert/services/alert.service';
import { ITask } from '../../../models/task';
import { TaskService } from '../services/task.service';
import { faSearch, faEraser } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  private sub!: Subscription;
  tasks: ITask[] = [];
  filteredTasks: ITask[] = [];
  selectedFilter: boolean | null = null;
  filter: string | null = null;
  searchForm!: FormGroup;
  faSearch = faSearch;
  faEraser = faEraser;

  constructor(private taskService: TaskService, private alertService: AlertService, private authService: AuthService,
    private translateService: TranslateService, private spinnerService: NgxSpinnerService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.spinnerService.show();
    this.getDeveloperTasks();
    this.searchForm = this.fb.group({
      filter: [""]
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe;
  }

  clear(): void {
    this.filter = null;
    this.filteredTasks = this.tasks;
    this.filterTasks(this.selectedFilter);
  }

  search(): void {
    this.filter = this.searchForm.get("filter")?.value;
    this.filteredTasks = this.filteredTasks.filter(t => {
      return t.name.toLowerCase().includes(this.filter!.toLowerCase()) ||
        t.description.toLowerCase().includes(this.filter!.toLowerCase())
    })
  }

  filterTasks(state: boolean | null): void {
    this.filteredTasks = this.tasks;
    this.selectedFilter = state;
    if (state != null) {
      this.filteredTasks = this.filteredTasks.filter(t => t.state == state);
    }
  }

  getDeveloperTasks(): void {
    this.sub = this.taskService.getList(this.authService.getUserName(), "tasks").subscribe({
      next: tasks => {
        this.spinnerService.hide();
        this.tasks = tasks;
        this.filterTasks(this.selectedFilter);
      },
      error: error => {
        this.spinnerService.hide();
        this.alertService.addError(error);
      }
    });
  }

  updateTaskState(task: ITask): void {
    this.spinnerService.show();
    this.taskService.update(task, this.authService.getUserName(), task.id, "tasks").subscribe({
      next: () => {
        this.getDeveloperTasks();
        this.alertService.addMessage(this.translateService.instant('alert.message.task-state'));
      },
      error: error => {
        this.spinnerService.hide();
        this.alertService.addError(error);
      }
    });
  }
}
