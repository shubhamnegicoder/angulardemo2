import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { ImportService } from '../Core/import.service';
// import { DownloadService } from '../Core/download.service';
// import { PageService } from '../Core/page.service';
// import { BrandService } from '../Core/brand.service';
import { Router } from '@angular/router';
// import { LogUtils } from '../log-utils';
import swal from 'sweetalert2';
// import { CountryService } from '../Core/country.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../core/services/common.service';
import { AppURLs } from '../../core/interfaces';
import { APPSETTINGS } from '../../core/interfaces';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
  pager: any = {};
  pageSize: number = 10;
  pageNo: number;
  totalRecords: number = 0;
  listDetail: Array<any>;
  searchDetail: Array<any>;
  searchCities: Array<any>;
  searchVendors: Array<any>;
  searchWarehouses: Array<any>;
  editList = {
    "code": "",
    "id": "",
    "name": "",
    "isActive": ""
  };
  data = {
    "code": "",
    "status": "",
    "name": "",
    "parentId": "",
    "sortName": "name",
    "sortType": "desc",
    "pageSize": 10,
    "pageNo": 1
  };

  show: boolean = false;
  type_val: any = "";
  dataForCountryCreation = {
    "id": "",
    "name": "",
    "status": "",
    "code": "",
    "parentId": ""
  };


  dataForUpdateBrand = {
    "id": "",
    "name": "",
    "status": "",
    "userId": "1",
    "isList": "0"
  }
  fileToUpload: any;
  countryName: string = '';
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeBtn1') closeBtn1: ElementRef;
  @ViewChild('closeBtn2') closeBtn2: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('F1') F1: any;
  @ViewChild('name') name: ElementRef
  @ViewChild('status') status: ElementRef
  //call this wherever you want to close modal
  private closeModal(): void {
    //this.brand.nativeElement.value = '';
    this.resetDataArr();
    this.F1.form.markAsPristine();
    this.closeBtn.nativeElement.click();
  }

  public resetfunction() {
    this.data.name = this.name.nativeElement.value = ""
    this.data.status = this.status.nativeElement.value = ""
    this.getCountryList(this.data)
  }
  resetDataArr() {
    this.dataForCountryCreation = {
      "id": "",
      "name": "",
      "status": "",
      "code": "",
      "parentId": ""
    }

  }

  private closeModal1(): void {
    this.closeBtn1.nativeElement.click();
  }

  private closeModal2(): void {
    this.fileInput.nativeElement.value = '';
    this.closeBtn2.nativeElement.click();
  }

  constructor(private commonService: CommonService,
    private router: Router, private spinner: NgxSpinnerService) { }

  toggle() {
    this.show = !this.show;
  }


  public optionpage(data) {
    this.pageSize = data.target.value;
    this.data.pageNo = 1;
    this.data.pageSize = data.target.value;
    this.getCountryList(this.data);
    this.pager = this.commonService.getPager(this.totalRecords, 1, this.pageSize);
  }

  ngOnInit() {
    this.commonService.setTitle('UVM-Location-Country');
    this.getCountryList(this.data);
    console.log("brand page called");

    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
  }

  public filteroption(status, name) {
    console.log(status, name, "datatatata");
    this.data.status = status;
    this.data.name = name;

    this.setPage(1);
    console.log("data:-> " + this.data.status, this.data.name, this.data.sortName);
    this.getCountryList(this.data);

  }

  setPage(page: number) {
    this.pageNo = page;
    this.data.pageNo = page;
    this.getCountryList(this.data);
    this.pager = this.commonService.getPager(this.totalRecords, 1, this.pageSize);

  }

  firstPage(page: number) {
    this.pageNo = page;
    this.data.pageNo = page;
    this.pager = this.commonService.getPager(this.totalRecords, 1, this.pageSize);
  }



  public getCountryList(data) {
    console.log(JSON.stringify(data) + '  in brand');
    this.spinner.show();
    this.commonService.postData(APPSETTINGS.ims_url + AppURLs.getCountryList, data).subscribe((res: any) => {
      this.spinner.hide();
      console.log('countryList data received:-> ', res.model);
      this.listDetail = res.model;
      this.totalRecords = res.totalRecord;
      console.log('brandlist data received:-> ' + this.listDetail.length);
      if (data.pageNo == 1) {
        this.firstPage(1);
      }
    }, err => {
      { this.commonService.handleError(err); }
      this.spinner.hide();
    });


  }

  inputValidation(): string {

    let msg = "";
    if (this.dataForCountryCreation.code === "") {
      msg = "Code is Mandatory"
    } else if (this.dataForCountryCreation.name === "") {
      msg = "Name is Mandatory"
    }

    return msg;
  }


  createCountry(countryCode, countryName) {
    console.log("brand to be created:-> " + countryName);
    //need to call the service from here to create brand.
    this.dataForCountryCreation.name = countryName;
    this.dataForCountryCreation.code = countryCode;

    const msg = this.inputValidation();
    if (msg != "") {

      swal({
        title: '',
        text: msg,
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'OK'
      });
    } else {
      console.log("data name:-> " + JSON.stringify(this.dataForCountryCreation));
      this.spinner.show();
      this.commonService.postData(APPSETTINGS.ims_url + AppURLs.createCountry, this.dataForCountryCreation).subscribe((response: any) => {
        this.spinner.hide();
        console.log("response received:-> " + response);
        if (response.didError === false)
          this.type_val = 'success';
        else
          this.type_val = 'warning';
        if (!response.didError) {
          // success case

          this.closeModal();
          swal({
            title: 'Result',
            text: response.model.statusMessage,
            type: this.type_val,
            showCancelButton: false,
            confirmButtonText: 'OK'
          }).then((result) => {
            console.log("result value:->" + result.value);
            if (response.didError === true && result.value === true) {
              // this.removeModal();
            } else {
              // alert("ok pressed & else executed")
              this.getCountryList(this.data);
            }
          });



        } else {
          swal({
            title: 'Result',
            text: response.message,
            type: this.type_val,
            showCancelButton: false,
            confirmButtonText: 'OK'
          });
        }

      }, error => {
        { this.commonService.handleError(error); }
        this.spinner.hide();
      });
    }
  }


  hideModal() {
    this.closeModal();
  }

  editCountry() {

    this.dataForCountryCreation.name = this.editList.name;
    this.dataForCountryCreation.id = this.editList.id;
    this.dataForCountryCreation.status = this.editList.isActive;
    this.dataForCountryCreation.code = this.editList.code;



    console.log("data to update:-> " + JSON.stringify(this.dataForCountryCreation));

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
      this.commonService.putData(APPSETTINGS.ims_url + AppURLs.createCountry, this.dataForCountryCreation).subscribe((response: any) => {

        this.spinner.hide();
        console.log("response received edit:-> " + response.model);
        if (response.didError === false)
          this.type_val = 'success';
        else
          this.type_val = 'warning';


        if (!response.didError) {
          // success case

          this.closeModal1();


          swal({
            title: 'Result',
            text: response.model.statusMessage,
            type: this.type_val,
            showCancelButton: false,
            confirmButtonText: 'OK'
          }).then((result) => {
            console.log("result value:->" + result.value);
            if (response.didError === true && result.value === true) {
              // this.removeModal();
              //alert("ok pressed & if executed")
            } else {
              // alert("ok pressed & else executed")
              this.getCountryList(this.data);
            }
          });



        } else {
          swal({
            title: 'Result',
            text: response.message,
            type: this.type_val,
            showCancelButton: false,
            confirmButtonText: 'OK'
          });
        }

      }, error => {
        { this.commonService.handleError(error); }
        this.spinner.hide();
      });
    }
  }
  editClicked(id) {
    console.log("selected row id:-> " + id);
    this.listDetail.map((item, key) => {
      // //console.log(item, 'item');

      if (item.id === id) {
        this.editList = item;
        //   //console.log(this.callOneList, 'ooooooooooooooo');


      }
    });
  }

  // importAsXLSX() {
  //   const fi = this.fileInput.nativeElement;
  //   if (fi.files && fi.files[0]) {
  //     this.fileToUpload = fi.files[0];
  //   }
  //   if (this.fileToUpload) {
  //     alert("import called");
  //     this.spinner.show();
  //     this.commonService.uploadBrand(this.fileToUpload, 1, 'api/Country/Import').subscribe((res: any) => {
  //       alert("upload brand response:-"+JSON.stringify(res));
  //       this.spinner.hide();
  //       if (res) {
  //         alert('second');
  //         this.fileToUpload = "";
  //         // show swal showing total number of records uploaded
  //         // and download file from url
  //         if (!res.didError) {
  //           alert('third');
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
  //               this.getCountryList(this.data);

  //             }
  //           });


  //         } else {
  //           // handle here the error condition

  //           swal({
  //             title: '',
  //             text: res.message,
  //             type: "warning",
  //             showCancelButton: false,
  //             confirmButtonText: 'OK'
  //           })

  //         }


  //       }
  //     }, (err: any) => {
  //       alert(JSON.stringify(err));
  //       //console.log(err.error.errorMessage);
  //       this.spinner.hide();
  //       //alert("error:-> "+err.error);

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


  changeStatus(id) {

    let currentStatus;
    this.listDetail.filter(item => {
      if (item.id == id)
        currentStatus = item.isActive;
    })

    let msg = "You want to Activate this Country?"
    let statusToShow = "Successfully Activated Country..!!"
    if (currentStatus === 1) {
      msg = "You want to Deactivate this Country?"
      statusToShow = "Successfully Deactivated Country..!!"
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
          "userId": 1,
          "status": currentStatus
        }
        this.spinner.show();
        this.commonService.deleteData(APPSETTINGS.ims_url + 'api/Country?Id=' + id + '&Status=' + currentStatus).subscribe((res: any) => {

          console.log("response received change status service:-> " + JSON.stringify(res));
          this.spinner.hide();
          if (!res.didError) {
            // alert("changed successfully");
            this.getCountryList(this.data);
            swal(
              'Info',
              statusToShow,
              'success'
            );
          } else {
            //alert("issue in changing status");

            swal(
              'Info',
              res.message,
              'warning'
            );
          }
        }, err => {
          {this.commonService.handleError(err); }

          this.spinner.hide();
        });
      }
    });

  }


}
