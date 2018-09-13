import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../core/services/common.service';
import { planogramObject, APPSETTINGS, AppURLs } from '../../core/interfaces';
import swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-addplanogram',
  templateUrl: './addplanogram.component.html',
  styleUrls: ['./addplanogram.component.css'],
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})
export class AddplanogramComponent implements OnInit {

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

  planogramCompleteData:any;

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
     this.breadcrumTitle = 'Edit';
      this.pageHeading = 'Edit Planogram Template'
      this.GetPlanogramTemplateDetails(this.editablePlanogramTemplateId);

     
    }else{
      this.editablePlanogramTemplateId = 0;
     // this.commonService.showAlert('creating template--> '+this.editablePlanogramTemplateId);
    }
    this.isFirstPage = 0;
    this.dataFromMocking();
    this.getDataForSelectors();
  }


  disableInputType(){
    let titleInput = <HTMLInputElement>document.getElementById('title');
    titleInput.disabled = true;

    let type = <HTMLInputElement>document.getElementById('type');
    type.disabled = true;

    let make = <HTMLInputElement>document.getElementById('make');
    make.disabled = true;

    let model = <HTMLInputElement>document.getElementById('model');
    model.disabled = true;

    let rowsCount = <HTMLInputElement>document.getElementById('rowsCount');
    rowsCount.disabled = true;

    let perRowBinCount = <HTMLInputElement>document.getElementById('perRowBinCount');
    perRowBinCount.disabled = true;

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

    this.commonService.showAlert('data from mocking called');
    this.rowArray = [];
    this.binArray = [];
    this.maxDepthArr = [];
    this.binArrayForPlanogram = [];
    this.insertDataINArr(this.rowArray, this.tblRowCount);
    this.insertDataINArr(this.binArray, this.tblBinCount);
    this.insertDataINArr(this.maxDepthArr, this.maxBinDepth);

    if(this.editablePlanogramTemplateId > 0){
        this.createArrayForEditablePlanogram();
    }else{
      this.createDataForPlanogram();

    }
    this.commonService.showLog("default planogram array:-> " + JSON.stringify(this.binArrayForPlanogram));


  }


  createDataForPlanogram() {

    alert("createdataforplanogram called");
    for (let i = 0; i < this.tblRowCount; i++) {
      let obj = {
        "planogramTemplateRowId":0,
        "rowNum": i,
        "numOfBins": this.tblBinCount,
        "spiralPerBin": 1,
        'colspanArr': this.createDefaultCOlsPanArr(i, this.tblBinCount),
        'numOfColToBeCreated': this.tblBinCount
      }

      //obj.colspanArr = this.createDefaultCOlsPanArr(i,this.tblBinCount)
      //alert("current colspan:- "+JSON.stringify(obj.colspanArr));
      this.binArrayForPlanogram.push(obj);
    }
  }


  createDefaultCOlsPanArr(rowNum, numOfBin): Array<any> {
    let colSpanArr = [];

    for (let i = 0; i < numOfBin; i++) {
      let tempData = { "planogramTemplateBinId":0,"colSpan": 1, "binId": ((rowNum + 1) * 100) + (i + 1), "binDepth": this.maxBinDepth, "isActive": true }
      colSpanArr.push(tempData);
    }

    // alert("default colsPan arr:- "+JSON.stringify(colSpanArr));

    return colSpanArr;
  }


  insertDataINArr(arrTOInsertData, maxCount) {

    for (let i = 0; i < maxCount; i++) {
      arrTOInsertData.push(i + 1);
    }

  }

  // method for tracking bin selection

  binSelected(data, rowNum) {
    let numOfBin = data.target.value;
    // this.commonService.showAlert(numOfBin);
    this.commonService.showLog("row number:- " + rowNum);


    let numOfSpirals = this.binArrayForPlanogram[rowNum].spiralPerBin;

    if (numOfBin * numOfSpirals > this.tblBinCount) {

      alert("Invalid selection");
      if (numOfSpirals === 1)
        data.target.value = this.tblBinCount;
      else
        data.target.value = this.tblBinCount / 2;

        // this.commonService.showLog("planogram array after invalid bin seleciton:-> " + JSON.stringify(this.binArrayForPlanogram));

    } else {
      this.binArrayForPlanogram[rowNum].numOfBins = numOfBin;

      let numofSpirals = this.binArrayForPlanogram[rowNum].spiralPerBin;
      let totalColsToBeMade = 0;
      let arr = []
      if (numofSpirals == 2) {
        let colsWithDefaultColspan = this.tblBinCount - (numOfBin * numofSpirals);
        totalColsToBeMade = parseInt(numOfBin) + colsWithDefaultColspan;

        this.createArrForColspan(arr, totalColsToBeMade, numOfBin, rowNum, 2);

        //  alert("array for colspan:-> "+JSON.stringify(arr));

      } else {

        totalColsToBeMade = this.tblBinCount;
        this.createArrForColspan(arr, totalColsToBeMade, numOfBin, rowNum, 1);
        // alert("array for colspan:-> "+JSON.stringify(arr));
      }

      this.binArrayForPlanogram[rowNum].colspanArr = arr;

      this.binArrayForPlanogram[rowNum].numOfColToBeCreated = totalColsToBeMade;
      // alert("total cols to be created:- "+ totalColsToBeMade);

      this.commonService.showLog(JSON.stringify(this.binArrayForPlanogram));
    }


  }

  createArrForColspan(arrr, maxCount: number, numOfBins: number, rowNum, spiralCount): Array<any> {

    let arr = [];
    alert("numofbins :->" + numOfBins);
    for (let i = 0; i < maxCount; i++) {

      if (spiralCount == 1) {
        // alert("numofbins :->"+numOfBins);
        if (i < numOfBins) {
          arrr.push({"planogramTemplateBinId":0, "colSpan": 1, "binId": this.calculateBinId(rowNum, i, 1), "binDepth": this.maxBinDepth, "isActive": true });

        } else {
          arrr.push({"planogramTemplateBinId":0, "colSpan": 1, "binId": this.calculateBinId(rowNum, i, 1), "binDepth": this.maxBinDepth, "isActive": false });

        }
      } else {

        if (i < numOfBins) {
          arrr.push({"planogramTemplateBinId":0, "colSpan": 2, "binId": this.calculateBinId(rowNum, i, 2), "binDepth": this.maxBinDepth, "isActive": true });
        } else {

          if ((this.calculateBinId(rowNum, i, 1) <= arrr[i - 1].binId)) {
            let x = arrr[i - 1].binId + 1
            arrr.push({"planogramTemplateBinId":0, "colSpan": 1, "binId": x, "binDepth": this.maxBinDepth, "isActive": false });
          } else {
            arrr.push({"planogramTemplateBinId":0, "colSpan": 1, "binId": this.calculateBinId(rowNum, i, 1), "binDepth": this.maxBinDepth, "isActive": false });
          }
        }

      }

    }

    //this.commonService.showAlert("create arr called:-> "+JSON.stringify(arr));

    return arr;
  }

