import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppLoadModule } from './appload/appload.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { Requesthttpinceptor } from './core/interceptors/requesthttpinceptor';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule, Routes } from '@angular/router';
import { CanactivateGuard } from './core/canactivate.guard';
import { WithNavComponent } from './with-nav/with-nav.component';
import { WithoutNavComponent } from './without-nav/without-nav.component';
import { PlanogramComponent } from './planogram/planogram.component';
import { AddplanogramComponent } from './planogram/addplanogram/addplanogram.component';
import { LocationComponent } from './location/location.component';
import { CountryComponent } from './location/country/country.component';
import { CityComponent } from './location/city/city.component';
import { StateComponent } from './location/state/state.component';

import { UserComponent } from './user/user.component';
import { AdminComponent } from './administrator/admin/admin.component';


const routes: Routes = [
  { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
  {
    path: '',
    component: WithoutNavComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      }
    ]
  },
  {
    path: '',
    component: WithNavComponent,
    children: [
      {
        path: 'Dashboard',
        component: DashboardComponent,
        canActivate: [CanactivateGuard]
      }, {
        path: 'Administration',
        loadChildren: './administration/administration.module#AdministrationModule'
      },
      {
        path: 'profile',
        component: UserprofileComponent,
        canActivate: [CanactivateGuard]
      },
      {
        path: 'Machine',
        loadChildren: './machine/machine.module#MachineModule'
      },

      {
        path: 'Warehouse',
        loadChildren: './warehouse/warehouse.module#WarehouseModule'
      },
      {
        path: 'Operator',
        loadChildren: './operator/operator.module#OperatorModule'
      },
      {
        path: 'Location',
        loadChildren: './location/location.module#LocationModule'
      },

      {
        path: 'ProductCatelogue',
        loadChildren: './productcatelogue/productcatelogue.module#ProductcatelogueModule'
      },
      {
        path: 'Reports',
        loadChildren: './report/report.module#ReportModule'
      }

    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    UserprofileComponent,
    SidebarComponent,
    WithNavComponent,
    WithoutNavComponent,









  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppLoadModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: Requesthttpinceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

