import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ngxViewMode]'
})
export class ViewModeDirective {

  constructor(public tpl: TemplateRef<any>) { }

}
