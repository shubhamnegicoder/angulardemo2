import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../core/services/common.service';
import { AppURLs, APPSETTINGS } from '../core/interfaces';
import { forkJoin } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.css']
})
export class NewCustomerComponent implements OnInit {

  countryList:Array<any>;
  stateList:Array<any>;
  cityList:Array<any>;
  type_val:any;
  vendor = {
    "address1": "",
    "address2": "",
    "address3": "",
    "phone": "",
    "countryName": "",
    "regionName": "",
    "cityName": "",
    "panNo": "",
    "email": "",
    "alternateEmail": "",
    "contactPerson": "",
    "countryId": "",
    "regionId": "",
    "cityId": "",
    "userId": "1",
    "id": 0,
    "name": "",
    "isActive": 1
  }
  router: any;
  constructor(private commonService:CommonService) { }

  ngOnInit() {
    this.commonService.setTitle('IMS-Catalogue-Add Vendor');
    this.getCountryList();
  }


  onSubmit(data) {
   this.commonService.postData(APPSETTINGS.operator_base_url + AppURLs.CreateCustomer,data).subscribe((res:any)=>{

    console.log("response received:-> "+JSON.stringify(res));
    let msgToDisplay = "";
   
    if(!res.didError){
        msgToDisplay = "Successfully Created Customer."
        this.type_val = "success";
    }else if(res.didError){
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
      console.log("result value:->"+result.value);
      if(!res.didError && result.value === true){
        this.router.navigate(['/Customer']);
      }else{
       // alert("ok pressed & else executed")
      
      }
    })

   },err=>{
    // LogUtils.showLog("error received:-> "+JSON.stringify(err));
   });
  
  }


  public getCountryList(){
    this.commonService.getData(APPSETTINGS.ims_url+AppURLs.getCountryalllist).subscribe((res:any)=>{
      // console.log(res.model,'country list');
      
      this.countryList = res.model;
    });
  }

  selectCountry(event){
    let country_id = event.target.value;
    this.commonService.getData(APPSETTINGS.ims_url+AppURLs.getstatebycountry+country_id).subscribe(res=>{
      console.log(res.model,'state list');
      this.stateList = res.model
    })
  }

  // backBtnPressed(){

  //   this.router.navigate(['/ProductCatalogue/Vendor']);
  // }

  selectState(event){
    let state_id = event.target.value;
    this.commonService.getData(APPSETTINGS.ims_url+AppURLs.getcitybystate+state_id).subscribe(res => {
      console.log(res, 'citydata');
      this.cityList = res.model;
    })
  }


  
}
