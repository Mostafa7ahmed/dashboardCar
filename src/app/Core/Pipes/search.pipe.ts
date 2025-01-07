import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {

  transform(ArryOfData:any[], text:string): any[] {
    return ArryOfData.filter((item)=>item.name.toLowerCase().includes(text));
  }
}
