import { Component, Input } from '@angular/core';
import { NgRedux, select, IAppState, ADD_NODE, EXECUTE } from '@store';

@Component({
  selector: 'execute',
  template: '<button class="btn--execute" (click)="execute($event)">Execute</button>',
  styles: [ '.btn--execute{ width: 300px; height: 60px; background-color: green; color: black; }' ]
})
export class ExecuteComponent{
    @select() flowchart;
    constructor(private ngRedux: NgRedux<IAppState>){}

    execute($event): void{
      this.ngRedux.dispatch({type: EXECUTE})
    }
}