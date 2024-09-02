import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatCard, MatCardContent} from "@angular/material/card";
import {TemplateDrivenComponent} from "./chapters/template-driven/template-driven.component";
import {NgSwitch, NgSwitchCase} from "@angular/common";
import {ReactiveComponent} from "./chapters/reactive/reactive.component";
import {CustomRatingPickerComponent} from "./chapters/custom-rating-picker/custom-rating-picker.component";
import {CustomSelectComponent} from "./chapters/custom-select/custom-select.component";
import {DynamicComponent} from "./chapters/dynamic/dynamic.component";
import {MatButton} from "@angular/material/button";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {FormsService} from "./utils/forms.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatCard, MatCardContent, TemplateDrivenComponent, NgSwitch, NgSwitchCase, ReactiveComponent, CustomRatingPickerComponent, CustomSelectComponent, DynamicComponent, MatButton, MatButtonToggleGroup, MatButtonToggle, ReactiveFormsModule],
  providers: [FormsService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'forms-course-ng-18';
  chapter: FormControl = new FormControl('template');
}
