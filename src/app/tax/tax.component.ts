import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import swal from 'sweetalert2';
import { CommonService } from '../core/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { APPSETTINGS, AppURLs } from '../core/interfaces';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.css']
})
export class TaxComponent implements OnInit {
  pager: any = {};
  pageSize: number = 10;
  pageNo: number;
  totalRecords: number = 0;
  listDetail: Array<any>;
  searchCities: Array<any>;
  countryList: Array<any>;
  show: boolean = false;
  editList = {
    "taxTotal": "",
    "cess": "",
    "countryId": "",
    "countryName": "",
    "id": "",
    "name": "",
    "isActive": ""
  }
  type_val: any = "";

  data = {
    "status": "",
    "name": "",
    "sortName": "name",
    "sortType": "desc",
    "pageSize": 10,
    "pageNo": 1,
    "countryId": ""
  }

  dataForTaxCreation = {
    "id": "",
    "name": "",
    "igst": "",
    "cess": "",
    "userId": "1",
    "isList": "0",
    "status": "",
    "countryId": ""
  }
  fileToUpload: any;

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeBtn1') closeBtn1: ElementRef;
  @ViewChild('taxName') taxName: ElementRef;
  @ViewChild('tax') tax: ElementRef;
  @ViewChild('cess') cess: ElementRef;
  @ViewChild('closeBtn2') closeBtn2: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('name') name: ElementRef;
  @ViewChild('country') country: ElementRef;
  @ViewChild('status') status: ElementRef;

  //call this wherever you want to close modal
  private closeModal(): void {
    // this.taxName.nativeElement.value = '';
    // this.tax.nativeElement.value = '';
    // this.cess.nativeElement.value = '';
    this.resetDataArr();
    this.closeBtn.nativeElement.click();
  }

  private closeModal1(): void {
    this.closeBtn1.nativeElement.click();
  }
public resetfunction()
{
  this.data.name=this.name.nativeElement.value=""
  this.data.countryId=this.country.nativeElement.value="";
  this.data.status=this.status.nativeElement.value="";
  this.getTaxList(this.data);
}
  private closeModal2(): void {
    this.fileInput.nativeElement.value = '';
    this.closeBtn2.nativeElement.click();
  }
  constructor(private commonService: CommonService, private spinner: NgxSpinnerService) { }

  toggle() {
    this.show = !this.show;
  }


  public optionpage(data) {
    this.pageSize = data.target.value;
    this.data.pageNo = 1
    this.data.pageSize = data.target.value;
    this.getTaxList(this.data);
    this.pager = this.commonService.getPager(this.totalRecords, 1, this.pageSize);
  }

  ngOnInit() {
    this.commonService.setTitle('UVM-Catalogue-Tax');
    this.getCountryList();
    this.getTaxList(this.data);
  }


  getCountryList() {
    this.spinner.show();
    this.commonService.getData(APPSETTINGS.ims_url+AppURLs.allCountry).subscribe((res:any) => {
      this.spinner.hide();
      this.countryList = res.model
    }, err => {

    });
  }

  public filteroption(name, country_id, status) {
    this.data.status = status;
    this.data.name = name;
    this.data.countryId = country_id;
    this.setPage(1);
    this.getTaxList(this.data);

  }

