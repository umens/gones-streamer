import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appAdapteTextColorToBg]'
})
export class AdapteTextColorToBgDirective implements OnChanges {

  @Input('appAdapteTextColorToBg') bgColor: string;
  @Input() defaultColor: string;

  constructor(private el: ElementRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('bgColor')) {
      const color = this.bgColor || this.defaultColor || '#ffffff';
      this.el.nativeElement.style.color = this.getContrastYIQ(color);
    }
  }

  getContrastYIQ(hexcolor: string) {
    hexcolor = hexcolor.replace('#', '');
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
}

}
