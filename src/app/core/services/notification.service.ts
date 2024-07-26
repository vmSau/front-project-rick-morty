import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface INotification {
  type: 'success' | 'danger' | 'notFound';
  message: string;
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

  showNotFound(message: string){
    this.alertSubject.next({ type: 'notFound', message });
  }

  clear() {
    this.alertSubject.next(null);
  }
}
