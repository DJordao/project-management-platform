import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProject } from '../../../models/project';
import { ProjectService } from '../../services/project.service';
import { Location } from '@angular/common';
import { AlertService } from '../../../alert/services/alert.service';
import { faPenSquare, faTrash, faPlus, faEdit, faArrowLeft, faSort, faSortUp, faSortDown, faSearch, faEraser }
  from '@fortawesome/free-solid-svg-icons';
import { ITask } from '../../../models/task';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ISortType } from '../../sort-type';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {
  private sub!: Subscription;
  project!: IProject;
  task!: ITask;

  page: number = 1;
  pageSize: number = 5;

  tasks!: ITask[];
  sortType: ISortType = {
    "name": undefined,
    "developerUserName": undefined,
    "state": undefined,
    "deadline": undefined,
    "description": undefined
  };

  searchForm!: FormGroup;

  faPenSquare = faPenSquare;
  faTrash = faTrash;
  faPlus = faPlus;
  faEdit = faEdit;
  faArrowLeft = faArrowLeft;
  faSort = faSort;
  faSortUp = faSortUp;
  faSortDown = faSortDown;
  faSearch = faSearch;
  faEraser = faEraser;

  constructor(private route: ActivatedRoute, private projectService: ProjectService, private location: Location,
    private alertService: AlertService, private translateService: TranslateService, private spinnerService: NgxSpinnerService,
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.getProject(id);
    }
    this.searchForm = this.fb.group({
      filter: [""]
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe;
    }
  }

  search(): void {
    this.tasks = this.project.tasks;
    this.sortType = {
      "name": undefined,
      "developerUserName": undefined,
      "state": undefined,
      "deadline": undefined,
      "description": undefined
    };

    var filter: string = this.searchForm.get("filter")?.value;
    this.tasks = this.tasks.filter(t => {
      return t.name.toLowerCase().includes(filter.toLowerCase()) ||
        t.description.toLowerCase().includes(filter.toLowerCase()) ||
      t.developerUserName.toLowerCase().includes(filter.toLowerCase())
    })
  }

  sort(col: string) {
    let sortType = this.sortType[col];

    if (sortType == false) {
      this.tasks = this.project.tasks;
      this.sortType[col] = undefined;
      return;
    }

    this.tasks = this.tasks.sort((t1, t2) => {
      if (sortType == undefined) {
        console.log(t1[col])
        console.log(t2[col])
        console.log(t1[col] < t2[col])
        return (t1[col] < t2[col] ? -1 : 1);
      }
      else if (sortType) {
        return (t1[col] > t2[col] ? -1 : 1);
      }
      else {
        return 0;
      }
    });

    if (sortType == undefined) {
      this.sortType[col] = true;
    }
    else {
      this.sortType[col] = false;
    }
  }

  copyTasks(): ITask[] {
    return this.project.tasks.map(x => Object.assign({}, x));
  }

  selectTask(task: ITask): void {
    this.task = task;
  }

  getProject(id: number): void {
    this.spinnerService.show();
    this.sub = this.projectService.get(id).subscribe({
      next: project => {
        this.spinnerService.hide();
        this.project = project;
        this.tasks = this.project.tasks;
      },
      error: error => {
        this.spinnerService.hide();
        this.alertService.addError(error);
      }
    });
  }

  confirmDelete(id: number, task: ITask | null): void {
    if (task == null) {
      if (confirm(this.translateService.instant("alert.confirm.project-delete"))) {
        this.deleteProject(id);
      }
    }
    else {
      if (confirm(`${this.translateService.instant("alert.confirm.task-delete") }${task.name}?`)) {
        this.deleteTask(id, task.id);
      }
    }
  }

  deleteProject(id: number): void {
    this.spinnerService.show();
    this.sub = this.projectService.delete(id).subscribe({
      next: () => {
        this.spinnerService.hide();
        this.alertService.addMessage(this.translateService.instant("alert.message.project-delete"))
        this.location.back()
      },
      error: error => {
        this.spinnerService.hide();
        this.alertService.addError(error);
      }
    });
  }

  deleteTask(id: number, taskId: number): void {
    this.spinnerService.show();
    this.sub = this.projectService.delete(id, taskId, "tasks").subscribe({
      next: () => {
        this.spinnerService.hide();
        this.alertService.addMessage(this.translateService.instant("alert.message.task-delete"));
        this.getProject(id);
      },
      error: error => {
        this.spinnerService.hide();
        this.alertService.addError(error);
      }
    });
  }
}
