import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { TokenInterceptor } from '../interceptor/token.interceptor';
import { CacheInterceptor } from '../interceptor/cache.interceptor';
import { HttpCacheService } from '../service/http.cache.service';
import { CustomerService } from '../service/customer.service';
import { UserService } from '../service/user.service';

@NgModule({
  providers: [
        UserService, CustomerService, HttpCacheService,
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }
    ]
})
export class CoreModule { }
