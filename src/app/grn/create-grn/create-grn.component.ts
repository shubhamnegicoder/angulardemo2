import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { CommonService } from '../../core/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup } from '@angular/forms';
import { APPSETTINGS, AppURLs } from '../../core/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-grn',
  templateUrl: './create-grn.component.html',
  styleUrls: ['./create-grn.component.css']
})
export class CreateGrnComponent implements OnInit {
  createForm: FormGroup;
  warehouseList = [];
  vendorList = [];
  whId;
  poList = [];
  poSelected: boolean = false;
  today;
  idData;
  list = [];
  id;
  qty: number = 0;
  qty1;
  data;
  amount;
  amountSelected: boolean = false;
  totalAmount = 0;
  invoiceData;
  invoiceNo = 0;
  inward_qty;
  searched: boolean = false;
  listOfSearch;
  searchresult;
  searchResultId;
  searchResultName;
  searchedValue: boolean = false;
  text;
  id1;
  enteredQty;
  temp_totalQty_holder;
  data1 = {
    warehouse1: '',
    vendor1: '',
    po1: '',
    invoiceNo1: '',
    invoiceDate1: ''
  };
  maxDate;
  constructor(private commonService: CommonService, private spinner: NgxSpinnerService, private router: Router) { }

  ngOnInit() {
    this.commonService.setTitle('UVM-Warehouse-Inbound-Create GRN');
    let now = new Date();
    this.maxDate = now.toISOString().substring(0, 10);
    this.getWarehouseByPendingPo();
    this.today = new Date();
    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
  }

  // ****************To get all warehouse in the dropdown *************************//
  public getWarehouseByPendingPo() {
    this.commonService.getData(APPSETTINGS.ims_url+AppURLs.getWarehouseByPendingPo).subscribe((res:any) => {
      if (res.didError === false) {
        this.warehouseList = res.model;
      }
      else {
        swal({ type: 'warning', text: "Error in processing the request", showConfirmButton: true });
      }
    }, errRes => {
      this.commonService.handleError(errRes);
    }
    );
  }

  // ****************To get all vendors in the dropdown *************************//
  public selectWarehouse(data) {
    this.whId = data.target.value;
    this.commonService.getData(APPSETTINGS.ims_url+AppURLs.getVendorByPendingPo+this.whId).subscribe((res:any) => {
      if (res.didError === false) {
        this.vendorList = res.model;
      }
      else {
        swal({ type: 'warning', text: "Error in processing the request", showConfirmButton: true });

      }
    }, errRes => {
      this.commonService.handleError(errRes);
    }
    );

  }

  // ****************To get all opened po in the dropdown*************************//
  public getOpenPo() {
    if (this.data1.vendor1 == '') {
      swal({ type: 'warning', text: "Please select a vendor first", showConfirmButton: true });
    }
    if (this.data1.warehouse1 == '') {
      swal({ type: 'warning', text: "Please select a warehouse first", showConfirmButton: true });
    }
    if (this.data1.warehouse1 != '' && this.data1.vendor1 != '') {

      this.commonService.getData(APPSETTINGS.ims_url+'api/Inbound/GetOpenPOList?WHId='+this.data1.warehouse1+'&VId='+this.data1.vendor1).subscribe((res:any) => {

        if (res.didError == false) {
          this.poList = res.model;
        }
        else {
          swal({ type: 'warning', text: "Error in processing the request", showConfirmButton: true });
        }
      }, errRes => {
        this.commonService.handleError(errRes);
      }
      );
    }
  }

  // ****************To get all the data in create form*************************//
  public getDivOpen() {
    this.poSelected = true;
    this.idData = this.data1.po1;
    this.spinner.show();
    this.commonService.getData(APPSETTINGS.ims_url+AppURLs.getPOList+this.idData).subscribe((res:any) => {
      this.spinner.hide();
      if (res.didError == false) {
        this.list = res.model.purchaseOrderDetailViewModels;
      }
      else {
        swal({ type: 'warning', text: "Error in processing the request", showConfirmButton: true });
      }
    }, errRes => {
      this.spinner.hide();
      this.commonService.handleError(errRes);
    }
    );
  }

  // ****************To display a change in key up  *************************//
  public keyUpQty(event, conversion, base) {
    var str = event.target.id;
    var id = str.substring(9);
    let inward_qty = event.target.value;
    let po_qty = (document.getElementById('po_qty' + id) as HTMLInputElement).value;

    var enteredQty = event.target.value;
    if (event.key === "Backspace") {
      this.temp_totalQty_holder = (document.getElementById('total_qty') as HTMLInputElement).value;
    } else {
      // this.qty += eval(enteredQty);
    }

    this.updateValues();
  }

