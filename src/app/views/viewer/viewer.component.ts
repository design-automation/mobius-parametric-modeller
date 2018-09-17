import { Component, OnInit } from '@angular/core';
import { NgRedux, select, IAppState, LOAD_FLOWCHART } from '@store';

@Component({
  selector: 'viewer',
  templateUrl: './viewer.component.html'
})
export class ViewerComponent implements OnInit{

    data;
    constructor(private ngRedux: NgRedux<IAppState>){  }

    ngOnInit(){ }

    get_str(): string{
      return Object.keys(this.data).join("__");
    }

    load_file(data): void{
      this.ngRedux.dispatch({type: LOAD_FLOWCHART, flowchart: data});
    }
}
