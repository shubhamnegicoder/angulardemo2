import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../core/services/common.service';
import { NgxSpinnerService } from '../../../../node_modules/ngx-spinner';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import swal from 'sweetalert2';
import { APPSETTINGS, AppURLs } from '../../core/interfaces';

@Component({
  selector: 'app-release-trn-mis-match',
  templateUrl: './release-trn-mis-match.component.html',
  styleUrls: ['./release-trn-mis-match.component.css']
})
export class ReleaseTrnMisMatchComponent implements OnInit {
  trnId;
  oneTrnMismatch:any;
  ArrayOfOne = [];
  Status = '';
  id = 0;
  constructor(private router: Router ,private route: ActivatedRoute ,private commonService: CommonService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.commonService.setTitle('IMS-Reports-TRNMismatch-Maintain TRNMismatch');
    this.trnId = this.route.snapshot.params['id'];
    this.getOneTrnMismatchById(this.trnId);
    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
  }


  back(){
    this.router.navigate(['trnMisMatch']);
  }
  /****************************  Function To Get One TRN Mismatch  ******************************/
  public getOneTrnMismatchById(id) {
    // let data = {
    //   "requestedId": id,
    //   "userId": 1
    // };
    this.spinner.show();
    this.commonService.getData(APPSETTINGS.ims_url+AppURLs.getOneTrnMismatch+id).subscribe((res:any) => {
      this.spinner.hide();
      if (res.didError === false) {
        this.oneTrnMismatch = res.model;
        let status = res.model.status;
        if (status == 3) {
          this.Status = 'Closed';
        }
        if (status == 1) {
          this.Status = 'Open';
        }
        if (res.model.transferReceiptNoteDetailViewModels == null) {
          this.ArrayOfOne = [];
        } else {
          this.ArrayOfOne = res.model.transferReceiptNoteDetailViewModels;
          for (let obj of this.ArrayOfOne) {
            obj.action = "";
            obj.reason1 = "";
          }
        }
      } else {
        swal({
          type: 'warning',
          text: "Error In Processing The Request",
          showConfirmButton: true
        });
      }
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
    });
  }

  /****************************  Function To Release One TRN Mismatch  ******************************/
  public release(dataArray) {
    let ar = [];
    dataArray.forEach(item => {
      let trnDetailId1 = item.trnDetailId;
      let action1 = item.action;
      let quantity1 = item.quantity;
      let itemType1 = item.reason; 
      let remark1 = item.reason1;
      ar.push({
        "trnDetailId": trnDetailId1,
        "action": action1,
        "quantity": quantity1,
        "itemType": itemType1,
        "remark": remark1
      });
    });
    let data = {
      "releasedBy": "1",
      "trnId": this.trnId,
      "releaseTRNDetailRequestModels": ar
    }
    let isAllValidationVerified = true;

    // use for loop here, and the moment you get action blank, set isAllValidationVerified flag & break the loop;
    for (let i = 0; i < data.releaseTRNDetailRequestModels.length; i++) {
      if (data.releaseTRNDetailRequestModels[i].action == "" && data.releaseTRNDetailRequestModels[i].action.trim() == "") {
        isAllValidationVerified = false;
        break;
      }
    }

    if (!isAllValidationVerified) {
      swal({
        type: 'warning',
        text: "Action is required ",
        showConfirmButton: true
      });
    }
    else {
      swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Release',
        cancelButtonText: 'Cancel',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          this.spinner.show();
          this.commonService.postData(APPSETTINGS.ims_url+AppURLs.releasedTrnMismatch,data).subscribe((res:any) => {
            this.spinner.hide();
            if (res.model.statusValue == 1) {
              swal({
                type: 'success',
                text: "Trn Mismatch is released successfully",
                showConfirmButton: true
              }).then((result) => {
                this.router.navigate(['trnMisMatch']);
              });
            } else if (res.model.statusValue == -2) {
              swal({
                type: 'warning',
                text: "Trn Mismatch is already released ",
                showConfirmButton: true
              });
            } else if (res.model.statusValue == -1) {
              swal({
                type: 'warning',
                text: "Not Able to release ",
                showConfirmButton: true
              });
            }else{
              swal({
                type: 'warning',
                text: "Error in processing the request",
                showConfirmButton: true
              });
            }
            
          },err=>{
            this.spinner.hide();
            this.commonService.handleError(err);
          }
          );
        } else if (result.dismiss === swal.DismissReason.cancel) {
        }
      })
    }
  }
}
