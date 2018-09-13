import { Component, OnInit , ViewChild, ElementRef} from '@angular/core';
import { CommonService } from '../core/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { APPSETTINGS, AppURLs } from '../core/interfaces';
import swal from 'sweetalert2';

@Component({
  selector: 'app-product-margin',
  templateUrl: './product-margin.component.html',
  styleUrls: ['./product-margin.component.css']
})
export class ProductMarginComponent implements OnInit {
  pager: any = {};
  pageSize: number = 10;
  pageNo: number;
  totalRecords: number = 0;
  listDetail: Array<any>;
  cityList: Array<any>;
  itemList: Array<any>;

  show: boolean = false;
  type_val: any = "";
  editList = {
    "id": "",
    "itemId": "",
    "status": "",
    "userId": "1",
    "cityId": "",
    "margin": ""
  }
  selectedItemMargin: any;
  data = {
    "status": "",
    "itemId": "",
    "cityId": "",
    "sortName": "itemId",
    "sortType": "desc",
    "pageSize": 10,
    "pageNo": 1
  }

  dataForMarginCreation = {
    "id": "",
    "itemId": "",
    "status": "",
    "userId": "1",
    "cityId": "",
    "margin": ""
  }

  fileToUpload: any;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeBtn1') closeBtn1: ElementRef;
  @ViewChild('city') city: ElementRef;
  @ViewChild('item') item: ElementRef;
  @ViewChild('status') status: ElementRef;

public resetfunction()

{
 this.data.cityId=this.city.nativeElement.value=""
 this.data.itemId=this.item.nativeElement.value=""
 this.data.status=this.status.nativeElement.value=""
 this.getItemMarginList(this.data);

}
  private closeModal(): void {

    this.closeBtn.nativeElement.click();
  }

  private closeModal1(): void {
    this.closeBtn1.nativeElement.click();
  }
  constructor(private commonService: CommonService, private spinner: NgxSpinnerService) { }

  toggle() {
    this.show = !this.show;
  }


  public optionpage(data) {
    this.pageSize = data.target.value;
    this.data.pageNo = 1
    this.data.pageSize = data.target.value;
    this.getItemMarginList(this.data);
    this.pager = this.commonService.getPager(this.totalRecords, 1, this.pageSize);
  }

  ngOnInit() {
    this.commonService.setTitle('UVM-Catalogue-ProductMargin');
    this.getSelectorData();
    this.getItemMarginList(this.data);
    setTimeout(() => {
      this.spinner.hide();

    }, 5000);
  } 


  getSelectorData() {
    this.spinner.show();
    this.commonService.getData(APPSETTINGS.ims_url+AppURLs.getItemMargin).subscribe((res:any) => {
      this.spinner.hide();
      this.cityList = res.model.cities;
      this.itemList = res.model.items;
    }, err => {
     
    });
  }

  public filteroption(city_id, item_id, status) {
    this.data.status = status;
    this.data.cityId = city_id;
    this.data.itemId = item_id;
    this.setPage(1);
    this.getItemMarginList(this.data);
  }

