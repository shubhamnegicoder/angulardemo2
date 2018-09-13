import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../core/services/common.service';
import { APPSETTINGS, AppURLs } from '../core/interfaces';
import swal from 'sweetalert2';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.css']
})
export class SubCategoryComponent implements OnInit {
  pager: any = {};
  pageSize: number = 10;
  pageNo: number;
  totalRecords: number = 0;
  listDetail: Array<any>;
  categoryList: Array<any>;
  editList = {
    "categoryName": "",
    "categoryId": "",
    "id": "",
    "name": "",
    "isActive": ""
  }

  show: boolean = false;

  data = {
    "status": "",
    "name": "",
    "parentId": "",
    "sortName": "name",
    "sortType": "desc",
    "pageSize": 10,
    "pageNo": 1,
    "isList": "1",
  }
  
  type_val: any = "";


  dataForSubCategoryCreation = {
    "parentId": "",
    "id": "",
    "name": "",
    "status": "",
    "isList": "0"
  }
  fileToUpload: any;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeBtn1') closeBtn1: ElementRef;
  @ViewChild('subBrandNamee') subBrandNamee: ElementRef;
  @ViewChild('brandd') brandd: ElementRef;

  @ViewChild('closeBtn2') closeBtn2: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('name') name: ElementRef;
  @ViewChild('category') category: ElementRef;
  @ViewChild('status') status: ElementRef;
  //call this wherever you want to close modal
  private closeModal(): void {
    this.subBrandNamee.nativeElement.value = '';
    this.brandd.nativeElement.value = '-1';
    this.closeBtn.nativeElement.click();
  }

  private closeModal1(): void {
    this.closeBtn1.nativeElement.click();
  }
  private closeModal2(): void {
    this.fileInput.nativeElement.value = '';
    this.closeBtn2.nativeElement.click();
  }
  constructor(private spinner: NgxSpinnerService, private commonService: CommonService) { }
 
  public resetfunction()
  {
    this.data.name=this.name.nativeElement.value="";
    this.data.status=this.status.nativeElement.value="";
    this.data.parentId=this.category.nativeElement.value="";
    this.getSubCategoryList(this.data);
  }

toggle() {
  this.show = !this.show;
}

public optionpage(data) {
  this.pageSize = data.target.value;
  this.data.pageNo = 1
  this.data.pageSize = data.target.value;
  this.getSubCategoryList(this.data);
  this.pager = this.commonService.getPager(this.totalRecords, 1, this.pageSize);
}

ngOnInit() {
  this.commonService.setTitle('UVM-Catalogue-SubCategory');
  this.getSearchDataSelector();
  this.getSubCategoryList(this.data);
  setTimeout(() => {
    this.spinner.hide();
  }, 5000);
}

public filteroption(status, name, categoryId) {
  this.data.status = status;
  this.data.name = name;
  this.data.parentId = categoryId;
  this.setPage(1);
  this.getSubCategoryList(this.data);

}

setPage(page: number) {
  this.pageNo = page;
  this.data.pageNo = page;
  this.getSubCategoryList(this.data);
  this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);

}

firstPage(page: number) {
  this.pageNo = page;
  this.data.pageNo = page;
  this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);
}

public getSubCategoryList(data) {
  this.spinner.show();
  this.commonService.postData(APPSETTINGS.ims_url+AppURLs.getSubCategoryList,data).subscribe((res:any) => {
    this.spinner.hide();
    this.listDetail = res.model;
    this.totalRecords = res.totalRecord;
    if (data.pageNo == 1)
      this.firstPage(1);
  });

}


public getSearchDataSelector() {
  this.commonService.getData(APPSETTINGS.ims_url+AppURLs.categoryForDropdown).subscribe((res:any) => {
    this.categoryList = res.model;
  });
}


createSubCategory(subBrandName, brand_id) {
  this.dataForSubCategoryCreation.name = subBrandName;
  this.dataForSubCategoryCreation.parentId = brand_id
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
    this.commonService.postData(APPSETTINGS.ims_url+AppURLs.createSubCategory,this.dataForSubCategoryCreation).subscribe((response:any) => {
      if (response.didError === false)
        this.type_val = 'success';
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
            // this.removeModal();
            //alert("ok pressed & if executed")
          } else {
            // alert("ok pressed & else executed")
            this.getSubCategoryList(this.data);
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

editSubCategory(subBrandName, brand_id) {
  this.dataForSubCategoryCreation.name = subBrandName;
  this.dataForSubCategoryCreation.id = this.editList.id;
  this.dataForSubCategoryCreation.parentId = brand_id;
  this.dataForSubCategoryCreation.status = this.editList.isActive;
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
    this.commonService.putData(APPSETTINGS.ims_url+AppURLs.createSubCategory,this.dataForSubCategoryCreation).subscribe((response:any) => {
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
            this.getSubCategoryList(this.data);
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


inputValidation(): string {
  let msg = "";
  if (this.dataForSubCategoryCreation.name === "") {
    msg = "Name is Mandatory"
  } else if (this.dataForSubCategoryCreation.parentId === "" || this.dataForSubCategoryCreation.parentId === "-1") {
    msg = "Category is Mandatory"
  }
  return msg;
}

hideModal() {
  this.closeModal();
}

selectedValue(): number {
  this.categoryList.forEach(item => {
    if (item.name === this.editList.categoryName)
      return item.id;
  });
  return -1;
}


changeStatus(id) {
  let currentStatus;
  this.listDetail.filter(item => {
    if (item.id == id)
      currentStatus = item.isActive;
  })

  let msg = "You want to Activate this Sub Category?"
  let statusToShow = "Successfully Activated Sub Category..!!"
  if (currentStatus === 1) {
    msg = "You want to Deactivate this Sub Category?"
    statusToShow = "Successfully Deactivated Sub Category..!!"
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
      this.commonService.deleteData(APPSETTINGS.ims_url+'api/SubCategory?Id='+id+'&Status='+currentStatus).subscribe((res:any) => {
        if (!res.didError) {
          // alert("changed successfully");
          this.getSubCategoryList(this.data);
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
    this.commonService.uploadBrand(this.fileToUpload, 1, 'api/SubCategory/Import').subscribe((res:any) => {

      if (res) {
        this.fileToUpload = "";
        // show swal showing total number of records uploaded
        // and download file from url
        if (!res.didError && res.model.successCount > 0) {

          this.closeModal2();
          let msgToDisplay = res.model.successCount + '  out of ' + res.model.totalCount + '  Records imported successfully.';

          swal({
            title: '',
            text: msgToDisplay,
            type: "success",
            showCancelButton: false,
            confirmButtonText: 'OK',
            footer: '<a href="http://103.12.132.77:6002/' + res.model.filePath + '" download="test.xls">click here to download details</a>'
          }).then((result) => {
            if (res.model.filePath !== null && res.model.filePath) {
              this.getSubCategoryList(this.data);
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
