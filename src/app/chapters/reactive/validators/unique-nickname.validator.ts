import {Injectable} from '@angular/core';
import {AbstractControl, AsyncValidator, ValidationErrors} from "@angular/forms";
import {catchError, map, Observable, of} from 'rxjs';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
// Implemented as service, to inject HttpClient more easily
export class UniqueNicknameValidator implements AsyncValidator {

  constructor(private http: HttpClient) {
  }

  validate(control: AbstractControl<string | null>): Observable<ValidationErrors | null> {
    return this.http.get<unknown[]>(`https://jsonplaceholder.typicode.com/users?username=${control.value}`).pipe(
      map(users =>
        users.length === 0
          ? null
          : {uniqueName: {isTaken: true}}
      ),
      catchError(() => of({uniqueName: {unknownError: true}})),
    )
  }
}
