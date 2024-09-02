import {ChangeDetectorRef, Component, DestroyRef, inject, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {
  AbstractControlOptions,
  FormBuilder,
  FormControl,
  FormGroup, FormGroupDirective,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {bufferCount, debounceTime, distinctUntilChanged, filter, first, Observable, startWith, tap} from "rxjs";
import {FormsService} from "../../utils/forms.service";
import {banWords} from "./validators/ban-words.validator";
import {passwordMatch} from "./validators/password-match.validator";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {UniqueNicknameValidator} from "./validators/unique-nickname.validator";

@Component({
  selector: 'app-reactive',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './reactive.component.html',
  styleUrl: './reactive.component.scss'
})
export class ReactiveComponent implements OnInit {

  phoneLabels = ['Main', 'Work', 'Mobile', 'Home'];

  // Imitation for unknown async data to use FormArray further.
  skills$!: Observable<string[]>;

  years = this.getYears();

  // Reactive approach using FormBuilder, a service that provides convenient methods for generating controls.
  form = this.fb.group({
    // 'Prettified' structure with fb.
    // firstName - FormControl, which value is an array, first element is name of FormControl, second is an
    // Array of Validators in case it's set of sync validators or an object with defined properties.
    // 'banWords' - custom validator as function
    firstName: ['Bob', [Validators.required, Validators.minLength(2), banWords(['test', 'noob'])]],
    lastName: ['Smith', [Validators.required, Validators.minLength(2)]],
    nickName: ['Bobby',
      {
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[\w.]+$/),
          // Custom sync validator
          banWords(['dummy', 'anonymous']),
        ],
        asyncValidators: [
          // Custom async validator with http, bind is needed to use HttpClient injected class inside this class
          this.uniqueNickname.validate.bind(this.uniqueNickname),
        ],
        // Option when to run validation - on 'blur' event
        updateOn: 'blur'
      },
    ],
    email: ['bob@gmail.com', [Validators.required, Validators.email]],
    yearOfBirth:
    // nonNullable - a property that removes 'null' as one of type the FormControl (or group) and make the value default
      this.fb.nonNullable.control(this.years[this.years.length - 1],
        Validators.required),
    passport: ['', Validators.pattern(/^[A-Z]{2}[0-9]{6}$/)],
    // Grouping part of the form into FormGroup (inside parent FormGroup)
    address: this.fb.nonNullable.group({
      fullAddress: ['', Validators.required],
      city: ['', Validators.required],
      postCode: [0, Validators.required]
    }),
    // FormArray - used when form might have multiple FormControls/Groups, but of unknown quantity and names
    phones: this.fb.array([
      this.fb.group({
        label: this.fb.nonNullable.control(this.phoneLabels[0]),
        phone: '',
      }),
    ]),
    // FormRecord - very similar to FormGroup, but shorter and indicates that this group likely to be modified
    skills: this.fb.record<boolean>({}),
    password: this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ''
    }, {
      // Custom cross-field validator
      validators: passwordMatch
    } as AbstractControlOptions)
  });

  // Standalone FormControl, used w/o <form> tag
  searchFieldControl = new FormControl('');
  searchValue: string = '';
  destroyRef: DestroyRef = inject(DestroyRef);
  private initialFormValues: any;

  // Reference for FormGroupDirective
  @ViewChild(FormGroupDirective)
  private formDir!: FormGroupDirective

  constructor(
    private formService: FormsService,
    private fb: FormBuilder,
    private uniqueNickname: UniqueNicknameValidator,
    private cd: ChangeDetectorRef,
  ) {
  }


  ngOnInit() {
    // Subscription to standalone FormControl value change
    this.searchFieldControl.valueChanges.pipe(
      // One in 250 ms
      debounceTime(250),
      // No emit if same value
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef),
    )
      .subscribe((value: any) => {
        this.searchValue = value;
      })

    this.skills$ = this.formService.imitateGetCall().pipe(
      // After getting async data, build FormArray with it
      tap((skills: string[]) => this.buildSkillsControls(skills)),
      // Set initial form values in case of reset
      tap(() => this.initialFormValues = this.form.value),
      takeUntilDestroyed(this.destroyRef),
    );

    this.form.controls.yearOfBirth.valueChanges
      .pipe(
        // Mark as dirty to activate error message/styles
        tap(() => this.form.controls.passport.markAsDirty()),
        // Immediately emit a value to activate validator
        startWith(this.form.controls.yearOfBirth.value),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((year: number) => {
        // Add or remove validator dynamically
        this.isAdult(year)
          ? this.form.controls.passport.addValidators(Validators.required)
          : this.form.controls.passport.removeValidators(Validators.required);
        // Trigger validation manually
        this.form.controls.passport.updateValueAndValidity();
      });

    // For OnPush strategy, manually trigger cd after form had 'pending' status
    this.form.statusChanges.pipe(
      // Save previous and current statuses
      bufferCount(2, 1),
      filter(([prevState]) => prevState === 'PENDING')
    ).subscribe(() => this.cd.markForCheck())
  }

  getYears(): number[] {
    const now = new Date().getUTCFullYear();
    return Array(now - (now - 50)).fill('').map((_, idx) => now - idx);
  }

  addPhone(): void {
    // Add FormGroup into FormArray
    this.form.controls.phones.insert(0,
      new FormGroup({
        label: new FormControl(this.phoneLabels[0], {nonNullable: true}),
        phone: new FormControl(''),
      }));
  }

  removeButton(i: number): void {
    // Remove from FormArray
    this.form.controls.phones.removeAt(i);
  }

  onSubmit($event: Event): void {
    // Save initial form values
    this.initialFormValues = this.form.value;
    // Reset form's statuses
    this.formDir.resetForm(this.form.value);
  }

  onReset(e: Event): void {
    e.preventDefault();
    this.formDir.resetForm(this.initialFormValues);
  }

  buildSkillsControls(skills: string[]): void {
    skills.forEach(skill => {
      // Add controls into FormRecord (which extends FormGroup)
      this.form.controls.skills.addControl(skill, new FormControl(false, {nonNullable: true}));
    })
  }

  private isAdult(yearOfBirth: number): boolean {
    const currentYear = new Date().getFullYear();
    return currentYear - yearOfBirth >= 18;
  }
}
