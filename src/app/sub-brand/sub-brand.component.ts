import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import swal from 'sweetalert2';
import { CommonService } from '../core/services/common.service';
import { AppURLs, APPSETTINGS } from '../core/interfaces';

@Component({
  selector: 'app-sub-brand',
  templateUrl: './sub-brand.component.html',
  styleUrls: ['./sub-brand.component.css']
})
export class SubBrandComponent implements OnInit {
  pager: any = {};
  pageSize: number = 10; 
  pageNo: number;
  totalRecords: number = 0;
  listDetail: Array<any>;
  brandList: Array<any>;
  editList = {
    "brandName": "",
    "brandId": "",
    "id": "",
    "name": "",
    "isActive": ""
  }
  brandId: number;
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


  dataForSubBrandCreation = {
    "parentId": "",
    "id": "",
    "name": "",
    "status": "",
    "isList": "1"
  }
  fileToUpload: any;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeBtn1') closeBtn1: ElementRef;
  @ViewChild('subBrandNamee') subBrandNamee: ElementRef;
  @ViewChild('brandd') brandd: ElementRef;
  @ViewChild('closeBtn2') closeBtn2: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('brand') brand: ElementRef;
  @ViewChild('status') status: ElementRef;
  @ViewChild('name') name: ElementRef;
  //call this wherever you want to close modal
  private closeModal(): void {
    this.subBrandNamee.nativeElement.value = '';
    this.brandd.nativeElement.value = '-1';
    this.closeBtn.nativeElement.click();
  }
  private closeModal1(): void {
    this.closeBtn1.nativeElement.click();
  }
  public resetfunction ()
  {
     this.data.name=this.name.nativeElement.value=""
     this.data.status=this.status.nativeElement.value=""
     this.data.parentId=this.brand.nativeElement.value=""
     this.getSubBrandList(this.data);
  }
  private closeModal2(): void {
    this.fileInput.nativeElement.value = '';
    this.closeBtn2.nativeElement.click();
  }
  constructor(private commonService: CommonService) { }

  toggle() {
    this.show = !this.show;
  }


  public optionpage(data) {
    this.pageSize = data.target.value;
    this.data.pageNo = 1
    this.data.pageSize = data.target.value;
    this.getSubBrandList(this.data);
    this.pager = this.commonService.getPager(this.totalRecords, 1, this.pageSize);
  }

  ngOnInit() {
    this.commonService.setTitle('UVM-Catalogue-SubBrand');
    this.getSearchDataSelector();
    this.getSubBrandList(this.data);
  }

  public filteroption(status, name, brandId) {
    this.data.status = status;
    this.data.name = name;
    this.data.parentId = brandId;
    this.setPage(1);
    this.getSubBrandList(this.data);

  }

  setPage(page: number) {
    this.pageNo = page;
    this.data.pageNo = page;
    this.getSubBrandList(this.data);
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);

  }

  firstPage(page: number) {
    this.pageNo = page;
    this.data.pageNo = page;
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);
  }

  public getSubBrandList(data) {
    this.commonService.postData(APPSETTINGS.ims_url+AppURLs.getSubBrand,data).subscribe((res:any) => {
      this.listDetail = res.model;
      this.totalRecords = res.totalRecord;
      if (data.pageNo == 1)
        this.firstPage(1);
    });

  }


  public getSearchDataSelector() {
    this.commonService.getData(APPSETTINGS.ims_url+AppURLs.brandForDropdown).subscribe(res => {
      this.brandList = res.model;
    });
  }


  createSubBrand(subBrandName, brand_id) {
    this.dataForSubBrandCreation.name = subBrandName;
    this.dataForSubBrandCreation.parentId = brand_id
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
      this.commonService.postData(APPSETTINGS.ims_url+AppURLs.createSubBrand,this.dataForSubBrandCreation).subscribe((response:any) => {
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
              this.getSubBrandList(this.data);
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
    if (this.dataForSubBrandCreation.name === "") {
      msg = "Name is Mandatory"
    } else if (this.dataForSubBrandCreation.parentId === "" || this.dataForSubBrandCreation.parentId === "-1") {
      msg = "Brand is Mandatory"
    }

    return msg;
  }


  hideModal() {
    this.closeModal();
  }

  editClicked(id) {
    this.listDetail.map((item, key) => {
      if (item.id === id) {
        this.editList = item;
      }
    });
    this.brandList.forEach(item => {
      if (item.name === this.editList.brandName)
        this.brandId = item.id;
    });
  }

  editSubBrand(subBrandName, brand_id) {
    this.dataForSubBrandCreation.name = subBrandName;
    this.dataForSubBrandCreation.id = this.editList.id;
    this.dataForSubBrandCreation.parentId = brand_id;
    this.dataForSubBrandCreation.status = this.editList.isActive;
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
      this.commonService.putData(APPSETTINGS.ims_url+AppURLs.createSubBrand,this.dataForSubBrandCreation).subscribe((response:any) => {
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
              this.getSubBrandList(this.data);
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

  selectedValue(): string {
    this.brandList.forEach(item => {
      if (item.name === this.editList.brandName)
        this.brandId = item.id;
    });
    return "";
  }

  changeStatus(id) {
    let currentStatus;
    this.listDetail.filter(item => {
      if (item.id == id)
        currentStatus = item.isActive;
    })
    let msg = "You want to Activate this Sub Brand?"
    let statusToShow = "Successfully Activated Sub Brand..!!"
    if (currentStatus === 1) {
      msg = "You want to Deactivate this Sub Brand?"
      statusToShow = "Successfully Deactivated Sub Brand..!!"
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
        this.commonService.deleteData(APPSETTINGS.ims_url+'api/SubBrand?Id='+id+'&Status='+currentStatus).subscribe((res:any) => {
          if (!res.didError) {
            this.getSubBrandList(this.data);
            swal(
              'Info',
              statusToShow,
              'success'
            )
          } else {
            swal(
              'Info',
              res.errorMessage,
              'warning'
            )
          }
        }, err => {
         // alert("error in service");
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
      this.commonService.uploadBrand(this.fileToUpload, 1, 'api/SubBrand/Import').subscribe((res:any) => {

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
                this.getSubBrandList(this.data);
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
