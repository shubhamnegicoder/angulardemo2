import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../core/services/common.service';
import { APPSETTINGS, AppURLs } from '../../core/interfaces';

@Component({
  selector: 'app-operationlocation',
  templateUrl: './operationlocation.component.html',
  styleUrls: ['./operationlocation.component.css']
})
export class OperationlocationComponent implements OnInit {
  data = {
    "name": "string",
    "contactNo": "string",
    "countryId": 0,
    "stateId": 0,
    "cityId": 0,
    "pageNumber": 0,
    "pageSize": 0,
    "sortType": "string",
    "sortBy": "string"
  };
  operationLocationList: Array<any> = [];
  constructor(private commonService: CommonService) { }

  ngOnInit() {
  }

  loadOperationLocation(data) {
    this.commonService.postData(APPSETTINGS.operator_base_url + AppURLs.operationLocationSearch).subscribe(response => {
      if (!response.isError) {
    
        }
    }, error => {
      this.commonService.handleError(error);
    });
  }
}
