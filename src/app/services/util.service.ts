import { FormArray, FormControl, FormGroup } from '@angular/forms';

export const markGroupDirty = (formGroup: FormGroup) =>
  Object.keys(formGroup.controls).forEach((key) => {
    console.log(key);
    console.log(formGroup.get(key)?.constructor.name);

    switch (formGroup.get(key)?.constructor.name) {
      case 'FormGroup':
        markGroupDirty(formGroup.get(key) as FormGroup);
        break;
      case 'FormArray':
        markArrayDirty(formGroup.get(key) as FormArray);
        break;
      case 'FormControl':
        markControlDirty(formGroup.get(key) as FormControl);
        break;
      case 'FormControl2':
        markControlDirty(formGroup.get(key) as FormControl);
        break;
    }
  });

export const markArrayDirty = (formArray: FormArray) =>
  formArray.controls.forEach((control) => {
    switch (control.constructor.name) {
      case 'FormGroup':
        markGroupDirty(control as FormGroup);
        break;
      case 'FormArray':
        markArrayDirty(control as FormArray);
        break;
      case 'FormControl':
        markControlDirty(control as FormControl);
        break;
    }
  });
export const markControlDirty = (formControl: FormControl) =>
  formControl.markAsDirty();
