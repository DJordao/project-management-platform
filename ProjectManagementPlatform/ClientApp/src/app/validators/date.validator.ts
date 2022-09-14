import { AbstractControl, ValidatorFn } from "@angular/forms";

export function futureDate(c: AbstractControl): { [key: string]: boolean } | null {
  var currentDate = new Date();
  currentDate = new Date(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`);

  if (c.value != null && new Date(c.value) < currentDate) {
    return { "futureDate": true }
  }
  else {
    return null;
  }
}

export function editFutureDate(oldDate: Date): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value == "") return { "futureDate": true }

    var currentDate = new Date();
    currentDate = new Date(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`);
    if (new Date(c.value).valueOf() == new Date(oldDate).valueOf()) {
      return null;
    }

    if (c.value != null && new Date(c.value) < currentDate) {
      return { "futureDate": true }
    }
    else {
      return null;
    }
  };
}
