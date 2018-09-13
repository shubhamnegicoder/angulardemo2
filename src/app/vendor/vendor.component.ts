 import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { PageService } from '../../Core/page.service';
// import { PurchasedOrderService } from '../../Core/purchased-order.service';
// import { VendorModuleService } from '../../Core/vendor-module.service';
// import { CountryService } from '../../Core/country.service';
// import { LogUtils } from '../../log-utils';
import swal from 'sweetalert2';
// import { ImportService } from '../../Core/import.service';
// import { APP_SETTINGS } from '../../Core/interface';
// import { CommonService } from '../../Core/common.service';
 import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../core/services/common.service';
import { APPSETTINGS, AppURLs } from '../core/interfaces';


@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})

export class VendorComponent implements OnInit {

  pager: any = {};
  pageSize: number = 10;
  pageNo: number;
  totalRecords: number = 0;
  listDetail: Array<any>;
  searchDetail: Array<any>;
  searchCities: Array<any>;
  regionList: Array<any>;
  countryList: Array<any>;
  show: boolean = false;
  data = {
    "name": "",
    "isActive": "",
    "regionId": "",
    "cityId": "",
    "countryId": "",
    "sortName": "name",
    "sortType": "desc",
    "pageSize": 10,
    "pageNo": 1
  }
  fileToUpload: any;


  @ViewChild('closeBtn2') closeBtn2: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('Name') Name: ElementRef;
  @ViewChild('country') country: ElementRef;
  @ViewChild('state') state: ElementRef;
  @ViewChild('city') city: ElementRef;
  @ViewChild('status') status: ElementRef;
  


  //call this wherever you want to close modal


  // private closeModal2(): void {
  //   this.fileInput.nativeElement.value = '';
  //   this.closeBtn2.nativeElement.click();
  // }

  constructor(private commonService:CommonService,private spinner:NgxSpinnerService) { }

  public resetfunction()
  {
   this.data.name=this.Name.nativeElement.value=""
   this.data.countryId=this.country.nativeElement.value=""
   this.data.regionId=this.state.nativeElement.value=""
   this.data.cityId=this.city.nativeElement.value=""
   this.data.isActive=this.status.nativeElement.value=""
   this.getFilteredData(this.data)
  }

  toggle() {
    this.show = !this.show;
  }


  // public optionpage(data) {
  //   this.pageSize = data.target.value;
  //   this.data.pageNo = 1
  //   this.data.pageSize = data.target.value;
  //   this.getFilteredData(this.data);
  //   //this.pager = this.pageService.getPager(this.totalRecords, 1, this.pageSize);
  // }

  ngOnInit() {
    this.commonService.setTitle('UVM-Catalogue-Vendor');
    this.getCountryList();
    // this.getSearchDataSelector();
    this.getFilteredData(this.data);
  }

  public filteroption(Name, country_id, state, city, status) {
    //console.log(Name, state, city, status, country_id, "datatatata");
    this.data.regionId = state;
    this.data.cityId = city;
    this.data.isActive = status;
    this.data.countryId = country_id;
    this.data.name = Name;
    this.setPage(1);
    //console.log("filter option input data:-> " + this.data.regionId, this.data.name);
    this.getFilteredData(this.data);
  }

  getFilteredData(data) {
    this.commonService.postData(APPSETTINGS.ims_url+AppURLs.vendorList,data).subscribe((res:any) => {
      console.log('res in get filterdata', res);
      this.listDetail = res.model;
      this.totalRecords = res.totalRecord;
      if (data.pageNo == 1)
        this.firstPage(1);
    });
  }


