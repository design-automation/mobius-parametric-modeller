import { Component, Input, Output,  EventEmitter, OnInit, OnDestroy} from '@angular/core';

import { IProcedure } from '@models/procedure';
import { ProcedureTypesAware } from '@shared/decorators';

@ProcedureTypesAware
@Component({
    selector: 'procedure-item',
    templateUrl: './procedure-item.component.html', 
    styleUrls: ['procedure-item.component.scss']
})
export class ProcedureItemComponent{

    @Input() data: IProcedure;


}