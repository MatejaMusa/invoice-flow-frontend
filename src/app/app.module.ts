import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfileComponent } from './component/profile/profile.component';
import { HomeComponent } from './component/home/home.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { StatsComponent } from './component/stats/stats.component';
import { NewinvoiceComponent } from './component/newinvoice/newinvoice.component';
import { InvoicesComponent } from './component/invoices/invoices.component';
import { InvoiceComponent } from './component/invoice/invoice.component';
import { ExtractArrayValue } from './pipes/extractvalue.pipe'
import { CoreModule } from './core/core.module';
import { AuthModule } from './component/auth/auth.module';
import { CustomerModule } from './component/customer/customer.module';

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    HomeComponent,
    NavbarComponent,
    StatsComponent,
    NewinvoiceComponent,
    InvoicesComponent,
    InvoiceComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CoreModule,
    AuthModule,
    CustomerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
