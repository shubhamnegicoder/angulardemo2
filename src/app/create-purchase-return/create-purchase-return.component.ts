import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../core/services/common.service';
import swal from 'sweetalert2';
import { AppURLs, APPSETTINGS } from '../core/interfaces';


@Component({
  selector: 'app-create-purchase-return',
  templateUrl: './create-purchase-return.component.html',
  styleUrls: ['./create-purchase-return.component.css']
})
export class CreatePurchaseReturnComponent implements OnInit {
  qty = 0;
  show3: boolean;
  show1: boolean=false;
  autoresponse: Array<any>;
  selectedresponse: Array<any>=[];
  selectedfinal: Array<any>=[];
  selectedfinallist: Array<any>=[];
  filterdresult: Array<any>;
  searchresult: String;
  searchresultid: String;
  searchvalue:boolean = false;
  addeditem:Array<any>=[];
  po: Array<any>;
  checkboxvalue;

  checkvalue=false;
  time: any = new Date();
  city: Array<any>;
  warehouse: Array<any>;
  vendor: Array<any>;
  vendorAdd:string="";
  poDetailsArray: Array<any> = []
  po_id: string = "";
  wId: string = "";
  vId: string = "";
  city_id: string = "";

  data = {
    "userId": "",
    "whId": "",
    "vendorId": "",
    "cityId": "",
    "proId": "",
    "operatorLocationId": "",
    "pRODetailRequestViewModels": []
  }
  nameresponse: Array<any>=[];
  showselected: boolean;
  show2: boolean=false;
  ismodal: boolean;
   abbs: boolean=false;
  pRODetailRequestViewModels: any[];
  selectarray:Array<any>=[];
  stockQ: any;

  constructor(private commonService:CommonService,
    private router:Router) {
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
    this.showselected=false;
  }
  toggleshow2(){
    this.show2=true;
  }
  show2false(){
    this.show2=false;
    
  }
  ngOnInit() {
    this.commonService.setTitle('IMS-Warehouse-Outbound-Create Purchase Return');
    this.getcity();
  }
// *************for required field*************
reqfield(city,warehouse,vendor){
   if(city=="" || warehouse=="" || vendor==""){
    this.ismodal=false;
    swal({
      title: "Error!",
      text: "First Select mandatory Fields",
      type: "warning",
      showCancelButton: false,
      confirmButtonText: 'OK'
    });
  }
  else{
    this.ismodal=true;
  }
  }

