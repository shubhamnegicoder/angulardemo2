import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from '../core/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup } from '@angular/forms';
import swal from 'sweetalert2';
import { APPSETTINGS, AppURLs } from '../core/interfaces';
import { DatePipe } from '../../../node_modules/@angular/common';

@Component({
  selector: 'app-grn',
  templateUrl: './grn.component.html',
  styleUrls: ['./grn.component.css']
})
export class GrnComponent implements OnInit {
  filterForm = FormGroup;
  searchList: Array<any> = [];
  searchForm: FormGroup;
  searchDetail: Array<any> = [];
  warehouseList: Array<any> = [];
  vendorList: Array<any> = [];
  stateList: Array<any> = [];
  pager: any = {};
  pageSize: number = 10;
  pageNo: number;
  totalRecords: number = 0;
  trigger: boolean = false;
  grnList: Array<any> = [];
  cityList: Array<any> = [];
  callComponent: boolean = false;
  grnData = {
    "status": "",
    "code": "",
    "invoiceNo": "",
    "date": "",
    "vendorId": "",
    "warehouseId": "",
    "regionId": "",
    "cityId": "",
    "sortName": "date",
    "sortType": "desc",
    "pageSize": 10,
    "pageNo": 1
  };
  filterData = {
    'date1': '',
    'grnCode': '',
    'invoiceNo': '',
    'status': '',
    'warehouse': '',
    'vendor': '',
    'city': '',
    'state': ''
  };
  buttonClick: boolean = false;
  constructor(private commonService: CommonService, private spinner: NgxSpinnerService) { }
  @ViewChild("state") state: ElementRef;
  @ViewChild("city") city: ElementRef;
  @ViewChild("vendor") vendor: ElementRef;
  @ViewChild("warehouse") warehouse: ElementRef;
  @ViewChild("status") status: ElementRef;
  @ViewChild("grnCode") grncode: ElementRef;
  @ViewChild("date1") filterdate: ElementRef;
  @ViewChild("invoiceNo") invoiceno: ElementRef;

  ngOnInit() {
    this.commonService.setTitle('UVM-Warehouse-Inbound-GRN');
    this.getSearchDataSelector();
    this.getGrnList(this.grnData);
    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
  }


  /****************************  Function To List All The GRN Data  ******************************/

  public resetfunction() {
    this.grnData.cityId = this.city.nativeElement.value = "";
    this.grnData.regionId = this.state.nativeElement.value = "";
    this.grnData.vendorId = this.vendor.nativeElement.value = "";
    this.grnData.warehouseId = this.warehouse.nativeElement.value = "";
    this.grnData.status = this.status.nativeElement.value = "";
    this.grnData.code = this.grncode.nativeElement.value = "";
    this.grnData.date = this.filterdate.nativeElement.value = "";
    this.grnData.invoiceNo = this.invoiceno.nativeElement.value = "";
    this.getGrnList(this.grnData);

  }

