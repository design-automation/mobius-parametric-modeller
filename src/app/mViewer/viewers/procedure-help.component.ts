import { Component, Input } from '@angular/core';
import { ModuleDocAware } from '@shared/decorators';

@ModuleDocAware
@Component({
  selector: 'procedure-help',
  template: `
  <div *ngIf='output'>
    <h2>{{output.name}}</h2>
    <h4>Module: <span>{{output.module}}</span></h4>
    <h5><span>Description:</span></h5>
    <p>{{output.description}}</p>
    <h5 *ngIf='output.parameters?.length > 0'><span>Parameters: </span></h5>
    <p class='paramP' *ngFor='let param of output.parameters'><span>{{param.name}} - </span>{{param.description}}</p>
    <h5 *ngIf='output.returns'>Returns:</h5>
    <p *ngIf='output.returns'>{{output.returns}}</p>
  </div>


  `,
  styles: [`
$prod-background-color: rgb(250,250,250);
$background-color: rgb(220,220,220);
$title-background: #ccc;
$text-color: rgb(80,80,80);
$selected-color: rgb(0,0,150);
$function-text-color: rgb(190, 140, 30);
$separator: rgb(239,239,239);  

:host{
  height: 100%;
  width: 100%;
}
div{
  width: 100%;
  padding-left:10px;
}
h5{
  font-weight: 700;
  font-size: 12px;
}
p{
  font-family: sans-serif;
}
.funcDesc{
  font-weight: 600;
}

.paramP{
  padding-left: 5px;
  
}

span{
  font-weight: 550;
  font-style: italic;
}

`]
})
export class procedureHelpComponent{
    @Input() output; 

    constructor(){ 
    }

    ngOnInit() {
    }



}