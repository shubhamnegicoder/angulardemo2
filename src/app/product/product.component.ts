import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from '../core/services/common.service';
import { AppURLs, APPSETTINGS, Product } from '../core/interfaces';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  // tslint:disable-next-line:no-inferrable-types
  show: boolean = false;
  pager: any = {};
  pageSize = 10;
  pageNo: number;
  totalRecords = 0;
  productList: Array<Product> = [];
  categoryName: Array<any> = [];
  brandName: Array<any> = [];
  productId;
  filePath;
  data = {
    'hsnCode': '',
    'name': '',
    'isActive': '',
    'categoryId': '',
    'brandId': '',
    'uomId': '',
    'sortName': 'name',
    'sortType': 'desc',
    'pageSize': 10,
    'pageNo': 1
  };
  fileToUpload: any;

  @ViewChild('closeBtn2') closeBtn2: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('category') category: ElementRef;
  @ViewChild('brand') brand: ElementRef;
  @ViewChild('status') status: ElementRef;
  @ViewChild('name') name: ElementRef;
  @ViewChild('hsn') hsn: ElementRef;


  // private closeModal2(): void {
  //   this.fileInput.nativeElement.value = '';
  //   this.closeBtn2.nativeElement.click();
  // }
  constructor(private spinner: NgxSpinnerService, private commonService: CommonService) { }

  ngOnInit() {
    this.commonService.setTitle('UVM-Catalogue-Product');
    this.getAllProduct();
    this.selectCategory();
    this.selectBrand();
    setTimeout(() => {
      this.spinner.hide();

    }, 5000);
  }

  public resetfunction() {
    this.data.brandId = this.brand.nativeElement.value = ""
    this.data.name = this.name.nativeElement.value = ""
    this.data.categoryId = this.category.nativeElement.value = ""
    this.data.hsnCode = this.hsn.nativeElement.value = ""
    this.data.isActive = this.status.nativeElement.value = ""
    this.getAllProduct();
  }
  public optionpage(data) {
    this.pageSize = data.target.value;
    this.data.pageNo = 1;
    this.data.pageSize = data.target.value;
    this.getAllProduct();
    this.pager = this.commonService.getPager(this.totalRecords, 1, this.pageSize);
  }
  setPage(page: number) {
    this.pageNo = page;
    this.data.pageNo = page;
    this.getAllProduct();
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);

  }

  firstPage(page: number) {
    this.pageNo = page;
    this.data.pageNo = page;
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);
  }

  toggle() {
    this.show = !this.show;
  }

  getAllProduct() {
    this.spinner.show();
    this.commonService.postData(APPSETTINGS.ims_url + AppURLs.getproduct, this.data).subscribe((res: any) => {
      this.spinner.hide();
      if (!res.didError) {
        this.productList = res.model;
        this.totalRecords = res.totalRecord;
        if (this.data.pageNo === 1) {
          this.firstPage(1);
        }
        if (this.productList === null) {
          swal({
            'type': 'warning',
            'text': res.message,
            'showConfirmButton': true
          });
        }
      } else {
        swal({
          'type': 'warning',
          'text': res.message,
          'showConfirmButton': true
        });
      }
    }, error => {
      this.spinner.hide();
     this.commonService.handleError(error);
    });
  }



  changeStatus(id) {

    let currentStatus;
    this.productList.filter(item => {
      if (item.id == id)
        currentStatus = item.isActive;
    });
    // alert("row status clicked:-> "+id);

    let msg = "You want to Activate this Product?"
    let statusToShow = "Successfully Activated Product..!!"
    if (currentStatus === 1) {
      msg = "You want to Deactivate this Product?"
      statusToShow = "Successfully Deactivated Product..!!"
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
          "status": currentStatus
        }

        this.commonService.deleteData(APPSETTINGS.ims_url+'/api/Item?Id='+id+'&Status='+currentStatus).subscribe((res: any) => {
          if (!res.didError) {
            // alert("changed successfully");
            this.getAllProduct();
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


  importAsXLSX() {

    const fi = this.fileInput.nativeElement;
    if (fi.files && fi.files[0]) {
      this.fileToUpload = fi.files[0];
    }
    if (this.fileToUpload) {
      this.commonService.uploadBrand(this.fileToUpload, 1, APPSETTINGS.ims_url + AppURLs.importProduct).subscribe(res => {

        if (res) {
          this.fileToUpload = "";
          // show swal showing total number of records uploaded
          // and download file from url
          if (!res.didError) {

            // this.closeModal2();
            let msgToDisplay = res.model.successCount + '  out of ' + res.model.totalCount + ' total Records imported successfully.';

            swal({
              title: 'Result',
              text: msgToDisplay,
              type: "success",
              showCancelButton: false,
              confirmButtonText: 'OK',
              footer: '<a href="http://103.12.132.77:6002/' + res.model.filePath + '" >click here to download details</a>'
            }).then((result) => {
              if (res.model.filePath !== null && res.model.filePath) {
                this.getAllProduct();
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


  public selectCategory() {

    this.commonService.getData(APPSETTINGS.ims_url + AppURLs.categoryForDropdown).subscribe((res: any) => {
      if (res.didError === false) {
        this.categoryName = res.model;
      } else {
        swal({
          text: 'Error in processing the request',
          type: 'warning',
          showConfirmButton: true
        });
      }
    }, err => {
      this.commonService.handleError(err);
    }
    );
  }

  public selectBrand() {

    this.commonService.getData(APPSETTINGS.ims_url + AppURLs.brandForDropdown).subscribe((res: any) => {
      if (res.didError === false) {
        this.brandName = res.model;
      } else {
        swal({
          text: 'Error in processing the request',
          type: 'warning',
          showConfirmButton: true
        });
      }
    }, err => {
      this.commonService.handleError(err);
    }
    );
  }

  public searchDetails(category, brand1, name, status, hsn) {
    this.data.hsnCode = hsn;
    this.data.name = name;
    this.data.isActive = status;
    this.data.categoryId = category;
    this.data.brandId = brand1;
    this.getAllProduct();
  }
  public accessId(proId) {
    this.productId = proId;
  }
}