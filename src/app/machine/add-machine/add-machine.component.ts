import { Component, OnInit, getPlatform, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from '../../core/services/common.service';
import { APPSETTINGS, AppURLs, planogramObject } from '../../core/interfaces';
import { forkJoin } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-machine',
  templateUrl: './add-machine.component.html',
  styleUrls: ['./add-machine.component.css']
})
export class AddMachineComponent implements OnInit {

  mode = 'create' // create,edit
  pageHeading = '';

  navigationKey = 'tab';
  currentTab:number = 1;
  editMachineId:number = 0;
  submitBtnTitle = 'Next'
  breadcrumTitle = ''
  machineTypeList: any;
  machineMakeList: any;
  machineModelList: any;
  machineComponentTypeList_DD:any;
  machineComponentList:any;
 selectedPlanogramTemplateId:number = 0;
  telemetryList: any;
  vposList: any;
  cashBoxList: any;
  operatorLocationList:any;

  customerLocationList = [];
  customerList = [];
  planogramTemplateList = [];

  maxProductQty = 0;
  activeRowNum = 0;
  activeColNum = 0;
  //variable to show component table
  showComponentTbl = false;

  //variable for location selection

  selectedCustomerId:number = 0;
  selectedCustomerLocationId:number = 0;

  //variable for showing planogram
  selectedPlanogramDetails:any;
  binArrayForPlanogram: Array<planogramObject> = [];
  tblRowCount: number = 0;
  tblBinCount: number = 0;
  maxBinDepth: number = 10;
  rowArray = [];
  binArray = [];
  spiralArray = [1, 2];
  maxDepthArr = [];
  showPlanogram = false;
  tabNum = 1;
  //var for product search
  searchDataList:any;

  // dataForMachineBasicDetail ={
  //     "serialNo": "",
  //     "operationLocationId": 0,
  //     "machineMakeId": 0,
  //     "machineTypeId": 0,
  //     "machineModelId": 0,
  //     "telemetryId": 0,
  //     "vposId": 0,
  //     "cashBoxId": 0,
  //     "planogramTemplateId": 0,
  //     "id": 0,
  //     "name": "",
  //     "isActive": true
  // }

  dataForMachineBasicDetail = {
    "machineId":0,
    "serialNo":"",
    "name":"",
    "operatorName":"",
    "operationLocationName":"",
    "machineMakeName":"",
    "machineTypeName":"",
    "machineModelName":"",
    "telemetryName":"",
    "vposName":"",
    "cashBoxName":"",
    "planogramTemplateId":0,
    "planogramTemplateName":"",
    "operatorId":0,
    "operationLocationId":0,
    "machineMakeId":0,
    "machineTypeId":0,
    "machineModelId":0,
    "telemetryId":0,
    "vposId":0,
    "cashBoxId":0,
    "id": 0,
    "isActive":true,
    "imagePath":null
  }

  dataForAddingMachineComponet = {
    "serialNo": "string",
    "componentTypeId": 0,
    "machineId": 0,
    "id": 0,
    "name": "string",
    "isActive": true
  }

  dataForProductSelection = {
    "machineId": 0,
      "planogramTemplateId": 0,
      "planogramViewModels":[]
  }

  searched = false;
showSelectedProductInfo = false;
@ViewChild('closeBtn') closeBtn:ElementRef;
@ViewChild('componentName') componentName:ElementRef;
@ViewChild('componentType') componentType:ElementRef;
@ViewChild('componentSerialNo') componentSerialNo:ElementRef;
@ViewChild('name') name:ElementRef;
@ViewChild('closeBtn1') closeBtn1:ElementRef;
@ViewChild('templateId') templateId:ElementRef;


  constructor(private commonService:CommonService,private spinner:NgxSpinnerService,private router:Router,private activateRoute:ActivatedRoute) { }

  ngOnInit() {
    this.submitBtnTitle = 'Next';
    this.breadcrumTitle = 'create'

    let url = location.href;
    let x = url.split("/");
    if(x[x.length-1] === 'Create'){
      this.mode = 'create';
      this.pageHeading = 'Create Machine'
      // if(this.editMachineId > 0){
      //   this.mode = 'edit'
      // }
    }else{

      let machineId = this.activateRoute.snapshot.params['id'];

      if(x[x.length-2] === 'Update'){
        this.mode = 'edit'
        this.pageHeading = 'Edit Machine'
        // call service to get machine data
        this.editMachineId = machineId;
        this.GetMachineInfoByMachineId(this.editMachineId);
        this.disableInputType();
        this.selectedPlanogramTemplateId = this.dataForMachineBasicDetail.planogramTemplateId;
        this.GetPlanogramDetailsById(this.selectedPlanogramTemplateId);

      }else{
        //view mode
      }

    }

    this.getDataForSelectors();
  }

