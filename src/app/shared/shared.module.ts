import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArrayFilterPipe } from './pipes/array-filter.pipe';
import { BytesPipe } from './pipes/bytes.pipe';
import { DurationPipe } from './pipes/duration.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { SlugifyPipe } from './pipes/slugify.pipe';

import { WebsocketService } from './services/websocket.service';
import { ObsWebsocketService } from './services/obs-websocket.service';
import { ViewModeDirective } from './components/in-place-edit/directives/view-mode.directive';
import { EditModeDirective } from './components/in-place-edit/directives/edit-mode.directive';
import { InPlaceEditComponent } from './components/in-place-edit/in-place-edit.component';
import { EditableOnEventsDirective } from './components/in-place-edit/directives/editable-on-events.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FocusableDirective } from './components//in-place-edit/directives/focusable.directive';
import { GradiantDirective } from './directives/gradiant.directive';
import { AdapteTextColorToBgDirective } from './directives/adapte-text-color-to-bg.directive';

@NgModule({
  declarations: [
    ArrayFilterPipe,
    BytesPipe,
    DurationPipe,
    SearchPipe,
    SlugifyPipe,
    ViewModeDirective,
    EditModeDirective,
    InPlaceEditComponent,
    EditableOnEventsDirective,
    FocusableDirective,
    GradiantDirective,
    AdapteTextColorToBgDirective,
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    WebsocketService,
    ObsWebsocketService
  ],
  exports: [
    SlugifyPipe,
    ArrayFilterPipe,
    DurationPipe,
    BytesPipe,
    SearchPipe,
    ViewModeDirective,
    EditModeDirective,
    InPlaceEditComponent,
    EditableOnEventsDirective,
    FocusableDirective,
    FormsModule,
    ReactiveFormsModule,
    GradiantDirective,
    AdapteTextColorToBgDirective,
  ]
})
export class SharedModule { }
