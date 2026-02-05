import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { OwnerNavbarComponent } from './ownerComponents/owner-navbar/owner-navbar.component';
import { LivestockFormComponent } from './ownerComponents/livestock-form/livestock-form.component';
import { MyRequestComponent } from './ownerComponents/my-request/my-request.component';
import { OwnerViewfeedComponent } from './ownerComponents/owner-viewfeed/owner-viewfeed.component';
import { ViewLivestockComponent } from './ownerComponents/view-livestock/view-livestock.component';
import { SupplierNavbarComponent } from './supplierComponents/supplier-navbar/supplier-navbar.component';
import { AddFeedComponent } from './supplierComponents/add-feed/add-feed.component';
import { ViewFeedComponent } from './supplierComponents/view-feed/view-feed.component';
import { ViewRequestComponent } from './supplierComponents/view-request/view-request.component';
import { AddMedicineComponent } from './supplierComponents/add-medicine/add-medicine.component';
import { ViewMedicineComponent } from './supplierComponents/view-medicine/view-medicine.component';
import { OwnerViewmedicineComponent } from './ownerComponents/owner-viewmedicine/owner-viewmedicine.component';
import { AddFeedbackComponent } from './ownerComponents/add-feedback/add-feedback.component';
import { ViewFeedbackComponent } from './supplierComponents/view-feedback/view-feedback.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'owner',
    component: OwnerNavbarComponent,
    canActivate:[authGuard],
    children: [
      {
        path: '',
        component: HomePageComponent
      },
      {
        path: 'livestock-form',
        component: LivestockFormComponent
      },
      {
        path: 'livestock-form/:id',
        component: LivestockFormComponent
      },
      {
        path: 'my-request',
        component: MyRequestComponent
      },
      {
        path: 'viewfeed',
        component: OwnerViewfeedComponent
      },
      {
        path: 'livestock',
        component: ViewLivestockComponent
      },
      {
        path: 'viewMedicine',
        component: OwnerViewmedicineComponent
      },
      {
        path: 'feedback',
        component: AddFeedbackComponent
      }
    ]
  },
  {
    path: 'supplier',
    component: SupplierNavbarComponent,
    canActivate:[authGuard,roleGuard],
    children: [
      {
        path: '',
        component: HomePageComponent
      },
      {
        path: 'add-feed',
        component: AddFeedComponent
      },
      {
        path: 'add-feed/:id',
        component: AddFeedComponent
      },
      {
        path: 'view-feed',
        component: ViewFeedComponent
      },
      {
        path: 'view-request',
        component: ViewRequestComponent
      },
      {
        path: 'add-medicine',
        component: AddMedicineComponent
      },
      {
        path: 'add-medicine/:id',
        component: AddMedicineComponent
      },
      {
        path: 'view-medicine',
        component: ViewMedicineComponent
      },
      {
        path: 'feedbacks',
        component: ViewFeedbackComponent
      }
    ]
  },
  {
    path: '**',
    component: ErrorPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