  disableInputType(){
    let titleInput = <HTMLInputElement>document.getElementById('serialNo');
    titleInput.disabled = true;

    let type = <HTMLInputElement>document.getElementById('type');
    type.disabled = true;

    let make = <HTMLInputElement>document.getElementById('make');
    make.disabled = true;

    let model = <HTMLInputElement>document.getElementById('model');
    model.disabled = true;


  }
  

/****************************************** Machine Creation Code ****************************************************/

/*************************** drop down data fetch ****************************** */

  loadMake() {
    return this.commonService.getData(APPSETTINGS.operator_base_url + AppURLs.GetMachineMake);
  }
  loadModel() {
    return this.commonService.getData(APPSETTINGS.operator_base_url + AppURLs.GetMachineModel);
  }
  loadType() {
    return this.commonService.getData(APPSETTINGS.operator_base_url + AppURLs.GetMachineType);
  }
  loadVpos(){
    return this.commonService.getData(APPSETTINGS.operator_base_url + AppURLs.GetVposList_DD);
  }

  loadCashBox(){
    return this.commonService.getData(APPSETTINGS.operator_base_url + AppURLs.GetCashBoxList_DD);
  }

  loadTelemetry(){
    return this.commonService.getData(APPSETTINGS.operator_base_url + AppURLs.GetTelemetryList_DD);
  }

  loadCustomer(){
    return this.commonService.getData(APPSETTINGS.operator_base_url + AppURLs.GetCustomerList_DD).subscribe(res=>{
      this.commonService.showAlert("customer location response:-> "+JSON.stringify(res));
      this.customerList = res.model;
   },err=>{
    this.commonService.showAlert("customer location response:-> "+JSON.stringify(err));

     this.commonService.handleError(err);
   })
  }

  loadOperatorLocation(){
    return this.commonService.getData(APPSETTINGS.operator_base_url + AppURLs.GetOperatorLocationList_DD);

  }

  loadCustomerLocation(selectedCustomerId){
    return this.commonService.getData(APPSETTINGS.operator_base_url + AppURLs.GetCustomerLocationList_DD+'?CustomerId='+selectedCustomerId+'&MachineId='+this.editMachineId).subscribe(res=>{
      this.commonService.showLog("customer location response:-> "+JSON.stringify(res));
      this.customerLocationList = res.model;
      if(res.model.length === 0){
        swal({
          title: '',
          text: 'No customer location found for the selected customer. Please select other customer',
          type: 'warning',
          showCancelButton: false,
          confirmButtonText: 'OK'
        });
      }
   },err=>{
     this.commonService.handleError(err);
   })
  }

  loadComponentType(){
    return this.commonService.getData(APPSETTINGS.operator_base_url + AppURLs.GetMachineComponentType_DD).subscribe(res=>{
      this.commonService.showLog("compnent type response:-> "+JSON.stringify(res));
      this.machineComponentTypeList_DD = res.model;
   },err=>{
     this.commonService.handleError(err);
   })
  }

  loadPlanogramTemplates(){
     this.commonService.getData(APPSETTINGS.operator_base_url + AppURLs.GetPlanogramTemplateList_DD).subscribe(res=>{
        this.commonService.showLog("planogram template response:-> "+JSON.stringify(res));
        this.planogramTemplateList = res.model;
     },err=>{
       this.commonService.handleError(err);
     })

  }
  //method to get data for machine type
  getDataForSelectors() {
    // data for machine type


    forkJoin(
      this.loadMake(), this.loadModel(),this.loadType(),this.loadTelemetry(),this.loadVpos(),this.loadCashBox(),this.loadOperatorLocation()
    )
      .subscribe(([res1, res2, res3,res4,res5,res6,res7]) => {
        this.machineMakeList = res1.model;
        this.machineModelList = res2.model;
        this.machineTypeList = res3.model;
        this.telemetryList = res4.model;
        this.vposList = res5.model;
        this.cashBoxList = res6.model;
        this.operatorLocationList = res7.model;
      },err=>{
        this.commonService.handleError(err);

      });
      
    

  }


