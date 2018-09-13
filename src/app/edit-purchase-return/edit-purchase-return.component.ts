import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../core/services/common.service';
import swal from 'sweetalert2';
import { AppURLs, APPSETTINGS } from '../core/interfaces';


@Component({
  selector: 'app-edit-purchase-return',
  templateUrl: './edit-purchase-return.component.html',
  styleUrls: ['./edit-purchase-return.component.css']
})
export class EditPurchaseReturnComponent implements OnInit {

  purchaseReturnId: any;
  proUpdateDetails: any[];
  noexecute: boolean=true;
  count: number;
  count1: number;
  released: boolean=false;
  status: any;
  releaseBy: any;
  releaseDate: any;
  createDataForPROadd(): any {
    throw new Error("Method not implemented.");
  }
  proId: any;
  prodata: any;
  addeditem:Array<any>=[];
  qty = 0;
  show3: boolean;
  show1: boolean=false;
   selectedresponse: Array<any>=[];
  selectedfinallist: Array<any>=[];
  filterdresult: Array<any>;
  searchresult: String;
  searchresultid: String;
  searchvalue:boolean = false;
  proDetailsArray: any;
  checkvalue=false;
  time: any = new Date();
  data = {
    "userId": "",
    "proId": "",
    "proUpdateDetails": this.proUpdateDetails 
  }
  data2 = {
    "userId": "",
    "whId": "",
    "vendorId": "",
    "cityId": "",
    "proId": "",
    "operatorLocationId": "",
    "pRODetailRequestViewModels": this.proDetailsArray 
    
  }
  nameresponse: Array<any>=[];
  showselected: boolean;
  show2: boolean=false;
  abbs: boolean=false;
  wareId: string="";
  vendorId: string="";
  cityId: string="";
  previtem: Array<any>=[];
  addeditem2: Array<any>=[];
  prev: boolean=true;
  ismodal: boolean=false;
  ismodal2: boolean=false;
  purchaseReturnDetailId: any;
  selectarray: Array<any>=[];
  title:any;
  
  


  constructor( private route: ActivatedRoute,private commonService:CommonService,
    private router: Router) { }
    toggle1() {
      this.show1 = true;
    }
    
    toggle3() {
      this.show3 = true;
      this.searchvalue = false;
    }
    toggle4() {
      this.show3 = false;
      this.showselected=false;
    }
    modalopen(){
      this.ismodal=true;
    }
    modalopen2(){
      this.ismodal2=true;
    }

