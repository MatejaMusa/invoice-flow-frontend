import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './component/profile/profile.component';
import { HomeComponent } from './component/home/home.component';
import { AuthenticationGuard } from './guard/authentication.guard';
import { InvoiceComponent } from './component/invoice/invoice.component';
import { NewinvoiceComponent } from './component/newinvoice/newinvoice.component';
import { InvoicesComponent } from './component/invoices/invoices.component';

const routes: Routes = [
  {path: 'profile', component: ProfileComponent, canActivate: [AuthenticationGuard] },
  {path: 'invoices', component: InvoicesComponent, canActivate: [AuthenticationGuard] },
  {path: 'invoices/new', component: NewinvoiceComponent, canActivate: [AuthenticationGuard] },
  {path: 'invoices/:id/:invoiceNumber', component: InvoiceComponent, canActivate: [AuthenticationGuard] },
  {path: 'profile', component: ProfileComponent, canActivate: [AuthenticationGuard] },
  {path: '', component: HomeComponent, canActivate: [AuthenticationGuard] },
  {path: '', redirectTo: '/', pathMatch: 'full'},
  {path: '**', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
