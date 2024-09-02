import { Injectable } from '@angular/core';
import {delay, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  constructor() { }

  imitateGetCall() {
    return of(['Angular', 'RxJS', 'Docker', 'Python']).pipe(delay(1000));
  }
}
