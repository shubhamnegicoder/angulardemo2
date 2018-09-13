import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../core/services/common.service';
import swal from 'sweetalert2';
import { AppURLs, APPSETTINGS } from '../../core/interfaces';



@Component({
  selector: 'app-view-purchase-return',
  templateUrl: './view-purchase-return.component.html',
  styleUrls: ['./view-purchase-return.component.css']
})
export class ViewPurchaseReturnComponent implements OnInit {
  proId: any;
  details: any;
  released: boolean;
  releaseBy: any;
  releaseDate: any;
  prodata: any;
  previtem: any;
  cityId: any;
  vendorId: any;
  wareId: any;
  purchaseReturnId: any;
  purchaseReturnDetailId: any;

  constructor( private route: ActivatedRoute,private commonService:CommonService, private router: Router) { }

  ngOnInit() {
    this.commonService.setTitle('UVM-Warehouse-Outbound-View Purchase Return');
    this.proId = this.route.snapshot.params['id'];
    this.prodetail(this.proId);
  }
  public prodetail(data)
  {
    this.commonService.getData(APPSETTINGS.ims_url+AppURLs.editPRODetail+data).subscribe((res:any)=>{
       console.log(res,"edit priooooooococococococc");
       this.details= res.model;
        if(res.model.status==2){
        this.released=true;
        this.releaseBy = res.model.releasedByName;
        this.releaseDate = res.model.releasedOn;
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
  back(){
    this.router.navigate(['/Warehouse/PurchaseReturn']);
    }
}
