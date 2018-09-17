import { Component } from '@angular/core';
import { NgRedux, select, IAppState, ADD_NODE } from '@store';

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html'
})
export class EditorComponent{
    
    @select() flowchart;
    constructor(private ngRedux: NgRedux<IAppState>){}

    add(): void{
      this.ngRedux.dispatch({type: ADD_NODE})
    }
}
