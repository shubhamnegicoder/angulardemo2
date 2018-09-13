import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nocommanumber'
})
export class NocommanumberPipe implements PipeTransform {

  transform(val: number): string {
    if (val !== undefined && val !== null) {
       return val.toString().replace(/,/g, "");
    } else {
      return "";
    }
  }

}
