import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  messages: string[] = [];
  errors: string[] = [];

  constructor() { }

  addMessage(message: string) {
    this.clear();
    this.messages.push(message);
  }

  addError(error: string) {
    this.clear();
    this.errors.push(error);
  }

  removeMessage(message: string) {
    var index = this.messages.indexOf(message);
    if (index !== -1) {
      this.messages.splice(index, 1);
    }
  }

  removeError(error: string) {
    var index = this.errors.indexOf(error);
    if (index !== -1) {
      this.errors.splice(index, 1);
    }
  }

  clear(): void {
    this.messages = [];
    this.errors = [];
  }
}