  public getGrnList(data) {
    this.spinner.show();
    return this.commonService.postData(APPSETTINGS.ims_url + AppURLs.getGrnList, data).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.didError === false) {
          this.grnList = res.model;
          if (res.model.status === 1) {
            this.buttonClick = false;
          }
          if (res.model.status != 1) {
            this.buttonClick = true;
          }
          this.totalRecords = res.totalRecord;
          if (data.pageNo == 1)
            this.firstPage(1);
        }
        else {
          swal({ type: 'warning', text: "Error in processing the request", showConfirmButton: true });
        }
      }, err => {
        this.spinner.hide();
        this.commonService.handleError(err);
      });
  }


  /******************Function to change the page size *******************/

  public optionpage(data) {
    this.pageSize = data.target.value;
    this.grnData.pageNo = 1
    this.grnData.pageSize = data.target.value;
    this.getGrnList(this.grnData);
    this.pager = this.commonService.getPager(this.totalRecords, 1, this.pageSize);
  }


  /****************************  Function To Select Data in Filter To Search For First Time  ******************************/
  public getSearchDataSelector() {
    this.commonService.getData(APPSETTINGS.ims_url + AppURLs.getIbsearchData).subscribe((res: any) => {
      if (res.didError === false) {
        this.searchDetail = res.model;
        this.stateList = res.model.regions;
        this.cityList = res.model.cities;
        this.vendorList = res.model.vendors;
        this.warehouseList = res.model.warehouses;
      }
      else {
        // swal({ type: 'warning', text: "Error in processing the request", showConfirmButton: true });
      }
    }, err => {
      // swal({ type: 'error', text: err.error.errorMessage, showConfirmButton: true });
    });

  }


  /****************************  Function To Trigger The Filter Form  ******************************/
  public filterTrigger() {
    this.trigger = !this.trigger;
  }


  /****************************  Function To Set The Page  ******************************/
  public setPage(page: number) {
    if (page > 0) {
      // alert(page);
      this.pageNo = page;
      this.grnData.pageNo = page;
      this.getGrnList(this.grnData);
      this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);
    }
  }


  /****************************  Function To Set The First Page  ******************************/
  public firstPage(page: number) {
    this.pageNo = page;
    this.grnData.pageNo = page;
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);
  }


  /****************************  Function To Get City By State  ******************************/
  public selectCity(data) {
    let cityId = data.target.value;
    this.commonService.postData(APPSETTINGS.ims_url + AppURLs.getVendoeWHbycity, cityId).subscribe((res: any) => {
      if (res.didError === false) {
        let msg: string = '';
        if (res.model.vendors === null || res.model.vendors.length === 0) {
          msg = 'No Vendors Found For This City';
          this.vendorList = [];
          this.warehouseList = res.model.warehouses;
        }
        if (res.model.warehouses === null || res.model.warehouses.length === 0) {
          msg = 'No Warehouses Found For This City';
          this.vendorList = res.model.vendors;
          this.warehouseList = [];
        }
        if (res.model.vendors === null || res.model.vendors.length === 0 && res.model.warehouses === null || res.model.warehouses.length === 0) {
          msg = 'No Vendors And Warehouses Found For This City';
          this.vendorList = [];
          this.warehouseList = [];
        }
        if (msg != '') {
          swal({ type: 'warning', text: msg, showConfirmButton: true });
        } else {
          this.vendorList = res.model.vendors;
          this.warehouseList = res.model.warehouses;
        }
      }
    });

  }


  /****************************  Function To Get State In Filter ******************************/
  public selectState(data) {
    let stateId = data.target.value;
    this.commonService.getData(APPSETTINGS.ims_url + AppURLs.getCities + stateId).subscribe((res: any) => {
      if (res.didError === false) {
        if (res.model.length === 0) {
          swal({ type: 'warning', text: 'No Cities Found For This State', showConfirmButton: true });
          this.cityList = [];
          this.vendorList = [];
          this.warehouseList = [];
        } else {
          this.cityList = res.model;
        }

      } else {
        // swal({ type: 'warning', text: "Error in processing the request", showConfirmButton: true });
      }
    }, err => {
      // swal({ type: 'error', text: err.error.errorMessage, showConfirmButton: true });
    }
    );
  }


  /****************************  Function To Search  ******************************/
  public searchDetails(state, city, vendor, warehouse, status, invoiceNo, grnCode, date) {
    var datePipe = new DatePipe("en-US");
    let value = datePipe.transform(date, 'yyyy-MM-dd');
    this.grnData = {
      "status": status,
      "code": grnCode,
      "invoiceNo": invoiceNo,
      "date": value,
      "vendorId": vendor,
      "warehouseId": warehouse,
      "regionId": state,
      "cityId": city,
      "sortName": "date",
      "sortType": "desc",
      "pageSize": 10,
      "pageNo": 1
    };
    this.spinner.show();
    this.commonService.postData(APPSETTINGS.ims_url + AppURLs.getGrnList, this.grnData).subscribe((res: any) => {
      this.spinner.hide();
      if (res.didError === false) {
        this.setPage(1);
      } else {
        swal({ type: 'warning', text: "No Records Found For This Search", showConfirmButton: true });
      }
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }


  /****************************  Function To Print GRN as Pdf  ******************************/
  public printGrnPdf(grnId) {
    let dataToSend = {
      "requestedId": grnId,
      "userId": 1
    }
    this.spinner.show();
    this.commonService.printPDF(dataToSend, 'api/Inbound/PrintGRN').subscribe(res => {
      if (!res.didError) {

        if (res.model.filePath != null && res.model.filePath != "") {

          let fileName = APPSETTINGS.printBase_url + res.model.filePath;


          let arr = fileName.split("/");
          let downloadedFileName = arr[arr.length - 1];
          this.commonService.downloadFile(fileName).subscribe(res => {
            if (res) {
              this.commonService.saveAsFile(res, downloadedFileName);
              this.spinner.hide();
            }
          });

        } else {
          this.spinner.hide();
        }
      } else {
        this.spinner.hide();
        swal({
          title: 'Result',
          text: res.message,
          type: 'warning',
          showCancelButton: false,
          confirmButtonText: 'OK'
        });
      }
    }, error => {
      this.spinner.hide();
      swal({
        title: 'Result',
        text: error.error.errorMessage,
        type: 'error',
        showCancelButton: false,
        confirmButtonText: 'OK'
      });
    });
  }

}
