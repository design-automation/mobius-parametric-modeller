import { Component } from '@angular/core';

@Component({
  selector: 'execute',
  template:  `<button class="btn--execute" 
                    (click)="execute($event)">
                    Execute
              </button>`,
  styles: [ 
            `.btn--execute{ 
                font-size: 14px;
                line-height: 18px;
                border: 3px solid #E0C229;
                border-radius: 4px;
                padding: 2px 10px;
                background-color: #E0C229; 
                color: #494D59;
                font-weight: 600;
                text-transform: uppercase;
              }` 
          ]
})
export class ExecuteComponent{
    constructor(){}
    
    execute($event): void{  }
}