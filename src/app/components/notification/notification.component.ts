import { Component, OnInit } from '@angular/core';
import { NotificationService, Notification } from '../../services/notifications.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  notifications: Notification[] = [];
  isOpen = false;

  constructor(private notifService: NotificationService) {}

  ngOnInit(): void {
    this.notifService.notifications$.subscribe(n => {
      this.notifications.unshift(n); // Agregar al inicio
      this.isOpen = true;            // Abrir ventana si está cerrada
    });
  }

  togglePanel() {
    this.isOpen = !this.isOpen;
  }

  clearNotifications() {
    this.notifications = [];
  }
}
