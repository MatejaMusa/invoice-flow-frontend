import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoicesComponent } from './invoices/invoices.component';
import { NewinvoiceComponent } from './newinvoice/newinvoice.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';

@NgModule({
  declarations: [
    InvoicesComponent,
    NewinvoiceComponent,
    InvoiceDetailComponent
  ],
  imports: [ SharedModule, InvoiceRoutingModule ]
})
export class InvoiceModule { }
