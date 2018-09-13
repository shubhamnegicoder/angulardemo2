import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report/report.component';
import { Routes, RouterModule, Router } from '@angular/router';
import { TrnMisMatchComponent } from '../trn-mis-match/trn-mis-match.component';
import { CanactivateGuard } from '../core/canactivate.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerComponent, NgxSpinnerModule } from 'ngx-spinner';
const reportRoutes: Routes = [
  {
    path: '', component: ReportComponent, pathMatch: 'prefix', children: [
      { path: 'TRNMismatch', component: TrnMisMatchComponent }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(reportRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ], exports: [RouterModule],
  declarations: [ReportComponent, TrnMisMatchComponent]
})
export class ReportModule { }
