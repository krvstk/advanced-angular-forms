import {AfterViewInit, ChangeDetectionStrategy, Component, ViewChild} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {IUser} from "../../utils/forms.interface";
import {CommonModule} from "@angular/common";
import {BanWordsDirective} from "./validators/ban-words.directive";
import {PasswordShouldMatchDirective} from "./validators/password-should-match.directive";
import {UniqueNicknameDirective} from "./validators/unique-nickname.directive";

@Component({
  selector: 'app-template-driven',
  standalone: true,
  imports: [FormsModule, CommonModule, BanWordsDirective, PasswordShouldMatchDirective, UniqueNicknameDirective],
  templateUrl: './template-driven.component.html',
  styleUrl: './template-driven.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateDrivenComponent implements AfterViewInit {
  // Object to be used as ngModel variable
  user: IUser = {
    firstName: 'Bob',
    lastName: 'Bobson',
    nickname: 'Bomber',
    email: 'bobik@gg.gg',
    yearOfBirth: 1995,
    passport: 'EA123123',
    fullAddress: 'Broadway str. 13',
    city: 'Buffalo',
    postCode: 12333,
    password: '123123',
    confirmPassword: '123123',
  };

  // Reference for ngForm directive to be processed inside Component
  @ViewChild(NgForm) formDir!: NgForm;
  // Initial form value in case the form has default values preset
  private initialFormValues: unknown;
  searchString: string = '';

  get isAdult(): boolean {
    const currentYear: number = new Date().getFullYear();
    return currentYear - this.user.yearOfBirth >= 18;
  }

  get years() {
    const now: number = new Date().getUTCFullYear();
    return Array(now - (now - 40)).fill('').map((_, idx: number) => now - idx);
  }

  onSubmit(): void {
    // // Strategy 1 - Reset form values, validation statuses, making controls untouched, pristine, etc
    // // form.resetForm();
    // // Strategy 2 - Reset only control statuses but not values.
    this.formDir.resetForm(this.formDir.value);
    // Setting default value after submit
    this.initialFormValues = this.formDir.value;
  }

  onReset($event: Event): void {
    // Prevent default html form behaviour (reload page)
    $event.preventDefault();
    // Resetting form with putting default values
    this.formDir.resetForm(this.initialFormValues);
  }

  ngAfterViewInit(): void {
    // In case there is a need to save initial default values, ngAfterViewInit is used to do so.
    // However, after view was inited, the values were not registered, because it's done after resolving the promise
    // In implementation of 'addControl' method of ng_form directive
    queueMicrotask(() => {
      this.initialFormValues = this.formDir.value;
    })
  }
}
