import { Component, OnInit } from '@angular/core';
import { INotification } from './../../../core/services/notification.service';
import { NotificationService } from './../../../core/services/notification.service';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [NgbAlertModule],
  template: ` @if(notification && canCloseNotification){
    <ngb-alert [type]="notification.type" (closed)="close()">{{
      notification.message
    }}</ngb-alert>
    } @else if(notification && !canCloseNotification) {
    <div class="empty">
      <span class="empty--title">Nada foi encontrado</span>
      <span class="empty--subtitle">Tente realizar uma nova busca.</span>
    </div>
    }`,
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit {

  notification: INotification | null = null;
  canCloseNotification: boolean = true;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.getAlert().subscribe((alert) => {
      this.notification = alert;
      this.notification && this.notification.type === 'notFound'
        ? (this.canCloseNotification = false)
        : (this.canCloseNotification = true);
    });
  }

  close() {
    this.notification = null;
  }
}
