import { Component, Input } from '@angular/core';


@Component({
  selector: 'port',
  template: '<div class="port"></div>',
  styles:   [
      '.port {\
            width: 15px; \
            height: 15px;\
            border: 2px solid #222;\
            background-color: #ddd;\
            border-radius: 50%; \
            margin: 10px 0px;\
       }']
})
export class PortComponent{
    
    @Input() data: any;

    ngOnInit(){ }
}