import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TelemetryComponent } from './telemetry/telemetry.component';
import { VposComponent } from './vpos/vpos.component';
import { CashboxComponent } from './cashbox/cashbox.component';
import { OperatorComponentComponent } from './operator-component/operator-component.component';

import { CanactivateGuard } from '../core/canactivate.guard';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerLocationComponent } from './customer-location/customer-location.component';
import { NewCustomerLocationComponent } from './new-customer-location/new-customer-location.component';
import { NewCustomerComponent } from './new-customer/new-customer.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { OperationlocationComponent } from './operationlocation/operationlocation.component';

const operatorRoutes: Routes = [
  {
    path: '',
    component: OperatorComponentComponent,
    pathMatch: 'prefix',
    children: [
      {
        path: 'Customer/Create', component: NewCustomerComponent, canActivate: [CanactivateGuard]
      }, {
        path: 'Customer/Update/:id', component: EditCustomerComponent, canActivate: [CanactivateGuard]
      },
      {
        path: 'Customer', component: CustomerListComponent
      },
      {
        path: 'CustomerLocation', component: CustomerLocationComponent
      },
      {
        path: 'CustomerLocation/Create', component: NewCustomerLocationComponent
      }

    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(operatorRoutes),
    FormsModule,
    ReactiveFormsModule

  ], exports: [RouterModule],
  declarations: [OperatorComponentComponent,
    NewCustomerComponent, CustomerLocationComponent, NewCustomerLocationComponent, CustomerListComponent, EditCustomerComponent, OperationlocationComponent]
})
export class OperatorModule { }
