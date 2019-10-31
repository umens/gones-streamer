import { Directive, ElementRef, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: '[ngxGradiant]'
})
export class GradiantDirective {

  @Input('ngxGradiant') gradiantColor: string;
  @Input() defaultColor: string;


  constructor(private el: ElementRef, private sr: DomSanitizer) {
    console.log(this.gradiantColor)
    el.nativeElement.style.backgroundColor = this.gradiantColor;
    // el.nativeElement.style.background = '#ffffff';
    // console.log(el.nativeElement.style)
    // tslint:disable-next-line: max-line-length
    // el.nativeElement.style.background = sr.bypassSecurityTrustStyle('linear-gradient(150deg, #ffffff 40%, ' + this.gradiantColor || this.defaultColor || '#ffffff' + ' 80%)');
    // console.log(el.nativeElement.style)
    console.log(el.nativeElement.style)
    console.log(el.nativeElement.style.background)
  }

}
