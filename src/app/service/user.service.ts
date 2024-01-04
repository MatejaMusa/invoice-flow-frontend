import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CustomHttpResponse, Profile } from '../interface/appstates';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly server: string = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  login$ = (email: string, password: string) => <Observable<CustomHttpResponse<Profile>>>
  this.http.post<CustomHttpResponse<Profile>>
  (`${this.server}/user/login`, {email, password})
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  verifyCode$ = (email: string, code: string) => <Observable<CustomHttpResponse<Profile>>>
  this.http.get<CustomHttpResponse<Profile>>
  (`${this.server}/user/verify/code/${email}/${code}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  profile$ = () => <Observable<CustomHttpResponse<Profile>>>
  this.http.get<CustomHttpResponse<Profile>>
  (`${this.server}/user/profile`, { headers: new HttpHeaders().set('Authorization', 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJJTlZPSUNFX0ZMT1dfRE9PIiwiYXVkIjoiQ1VTVE9NRVJfTUFOQUdFTUVOVF9TRVJWSUNFIiwiaWF0IjoxNzA0MzkyNjU5LCJzdWIiOiJtYXRlamFAZ21haWwuY29tIiwiYXV0aG9yaXRpZXMiOlsiUkVBRDpVU0VSIiwiUkVBRDpDVVNUT01FUiIsIlVQREFURTpVU0VSIiwiVVBEQVRFOkNVU1RPTUVSIiwiQ1JFQVRFOlVTRVIiLCJDUkVBVEU6Q1VTVE9NRVIiXSwiZXhwIjoxNzA0MzkzNjU5fQ.3raesE4Jg7MKfFxRbvGSICB3P_eDTCyGoddpU7h8zLlU9lahirbYCgBg-U7LjpVkHQ-qiz1z8fVHcCjC8EVHQQ')})
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
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
