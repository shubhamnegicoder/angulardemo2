import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MachineComponent } from './machine/machine.component';
import { Routes, RouterModule } from '@angular/router';
import { AddMachineComponent } from './add-machine/add-machine.component';
import { CanactivateGuard } from '../core/canactivate.guard';
import { PlanogramComponent } from '../planogram/planogram.component';
import { AddplanogramComponent } from '../planogram/addplanogram/addplanogram.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MainmachineComponent } from './mainmachine/mainmachine.component';
import { TelemetryComponent } from '../operator/telemetry/telemetry.component';
import { VposComponent } from '../operator/vpos/vpos.component';
import { CashboxComponent } from '../operator/cashbox/cashbox.component';
const machineRoutes: Routes = [{
  path: '',
  component: MainmachineComponent,
  pathMatch: 'prefix',
  children: [
   
    { path: 'Machine', component: MachineComponent, canActivate: [CanactivateGuard] },
    { path: 'Machine/Create', component: AddMachineComponent, canActivate: [CanactivateGuard] }, {
      path: 'Planogram',
      component: PlanogramComponent,
      canActivate: [CanactivateGuard]
    },
    {
      path: 'Planogram/Create',
      component: AddplanogramComponent,
      canActivate: [CanactivateGuard]
    },
    {
      path: 'Telemetry',
      component: TelemetryComponent,
      canActivate: [CanactivateGuard]
    },
    {
      path: 'VPOS',
      component: VposComponent,
      canActivate: [CanactivateGuard]
    }, {
      path: 'CashBox',
      component: CashboxComponent,
      canActivate: [CanactivateGuard]
    }
  ]

}];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(machineRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ], exports: [RouterModule],
  declarations: [MachineComponent, PlanogramComponent, AddplanogramComponent, AddMachineComponent, MainmachineComponent, TelemetryComponent, VposComponent, CashboxComponent]

})
export class MachineModule { }
