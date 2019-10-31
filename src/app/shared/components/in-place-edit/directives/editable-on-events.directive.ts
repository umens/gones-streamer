import { Directive, HostListener } from '@angular/core';
import { InPlaceEditComponent } from '../in-place-edit.component';

@Directive({
  selector: '[ngxEditableOnEvents]'
})
export class EditableOnEventsDirective {

  constructor(private inPlaceEdit: InPlaceEditComponent) { }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    // tslint:disable-next-line: deprecation
    const key = event.key || event.keyCode;
    switch (key) {
      // enter
      case 'Enter':
      case 13:
        this.inPlaceEdit.toViewMode();
        break;
      // escape
      case 'Escape':
      case 27:
        this.inPlaceEdit.cancelUpdate();
        break;

      default:
        break;
    }
  }

}
