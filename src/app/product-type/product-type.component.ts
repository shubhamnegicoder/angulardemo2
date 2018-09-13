import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from '../core/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { APPSETTINGS, AppURLs } from '../core/interfaces';

@Component({
  selector: 'app-product-type',
  templateUrl: './product-type.component.html',
  styleUrls: ['./product-type.component.css'] 
})
export class ProductTypeComponent implements OnInit {
  pager: any = {};
  pageSize: number = 10;
  pageNo: number;
  totalRecords: number = 0;
  listDetail: Array<any>;
  searchDetail: Array<any>;
  searchCities: Array<any>;
  searchVendors: Array<any>;
  searchWarehouses: Array<any>;
  show: boolean = false;
  data = {
    "status": "",
    "name": "",
    "sortName": "name",
    "sortType": "desc",
    "pageSize": 10,
    "pageNo": 1
  }
  type_val: any = "";
  editList = {
    "id": "",
    "name": "",
    "isActive": ""
  };

  dataForProdTypeCreation = {
    "id": "",
    "name": "",
    "status": "",
    "isList": "0"
  }
  fileToUpload: any;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeBtn1') closeBtn1: ElementRef;

  @ViewChild('prodTypeNamee') prodTypeNamee: ElementRef;
  @ViewChild('closeBtn2') closeBtn2: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('name') name: ElementRef;
  @ViewChild('status') status: ElementRef;
 
  //call this wherever you want to close modal

  public resetfunction()
  {
      this.data.name=this.name.nativeElement.value=""
      this.data.status=this.status.nativeElement.value=""
      this.getProductTypeList(this.data);
  }
  private closeModal(): void {
    this.prodTypeNamee.nativeElement.value = '';
    this.closeBtn.nativeElement.click(); 
  }

  private closeModal1(): void {
    this.closeBtn1.nativeElement.click();
  }

  private closeModal2(): void {
    this.fileInput.nativeElement.value = '';
    this.closeBtn2.nativeElement.click();
  }
  constructor(private commonService: CommonService,private spinner:NgxSpinnerService ) { }
 
  toggle() {
    this.show = !this.show;
  }


  public optionpage(data) {
    this.pageSize = data.target.value;
    this.data.pageNo = 1
    this.data.pageSize = data.target.value;
    this.getProductTypeList(this.data);
    this.pager = this.commonService.getPager(this.totalRecords, 1, this.pageSize);
  }

  ngOnInit() {
    this.commonService.setTitle('UVM-Catalogue-ProductType');
    this.getProductTypeList(this.data);
    setTimeout(() => {
      this.spinner.hide();

    }, 5000);
  }

  public filteroption(status, name) {
    this.data.status = status;
    this.data.name = name;
    this.setPage(1);
    this.getProductTypeList(this.data);

  }

  setPage(page: number) {
    this.pageNo = page;
    this.data.pageNo = page;
    this.getProductTypeList(this.data);
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);

  }

  firstPage(page: number) {
    this.pageNo = page;
    this.data.pageNo = page;
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);
  }


  public getProductTypeList(data) {
    this.spinner.show();
    this.commonService.postData(APPSETTINGS.ims_url+AppURLs.getProductTypeList,data).subscribe((res:any) => {
      this.spinner.hide();
      this.listDetail = res.model;
      this.totalRecords = res.totalRecord;
      if (data.pageNo == 1)
        this.firstPage(1);
    });

  }

  createProdType(typeName) {
    if (typeName === "") {

      swal({
        title: '',
        text: 'Name is Mandatory',
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'OK'
      });
    } else {
      this.dataForProdTypeCreation.name = typeName;
    this.commonService.postData(APPSETTINGS.ims_url+AppURLs.productType,this.dataForProdTypeCreation).subscribe((response:any) => {
        if (response.didError === false)
          this.type_val = 'success';
        else
          this.type_val = 'warning';
        if (!response.didError) {
          // success case
          // here handle success case
          this.closeModal();
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
              this.getProductTypeList(this.data);
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

  editProdType(depName) {
    //need to call the service from here to create brand.
    if (depName === "") {
      swal({
        title: '',
        text: 'Name is Mandatory',
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'OK'
      });
    } else {
      this.dataForProdTypeCreation.name = depName;
      this.dataForProdTypeCreation.id = this.editList.id;
      this.dataForProdTypeCreation.status = this.editList.isActive;
      this.commonService.putData(APPSETTINGS.ims_url+AppURLs.productType,this.dataForProdTypeCreation).subscribe((response:any) => {
        if (response.didError === false)
          this.type_val = 'success';
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
              this.getProductTypeList(this.data);
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

  editClicked(id) {
    this.listDetail.map((item, key) => {
      if (item.id === id) {
        this.editList = item;
      }
    });
  }

  importAsXLSX() {
    const fi = this.fileInput.nativeElement;
    if (fi.files && fi.files[0]) {
      this.fileToUpload = fi.files[0];
    }
    if (this.fileToUpload) {
      this.commonService.uploadBrand(this.fileToUpload, 1, 'api/ProductType/Import').subscribe((res:any) => {

        if (res) {
          this.fileToUpload = "";
          // show swal showing total number of records uploaded
          // and download file from url
          if (!res.didError && res.model.successCount > 0) {

            this.closeModal2();
            let msgToDisplay = res.model.successCount + '  out of ' + res.model.totalCount + ' total Records imported successfully.';

            swal({
              title: 'Result',
              text: msgToDisplay,
              type: "success",
              showCancelButton: false,
              confirmButtonText: 'OK',
              footer: '<a href="http://103.12.132.77:6002/' + res.model.filePath + '" download="test.xls">click here to download details</a>'
            }).then((result) => {
              if (res.model.filePath !== null && res.model.filePath) {
                this.getProductTypeList(this.data);
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
              type: "error",
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


  changeStatus(id) {
    let currentStatus;
    this.listDetail.filter(item => {
      if (item.id == id)
        currentStatus = item.isActive;
    })
    let msg = "You want to Activate this Product type?"
    let statusToShow = "Successfully Activated Product type..!!"
    if (currentStatus === 1) {
      msg = "You want to Deactivate this Product type?"
      statusToShow = "Successfully Deactivated Product type..!!"
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
        // let objToDel = {
        //   "requestedId": id,
        //   "status": currentStatus
        // }
        this.commonService.deleteData(APPSETTINGS.ims_url+'api/ProductType?Id='+id+'&Status='+currentStatus).subscribe((res:any) => {
          if (!res.didError) {
            // alert("changed successfully");
            this.getProductTypeList(this.data);
            swal(
              'Info',
              statusToShow,
              'success'
            )
          } else {
            //alert("issue in changing status");

            swal(
              'Info',
              res.errorMessage,
              'warning'
            )
          }
        }, err => {
          this.commonService.handleError(err);
        });
      }
    })

  }
resetFunction(myForm:NgForm)
{
   
   this.filteroption('','');
}

}
