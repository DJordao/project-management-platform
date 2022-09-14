import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/components/nav-menu.component';
import { HomeComponent } from './home/components/home.component';
import { ProjectComponent } from './project/components/project.component';
import { ProjectService } from './project/services/project.service';
import { ProjectDetailsComponent } from './project/components/details/project-details.component';
import { TaskComponent } from './project/task/components/task.component';
import { ProjectAddComponent } from './project/components/add/project-add.component';
import { LoginComponent } from './auth/components/login.component';
import { AuthService } from './auth/services/auth.service';
import { AuthGuard } from './auth/guards/auth.guard';
import { UserComponent } from './user/components/user.component';
import { RegisterComponent } from './user/components/register/register.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ProjectEditComponent } from './project/components/edit/project-edit.component';
import { TaskEditComponent } from './project/task/components/edit/task-edit.component';
import { TaskAddComponent } from './project/task/components/add/task-add.component';
import { UserEditComponent } from './user/components/edit/user-edit.component';
import { AlertComponent } from './alert/components/alert.component';
import { AlertService } from './alert/services/alert.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TaskService } from './project/task/services/task.service';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'projects', component: ProjectComponent, canActivate: [AuthGuard] },
  { path: 'projects/:id', component: ProjectDetailsComponent, canActivate: [AuthGuard] },
  { path: 'tasks', component: TaskComponent, canActivate: [AuthGuard] },
  { path: 'users/:username', component: UserComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/'}
];

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    ProjectComponent,
    ProjectDetailsComponent,
    TaskComponent,
    ProjectAddComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    ProjectEditComponent,
    TaskEditComponent,
    TaskAddComponent,
    UserEditComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BrowserAnimationsModule,
    NgxSpinnerModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    FontAwesomeModule,
    NgbModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })  
  ],
  providers: [
    ProjectService,
    TaskService,
    AuthService,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AlertService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
