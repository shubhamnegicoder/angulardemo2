import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from '../../core/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppURLs, APPSETTINGS } from '../../core/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-warehouselist',
  templateUrl: './warehouselist.component.html',
  styleUrls: ['./warehouselist.component.css']
})
export class WarehouselistComponent implements OnInit {
  pager: any = {};
  pageSize: number=10;
  pageNo: number;
  totalRecords: number=0;
  listDetail: Array<any>;
  searchDetail: Array<any>;
  searchCities: Array<any>;
  show: boolean = false;
  data = {
    "name": "",
    "isActive": "",
    "regionId": "",
    "cityId": "",
    "sortName": "name",
    "sortType": "desc",
    "pageSize": 10,
    "pageNo": 1
  }
  fileToUpload: any;
 
  @ViewChild("state") state:ElementRef;
  @ViewChild("city") city:ElementRef;
  @ViewChild("status") status:ElementRef;
  @ViewChild("Name") name:ElementRef;
 @ViewChild('fileInput') fileInput: ElementRef;
 @ViewChild('closeBtn2') closeBtn2: ElementRef;

  constructor(private spinner: NgxSpinnerService, private commonService: CommonService) { }

  ngOnInit() {
    this.commonService.setTitle('IMS-Warehouse');
    this.getAllWarehouse();
    this.getSearchDataSelector();
     setTimeout(() => {
      this.spinner.hide();

    }, 5000);
  }
  public resetfunction() {
    this.data.cityId=this.city.nativeElement.value=""
    this.data.regionId=this.state.nativeElement.value=""
    this.data.isActive=this.status.nativeElement.value=""
    this.data.name=this.name.nativeElement.value=""
    this.getAllWarehouse();
  }
  public optionpage(data) {
    this.pageSize = data.target.value;
    this.data.pageNo = 1;
    this.data.pageSize = data.target.value;
    this.getAllWarehouse();
    this.pager = this.commonService.getPager(this.totalRecords, 1, this.pageSize);
  }
  setPage(page: number) {
    this.pageNo = page;
    this.data.pageNo = page;
    this.getAllWarehouse();
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);

  }

  firstPage(page: number) {
    this.pageNo = page;
    this.data.pageNo = page;
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);
  }
  toggle() {
    this.show = !this.show;
  }
  getAllWarehouse() {
    this.spinner.show();
    this.commonService.postData(APPSETTINGS.ims_url + AppURLs.getWarehouseList, this.data).subscribe((res: any) => {
      this.spinner.hide();
      if (!res.didError) {
        this.listDetail = res.model;
        this.totalRecords = res.totalRecord;
        if (this.data.pageNo === 1) {
          this.firstPage(1);
        }
        if (this.listDetail === null) {
          swal({
            'type': 'warning',
            'text': res.message,
            'showConfirmButton': true
          });
        }
      } else {
        swal({
          'type': 'warning',
          'text': res.message,
          'showConfirmButton': true
        });
      }
    }, error => {
      this.spinner.hide();
     this.commonService.handleError(error);
    });
  }

  changeStatus(id) {

    let currentStatus;
    this.listDetail.filter(item => {
      if (item.id == id)
        currentStatus = item.isActive;
    })
    // alert("row status clicked:-> "+id);

    let msg = "You want to Activate this Warehouse?"
    let statusToShow = "Successfully Activated Warehouse..!!"
    if (currentStatus === 1) {
      msg = "You want to Deactivate this Warehouse?"
      statusToShow = "Successfully Deactivated Warehouse..!!"
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
          "status": currentStatus
        }

        this.commonService.deleteData(APPSETTINGS.ims_url+'/api/Warehouse?Id='+id+'&Status='+currentStatus).subscribe((res: any) => {
          if (!res.didError) {
            // alert("changed successfully");
            this.getAllWarehouse();
            swal(
              'Info',
              statusToShow,
              'success'
            )
          } else {
            //alert("issue in changing status");

            swal(
              'Info',
              res.errorMessage,
              'warning'
            )
          }
        }, err => {
          this.commonService.handleError(err);
        });
      }
    })

  }

  importAsXLSX() {

    const fi = this.fileInput.nativeElement;
    if (fi.files && fi.files[0]) {
      this.fileToUpload = fi.files[0];
    }
    if (this.fileToUpload) {
      this.commonService.uploadBrand(this.fileToUpload, 1, APPSETTINGS.ims_url + AppURLs.importWarehouse).subscribe(res => {

        if (res) {
          this.fileToUpload = "";
          // show swal showing total number of records uploaded
          // and download file from url
          if (!res.didError) {

            // this.closeModal2();
            let msgToDisplay = res.model.successCount + '  out of ' + res.model.totalCount + ' total Records imported successfully.';

            swal({
              title: 'Result',
              text: msgToDisplay,
              type: "success",
              showCancelButton: false,
              confirmButtonText: 'OK',
              footer: '<a href="http://103.12.132.77:6002/' + res.model.filePath + '" >click here to download details</a>'
            }).then((result) => {
              if (res.model.filePath !== null && res.model.filePath) {
                this.getAllWarehouse();
                // this.downloadService.downloadFile(res.model.filePath).subscribe(res1 => {
                //   console.log("response:-> " + res1);
                //   LogUtils.saveAsExcelFile(res1, 'ImportBrandResult.xlsx');

                // }, err => {
                //   console.log("error in downloading file content");
                // })
              }
            })


          } else {
            // handle here the error condition

            swal({
              title: '',
              text: res.message,
              type: "warning",
              showCancelButton: false,
              confirmButtonText: 'OK'
            })

          }


        }
      }, (err: any) => {
        this.commonService.handleError(err);
      });
    } else {
      swal({
        title: '',
        text: 'Please select a file..!!',
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'OK'
      });
    }
  }
  public getSearchDataSelector() {
       this.commonService.getData(APPSETTINGS.ims_url + AppURLs.InboundDetails).subscribe((res: any) => {
      if (res.didError === false) {
        this.searchDetail = res.model;
         this.searchCities = res.model.cities;
      } else {
        swal({
          text: 'Error in processing the request',
          type: 'warning',
          showConfirmButton: true
        });
      }
    }, err => {
      //console.log(res, 'statedata');
      this.commonService.handleError(err);
    });
    }

 public selectdata(data) {
    let state = data.target.value;
    this.commonService.getData(APPSETTINGS.ims_url + AppURLs.getcitybystate + state).subscribe((res: any) => {
      if (res.didError === false) {
          this.searchCities = res.model.cities;
      } else {
        swal({
          text: 'Error in processing the request',
          type: 'warning',
          showConfirmButton: true
        });
      }
    }, err => {
      //console.log(res, 'statedata');
      this.commonService.handleError(err);
    });
    }
  
  
  public searchDetails(Name,state, city, status) {
    this.data.regionId = state;
    this.data.cityId = city;
    this.data.isActive = status;
    this.data.name = Name;
    this.getAllWarehouse();
  }


}

