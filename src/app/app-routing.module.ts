import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CanactivateGuard } from './core/canactivate.guard';
import { UserprofileComponent } from './userprofile/userprofile.component';



@NgModule({
  imports: [],
  exports: []
})
export class AppRoutingModule { }
