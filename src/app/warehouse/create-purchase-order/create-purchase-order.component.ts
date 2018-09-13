import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../core/services/common.service';
import swal from 'sweetalert2';
import { AppURLs, APPSETTINGS } from '../../core/interfaces';

@Component({
  selector: 'app-create-purchase-order',
  templateUrl: './create-purchase-order.component.html',
  styleUrls: ['./create-purchase-order.component.css']
})
export class CreatePurchaseOrderComponent implements OnInit {

  qty = 0;
  show3: boolean;
  show1: boolean = false;
  autoresponse: Array<any>;
  selectedresponse: Array<any> = [];
  selectedfinal: Array<any> = [];
  selectedfinallist: Array<any> = [];
  filterdresult: Array<any>;
  searchresult: String;
  searchresultid: String;
  searchvalue: boolean = false;
  addeditem: Array<any> = [];
  po: Array<any>;
  checkboxvalue;

  checkvalue = false;
  time: any = new Date();
  city: Array<any>;
  warehouse: Array<any>;
  vendor: Array<any>;
  vendorAdd: string = "";
  poDetailsArray: Array<any> = [];
  poselectfinalitem: Array<any> = [];
  po_id: string = "";
  wId: string = "";
  vId: string = "";
  city_id: string = "";

  data = {
    "userId": "",
    "whId": "",
    "vendorId": "",
    "cityId": "",
    "poId": "",
    "pODetailRequestModels": this.poDetailsArray
  }
  nameresponse: Array<any> = [];
  showselected: boolean;
  special: string;
  poselectitem: Array<any> = [];
  show2: boolean = false;
  ismodal: boolean;
  ismodal2: boolean;
  abbs: boolean = false;
  today = new Date().toJSON().split('T')[0];

  constructor(private router: Router, private commonservice: CommonService) {
  }
  toggle1() {
    this.show1 = true;
  }
  toggle2() {
    this.show1 = false;
  }
  toggle3() {
    this.show3 = true;
    this.searchvalue = false;
  }
  toggle4() {
    this.show3 = false;
    this.showselected = false;
  }
  toggleshow2() {
    this.show2 = true;
  }
  show2false() {
    this.show2 = false;

  }
  ngOnInit() {
    this.commonservice.setTitle('UVM-Warehouse-Inbound-Create PO');
    this.getcity();
  }
  // *************for required field*************
  reqfield(city, warehouse, vendor, isSpecial) {
    if (city == "" || warehouse == "" || vendor == "") {
      this.ismodal = false;
      this.ismodal2 = false;
      swal({
        title: "Error!",
        text: "First Select Required Fields ",
        type: "warning",
        showCancelButton: false,
        confirmButtonText: 'OK'
      });

    }
    else {
      this.ismodal = true;
      this.ismodal2 = true;
    }
    return this.ismodal;
  }

  // ********for auto complete item list*****************
  auto(e) {
    let len = e.target.value.length;
    if (e.target.value.replace(/\s/g, "").length >= 2) {
      this.commonservice.getData(APPSETTINGS.ims_url+AppURLs.getAutoName+e.target.value).subscribe(res => {
        this.filterdresult = res.model;
        // console.log(this.filterdresult, "");
        if (this.selectedfinallist.length != 0) {

          this.selectedfinallist.forEach((element) => {
            this.filterdresult = this.filterdresult.filter(item => element.id !== item.id);

          })

        }
        if (this.nameresponse.length != 0) {

          this.nameresponse.forEach((element) => {
            this.filterdresult = this.filterdresult.filter(item => element.id !== item.id);

          })

        }
        if (this.addeditem.length != 0) {
          this.addeditem.forEach((element) => {
            this.filterdresult = this.filterdresult.filter(item => element.id !== item.id)
          })
        }
        if (this.filterdresult != null && this.filterdresult.length != 0) {
          this.searchvalue = true;

        }
        else {
          swal({
            title: "Error!",
            text: "No record Found",
            type: "warning",
            showCancelButton: false,
            confirmButtonText: 'OK'
          });
          this.searchresult = "";
          this.searchvalue = false;
        }
      })
    }
    else {
      //console.log("else");
    }

  }
  // ****************for select item event*************************
  searchevent(e,ware,vendor,city,isSpecial) {
    this.searchresult = e.target.innerText;
    this.searchvalue = false;
    this.searchresultid = e.target.id;
    // alert('');
    this.posearchlist('', this.searchresult, ware, vendor, city, isSpecial);

  }

