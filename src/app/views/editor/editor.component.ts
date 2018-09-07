import { Component } from '@angular/core';
import { DataService } from '@services';

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html'
})
export class EditorComponent{
    data; 

    constructor(){ this.data = DataService.data; }
}
