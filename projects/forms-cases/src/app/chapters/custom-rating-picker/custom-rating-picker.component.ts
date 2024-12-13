import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import '@polymer/paper-input/paper-textarea'
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {EditableContentValueAccessor} from "./value-accessor/editable-content-value-accessor.directive";
import {CustomFormComponent, RatingOptions } from "custom-form";


interface Rating {
  reviewText: string;
  reviewRating: RatingOptions;
}

@Component({
  selector: 'app-custom-rating-picker',
  standalone: true,
  imports: [ReactiveFormsModule, EditableContentValueAccessor, CustomFormComponent],
  templateUrl: './custom-rating-picker.component.html',
  styleUrl: './custom-rating-picker.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CustomRatingPickerComponent {

  form: FormGroup = this.fb.group<Rating>({
    reviewText: '',
    reviewRating: 'great',
  });

  constructor(private fb: FormBuilder) {
  }

  onSubmit($event: any) {
    console.log(this.form.value);
    // this.form.reset();
  }
}
