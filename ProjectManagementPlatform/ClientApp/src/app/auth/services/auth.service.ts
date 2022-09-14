import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ILoginRequest, ILoginResult } from '../../models/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = "https://localhost:5288/api/auth";
  public sessionChange: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(private http: HttpClient) { }

  getUserName(): string {
    var username = localStorage.getItem("username");
    if (username) {
      return username;
    }
    else {
      return "";
    }
  }

  updateUserName(username: string): void {
    localStorage.setItem("username", username);
  }

  getRole(): string {
    var role = localStorage.getItem("role");

    if (role) {
      if (role == "ProjectManager") return "Project Manager";
      else return role;
    }
    else {
      return "";
    }
  }

  getRoleUrl(): string {
    var role = localStorage.getItem("role");
    
    if (role) {
      if (role == "ProjectManager") return "projectManagers";
      else return "developers";
    }
    else {
      return "";
    }
  }

  getExpiration(): Date {
    var expiration = localStorage.getItem("expiration");
    if (expiration) {
      return new Date(expiration);
    }
    else {
      return new Date();
    }
  }

  isAuthenticated(): boolean {
    if (localStorage.getItem("username") === "" || localStorage.getItem("username") === null ||
      localStorage.getItem("role") === "" || localStorage.getItem("role") === null) {
      return false;
    }

    let cookies = document.cookie.split(';');
    for (let c of cookies) {
      if (c.includes(".AspNetCore.Cookies")) {
        return true;
      }
    }
    return false;
  }

  login(creds: ILoginRequest): Observable<ILoginResult> {
    return this.http.post<ILoginResult>(`${this.authUrl}/login`, creds);
  }

  clearSession(): void {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.authUrl}/logout`, "");
  }
}
