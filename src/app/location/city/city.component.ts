import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../core/services/common.service';
import { AppURLs } from '../../core/interfaces';
import { APPSETTINGS } from '../../core/interfaces';
import { StateListModal } from '../../core/interfaces';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {

  pager: any = {};
  pageSize: number = 10;
  pageNo: number;
  totalRecords: number = 0;
  listDetail: Array<any>;
  stateList: Array<any> = [];
  stateList_ForCreation: Array<any> = [];
  countryList: Array<any> = [];
  show: boolean = false;
  type_val: any = "";
  userId = "1";
  editList = {
    "code": "",
    "regionName": "",
    "regionId": "",
    "id": "",
    "name": "",
    "isActive": "",
    "countryId": "",
    "countryName": "",
  }
  selectedState: any;
  data = {
    "code": "",
    "status": "",
    "name": "",
    "userId": "",
    "stateId": "",
    "countryId": "",
    "sortName": "name",
    "sortType": "desc",
    "pageSize": 10,
    "pageNo": 1
  }

  dataForCityCreation = {
    "id": "",
    "name": "",
    "status": "",
    "userId": "1",
    "code": "",
    "regionId": "",
    "countryId": ""
  }
  fileToUpload: any;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeBtn1') closeBtn1: ElementRef;
  //  @ViewChild('cityCode') cityCode :ElementRef;
  //  @ViewChild('cityNamee') cityNamee: ElementRef;
  //  @ViewChild('statee') statee :ElementRef;
  @ViewChild('closeBtn2') closeBtn2: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('code') code: ElementRef;
  @ViewChild('name') name: ElementRef;
  @ViewChild('country') country: ElementRef;
  @ViewChild('state') state: ElementRef;
  @ViewChild('status') status: ElementRef;


  //call this wherever you want to close modal
  private closeModal(): void {

    this.closeBtn.nativeElement.click();
  }

  private closeModal1(): void {
    this.closeBtn1.nativeElement.click();
  }

  private closeModal2(): void {

    this.fileInput.nativeElement.value = '';
    this.closeBtn2.nativeElement.click();
  }
  public resetfunction() {
    this.data.code = this.code.nativeElement.value = ""
    this.data.name = this.name.nativeElement.value = ""
    this.data.countryId = this.country.nativeElement.value = ""
    this.data.stateId = this.state.nativeElement.value = ""
    this.data.status = this.status.nativeElement.value = ""
    this.getCityList(this.data);
  }

  constructor(
    private spinner: NgxSpinnerService, private commonService: CommonService) { }



  toggle() {
    this.show = !this.show;
  }


  public optionpage(data) {
    this.pageSize = data.target.value;
    this.data.pageNo = 1
    this.data.pageSize = data.target.value;
    this.getCityList(this.data);
    this.pager = this.commonService.getPager(this.totalRecords, 1, this.pageSize);
  }

  ngOnInit() {
    this.commonService.setTitle('UVM-Location-City');
    this.getSearchDataSelector();
    this.getCityList(this.data);
  }


  public getSearchDataSelector() {
    this.commonService.getData(APPSETTINGS.ims_url + AppURLs.InboundDetails).subscribe((res: any) => {
      this.stateList = res.model.regions;
      this.countryList = res.model.countries;
      this.stateList_ForCreation = Array.from(this.stateList);
    });

  }



  selectCountry(event) {
    let country_id = event.target.value;

    this.commonService.getData(APPSETTINGS.ims_url + AppURLs.getstatebycountry + country_id).subscribe((res: any) => {
      this.stateList_ForCreation = res.model;
      console.log(this.stateList_ForCreation, 'state steat')      // alert("state get");
    });
  }


  selectCountry_Filter(event) {
    let country_id = event.target.value;
    this.commonService.getData(APPSETTINGS.ims_url + AppURLs.getstatebycountry + country_id).subscribe((res: any) => {
      this.stateList = res.model;
      // alert("state get");
    });
  }

  public filteroption(code, name, country_id, state, status) {
    console.log(code, name, state, status, "datatatata medha");
    this.data.status = status;
    this.data.name = name;
    this.data.stateId = state;
    this.data.code = code;
    this.data.countryId = country_id;
    this.setPage(1);
    console.log("data:-> " + this.data.status, this.data.name, this.data.sortName);
    this.getCityList(this.data);

  }

  setPage(page: number) {
    this.pageNo = page;
    this.data.pageNo = page;
    this.getCityList(this.data);
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);

  }

  firstPage(page: number) {
    this.pageNo = page;
    this.data.pageNo = page;
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);
  }



  public getCityList(data) {
    console.log(JSON.stringify(data) + '  in brand');
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();

    }, 5000);
    this.commonService.postData(APPSETTINGS.ims_url + AppURLs.getCity, data).subscribe((res: any) => {
      console.log('brandlist data received:-> ');
      this.spinner.hide();
      this.listDetail = res.model;
      this.totalRecords = res.totalRecord;
      // console.log('brandlist data received:-> '+this.listDetail.length);
      if (data.pageNo == 1)
        this.firstPage(1);
    }, err => {
      this.spinner.hide();
    });


  }

  resetDataArr() {
    this.dataForCityCreation = {
      "id": "",
      "name": "",
      "status": "",
      "userId": "1",
      "code": "",
      "regionId": "",
      "countryId": ""
    }
  }

  createCity() {
    let msg = this.inputValidation();
    if (msg != "") {

      swal({
        title: '',
        text: msg,
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'OK'
      });

    } else {
      //need to call the service from here to create brand.
      this.spinner.show();
      this.commonService.postData(APPSETTINGS.ims_url + AppURLs.createCity, this.dataForCityCreation).subscribe((response: any) => {
        this.spinner.hide();
        console.log("response received:-> " + response.model);
        if (!response.didError)
          this.type_val = 'success';
        else
          this.type_val = 'warning';


        if (!response.didError) {
          // success case
          // here handle success case
          this.closeModal();


          swal({
            title: 'Result',
            text: response.model.statusMessage,
            type: this.type_val,
            showCancelButton: false,
            confirmButtonText: 'OK'
          }).then((result) => {
            console.log("result value:->" + result.value);
            if (response.model.statusMessage !== 'Successfully Inserted' && result.value === true) {
              // this.removeModal();
              //alert("ok pressed & if executed")
            } else {
              // alert("ok pressed & else executed")
              this.getCityList(this.data);
            }
          })



        } else {
          swal({
            title: 'Result',
            text: response.message,
            type: 'error',
            showCancelButton: false,
            confirmButtonText: 'OK'
          });
        }

      }, error => {
        this.spinner.hide();
        this.commonService.handleError(error);

      });
    }

  }


  inputValidation(): string {

    let msg = "";
    if (this.dataForCityCreation.code === "") {
      msg = "Code is Mandatory"
    } else if (this.dataForCityCreation.name === "") {
      msg = "Name is Mandatory"
    } else if (this.dataForCityCreation.countryId === "") {
      msg = "Country is Mandatory"
    } else if (this.dataForCityCreation.regionId === "") {
      msg = "State is Mandatory"
    }

    return msg;
  }



  editCity() {
    //need to call the service from here to create brand.
    this.dataForCityCreation.name = this.editList.name;
    this.dataForCityCreation.id = this.editList.id;
    this.dataForCityCreation.status = this.editList.isActive;
    this.dataForCityCreation.code = this.editList.code;
    this.dataForCityCreation.regionId = this.editList.regionId;
    this.dataForCityCreation.countryId = this.editList.countryId;

    let msg = this.inputValidation();
    if (msg != "") {

      swal({
        title: '',
        text: msg,
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'OK'
      });

    } else {
      this.spinner.show();
      this.commonService.putData(APPSETTINGS.ims_url + AppURLs.createCity, this.dataForCityCreation).subscribe((response: any) => {
        this.spinner.hide();
        if (!response.didError)
          this.type_val = 'success';
        else
          this.type_val = 'warning';


        if (!response.didError) {
          this.closeModal1();
          swal({
            title: 'Result',
            text: response.model.statusMessage,
            type: this.type_val,
            showCancelButton: false,
            confirmButtonText: 'OK'
          }).then((result) => {
            console.log("result value:->" + result.value);

            // alert("ok pressed & else executed")
            this.getCityList(this.data);
            //  }
          });



        } else {
          swal({
            title: 'Result',
            text: response.message,
            type: 'error',
            showCancelButton: false,
            confirmButtonText: 'OK'
          });
        }

      }, error => {

        this.spinner.hide();
        this.commonService.handleError(error);
      });

    }
  }

  editClicked(id) {


    this.listDetail.map((item, key) => {
      // //console.log(item, 'item');

      if (item.id === id) {
        this.selectedState = item;
        //   //console.log(this.callOneList, 'ooooooooooooooo');
        this.editList.id = this.selectedState.id;
        this.editList.code = this.selectedState.code;
        this.editList.name = this.selectedState.name;
        this.editList.regionId = this.selectedState.regionId;
        this.editList.regionName = this.selectedState.regionName;
        this.editList.countryId = this.selectedState.countryId;
        this.editList.countryName = this.selectedState.countryName;
        this.editList.isActive = this.selectedState.isActive;
      }

      // this.commonService.post(this.editList.countryId, this.userId).subscribe((res:any) => {
      //   this.stateList_ForCreation = res.model
      // })
    });

  }




  changeStatus(id) {

    let currentStatus;
    this.listDetail.filter(item => {
      if (item.id == id)
        currentStatus = item.isActive;
    })

    let msg = "You want to Activate this State?"
    if (currentStatus === 1) {
      msg = "You want to Deactivate this State?"
    }

    swal({
      title: 'Are you sure?',
      text: msg,
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.value) {
        // call service here
        let objToDel = {
          "requestedId": id,
          "userId": this.userId,
          "status": currentStatus
        }
        this.spinner.show();
        this.commonService.deleteData(APPSETTINGS.ims_url + 'api/City?Id=' + id + '&Status=' + currentStatus).subscribe((res: any) => {
          this.spinner.hide();
          console.log("response received change status service:-> " + JSON.stringify(res));

          if (!res.didError) {
            // alert("changed successfully");
            this.getCityList(this.data);
            swal(
              'Info',
              'Status changed successfully..!!',
              'success'
            );
          } else {
            //alert("issue in changing status");

            swal(
              'Info',
              res.errorMessage,
              'warning'
            );
          }
        }, err => {
          this.spinner.hide();
          this.commonService.handleError(err);
        });
      }
    })

  }


  // importAsXLSX() {

  //   const fi = this.fileInput.nativeElement;
  //   if (fi.files && fi.files[0]) {
  //     this.fileToUpload = fi.files[0];
  //   }
  //   if (this.fileToUpload) {
  //     this.spinner.show();
  //     this.commonService.uploadBrand(this.fileToUpload, 1, 'api/City/Import').subscribe(res => {
  //       this.spinner.hide();
  //       if (res) {
  //         this.fileToUpload = "";
  //         // show swal showing total number of records uploaded
  //         // and download file from url
  //         if (!res.didError) {

  //           this.closeModal2();
  //           let msgToDisplay = res.model.successCount + '  out of ' + res.model.totalCount + '  Records imported successfully.';

  //           swal({
  //             title: 'Result',
  //             text: msgToDisplay,
  //             type: "success",
  //             showCancelButton: false,
  //             confirmButtonText: 'OK',
  //             footer: '<a href="http://103.12.132.77:6002/' + res.model.filePath + '" download="test.xls">click here to download details</a>'
  //           }).then((result) => {
  //             if (res.model.filePath !== null && res.model.filePath) {
  //               this.getCityList(this.data);
  //               // this.downloadService.downloadFile(res.model.filePath).subscribe(res1 => {
  //               //   console.log("response:-> " + res1);
  //               //   LogUtils.saveAsExcelFile(res1, 'ImportBrandResult.xlsx');

  //               // }, err => {
  //               //   console.log("error in downloading file content");
  //               // })
  //             }
  //           })


  //         } else {
  //           // handle here the error condition

  //           swal({
  //             title: 'Result',
  //             text: res.message,
  //             type: "error",
  //             showCancelButton: false,
  //             confirmButtonText: 'OK'
  //           })

  //         }


  //       }
  //     }, (err: any) => {
  //       //console.log(err.error.errorMessage);

  //       LogUtils.showLog("upload error response:-> " + err.error);
  //       //alert("error:-> "+err.error);
  //       this.spinner.hide();
  //       swal({
  //         title: 'Result',
  //         text: err.message,
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

}

