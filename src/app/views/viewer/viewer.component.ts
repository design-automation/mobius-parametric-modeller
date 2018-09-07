import { Component, OnInit } from '@angular/core';

import { DataService } from '@services';

@Component({
  selector: 'viewer',
  templateUrl: './viewer.component.html'
})
export class ViewerComponent implements OnInit{

    data;

    constructor(){  }

    ngOnInit(){
      this.data = DataService.data;
    }
}
