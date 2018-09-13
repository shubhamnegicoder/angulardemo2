import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser, APPSETTINGS, AppURLs, NavModule } from '../interfaces';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
const headers = {
  headers: new HttpHeaders({ 'content-type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  navMenuSubject: BehaviorSubject<NavModule[]> = new BehaviorSubject([{
    'module': '',
    'moduleId': '',
    'roleName': '',
    'roleId': -1,
    'permission': [{
      'subModule': '',
      'isSelected': false,
      'component': '',
      'action': '',
      'permissionId': '',
      'isAddSelected': '',
      'isEditSelected': -1,
      'isDeleteSelected': -1,
      'isImportSelected': -1,
      'isViewSelected': -1,
      'parentId': -1
    }]
  }]);
  subject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(private httpClient: HttpClient, private router: Router) { }
  authenticate(user: IUser): Observable<any> {
    return this.httpClient.post(APPSETTINGS.base_url + AppURLs.authUrl, user, headers);

  }
  logout() {
    localStorage.removeItem('token');
    this.subject.next(false);
    this.router.navigate(['/login']);
  }
}
