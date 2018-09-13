import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { WarehouselistComponent } from './warehouselist/warehouselist.component';
import { CreatewarehouseComponent } from './createwarehouse/createwarehouse.component';
import { RouterModule, Routes } from '@angular/router';
import { GrnComponent } from '../grn/grn.component';
import { CanactivateGuard } from '../core/canactivate.guard';
import { ViewGrnComponent } from '../grn/view-grn/view-grn.component';
import { CreateGrnComponent } from '../grn/create-grn/create-grn.component';
import { EditGrnComponent } from '../grn/edit-grn/edit-grn.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NocommanumberPipe } from '../core/nocommanumber.pipe';
import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component';
import { CreatePurchaseOrderComponent } from './create-purchase-order/create-purchase-order.component';
import { EditPusrchaseOrderComponent } from './edit-pusrchase-order/edit-pusrchase-order.component';
import { ViewPurchasedOrderComponent } from './view-purchased-order/view-purchased-order.component';
import { PurchaseReturnListComponent } from './purchase-return-list/purchase-return-list.component';
import { EditPurchaseReturnComponent } from '../edit-purchase-return/edit-purchase-return.component';
import { CreatePurchaseReturnComponent } from '../create-purchase-return/create-purchase-return.component';
import { ViewPurchaseReturnComponent } from './view-purchase-return/view-purchase-return.component';
const warehouseRoutes: Routes = [
  {
    path: '',
    component: WarehouseComponent,
    pathMatch: 'prefix',
    children: [
      {
        path: '', component: WarehouselistComponent, pathMatch: 'full'
      },
      { path: 'PurchaseOrder', component: PurchaseOrderListComponent, canActivate: [CanactivateGuard] },
      { path: 'PurchasedOrder/Update/:id', component: EditPusrchaseOrderComponent, canActivate: [CanactivateGuard] },
      { path: 'PurchasedOrder/Create', component: CreatePurchaseOrderComponent, canActivate: [CanactivateGuard] },
      { path: 'PurchasedOrder/View/:id', component: ViewPurchasedOrderComponent, canActivate: [CanactivateGuard] },
      { path: 'PurchaseReturnOrder', component: PurchaseReturnListComponent, canActivate: [CanactivateGuard] },
      { path: 'PurchasedReturnOrder/Update/:id', component: EditPurchaseReturnComponent, canActivate: [CanactivateGuard] },
      { path: 'PurchasedReturnOrder/Create', component: CreatePurchaseReturnComponent, canActivate: [CanactivateGuard] },
      { path: 'PurchasedReturnOrder/View/:id', component: ViewPurchaseReturnComponent, canActivate: [CanactivateGuard] },
      { path: 'GRN', component: GrnComponent, canActivate: [CanactivateGuard] },
      { path: 'GRN/Create', component: CreateGrnComponent, canActivate: [CanactivateGuard] },
      { path: 'GRN/:id', component: ViewGrnComponent, canActivate: [CanactivateGuard] },
      { path: 'GRN/Update/:id', component: EditGrnComponent, canActivate: [CanactivateGuard] }

    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(warehouseRoutes),
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule
  ], exports: [RouterModule],
  declarations: [WarehouseComponent, PurchaseOrderListComponent, CreatePurchaseOrderComponent, ViewPurchasedOrderComponent,
    EditPusrchaseOrderComponent, WarehouselistComponent, CreatewarehouseComponent,
    GrnComponent, EditGrnComponent, ViewGrnComponent,
    CreateGrnComponent, NocommanumberPipe, CreatePurchaseReturnComponent,
    EditPurchaseReturnComponent, ViewPurchaseReturnComponent, PurchaseReturnListComponent]
})
export class WarehouseModule { }
