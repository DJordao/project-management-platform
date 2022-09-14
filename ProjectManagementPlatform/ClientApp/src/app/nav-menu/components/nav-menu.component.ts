import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { AlertService } from '../../alert/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit, OnDestroy{
  private sub!: Subscription;
  isExpanded = false;
  isAuthenticated: boolean = false;
  role: string = "";
  langs = [
    { code: 'en', label: 'English', flag: 'gb' },
    { code: 'pt', label: 'Português', flag: 'pt' },
  ];
  faSignOutAlt = faSignOutAlt;
  faUser = faUser;

  constructor(private authService: AuthService, private router: Router, private alertService: AlertService,
    private translateService: TranslateService, private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.checkAuthentication();
    this.sub = this.authService.sessionChange.subscribe(change => this.checkAuthentication());
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe;
    }
  }

  getCurrentLang(): any | undefined {
    if (this.translateService.currentLang == undefined) {
      return this.langs.find(l => l.code === this.translateService.getDefaultLang());
    }
    else {
      return this.langs.find(l => l.code === this.translateService.currentLang);
    }
  }

  switchLang(lang: string) {
    localStorage.setItem("language", lang);
    this.translateService.use(lang);
  }

  getUserName(): string {
    return this.authService.getUserName();
  }

  isProjectManager(): boolean | null {
    if (this.isAuthenticated) {
      return this.authService.getRole() == "Project Manager";
    }
    return null;
  }

  checkAuthentication(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.role = this.authService.getRole();
    }
  }

  logout(): void {
    this.spinnerService.show();
    this.sub = this.authService.logout().subscribe({
      next: () => {
        this.spinnerService.hide();
        this.authService.clearSession();
        this.authService.sessionChange.emit(false);
        this.alertService.addMessage(this.translateService.instant('alert.message.logout'));
        this.router.navigate(["/login"]);
      },
      error: error => {
        this.spinnerService.hide();
        this.alertService.addError(error);
      }
    });
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
