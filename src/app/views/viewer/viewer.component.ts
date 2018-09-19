import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'viewer',
  templateUrl: './viewer.component.html'
})
export class ViewerComponent implements OnInit{

    data;
    constructor(){  }

    ngOnInit(){ }

    get_str(): string{
      return Object.keys(this.data).join("__");
    }

    load_file(data): void{   }
}
