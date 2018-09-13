import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../core/services/common.service';
import { AppURLs } from '../../core/interfaces';
import { APPSETTINGS } from '../../core/interfaces';
import { StateListModal } from '../../core/interfaces';


@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent implements OnInit {

  pager: any = {};
  pageSize: number = 10;
  pageNo: number;
  totalRecords: number = 0;
  listDetail: Array<any>;
  stateList: Array<any> = [];
  countryList: Array<any> = [];
  show: boolean = false;
  editList: StateListModal = { code: '', countryId: '', countryName: '', id: '', isActive: '', name: '' };
  selectedState: any;
  type_val: any = '';
  fileToUpload: any;
  data = {
    "code": "",
    "status": "",
    "name": "",
    "userId": "1",
    "parentId": "",
    "sortName": "name",
    "sortType": "desc",
    "pageSize": 10,
    "pageNo": 1
  };

  dataForStateCreation = {
    "id": "",
    "name": "",
    "status": "",
    "userId": "1",
    "code": "",
    "parentId": ""
  };


  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeBtn1') closeBtn1: ElementRef;
  @ViewChild('stateCode') stateCode: ElementRef;
  @ViewChild('stateName') stateName: ElementRef;
  @ViewChild('countryy') countryy: ElementRef;
  @ViewChild('closeBtn2') closeBtn2: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('code') code: ElementRef;
  @ViewChild('name') name: ElementRef;
  @ViewChild('country') country: ElementRef;
  @ViewChild('status') status: ElementRef;

  //call this wherever you want to close modal
  private closeModal(): void {
    // this.stateCode.nativeElement.value='';
    // this.stateName.nativeElement.value='';
    // this.countryy.nativeElement.value='';

    this.closeBtn.nativeElement.click();
  }

  private closeModal1(): void {
    this.closeBtn1.nativeElement.click();
  }
  public resetfunction() {
    this.data.code = this.code.nativeElement.value = ""
    this.data.name = this.name.nativeElement.value = ""
    this.data.parentId = this.country.nativeElement.value = ""
    this.data.status = this.status.nativeElement.value = ""
    this.getStateList(this.data);
  }
  private closeModal2(): void {
    this.fileInput.nativeElement.value = '';
    this.closeBtn2.nativeElement.click();
  }

  constructor(private spinner: NgxSpinnerService, private commonService: CommonService) { }



  toggle() {
    this.show = !this.show;
  }


  public optionpage(data) {
    this.pageSize = data.target.value;
    this.data.pageNo = 1
    this.data.pageSize = data.target.value;
    this.getStateList(this.data);
    this.pager = this.commonService.getPager(this.totalRecords, 1, this.pageSize);
  }

  ngOnInit() {
    this.commonService.setTitle('UVM-Location-State');
    this.getSearchDataSelector();
    this.getStateList(this.data);
  }
  public getSearchDataSelector() {
    this.commonService.getData(APPSETTINGS.ims_url + AppURLs.getCountryalllist).subscribe((res: any) => {
      this.countryList = res.model;
      console.log("data:-> " + JSON.stringify(this.countryList));
    });

  }

  public filteroption(code, name, country, status) {
    console.log(code, name, country, status, "datatatata");
    this.data.status = status;
    this.data.name = name;
    this.data.code = code;
    this.data.parentId = country;

    // this.setPage(1);
    console.log("data in filter:-> " + JSON.stringify(this.data));
    //console.log("country data:-> " + JSON.stringify(this.countryList));

    this.getStateList(this.data);

  }

  setPage(page: number) {
    this.pageNo = page;
    this.data.pageNo = page;
    this.getStateList(this.data);
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);

  }

  firstPage(page: number) {
    this.pageNo = page;
    this.data.pageNo = page;
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);
  }



  public getStateList(data) {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 5000);

    console.log(JSON.stringify(data) + '  in brand');
    this.commonService.postData(APPSETTINGS.ims_url + AppURLs.getState, data).subscribe((res: any) => {
      console.log('brandlist data received:-> ', res);
      this.spinner.hide();
      this.listDetail = res.model;
      this.totalRecords = res.totalRecord;
      // console.log('brandlist data received:-> '+this.listDetail.length);
      if (data.pageNo == 1)
        this.firstPage(1);
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });

  }

  inputValidation(): string {

    let msg = "";
    if (this.dataForStateCreation.code === "") {
      msg = "Code is Mandatory"
    } else if (this.dataForStateCreation.name === "") {
      msg = "Name is Mandatory"
    } else if (this.dataForStateCreation.parentId === "") {
      msg = "Country is Mandatory"
    }

    return msg;
  }

  createState(stateCode, stateName, countryId) {
    console.log("state to be created:-> " + stateCode, stateName, countryId);
    //need to call the service from here to create brand.\

    this.dataForStateCreation.code = stateCode;
    this.dataForStateCreation.parentId = countryId;
    this.dataForStateCreation.name = stateName;
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
      this.commonService.postData(APPSETTINGS.ims_url + AppURLs.createState, this.dataForStateCreation).subscribe((response: any) => {

        this.spinner.hide();
        console.log("response received:-> " + response.model);
        if (response.didError == false)
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
            if (response.didError == true && result.value === true) {
              // this.removeModal();
            } else {
              this.getStateList(this.data);
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
        //swal("Error in processing your request.");
        this.spinner.hide();
        this.commonService.handleError(error);

      });
    }
  }



  editClicked(id) {
    console.log("selected row id:-> " + id);
    this.listDetail.map((item, key) => {
      // //console.log(item, 'item');

      if (item.id === id) {
        this.selectedState = item;
        //   //console.log(this.callOneList, 'ooooooooooooooo');
        this.editList.id = this.selectedState.id;
        this.editList.code = this.selectedState.code;
        this.editList.name = this.selectedState.name;
        this.editList.countryId = this.selectedState.countryId;
        this.editList.countryName = this.selectedState.countryName;
        this.editList.isActive = this.selectedState.isActive;

      }


    });
  }

  editState() {
    console.log("brand to be edited:-> " + this.editList.code, this.editList.name, this.editList.countryId);
    //need to call the service from here to create brand.
    this.dataForStateCreation.name = this.editList.name;
    this.dataForStateCreation.id = this.editList.id;
    this.dataForStateCreation.status = this.editList.isActive;
    this.dataForStateCreation.code = this.editList.code;
    this.dataForStateCreation.parentId = this.editList.countryId;
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
      console.log("data to update:-> " + this.dataForStateCreation.name, this.dataForStateCreation.id, this.dataForStateCreation.status);
      this.spinner.show();
      this.commonService.putData(APPSETTINGS.ims_url + AppURLs.createState, this.dataForStateCreation).subscribe((response: any) => {
        this.spinner.hide();
        console.log("response received:-> " + response.model);
        if (response.model.statusMessage === 'Successfully Updated')
          this.type_val = 'success';
        else
          this.type_val = 'warning';


        if (!response.didError) {
          // success case
          if (response.model.statusMessage === 'Successfully Updated') {
            // here handle success case
            this.closeModal1();
          } else {
            //here handle already exist case
            // alert(response.model.statusMessage);
          }

          swal({
            title: 'Result',
            text: response.model.statusMessage,
            type: this.type_val,
            showCancelButton: false,
            confirmButtonText: 'OK'
          }).then((result) => {
            console.log("result value:->" + result.value);
            if (response.model.statusMessage !== 'Successfully Updated' && result.value === true) {
              // this.removeModal();
              //alert("ok pressed & if executed")
            } else {
              // alert("ok pressed & else executed")
              this.getStateList(this.data);
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


  changeStatus(id) {

    let currentStatus;
    this.listDetail.filter(item => {
      if (item.id == id)
        currentStatus = item.isActive;
    })

    let msg = "You want to Activate this State?"
    let statusToShow = "Successfully Activated State..!!"
    if (currentStatus === 1) {
      msg = "You want to Deactivate this State?"
      statusToShow = "Successfully Deactivated State..!!"
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
        this.commonService.deleteData(APPSETTINGS.ims_url + 'api/Region?Id=' + id + '&Status=' + currentStatus).subscribe((res: any) => {

          console.log("response received change status service:-> " + JSON.stringify(res));
          this.spinner.hide();
          if (!res.didError) {
            // alert("changed successfully");
            this.getStateList(this.data);
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
          this.commonService.handleError(err);
          this.spinner.hide();
        });
      }
    });

  }



  // importAsXLSX() {

  //   const fi = this.fileInput.nativeElement;
  //   if (fi.files && fi.files[0]) {
  //     this.fileToUpload = fi.files[0];
  //   }
  //   if (this.fileToUpload) {
  //     this.spinner.show();
  //     this.importExcelService.uploadBrand(this.fileToUpload, 1, 'api/Region/Import').subscribe(res => {
  //       this.spinner.hide();
  //       if (res) {
  //         // show swal showing total number of records uploaded
  //         // and download file from url
  //         if (!res.didError) {

  //           this.closeModal2();
  //           let msgToDisplay = res.model.successCount + '  out of ' + res.model.totalCount + '  Records imported successfully.';

  //           swal({
  //             title: '',
  //             text: msgToDisplay,
  //             type: "success",
  //             showCancelButton: false,
  //             confirmButtonText: 'OK',
  //             footer: '<a href="http://103.12.132.77:6002/' + res.model.filePath + '" download="test.xls">click here to download details</a>'
  //           }).then((result) => {
  //             if (res.model.filePath !== null && res.model.filePath) {
  //               this.getStateList(this.data);
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
  //             title: '',
  //             text: res.message,
  //             type: "warning",
  //             showCancelButton: false,
  //             confirmButtonText: 'OK'
  //           })

  //         }


  //       }
  //     }, (err: any) => {
  //       //console.log(err.error.errorMessage);
  //       this.spinner.hide();
  //       LogUtils.showLog("upload error response:-> " + err.error);
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



}
