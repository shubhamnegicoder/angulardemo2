import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from '../../core/services/common.service';
import { AppURLs, APPSETTINGS } from '../../core/interfaces';
import { forkJoin } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.css']
})
export class MachineComponent implements OnInit {


  show = false;
  
  machineList = [];
  typeId = new FormControl('', [Validators.required]);

  config = {
    displayKey: 'name', // if objects array passed which key to be displayed defaults to description
    search: true,
  };

  data = {
    "serialNo": "",
    "name": "",
    "isActive": true,
    "pageNumber": 1,
    "pageSize": 10,
    "sortType": "asc",
    "sortBy": "name"
  };

  
  pager: any = {};
  pageSize: number = 10;
  pageNo: number=1;
  totalRecords: number = 0;

  // @ViewChild('type') type: ElementRef;
  // @ViewChild('make') make: ElementRef;
  // @ViewChild('model') model: ElementRef;


  constructor(private commonService: CommonService, private authService: AuthService,private spinner:NgxSpinnerService) { }

  ngOnInit() {
    this.commonService.setTitle('UVM - Machines');
      this.loadMachines();
  }
  toggleShow() {
    this.show = !this.show;
  }



  /* -----------------------------------Pagination Code----------------------------------*/ 

  setPage(page: number) {
    this.pageNo=page;
    this.data.pageNumber = page;
    this.loadMachines();
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);

  }

  firstPage(page: number) {
    this.data.pageNumber = page;
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);
  }
  public optionpage(data) {
    this.pageNo=1
    this.pageSize = data.target.value;
    this.data.pageNumber = 1
    this.data.pageSize = data.target.value;
    this.loadMachines();
    this.pager = this.commonService.getPager(this.totalRecords, 1, this.pageSize);
  }


  /****************************  End of paging code  ******************************/



  loadMachines() {
    this.spinner.show();
    this.commonService.showLog("data to send to server:-> "+JSON.stringify(this.data));
    this.commonService.postData(APPSETTINGS.operator_base_url + AppURLs.GetMachineList, this.data).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.commonService.showLog("Machine Listing response:-> "+JSON.stringify(response))
        if (!response.isError) {
          this.machineList = response.model.machineDetail;
          this.totalRecords = response.model.totalRecord;
          if (this.data.pageNumber == 1)
          this.firstPage(1);
        } else {
          swal({ type: 'error', text: response.errorMessage });
        }
      }, (error: any) => {
        this.spinner.hide();
        this.commonService.handleError(error);

      }
    );
  }


  ChangeStatus(id){

    swal({ type: 'warning', text: "service pending for status change" });

  }


  /*******************************filter methods******************************** */

  filterData(machineId,machineName,machineSerialNo,operationLocation,type,make,model){
    
  }

  resetFilterData(){
    this.commonService.showAlert('reset called');

    // this.data.machineTypeId=this.type.nativeElement.value=0
    // this.data.machineMakeId=this.make.nativeElement.value=0
    // this.data.machineModelId=this.model.nativeElement.value=0
   // this.loadPlanogram();
  }
}
