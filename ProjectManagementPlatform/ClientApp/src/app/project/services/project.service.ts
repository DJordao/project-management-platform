import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProject } from '../../models/project';
import { ITask } from '../../models/task';
import { HttpService } from '../../shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends HttpService<IProject> {

  constructor(private http: HttpClient) {
    super(http);
  }

  getResourceUrl(): string {
    return 'projects';
  }

  //getProjects(): Observable<IProject[]> {
  //  return this.http.get<IProject[]>(this.projectUrl);
  //}

  //addProject(newProject: IProject): Observable<IProject> {
  //  return this.http.post<IProject>(this.projectUrl, newProject);
  //}

  //updateProject(updatedProject: IProject): Observable<IProject> {
  //  return this.http.put<IProject>(`${this.projectUrl}/${updatedProject.id}`, updatedProject);
  //}

  //removeProject(id: number): Observable<void> {
  //  return this.http.delete<void>(`${this.projectUrl}/${id}`);
  //}

  //getProjectById(id: number): Observable<IProject> {
  //  return this.http.get<IProject>(`${this.projectUrl}/${id}`);
  //}

  //getProjectTaskById(id: number, taskId: number): Observable<ITask> {
  //  return this.http.get<ITask>(`${this.projectUrl}/${id}/tasks/${taskId}`);
  //}

  //addTask(newTask: ITask): Observable<ITask> {
  //  return this.http.post<ITask>(`${this.projectUrl}/${newTask.projectId}/tasks`, newTask);
  //}

  //updateTask(updatedTask: ITask): Observable<ITask> {
  //  return this.http.put<ITask>(`${this.projectUrl}/${updatedTask.projectId}/tasks/${updatedTask.id}`, updatedTask);
  //}

  //removeTask(id: number, taskId: number): Observable<void> {
  //  return this.http.delete<void>(`${this.projectUrl}/${id}/tasks/${taskId}`);
  //}
}
