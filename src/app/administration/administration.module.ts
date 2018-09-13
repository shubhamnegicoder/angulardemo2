import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from '../administrator/admin/admin.component';
import { UserComponent } from '../user/user.component';
import { CanactivateGuard } from '../core/canactivate.guard';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentmodeComponent } from './paymentmode/paymentmode.component';
import { RoleComponent } from './role/role.component';
import { AddroleComponent } from './addrole/addrole.component';

const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    pathMatch: 'prefix',
    children: [
      {
        path: 'PaymentMode', component: PaymentmodeComponent, canActivate: [CanactivateGuard]
      },
      {
        path: 'Role', component: RoleComponent, canActivate: [CanactivateGuard]
      },
      {
        path: 'Role/Create', component: AddroleComponent, canActivate: [CanactivateGuard]
      }

    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminRoutes),
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule],
  declarations: [
    UserComponent, AdminComponent, PaymentmodeComponent, RoleComponent, AddroleComponent
  ]
})
export class AdministrationModule { }
