import { Pipe, PipeTransform } from '@angular/core';
/*
 * Shortens a name to a certain length and appends "..." infront of it
 * Usage:
 *   value | length:number
 * Example:
 *   {{ "some_very_long_string" | length:7 }}
 *   formats to: some_ve...
*/
@Pipe({name: 'simplename'})
export class SimpleNamePipe implements PipeTransform {
  transform(value: string): string {
    return value.split('.mob')[0].replace(/_|-/g, ' ');
  }
}
