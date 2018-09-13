import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../core/services/common.service';
import { AppURLs, APPSETTINGS } from '../../core/interfaces';
import { FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  pager: any = {};
  pageSize: number = 10;
  pageNo: number = 1;
  totalRecords: number = 0;
  show = false;
  makeList = [];
  typeList = [];
  modelList = [];
  customerList = [];
  typeId = new FormControl('', [Validators.required]);

  config = {
    displayKey: 'name', // if objects array passed which key to be displayed defaults to description
    search: true,
  };

  data = {
    'name': "",
    'operatorId': 0,
    'contactNo': "",
    'countryId': 0,
    'stateId': 0,
    'cityId': 0,
    'pageNumber': 1,
    'pageSize': 10,
    'sortType': "asc",
    'sortBy': "name"
  };
  countryList: any;
  stateList: any;

  constructor(private commonService: CommonService, private authService: AuthService) { }

  ngOnInit() {
    this.commonService.setTitle('UVM - Customer');
    this.getCountryList();
    this.loadCustomer(this.data);
  }
  toggleShow() {
    this.show = !this.show;
  }
  public filterSearch(e) {
    this.loadCustomer(this.data);
  }
  public resetfilter(e) {
    this.data = {
      'name': "",
      'operatorId': 0,
      'contactNo': "",
      'countryId': 0,
      'stateId': 0,
      'cityId': 0,
      'pageNumber': 1,
      'pageSize': 10,
      'sortType': "asc",
      'sortBy': "name"
    };
    this.loadCustomer(this.data);
  }


  public getCountryList() {
    this.commonService.getData(APPSETTINGS.ims_url + AppURLs.getCountryalllist).subscribe((res: any) => {
      // console.log(res.model,'country list');

      this.countryList = res.model;
    });
  }

  selectCountry(event) {

    let country_id = event.target.value;
    this.commonService.getData(APPSETTINGS.ims_url + AppURLs.getstatebycountry + country_id).subscribe(res => {
      // console.log(res.model,'state list');
      this.stateList = res.model
    })
  }

  loadCustomer(data) {
    this.commonService.postData(APPSETTINGS.operator_base_url + AppURLs.customerListing, data).subscribe(
      (response: any) => {
        if (!response.isError) {
          // console.log(response,'res in customerlist');
          this.customerList = response.model.customerDetail;
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
    this.loadCustomer(this.data);
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
    this.loadCustomer(this.data);
    this.pager = this.commonService.getPager(this.totalRecords, 1, this.pageSize);
  }

}

