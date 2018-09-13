import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../core/services/common.service';
import { AppURLs, APPSETTINGS } from '../../core/interfaces';
import { FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'app-edit-customer-location',
  templateUrl: './edit-customer-location.component.html',
  styleUrls: ['./edit-customer-location.component.css']
})
export class EditCustomerLocationComponent implements OnInit {

  countryList: Array<any>;
  stateList: Array<any>;
  cityList: Array<any>;
  type_val: any;
  location = {
    "customerId": 0,
    "operationLocationId": 0,
    "operatorRefCode": "",
    "contactPerson": "",
    "contactNo": "",
    "address1": "",
    "address2": "",
    "address3": "",
    "countryId": 0,
    "countryName": "",
    "stateId": 0,
    "stateName": "",
    "cityId": 0,
    "cityName": "",
    "hasStorageLocation": "",
    "longitude": "",
    "latitude": "",
    "fax": "",
    "email": "",
    "id": 0,
    "name": "",
    "isActive": true
  };
  operationLocationList: Array<any>;
  customerList: any;
  customerLocationId: any;
  customerLocationData: any;

  constructor(private commonService: CommonService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.commonService.setTitle('UVM-Edit Customer Location');
    this.customerLocationId = this.route.snapshot.params['id'];

    this.getcustomerLocationDetail(this.customerLocationId);
    this.getCountryList();
    this.getOperationLocationList();
    this.getCustomerList();

  }

  public getcustomerLocationDetail(data) {
    this.commonService.getData(APPSETTINGS.operator_base_url + AppURLs.getEditCustomerLocationDetail + data).subscribe((res: any) => {
      this.customerLocationData = res.model;
      // console.log( this.customerLocationData,'edit customer Location00000000000000000000000000');
      this.location.customerId = this.customerLocationData.customerId;
      this.location.operationLocationId = this.customerLocationData.operationLocationId;
      this.location.address1 = this.customerLocationData.address1;
      this.location.address2 = this.customerLocationData.address2;
      this.location.address3 = this.customerLocationData.address3;
      this.location.name = this.customerLocationData.name;
      this.location.contactPerson = this.customerLocationData.contactPerson;
      this.location.operatorRefCode = this.customerLocationData.operatorRefCode;
      this.location.contactNo = this.customerLocationData.contactNo;
      this.location.fax = this.customerLocationData.fax;
      this.location.email = this.customerLocationData.email;
      this.location.longitude = this.customerLocationData.longitude;
      this.location.latitude = this.customerLocationData.latitude;
      this.location.countryId = this.customerLocationData.countryId;
      this.location.countryName = this.customerLocationData.countryName;
      this.selectstate(this.customerLocationData.countryId);
      this.location.stateId = this.customerLocationData.stateId;
      this.location.stateName = this.customerLocationData.stateName;
      this.selectcity(this.customerLocationData.stateId);
      this.location.cityId = this.customerLocationData.cityId;
      this.location.cityName = this.customerLocationData.cityName;
      this.location.id = this.customerLocationId;
      this.location.hasStorageLocation = this.customerLocationData.hasStorageLocation

    })

  }

  public selectstate(data) {
    this.commonService.getData(APPSETTINGS.ims_url + AppURLs.getstatebycountry + data).subscribe(res => {
      //  console.log(res.model,'state list');
      this.stateList = res.model;
    });
  }
  public selectcity(data) {
    this.commonService.getData(APPSETTINGS.ims_url + AppURLs.getcitybystate + data).subscribe(res => {
      //  console.log(res.model,'state list');
      this.cityList = res.model;
    })
  }

  onSubmit() {
    // console.log(this.location,"data for edit submit");
    this.commonService.putData(APPSETTINGS.operator_base_url + AppURLs.editCustomerLocation, this.location).subscribe((res: any) => {

      // console.log("response received:-> "+JSON.stringify(res));
      let msgToDisplay = "";
      if (!res.isError) {
        msgToDisplay = "Successfully Updated Customer location."
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
          this.router.navigate(['/CustomerLocation']);
        } else {
          // alert("ok pressed & else executed")

        }
      });

    }, err => {
      this.commonService.handleError(err);
    });

  }
  public getOperationLocationList() {
    this.commonService.getData(APPSETTINGS.operator_base_url + AppURLs.operationLocationList).subscribe((res: any) => {
      // console.log(res,'operationLocationList list');
      this.operationLocationList = res.model;
    });
  }
  public getCustomerList() {
    this.commonService.getData(APPSETTINGS.operator_base_url + AppURLs.getCustomerList).subscribe((res: any) => {
      // console.log(res,'customerList list');
      this.customerList = res.model;
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
    this.location.countryId = country[0].id;
    this.location.countryName = country[0].name;
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
    this.location.stateId = state[0].id;
    this.location.stateName = state[0].name;
    this.commonService.getData(APPSETTINGS.ims_url + AppURLs.getcitybystate + state_id).subscribe(res => {
      // console.log(res, 'citydata');
      this.cityList = res.model;
    })
  }
  selectCity(event) {
    let city_id = event.target.value;
    let city = this.cityList.filter(item => item.id == city_id);
    this.location.cityId = city[0].id;
    this.location.cityName = city[0].name;
  }



}