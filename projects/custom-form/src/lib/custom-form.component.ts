import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import {NgClass} from "@angular/common";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

export type RatingOptions = 'great' | 'good' | 'neutral' | 'bad' | null;
@Component({
  selector: 'lib-custom-form',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: 'custom-form.component.html',
  styleUrls: ['./custom-form.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: CustomFormComponent,
    multi: true,
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomFormComponent implements OnChanges, ControlValueAccessor {
  @Input()
  value: RatingOptions = null;

  @Output()
  changed = new EventEmitter<RatingOptions>();

  @Input()
  disabled = false;

  onChange: (newValue: RatingOptions) => void = () => {};
  onTouch: () => void = () => {};

  @Input()
  @HostBinding('attr.tabIndex')
  tabIndex = 0;

  @HostListener('blur')
  onBlur() {
    this.onTouch();
  }

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.onChange(changes['value'].currentValue);
    }
  }

  setValue(value: RatingOptions) {
    if (!this.disabled) {
      this.value = value;
      this.onChange(this.value);
      this.onTouch();
      this.changed.emit(value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(obj: RatingOptions): void {
    this.value = obj;
    this.cd.markForCheck();
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this.cd.markForCheck();
  }
}

