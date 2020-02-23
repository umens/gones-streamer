import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  pure: false
})
export class SearchPipe implements PipeTransform {

  transform(items: any[], searchText: string, field?: string): any[] {
    if (!items) { return []; }
    if (!searchText) { return items; }
    searchText = searchText.toLowerCase();

    return items.filter(it => {
      if (field !== undefined) {
        return it[field].toLowerCase().includes(searchText);
      } else {
        return it.toLowerCase().includes(searchText);
      }
    });
  }

}
