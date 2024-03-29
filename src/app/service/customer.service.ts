import { HttpClient, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { CustomHttpResponse, CustomerState, Page } from '../interface/appstates';
import { User } from '../interface/user';
import { Stats } from '../interface/stats';
import { Customer } from '../interface/customer';
import { Invoice } from '../interface/invoice';

@Injectable()
export class CustomerService {
  private readonly server: string = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  customers$ = (page: number = 0) => <Observable<CustomHttpResponse<Page<Customer> & User & Stats>>>
  this.http.get<CustomHttpResponse<Page<Customer> & User & Stats>>
  (`${this.server}/customer/list?page=${page}`)
  .pipe(
    catchError(this.handleError)
  );

  customer$ = (customerId: number) => <Observable<CustomHttpResponse<CustomerState>>>
  this.http.get<CustomHttpResponse<CustomerState>>
  (`${this.server}/customer/get/${customerId}`)
  .pipe(
    catchError(this.handleError)
  );

  update$ = (customer: Customer) => <Observable<CustomHttpResponse<CustomerState>>>
  this.http.put<CustomHttpResponse<CustomerState>>
  (`${this.server}/customer/update`, customer)
  .pipe(
    catchError(this.handleError)
  );

  searchCustomers$ = (name: string = '', page: number = 0) => <Observable<CustomHttpResponse<Page<Customer> & User>>>
  this.http.get<CustomHttpResponse<Page<Customer> & User>>
  (`${this.server}/customer/search?name=${name}&page=${page}`)
  .pipe(
    catchError(this.handleError)
  );

  newCustomers$ = (customer: Customer) => <Observable<CustomHttpResponse<Customer & User>>>
  this.http.post<CustomHttpResponse<Customer & User>>
  (`${this.server}/customer/create`, customer)
  .pipe(
    catchError(this.handleError)
  );

  newinvoice$ = () => <Observable<CustomHttpResponse<Customer[] & User>>>
  this.http.get<CustomHttpResponse<Customer[] & User>>
  (`${this.server}/customer/invoice/new`)
  .pipe(
    catchError(this.handleError)
  );

  createInvoice$ = (customerId: number, invoice: Invoice) => <Observable<CustomHttpResponse<Customer[] & User>>>
  this.http.post<CustomHttpResponse<Customer[] & User>>
  (`${this.server}/customer/invoice/addtocustomer/${customerId}`, invoice)
  .pipe(
    catchError(this.handleError)
  );

  invoices$ = (page: number = 0) => <Observable<CustomHttpResponse<Page<Invoice> & User>>>
  this.http.get<CustomHttpResponse<Page<Invoice> & User>>
  (`${this.server}/customer/invoice/list?page=${page}`)
  .pipe(
    catchError(this.handleError)
  );

  invoice$ = (invoiceId: number) => <Observable<CustomHttpResponse<Customer & Invoice & User>>>
  this.http.get<CustomHttpResponse<Customer & Invoice & User>>
  (`${this.server}/customer/invoice/get/${invoiceId}`)
  .pipe(
    catchError(this.handleError)
  );

  downloadReport$ = () => <Observable<HttpEvent<Blob>>>
  this.http.get(`${this.server}/customer/download/report`, { reportProgress: true, observe: 'events', responseType: 'blob' })
  .pipe(
    catchError(this.handleError)
  );

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
