import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../core/services/common.service';
import swal from 'sweetalert2';
import { AppURLs, APPSETTINGS } from '../../core/interfaces';


@Component({
  selector: 'app-view-purchased-order',
  templateUrl: './view-purchased-order.component.html',
  styleUrls: ['./view-purchased-order.component.css']
})
export class ViewPurchasedOrderComponent implements OnInit {
  poId: any;
  podata: any;
 
  po: Array<any>;
  poDetailsArray: any;
  checkvalue=false;
  time: any = new Date();
   poUpdateDetails: any[];
 
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
  cancelled: boolean;
  
  constructor( private route: ActivatedRoute,
    private router: Router,private commonservice:CommonService ) { }
  

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
      console.log(res.model,'res in po creatttttttt');
    this.podata=res.model;
    this.poexpiryDate=this.podata.expiryDate;
    if(this.podata.status>=1){
      this.released=true;
      this.title='View';
    }
    if(this.podata.status==4){
      this.cancelled=true;
    }
    this.previtem=res.model.purchaseOrderDetailViewModels;
    
    this.cityId=res.model.cityId;
    this.vendorId=res.model.vendorId;
    this.wareId=res.model.warehouseId;
    this.purchaseOrderId=res.model.purchaseOrderId;
   
  })
  }




back(){
this.router.navigate(['/Warehouse/PurchaseOrder']);
}








}


 
