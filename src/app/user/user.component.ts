import { Component, OnInit } from '@angular/core';
import { CommonService } from '../core/services/common.service';
import { APPSETTINGS, AppURLs } from '../core/interfaces';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  pager: any = {};
  pageSize: number = 10;
  pageNo: number = 1;
  totalRecords: number = 0;
  show = false;
  userList: Array<any> = [];

  data = {
    "name": "",
    "isActive": true,
    "pageNumber": 1,
    "pageSize": 10,
    "sortType": "asc",
    "sortBy": "name"
  };
  constructor(private commonService: CommonService, private ngxService: NgxSpinnerService) { }

  ngOnInit() {
    this.commonService.setTitle('UVM - Administrator - User');
    this.loadUser(this.data);
  }
  loadUser(data) {
    this.ngxService.show();
    this.commonService.postData(APPSETTINGS.base_url + AppURLs.AccountList, data).subscribe(response => {
      if (!response.isError) {
        this.userList = response.model.userDetail;
        this.totalRecords = response.model.totalRecord;
        this.ngxService.hide();
        if (data.pageNumber == 1) {
          this.firstPage(1);
        }

      } else {
        swal({ type: 'error', text: response.message });
      }
    }, error => {
      this.commonService.handleError(error);
    });
  }

  setPage(page: number) {
    this.pageNo = page;
    this.data.pageNumber = page;
    this.loadUser(this.data);
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);

  }

  firstPage(page: number) {
    this.data.pageNumber = page;
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);
    console.log(this.pager, 'paggerererererererererererrere');
  }
  public optionpage(data) {
    this.pageNo = 1;
    this.pageSize = data.target.value;
    // alert('pagesize'+this.pageSize);
    this.data.pageNumber = 1;
    this.data.pageSize = data.target.value;
    this.loadUser(this.data);
    this.pager = this.commonService.getPager(this.totalRecords, 1, this.pageSize);
  }
}
