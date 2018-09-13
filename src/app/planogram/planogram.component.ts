import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from '../core/services/common.service';
import { AppURLs, APPSETTINGS } from '../core/interfaces';
import { forkJoin } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { AuthService } from '../core/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-planogram',
  templateUrl: './planogram.component.html',
  styleUrls: ['./planogram.component.css']
})
export class PlanogramComponent implements OnInit {
  show = false;
  makeList = [];
  typeList = [];
  modelList = [];
  planogramList = [];
  typeId = new FormControl('', [Validators.required]);

  config = {
    displayKey: 'name', // if objects array passed which key to be displayed defaults to description
    search: true,
  };

  data = {
    'machineMakeId': 0,
    'machineModelId': 0,
    'machineTypeId': 0,
    'pageNumber': 1,
    'pageSize': 10,
    'sortType': 'asc',
    'sortBy': 'name'
  };

  
  pager: any = {};
  pageSize: number = 10;
  pageNo: number=1;
  totalRecords: number = 0;

  @ViewChild('type') type: ElementRef;
  @ViewChild('make') make: ElementRef;
  @ViewChild('model') model: ElementRef;


  constructor(private commonService: CommonService, private authService: AuthService,private spinner:NgxSpinnerService) { }

  ngOnInit() {
    this.commonService.setTitle('UVM - Planogram');
    forkJoin(
      this.loadMake(), this.loadType(), this.loadModel()
    )
      .subscribe(([res1, res2, res3]) => {
        this.makeList = res1.model;
        this.typeList = res2.model;
        this.modelList = res3.model;
      });

      this.loadPlanogram();
  }
  toggleShow() {
    this.show = !this.show;
  }



  /* -----------------------------------Pagination Code----------------------------------*/ 

  setPage(page: number) {
    this.pageNo=page;
    this.data.pageNumber = page;
    this.loadPlanogram();
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
    this.loadPlanogram();
    this.pager = this.commonService.getPager(this.totalRecords, 1, this.pageSize);
  }


  /****************************  End of paging code  ******************************/





  loadMake() {
    return this.commonService.getData(APPSETTINGS.operator_base_url + AppURLs.GetMachineMake);
  }
  loadModel() {
    return this.commonService.getData(APPSETTINGS.operator_base_url + AppURLs.GetMachineModel);
  }
  loadType() {
    return this.commonService.getData(APPSETTINGS.operator_base_url + AppURLs.GetMachineType);
  }

  loadPlanogram() {
    this.spinner.show();
    this.commonService.showLog("data to send to server:-> "+JSON.stringify(this.data));
    this.commonService.postData(APPSETTINGS.operator_base_url + AppURLs.planogramListing, this.data).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.commonService.showLog("planogram Listing response:-> "+JSON.stringify(response))
        if (!response.isError) {
          this.planogramList = response.model.planogramTemplateDetail;
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

  filterData(type,make,model){
    this.commonService.showAlert('type-> '+type+' make-> '+make+' model->'+model);
    this.data.machineTypeId = type;
    this.data.machineMakeId = make;
    this.data.machineModelId = model;
    this.loadPlanogram();

  }

  resetFilterData(){
    this.commonService.showAlert('reset called');

    this.data.machineTypeId=this.type.nativeElement.value=0
    this.data.machineMakeId=this.make.nativeElement.value=0
    this.data.machineModelId=this.model.nativeElement.value=0
    this.loadPlanogram();
  }

}
