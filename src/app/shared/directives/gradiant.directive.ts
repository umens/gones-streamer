import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[ngxGradiant]'
})
export class GradiantDirective implements OnChanges {

  @Input('ngxGradiant') gradiantColor: string;
  @Input() defaultColor: string;

  constructor(private el: ElementRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('gradiantColor')) {
      const color = this.gradiantColor || this.defaultColor || '#ffffff';
      this.el.nativeElement.style.background = 'linear-gradient(150deg, #ffffff 40%, ' + color + ' 80%)';
    }
  }

}
