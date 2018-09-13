import { Component, OnInit } from '@angular/core';
import { AppURLs, APPSETTINGS, Telemetry, OperatorModuleDropdown } from '../../core/interfaces';
import { CommonService } from '../../core/services/common.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-telemetry',
  templateUrl: './telemetry.component.html',
  styleUrls: ['./telemetry.component.css']
})
export class TelemetryComponent implements OnInit {
  pager: any = {};
  pageSize: number = 10;
  pageNo: number=1;
  totalRecords: number = 0;
  data = {
  name: '',
  serialNo: '',
  operationLocationId: 0,
  pageNumber: 1,
  pageSize: 10,
  sortType: 'asc',
  sortBy: 'name'
  };
  telemetryList: Array<Telemetry>;
  ddlOperationLocation: OperatorModuleDropdown[];
  show: boolean;
  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.loadTelemetryList();
    this.loadOperationLocationDropDown();
  }
  toggleShow() {
    this.show = !this.show;
  }

  loadTelemetryList() {
      this.commonService.postData(APPSETTINGS.operator_base_url + AppURLs.TelemetryList, this.data).subscribe((response: any) => {
      if (!response.isError) {
        this.telemetryList = response.model.telemetryDetail;
        this.totalRecords = response.model.totalRecord;
        if (this.data.pageNumber === 1) {
          this.firstPage(1);
        }
      } else {
        swal({ type: 'error', text: response.message });
      }
    }, error => {
       alert(JSON.stringify(error)
      );
      if (error.status === 401) {
        swal({ type: 'error', text: 'Session has been expired, please login again' });

      } else {
        swal({ type: 'error', text: error.message});
      }
    });
  }
  loadOperationLocationDropDown() {
    this.commonService.getData(APPSETTINGS.operator_base_url + AppURLs.OperationLocationDropdown).subscribe((response: any) => {
      if (!response.isError) {
        this.ddlOperationLocation = response.model;
      } else {
        swal({ type: 'error', text: response.message });
      }
    }, error => {
       alert(JSON.stringify(error)
      );
      if (error.status === 401) {
        swal({ type: 'error', text: 'Session has been expired ,please login again' });

      } else {
        swal({ type: 'error', text: error.message});
      }
    });
  }

  setPage(page: number) {
    this.pageNo = page;
    this.data.pageNumber = page;
    this.loadTelemetryList();
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
    this.loadTelemetryList();
    this.pager = this.commonService.getPager(this.totalRecords, 1, this.pageSize);
  }
  // To remove data drom serach control
  clearData() {
    this.data.name = '';
    this.data.serialNo = '';
    this.data.operationLocationId = 0;
    this.loadTelemetryList();
  }
  // To filter telemery list based on operation location, name and serialno
  filterList() {
    this.loadTelemetryList();
  }
  // To add/edit telemetry information
  saveTelemetry() {
    this.commonService.postData(APPSETTINGS.operator_base_url + AppURLs.SaveTelemetry, this.data).subscribe((response: any) => {
      if (!response.isError) {
        this.data = response.model.telemetry;
        if (this.data.pageNumber === 1) {
          this.firstPage(1);
        }
      } else {
        swal({ type: 'error', text: response.message });
      }
    }, error => {
       alert(JSON.stringify(error)
      );
      if (error.status === 401) {
        swal({ type: 'error', text: 'Session has been expired, please login again' });

      } else {
        swal({ type: 'error', text: error.message});
      }
    });
  }
  // Clear control data when modal is closed
  closeModal() {
    this.data.name = '';
    this.data.serialNo = '';
    this.data.operationLocationId = 0;
  }
}
