import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { CommonService } from './core/services/common.service';
import { RolePermission } from './core/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isShow = true;

  constructor(public authService: AuthService, public commonService: CommonService) {

  }
  ngOnInit() {
    this.authService.subject.subscribe(value => {
      this.authService.isLoggedIn = value;
    });
  }
  logout() {
    this.authService.logout();
  }
}
