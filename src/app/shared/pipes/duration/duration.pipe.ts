import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(seconds: number): string {
    const hours: number = seconds / 3600;
    const minutes: number = (seconds % 3600) / 60;
    seconds %= 60;

    return [hours, minutes, seconds].map(this.format).join(':');
  }

  format(val: number): string {
    return ('0' + Math.floor(val)).slice(-2);
  }

}