  // ****************To update the values of inward quantity  *************************//
  public updateValues() {
    this.qty = 0;
    this.totalAmount = 0;
    for (let i: number = 0; i < this.list.length; i++) {
      let column_qty = (document.getElementById('inwrdqty_' + i) as HTMLInputElement).value;
      if (column_qty === "")
        column_qty = "0";
      let a: number = (eval(column_qty) * this.list[i].conversion * this.list[i].basePrice);
      let temp = Math.round(a * 100) / 100;
      (document.getElementById('amt' + i) as HTMLInputElement).value = temp.toString();
      this.qty += eval(column_qty);
      this.totalAmount += (eval(column_qty) * this.list[i].conversion * this.list[i].basePrice);
    }

  }

  // ****************To display a change in key down  *************************//
  public keyDownQty(event, amt) {
    var str = event.target.id;
    var id = str.substring(9);
    this.id = id;
  }

  // ****************To submit data to create a grn  *************************//
  public submitData() {
    let keepGoing: boolean = true;
    if (this.data1.invoiceNo1 === "" || this.data1.invoiceNo1.trim() === "" || this.data1.invoiceDate1 === "" || this.data1.invoiceDate1.trim() === "") {
      swal({
        type: 'warning',
        text: 'Please fill all the required fields',
        showConfirmButton: true
      });
      keepGoing = false;
    }
    if (keepGoing === true) {
      let isInwardqtyIsLess: boolean = false;
      let isPOQtyAvail: boolean = false;
      var ar = [];
      var tbl_rows = (document.getElementById("myTable") as HTMLTableElement).rows.length;
      for (let i = 0; i < tbl_rows - 1; i++) {
        this.id1 = i;
        var po_qty = (document.getElementById("po_qty" + i) as HTMLInputElement).value;
        var itemId1 = (document.getElementById("itemId_" + i) as HTMLInputElement).value;
        var quant1 = (document.getElementById('inwrdqty_' + i) as HTMLInputElement).value;
        var expiryDate1 = (document.getElementById('expiryDate' + i) as HTMLInputElement).value;
        if (quant1 === '' && quant1.trim() === '') {
          isInwardqtyIsLess = true;
          break;
        }
        if (po_qty < quant1) {
          isPOQtyAvail = true;
          break;
        }
        ar.push({ 'itemId': itemId1, 'quantity': quant1, 'itemExpiryDate': expiryDate1 });
      }
      if (isInwardqtyIsLess) {
        swal({ type: 'warning', text: 'Inward QTY is required', showConfirmButton: true });
      } else {
        this.data = {
          "grnId": "0",
          "poId": this.data1.po1,
          "invoiceNo": this.data1.invoiceNo1,
          "invoiceDate": this.data1.invoiceDate1,
          "gRNDetailRequests": ar 
        };
        
        if (isPOQtyAvail) {
          swal({ type: 'warning', text: "Inward qty should be less than or equal to PO qty", showConfirmButton: true }).then((result) => {
            if (result.value) {
              (document.getElementById('inwrdqty_' + this.id1) as HTMLInputElement).value = "";
              document.getElementById('inwrdqty_' + this.id1).focus();

            }
          });
        } else {
          this.spinner.show();
          this.commonService.postData(APPSETTINGS.ims_url+AppURLs.manageGrn,this.data).subscribe((res:any) => {
            this.spinner.hide();
            if (res.didError === false) {
              swal({
                type: 'success',
                text: res.message,
                showConfirmButton: true
              }).then(result => {
                this.router.navigate(['/Warehouse/GRN']);
              });
            }
            else {
              swal({ type: 'warning', text: "Error in processing the request", showConfirmButton: true });

            }
          }, errRes => {
            this.spinner.hide();
            this.commonService.handleError(errRes);

          }
          );
        }

      }
    }

  }


  public invoChange(data) {
    let invoiceData1 = data.target.value;
    this.invoiceData = invoiceData1;
  }

  // ****************To display a swal for greater quantity *************************// 
  public change(event) {
    var str = event.target.id;
    var id = str.substring(9);
    var temp = document.getElementById('po_qty' + id) as HTMLInputElement;
    var po_qty = temp.value;
    this.enteredQty = event.target.value;
    if (eval(po_qty) < this.enteredQty) {
      swal({ type: 'error', text: "Inward qty should be less than or equal to PO qty", showConfirmButton: true });

    } else {
      this.updateValues();
    }
  }
  
  public back(){
    this.router.navigate(['Grn']);
  }
}
