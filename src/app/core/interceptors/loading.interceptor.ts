import { inject, Injectable, signal } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpHandlerFn,
} from '@angular/common/http';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { LoaderService } from '../services/loader.service';

export function LoadingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const loadingService = inject(LoaderService);
  loadingService.update();
  return next(req).pipe(
    finalize(() => {
      setTimeout(() => {
        loadingService.update();
      }, 2000);
    })
  );
}
