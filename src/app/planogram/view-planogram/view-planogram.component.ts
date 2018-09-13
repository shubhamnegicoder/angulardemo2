import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../core/services/common.service';
import { planogramObject, APPSETTINGS, AppURLs } from '../../core/interfaces';
import swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-planogram',
  templateUrl: './view-planogram.component.html',
  styleUrls: ['./view-planogram.component.css']
})
export class ViewPlanogramComponent implements OnInit {

  machineTypeList: any;
  machineMakeList: any;
  machineModelList: any;

  tblRowCount: number = 0;
  tblBinCount: number = 0;
  maxBinDepth: number = 10;
  rowArray = [];
  binArray = [];
  spiralArray = [1, 2];
  planogramBinArr = [];
  maxDepthArr = [];
  planogramStatus: string = "";

  isFirstPage: number = 0;
  isEdit:boolean = false;
  editablePlanogramTemplateId:number = 0;
 submitBtnTitle:string = 'Next';
  binArrayForPlanogram: Array<planogramObject> = [];
  pageHeading:string = 'Create New Planogram Template';
  breadcrumTitle = 'Create';
  dataToSend = {
    "machineMakeId": 0,
    "machineModelId": 0,
    "machineTypeId": 0,
    "rowsCount": 0,
    "perRowBinCount": 0,
    "statusId": "",
    "id": 0,
    "name": "",
    "isActive": true,
    "planogramTemplateRows": []
  }

  planogramTemplateRows = {
    "planogramTemplateRowId": 0,
    "perRowBinCount": 0,
    "perBinSpiralCount": 0,
    "rowId": 0,
    "planogramTemplateBins": []
  }


  planogramTemplateBins = {
    "planogramTemplateBinId": 0,
    "rowNo": "",
    "rowId": 0,
    "binNo": "",
    "binId": 0,
    "maxBinQuantity": 0
  }


  location: Location;



  constructor(private commonService: CommonService,private activatedRoute:ActivatedRoute,private router:Router,
  private locationService:Location,private spinner:NgxSpinnerService) { 
    this.location = locationService;
  }

  ngOnInit() {

    this.editablePlanogramTemplateId = this.activatedRoute.snapshot.params['id'];
    if(this.editablePlanogramTemplateId > 0){
      this.resetData();
     // this.commonService.showAlert('Editing template');
   
      this.GetPlanogramTemplateDetails(this.editablePlanogramTemplateId);
    }else{
      this.editablePlanogramTemplateId = 0;
     // this.commonService.showAlert('creating template--> '+this.editablePlanogramTemplateId);
    }
    this.isFirstPage = 0;
    this.getDataForSelectors();
    
  }



resetData(){

  this.dataToSend = {
    "machineMakeId": 0,
    "machineModelId": 0,
    "machineTypeId": 0,
    "rowsCount": 0,
    "perRowBinCount": 0,
    "statusId": "",
    "id": 0,
    "name": "",
    "isActive": true,
    "planogramTemplateRows": []
  }

}

loadMake() {
  return this.commonService.getData(APPSETTINGS.operator_base_url + AppURLs.GetMachineMake);
}
loadModel() {
  return this.commonService.getData(APPSETTINGS.operator_base_url + AppURLs.GetMachineModel);
}
loadType() {
  return this.commonService.getData(APPSETTINGS.operator_base_url + AppURLs.GetMachineType);
}
//method to get data for machine type
getDataForSelectors() {
  // data for machine type


  forkJoin(
    this.loadMake(), this.loadModel(),this.loadType()
  )
    .subscribe(([res1, res2, res3]) => {
      this.machineMakeList = res1.model;
      this.machineModelList = res2.model;
      this.machineTypeList = res3.model;
    },err=>{
      this.commonService.handleError(err);

    });
    
  

}


  // data initialization & virtual array creation
  dataFromMocking() {

    this.rowArray = [];
    this.binArray = [];
    this.maxDepthArr = [];
    this.binArrayForPlanogram = [];
    this.insertDataINArr(this.rowArray, this.tblRowCount);
    this.insertDataINArr(this.binArray, this.tblBinCount);
    this.insertDataINArr(this.maxDepthArr, this.maxBinDepth);

        this.createArrayForEditablePlanogram();
   
    this.commonService.showLog("default planogram array:-> " + JSON.stringify(this.binArrayForPlanogram));


  }



  insertDataINArr(arrTOInsertData, maxCount) {

    for (let i = 0; i < maxCount; i++) {
      arrTOInsertData.push(i + 1);
    }

  }


