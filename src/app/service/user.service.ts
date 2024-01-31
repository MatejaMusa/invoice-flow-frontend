import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { AccountType, CustomHttpResponse, Profile } from '../interface/appstates';
import { User } from '../interface/user';
import { Key } from '../enum/key.enum';

@Injectable()
export class UserService {
  private readonly server: string = 'http://localhost:8080';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  login$ = (email: string, password: string) => <Observable<CustomHttpResponse<Profile>>>
  this.http.post<CustomHttpResponse<Profile>>
  (`${this.server}/user/login`, {email, password})
  .pipe(
    catchError(this.handleError)
  );

  register$ = (user: User) => <Observable<CustomHttpResponse<Profile>>>
  this.http.post<CustomHttpResponse<Profile>>
  (`${this.server}/user/register`, user)
  .pipe(
    catchError(this.handleError)
  );

  requestPasswordReset$ = (email: string) => <Observable<CustomHttpResponse<Profile>>>
  this.http.get<CustomHttpResponse<Profile>>
  (`${this.server}/user/resetpassword/${email}`)
  .pipe(
    catchError(this.handleError)
  );

  verifyCode$ = (email: string, code: string) => <Observable<CustomHttpResponse<Profile>>>
  this.http.get<CustomHttpResponse<Profile>>
  (`${this.server}/user/verify/code/${email}/${code}`)
  .pipe(
    catchError(this.handleError)
  );

  verify$ = (key: string, type: AccountType) => <Observable<CustomHttpResponse<Profile>>>
  this.http.get<CustomHttpResponse<Profile>>
  (`${this.server}/user/verify/${type}/${key}`)
  .pipe(
    catchError(this.handleError)
  );

  renewPassword$ = (form: { userId: number, password: string, confirmPassword: string}) => <Observable<CustomHttpResponse<Profile>>>
  this.http.put<CustomHttpResponse<Profile>>
  (`${this.server}/user/new/password`, form)
  .pipe(
    catchError(this.handleError)
  );

  profile$ = () => <Observable<CustomHttpResponse<Profile>>>
  this.http.get<CustomHttpResponse<Profile>>
  (`${this.server}/user/profile`)
  .pipe(
    catchError(this.handleError)
  );

  update$ = (user: User) => <Observable<CustomHttpResponse<Profile>>>
  this.http.patch<CustomHttpResponse<Profile>>
  (`${this.server}/user/update`, user)
  .pipe(
    catchError(this.handleError)
  );

  refreshToken$ = () => <Observable<CustomHttpResponse<Profile>>>
  this.http.get<CustomHttpResponse<Profile>>
  (`${this.server}/user/refresh/token`, { headers: {Authorization: `Bearer ${localStorage.getItem(Key.REFRESH_TOKEN)}`}})
  .pipe(
    tap(response => {
      localStorage.removeItem(Key.TOKEN);
      localStorage.removeItem(Key.REFRESH_TOKEN);
      localStorage.setItem(Key.TOKEN, response.data.access_token);
      localStorage.setItem(Key.REFRESH_TOKEN, response.data.refresh_token);
    }),
    catchError(this.handleError)
  );
  
  updatePassword$ = (form: { currentPassword: string, newPassword: string, confirmNewPassword: string }) => <Observable<CustomHttpResponse<Profile>>>
  this.http.patch<CustomHttpResponse<Profile>>
  (`${this.server}/user/update/password`,form)
  .pipe(
    catchError(this.handleError)
  );

  updateRoles$ = (roleName: string) => <Observable<CustomHttpResponse<Profile>>>
  this.http.patch<CustomHttpResponse<Profile>>
  (`${this.server}/user/update/role/${roleName}`,{})
  .pipe(
    catchError(this.handleError)
  );

  updateAccountSettings$ = (settings: { enabled: boolean, notLocked: boolean }) => <Observable<CustomHttpResponse<Profile>>>
  this.http.patch<CustomHttpResponse<Profile>>
  (`${this.server}/user/update/settings`, settings)
  .pipe(
    catchError(this.handleError)
  );

  toggleMfa$ = () => <Observable<CustomHttpResponse<Profile>>>
  this.http.patch<CustomHttpResponse<Profile>>
  (`${this.server}/user/togglemfa`, {})
  .pipe(
    catchError(this.handleError)
  );

  updateImage$ = (formData: FormData) => <Observable<CustomHttpResponse<Profile>>>
  this.http.patch<CustomHttpResponse<Profile>>
  (`${this.server}/user/update/image`, formData)
  .pipe(
    catchError(this.handleError)
  );

  logOut() {
    localStorage.removeItem(Key.TOKEN);
    localStorage.removeItem(Key.REFRESH_TOKEN);
  }

  isAuthenticated = (): boolean => (this.jwtHelper.decodeToken<string>(localStorage.getItem(Key.TOKEN)) && !this.jwtHelper.isTokenExpired(localStorage.getItem(Key.TOKEN))) ? true : false;

  isRefreshTokenValid = (): boolean => (this.jwtHelper.decodeToken<string>(localStorage.getItem(Key.REFRESH_TOKEN)) && !this.jwtHelper.isTokenExpired(localStorage.getItem(Key.REFRESH_TOKEN))) ? true : false;

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    if(error.error instanceof ErrorEvent) {
      errorMessage =  `A client error occurred - ${error.error.message}`;
    } else {
      if(error.error.reason) {
        errorMessage =  error.error.reason;
      } else {
        errorMessage = `An error occured - Error status ${error.status}`;
      }
    }
    return throwError(() => errorMessage);
  }
}
