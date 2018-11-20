import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IProcedure } from '@models/procedure';
import { InputType } from '@models/port';

@Component({
  selector: 'procedure-input-viewer',
  templateUrl: './procedure-input-viewer.component.html',
  styleUrls: ['./procedure-input-viewer.component.scss']
})
export class procedureInputViewerComponent{

    @Input() prod: IProcedure;
    @Output() delete = new EventEmitter();
    PortTypes = InputType;
    
    constructor(){ }

    editOptions(): void{ }

    onFileChange(event){
      this.prod.args[this.prod.args.length -1] = event.target.files[0];
    }

}