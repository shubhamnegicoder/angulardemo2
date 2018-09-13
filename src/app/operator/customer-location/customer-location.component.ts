import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../core/services/common.service';
import { AppURLs, APPSETTINGS } from '../../core/interfaces';
import { forkJoin } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-customer-location',
  templateUrl: './customer-location.component.html',
  styleUrls: ['./customer-location.component.css']
})
export class CustomerLocationComponent implements OnInit {

  pager: any = {};
  pageSize: number = 10;
  pageNo: number = 1;
  totalRecords: number = 0;
  show = false;
  makeList = [];
  typeList = [];
  modelList = [];
  customerLoactionList = [];
  typeId = new FormControl('', [Validators.required]);

  config = {
    displayKey: 'name', // if objects array passed which key to be displayed defaults to description
    search: true,
  };

  data = {
    "name": "",
    "contactNo": "",
    "customerId": 0,
    "operatorId": 0,
    "countryId": 0,
    "stateId": 0,
    "cityId": 0,
    "pageNumber": 1,
    "pageSize": 10,
    "sortType": "asc",
    "sortBy": "name"
  }
  customerList: any;

  constructor(private commonService: CommonService, private authService: AuthService) { }

  ngOnInit() {
    this.commonService.setTitle('UVM - Customer Location');
    this.loadCustomerLocation(this.data);
    this.getCustomerList();
  }
  toggleShow() {
    this.show = !this.show;
  }
  public filterSearch(e) {
    this.loadCustomerLocation(this.data);
  }
  public resetfilter(e) {
    this.data = {
      "name": "",
      "contactNo": "",
      "customerId": 0,
      "operatorId": 0,
      "countryId": 0,
      "stateId": 0,
      "cityId": 0,
      "pageNumber": 1,
      "pageSize": 10,
      "sortType": "asc",
      "sortBy": "name"
    }
    this.loadCustomerLocation(this.data);
  }
  public getCustomerList() {
    this.commonService.getData(APPSETTINGS.operator_base_url + AppURLs.getCustomerList).subscribe((res: any) => {
      // console.log(res,'customerList list');
      this.customerList = res.model;
    });
  }

  loadCustomerLocation(data) {
    // console.log(this.data,"joooooooooooooooo")
    this.commonService.postData(APPSETTINGS.operator_base_url + AppURLs.getCustomerLocation, data).subscribe(
      (response: any) => {
        if (!response.isError) {
          // console.log(response,'res in customerlocationlist');
          this.customerLoactionList = response.model.customerLocationDetail;
          this.totalRecords = response.model.totalRecord;
          if (this.data.pageNumber == 1)
            this.firstPage(1);

          // console.log(this.totalRecords,"total record");
        } else {
          swal({ type: 'error', text: response.errorMessage });
        }
      }, (error: any) => {
        this.commonService.handleError(error);
      }
    );
  }

  setPage(page: number) {
    this.pageNo = page;
    this.data.pageNumber = page;
    this.loadCustomerLocation(this.data);
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);

  }

  firstPage(page: number) {
    this.data.pageNumber = page;
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);
    // console.log(this.pager,'paggerererererererererererrere');
  }
  public optionpage(data) {
    this.pageNo = 1
    this.pageSize = data.target.value;
    // alert('pagesize'+this.pageSize);
    this.data.pageNumber = 1
    this.data.pageSize = data.target.value;
    this.loadCustomerLocation(this.data);
    this.pager = this.commonService.getPager(this.totalRecords, 1, this.pageSize);
  }

}

