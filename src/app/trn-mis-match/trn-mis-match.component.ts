import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { trnmismatch, APPSETTINGS, AppURLs } from '../core/interfaces';
import { CommonService } from '../core/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';

@Component({
  selector: 'app-trn-mis-match',
  templateUrl: './trn-mis-match.component.html',
  styleUrls: ['./trn-mis-match.component.css']
})
export class TrnMisMatchComponent implements OnInit {
  trigger: boolean = false;
  fromLocation: Array<trnmismatch> = [];
  toLocation: Array<trnmismatch> = [];
  trnmismatchList: Array<trnmismatch> = [];
  trnmismatchListArr: Array<any> = [];
  trnmismatchListArrLength: number = 0;
  pageSize: number = 10;
  totalRecords: number = 0;
  pager: any = {};
  pageNo: number = 1;
  data = {
    "status": "",
    "code": "",
    "date": "",
    "fromLocationId": "",
    "toLocationId": "",
    "transferType": "",
    "fromDate": "",
    "toDate": "",
    "sortName": "date",
    "sortType": "desc",
    "pageSize": 10,
    "pageNo": 1
  }
  @ViewChild('fromLoc') fromLoc: ElementRef;
  @ViewChild('toLoc') toLoc: ElementRef;
  constructor(private commonService: CommonService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.commonService.setTitle('UVM-Reports-TRNMismatch');
    this.getLocationsInFilter();
    this.trnMismatchList(this.data);
    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
  }

  /****************************  Function To Trigger The Filter  ******************************/
  public filterTrigger() {
    this.trigger = !this.trigger;
  }   


  /****************************  Function To Get The List Of Locations In Filter  ******************************/
  public getLocationsInFilter() {
    this.commonService.getData(APPSETTINGS.ims_url+AppURLs.trnMismatchLocations).subscribe((res:any) => {
      if (res.didError === false) {
        let msg: string = '';
        if(res.model.fromLocations === null || res.model.fromLocations.length === 0){
         msg = 'No From Locations Found';
        }
        if(res.model.toLocations === null || res.model.toLocations === 0){
          msg = 'No To Locations Found';
        }
        if(msg != ''){
          swal({type: 'warning',text: msg, showConfirmButton: true});
        } else {
            this.fromLocation = res.model.fromLocations;
            this.toLocation = res.model.toLocations;
        }
      }
    }
    );
  }


public resetfunction()
{
  this.data.fromLocationId=this.fromLoc.nativeElement.value=""
  this.data.toLocationId=this.toLoc.nativeElement.value="";
  this.trnMismatchList(this.data);
}
  /****************************  Function To Get The List Of TRN Mismatch  ******************************/
  public trnMismatchList(data) {
    this.spinner.show();
    this.commonService.postData(APPSETTINGS.ims_url+AppURLs.trnMismatchList,data).subscribe((res:any) => {
      this.spinner.hide();
      if (res.didError === false) {
        this.totalRecords = res.totalRecord;
        this.trnmismatchList = res.model;
        for (let i = 0; i < res.model.length; i++) {
          this.trnmismatchListArrLength = res.model[i].transferReceiptNoteDetailViewModels.length;
          this.trnmismatchListArr = res.model[i].transferReceiptNoteDetailViewModels;
        }
        if (this.data.pageNo == 1) {
          this.firstPage(1);
        }
      } else {
        this.pageNo = 0;
        this.totalRecords = 0;
        swal({
          type: 'warning',
          text: 'No Records Found',
          showConfirmButton: true
        });
      }

    }, err => {
      this.spinner.hide();
     this.commonService.handleError(err);
    }
    );
  }

  /****************************  Function To Set The Page  ******************************/
  setPage(page: number) {
    this.pageNo = page;
    this.data.pageNo = page;
    this.trnMismatchList(this.data);
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);

  }

  /****************************  Function To Set The First Page  ******************************/
  firstPage(page: number) {
    this.pageNo = page;
    this.data.pageNo = page;
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);
  }

  /****************************  Function To Set Page After Click On Pagination button ******************************/
  public optionpage(data) {
    this.pageSize = data.target.value;
    this.data.pageNo = 1
    this.data.pageSize = data.target.value;
    this.trnMismatchList(this.data);
    this.pager = this.commonService.getPager(this.totalRecords, 1, this.pageSize);
  }

  /****************************  Function To Search The Data  ******************************/
  searchdata(fromLoc, toLoc) {
    this.data.fromLocationId = fromLoc;
    this.data.toLocationId = toLoc;
    this.trnMismatchList(this.data);
  }

}
