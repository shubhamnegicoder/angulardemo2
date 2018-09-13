import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LocationComponent } from './location.component';
import { CountryComponent } from './country/country.component';
import { CanactivateGuard } from '../core/canactivate.guard';
import { CityComponent } from './city/city.component';
import { StateComponent } from './state/state.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
const locationRoutes: Routes = [{
  path: '',
  component: LocationComponent,
  pathMatch: 'prefix',
  children:
    [{ path: '', component: CityComponent }, { path: 'Country', component: CountryComponent, canActivate: [CanactivateGuard] },
    { path: 'City', component: CityComponent, canActivate: [CanactivateGuard] },
    { path: 'State', component: StateComponent, canActivate: [CanactivateGuard] }]
}
];
@NgModule({
  imports: [
    CommonModule,
    NgxSpinnerModule,
    RouterModule.forChild(locationRoutes),
    FormsModule,
    ReactiveFormsModule

  ], exports: [RouterModule],
  declarations: [LocationComponent, CountryComponent, CityComponent, StateComponent]
})
export class LocationModule { }
