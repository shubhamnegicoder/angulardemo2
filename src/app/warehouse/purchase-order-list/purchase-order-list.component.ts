import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from '../../core/services/common.service';
import { AppURLs, APPSETTINGS } from '../../core/interfaces';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';

@Component({
  selector: 'app-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.css']
})
export class PurchaseOrderListComponent implements OnInit {

  pager: any = {};
  pageSize: number = 10;
  pageNo: number;
  totalRecords: number = 0;
  listDetail: Array<any>;
  searchDetail: Array<any>;
  searchCities: Array<any>;
  searchVendors: Array<any>;
  searchWarehouses: Array<any>;
  show: boolean = false;
  data = {
    "status": '',
    "code": '',
    "date": '',
    "vendorId": '',
    "warehouseId": '',
    "regionId": '',
    "cityId": '',
    "sortName": "date",
    "sortType": "desc",
    "pageSize": 10,
    "pageNo": 1
  }

  constructor(private commonService: CommonService,private spinner: NgxSpinnerService) { }

   @ViewChild("state") state:ElementRef;
   @ViewChild("city") city:ElementRef;
   @ViewChild("vendor") vendor:ElementRef;
   @ViewChild("warehouse") warehouse:ElementRef;
   @ViewChild("status") status:ElementRef;
   @ViewChild("PO") po:ElementRef;
   @ViewChild("date") date:ElementRef;

  toggle() {
    this.show = !this.show;
  }


  public optionpage(data) {
    this.pageSize = data.target.value;
    this.data.pageNo = 1
    this.data.pageSize = data.target.value;
    this.getpurchasedList(this.data);
    this.pager = this.commonService.getPager(this.totalRecords, 1, this.pageSize);
  }

  ngOnInit() {
    this.commonService.setTitle('IMS-Warehouse-Purchase Order');
    this.getSearchDataSelector();
    this.getpurchasedList(this.data); 
    setTimeout(() => {
      this.spinner.hide();
  }, 5000);   
  }

  public filteroption(state, city, vendor, warehouse, status, PO, date) {
    // console.log(state, city, vendor, warehouse, status, PO, date,"datatatata");
    this.data.regionId = state;
    this.data.cityId = city;
    this.data.vendorId = vendor;
    this.data.warehouseId = warehouse;
    this.data.status = status;
    this.data.code = PO;
    this.data.date = date;
    this.setPage(1);
    

  }
 public resetfunction(e)
 {
     this.data.regionId=this.state.nativeElement.value=""
     this.data.cityId=this.city.nativeElement.value="";
     this.data.vendorId=this.vendor.nativeElement.value="";
     this.data.warehouseId=this.warehouse.nativeElement.value="";
     this.data.status=this.status.nativeElement.value="";
     this.data.code=this.po.nativeElement.value="";
     this.data.date=this.date.nativeElement.value="";
     this.getpurchasedList(this.data);
 }
  setPage(page: number) {
    this.pageNo = page;
    this.data.pageNo = page;
    this.getpurchasedList(this.data);
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);

  }

  firstPage(page: number) {
    this.pageNo = page;
    this.data.pageNo = page;
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);
  }



  public getpurchasedList(data) {
    this.commonService.postData(APPSETTINGS.ims_url+AppURLs.getPurchaseOrderList,data).subscribe((res:any) => {
      console.log(res, 'listdata');
      this.listDetail = res.model;
      this.totalRecords = res.totalRecord;
      if (data.pageNo == 1)
        this.firstPage(1);
    });

  }

  public getSearchDataSelector() {
    this.commonService.getData(APPSETTINGS.ims_url+AppURLs.getIbsearchData).subscribe(res => {
      console.log(res, 'IBsearchdata');
      this.searchDetail = res.model;
      // this.searchRegion = res.model.regions;
      this.searchCities = res.model.cities;
      this.searchVendors = res.model.vendors;
      this.searchWarehouses = res.model.warehouses;
    });

  }
  public selectdata(data) {
    let stateId = data.target.value;
    this.commonService.getData(APPSETTINGS.ims_url+AppURLs.getcitybystate+stateId).subscribe(res => {
      console.log(res, 'citylistdata');
      this.searchCities = res.model;
    })

  }

  public selectdata2(data) {
    let cityId = data.target.value;
    this.commonService.getData(APPSETTINGS.ims_url+AppURLs.getVendoeWHbycity+cityId).subscribe(res => {
      this.searchVendors = res.model.vendors;
      this.searchWarehouses = res.model.warehouses;
    })

  }

  // method to print pdf

  // printPo(po_id) {
  //   let dataToSend = {
  //     "requestedId": po_id,
  //     "userId": 1
  //   }
  //   this.spinner.show();
  //   this.commonService.printPDF(dataToSend, 'api/Inbound/PrintPO').subscribe(res => {
  //     if (!res.didError) {

  //       if (res.model.filePath != null && res.model.filePath != "") {

  //         let fileName = APP_SETTINGS.printBase_url + res.model.filePath;


  //         let arr = fileName.split("/");
  //         let downloadedFileName = arr[arr.length - 1];
  //         this.downloadService.downloadFile(fileName).subscribe(res => {
  //           if (res) {
  //             LogUtils.saveAsFile(res, downloadedFileName);
  //             this.spinner.hide();
  //           }
  //         });

  //       } else {
  //         this.spinner.hide();
  //       }
  //     } else {
  //       this.spinner.hide();
  //       swal({
  //         title: 'Result',
  //         text: res.message,
  //         type: 'error',
  //         showCancelButton: false,
  //         confirmButtonText: 'OK'
  //       });
  //     }
  //   }, error => {
  //     this.spinner.hide();
  //     swal({
  //       title: 'Result',
  //       text: error.error.errorMessage,
  //       type: 'error',
  //       showCancelButton: false,
  //       confirmButtonText: 'OK'
  //     });
  //   });
  // }

}

