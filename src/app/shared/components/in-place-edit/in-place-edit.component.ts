import { Component, EventEmitter, Output, ContentChild, OnInit, ElementRef, OnDestroy, TemplateRef } from '@angular/core';
import { ViewModeDirective } from './directives/view-mode.directive';
import { EditModeDirective } from './directives/edit-mode.directive';
import { Subject, fromEvent } from 'rxjs';
import { take, filter, switchMapTo } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'ngx-in-place-edit',
  template: `
    <ng-container *ngTemplateOutlet="currentView"></ng-container>
  `,
  styleUrls: ['./in-place-edit.component.scss']
})
export class InPlaceEditComponent implements OnInit, OnDestroy {

  @Output() update = new EventEmitter();
  @Output() cancel = new EventEmitter();
  // @ContentChild(EditModeDirective, { read: TemplateRef, static: false }) editModeTpl: EditModeDirective;
  // @ContentChild(ViewModeDirective, { read: TemplateRef, static: false }) viewModeTpl: ViewModeDirective;
  @ContentChild(ViewModeDirective, { static: false }) viewModeTpl: ViewModeDirective;
  @ContentChild(EditModeDirective, { static: false }) editModeTpl: EditModeDirective;

  mode: 'view' | 'edit' = 'view';

  editMode = new Subject();
  editMode$ = this.editMode.asObservable();

  constructor(private host: ElementRef) {
  }

  ngOnInit() {
    this.viewModeHandler();
    this.editModeHandler();
  }

  toViewMode() {
    this.update.next();
    this.mode = 'view';
  }

  cancelUpdate() {
    this.cancel.next();
    this.mode = 'view';
  }

  private get element() {
    return this.host.nativeElement;
  }

  private viewModeHandler() {
    fromEvent(this.element, 'dblclick').pipe(
      untilDestroyed(this)
    ).subscribe(() => {
      this.mode = 'edit';
      this.editMode.next(true);
    });
  }

  private editModeHandler() {
    const clickOutside$ = fromEvent(document, 'click').pipe(
      filter(({ target }) => this.element.contains(target) === false),
      take(1)
    );

    this.editMode$.pipe(
      switchMapTo(clickOutside$),
      untilDestroyed(this)
    ).subscribe(event => this.toViewMode());
  }

  get currentView() {
    return this.mode === 'view' ? this.viewModeTpl.tpl : this.editModeTpl.tpl;
  }

  ngOnDestroy() {
  }

}
