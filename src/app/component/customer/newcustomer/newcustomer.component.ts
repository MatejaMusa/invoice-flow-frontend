import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, BehaviorSubject, map, startWith, catchError, of } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { CustomHttpResponse, Page } from 'src/app/interface/appstates';
import { Customer } from 'src/app/interface/customer';
import { State } from 'src/app/interface/state';
import { User } from 'src/app/interface/user';
import { CustomerService } from 'src/app/service/customer.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-newcustomer',
  templateUrl: './newcustomer.component.html',
  styleUrls: ['./newcustomer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewcustomerComponent implements OnInit{
  newCustomerState$: Observable<State<CustomHttpResponse<Page<Customer> & User>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Page<Customer> & User>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState  = DataState;

  constructor( private customerService: CustomerService, private noficationService: NotificationService) {}
  
  ngOnInit(): void {
    this.newCustomerState$ = this.customerService.customers$()
    .pipe(map(response => {
      this.noficationService.onDefault(response.message);
      this.dataSubject.next(response);
      return { dataState: DataState.LOADED, appData: response };
    }),
      startWith({ dataState: DataState.LOADING }),
      catchError((error: string) => {
        this.noficationService.onError(error);
        return of({ dataState: DataState.ERROR, error})
      })
    )
  }

  createCustomer(newCustomerForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.newCustomerState$ = this.customerService.newCustomers$(newCustomerForm.value)
    .pipe(map(response => {
      this.noficationService.onDefault(response.message);
      newCustomerForm.reset({ type: 'INDIVIDUAL', status: 'ACTIVE' });
      this.isLoadingSubject.next(false);
      return { dataState: DataState.LOADED, appData: this.dataSubject.value };
    }),
      startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
      catchError((error: string) => {
        this.noficationService.onError(error);
        this.isLoadingSubject.next(false);
        return of({ dataState: DataState.LOADED, error})
      })
    )
  }
}