//spiral selection event method
  spiralSelected(data, rowNum) {
    let numOfSpirals = data.target.value;
    //this.commonService.showAlert(numOfSpirals);

    let numOfBin: number = this.binArrayForPlanogram[rowNum].numOfBins;
    if (numOfBin * numOfSpirals > this.tblBinCount) {

      alert("Invalid selection");
      data.target.value = 1;
    } else {
      this.binArrayForPlanogram[rowNum].spiralPerBin = numOfSpirals;


      let totalColsToBeMade: number = 0;
      let arr = []
      if (numOfSpirals == 2) {

        let colsWithDefaultColspan = this.tblBinCount - (numOfBin * parseInt(numOfSpirals));
        let subBinCount: string = this.binArrayForPlanogram[rowNum].numOfBins.toString();
        totalColsToBeMade = parseInt(subBinCount) + colsWithDefaultColspan;

        this.createArrForColspan(arr, totalColsToBeMade, numOfBin, rowNum, 2);
      } else {
        totalColsToBeMade = this.tblBinCount;
        this.createArrForColspan(arr, totalColsToBeMade, numOfBin, rowNum, 1);
      }

      this.binArrayForPlanogram[rowNum].colspanArr = arr;
      this.binArrayForPlanogram[rowNum].numOfColToBeCreated = totalColsToBeMade;
      this.commonService.showLog(JSON.stringify(this.binArrayForPlanogram));
    }



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

  //bin depth onselection method

  binDepthSelected(event, rowNum, colNum) {

    this.commonService.showAlert("rowNum:-> " + rowNum + " -- column->" + colNum + "-- selectd value-> " + event.target.value);

    this.binArrayForPlanogram[rowNum].colspanArr[colNum].binDepth = event.target.value;

    this.commonService.showLog("planogram array after depth selection:-> " + JSON.stringify(this.binArrayForPlanogram[rowNum]));

  }


  // nxt btn clicked method
  nextBtnClicked() {


    let msg = this.inputValidation();

    if (msg != '') {
      swal({
        title: '',
        text: msg,
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'OK'
      });
    } else {

      if(this.submitBtnTitle === "Next"){
         let button=document.getElementById('next');
         button.setAttribute('data-target','#tab2');
         button.setAttribute('data-toggle','tab');
        //alert("next found");
        this.submitBtnTitle = "Save"
        this.tblRowCount = this.dataToSend.rowsCount;
        this.tblBinCount = this.dataToSend.perRowBinCount;
  
        this.dataFromMocking();
        this.isFirstPage = 1;
      }else if(this.submitBtnTitle==="Save"){
        //alert("submit found");

        //if block handling planogram is going to updated or created
        if(this.editablePlanogramTemplateId > 0){  
          
            this.commonService.showAlert("update service data creation pending... need to discuss on monday");
            
            this.createDataForPlanogramCreation();
        }else{
          this.planogramStatus = "1";
          this.dataToSend.statusId = this.planogramStatus;
    
            this.createDataForPlanogramCreation();
            this.isFirstPage = 2;
        }
       
      }

    }
    

   

    // if (this.isFirstPage === 0) {
      // this.tblRowCount = this.dataToSend.rowsCount;
      // this.tblBinCount = this.dataToSend.perRowBinCount;

      // this.dataFromMocking();
      // this.isFirstPage = 1;

    //   this.submitBtnTitle = 'Submit';
    //   window.location.hash = "tab2";

    // } else if (this.isFirstPage === 1) {

      // let msg = this.inputValidation();

      // if (msg != '') {
      //   swal({
      //     title: '',
      //     text: msg,
      //     type: 'warning',
      //     showCancelButton: false,
      //     confirmButtonText: 'OK'
      //   });
      // } else {
      //   this.planogramStatus = '1';


      //   this.createDataForPlanogramCreation();
      //   this.isFirstPage = 2;

    //   }

     


  }

  // method to create data for creating planogram
  createDataForPlanogramCreation() {

    let plannogramArrTemp = [];
    for (let i = 0; i < this.binArrayForPlanogram.length; i++) {
      let obj = {
        "planogramTemplateRowId": this.binArrayForPlanogram[i].planogramTemplateRowId,
        "perRowBinCount": this.binArrayForPlanogram[i].numOfBins,
        "perBinSpiralCount": this.binArrayForPlanogram[i].spiralPerBin,
        "rowId": i + 1,
        "planogramTemplateBins": []
      };

      for (let j = 0; j < this.binArrayForPlanogram[i].colspanArr.length; j++) {
        let binsDataInfo = {
          "planogramTemplateBinId": this.binArrayForPlanogram[i].colspanArr[j].planogramTemplateBinId,
          "rowNo": i + 1,
          "rowId": i + 1,
          "binId": this.binArrayForPlanogram[i].colspanArr[j].binId,
          "binNo": j + 1,
          "maxBinQuantity": this.binArrayForPlanogram[i].colspanArr[j].binDepth
        };

        if (this.binArrayForPlanogram[i].colspanArr[j].isActive === true)
          obj.planogramTemplateBins.push(binsDataInfo);

      }

      plannogramArrTemp.push(obj);

    }
    this.dataToSend.planogramTemplateRows = plannogramArrTemp;
    this.commonService.showLog("finalData to send to server:->  " + JSON.stringify(this.dataToSend));

    if(this.editablePlanogramTemplateId > 0){
        this.updatePlanogramDataOnServer();
    }else{
      this.sendDataTOServerForPlanogramCreation();
    }
   // this.sendDataTOServerForPlanogramCreation(); // call to post data to server
}

  //method for posting data on server for planogram creation
  sendDataTOServerForPlanogramCreation() {
    this.dataToSend.statusId = this.planogramStatus;
    this.spinner.show();
    this.commonService.postData(APPSETTINGS.operator_base_url + AppURLs.CreatePlanogramTemplate, this.dataToSend).subscribe((res: any) => {
        this.spinner.hide();
      if (!res.isError) {
        swal({
          title: '',
          text: res.message,
          type: 'success',
          showCancelButton: false,
          confirmButtonText: 'OK'
        }).then((result) => {
          this.isFirstPage = 0;
            this.router.navigate(['/Planogram']);
        });
      } else {
        swal({
          title: '',
          text: res.message,
          type: 'warning',
          showCancelButton: false,
          confirmButtonText: 'OK'
        });
      }
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);

    });

  }


  // method for backend validations
  inputValidation(): string {

    let msg = "";

    if (this.dataToSend.name === '') {
      msg = 'Please Fill Planogram Template Name';
    } else if (this.dataToSend.machineTypeId === 0) {
      msg = '';
    } else if (this.dataToSend.machineMakeId === 0) {
      msg = 'Please Select Machine Make';
    } else if (this.dataToSend.machineModelId === 0) {
      msg = 'Please Select Machine Model';
    } else if (this.dataToSend.rowsCount === 0) {
      msg = 'Please Enter Number of Rows/shelf';
    } else if (this.dataToSend.perRowBinCount === 0) {
      msg = 'Please Enter Number of Bins Per Row';
    }

    return msg;
  }

  rowValueChange(event){
    //alert("entered value:-> "+event.target.value)
    this.dataToSend.rowsCount = event.target.value
  }
  
  binCountChangeEvent(event){
    this.dataToSend.perRowBinCount = event.target.value
  }

