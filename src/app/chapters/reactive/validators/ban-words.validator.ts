import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function banWords(bannedWords: string[] = []): ValidatorFn {
  return (control: AbstractControl<string | null>): ValidationErrors | null => {
    const foundedBannedWord = bannedWords.find((word: string) =>
      word.toLowerCase() === control.value?.toLowerCase()
    );
    return !foundedBannedWord ? null : { banWords: {bannedWord: foundedBannedWord}}
  }
}
