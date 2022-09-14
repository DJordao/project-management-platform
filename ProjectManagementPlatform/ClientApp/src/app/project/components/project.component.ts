import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from '../../alert/services/alert.service';
import { IProject } from '../../models/project';
import { ProjectService } from '../services/project.service';
import { faPlus, faEye } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit, OnDestroy{
  private sub!: Subscription;
  projects: IProject[] = [];
  faPlus = faPlus;
  faEye = faEye;

  constructor(private projectService: ProjectService, private alertService: AlertService,
    private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinnerService.show();
    this.sub = this.projectService.getList().subscribe({
      next: projects => {
        this.spinnerService.hide();
        this.projects = projects;
      },
      error: error => {
        this.spinnerService.hide();
        this.alertService.addError(error);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe;
  }


}