  setPage(page: number) {
    this.pageNo = page;
    this.data.pageNo = page;
    this.getFilteredData(this.data);
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);

  }

  firstPage(page: number) {
    this.pageNo = page;
    this.data.pageNo = page;
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);
  }



  public getCountryList() {
    
    this.commonService.getData(APPSETTINGS.ims_url+AppURLs.getCountryalllist).subscribe(res => {
      this.countryList = res.model;
    });
  }


  public selectCountryData(data) {
    this.spinner.hide();
    //fetch regions based on country selection

    let country_id = data.target.value;
   
    this.commonService.getData(APPSETTINGS.ims_url+AppURLs.getstatebycountry+country_id).subscribe((res:any) => {
      this.spinner.hide();
      this.regionList = res.model
    })
  }
  // public getSearchDataSelector() {
  //   this.spinner.show();
  //   this.pos.getSearchData().subscribe(res => {
  //     this.spinner.hide();
  //     this.searchDetail = res.model;
  //     this.searchCities = res.model.cities;
  //     this.regionList = res.model.regions;

  //     // console.log("searchdata")

  //   });

  // }

  public selectStatedata(data) {
    this.spinner.show();
    let stateId = data.target.value;
    this.commonService.getData(APPSETTINGS.ims_url+AppURLs.getcitybystate+stateId).subscribe(res => {
      this.spinner.hide();
      this.searchCities = res.model;
    })

  }

  // importAsXLSX() {

  //   const fi = this.fileInput.nativeElement;
    
  //   if (fi.files && fi.files[0]) {
  //     this.fileToUpload = fi.files[0];
  //   }
  

  //   if (this.fileToUpload) {

  //     this.importExcelService.uploadBrand(this.fileToUpload, 1, 'api/Vendor/Import').subscribe(res => {

  //       if (res) {
  //         this.fileToUpload = "";
  //         // show swal showing total number of records uploaded
  //         // and download file from url
  //         if (!res.didError && (res.model.successCount > 0)) {


  //           this.closeModal2();
  //           let msgToDisplay = res.model.successCount + '  out of ' + res.model.totalCount + ' total Records imported successfully.';
  //           let pathToDownloadFile = "";

  //           if (res.model.filePath !== null && res.model.filePath) {
  //             pathToDownloadFile = APP_SETTINGS.base_url + res.model.filePath
  //           }
  //           swal({
  //             title: 'Result',
  //             text: msgToDisplay,
  //             type: "success",
  //             showCancelButton: false,
  //             confirmButtonText: 'OK',
  //             footer: '<a href="http://103.12.132.77:6002/' + res.model.filePath + '" download="test.xls">click here to download details</a>'
  //           }).then((result) => {
  //             if (res.model.filePath !== null && res.model.filePath) {
  //               this.getFilteredData(this.data);

  //             }
  //           })


  //         } else {
  //           // handle here the error condition

  //           swal({
  //             title: 'Result',
  //             text: res.errorMessage,
  //             type: "error",
  //             showCancelButton: false,
  //             confirmButtonText: 'OK'
  //           })

  //         }


  //       }
  //     }, (err: any) => {

  //       LogUtils.showLog("upload error response:-> " + err.error);

  //       swal({
  //         title: '',
  //         text: err.error.errorMessage,
  //         type: "error",
  //         showCancelButton: false,
  //         confirmButtonText: 'OK'
  //       })
  //     });
  //   } else {
  //     swal({
  //       title: '',
  //       text: 'Please select a file..!!',
  //       type: 'warning',
  //       showCancelButton: false,
  //       confirmButtonText: 'OK'
  //     });
  //   }
  // }


  // changeStatus(id) {

  //   let currentStatus;
  //   this.listDetail.filter(item => {
  //     if (item.id == id)
  //       currentStatus = item.isActive;
  //   })

  //   let msg = "You want to Activate this Vendor?"
  //   let statusToShow = "Successfully Activated Vendor..!!"
  //   if (currentStatus === 1) {
  //     msg = "You want to Deactivate this Vendor?"
  //     statusToShow = "Successfully Deactivated Vendor..!!"
  //   }

  //   swal({
  //     title: 'Are you sure?',
  //     text: msg,
  //     type: 'question',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes',
  //     cancelButtonColor: '#d33'
  //   }).then((result) => {
  //     if (result.value) {
  //       // call service here
  //       let objToDel = {
  //         "requestedId": id,
  //         "userId": 1,
  //         "status": currentStatus
  //       }

  //       this.vendorService.changeStatus(objToDel).subscribe(res => {

  //         // console.log('response received change status service:-> ' + res.didError);

  //         if (!res.didError) {
  //           // alert("changed successfully");
  //           this.getFilteredData(this.data);
  //           swal(
  //             'Info',
  //             statusToShow,
  //             'success'
  //           );
  //         } else {
  //           //alert("issue in changing status");

  //           swal(
  //             'Info',
  //             res.errorMessage,
  //             'warning'
  //           );
  //         }
  //       }, err => {
  //         //alert('error in service');
  //         swal(
  //           'Info',
  //           err.error.errorMessage,
  //           'error'
  //         );
  //       });
  //     }
  //   })

  // }

}
