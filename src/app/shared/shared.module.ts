import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { InPlaceEditComponent } from './components/';
import { WebviewDirective, GradiantDirective, AdapteTextColorToBgDirective, FileUploadDirective } from './directives/';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArrayFilterPipe, BytesPipe, DurationPipe, SearchPipe, SlugifyPipe, SafePipe } from './pipes';

import { ViewModeDirective } from './components/in-place-edit/directives/view-mode.directive';
import { EditModeDirective } from './components/in-place-edit/directives/edit-mode.directive';
import { EditableOnEventsDirective } from './components/in-place-edit/directives/editable-on-events.directive';
import { FocusableDirective } from './components/in-place-edit/directives/focusable.directive';
import { WebsocketService, ObsWebsocketService } from './services';
import { NbCardModule, NbButtonModule } from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { AuthModule } from '../@auth/auth.module';
import { ComponentsModule } from '../@components/components.module';
import { NotFoundComponent } from './components/not-found/not-found.component';

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
    FileUploadDirective,
    SafePipe,
    WebviewDirective,
    NotFoundComponent,
  ],
  imports: [
    NbCardModule,
    NbButtonModule,
    CommonModule,
    TranslateModule,
    FormsModule,
    ThemeModule,
    AuthModule,
    ComponentsModule,
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
    FileUploadDirective,
    SafePipe,
    TranslateModule,
    WebviewDirective,
    FormsModule
  ]
})
export class SharedModule {}
