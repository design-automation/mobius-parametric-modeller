import { Component } from '@angular/core';
import { NgRedux, select, IAppState, ADD_NODE } from '@store';

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styles: [ ".editor { height: 100%; width: 500px }" ]
})
export class EditorComponent{
    
    @select() flowchart;
    constructor(private ngRedux: NgRedux<IAppState>){}

    add(): void{
      this.ngRedux.dispatch({type: ADD_NODE})
    }
}