  // ****************for select all items checkbox*************************
  public checkbox(e) {
    this.abbs = true;
    let count = 0;
    if (e.target.checked == true) {
      this.nameresponse.forEach((item) => {
        if (item.quantity == null) {
          swal({
            title: "Error!",
            text: "please select valid quantity ",
            type: "warning",
            showCancelButton: false,
            confirmButtonText: 'OK'
          });
          this.checkvalue = false;
          e.target.checked = false;
          this.abbs = false;
          count++

        }
      });
      if (count == 0) {
        this.checkvalue = true;
        this.nameresponse.forEach(item=>{
          this.selectedresponse.push(item);
        })
        // this.selectedresponse = this.nameresponse;
      }


    }
    else if (e.target.checked == false) {
      this.checkvalue = false;
      this.selectedresponse = [];
    }
    //this.nameresponse=[];

  }
  closename() {

    this.nameresponse = [];
    this.selectedfinallist = [];
    this.toggle4();
    this.searchresult = "";
  
  }

  // ****************for get city selector*************************
  public getcity() {
    this.commonservice.getData(APPSETTINGS.ims_url+AppURLs.getWHCity).subscribe(res => {
      this.city = res.model;
    })
  }
  // ****************for get warehouse selector*************************
  public cityselector(e) {
    this.commonservice.getData(APPSETTINGS.ims_url+AppURLs.getWHbyCity+e.target.value).subscribe(res => {
      this.warehouse = res.model.warehouses;
      this.vendor = res.model.vendors;
      this.vendorAdd="";
      this.data.whId="";
      this.data.vendorId="";
    })

  }

  // ****************for polist selector*************************
  public polist(warehouse, vendor) {
    //console.log(warehouse, vendor, "daa");
    this.commonservice.getData(APPSETTINGS.ims_url+AppURLs.getPoList+ warehouse+'&VId='+  vendor).subscribe((res:any) => {

      this.po = res.model;
    })
  }

  // ****************for selected item list by name*************************
  public goselect() {
    this.abbs = false;
    let count = 0;
    this.checkvalue = false;
    if (this.selectedresponse.length != 0) {
      this.selectedresponse.forEach((item) => {
        if (item.quantity == null) {
          count++;
          swal({
            title: "Error!",
            text: "please select valid quantity ",
            type: "warning",
            showCancelButton: false,
            confirmButtonText: 'OK'
          })
        }
        else if (count == 0) {
          this.showselected = true;
          if (this.selectedfinallist.filter(data => data.id == item.id).length == 0) {
            this.selectedfinallist.push(item);
          }
          this.selectedresponse=[];
          this.nameresponse=[];
        }
      })
    }
    else {
      swal({
        title: "Error!",
        text: "first select the atleast one item for PO ",
        type: "warning",
        showCancelButton: false,
        confirmButtonText: 'OK'
      });

    }

  }

