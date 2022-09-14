import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from '../../alert/services/alert.service';
import { AuthService } from '../../auth/services/auth.service';
import { IUser } from '../../models/user';
import { faEdit, faArrowLeft, faUserAltSlash } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProjectManagerService } from '../services/project-manager/project-manager.service';
import { DeveloperService } from '../services/developer/developer.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  private sub!: Subscription;
  private userService: ProjectManagerService | DeveloperService;
  user!: IUser;
  faEdit = faEdit;
  faArrowLeft = faArrowLeft;
  faUserAltSlash = faUserAltSlash;

  constructor(private route: ActivatedRoute, private projectManagerService: ProjectManagerService,
    private authService: AuthService, private developerService: DeveloperService,
    private alertService: AlertService, private translateService: TranslateService, private router: Router,
    private spinnerService: NgxSpinnerService) {
    
    if (this.authService.getRoleUrl() === "developers") {
      this.userService = this.developerService;
    }
    else {
      this.userService = this.projectManagerService;
    }
  }

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.getUser(username);
    }
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe;
    }
  }

  confirmDelete(): void {
    if (this.authService.getRole() == "Project Manager") {
      if (confirm(this.translateService.instant("alert.confirm.project-manager-delete"))) {
        this.deleteUser();
      }
    }
    else {
      if (confirm(this.translateService.instant("alert.confirm.developer-delete"))) {
        this.deleteUser();
      }
    }
  }

  getUser(username: string): void {
    this.spinnerService.show();
    this.userService.get(username).subscribe({
      next: user => {
        this.spinnerService.hide();
        this.user = user;
        this.user.role = this.authService.getRole();
      },
      error: error => {
        this.spinnerService.hide();
        this.alertService.addError(error);
      }
    });
  }

  deleteUser(): void {
    this.user!.role = this.authService.getRoleUrl();
    this.spinnerService.show();
    this.userService.delete(this.user.id).subscribe({
      next: () => {
        this.alertService.addMessage(this.translateService.instant("alert.message.user-delete"));
        this.logout();
        this.router.navigate(["/login"]);
      },
      error: error => {
        this.spinnerService.hide();
        this.alertService.addError(error);
      }
    });
  }

  private logout(): void {
    this.sub = this.authService.logout().subscribe({
      next: () => {
        this.spinnerService.hide();
        this.authService.clearSession();
        this.alertService.addMessage(this.translateService.instant('alert.message.logout'));
        this.router.navigate(["/login"]);
      },
      error: error => {
        this.spinnerService.hide();
        this.alertService.addError(error);
      }
    });
  }
}
