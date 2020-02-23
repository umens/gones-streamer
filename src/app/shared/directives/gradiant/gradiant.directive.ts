import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appGradiant]'
})
export class GradiantDirective implements OnChanges {

  @Input('appGradiant') gradiantColor: string;
  @Input() defaultColor: string;

  constructor(private el: ElementRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('gradiantColor')) {
      const color = this.gradiantColor || this.defaultColor || '#ffffff';
      this.el.nativeElement.style.background = 'linear-gradient(150deg, #ffffff 40%, ' + color + ' 80%)';
    }
  }

}
