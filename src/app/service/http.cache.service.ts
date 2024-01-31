import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class HttpCacheService {
  private httpResponseCache: { [key: string]: HttpResponse<any>} = {};

  put = (key: string, httpResponse: HttpResponse<any>): void => {
    this.httpResponseCache[key] = httpResponse;
  }

  get = (key: string): HttpResponse<any | null | undefined> => this.httpResponseCache[key];

  evict = (key: string): boolean => delete this.httpResponseCache[key];
 
  evictAll = (): void => {
    this.httpResponseCache = {};
  }
}
