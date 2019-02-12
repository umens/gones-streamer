import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebsocketService } from './services/websocket.service';
import { SlugifyPipe } from './pipes/slugify.pipe';
import { ArrayFilterPipe } from './pipes/array-filter.pipe';
import { DurationPipe } from './pipes/duration.pipe';
import { BytesPipe } from './pipes/bytes.pipe';

@NgModule({
  declarations: [SlugifyPipe, ArrayFilterPipe, DurationPipe, BytesPipe],
  imports: [
    CommonModule
  ],
  providers: [WebsocketService],
  exports: [SlugifyPipe, ArrayFilterPipe, DurationPipe, BytesPipe] // CommonModule, FormsModule,
})
export class SharedModule { }
