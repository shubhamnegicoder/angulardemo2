import { Component, OnInit } from '@angular/core';
import { CommonService } from '../core/services/common.service';
import { AppURLs, APPSETTINGS } from '../core/interfaces';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {
  user: any;
  passwordControl = {
    password: '',
    confirmPassword: ''
  };
  constructor(private commonService: CommonService, private authService: AuthService) {

  }

  ngOnInit() {

    this.commonService.setTitle('UVM-User Profile');
    this.user = this.commonService.getUserProfile();

    this.loadProfile();


  }
  loadProfile() {
    if (this.user != null) {
      this.commonService.getData(APPSETTINGS.base_url + AppURLs.getUser + this.user.userId).subscribe(response => {
        if (!response.isError) {
          this.user = response.model;
        } else {
          swal({ type: 'info', text: response.message });
        }
      }, error => {
        swal({ type: 'error', text: error.error.errorMessage });
      });
    }
  }

  validateConfirmPassword() {
    if (this.passwordControl.password !== this.passwordControl.confirmPassword) {
      swal({ type: 'info', text: 'Password and Confirm Password must be same' });
      return false;
    } else {
      return true;
    }
  }

  changePassword() {
    if (this.validateConfirmPassword()) {
      const userControl = { 'userId': this.user.id, 'password': this.passwordControl.password };
      this.commonService.putData(AppURLs.changePassword, userControl).subscribe((response: any) => {
        if (!response.isError) {
          swal({ type: 'success', text: response.message });
          this.passwordControl = {
            password: '',
            confirmPassword: ''
          };
        } else {
          swal({ type: 'info', text: response.message });
        }
      }, errorResponse => {
        if (errorResponse.status === 401) {
          swal({ type: 'error', text: 'Session is expired', showConfirmButton: true });
          this.authService.logout();
        } else {
          swal({ type: 'error', text: errorResponse.error.errorMessage });
        }
      });
    }
  }
}