  tabClicked(id){

    this.commonService.showAlert('clicked tab no:- '+id);
    this.tabNum = id;
    if(id===4){
      if(this.mode === 'create'){
        this.selectedPlanogramTemplateId = 0;
      }
      this.loadPlanogramTemplates();
      this.tabNum = 4;
    }else if(id === 3){
      this.loadCustomer();
    }else if(id === 2){
        this.loadComponentType();
        if(this.editMachineId>0){
          this.getComponentDetails(this.editMachineId);
        }else{
          swal({
            title: '',
            text: 'Please fill basic details first.',
            type: 'warning',
            showCancelButton: false,
            confirmButtonText: 'OK'
          }).then(result=>{
            this.commonService.showAlert('send user back on first tab');
          })
        }
    }else if(id === 1){
      // this.loadCustomerLocation();
    }
  }



  nextBtnClicked(){

    if(this.tabNum === 1){
      // basic info

      alert('save called');
      this.commonService.showLog("basic details:-> "+JSON.stringify(this.dataForMachineBasicDetail));
      if(this.mode === 'create'){
        this.sendMachineBasicInfoOnServer();

      }else if(this.mode === 'edit'){
        this.UpdateMachineBasicInfoOnServer();
      }
    }else if(this.tabNum  === 2){
        // other components
    }else if(this.tabNum  === 3){
        // location
        this.saveLocationInformationONserver();

    }else if(this.tabNum  === 4){
      
        this.sendProductInformationOnServer();
    }
  }

   // method for backend validations
   inputValidationForBasicDetails(): string {

    let msg = "";

    if (this.dataForMachineBasicDetail.serialNo === '') {
      msg = 'Please Enter Serial Number';
    } else if (this.dataForMachineBasicDetail.machineTypeId === 0) {
      msg = 'Please Select Machine Type';
    } else if (this.dataForMachineBasicDetail.machineMakeId === 0) {
      msg = 'Please Select Machine Make';
    } else if (this.dataForMachineBasicDetail.machineModelId === 0) {
      msg = 'Please Select Machine Model';
    } else if (this.dataForMachineBasicDetail.name === '') {
      msg = 'Please Enter Machine Name.';
    } else if (this.dataForMachineBasicDetail.telemetryId === 0) {
      msg = 'Please Select Machine Telemetry';
    }else if (this.dataForMachineBasicDetail.vposId === 0) {
      msg = 'Please Select Machine VPOS';
    }else if (this.dataForMachineBasicDetail.cashBoxId === 0) {
      msg = 'Please Select Machine Cashbox';
    }


    return msg;
  }

  sendMachineBasicInfoOnServer(){
    alert("send method called");
    let msg = this.inputValidationForBasicDetails();

    if (msg != '') {
      swal({
        title: '',
        text: msg,
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'OK'
      });
    }else{
      // api call
      this.commonService.showAlert('valid data-- proceed to service calling');

      this.spinner.show();
      this.commonService.postData(APPSETTINGS.operator_base_url+AppURLs.CreateMachine,this.dataForMachineBasicDetail).subscribe(res=>{
        this.spinner.hide();
        if(!res.isError){
            this.editMachineId = res.model.id;
            swal({
              title: '',
              text: res.message,
              type: 'success',
              showCancelButton: false,
              confirmButtonText: 'OK'
            });
          

        }else{
          swal({
            title: '',
            text: res.message,
            type: 'warning',
            showCancelButton: false,
            confirmButtonText: 'OK'
          });
        }

      },err=>{
        this.spinner.hide();

          this.commonService.handleError(err);
      })
    }


  }


/******************************** Add Component Methods *******************************/


getComponentDetails(machineId){
  // fetch list of components attach to a machine
  this.spinner.show();
  this.commonService.getData(APPSETTINGS.operator_base_url+AppURLs.GetMachineComponentListByMachineId+'?machineId='+machineId).subscribe(res=>{
    this.spinner.hide();
    if(!res.isError){
      this.machineComponentList = res.model;

      if(this.machineComponentList.length > 0)
            this.showComponentTbl = true;
      else
        this.showComponentTbl = false;

    }else{
      swal({
        title: '',
        text: res.message,
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'OK'
      });
    }

  },err=>{
    this.spinner.hide();
    this.commonService.handleError(err);
  })

}



// modal code
  addMachineComponents(name,type,serialNum){

    let msg = '';
    if(this.editMachineId === 0){
      msg = 'Please fill basic details first.'
    }else if(name === ''){
        msg = 'Please Enter Component Name';
    }else if(type === 0){
      msg = 'Please select Component Type';
    }else if(serialNum === ''){
      msg = 'Please Enter Component Serial Number';
    }

    if(msg != ''){
      swal({
        title: '',
        text: msg,
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'OK'
      });
    }else{
      // hit service by creating data to send to server
    
      this.dataForAddingMachineComponet.name = name;
      this.dataForAddingMachineComponet.componentTypeId = type;
      this.dataForAddingMachineComponet.serialNo = serialNum;
      this.dataForAddingMachineComponet.machineId = this.editMachineId;
      this.commonService.showLog("dataForAddingCOmponnet:- "+JSON.stringify(this.dataForAddingMachineComponet));

      this.spinner.show();
      this.commonService.postData(APPSETTINGS.operator_base_url+AppURLs.AddMachineComponent,this.dataForAddingMachineComponet).subscribe(res=>{
        this.spinner.hide();
        if(!res.isError){
          this.closeModal();
          swal({
            title: '',
            text: res.message,
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK'
          }).then(result=>{
            //fetching components 
            this.getComponentDetails(this.editMachineId);
          })
        }else{
          swal({
            title: '',
            text: res.message,
            type: 'warning',
            showCancelButton: false,
            confirmButtonText: 'OK'
          });
        }

      },err=>{
        this.spinner.hide();
        this.commonService.handleError(err);
      })

      
    }




  }


