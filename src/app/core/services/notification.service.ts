import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface INotification {
  type: 'success' | 'danger' | 'notFound';
  message: string;
  actionMessage?: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private alertSubject: BehaviorSubject<INotification | null> =
    new BehaviorSubject<INotification | null>(null);

  getAlert(): Observable<INotification | null> {
    return this.alertSubject.asObservable();
  }

  showSuccess(message: string) {
    this.alertSubject.next({ type: 'success', message });
  }

  showError(message: string) {
    this.alertSubject.next({ type: 'danger', message });
  }

  showNotFound(message: string, actionMessage?: string){
    this.alertSubject.next({ type: 'notFound', message, actionMessage });
  }

  clear() {
    this.alertSubject.next(null);
  }
}
