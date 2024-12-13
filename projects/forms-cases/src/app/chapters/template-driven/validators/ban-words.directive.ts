import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from "@angular/forms";

@Directive({
  selector: '[appBanWords]',
  standalone: true,
  providers: [
    { provide: NG_VALIDATORS, useExisting: BanWordsDirective, multi: true }
  ],
})
// Custom validator that used for template-driven forms
export class BanWordsDirective implements Validator {

  @Input()
  set appBanWords(value : string | string[]) {
    this.bannedWords = Array.isArray(value) ? value : [value];
    // When value changes - trigger validation check manually
    this.onChangeCallback();
  };
  private bannedWords: string[] = [];
  private onChangeCallback: () => void = () => {};

  validate(control: AbstractControl<string>): ValidationErrors | null {
    const foundBannerWord = this.bannedWords.find(word => word.toLowerCase() === control.value?.toLowerCase())
    return !foundBannerWord ? null : { appBanWords: { bannedWord: foundBannerWord }};
  }

  // Default optional method of Validator interface that registers a callback function, which will trigger the check
  registerOnValidatorChange(fn: () => void): void {
    this.onChangeCallback = fn;
  }
}
