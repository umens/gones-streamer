import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ngxEditMode]'
})
export class EditModeDirective {

  constructor(public tpl: TemplateRef<any>) { }

}
