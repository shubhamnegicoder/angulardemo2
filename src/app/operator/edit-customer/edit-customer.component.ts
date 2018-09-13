import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../core/services/common.service';
import { AppURLs, APPSETTINGS } from '../../core/interfaces';
import { forkJoin } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent implements OnInit {

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
  customerId: any;
  customerData: any;

  constructor(private commonService: CommonService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.commonService.setTitle('UVM-Operator-Edit Customer');
    this.getCountryList();
    this.customerId = this.route.snapshot.params['id'];
    // alert(this.customerId);
    this.getCustomerDetail();
  }

  public getCustomerDetail() {
    this.commonService.getData(APPSETTINGS.operator_base_url + AppURLs.getEditcustomerDetail + this.customerId).subscribe((res: any) => {
      this.customerData = res.model;
      // console.log( this.customerData,'edit customer');
      this.customer.address1 = this.customerData.address1;
      this.customer.address2 = this.customerData.address2;
      this.customer.address3 = this.customerData.address3;
      this.customer.name = this.customerData.name;
      this.customer.contactPerson = this.customerData.contactPerson;
      this.customer.operatorRefCode = this.customerData.operatorRefCode;
      this.customer.contactNo = this.customerData.contactNo;
      this.customer.fax = this.customerData.fax;
      this.customer.email = this.customerData.email;
      this.customer.name = this.customerData.name;
      this.customer.countryId = this.customerData.countryId;
      this.customer.countryName = this.customerData.countryName;
      this.selectstate(this.customer.countryId);
      this.customer.stateId = this.customerData.stateId;
      this.customer.stateName = this.customerData.stateName;
      this.selectcity(this.customer.stateId);
      this.customer.cityId = this.customerData.cityId;
      this.customer.cityName = this.customerData.cityName;
      this.customer.id = this.customerId;

    })

  }
  public selectstate(data) {
    this.commonService.getData(APPSETTINGS.ims_url + AppURLs.getstatebycountry + data).subscribe(res => {
      //  console.log(res.model,'state list');
      this.stateList = res.model;
    })
  }
  public selectcity(data) {
    this.commonService.getData(APPSETTINGS.ims_url + AppURLs.getcitybystate + data).subscribe(res => {
      //  console.log(res.model,'state list');
      this.cityList = res.model;
    })
  }

  onSubmit() {
    // console.log(this.customer,"data for submit");
    this.commonService.putData(APPSETTINGS.operator_base_url + AppURLs.editCustomer, this.customer).subscribe((res: any) => {

      // console.log("response received:-> "+JSON.stringify(res));
      let msgToDisplay = "";
      if (!res.isError) {
        msgToDisplay = "Successfully Updated Customer."
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
      });

    }, err => {
      this.commonService.handleError(err);
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