  createArrForColspan(arrr, maxCount: number, numOfBins: number, rowNum, spiralCount): Array<any> {

    let arr = [];
    alert("numofbins :->" + numOfBins);
    for (let i = 0; i < maxCount; i++) {

      if (spiralCount == 1) {
        // alert("numofbins :->"+numOfBins);
        if (i < numOfBins) {
          arrr.push({ "colSpan": 1, "binId": this.calculateBinId(rowNum, i, 1), "binDepth": this.maxBinDepth, "isActive": true });

        } else {
          arrr.push({ "colSpan": 1, "binId": this.calculateBinId(rowNum, i, 1), "binDepth": this.maxBinDepth, "isActive": false });

        }
      } else {

        if (i < numOfBins) {
          arrr.push({ "colSpan": 2, "binId": this.calculateBinId(rowNum, i, 2), "binDepth": this.maxBinDepth, "isActive": true });
        } else {

          if ((this.calculateBinId(rowNum, i, 1) <= arrr[i - 1].binId)) {
            let x = arrr[i - 1].binId + 1
            arrr.push({ "colSpan": 1, "binId": x, "binDepth": this.maxBinDepth, "isActive": false });
          } else {
            arrr.push({ "colSpan": 1, "binId": this.calculateBinId(rowNum, i, 1), "binDepth": this.maxBinDepth, "isActive": false });
          }
        }

      }

    }

    //this.commonService.showAlert("create arr called:-> "+JSON.stringify(arr));

    return arr;
  }




 


  calculateColSpan(rowNum, colNum) {
    return this.binArrayForPlanogram[rowNum].colspanArr[colNum].colSpan;
  }


  calculateBinId(rowNum, colNum, colSpan): number {

    let binId = ((rowNum + 1) * 100) + (colSpan * (colNum + 1));
    return binId;

  }


  calculateSpiralCount(rowNum):Number{

    let spiralCount:number = 0;
    if(this.editablePlanogramTemplateId>0){

    }else{

      spiralCount = this.spiralArray[0];
      alert("spiral count:-" +spiralCount);
    }

    return spiralCount;
  }

  

// tab click handled
  tabClicked(id){
   // this.commonService.showAlert("tab clicked:- "+JSON.stringify(this.dataToSend));

    if(id==2){
      this.isFirstPage = 0;
      this.tblRowCount = this.dataToSend.rowsCount;
      this.tblBinCount = this.dataToSend.perRowBinCount;
      this.dataFromMocking();
    }else{
      this.isFirstPage = 1;

    }
    
  }


  

  /*************************** View planogram code **************************** */


  GetPlanogramTemplateDetails(planogramTemplateId){
    this.spinner.show();
    this.commonService.getData(APPSETTINGS.operator_base_url+AppURLs.GetPlanogramTemplateById+'?planogramTemplateId='+planogramTemplateId).subscribe(res=>{

      this.spinner.hide();
      this.commonService.showLog('planogram Template data by id:-> '+JSON.stringify(res));
      if(!res.isError){
          this.dataToSend = res.model;
          this.commonService.showLog('dataToSend:-> '+JSON.stringify(this.dataToSend));
          this.dataFromMocking();
      }else{  

        swal({
          title: '',
          text: res.message,
          type: 'warning',
          showCancelButton: false,
          confirmButtonText: 'OK'
           })

      }

    },err=>{
      this.spinner.hide();
      this.commonService.handleError(err);

    }
    );
  }

  calculateNumberOfBinsTobeMade(rowNum): Array<any> {

    let arr = [];
    let numOfBinsToBeCreated = this.binArrayForPlanogram[rowNum].numOfColToBeCreated;
    for (let i = 0; i < numOfBinsToBeCreated; i++) {
      arr.push(i + 1);
    }
    this.commonService.showLog(JSON.stringify(arr));

    return arr;
  }

  createArrayForEditablePlanogram(){

   // this.commonService.showAlert("response conversion metho called");
    let arr = [];

    let maxBinCount = this.dataToSend.perRowBinCount;

    for(let i=0;i<this.dataToSend.planogramTemplateRows.length;i++){
      let obj = {
        "rowNum": i,
        "numOfBins": this.dataToSend.planogramTemplateRows[i].perRowBinCount,
        "spiralPerBin": this.dataToSend.planogramTemplateRows[i].perBinSpiralCount,
        'colspanArr': [],
        'numOfColToBeCreated': this.dataToSend.planogramTemplateRows[i].perRowBinCount
      }

        for(let j=0;j<maxBinCount;j++){
            let obj1 = {
               "colSpan":1,
               "binId": 0,
                "binDepth": 0,
                 "isActive": true 
                }

                this.commonService.showLog("bin no:-> "+this.dataToSend.planogramTemplateRows[i].planogramTemplateBins[j].binNo);
                if(this.dataToSend.planogramTemplateRows[i].planogramTemplateBins[j].binNo <= maxBinCount){
                  obj1.colSpan = this.dataToSend.planogramTemplateRows[i].perBinSpiralCount;
                  obj1.binId = this.dataToSend.planogramTemplateRows[i].planogramTemplateBins[j].binId;
                  obj1.binDepth =  this.dataToSend.planogramTemplateRows[i].planogramTemplateBins[j].maxBinQuantity;
                }else{
                  obj1.isActive = false;
                }

                obj.colspanArr.push(obj1);

            }

        
        arr.push(obj);
    }

    this.binArrayForPlanogram = arr;

    this.commonService.showLog("arr from server response:-> "+JSON.stringify(this.binArrayForPlanogram));
  }


}
