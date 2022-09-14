import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class HttpService<T> {
  private readonly APIUrl = "https://localhost:5288/api/" + this.getResourceUrl();

  constructor(protected httpClient: HttpClient) {
  }

  abstract getResourceUrl(): string;

  getList(relatedId?: string | number, subPath?: string): Observable<T[]> {
    if (relatedId && subPath) {
      return this.httpClient.get<T[]>(`${this.APIUrl}/${relatedId}/${subPath}`);
    }
    else {
      return this.httpClient.get<T[]>(`${this.APIUrl}`);
    }
  }

  get(id: string | number): Observable<T> {
    return this.httpClient.get<T>(`${this.APIUrl}/${id}`);
  }

  add(resource: T, relatedId?: string | number, subPath?: string): Observable<any> {
    if (relatedId && subPath) {
      return this.httpClient.post(`${this.APIUrl}/${relatedId}/${subPath}`, resource);
    }
    else if (subPath) {
      return this.httpClient.post(`${this.APIUrl}${subPath}`, resource);
    }
    else {
      return this.httpClient.post(`${this.APIUrl}`, resource);
    }
  }

  delete(id: string | number, relatedId?: string | number, subPath?: string): Observable<any> {
    if (relatedId && subPath) {
      return this.httpClient.delete(`${this.APIUrl}/${id}/${subPath}/${relatedId}`);
    }
    else {
      return this.httpClient.delete(`${this.APIUrl}/${id}`);
    }
  }

  update(resource: T, id: string | number, relatedId?: string | number, subPath?: string): Observable<any> {
    if (relatedId && subPath) {
      return this.httpClient.put(`${this.APIUrl}/${id}/${subPath}/${relatedId}`, resource);
    }
    else {
      return this.httpClient.put(`${this.APIUrl}/${id}`, resource);
    }
  }
}
