import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
 
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
 
  constructor(private readonly router: Router, private readonly toastr: ToastrService) { }
 
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = JSON.parse(localStorage.getItem('authToken'));
    const currentUrl = this.router.url
    if (token) {
      const cloneReq = request.clone({
        setHeaders: {
          authorization: `Bearer ${token}`
        }
      })
      return next.handle(cloneReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 && !currentUrl.includes('/login')) {
            this.toastr.error('Session expired: Log in again!')
            localStorage.clear();
            this.router.navigate(['/login']);
          }
 
          return throwError(() => error)
        })
      )
    }
    return next.handle(request);
  }
}