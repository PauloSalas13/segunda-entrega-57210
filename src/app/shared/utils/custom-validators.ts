
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ValidateRutPipe } from '../pipes/validate-rut.pipe';

export class CustomValidators {
  constructor(private validateRutPipe: ValidateRutPipe) {}

  static rutValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const rut = control.value;
      if (!rut) return null;

      // Uso del pipe para la validación del RUT
      const isValid = new ValidateRutPipe().transform(rut);
      return !isValid ? { invalidRut: true } : null;
    };
  }

  static phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const phone = control.value;
      const isValid = /^[0-9]+$/.test(phone);
      return !isValid ? { invalidPhone: true } : null;
    };
  }

  static maxLengthValidator(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value && control.value.length > max ? { maxLength: true } : null;
    };
  }
}