  private closeModal(): void {
    this.componentName.nativeElement.value = '';
    this.componentType.nativeElement.value = '0';
    this.componentSerialNo.nativeElement.value = '';
    this.resetDataForAddingMachineComponet();
    this.closeBtn.nativeElement.click();
  }
  
  resetDataForAddingMachineComponet(){
    this.dataForAddingMachineComponet = {
      "serialNo": "string",
      "componentTypeId": 0,
      "machineId": 0,
      "id": 0,
      "name": "string",
      "isActive": true
    };
  }


/********************************End of Add Component Methods *******************************/

  
  /*********************************** Location screen ********************************************/

  customerSelected(data){
    this.selectedCustomerId = data.target.value;

      alert(data.target.value);
      if(this.editMachineId > 0){
        this.loadCustomerLocation(this.selectedCustomerId);
      }else{
        swal({
          title: '',
          text: 'Please fill basic details first.',
          type: 'warning',
          showCancelButton: false,
          confirmButtonText: 'OK'
        }).then(result=>{
          
        })
      }

  }


  selectedCustomerLocation(data){
    this.selectedCustomerLocationId = data.target.value;
  }



  saveLocationInformationONserver(){

  alert("save location called");
    let msg = '';
    if(this.editMachineId === 0){
      msg = 'Please fill basic details first.'
    }else if(this.selectedCustomerId === 0){
      msg = 'Please select Customer.'
    }else if(this.selectedCustomerLocationId === 0){
      msg = 'Please select Customer Location.'
    }

    if(msg != ""){

      swal({
        title: '',
        text: msg,
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'OK'
      });

    }else{
      let data = {
        "machineId": this.editMachineId,
        "customerLocationId": this.selectedCustomerLocationId,
        "customerId": this.selectedCustomerId,
        "id": 0,
        "name": "",
        "isActive": true
      
     }

     this.commonService.postData(APPSETTINGS.operator_base_url + AppURLs.SaveMachineLocationData,data).subscribe(res=>{

      if(!res.isError){
        swal({
          title: '',
          text: res.message,
          type: 'success',
          showCancelButton: false,
          confirmButtonText: 'OK'
        });

        // make selector disabled after success
      }else{
        swal({
          title: '',
          text: res.message,
          type: 'warning',
          showCancelButton: false,
          confirmButtonText: 'OK'
        });

      }

     },err=>{
       this.commonService.handleError(err);
     })
    }

   

  }




  /*********************************** End of Location screen ********************************************/




  /*********************************** planogram screen ********************************************/

  planogramSelected(data){
    this.commonService.showAlert(data.target.value);

    if(this.editMachineId>0){
    this.selectedPlanogramTemplateId = data.target.value;
      this.sendSelectedPlanogramIdToServer(this.selectedPlanogramTemplateId);
      

    }else{
      this.selectedPlanogramTemplateId = 0;
      data.target.value = 0;

      swal({
        title: '',
        text: 'Please fill basic details first.',
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'OK'
      }).then(result=>{
        
      })
    }
  }