// tab click handled
  tabClicked(id){
   // this.commonService.showAlert("tab clicked:- "+JSON.stringify(this.dataToSend));

    if(id==2){
      this.isFirstPage = 0;
      this.tblRowCount = this.dataToSend.rowsCount;
      this.tblBinCount = this.dataToSend.perRowBinCount;


      this.dataFromMocking();
      this.submitBtnTitle = "Save"
    }else{
      this.isFirstPage = 1;
      this.submitBtnTitle = 'Next';

    }
    
  }


  saveAsDraftClicked(){
        this.planogramStatus = "2";
        this.tblRowCount = this.dataToSend.rowsCount;
        this.tblBinCount = this.dataToSend.perRowBinCount;
        this.dataFromMocking();
        this.dataToSend.statusId = this.planogramStatus;

        let msg = this.inputValidation();

    if (msg != '') {
      swal({
        title: '',
        text: msg,
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'OK'
      });
    } else {
     
          this.createDataForPlanogramCreation();
         
      

    }
  }

  

  /*************************** Edit planogram code **************************** */


  GetPlanogramTemplateDetails(planogramTemplateId){
    this.spinner.show();
    this.commonService.getData(APPSETTINGS.operator_base_url+AppURLs.GetPlanogramTemplateById+'?planogramTemplateId='+planogramTemplateId).subscribe(res=>{

      this.spinner.hide();
      this.commonService.showLog('planogram Template data by id:-> '+JSON.stringify(res));
      if(!res.isError){
          this.dataToSend = res.model;
          this.planogramCompleteData = res.model;
          this.commonService.showLog('dataToSend:-> '+JSON.stringify(this.dataToSend));
          if(res.model.statusId === 1){
            this.disableInputType();

          }
          this.tblBinCount = this.dataToSend.perRowBinCount;
          this.tblRowCount = this.dataToSend.rowsCount;
          this.dataFromMocking();
          //this.createArrayForEditablePlanogram()
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



  createArrayForEditablePlanogram(){

   // this.commonService.showAlert("response conversion metho called");
    let arr = [];




    let maxBinCount = this.dataToSend.perRowBinCount;
    let maxRowCount = this.dataToSend.rowsCount;

    this.commonService.showAlert("bincount--> "+maxBinCount);

    this.commonService.showLog("bincount--> "+maxBinCount);

    for(let i=0;i<maxRowCount;i++){
      let obj = {
        "planogramTemplateRowId":0,
        "rowNum": i,
        "numOfBins": maxBinCount,
        "spiralPerBin": 1,
        'colspanArr': [],
        'numOfColToBeCreated': maxBinCount
      }


      if(i<this.dataToSend.planogramTemplateRows.length){
        obj.planogramTemplateRowId = this.dataToSend.planogramTemplateRows[i].planogramTemplateRowId
        obj.numOfBins = this.dataToSend.planogramTemplateRows[i].perRowBinCount;
        obj.spiralPerBin = this.dataToSend.planogramTemplateRows[i].perBinSpiralCount;
      }else{
        
      }

        for(let j=0;j<maxBinCount;j++){
            let obj1 = {
              "planogramTemplateBinId":0,
               "colSpan":1,
               "binId": this.calculateBinId(i, j, 1),
                "binDepth": this.maxBinDepth,
                 "isActive": true 
                }

               // this.commonService.showLog("bin no:-> "+this.dataToSend.planogramTemplateRows[i].planogramTemplateBins[j].binNo);
                
               


               if(i < this.dataToSend.planogramTemplateRows.length && j < this.dataToSend.planogramTemplateRows[i].planogramTemplateBins.length){
                  obj1.planogramTemplateBinId = this.dataToSend.planogramTemplateRows[i].planogramTemplateBins[j].planogramTemplateBinId;
                  obj1.colSpan = this.dataToSend.planogramTemplateRows[i].perBinSpiralCount;
                  obj1.binId = this.dataToSend.planogramTemplateRows[i].planogramTemplateBins[j].binId;
                  obj1.binDepth =  this.dataToSend.planogramTemplateRows[i].planogramTemplateBins[j].maxBinQuantity;
                }else{
                    obj1.isActive = true;
              
                }

                obj.colspanArr.push(obj1);

            }





              obj.numOfBins = maxBinCount
        
        arr.push(obj);
    }

    this.binArrayForPlanogram = arr;

    this.commonService.showLog("arr from server response:-> "+JSON.stringify(this.binArrayForPlanogram));
  }


  updatePlanogramDataOnServer(){
    this.dataToSend.statusId = "1";
    this.spinner.show();
    this.commonService.putData(APPSETTINGS.operator_base_url + AppURLs.CreatePlanogramTemplate, this.dataToSend).subscribe((res: any) => {
        this.spinner.hide();
      if (!res.isError) {
        swal({
          title: '',
          text: res.message,
          type: 'success',
          showCancelButton: false,
          confirmButtonText: 'OK'
        }).then((result) => {
          this.isFirstPage = 0;
            this.router.navigate(['/Planogram']);
        });
      } else {
        swal({
          title: '',
          text: res.message,
          type: 'warning',
          showCancelButton: false,
          confirmButtonText: 'OK'
        });
      }
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);

    });

  }

  

}
