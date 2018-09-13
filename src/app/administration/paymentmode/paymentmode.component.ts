import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../core/services/common.service';
import { APPSETTINGS, AppURLs } from '../../core/interfaces';
import swal from 'sweetalert2';
@Component({
  selector: 'app-paymentmode',
  templateUrl: './paymentmode.component.html',
  styleUrls: ['./paymentmode.component.css']
})
export class PaymentmodeComponent implements OnInit {
  paymentModes: Array<any> = [];
  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.commonService.setTitle('UVM-Operator Payment Selection');
    this.loadPaymentModule();
  }

  loadPaymentModule() {
    this.commonService.getData(APPSETTINGS.payment_url + AppURLs.GetPaymentMode).subscribe(response => {
      if (response.statusCode === 200) {
        this.paymentModes = response.responseData;
      } else {
        swal({ type: 'error', text: response.erors });
      }
    }, error => {
      this.commonService.handleError(error);
    });
  }

}
