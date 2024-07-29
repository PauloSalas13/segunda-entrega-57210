import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'validateRut'
})
export class ValidateRutPipe implements PipeTransform {

  transform(value: string): boolean {
    if (!value || value.length < 9) {
      return false;
    }

    value = value.replace(/\./g, '').replace('-', '');
    const body = value.slice(0, -1);
    const dv = value.slice(-1).toUpperCase();

    let sum = 0;
    let multiplier = 2;

    for (let i = 1; i <= body.length; i++) {
      sum += multiplier * +body.charAt(body.length - i);

      multiplier = multiplier < 7 ? multiplier + 1 : 2;
    }

    const mod = sum % 11;
    const calculatedDv = mod === 0 ? '0' : mod === 1 ? 'K' : (11 - mod).toString();

    return calculatedDv === dv;
  }
}

