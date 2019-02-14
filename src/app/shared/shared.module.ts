import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebsocketService } from './services/websocket.service';
import { SlugifyPipe } from './pipes/slugify.pipe';
import { ArrayFilterPipe } from './pipes/array-filter.pipe';
import { DurationPipe } from './pipes/duration.pipe';
import { BytesPipe } from './pipes/bytes.pipe';
import { SearchPipe } from './pipes/search.pipe';

@NgModule({
  declarations: [SlugifyPipe, ArrayFilterPipe, DurationPipe, BytesPipe, SearchPipe],
  imports: [
    CommonModule
  ],
  providers: [WebsocketService],
  exports: [SlugifyPipe, ArrayFilterPipe, DurationPipe, BytesPipe, SearchPipe] // CommonModule, FormsModule,
})
export class SharedModule { }
