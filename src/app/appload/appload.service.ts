import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs';
import { APPSETTINGS } from '../core/interfaces';



@Injectable({ providedIn: 'root' })
export class AppLoadService {

  constructor(private httpClient: HttpClient) { }

  initializeApp(): Promise<any> {
    return new Promise((resolve, reject) => {


      setTimeout(() => {

        // doing something

        resolve();
      }, 3000);
    });
  }

  getSettings(): Promise<any> {


    const promise = this.httpClient.get('../../assets/config/data.json')
      .toPromise()
      .then((settings: any) => {

        // console.log(settings.java_url);
        APPSETTINGS.base_url = settings.base_url;
        APPSETTINGS.operator_base_url = settings.operator_base_url;
        APPSETTINGS.ims_url = settings.ims_url;
        // APP_SETTINGS.base_url = settings.base_url;

        APPSETTINGS.payment_url = settings.payment_url;
        APPSETTINGS.printBase_url = settings.printBase_url;



        return settings;
      });

    return promise;
  }
}
