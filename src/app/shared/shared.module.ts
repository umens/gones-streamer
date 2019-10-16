import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArrayFilterPipe } from './pipes/array-filter.pipe';
import { BytesPipe } from './pipes/bytes.pipe';
import { DurationPipe } from './pipes/duration.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { SlugifyPipe } from './pipes/slugify.pipe';

import { WebsocketService } from './services/websocket.service';

@NgModule({
  declarations: [ArrayFilterPipe, BytesPipe, DurationPipe, SearchPipe, SlugifyPipe],
  imports: [
    CommonModule
  ],
  providers: [WebsocketService],
  exports: [SlugifyPipe, ArrayFilterPipe, DurationPipe, BytesPipe, SearchPipe]
})
export class SharedModule { }