  ngOnInit() {
    this.commonService.setTitle('IMS-Warehouse-Outbound-Edit Purchase Return');
    this.proId = this.route.snapshot.params['id'];
    this.prodetail(this.proId);
   
  }
  // ************************get po details for edit****************************
public prodetail(data)
{
  this.commonService.getData(APPSETTINGS.ims_url+AppURLs.editPRODetail+data).subscribe(res=>{
    // console.log(res,"edit priooooooococococococc");
      if(res.model.status==2){
      this.released=true;
      this.title='View';
      this.releaseBy = res.model.releasedByName;
      this.releaseDate = res.model.releasedOn;
  }
  else{
    this.title='Edit';
  }
  this.prodata=res.model;
  this.previtem=res.model.purchaseReturnDetailViewModels;
 
  this.previtem.forEach(item=>{
    item.price=0;
  })
  this.cityId=res.model.cityId;
  this.vendorId=res.model.vendorId;
  this.wareId=res.model.warehouseId;
  this.purchaseReturnId=res.model.purchaseReturnId
  this.purchaseReturnDetailId=res.model.purchaseReturnDetailId;
  
})
}

notremove(){
  swal({
    title: "Error!",
    text:"can't remove this item",
    type: "warning",
    showCancelButton: false,
    confirmButtonText: 'OK'
  });
}

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
   if(this.previtem.length!=0){
    this.previtem.forEach((element)=>{
    this.filterdresult=this.filterdresult.filter(item => element.itemId !== item.id)
    })
  }
  if(this.addeditem2.length!=0){
    this.addeditem2.forEach((element)=>{
    this.filterdresult=this.filterdresult.filter(item => element.itemId !== item.id)
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
          text:"No record Found",
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
searchevent(e) {
  this.searchresult = e.target.innerText;
  this.searchvalue = false;
  this.searchresultid = e.target.id;
  this.prosearchlist(this.searchresult);
}
 // ****************for select all items checkbox*************************
 public checkbox(e){
  this.abbs=true;
  if(e.target.checked==true){
   // alert("first");
    this.nameresponse.forEach((item)=>{
          if(parseInt(item.quantity)== 0 || parseInt(item.quantity) > parseInt(item.stockQ)){
           // alert("second");
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
  this.searchresult="";
  this.toggle4();
}

 

 // ****************for selected item list by name*************************
 public goselect(){
  this.abbs=false;
  this.checkvalue=false;
  if(this.selectedresponse.length!=0){
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
 else{
  
   swal({
    title: "Error!",
    text:"first select the atleast one item for PO",
    type: "warning",
    showCancelButton: false,
    confirmButtonText: 'OK'
  });
 }

}

// ****************for po search item list*************************
public prosearchlist( name) {
  if(name.replace(/\s/g, "").length>=2) 
   { 
    this.commonService.postData(APPSETTINGS.ims_url+AppURLs.SearchPRO,{
      "itemName":name,
      "selectedItems": "",
      "whId": this.wareId,
    }).subscribe((res:any) => {
      res.model.forEach(item=>{
        if(this.selectedfinallist.filter(data=>data.id==item.id).length==0 && this.nameresponse.filter(data=>data.id==item.id).length==0 && this.addeditem.filter(data=>data.id==item.id).length==0 && this.previtem.filter(data=>data.itemId==item.id).length==0 )
                   {
                     //alert("res for search");
                     this.nameresponse.push(item);  
                   }
                  })
                     this.nameresponse.forEach(item=>{
                       let singlearray=[];
                       if(item.goodStock>0){
                        singlearray.push("goodStock");
                       }
                       else if(item.nearToExpireQty>0){
                        singlearray.push("NearToExpire");
                       }
                       else if(item.expiredQty>0){
                        singlearray.push("Expired");
                       }
                       else if(item.damageQty>0){
                        singlearray.push("Damage");
                       }
                       this.selectarray.push(singlearray);
                     })
    })
  this.toggle3();
  }
  else{
 
    swal({
      title: "Error!",
      text:"please search item by Name",
      type: "warning",
      showCancelButton: false,
      confirmButtonText: 'OK'
    });
  }
}


changeselect(e,value,sele){
 // alert("pgl"+ sele);
  if(sele=='new'){
  this.nameresponse.forEach(item=>{
    if(item.id==value){
      if(e.target.value=="goodStock"){
        (document.getElementById('t'+item.id) as HTMLElement).innerHTML  = item.goodStock;
        item.reason=e.target.value;
        item.stockQ=item.goodStock;
        item.price=0;
       
      }
      else if(e.target.value=="NearToExpire"){
       
        (document.getElementById('t'+item.id) as HTMLElement).innerHTML  = item.nearToExpireQty;
        item.reason='nearToExpireQty';
        item.stockQ=item.nearToExpireQty;
        item.price=0; 
      }
      else if(e.target.value=="Expired"){
       
        (document.getElementById('t'+item.id) as HTMLElement).innerHTML  = item.expiredQty;
        item.reason='expiredQty';
        item.stockQ=item.expiredQty;
        item.price=0;
      }
      else if(e.target.value=="Damage"){
        
        (document.getElementById('t'+item.id) as HTMLElement).innerHTML  = item.DamageQty;
        item.reason='DamageQty';
        item.stockQ=item.DamageQty;
        item.price=0;

      }
      
    }
  
  // console.log(this.nameresponse,"add new keyyyyyyyyyy");
  })
}

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
// ****************for remove final selected list*************************
public removeitem(value){
  this.commonService.deleteData(APPSETTINGS.ims_url+AppURLs.DeletePROitem+value).subscribe(res=>{
    // console.log(res,"after delete");
  });
  this.addeditem2.forEach((item)=>{
    if(item.purchaseOrderDetailId==value){
      let index=this.addeditem.indexOf(item);
      this.addeditem2.splice(index,1);
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
          if(stype==" "|| parseInt(item.quantity)== 0 || parseInt(item.quantity) > parseInt(item.stockQ)){

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
        this.selectedresponse.push(item);
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
    if(parseInt(item.quantity)>parseInt(item.stockQ) || parseInt(item.quantity)==0){
       
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
    this.createDataForPROinsert();
      this.data2.vendorId = this.vendorId;
      this.data2.whId = this.wareId;
      this.data2.proId = this.proId;
      this.data2.userId = "1";
      this.data2.cityId = this.cityId;
      this.data2.pRODetailRequestViewModels = this.proDetailsArray;
      this.commonService.postData(APPSETTINGS.ims_url+AppURLs.insertPROitem ,this.data2).subscribe((res:any) => {
        res.model.purchaseReturnDetailViewModels.forEach(element=>{
          if(this.previtem.filter(data=>data.itemId==element.itemId).length==0 && this.addeditem2.filter(data=>data.itemId==element.itemId).length==0){
            this.addeditem2.push(element);
            this.updateValue(null,null,"kk");
          }
        })
 
 this.addeditem=[];
})
this.ismodal=false;
this.show3=false;
this.showselected=false; 
this.selectedfinallist=[];
    }
    } 
})


}
else
{
  this.ismodal=true;

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
this.updateDataForPROCreation();
 if(this.count==0 && this.count1==0)
 { 
  this.data.proId = this.proId;
  this.data.userId = "1";
  this.data.proUpdateDetails = this.proUpdateDetails;
 

  this.commonService.putData(APPSETTINGS.ims_url+AppURLs.updatePRO ,this.data).subscribe((res:any) => { 
    if(!res.didError)
    {
   
    swal({
      title: "Success!",
      text:"PRO update successfully",
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
    });

  }),
    err => {
      //alert("error in processing");
    }
  
  
}

}

// ****************for final create po submit*************************
updateDataForPROCreation() {
   this.count=0;
   this.count1=0;
  this.proUpdateDetails = [];
  for(let element of this.previtem){  
    this.previtem.forEach(item=>{
      if(item.mrp===null){
        swal({
          title: "Error!",
          text:"price is mandatory!! Please Enter the price",
          type: "warning",
          showCancelButton: false,
          confirmButtonText: 'OK'
        });
        this.count++;
        
  
      }
      else if(parseInt(item.quantity)>parseInt(item.availableQuantity) || parseInt(item.quantity)==0){
        swal({
          title: "Error!",
          text:"Quantity can't be greater than stock Quantity and less than 1",
          type: "warning",
          showCancelButton: false,
          confirmButtonText: 'OK'
        });
       this.count++;
       
      }

    })
    if(this.count==0){
    let updatepro = {
      "prodId": element.purchaseReturnDetailId,
      "quantity": element.quantity,
      "price": element.mrp,
      "reason": element.reason
    }
    this.proUpdateDetails.push(updatepro);
    // this.noexecute=true;
  }
  }
  for(let element of this.addeditem2){  
    this.addeditem2.forEach(item=>{
      // alert(count);
      if(item.mrp==="0"){
        swal({
          title: "Error!",
          text:"price is mandatory!! Please Enter the price",
          type: "warning",
          showCancelButton: false,
          confirmButtonText: 'OK'
        });
        this.count1++;
        
  
      }
      else if(parseInt(item.quantity)>parseInt(item.availableQuantity) || parseInt(item.quantity)==0){
        swal({
          title: "Error!",
          text:"Quantity can't be greater than stock Quantity and less than 1",
          type: "warning",
          showCancelButton: false,
          confirmButtonText: 'OK'
        });
       this.count1++;
       
      }

    })
    if(this.count1==0){
      
    let updatepro = {
      "prodId": element.purchaseReturnDetailId,
      "quantity": element.quantity,
      "price": element.mrp,
      "reason": element.reason
    }
    this.proUpdateDetails.push(updatepro);
    // this.noexecute=true;
  }
  }
}



createDataForPROinsert() {
  this.proDetailsArray = [];
  this.addeditem.forEach(item => {
    let createPo = {
      "itemId": item.id,
      "quantity": item.quantity,
      "sessionId": "",
      "reason": item.reason

    }

    this.proDetailsArray.push(createPo);
  })
}
// *************************key up****************
updateValue(event,val1,type){
  if(type=='qty'){
    // alert("yhs kyo aaya");
  if(parseInt(event.target.value)>parseInt(val1))
  {
    swal({
      title: "Error!",
      text:"Quantity can't be greater than stock Quantity and less than 1",
      type: "warning",
      showCancelButton: false,
      confirmButtonText: 'OK'
    });
    event.target.value=0;
  }
}
  // alert("event :"+event);
  var totala=0 ;
  let qty:number=0;
  var totalc:number=0;

  for(let i:number=0;i<this.previtem.length;i++)
   {
    let column_qty= (document.getElementById('poc'+i) as HTMLInputElement).value;
    let column_amt= (document.getElementById('pop'+i) as HTMLElement).innerText;
    this.previtem[i].price=column_amt;
    // alert("11"+column_amt);
    if(column_qty === "")
    column_qty = "0";
    if(column_amt === "")
    column_amt = "0";
  
    totalc = totalc + parseInt(column_qty);
    totala =totala + parseFloat(column_amt);
  }
  
  if(event==null){
    this.addeditem2.forEach(item=>{
      totalc+=parseInt(item.quantity);
      totala+=parseFloat(item.amount);

    })
  } else
  {
    for(let i:number=0;i<this.addeditem2.length;i++)
   {
    
    let column_qty= (document.getElementById('ponc'+i) as HTMLInputElement).value;
    let column_amt= (document.getElementById('pon'+i) as HTMLElement).innerText;
    this.addeditem2[i].price=column_amt;
    if(column_qty === "")
    column_qty = "0";
    if(column_amt === "")
    column_amt = "0";
    totalc = totalc + parseInt(column_qty);
    totala =totala + parseFloat(column_amt);
   // alert(totala);
    
  
  }
  }

  
  (document.getElementById('wholeqty') as HTMLInputElement).value = totalc.toString();
  // (document.getElementById('wholeamt') as HTMLInputElement).value = totala.toString(); 
  this.prodata.netAmount=totala.toString();
 

}
public finalchange(event,val1,type){
  this.updateValue(event,val1,type);
}

public release() {
  this.released = true;
  this.commonService.postData(APPSETTINGS.ims_url+AppURLs.ReleasePRO ,{ requestedId: this.proId, userId: 1 }).subscribe((res:any) => { 
    // console.log("res in release pppprrrroooo", res);
  if(res.didError==false){
    swal({
      title: "Success!",
      text:res.message,
      type: "success",
      showCancelButton: false,
      confirmButtonText: 'OK'
    });
    this.prodata.status= res.model.status;

  this.releaseBy = res.model.releasedByName;
  this.releaseDate = res.model.releasedOn;
  // this.releaseDate = releaseDate.substring(13);
  }else{
    swal({
      text:res.message,
      type: "warning",
      showCancelButton: false,
      confirmButtonText: 'OK'
    });
  }
},err=>{
  swal(err.error.errorMessage);
}
);
}


}
