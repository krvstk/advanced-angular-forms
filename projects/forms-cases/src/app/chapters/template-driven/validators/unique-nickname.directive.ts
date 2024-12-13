import {ChangeDetectorRef, Directive} from '@angular/core';
import {AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors} from "@angular/forms";
import {catchError, finalize, map, Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Directive({
  selector: '[appUniqueNickname]',
  standalone: true,
  providers: [
    { provide: NG_ASYNC_VALIDATORS, useExisting: UniqueNicknameDirective, multi: true}
  ]
})
// Custom async validator with http call for template-driven approach, return promise/observable or null
export class UniqueNicknameDirective implements AsyncValidator {

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) { }

  validate(control: AbstractControl<string>): (Promise<ValidationErrors | null> | Observable<ValidationErrors | null>) {
    return this.http.get<unknown[]>(`https://jsonplaceholder.typicode.com/users?username=${control.value}`).pipe(
      map(users => {
        return users.length === 0
        ? null
        : {appUniqueNickname: { isTaken: true} }
      }),
      catchError(() => of({ appUniqueNickname: { unknownError: true }})),
      // In case of OnPush strategy, manually include validation to change detection
      finalize(() => this.cd.markForCheck()),
    );
  }
}
