import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PortTypesAware } from '@shared/decorators';
import { IProcedure } from '@models/procedure';
 
@PortTypesAware
@Component({
  selector: 'procedure-input-editor',
  templateUrl: './procedure-input-editor.component.html',
  styleUrls: ['./procedure-input-editor.component.scss']
})
export class procedureInputEditorComponent{

    @Input() prod: IProcedure;
    @Output() delete = new EventEmitter();
    
    constructor(){ }

    editOptions(): void{ }

    onFileChange(event){
      this.prod.args[this.prod.args.length -1] = event.target.files[0];
    }

}