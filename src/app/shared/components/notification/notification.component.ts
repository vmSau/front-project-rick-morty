import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { INotification } from './../../../core/services/notification.service';
import { NotificationService } from './../../../core/services/notification.service';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { SubSink } from 'subsink';

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
      <span class="empty--title m-md">{{ this.notification.message }}</span>
      <span class="empty--subtitle m-md">{{ this.notification.actionMessage }}</span>
      @if(button && button.showButton){
      <button class="btn btn-notification m-md" (click)="emitClick()">{{ button.buttonText }}</button>
      }
    </div>
    }`,
})
export class NotificationComponent implements OnInit {
  @Input() button!: {
    showButton: boolean;
    buttonText?: string;
  };

  @Output() btnClick = new EventEmitter();
  notification: INotification | null = null;
  canCloseNotification: boolean = true;
  private _subs = new SubSink();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this._subs.add(
      this.notificationService.getAlert().subscribe((alert) => {
        this.notification = alert;
        this.notification && this.notification.type === 'notFound'
          ? (this.canCloseNotification = false)
          : (this.canCloseNotification = true);
      })
    );
  }
  emitClick() {
    this.btnClick.emit();
  }
  close() {
    this.notification = null;
  }
  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }
}
