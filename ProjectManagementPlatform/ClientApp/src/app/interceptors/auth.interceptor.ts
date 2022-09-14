import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private authService: AuthService, private translateService: TranslateService) { }

  private handleError(error: HttpErrorResponse): Observable<any> {
    console.log(error)
    let translation;

    if (error.status == 401) {
      this.authService.clearSession();
      translation = this.translateService.instant("alert.error.expired-session");
      this.router.navigate(["login"]);
    }
    else if (error.status == 403) {
      translation = this.translateService.instant("alert.error.forbidden");
      this.router.navigate(["/"]);
    }
    else if (error.status == 500) {
      translation = this.translateService.instant(`alert.error.${error.error.detail}`);
    }
    else {
      translation = this.translateService.instant(`alert.error.${error.error}`);
    }

    if (error.status == 404) {
      this.router.navigate(["/"]);
    }

    return throwError(translation);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      withCredentials: true,
      setHeaders: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json'
      },
    });

    return next.handle(request).pipe(catchError(x => this.handleError(x)));
  }
}
