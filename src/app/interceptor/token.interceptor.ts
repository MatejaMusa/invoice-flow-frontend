import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, switchMap, throwError } from 'rxjs';
import { Key } from '../enum/key.enum';
import { UserService } from '../service/user.service';
import { CustomHttpResponse, Profile } from '../interface/appstates';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isTokenRefreshing: boolean = false;
  private refreshTokenSubject: BehaviorSubject<CustomHttpResponse<Profile>> = new BehaviorSubject(null);

  constructor(private userService: UserService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> | Observable<HttpResponse<unknown>> {
    if(request.url.includes('verify') || request.url.includes('login') || request.url.includes('register') ||
      request.url.includes('refresh') || request.url.includes('resetpassword') || request.url.includes('new/password')) {
        return next.handle(request);
    }
    return next.handle(this.addAuthorizationTokenHeader(request, localStorage.getItem(Key.TOKEN)))
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if(error instanceof HttpErrorResponse && error.status === 401 && error.error.reason.includes('expired')) {
          if(this.userService.isRefreshTokenValid() === false) {
            this.router.navigate(['/login']);
          }
          return this.handleRefreshToken(request, next);
        } else {
          return throwError(() => error);
        }
      })
    );
  }
  private handleRefreshToken(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(!this.isTokenRefreshing) {
      this.isTokenRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.userService.refreshToken$().pipe(
        switchMap((response) => {
          this.isTokenRefreshing = false;
          this.refreshTokenSubject.next(response);
          return next.handle(this.addAuthorizationTokenHeader(request, response.data.access_token));
        })
      );
    } else {
      this.refreshTokenSubject.pipe(
        switchMap((response) => {
          return next.handle(this.addAuthorizationTokenHeader(request, response.data.access_token));
        })
      )
    }
  }

  private addAuthorizationTokenHeader(request: HttpRequest<unknown>, token: string): HttpRequest<any> {
    return request.clone({setHeaders: { Authorization: `Bearer ${token}`}});
  }
}
