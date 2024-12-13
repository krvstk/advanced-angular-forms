import {Directive, ElementRef, HostListener, Renderer2, SecurityContext} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {DomSanitizer} from "@angular/platform-browser";

const DEFAULT_TEMPLATE = `
<h4 data-placeholder="Title..."></h4>
<p data-placeholder="Describe..."></p>
`;

@Directive({
  selector: '[formControlName][contenteditable],[formControl][contenteditable],[ngModel][contenteditable]',
  standalone: true,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: EditableContentValueAccessor,
    multi: true,
  }],
})
export class EditableContentValueAccessor implements ControlValueAccessor {

  onChange!: (newValue: string) => void;
  onTouch!: () => void;

  @HostListener('input', ['$event'])
  onInput(e: Event) {
    this.onChange((e.target as HTMLElement).innerHTML);
  }

  @HostListener('blur')
  onBlur() {
    this.onTouch();
  }

  constructor(
    private element: ElementRef,
    private render: Renderer2,
    private sanitizer: DomSanitizer,
  ) {
  }

  writeValue(obj: any): void {
    this.render.setProperty(
      this.element.nativeElement,
      'innerHTML',
      this.sanitizer.sanitize(SecurityContext.HTML, obj) || DEFAULT_TEMPLATE,
    );
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.render.setProperty(
      this.element.nativeElement,
      'contentEditable',
      !isDisabled
    )
  }
}