  // ****************for po search item list*************************
  public posearchlist(po, name, ware, vendor, city, isSpecial) {
    // alert('k');
    this.po_id = po;
    this.wId = ware;
    this.vId = vendor;
    this.city_id = city;
    if (isSpecial == true) {
      this.special = '1';
    }
    else {
      this.special = "";
    }
    if (po && name == "") {
      //alert('po');
      this.commonservice.postData(APPSETTINGS.ims_url+AppURLs.searchPoitem,{
        "cityId": city,
        "itemName": "",
        "selectedItems": "",
        "whId": ware,
        "poId": po,
        "vendorId": vendor,
        "userId": "1",
        "isSpecial": this.special
      }).subscribe((res:any) => {
        this.autoresponse = res.model;
        // console.log(this.autoresponse,"select po")
        if (this.poselectitem.length == 0) {
          this.poselectitem = this.autoresponse;
        }
        else {
          this.autoresponse.forEach(item => {
            if (this.poselectitem.filter(data => data.id == item.id).length == 0) {
              this.poselectitem.push(item);
            }
          });


        }
        this.poselectitem.forEach(item => {
          if (this.poselectfinalitem.filter(data => data.id == item.id).length == 0) {
            this.poselectfinalitem.push(item);
          }
        });

      })

      this.toggle2();
    }
    else if (name != "") {
      this.commonservice.postData( APPSETTINGS.ims_url+AppURLs.searchPoitem,{
        "cityId": city,
        "itemName": name,
        "selectedItems": "",
        "whId": ware,
        "poId": po,
        "vendorId": vendor,
        "userId": "1",
        "isSpecial": this.special
      }).subscribe((res:any) => {
        res.model.forEach(item => {
          if (this.selectedfinallist.filter(data => data.id == item.id).length == 0 && this.nameresponse.filter(data => data.id == item.id).length == 0 && this.addeditem.filter(data => data.id == item.id).length == 0) {
            this.nameresponse.push(item);
          }
        })
        //this.nameresponse = res.model 
        this.toggle3();

      })

    }
    else {
      swal({
        title: "Error!",
        text: "please search item by Name",
        type: "warning",
        showCancelButton: false,
        confirmButtonText: 'OK'
      });

    }
  }

  // ****************for vendor details*************************
  public vendordetail(e) {
    alert(e.target.value+'vendor');
    this.commonservice.getData(APPSETTINGS.ims_url+AppURLs.vendorAddDetail+e.target.value
    ).subscribe((res:any) => {
      //console.log(res.model,"venderaddress");
      this.vendorAdd += res.model.address1 + res.model.address2 + res.model.address3;
      // console.log(this.vendorAdd, "res.model");
    })

  }
  // ****************for remove final selected list*************************
  public removeitem(value) {
    this.addeditem.forEach((item) => {
      if (item.id == value) {
        let index = this.addeditem.indexOf(item);
        this.addeditem.splice(index, 1);
      }
    })
  }
  // ****************for remove by name selected list*************************
  public removeitem2(value) {
    this.selectedfinallist.forEach((item) => {
      if (item.id == value) {
        let index = this.selectedfinallist.indexOf(item);
        this.selectedfinallist.splice(index, 1);
      }
    })
  }