  setPage(page: number) {
    this.pageNo = page;
    this.data.pageNo = page;
    this.getTaxList(this.data);
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);

  }

  firstPage(page: number) {
    this.pageNo = page;
    this.data.pageNo = page;
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);
  }

  public getTaxList(data) {
    this.spinner.show();
    this.commonService.postData(APPSETTINGS.ims_url+AppURLs.getTaxList,data).subscribe((res:any) => {
      this.spinner.hide();
      this.listDetail = res.model;
      this.totalRecords = res.totalRecord;
      if (data.pageNo == 1)
        this.firstPage(1);
    });

  }

  inputValidation(): string {
    let msg = "";
    if (this.dataForTaxCreation.name === "") {
      msg = "Name is Mandatory"
    } else if (this.dataForTaxCreation.igst === "") {
      msg = "Tax is Mandatory"
    } else if (this.dataForTaxCreation.cess === "") {
      msg = "Cess is Mandatory"
    } else if (this.dataForTaxCreation.countryId === "" || this.dataForTaxCreation.countryId === "-1") {
      msg = "Country is Mandatory"
    }
    return msg;
  }

  resetDataArr(){
    this.dataForTaxCreation = {
      "id": "",
      "name": "",
      "igst": "",
      "cess": "",
      "userId": "1",
      "isList": "0",
      "status": "",
      "countryId": ""
    }
  }

  createTax() {
    //need to call the service from here to create brand.
    let msg = this.inputValidation();
    if (msg != "") {

      swal({
        title: '',
        text: msg,
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'OK'
      });
    } else {
      this.commonService.postData(APPSETTINGS.ims_url+AppURLs.createTax,this.dataForTaxCreation).subscribe((response:any) => {
        if (response.didError === false){
          this.type_val = 'success';
          this.dataForTaxCreation.name = "";
          this.dataForTaxCreation.igst ="";
          this.dataForTaxCreation.cess = "";
          this.dataForTaxCreation.countryId = "";
          this.dataForTaxCreation.id ="";
          this.dataForTaxCreation.status = "";
        }
         
        else
          this.type_val = 'warning';


        if (!response.didError) {
          // success case

          this.closeModal();

          swal({
            title: 'Result',
            text: response.model.statusMessage,
            type: this.type_val,
            showCancelButton: false,
            confirmButtonText: 'OK'
          }).then((result) => {
            if (response.didError === true && result.value === true) {
              //alert("ok pressed & if executed")
            } else {
              // alert("ok pressed & else executed")
              this.getTaxList(this.data);
            }
          })



        } else {
          swal({
            title: 'Result',
            text: response.message,
            type: this.type_val,
            showCancelButton: false,
            confirmButtonText: 'OK'
          });
        }

      }, error => {
        this.commonService.handleError(error);
      });
    }
  }


  hideModal() {
    this.closeModal();
  }

  editTax() {
    //need to call the service from here to create brand.
    this.dataForTaxCreation.name = this.editList.name;
    this.dataForTaxCreation.igst = this.editList.taxTotal;
    this.dataForTaxCreation.cess = this.editList.cess;
    this.dataForTaxCreation.countryId = this.editList.countryId;
    this.dataForTaxCreation.id = this.editList.id;
    this.dataForTaxCreation.status = this.editList.isActive;

    let msg = this.inputValidation();
    if (msg != "") {

      swal({
        title: '',
        text: msg,
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'OK'
      });
    } else {
      this.commonService.putData(APPSETTINGS.ims_url+AppURLs.createTax,this.dataForTaxCreation).subscribe((response:any) => {
        if (response.didError === false){
          this.type_val = 'success';
          this.dataForTaxCreation.name = "";
          this.dataForTaxCreation.igst ="";
          this.dataForTaxCreation.cess = "";
          this.dataForTaxCreation.countryId = "";
          this.dataForTaxCreation.id ="";
          this.dataForTaxCreation.status = "";
        }
          
        else
          this.type_val = 'warning';


        if (!response.didError) {
          // success case

          this.closeModal1();

          swal({
            title: 'Result',
            text: response.model.statusMessage,
            type: this.type_val,
            showCancelButton: false,
            confirmButtonText: 'OK'
          }).then((result) => {
            if (response.didError === true && result.value === true) {
              // this.removeModal();
              //alert("ok pressed & if executed")
            } else {
              // alert("ok pressed & else executed")
              this.getTaxList(this.data);
            }
          })

        } else {
          swal({
            title: '',
            text: response.message,
            type: 'warning',
            showCancelButton: false,
            confirmButtonText: 'OK'
          });
        }

      }, error => {
        this.commonService.handleError(error);
      });
    }
  }

  editClicked(id) {
    this.listDetail.map((item, key) => {
      if (item.id === id) {
        this.editList = Object.assign({},item);
      }
    });
  }

  changeStatus(id) {
    let currentStatus;
    this.listDetail.filter(item => {
      if (item.id == id)
        currentStatus = item.isActive;
    })

    let msg = "You want to Activate this Tax?"
    let statusToShow = "Successfully Activated Tax..!!"
    if (currentStatus === 1) {
      msg = "You want to Deactivate this Tax?"
      statusToShow = "Successfully Deactivated Tax..!!"
    }

    swal({
      title: 'Are you sure?',
      text: msg,
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.value) {
        // call service here
        let objToDel = {
          "requestedId": id,
          "userId": 1,
          "status": currentStatus
        }

        this.commonService.deleteData(APPSETTINGS.ims_url+'api/Tax?Id='+id+'&Status='+currentStatus).subscribe((res:any) => {
          if (!res.didError) {
            // alert("changed successfully");
            this.getTaxList(this.data);
            swal(
              '',
              statusToShow,
              'success'
            )
          } else {
            //alert("issue in changing status");

            swal(
              '',
              res.message,
              'warning'
            )
          }
        }, err => {
          this.commonService.handleError(err);
        });
      }
    })

  }


  importAsXLSX() {

    const fi = this.fileInput.nativeElement;
    if (fi.files && fi.files[0]) {
      this.fileToUpload = fi.files[0];
    }
    if (this.fileToUpload) {
      this.commonService.uploadBrand(this.fileToUpload, 1, 'api/Tax/Import').subscribe((res:any) => {

        if (res) {
          this.fileToUpload = "";
          // show swal showing total number of records uploaded
          // and download file from url
          if (!res.didError) {

            this.closeModal2();
            let msgToDisplay = res.model.successCount + '  out of ' + res.model.totalCount + ' total Records imported successfully.';
            let pathToDownloadFile = "";

            if (res.model.filePath !== null && res.model.filePath) {
              pathToDownloadFile = APPSETTINGS.ims_url + res.model.filePath
            }
            swal({
              title: '',
              text: msgToDisplay,
              type: "success",
              showCancelButton: false,
              confirmButtonText: 'OK',
              footer: '<a href="http://103.12.132.77:9006/' + res.model.filePath + '" download="test.xls">click here to download details</a>'
            }).then((result) => {
              if (res.model.filePath !== null && res.model.filePath) {
                this.getTaxList(this.data);
                // this.downloadService.downloadFile(res.model.filePath).subscribe(res1 => {
                //   console.log("response:-> " + res1);
                //   LogUtils.saveAsExcelFile(res1, 'ImportBrandResult.xlsx');

                // }, err => {
                //   console.log("error in downloading file content");
                // })
              }
            })


          } else {
            // handle here the error condition

            swal({
              title: '',
              text: res.message,
              type: "warning",
              showCancelButton: false,
              confirmButtonText: 'OK'
            })

          }


        }
      }, (err: any) => {
        this.commonService.handleError(err);
      });
    } else {
      swal({
        title: '',
        text: 'Please select a file..!!',
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'OK'
      });
    }
  }
}
