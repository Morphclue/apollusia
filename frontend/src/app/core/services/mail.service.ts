import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  constructor() {
  }

  getMail(): string {
    return localStorage.getItem('mail') || '';
  }

  setMail(mail: string) {
    localStorage.setItem('mail', mail);
  }
}
