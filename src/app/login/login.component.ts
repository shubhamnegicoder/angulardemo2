import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import swal from 'sweetalert2';
import { AuthService } from '../core/services/auth.service';
import { IUser, UserProfile } from '../core/interfaces';
import { CommonService } from '../core/services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string;
  isSubmitted: boolean;
  userProfile: UserProfile;
  constructor(private formBulider: FormBuilder,
    private authService: AuthService,
    private router: Router, private commonService: CommonService
  ) {
  }

  ngOnInit() {
    this.isSubmitted = false;
    this.buildForm();
  }
  private buildForm() {
    this.loginForm = this.formBulider.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }


  public formHandler({ value, valid }: { value: IUser, valid: boolean }) {

    this.isSubmitted = true;

    if (!valid) {
      swal({ type: 'error', text: 'username and password is required' });
      return;
    }

    this.authService.authenticate(value).subscribe(response => {

      // this.spinner.hide();
      if (!response.isError) {
        // tslint:disable-next-line:prefer-const
        let tokenController = { 'expiresAt': response.expiresAt, 'token': response.token };
        const user = {
          'userId': response.model.userId, 'userName': response.model.userName,
          'id': response.model.rolePermission[0].roleId
        };
        localStorage.setItem('tokenController', JSON.stringify(tokenController));
        localStorage.setItem('user', JSON.stringify(user));
        this.authService.subject.next(true);
        this.authService.isLoggedIn = true;
        this.authService.navMenuSubject.next(response.model.rolePermission);
        this.router.navigate(['/']);
      } else {

        swal({ type: 'error', text: response.message });
      }

    }, responseError => {

      alert(responseError);
      if (responseError.status === 404) {
        swal({ type: 'error', text: responseError.error.errorMessage });
      } else {
        swal({ type: 'error', text: responseError.error.errorMessage });
      }
    });


  }
}
