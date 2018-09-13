import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../core/services/common.service';
import swal from 'sweetalert2';
import { AppURLs, APPSETTINGS } from '../../core/interfaces';

@Component({
  selector: 'app-edit-pusrchase-order',
  templateUrl: './edit-pusrchase-order.component.html',
  styleUrls: ['./edit-pusrchase-order.component.css']
})
export class EditPusrchaseOrderComponent implements OnInit {
  poId: any;
  podata: any;
  addeditem:Array<any>=[];
  show3: boolean;
  show1: boolean=false;
  selectedresponse: Array<any>=[];
  selectedfinallist: Array<any>=[];
  filterdresult: Array<any>;
  searchresult: String;
  searchresultid: String;
  searchvalue:boolean = false;
  po: Array<any>;
  poDetailsArray: any;
  checkvalue=false;
  time: any = new Date();
   poUpdateDetails: any[];
  data = {
    "userId": "",
    "poId": "",
    "expiryDate":"",
    "poUpdateDetails": this.poUpdateDetails 
  }
  data2 = {
    "userId": "",
    "whId": "",
    "vendorId": "",
    "cityId": "",
    "poId": 0,
    "isSpecial": "",
    "pODetailRequestModels": this.poDetailsArray 
    
  }
  nameresponse: Array<any>=[];
  showselected: boolean;
  special: string="0";
  poselectitem: Array<any>=[];
  show2: boolean=false;
  abbs: boolean=false;
  wareId: string="";
  vendorId: string="";
  cityId: string="";
  previtem: Array<any>=[];
  purchaseOrderId: number;
  addeditem2: Array<any>=[];
  prev: boolean=true;
  qtyupdate: number;
  totalAmount: number;
  ismodal: boolean=false;
  ismodal2: boolean=false;
  today=new Date().toJSON().split('T')[0];
  released: boolean;
  poexpiryDate: any;
  title:any;
  
  constructor( private route: ActivatedRoute,
    private router: Router,private commonservice:CommonService ) { }
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
    modalopen(){
      this.ismodal=true;
    }
    modalopen2(){
      this.ismodal2=true;
    }


