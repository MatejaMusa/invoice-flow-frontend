import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extractvalue'
})
export class ExtractvaluePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
