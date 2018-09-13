import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserProfile, APPSETTINGS, AppURLs } from '../interfaces';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import swal from 'sweetalert2';
import { AuthService } from './auth.service';
import * as FileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
const headers = { 'headers': new HttpHeaders({ 'content-type': 'application/json' }) };
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  static isShow = true;
  userProfile: UserProfile;

  pageSize = 5;

  public showLog(txt: any) {

    if (CommonService.isShow) {
      console.log(txt);
    }
  }

  public showAlert(txt: any) {

    if (CommonService.isShow) {
      alert(txt);
    }

  }

  constructor(private title: Title, private httpClient: HttpClient, private authService: AuthService) { }
  public setTitle(newTitle: string) {
    this.title.setTitle(newTitle);
  }

  getUserProfile() {
    const user = localStorage.getItem('user');
    if (user !== null) {
      return JSON.parse(user);
    } else {
      return null;
    }
  }

  public getData(url: string): Observable<any> {
    return this.httpClient.get(url);
  }
  public postData(url: string, data: any): Observable<any> {
    return this.httpClient.post(url, data, headers);
  }
  public putData(url: string, data: any) {
    return this.httpClient.put(url, data);
  }
  public deleteData(url: string) {
    return this.httpClient.delete(url);
  }
  public getPager(totalItems: number, currentPage: number = 1, pageSize?: number) {
    // console.log('pagesasdfgh' + totalItems, 'lliuuihh', currentPage);
    if (pageSize === undefined) {
      pageSize = this.pageSize;
    }
    // console.log(pageSize,'pagesixe');
    // calculate total pages
    // tslint:disable-next-line:prefer-const
    let totalPages = Math.ceil(totalItems / pageSize);
    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    let startPage: number, endPage: number;
    if (totalPages <= 5) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    // calculate start and end item indexes


    // create an array of pages to ng-repeat in the pager control
    // tslint:disable-next-line:prefer-const
    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);
    console.log(pages);
    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      pages: pages
    };
  }
  public download(fileName: string) {
    return this.httpClient.get(fileName);
  }

 

  handleError(error: any) {
    console.log(error);
    if (error.status === 401) {
      swal({ type: 'error', text: 'Session has been expired , please login again' }).then(value => {
        this.authService.logout();
      });

    } else {
      swal({ type: 'error', text: error.error.errorMessage });
    }
  }

  public saveAsFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/pdf' });
    FileSaver.saveAs(data, fileName);
  }

  public saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE});
    FileSaver.saveAs(data, fileName);
  }

  public downloadFile(fileName: string) {
    return this.httpClient.get(fileName);
  }
  public uploadBrand(files: string, createdBy: number, importUrlToAppend: string): Observable<any> {
    const formdata: FormData = new FormData();

    formdata.append('files', files);
    formdata.append('CreatedBy', "1");

    return this.httpClient.post(APPSETTINGS.ims_url + importUrlToAppend, formdata, {
      responseType: 'json'
    });
  }

  public printPDF(data, url): Observable<any> {
    return this.httpClient.post(APPSETTINGS.ims_url + url, data, headers);
  }

  loadMainModule() {
    let user = JSON.parse(localStorage.getItem('user'));

    if (user != null) {
      this.getData(APPSETTINGS.base_url + AppURLs.GetRole + user.id).subscribe(
        response => {
          if (!response.isError) {

            this.authService.navMenuSubject.next(response.model);

          } else {
            swal({ type: 'error', text: response.message });
          }

        }, error => {
          this.handleError(error);

        }
      );
    }
  }

  getModuleName(path): string {

    let calledComponent = '';
    const pathModules: Array<any> = path.split('/');
    alert(pathModules);
    calledComponent = pathModules[pathModules.length - 1];
    if (calledComponent.toLowerCase() === 'dashboard') {

    } else if (calledComponent.toLowerCase() === 'create') {
      calledComponent = pathModules[pathModules.length - 3];
    } else if (!this.isNumeric(calledComponent)) {
      alert('its a number');
    }

    return calledComponent;

  }

  isNumeric(data): boolean {
    return isNaN(data);
  }
}


