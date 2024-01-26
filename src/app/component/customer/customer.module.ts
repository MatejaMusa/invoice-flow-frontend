import { NgModule } from '@angular/core';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { NewcustomerComponent } from './newcustomer/newcustomer.component';
import { CustomersComponent } from './customers/customers.component';
import { CustomerRoutingModule } from './customer-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    CustomerDetailComponent,
    NewcustomerComponent,
    CustomersComponent
  ],
  imports: [ SharedModule, CustomerRoutingModule ]
})
export class CustomerModule { }