  // ********for auto complete item list*****************
  auto(e) {
    let len = e.target.value.length;
    if (len >= 2) {
      this.commonService.getData(APPSETTINGS.ims_url+AppURLs.getAutoName+e.target.value).subscribe(res => {
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
        if(this.addeditem.length!=0){
          this.addeditem.forEach((element)=>{
          this.filterdresult=this.filterdresult.filter(item => element.id !== item.id)
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
          this.searchresult="";
          this.searchvalue = false;
        }
      })
    }
    else {
     
      //console.log("else");

    }

  }
  // ****************for select item event*************************
  searchevent(e,ware,vandor,city) {
    this.searchresult = e.target.innerText;
    this.searchvalue = false;
    this.searchresultid = e.target.id;
    this.prosearchlist( this.searchresult,ware,vandor,city)
  }

   // ****************for select all items checkbox*************************
  public checkbox(e){
    this.abbs=true;
    if(e.target.checked==true){
     // alert("first");
      this.nameresponse.forEach((item)=>{
            if(item.quantity==null || parseInt(item.quantity)==0 || parseInt(item.quantity) > parseInt(item.stockQ))
            {

              swal({
                title: "Error!",
                text:"please select stock type and at least 1 or less than stock qty",
                type: "warning",
                showCancelButton: false,
                confirmButtonText: 'OK'
              });
              e.target.checked=false;
              this.abbs=false;
            }
            else{
              this.checkvalue=true;
              this.selectedresponse=this.nameresponse;
            }
      })

    }
    else if(e.target.checked==false)
    {
      this.checkvalue=false;
      this.selectedresponse=[];
    }
    //this.nameresponse=[];

  }
  closename(){

    this.nameresponse=[];
    this.selectedfinallist=[];
    this.toggle4();
    this.searchresult="";
  }

   // ****************for get city selector*************************
  public getcity() {
    this.commonService.getData(APPSETTINGS.ims_url+AppURLs.getWHCity).subscribe(res => {
      this.city = res.model;
    })
  }
   // ****************for get warehouse selector*************************
  public cityselector(e) {
    this.commonService.getData(APPSETTINGS.ims_url+AppURLs.getWHbyCity+e.target.value).subscribe(res => {
      this.warehouse = res.model.warehouses;
      this.vendor = res.model.vendors;
    })

  }
 

   // ****************for selected item list by name*************************
 public goselect(){
   this.abbs=false;
   let count=0;
   this.checkvalue=false;
   if(this.selectedresponse.length!=0){
    this.selectedresponse.forEach((item) => {
      if (item.quantity == null) {
        count++;
        swal({
          title: "Error!",
          text: "please select valid quantity ",
          type: "warning",
          showCancelButton: false,
          confirmButtonText: 'OK'
          // showCancelButton: false,
          // confirmButtonText: 'OK'
        })
      }
      else if (count == 0) {
   this.showselected=true;
   this.selectedresponse.forEach((item)=>{
    if(this.selectedfinallist.filter(data=>data.id==item.id).length==0)
                 {
                   this.selectedfinallist.push(item);
                 }
   })
  // console.log(this.selectedfinallist,"for selectt jaye nnnnnnnnnnnnn");
   this.selectedresponse=[];
   this.nameresponse=[];
  }
})
}
  else{
    swal({
      title: "Error!",
      text:"first select the atleast one item for PRO",
      type: "warning",
      showCancelButton: false,
      confirmButtonText: 'OK'
    });
  }
 
 }

  // ****************for po search item list*************************
  public prosearchlist( name, ware,vandor,city) {
    this.wId = ware;
    this.city_id=city;
    this.vId=vandor;
     if(name.replace(/\s/g, "").length>=2) {
      this.commonService.postData(APPSETTINGS.ims_url+AppURLs.SearchPRO,{
        "itemName":name,
        "selectedItems": "",
        "whId": ware,
      }).subscribe((res:any) => {
        res.model.forEach(item=>{
          if(this.selectedfinallist.filter(data=>data.id==item.id).length==0 && this.nameresponse.filter(data=>data.id==item.id).length==0 && this.addeditem.filter(data=>data.id==item.id).length==0 )
                     {
                      // alert("res for search");
                       this.nameresponse.push(item);  
                       //console.log(this.nameresponse,"mmmmmmmmmmmmm listtttttt"); 
                     }
                    })
                       this.nameresponse.forEach(item=>{
                         //alert(item);
                         let singlearray=[];
                         if(item.goodStock>0){
                          singlearray.push("Good Stock");
                         }
                         else if(item.nearToExpireQty>0){
                          singlearray.push("Near To Expire");
                         }
                         else if(item.expiredQty>0){
                          singlearray.push("Expired");
                         }
                         else if(item.damageQty>0){
                          singlearray.push("Damage");
                         }
                         this.selectarray.push(singlearray);
                       })
                      // console.log(this.selectarray,"listtttttt"); 
                     
         
      })
      this.toggle3();
    }
    else{
      swal({
        title: "Error!",
        text: "please search item by Name",
        type: "warning",
        showCancelButton: false,
        confirmButtonText: 'OK'
      });
    }
  }
 

  changeselect(e,value){
    this.nameresponse.forEach(item=>{
      if(item.id==value){
        if(e.target.value=="Good Stock"){
          (document.getElementById('t'+item.id) as HTMLElement).innerHTML  = item.goodStock;
          item.reason="goodStock";
          item.stockQ=item.goodStock;
        }
        else if(e.target.value=="Near To ExpireQty"){
         
          (document.getElementById('t'+item.id) as HTMLElement).innerHTML  = item.nearToExpireQty;
          item.reason='nearToExpireQty';
          item.stockQ=item.nearToExpireQty;
        }
        else if(e.target.value=="Expired Qty"){
         
          (document.getElementById('t'+item.id) as HTMLElement).innerHTML  = item.expiredQty;
          item.reason='expiredQty';
          item.stockQ=item.expiredQty;
        }
        else if(e.target.value=="Damage Qty"){
          
          (document.getElementById('t'+item.id) as HTMLElement).innerHTML  = item.DamageQty;
          item.reason='DamageQty';
          item.stockQ=item.DamageQty;
        }
        
      }
   
    })
  }

  qtychange(e,value){
   // alert((e.target.value)+ "   " +value);
    if(parseInt(e.target.value) >parseInt(value)){
      e.target.value=0;
      swal({
        title: "Error!",
        text:"Quantity can't be greater than stock Quantity",
        type: "warning",
        showCancelButton: false,
        confirmButtonText: 'OK'
      });

    }
    
    
  }
   // ****************for vendor details*************************
  public vendordetail(e){
    this.commonService.getData(APPSETTINGS.ims_url+AppURLs.vendorAddDetail+e.target.value
    ).subscribe(res=>{
      //console.log(res.model,"venderaddress");
      this.vendorAdd += res.model.address1+res.model.address2+res.model.address3;
    })

  }
 // ****************for remove final selected list*************************
  public removeitem(value){
    this.addeditem.forEach((item)=>{
      if(item.id==value){
        let index=this.addeditem.indexOf(item);
        this.addeditem.splice(index,1);
      }
    })
  }
  // ****************for remove by name selected list*************************
  public removeitem2(value){
    this.selectedfinallist.forEach((item)=>{
      if(item.id==value){
        let index=this.selectedfinallist.indexOf(item);
        this.selectedfinallist.splice(index,1);
      }
    })
  }

// ****************for checkbox click event*************************
  public singlecheck(e,value,val,stype) {
    if(val=='search'){
    if(e.target.checked==true){
   // console.log(this.nameresponse,"for selectt jaye ");
      this.nameresponse.forEach((item)=>{
        if(item.id==value){
          // alert(item.quantity)
            if(stype==" "|| item.quantity== null || parseInt(item.quantity)==0 || parseInt(item.quantity) > parseInt(item.stockQ)){
             
              swal({
                title: "Error!",
                text:"please select stock type and at least 1 or less than stock qty",
                type: "warning",
                showCancelButton: false,
                confirmButtonText: 'OK'
              });
        
              e.target.checked=false;
            }
          else
          if(this.selectedresponse.filter(data=>data.id==item.id).length==0){
          this.selectedresponse.push(item);
          }
        }
      })
    }
    else if(e.target.checked==false){
      this.nameresponse.forEach((item)=>{
        if(item.id==value){
          let index = this.selectedresponse.indexOf(item.id);
          this.selectedresponse.splice(index,1);
        }
     
    })
  }
}
  }
// ****************for submit by name search modal*************************
public bynamelist(e){
  if(this.selectedfinallist.length!=0){
  this.toggle1();
  this.selectedfinallist.forEach((item)=>{
    if(this.addeditem.filter(data=>data.id==item.id).length==0){
      if(parseInt(item.quantity)>parseInt(item.stockQ) || parseInt(item.quantity)==0 || item.quantity==null){
       
        swal({
          title: "Error!",
          text:"Quantity can't be greater than stock Quantity and less than 1",
          type: "warning",
          showCancelButton: false,
          confirmButtonText: 'OK'
        });
      }
      else{
        this.addeditem.push(item);
        this.ismodal=false;
        this.show3=false;
        this.showselected=false; 
        this.selectedfinallist=[];
       }
      } 
  })
 

}
 else
{ this.ismodal=true;

  swal({
    title: "Error!",
    text:"selected item empty!! select atleast one item",
    type: "warning",
    showCancelButton: false,
    confirmButtonText: 'OK'
  });
}
}
// ******back*****
back(){
  this.router.navigate(['/Warehouse/PurchaseReturn']);
}



// ****************for final create po submit*************************
  public submitPO() {
    this.createDataForPROCreation();
   if(this.pRODetailRequestViewModels.length!=0)
   {
    
    this.data.vendorId = this.vId;
    this.data.whId = this.wId;
    this.data.proId = "";
    this.data.userId = "1";
    this.data.cityId = this.city_id;
    this.data.pRODetailRequestViewModels = this.pRODetailRequestViewModels;
   

    this.commonService.postData(APPSETTINGS.ims_url+AppURLs.CraetePRO , this.data).subscribe((res:any) => {
     
      if(!res.didError)
      {
      swal({
        title: "Success!",
        text:"PRO created successfully",
        type: "success",
      showCancelButton: false,
      confirmButtonText: 'OK'
      });
      this.router.navigate(['/Warehouse/PurchaseReturn']);
      }
      else
    
      swal({
        title: "Error!",
        text:"Error while processing your request ,try again later",
        type: "warning",
        showCancelButton: false,
        confirmButtonText: 'OK'
      });

    }),
      err => {
        alert("error in processing");
      }
    
    
  }
  else{
    swal({
      title: "Error!",
      text:"please Select product items and quantity",
      type: "warning",
    showCancelButton: false,
    confirmButtonText: 'OK'
    });
    
  }
  }

// ****************for final create po submit*************************
  createDataForPROCreation() {
    this.pRODetailRequestViewModels = [];
    this.addeditem.forEach(item => {
      if(parseInt(item.quantity)>parseInt(item.stockQ) || parseInt(item.quantity)==0 || item.quantity==null){
        
        swal({
          title: "Error!",
          text:"Quantity can't be greater than stock Quantity and less than 1",
          type: "warning",
          showCancelButton: false,
          confirmButtonText: 'OK'
        });
        
      }
      else{
      let createPo = {
        "itemId": item.id,
        "quantity": item.quantity,
        "sessionId": "",
        "reason": item.reason
      }
    

      this.pRODetailRequestViewModels.push(createPo);
    }
    })
  }


}