  // ****************for checkbox click event*************************
  public singlecheck(e, value, val, qty) {
    if (val == 'search') {
      if (e.target.checked == true) {
        this.nameresponse.forEach((item) => {
          if (item.id == value) {
            if (qty != null) {
              this.selectedresponse.push(item);
            }
            else {
              swal({
                title: "Error!",
                text: "Enter some valid quantity",
                type: "warning",
                showCancelButton: false,
                confirmButtonText: 'OK'
              });

              e.target.checked = false;
            }
          }
        })
      }
      else if (e.target.checked == false) {
        this.nameresponse.forEach((item) => {
          if (item.id == value) {
            let index = this.selectedresponse.indexOf(item.id);
            this.selectedresponse.splice(index, 1);
          }
          if( this.selectedresponse.length==0){
            this.abbs=false;
            this.checkvalue=false;
          }

        })
      }
    }
    else if (val == 'poselect') {
      console.log("added item :" + this.addeditem);
      let index = this.poselectfinalitem.findIndex(item => item.id === value);
      // alert("index number"+index);
      this.poselectfinalitem.splice(index, 1);
      console.log("added item :" + this.poselectfinalitem);
    }

  }
  // ****************for submit by name search modal*************************
  public bynamelist(e) {
    if (this.selectedfinallist.length != 0) {
      this.toggle1();
      this.selectedfinallist.forEach((item) => {
        item.expiryDate = "";
        if (this.addeditem.filter(data => data.id == item.id).length == 0) {
          this.addeditem.push(item);
        }
        this.ismodal = false;
        this.show3 = false;
        this.showselected = false;
        this.selectedfinallist = [];
      })
      //  console.log(this.addeditem,'adddddddedeed');

    }
    else {
      this.ismodal = true;
      swal({
        title: "Error!",
        text: "select atleast one item",
        type: "warning",
        showCancelButton: false,
        confirmButtonText: 'OK'
      });


    }
  }
  // ******back*****
  back() {
    this.router.navigate(['/Warehouse/PurchaseOrder']);
  }
  // ****************for submit by po search modal*************************
  public byposelect(e) {
    if (this.poselectfinalitem.length == 0) {
      swal({
        title: "Error!",
        text: "please select atleast one po",
        type: "warning",
        showCancelButton: false,
        confirmButtonText: 'OK'
      });

      this.ismodal2 = true;
    }
    if (this.poselectfinalitem.length != 0) {
      let num = 0;
      this.poselectfinalitem.forEach(item => {
        if (item.quantity == null) {
          swal({
            title: "Error!",
            text: "Enter some postive quantity",
            type: "warning",
            showCancelButton: false,
            confirmButtonText: 'OK'
          });
          num++;
        }
      })
      if (num == 0) {
        this.poselectfinalitem.forEach(item => {
          item.expiryDate = "";
          if (this.addeditem.filter(data => data.id == item.id).length == 0) {
            this.addeditem.push(item);
          }

        })
        this.toggle1();
        this.ismodal2 = false;
        this.poselectfinalitem = [];
      }

    }

  }

  // ****************for final create po submit*************************
  public submitPO() {
    this.createDataForPOCreation();
    //console.log(this.poDetailsArray,"podetails");
    if (this.poDetailsArray.length != 0) {

      this.data.vendorId = this.vId;
      this.data.whId = this.wId;
      this.data.poId = "";
      this.data.userId = "1";
      this.data.cityId = this.city_id;
      this.data.pODetailRequestModels = this.poDetailsArray;


      this.commonservice.postData(APPSETTINGS.ims_url+AppURLs.CreatePO ,this.data).subscribe((res:any) => {
        console.log(res, "create po response");
        if (!res.didError) {
          swal({
            title: "Success!",
            text: "Po created successfully",
            type: "success",
            showCancelButton: false,
            confirmButtonText: 'OK'
          }).then(result=>{
            this.router.navigate(['/Warehouse/PurchaseOrder']);
          });
          
        }
        else
          swal({
            title: "Error!",
            text: "Error while processing your request ,try again later",
            type: "warning",
            showCancelButton: false,
            confirmButtonText: 'OK'
          });


      }),
        err => {
        //  alert("error in processing");
        }


    }
    else if (this.addeditem.length == 0) {
      swal({
        title: "Error!",
        text: "please Select product items",
        type: "warning",
        showCancelButton: false,
        confirmButtonText: 'OK'
      });
    }
  }

  // ****************for final create po submit*************************
  createDataForPOCreation() {
    this.poDetailsArray = [];
    let count = this.addeditem.length;
    this.addeditem.forEach(item => {
      if (item.quantity == null || item.expiryDate == '') {
        swal({
          title: "Error!",
          text: "Please Select quantity and Expiry Date",
          type: "warning",
          showCancelButton: false,
          confirmButtonText: 'OK'
        });

        count--;
        return false;
      }
    })
    // alert(count);
    if (count == this.addeditem.length) {
      this.addeditem.forEach(item => {
        let createPo: any = {
          "itemId": item.id,
          "quantity": item.quantity,
          "sessionId": " ",
          "itemExpiryDate": item.expiryDate

        }
        this.poDetailsArray.push(createPo);
        console.log(this)

      })

    }
  }

 

}

