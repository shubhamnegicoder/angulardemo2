import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from '../../core/services/common.service';
import { AppURLs, APPSETTINGS } from '../../core/interfaces';
import { forkJoin } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  show = false;
  roleList = [];
  roleId = '1';
  pageSize: number = 10;
  pageNo: number = 1;
  pager: any = {};
  // typeId = new FormControl('', [Validators.required]);


  totalRecords = 0;

  @ViewChild("name") name: ElementRef;
  constructor(private commonService: CommonService, private authService: AuthService) { }
  data = {

    "roleName": "admin",
    "operatorId": 0,
    "pageNumber": 1,
    "pageSize": 10,
    "sortType": "asc",
    "sortBy": "name"

  };

  ngOnInit() {
    this.commonService.setTitle('UVM - Role');
    forkJoin(
      // this.loadMake(), 
    )
      .subscribe(([res1]) => {
        console.log('rolelist res', res1);
        this.roleList = res1.model.roleDetail;
        console.log(this.roleList, "pppp");

      });

    this.loadMake(this.data);

  }
  toggleShow() {
    this.show = !this.show;
  }


  loadMake(data) {
  
    return this.commonService.postData(APPSETTINGS.base_url + AppURLs.rolelist, data).subscribe((res: any) => {
      if (!res.isError) {
        console.log(res, 'res in customerlist');
        this.roleList = res.model.roleDetail;
        this.totalRecords = res.model.totalRecord;
        if (this.data.pageNumber === 1)
          this.firstPage(1);
      } else {

        swal({ type: 'error', text: res.errorMessage });
      }
    }, (error: any) => {
      this.commonService.handleError(error);

    });
  }

  filtersearch(name) {
    this.data.roleName = name;
    this.loadMake(this.data);
  }

  resetfunction() {
    this.data.roleName = this.name.nativeElement.value = "";
    this.loadMake(this.data);
  }

  // loadPlanogram() {
  //   this.commonService.postData(APPSETTINGS.operator_base_url + AppURLs.planogramListing, this.data).subscribe(
  //     (response: any) => {
  //       if (!response.isError) {
  //         this.planogramList = response.model.planogramTemplateDetail;
  //         this.totalRecords = response.model.totalRecord;
  //       } else {
  //         swal({ type: 'error', text: response.errorMessage });
  //       }
  //     }, (error: any) => {
  //       if (error.status === 401) {
  //         swal({ type: 'error', text: 'Session has been expired,please login again' });
  //         this.authService.logout();
  //       } else {
  //         swal({ type: 'error', text: error.errorMessage });
  //       }
  //     }
  //   );
  // }
  setPage(page: number) {
    this.pageNo = page;
    this.data.pageNumber = page;
    this.loadMake(this.data);
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);

  }

  firstPage(page: number) {
    this.data.pageNumber = page;
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);
  }
  public optionpage(data) {
    this.pageNo = 1;
    this.pageSize = data.target.value;
    this.data.pageNumber = 1;
    this.data.pageSize = data.target.value;
    this.loadMake(this.data);
    this.pager = this.commonService.getPager(this.totalRecords, 1, this.pageSize);
  }

}

