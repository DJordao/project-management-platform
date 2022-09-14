import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '../../../models/user';
import { HttpService } from '../../../shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectManagerService extends HttpService<IUser> {

  constructor(private http: HttpClient) {
    super(http);
  }

  getResourceUrl(): string {
    return 'projectManagers';
  }
}