  setPage(page: number) {
    this.pageNo = page;
    this.data.pageNo = page;
    this.getItemMarginList(this.data);
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);
  }

  firstPage(page: number) {
    this.pageNo = page;
    this.data.pageNo = page;
    this.pager = this.commonService.getPager(this.totalRecords, page, this.pageSize);
  }

  public getItemMarginList(data) {
    this.spinner.show();
    this.commonService.postData(APPSETTINGS.ims_url+AppURLs.getItemMarginList,data).subscribe((res:any) => {
      this.spinner.hide();
      this.listDetail = res.model;
      this.totalRecords = res.totalRecord;
      if (data.pageNo == 1)
        this.firstPage(1);
    });

  }

  hideModal() {
    this.closeModal();
  }

  changeStatus(id) {
    let currentStatus;
    this.listDetail.filter(item => {
      if (item.id == id)
        currentStatus = item.isActive;
    })
    let msg = "You want to Activate this Product Margin?"
    let statusToShow = "Successfully Activated Product Margin..!!"
    if (currentStatus === 1) {
      msg = "You want to Deactivate this Product Margin?"
      statusToShow = "Successfully Deactivated Product Margin..!!"
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

        this.commonService.deleteData(APPSETTINGS.ims_url+'api/ItemMargin?Id='+id+'&Status='+currentStatus).subscribe((res:any) => {
          if (!res.didError) {
            // alert("changed successfully");
            this.getItemMarginList(this.data);
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

  resetDataArr() {
    this.dataForMarginCreation = {
      "id": "",
      "itemId": "",
      "status": "",
      "userId": "1",
      "cityId": "",
      "margin": ""
    }
  }

  inputValidation(): string {

    let msg = "";
    if (this.dataForMarginCreation.cityId === "" || this.dataForMarginCreation.cityId === "-1") {
      msg = "City is Mandatory"
    } else if (this.dataForMarginCreation.itemId === "" || this.dataForMarginCreation.itemId === "-1") {
      msg = "Item is Mandatory"
    } else if (this.dataForMarginCreation.margin === "") {
      msg = "Margin is Mandatory"
    }

    return msg;
  }

  createItemMargin() {
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
      this.commonService.postData(APPSETTINGS.ims_url+AppURLs.itemMargin,this.dataForMarginCreation).subscribe((response:any) => {
        if (!response.didError)
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
            if (response.model.statusMessage !== 'Successfully Inserted' && result.value === true) {
              // this.removeModal();
              //alert("ok pressed & if executed")
            } else {
              // alert("ok pressed & else executed")
              this.getItemMarginList(this.data);
            }
          })



        } else {
          swal({
            title: 'Result',
            text: response.message,
            type: 'error',
            showCancelButton: false,
            confirmButtonText: 'OK'
          });

        }

      }, error => {
        this.commonService.handleError(error);
      });
    }

  }

  // edit item margin methods


  editItemMargin() {
    //need to call the service from here to create brand.
    this.dataForMarginCreation.cityId = this.editList.cityId;
    this.dataForMarginCreation.id = this.editList.id;
    this.dataForMarginCreation.status = this.editList.status;
    this.dataForMarginCreation.itemId = this.editList.itemId;
    this.dataForMarginCreation.margin = this.editList.margin;

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
      this.commonService.putData(APPSETTINGS.ims_url+AppURLs.itemMargin,this.dataForMarginCreation).subscribe((response:any) => {
        if (response.model.statusMessage === 'Successfully Updated')
          this.type_val = 'success';
        else
          this.type_val = 'warning';


        if (!response.didError) {
          // success case
          if (response.model.statusMessage === 'Successfully Updated') {
            // here handle success case
            this.closeModal1();
          } else {
            //here handle already exist case
            // alert(response.model.statusMessage);
          }

          swal({
            title: 'Result',
            text: response.model.statusMessage,
            type: this.type_val,
            showCancelButton: false,
            confirmButtonText: 'OK'
          }).then((result) => {
            if (response.model.statusMessage !== 'Successfully Updated' && result.value === true) {
              // this.removeModal();
              //alert("ok pressed & if executed")
            } else {
              // alert("ok pressed & else executed")
              this.getItemMarginList(this.data);
            }
          })



        } else {
          swal("Error in processing your request.");
        }

      }, error => {
        this.commonService.handleError(error);
      });
    }


  }

  editClicked(id) {
    this.listDetail.map((item, key) => {
      if (item.id === id) {
        this.selectedItemMargin = item;
        this.editList.id = this.selectedItemMargin.id;
        this.editList.cityId = this.selectedItemMargin.cityId;
        this.editList.itemId = this.selectedItemMargin.itemId;
        this.editList.status = this.selectedItemMargin.status;
        this.editList.margin = this.selectedItemMargin.margin;
      }
    });
  }

}
