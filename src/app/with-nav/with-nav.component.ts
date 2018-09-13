import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { CommonService } from '../core/services/common.service';
import { NavModule, RolePermission, APPSETTINGS, AppURLs } from '../core/interfaces';

@Component({
  selector: 'app-with-nav',
  templateUrl: './with-nav.component.html',
  styleUrls: ['./with-nav.component.css']
})
export class WithNavComponent implements OnInit {
  navMenu: Array<NavModule> = [];
  subnavMenu: Array<RolePermission> = [];
  selectedMenu: string;
  constructor(private authService: AuthService, private commonService: CommonService) { }

  ngOnInit() {
   
    let url = location.href;
    this.loadMainModule(url);

    // this.authService.navMenuSubject.subscribe(value => {
    //   this.navMenu = value;
    //   this.commonService.showLog(' nav menu in subscribe ' + JSON.stringify(this.navMenu));

    // });


   


  }

  loadMainModule(url) {
    let user = JSON.parse(localStorage.getItem('user'));

    if (user != null) {
      this.commonService.getData(APPSETTINGS.base_url + AppURLs.GetRole + user.id).subscribe(
        response => {
          if (!response.isError) {
            this.authService.navMenuSubject = response.model;
            this.navMenu = response.model;

            this.selectedMenu = this.commonService.getModuleName(url);
           // alert(this.selectedMenu + ' innn load modules ' + JSON.stringify(this.navMenu));
           // this.commonService.showLog(this.selectedMenu + ' innn ' + JSON.stringify(this.navMenu));
            
            let obj = this.navMenu.filter(m => m.module === this.selectedMenu);

          //  this.commonService.showLog("module :-"+JSON.stringify(obj));
            this.menuEvent(obj[0].moduleId);

          } else {
            //this.commonService.showLog('error in loadmainmodules');
          }

        }, error => {
          this.commonService.handleError(error);

        }
      );
    }
  }
  logout() {
    this.authService.logout();
  }

  menuEvent(moduleId) {
   // alert("send moduleId->"+moduleId);
    const menu = this.navMenu.filter(m => m.moduleId === moduleId);
   // this.commonService.showAlert("menu:- "+JSON.stringify(menu));
    this.selectedMenu = menu[0].module;
    this.subnavMenu = menu[0].permission;
    //this.commonService.showLog(JSON.stringify(this.subnavMenu));
  }


}