  GetPlanogramDetailsById(id){

    this.spinner.show();
    this.commonService.getData(APPSETTINGS.operator_base_url+AppURLs.GetPlanogramTemplateById+'?planogramTemplateId='+id).subscribe(res=>{

      this.spinner.hide();
      this.commonService.showLog('planogram Template data by id:-> '+JSON.stringify(res));
      if(!res.isError){
          this.selectedPlanogramDetails = res.model;
          this.commonService.showLog('dataToSend:-> '+JSON.stringify(this.selectedPlanogramDetails));
          if(this.selectedPlanogramDetails.planogramTemplateRows!= null && this.selectedPlanogramDetails.planogramTemplateRows.length > 0){
            this.showPlanogram = true;
            this.dataFromMocking();

          }else{
            this.showPlanogram = false;

            swal({
              title: '',
              text: 'Planogram do not have any rows to display.',
              type: 'warning',
              showCancelButton: false,
              confirmButtonText: 'OK'
               })
    
          }
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

  // func to be used for showing planogram
  createArrayForEditablePlanogram(){

    // this.commonService.showAlert("response conversion metho called");
     let arr = [];
     let arrForProduct = [];
 
     let maxBinCount = this.selectedPlanogramDetails.perRowBinCount;
 
     for(let i=0;i<this.selectedPlanogramDetails.planogramTemplateRows.length;i++){
       let obj = {
         "rowNum": i,
         "numOfBins": this.selectedPlanogramDetails.planogramTemplateRows[i].perRowBinCount,
         "spiralPerBin": this.selectedPlanogramDetails.planogramTemplateRows[i].perBinSpiralCount,
         'colspanArr': [],
         'numOfColToBeCreated': this.selectedPlanogramDetails.planogramTemplateRows[i].perRowBinCount
       }

    
 
         for(let j=0;j<maxBinCount;j++){
             let obj1 = {
                "colSpan":1,
                "binId": 0,
                 "binDepth": 0,
                  "isActive": true 
                 }
 
                 this.commonService.showLog("bin no:-> "+this.selectedPlanogramDetails.planogramTemplateRows[i].planogramTemplateBins[j].binNo);
                 if(this.selectedPlanogramDetails.planogramTemplateRows[i].planogramTemplateBins[j].binNo <= maxBinCount){
                   obj1.colSpan = this.selectedPlanogramDetails.planogramTemplateRows[i].perBinSpiralCount;
                   obj1.binId = this.selectedPlanogramDetails.planogramTemplateRows[i].planogramTemplateBins[j].binId;
                   obj1.binDepth =  this.selectedPlanogramDetails.planogramTemplateRows[i].planogramTemplateBins[j].maxBinQuantity;
                 }else{
                   obj1.isActive = false;
                 }
 
                 obj.colspanArr.push(obj1);

                 let obj_ForProduct = {
                  "itemId": 0,
                  "itemPrice":0,
                  "itemName":"",
                  "rowNo": i+1,
                  "columnNo": j+1,
                  "maxQuantity": obj1.binDepth,
                  "quantity": 0,
                  "binId":obj1.binId
                 }
                

                 arrForProduct.push(obj_ForProduct);
                 
 
             }
 
         
         arr.push(obj);
     }
 
     this.binArrayForPlanogram = arr;
     this.dataForProductSelection.planogramViewModels = arrForProduct;
     this.commonService.showLog("arr from server response:-> "+JSON.stringify(this.binArrayForPlanogram));

     this.commonService.showLog("Product arr from server response:-> "+JSON.stringify(this.dataForProductSelection));

   }


   dataFromMocking() {

    this.tblRowCount = this.selectedPlanogramDetails.rowsCount;
    this.tblBinCount = this.selectedPlanogramDetails.perRowBinCount;
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


// sending planogram template id to server with machine id
  sendSelectedPlanogramIdToServer(planogramTemplateId){
    let dataForPlanogram = {
        "machineId": this.editMachineId,
        "planogramTemplateId": planogramTemplateId
    }
    this.commonService.showAlert("send data:->"+JSON.stringify(dataForPlanogram));
    this.spinner.show();
    this.commonService.putData(APPSETTINGS.operator_base_url+AppURLs.SaveMachinePlanogramTemplateId,dataForPlanogram).subscribe((res:any)=>{

      if(!res.isError){


        this.GetPlanogramDetailsById(planogramTemplateId);

      }else{

        swal({
          title: '',
          text: res.message,
          type: 'warning',
          showCancelButton: false,
          confirmButtonText: 'OK'
        });
      }


    },err=>{
      this.spinner.hide();
      this.commonService.handleError(err);
    })
  }


  // code of adding products to planogram


 addProductCalled(rowNum,colNum){
   
  this.maxProductQty = this.binArrayForPlanogram[rowNum].colspanArr[colNum].binDepth;

  this.activeRowNum = rowNum;
  this.activeColNum = colNum;
  this.commonService.showAlert("add rpoduct called->"+this.maxProductQty);
 }

 addProductResetClicked(){
   this.searchDataList = [];
   this.searched = false;
   this.showSelectedProductInfo = false;
 }

 cancelClicked(){
   this.name.nativeElement.value = "";
   this.addProductResetClicked();
 }

  auto(e) {
    let len = e.target.value.length;
    if (e.target.value.replace(/\s/g, "").length >= 2) {

      let name = e.target.value;
      this.getFilteredData(name);
      if(this.searchDataList.length > 0){
        this.searched = true;
      }
     

    
    }
    else {
      
    }

  }


  getFilteredData(name:string){
    this.commonService.getData(APPSETTINGS.ims_url+AppURLs.GetSearchedItemList+'?Name='+name).subscribe(res=>{

      //this.commonService.showAlert('product search:-> '+JSON.stringify(res));
      if(!res.didError){
          this.searchDataList = res.model;
          this.addKeyTOsearchDataForCheckbox();
        // this.commonService.showAlert("search data list:-> "+JSON.stringify(this.searchDataList));
      }else{
        this.commonService.showLog('product search error === true');
      }

  },err=>{
    //this.commonService.handleError(err);
  });
  }

  addKeyTOsearchDataForCheckbox(){
      for(let item of this.searchDataList){
        item.isSelected = false;
        item.enteredQty = 0;
      }
  }

  selectFilteredList(event){
    let searchResult = event.target.innerText;
    this.searched = false;
    this.showSelectedProductInfo = true;
    this.getFilteredData(searchResult);

  }



  searchBtnClicked(name){
   // alert("search clicked")

    this.getFilteredData(name);
    this.searched = false;
    if(this.searchDataList.length > 0){

      this.showSelectedProductInfo = true;
    }else{
      this.showSelectedProductInfo = false;
      swal({
        title: '',
        text: 'No Record Found.',
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'OK'
      });
    }
  }

  checkBoxClicked(event,product_id,rowNum){
    
    let valueToBeAssigned:boolean = false
    if (event.target.checked === true) {
      valueToBeAssigned = true
    }else{
      valueToBeAssigned = false
    }
    for(let i=0;i<this.searchDataList.length;i++){
      this.searchDataList[i].isSelected = false;
      if(i===rowNum){
        this.searchDataList[i].isSelected = valueToBeAssigned;
      }
    }

    //this.commonService.showAlert("checkbox clicked with rownum:- "+JSON.stringify(this.searchDataList));


  }

  saveProductInfoToBin(){

    let selectedItem:any = '';
    this.commonService.showLog("saveProduct data:-> "+JSON.stringify(this.searchDataList));
    this.searchDataList.filter(item => {
      if (item.isSelected == true)
          selectedItem = item;
    });

   


    if(selectedItem === ''){
      this.commonService.showAlert("selected item is null");
    }else{

      if(selectedItem.enteredQty === 0){

        swal({
          title: '',
          text: 'Quantity must be greater than zero',
          type: 'warning',
          showCancelButton: false,
          confirmButtonText: 'OK'
        });

      }else{

     
      this.commonService.showLog("product to add is:-> "+JSON.stringify(selectedItem));

      this.commonService.showAlert("active row-> "+this.activeRowNum +"  active col:-> "+this.activeColNum);

      let activeBinId = this.selectedPlanogramDetails.planogramTemplateRows[this.activeRowNum].planogramTemplateBins[this.activeColNum].binId;

        for(let i=0;i<this.dataForProductSelection.planogramViewModels.length;i++){

            if(this.dataForProductSelection.planogramViewModels[i].binId === activeBinId){
              this.dataForProductSelection.planogramViewModels[i].rowNo = this.activeRowNum+1;
              this.dataForProductSelection.planogramViewModels[i].columnNo = this.activeColNum+1;
              this.dataForProductSelection.planogramViewModels[i].itemId = selectedItem.id;
              this.dataForProductSelection.planogramViewModels[i].itemName = selectedItem.name;
              this.dataForProductSelection.planogramViewModels[i].itemPrice = selectedItem.price;
              this.dataForProductSelection.planogramViewModels[i].quantity = selectedItem.enteredQty;

              break;
            }
        }

     

      //quantity pending

      this.commonService.showLog("dataforProduct:- "+JSON.stringify(this.dataForProductSelection));
      this.closeBtn1.nativeElement.click();
      this.cancelClicked();
      }
    }
  }

  // "rowNo": i+1,
  // "columnNo": j+1,

  isShowProdDiv(rownum,colnum):any{

    let binId = this.selectedPlanogramDetails.planogramTemplateRows[rownum].planogramTemplateBins[colnum].binId;

    let Prod:any;
    for(let item of this.dataForProductSelection.planogramViewModels){

      if(item.binId === binId){
        Prod = item;
       // alert("prod:- "+JSON.stringify(Prod));
        if(Prod.itemId != '0')
          return true;
       
      }
    }

   

    return false;
  }

  findoutProductNameToShow(rownum,colnum,key):string{

  let binId = this.selectedPlanogramDetails.planogramTemplateRows[rownum].planogramTemplateBins[colnum].binId;
  for(let item of this.dataForProductSelection.planogramViewModels){

    if(item.binId === binId){
      if(key === 'name'){
        return item.itemName;

      }else if(key === 'price'){
        return item.itemPrice;
      }else if(key === 'qty'){
        return item.quantity;
      }
      
    }
  }

  
    return "NA";
  }



  sendProductInformationOnServer(){

    this.dataForProductSelection.machineId = this.editMachineId;
    this.dataForProductSelection.planogramTemplateId = this.selectedPlanogramTemplateId

    let msg = ''

    
    
    if(this.dataForProductSelection.machineId === 0){
        msg= 'Please fill basic details first.'
    }else if(this.selectedPlanogramTemplateId === 0){
        msg = 'Please select Planogram Template.'
    }else if(this.binArrayForPlanogram.length === 0){
      msg = 'Selected Template do not have Bins. Please select other Template.'
    }else if(this.findingWhetherProductAddedOrNot()){
      msg = "You haven't select any product for any bin."
    }

    if(msg != ''){
      swal({
        title: '',
        text: msg,
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'OK'
      });
    }else{
      //call to server
      this.commonService.showLog("final product send to server:-> "+JSON.stringify(this.dataForProductSelection.planogramViewModels));

      // this.commonService.showAlert("final product send to server:-> "+JSON.stringify(this.dataForProductSelection.planogramViewModels));
      this.spinner.show();

      if(this.mode === 'create'){
        this.commonService.postData(APPSETTINGS.ims_url+AppURLs.SendPlanogramProductsData,this.dataForProductSelection).subscribe(res=>{
          this.spinner.hide();
  
          if(!res.didError){
            swal({
              title: '',
              text: res.message,
              type: 'success',
              showCancelButton: false,
              confirmButtonText: 'OK'
            }).then(result=>{
                this.router.navigate(['/Machine']);
            });
          }else{
            swal({
              title: '',
              text: res.message,
              type: 'warning',
              showCancelButton: false,
              confirmButtonText: 'OK'
            });
          }
        },err=>{
          this.spinner.hide();
          this.commonService.handleError(err);
        })
      }else if(this.mode === 'edit'){
        this.commonService.putData(APPSETTINGS.ims_url+AppURLs.SendPlanogramProductsData,this.dataForProductSelection).subscribe((res:any)=>{
          this.spinner.hide();
  
          if(!res.didError){
            swal({
              title: '',
              text: res.message,
              type: 'success',
              showCancelButton: false,
              confirmButtonText: 'OK'
            }).then(result=>{
              this.router.navigate(['/Machine']);

               
            });
          }else{
            swal({
              title: '',
              text: res.message,
              type: 'warning',
              showCancelButton: false,
              confirmButtonText: 'OK'
            });
          }
        },err=>{
          this.spinner.hide();
          this.commonService.handleError(err);
        })
      }

     
    }

  }


  findingWhetherProductAddedOrNot():boolean{

    let isDataAvailable:boolean = true;
    for(let items of this.dataForProductSelection.planogramViewModels){

        if(parseInt(items.itemId) > 0){
          isDataAvailable = false;
          break;
        }

    }

    return isDataAvailable

  }

    /*********************************** End of planogram code ********************************************/
/******************************************End of Machine Creation Code ****************************************************/
    nxtBtnClicked(num){

      let nxt = (<HTMLAnchorElement>document.getElementById('next'));
      let nxtt = (<HTMLAnchorElement>document.getElementById('nextt'));

      let nxttt = (<HTMLAnchorElement>document.getElementById('nexttt'));

      if(num === 1){
        
        // nxt.setAttribute("data-toggle","tab");
        // nxt.href = '';
        //   nxt.href = '#tab2'

        this.tabNum = 1;
      }else if(num === 2){


        this.tabNum = 2;

       
        nxtt.setAttribute("data-toggle","tab");
        nxtt.href = '';
        nxtt.href = '#tab3';

      }else if(num === 3){
        this.tabNum = 3;

      }else if(num === 4){
        this.tabNum = 4;
      }
      this.nextBtnClicked();



    }


    previousBtnClicked(num){


      if(num === 1){
        let nxt = document.getElementById('next');
        nxt.setAttribute('data-toggle','tab');
        
          nxt.setAttribute('data-target','#tab2');
       
        //nxt.setAttribute('href','#tab2');
      }

      if(num === 3){
        let nxt = document.getElementById('nextt');
        nxt.setAttribute('data-toggle','tab');
        
          nxt.setAttribute('data-target','#tab3');
       
        //nxt.setAttribute('href','#tab2');
      }
      if(num === 5){
        let nxt = document.getElementById('nexttt');
        nxt.setAttribute('data-toggle','tab');
        
          nxt.setAttribute('data-target','#tab4');
       
        //nxt.setAttribute('href','#tab2');
      }

      if(num===2){
        alert("called");
          let nxt = document.getElementById('previous');
        nxt.setAttribute("data-toggle","tab");
        nxt.setAttribute('data-target','#tab1');
         // nxt.href = '#tab1'
      }
      if(num===4){
        alert("called");
          let nxt = document.getElementById('previouss');
        nxt.setAttribute("data-toggle","tab");
        nxt.setAttribute('data-target','#tab2');
         // nxt.href = '#tab1'
      }
      // if(num === 2){
      //   let nxt = (<HTMLAnchorElement>document.getElementById('previous'));
      //   nxt.setAttribute("data-toggle","tab");
      //   nxt.href = '';
      //     nxt.href = '#tab1'
      // }else if(num === 3){

      //   let nxt = (<HTMLAnchorElement>document.getElementById('previouss'));
      //   nxt.setAttribute("data-toggle","tab");
      //   nxt.href = '';
      //   nxt.href = '#tab2';

      // }else if(num === 4){

      //   let nxt = (<HTMLAnchorElement>document.getElementById('previousss'));
      //   nxt.setAttribute("data-toggle","tab");
      //   nxt.href = '';
      //   nxt.href = '#tab3';

      // }
    }



    // nexttBtnClicked(){

    //   let nxt = (<HTMLAnchorElement>document.getElementById('next'));
    //   nxt.setAttribute("data-toggle","tab");

    //   // this.currentTab += 1;
    //   // let hreef = '#'+this.navigationKey+(this.currentTab);
    //   // this.commonService.showAlert("href:- "+hreef);
    //   nxt.href = '#tab2';

    // }

    /****************************************** Machine Edit Code ****************************************************/

    GetMachineInfoByMachineId(machineId){

      this.spinner.show();
      this.commonService.getData(APPSETTINGS.operator_base_url+AppURLs.GetMachineInfo+'?machineId='+machineId).subscribe(res=>{
        this.spinner.hide();
 
        if(!res.isError){
          this.commonService.showLog("machine Info from service:-> "+JSON.stringify(res))
          this.dataForMachineBasicDetail = res.model;

        }else{
          swal({
            title: '',
            text: res.message,
            type: 'warning',
            showCancelButton: false,
            confirmButtonText: 'OK'
          }).then(result=>{
            this.router.navigate(['/Machine']);
          })
        }

      },err=>{
        this.spinner.hide();
        this.commonService.handleError(err);
      })

    }



    UpdateMachineBasicInfoOnServer(){
      this.dataForMachineBasicDetail.id = this.editMachineId;
      let msg = this.inputValidationForBasicDetails();
  
      if (msg != '') {
        swal({
          title: '',
          text: msg,
          type: 'warning',
          showCancelButton: false,
          confirmButtonText: 'OK'
        });
      }else{
        // api call
        this.commonService.showAlert('valid data-- proceed to service calling');
  
        this.spinner.show();
        this.commonService.putData(APPSETTINGS.operator_base_url+AppURLs.CreateMachine,this.dataForMachineBasicDetail).subscribe((res:any)=>{
          this.spinner.hide();
          if(!res.isError){
              this.editMachineId = res.model.id;
              swal({
                title: '',
                text: res.message,
                type: 'success',
                showCancelButton: false,
                confirmButtonText: 'OK'
              });
            
  
          }else{
            swal({
              title: '',
              text: res.message,
              type: 'warning',
              showCancelButton: false,
              confirmButtonText: 'OK'
            });
          }
  
        },err=>{
          this.spinner.hide();
  
            this.commonService.handleError(err);
        })
      }
  
  
    }
  


    /******************************************End of Machine Edit Code ****************************************************/


}