  ngOnInit() {
    // alert(this.today);
    this.commonservice.setTitle('UVM-Warehouse-Inbound-Edit PO');
    this.poId = this.route.snapshot.params['id'];
    this.podetail(this.poId);
   
  }
  // ************************get po details for edit****************************
public podetail(data)
{
  this.commonservice.getData(APPSETTINGS.ims_url+AppURLs.editPODetail+data).subscribe(res=>{
  this.podata=res.model;
  this.poexpiryDate=this.podata.expiryDate;
    this.title='Edit';
  this.previtem=res.model.purchaseOrderDetailViewModels;
  console.log(this.previtem,'ppppprev');
  
  this.cityId=res.model.cityId;
  this.vendorId=res.model.vendorId;
  this.wareId=res.model.warehouseId;
  this.purchaseOrderId=res.model.purchaseOrderId;
  this.polist();
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
    this.commonservice.getData(APPSETTINGS.ims_url+AppURLs.getAutoName+e.target.value).subscribe(res => {
      this.filterdresult = res.model;
     if (this.previtem.length != 0) {
      this.previtem.forEach((element) => {
      this.filterdresult = this.filterdresult.filter(item => element.itemId !== item.id);    
       })

      }
      if (this.selectedfinallist.length != 0) {
           this.selectedfinallist.forEach((element) => {
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
public pocancle()
{
      swal({
        'title': 'Do you want to cancel this PO?',
        'showCancelButton': true,
        'confirmButtonText': 'Yes',
        'cancelButtonText': 'No'
      }).then((result) => 
      {
        if (result.value) {
          this.commonservice.deleteData(APPSETTINGS.ims_url+AppURLs.CanclePO+this.poId).subscribe((res:any)=>{
          if(!res.didError){
          swal({
            'type': 'success',
            'text': 'Successfully cancelled!!'
          });
          this.router.navigate(['/Warehouse/PurchaseOrder']);
         
        }
        else{
          swal({
            'type': 'warning',
            'text': 'Something went wrong!!'
          });
        }
     
      });
    // this.router.navigate(['/PurchaseOrder']);
       }
    
    //
  })
}
// ****************for select item event*************************
searchevent(e) {
  alert();
  this.searchresult = e.target.innerText;
  this.searchvalue = false;
  this.searchresultid = e.target.id;
  this.posearchlist('', this.searchresult);
}

 // ****************for select all items checkbox*************************
public checkbox(e){
  this.abbs=true;
  if(e.target.checked==true){
    let count=0;
     this.nameresponse.forEach((item)=>{
      //  alert('uoo'+item.expiryDate);
            if(parseInt(item.quantity)== null || item.expiryDate==(''))
            {
              // alert('lllll');
              swal({
                title: "Error!",
                text:"please select valid quantity and Expiry date",
                type: "warning",
                showCancelButton: false,
                confirmButtonText: 'OK'
              });
            
              e.target.checked=false;
              this.abbs=false;
              this.checkvalue=false;
              count++;
            }
     });
    if(count==0)
    {
              this.checkvalue=true;
              this.selectedresponse=this.nameresponse;
    }

  }
   else if(e.target.checked==false)
  {
    this.checkvalue=false;
    this.selectedresponse=[];
  }
 
}
closename(){

  this.nameresponse=[];
  this.selectedfinallist=[];
  this.searchresult="";
  this.toggle4();
}

 // ****************for polist selector*************************
public polist() {
 
    this.commonservice.getData(APPSETTINGS.ims_url+AppURLs.getPoList+ this.wareId+'&VId='+  this.vendorId).subscribe((res:any) => {
    this.po = res.model;
    //console.log(this.po,"for po list");
  })
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
public posearchlist(po,name) {
  if (po && name == "") {
    this.commonservice.postData(APPSETTINGS.ims_url+AppURLs.searchPoitem,{
      "cityId": this.cityId,
      "itemName": "",
      "selectedItems": "",
      "whId": this.wareId,
      "poId": po,
      "vendorId": this.vendorId,
      "userId": "1",
      "isSpecial": this.special
    }).subscribe((res:any) => {
      res.model.forEach(item=>{
        item.expiryDate="";
        if(this.poselectitem.length == 0 && this.previtem.filter(data=>data.itemId==item.id).length==0 && this.poselectitem.filter(data=>data.id==item.id).length==0 ){
          this.poselectitem.push(item);
        }
      })
       
          this.poselectitem.forEach(item=>{
            if(this.addeditem.filter(data=>data.id==item.id).length==0){
              this.addeditem.push(item);
              // console.log(this.addeditem,"jo po se final jayega");
               }
           
             })
      })

    this.toggle2();
  }
  else if (name!="") 
  {
   
    this.commonservice.postData(APPSETTINGS.ims_url+AppURLs.searchPoitem,{
      "cityId": this.cityId,
      "itemName":name,
      "selectedItems": "",
      "whId": this.wareId,
      "poId": po,
      "vendorId": this.vendorId,
      "userId": "1",
      "isSpecial": this.special
    }).subscribe((res:any) => {
      res.model.forEach(item=>{
        item.expiryDate="";
        if(this.previtem.filter(data=>data.itemId==item.id).length==0 && this.nameresponse.filter(data=>data.id==item.id).length==0 && this.selectedfinallist.filter(data=>data.id==item.id).length==0 )
                   {
                     this.nameresponse.push(item);                       
                   }

      })
        this.toggle3();
    })
   
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

// ****************for remove final selected list*************************
public removeitem(value){
  this.commonservice.deleteData(APPSETTINGS.ims_url+AppURLs.DelectPOitem+value)
    .subscribe(res=>{
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
public singlecheck(e,value,val,qty,exdate) {
  if(val=='search'){
  if(e.target.checked==true){
    this.nameresponse.forEach((item)=>{
     if(item.id==value){
          if(qty!=null && exdate!=''){
            this.selectedresponse.push(item);
          }
          else{
            swal({
              title: "Error!",
              text:"Enter some postive quantity and Expiry Date",
              type: "warning",
              showCancelButton: false,
              confirmButtonText: 'OK'
            });
           
            e.target.checked=false;
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
else if(val=='poselect'){
//console.log("added item :"+this.addeditem);
let index=this.addeditem.findIndex(item=>item.id===value);
//alert("index number"+index);
this.addeditem.splice(index,1);
//console.log("added item :"+this.addeditem);
}

}
// ****************for submit by name search modal*************************
public bynamelist(e){
if(this.selectedfinallist.length!=0){
this.toggle1();
this.selectedfinallist.forEach((item)=>{
  if(this.addeditem.filter(data=>data.id==item.id).length==0){
    this.addeditem.push(item);
   
     }
    
})
this.createDataForPOCreation();
this.data2.vendorId = this.vendorId;
this.data2.whId = this.wareId;
this.data2.poId = this.purchaseOrderId;
this.data2.userId = "1";
this.data2.cityId = this.cityId;
this.data2.isSpecial=this.special;
this.data2.pODetailRequestModels = this.poDetailsArray;
this.commonservice.postData(APPSETTINGS.ims_url+AppURLs.AddPOitem,this.data2).subscribe((res:any) => {
  res.model.forEach(element=>{
    if(this.previtem.filter(data=>data.itemId==element.itemId).length==0 && this.addeditem2.filter(data=>data.itemId==element.itemId).length==0){ 
       this.addeditem2.push(element);
      //  console.log(this.addeditem2,"added222222");
       this.updateValue(null);
     }
  })
 
 this.addeditem=[];
})
this.ismodal=false;
this.show3=false;
this.showselected=false; 
this.selectedfinallist=[];

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
this.router.navigate(['/Warehouse/PurchaseOrder']);
}
// ****************for submit by po search modal*************************
public byposelect(e){
  let num=0;
  if(this.addeditem.length!=0){
    this.addeditem.forEach(item=>{
      if(item.quantity==null || item.expiryDate==('' || undefined) ){
        swal({
          title: "Error!",
          text:"enter some postive quantity and Expiry Date",
          type: "warning",
          showCancelButton: false,
          confirmButtonText: 'OK'
        });
        
         num++;
      }
    })
  if(num==0){
    this.toggle1();
    this.createDataForPOCreation();
    this.data2.vendorId = this.vendorId;
    this.data2.whId = this.wareId;
    this.data2.poId = this.purchaseOrderId;
    this.data2.userId = "1";
    this.data2.cityId = this.cityId;
    this.data2.isSpecial=this.special;
    this.data2.pODetailRequestModels = this.poDetailsArray;
    this.commonservice.postData(APPSETTINGS.ims_url+AppURLs.AddPOitem,this.data2).subscribe((res:any) => {
      res.model.forEach(element=>{
        if(this.previtem.filter(data=>data.itemId==element.itemId).length==0 && this.addeditem2.filter(data=>data.itemId==element.itemId).length==0){
         //alert(element);
          this.addeditem2.push(element);
          this.updateValue(null);
        }
      })
    })
    this.ismodal2=false;
    this.poselectitem=[]; 
    }
  }
    else
    {
      this.ismodal2=true;
      swal({
        title: "Error!",
        text:"Please select atleast one Po",
        type: "warning",
        showCancelButton: false,
        confirmButtonText: 'OK'
      });
   
    }
    
}

// ****************for final create po submit*************************
public submitPO() {
  this.updateDataForPOCreation();
//  console.log(this.poUpdateDetails," final jo jayega podetails");
 if(this.poUpdateDetails.length!=0)
 {
  this.data.poId = this.poId;
  this.data.userId = "1";
  this.data.expiryDate=this.poexpiryDate;
  this.data.poUpdateDetails = this.poUpdateDetails;
 

  this.commonservice.postData(APPSETTINGS.ims_url+AppURLs.updatePO ,this.data).subscribe((res:any) => {
    // console.log(res,"ab kya prblm h");
   
    if(!res.didError)
    {
      swal({
        title: "Success!",
        text:"Po update successfully",
        type: "success",
        showCancelButton: false,
        confirmButtonText: 'OK'
      });
   
    this.router.navigate(['/Warehouse/PurchaseOrder']);
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
      //alert("error in processing");
    }
  
  
}
if(this.previtem.length==0){
  swal({
    title: "Error!",
    text:"please Select product items",
    type: "warning",
    showCancelButton: false,
    confirmButtonText: 'OK'
  });
  
}
}

// ****************for final create po submit*************************
updateDataForPOCreation() {
  this.poUpdateDetails = [];
  let count=0;
  let count1=0;
  this.previtem.forEach(item=>{
    if(item.quantity==null || item.itemExpiryDate==''){
      swal({
        text:"please enter valid quantity and Expiry Date",
        type: "warning",
        showCancelButton: false,
        confirmButtonText: 'OK'
      });
    
      count++
    }
  });
  this.addeditem2.forEach(item=>{
    if(item.quantity==null){
      swal({
        title: "Error!",
        text:"please enter valid quantity",
        type: "warning",
        showCancelButton: false,
        confirmButtonText: 'OK'
      });
    
      count1++
    }
  });
 if(count==0 && count1==0){
  this.previtem.forEach(item => {
    let updatepo = {
      "podId": item.purchaseOrderDetailId,
      "quantity": item.quantity,
      "itemExpiryDate":item.itemExpiryDate
    }
    this.poUpdateDetails.push(updatepo);

  })
  };
  if(count==0 && count1==0){
  this.addeditem2.forEach(item => {
    let updatepo = {
      "podId": item.purchaseOrderDetailId,
      "quantity": item.quantity,
      "itemExpiryDate":item.itemExpiryDate
    }

    this.poUpdateDetails.push(updatepo);
  })
   this.addeditem2=[];
  }  
}
createDataForPOCreation() {
  this.poDetailsArray = [];
  // console.log(this.addeditem,"kkkkokokokokokokol");
  this.addeditem.forEach(item => {
    let createPo={
      "itemId": item.id,
      "quantity": item.quantity,
      "sessionId": "",
      "itemExpiryDate":item.expiryDate

    }

    this.poDetailsArray.push(createPo);
  })
}
// *************************key up****************
updateValue(event){
  
  var totala=0 ;
  let qty:number=0;
  var totalc:number=0;

  for(let i:number=0;i<this.previtem.length;i++)
   {
    
    let column_qty= (document.getElementById('poc'+i) as HTMLInputElement).value;
    let column_amt= (document.getElementById('pop'+i) as HTMLElement).innerText;
    // alert(column_amt);
    if(column_qty === "")
    column_qty = "0";
    if(column_amt === "")
    column_amt = "0";
    totalc = totalc + parseInt(column_qty);
    totala =totala + parseFloat(column_amt);
    //alert(totala);
    
  
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
 this.podata.netAmount=totala.toString();

}
public finalchange(event){
  this.updateValue(event);
}

//  public qtyvalidation(e){
//    return this.commonservice.qtyChangeValidation(e);
//   }



}

