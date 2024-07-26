import { inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpRequest,
  HttpErrorResponse,
  HttpHandlerFn,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';


export function ErrorInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const notificationService = inject(NotificationService);
  return next(req).pipe(
    catchError((httpError: HttpErrorResponse) => {
      let errorMessage = httpError.error.error;
        if(httpError.status !== 404){
            notificationService.showError(errorMessage);
        }
      return throwError(() => errorMessage);
    })
  );
}