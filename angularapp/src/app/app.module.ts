import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { LivestockFormComponent } from './ownerComponents/livestock-form/livestock-form.component';
import { MyRequestComponent } from './ownerComponents/my-request/my-request.component';
import { OwnerNavbarComponent } from './ownerComponents/owner-navbar/owner-navbar.component';
import { OwnerViewfeedComponent } from './ownerComponents/owner-viewfeed/owner-viewfeed.component';
import { ViewLivestockComponent } from './ownerComponents/view-livestock/view-livestock.component';
import { AddFeedComponent } from './supplierComponents/add-feed/add-feed.component';
import { SupplierNavbarComponent } from './supplierComponents/supplier-navbar/supplier-navbar.component';
import { ViewFeedComponent } from './supplierComponents/view-feed/view-feed.component';
import { ViewRequestComponent } from './supplierComponents/view-request/view-request.component';
import { LoaderComponent } from './components/loader/loader.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatMenuModule } from '@angular/material/menu'
import { MatTableModule } from '@angular/material/table'
import { MatSortModule } from '@angular/material/sort'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatDividerModule } from '@angular/material/divider'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list'
import { MatStepperModule } from '@angular/material/stepper'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AddMedicineComponent } from './supplierComponents/add-medicine/add-medicine.component';
import { ViewMedicineComponent } from './supplierComponents/view-medicine/view-medicine.component';
import { OwnerViewmedicineComponent } from './ownerComponents/owner-viewmedicine/owner-viewmedicine.component';
import { DatePipe } from '@angular/common';
import { AddFeedbackComponent } from './ownerComponents/add-feedback/add-feedback.component';
import { ViewFeedbackComponent } from './supplierComponents/view-feedback/view-feedback.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    ErrorPageComponent,
    HomePageComponent,
    LoginComponent,
    SignupComponent,
    LivestockFormComponent,
    MyRequestComponent,
    OwnerNavbarComponent,
    OwnerViewfeedComponent,
    ViewLivestockComponent,
    AddFeedComponent,
    SupplierNavbarComponent,
    ViewFeedComponent,
    ViewRequestComponent,
    LoaderComponent,
    AddMedicineComponent,
    ViewMedicineComponent,
    OwnerViewmedicineComponent,
    AddFeedbackComponent,
    ViewFeedbackComponent,
    ForgotPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatDividerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatStepperModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
