import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { NgxSpinnerService } from '../../../../node_modules/ngx-spinner';
import { CommonService } from '../../core/services/common.service';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { APPSETTINGS, AppURLs } from '../../core/interfaces';

@Component({
  selector: 'app-view-grn',
  templateUrl: './view-grn.component.html',
  styleUrls: ['./view-grn.component.css']
})
export class ViewGrnComponent implements OnInit {
  grnId;
  viewList;
  viewArray;
  quantity;
  amount1;
  releasedDate;
  releaseBy;
  releasBy;
  isReleased: boolean = false;
  constructor(private router: Router , private route: ActivatedRoute, private spinner: NgxSpinnerService, private commonService: CommonService) { }

  ngOnInit() {
    this.grnId = this.route.snapshot.params['id'];
    this.getViewGrn(this.grnId);
    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
  }

  getViewGrn(id) {
    this.spinner.show();
    this.commonService.getData(APPSETTINGS.ims_url+AppURLs.getOneGrn+id).subscribe((res:any) => {
      this.spinner.hide();
      if (res.didError === false) {
        this.viewList = res.model;
        this.viewArray = res.model.gRNDetailViewModels; 
       
        let str = this.viewList.releasedOn;
        let releasedOn = str.substring(13);
        if(res.model.status>1){
          this.isReleased=true;
          this.releasedDate = releasedOn;
          this.releasBy=  res.model.releasedBy;
        }
        let netQty = 0;
        let netAmt = 0;
        for (let i = 0; i < this.viewArray.length; i++) {
          netQty += this.viewArray[i].quantity;
          netAmt += this.viewArray[i].netAmount;
          this.quantity = netQty;
          this.amount1 = netAmt;
        }
      } else {
        swal({ type: 'warning', text: "Error in processing the request", showConfirmButton: true });
      }
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    })
  }

  back(){
    this.router.navigate(['Grn']);
  }

}
