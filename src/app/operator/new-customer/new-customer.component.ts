import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../core/services/common.service';
import { AppURLs, APPSETTINGS } from '../../core/interfaces';
import { forkJoin } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
// import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.css']
})
export class NewCustomerComponent implements OnInit {

  countryList: Array<any>;
  stateList: Array<any>;
  cityList: Array<any>;
  type_val: any;
  customer = {
    "operatorRefCode": "",
    "contactPerson": "",
    "contactNo": "",
    "address1": "",
    "address2": "",
    "address3": "",
    "countryId": 0,
    "countryName": " ",
    "stateId": 0,
    "stateName": " ",
    "cityId": 0,
    "cityName": "",
    "fax": "",
    "email": "",
    "id": 0,
    "name": "",
    "isActive": true
  }

  constructor(private commonService: CommonService, private router: Router) { }

  ngOnInit() {
    this.commonService.setTitle('UVM-Create Customer');
    this.getCountryList();
  }


  onSubmit() {
    // console.log(this.customer,"data for submit");
    this.commonService.postData(APPSETTINGS.operator_base_url + AppURLs.CreateCustomer, this.customer).subscribe((res: any) => {

      console.log("response received:-> " + JSON.stringify(res));
      let msgToDisplay = "";
      if (!res.isError) {
        msgToDisplay = "Successfully Created Customer."
        this.type_val = "success";
      } else if (res.isError) {
        msgToDisplay = res.message
        this.type_val = "warning";
      }
      swal({
        title: 'Result',
        text: msgToDisplay,
        type: this.type_val,
        showCancelButton: false,
        confirmButtonText: 'OK'
      }).then((result) => {
        // console.log("result value:->"+result.value);
        if (!res.isError && result.value === true) {
          this.router.navigate(['/Customer']);
        } else {
          // alert("ok pressed & else executed")

        }
      })

    }, err => {
      // LogUtils.showLog("error received:-> "+JSON.stringify(err));
    });

  }


  public getCountryList() {
    this.commonService.getData(APPSETTINGS.ims_url + AppURLs.getCountryalllist).subscribe((res: any) => {
      // console.log(res.model,'country list');

      this.countryList = res.model;
    });
  }

  selectCountry(event) {

    let country_id = event.target.value;
    let country = this.countryList.filter(item => item.id == country_id);
    this.customer.countryId = country[0].id;
    this.customer.countryName = country[0].name;
    this.commonService.getData(APPSETTINGS.ims_url + AppURLs.getstatebycountry + country_id).subscribe(res => {
      // console.log(res.model,'state list');
      this.stateList = res.model
    });
  }

  // backBtnPressed(){

  //   this.router.navigate(['/ProductCatalogue/Vendor']);
  // }

  selectState(event) {
    let state_id = event.target.value;
    let state = this.stateList.filter(item => item.id == state_id);
    this.customer.stateId = state[0].id;
    this.customer.stateName = state[0].name;
    this.commonService.getData(APPSETTINGS.ims_url + AppURLs.getcitybystate + state_id).subscribe(res => {
      // console.log(res, 'citydata');
      this.cityList = res.model;
    });
  }
  selectCity(event) {
    let city_id = event.target.value;
    let city = this.cityList.filter(item => item.id == city_id);
    this.customer.cityId = city[0].id;
    this.customer.cityName = city[0].name;
  }
}
