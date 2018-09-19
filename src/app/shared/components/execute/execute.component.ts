import { Component } from '@angular/core';

@Component({
  selector: 'execute',
  template: '<button class="btn--execute" (click)="execute($event)">Execute</button>',
  styles: [ '.btn--execute{ width: 300px; height: 60px; background-color: green; color: black; }' ]
})
export class ExecuteComponent{
    constructor(){}
    
    execute($event): void{  }
}