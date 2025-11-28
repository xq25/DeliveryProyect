import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationSubject = new Subject<Notification>();
  notifications$ = this.notificationSubject.asObservable();

  // Método para emitir una notificación
  push(type: Notification['type'], message: string) {
    const notif: Notification = {
      type,
      message,
      timestamp: new Date()
    };
    this.notificationSubject.next(notif);
  }
}
