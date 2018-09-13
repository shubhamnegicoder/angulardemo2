import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from '../core/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { APPSETTINGS, AppURLs } from '../core/interfaces';
import swal from 'sweetalert2';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent implements OnInit {
  pager: any = {};
  pageSize: number = 10;
  pageNo: number;
  totalRecords: number = 0;
  listDetail: Array<any>;
  searchDetail: Array<any>;
  searchCities: Array<any>;
  searchVendors: Array<any>;
  searchWarehouses: Array<any>;
  editList = {
    "id": "",
    "name": "",
    "isActive": ""
  };
  show: boolean = false;
  type_val: any = "";


  data = {
    "status": "",
    "name": "",
    "sortName": "name",
    "sortType": "desc",
    "pageSize": 10,
    "pageNo": 1
  }


  dataForBrandCreation = {
    "id": "",
    "name": "",
    "status": "",
    "userId": "1",
    "isList": "0"
  }
  fileToUpload: any;
  brandName1: string = '';
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeBtn1') closeBtn1: ElementRef;
  @ViewChild('closeBtn2') closeBtn2: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;

 @ViewChild('name') name: ElementRef;
 @ViewChild('status') status: ElementRef;

 public resetfunction()
 {
  this.data.name=this.name.nativeElement.value=""
  this.data.status=this.status.nativeElement.value=""
  this.getBrandList(this.data);
 }
  //call this wherever you want to close modal
  private closeModal(): void {
    //this.brand.nativeElement.value = '';
    this.brandName1 = '';

    this.closeBtn.nativeElement.click();
  }

  private closeModal1(): void {
    this.closeBtn1.nativeElement.click();
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
    this.getBrandList(this.data);
    this.pager = this.commonService.getPager(this.totalRecords, 1, this.pageSize);
  }

  ngOnInit() {
    this.getBrandList(this.data);
    setTimeout(() => {
      this.spinner.hide();
    }, 5000);

    this.commonService.setTitle('IMS-Catalogue-Brand');
  }

  public filteroption(status, name) {
    this.data.status = status;
    this.data.name = name;
    this.setPage(1);
    this.getBrandList(this.data);

  }

  setPage(page: number) {
    this.pageNo = page;
    this.data.pageNo = page;
    this.getBrandList(this.data);
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);

  }

  firstPage(page: number) {
    this.pageNo = page;
    this.data.pageNo = page;
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);
  }



  public getBrandList(data) {
    this.spinner.show();
    this.commonService.postData(APPSETTINGS.ims_url+AppURLs.getBrandList,data).subscribe((res:any) => {
      this.spinner.hide();
      this.listDetail = res.model;
      this.totalRecords = res.totalRecord;
      if (data.pageNo == 1)
        this.firstPage(1);
    }, err => {
    });

  }


  createBrand(brandName) {
    //need to call the service from here to create brand.
    if (brandName === "") {
      swal({
        title: '',
        text: 'Brand Name is Mandatory',
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'OK'
      });
    } else {
      this.dataForBrandCreation.name = brandName;
      this.spinner.show();
      this.commonService.postData(APPSETTINGS.ims_url+AppURLs.createBrand,this.dataForBrandCreation).subscribe((response:any) => {

          this.spinner.hide();
        if (response.didError === false)
          this.type_val = 'success';
        else
          this.type_val = 'warning';


        if (!response.didError) {
          // success case

          this.closeModal();



          swal({
            title: '',
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
              this.getBrandList(this.data);
              brandName = "";
            }
          })



        } else {
          swal({
            title: '',
            text: response.message,
            type: this.type_val,
            showCancelButton: false,
            confirmButtonText: 'OK'
          });
        }

      }, error => {
        this.spinner.hide();
        this.commonService.handleError(error);
      });
    }
  }


  hideModal() {
    this.closeModal();
  }

  editBrand(brandName) {
    //need to call the service from here to create brand.
    if (brandName === "") {
      swal({
        title: '',
        text: 'Brand Name is Mandatory',
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'OK'
      });
    } else {
      this.dataForBrandCreation.name = brandName;
      this.dataForBrandCreation.id = this.editList.id;
      this.dataForBrandCreation.status = this.editList.isActive;
      this.commonService.putData(APPSETTINGS.ims_url+AppURLs.createBrand,this.dataForBrandCreation).subscribe((response:any) => {
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
              this.getBrandList(this.data);
              brandName = "";
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
      
      this.commonService.uploadBrand(this.fileToUpload, 1, 'api/Brand/Import').subscribe((res:any) => {

        if (res) {
          this.fileToUpload = "";
          // show swal showing total number of records uploaded
          // and download file from url
          if (!res.didError) {

            this.closeModal2();
            let msgToDisplay = res.model.successCount + '  out of ' + res.model.totalCount + '  Records imported successfully.';


            swal({
              title: 'Result',
              text: msgToDisplay,
              type: "success",
              showCancelButton: false,
              confirmButtonText: 'OK',
              footer: '<a href="http://103.12.132.77:6002/' + res.model.filePath + '" download="test.xls">click here to download details</a>'
            }).then((result) => {
              if (res.model.filePath !== null && res.model.filePath) {
                this.getBrandList(this.data);

              }
            })


          } else {
            // handle here the error condition

            swal({
              title: 'Result',
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
    //  alert("row status clicked:-> "+currentStatus);

    let msg = "You want to Activate this Brand?"
    let statusToShow = "Successfully Activated Brand..!!"
    if (currentStatus === 1) {
      msg = "You want to Deactivate this Brand?"
      statusToShow = "Successfully Deactivated Brand..!!"
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
        this.commonService.deleteData(APPSETTINGS.ims_url+'api/Brand?Id='+id+'&Status='+currentStatus).subscribe((res:any) => {
          if (!res.didError) {
            // alert("changed successfully");
            this.getBrandList(this.data);
            swal(
              'Info',
              statusToShow,
              'success'
            );
          } else {
            //alert("issue in changing status");

            swal(
              'Info',
              res.errorMessage,
              'warning'
            );
          }
        }, err => {
         // alert('error in service');
        });
      }
    })

  }

}
