import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { ITask } from '../../../models/task';
import { HttpService } from '../../../shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService extends HttpService<ITask>{
  private baseUrl = "https://localhost:5288/api/developers";

  constructor(private http: HttpClient, private authService: AuthService) {
    super(http);
  }

  getResourceUrl(): string {
    return "developers";
  }

  //getDeveloperTasks(): Observable<ITask[]> {
  //  return this.http.get<ITask[]>(`${this.baseUrl}/${this.authService.getUserName()}/tasks`);
  //}

  //updateState(task: ITask): Observable<void> {
  //  return this.http.put<void>(`${this.baseUrl}/${this.authService.getUserName()}/tasks/${task.id}`, "");
  //}
}
