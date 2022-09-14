import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../../models/user';
import { HttpService } from '../../shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends HttpService<IUser> {
  private baseUrl = "https://localhost:5288/api";
  errorMessage: string = "";

  constructor(private http: HttpClient) {
    super(http);
  }

  getResourceUrl(): string {
    return '';
  }

  register(user: IUser): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${user.role}`, user);
  }

  getUsers(role: string): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.baseUrl}/${role}`);
  }

  getUserByUserName(role: string, username: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.baseUrl}/${role}/${username}`);
  }

  updateUser(updatedUser: IUser): Observable<IUser> {
    return this.http.put<IUser>(`${this.baseUrl}/${updatedUser.role}/${updatedUser.id}`, updatedUser);
  }

  deleteUser(user: IUser): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${user.role}/${user.id}`);
  }
}
