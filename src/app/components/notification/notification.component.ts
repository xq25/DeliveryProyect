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
  audio = new Audio()

  constructor(private notifService: NotificationService) {}

  ngOnInit(): void {
    this.audio.src = 'assets/sounds/iphone-notificacion.mp3';
    this.audio.load();
    this.notifService.notifications$.subscribe(n => {
      this.notifications.unshift(n); // Agregar al inicio
      this.isOpen = true;            // Abrir ventana si está cerrada

      // Reproducir sonido
      this.audio.play().catch(err => console.log('Error al reproducir audio:', err));
    });
  }

  togglePanel() {
    this.isOpen = !this.isOpen;
  }

  clearNotifications() {
    this.notifications = [];
  }
}
