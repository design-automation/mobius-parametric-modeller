import { Component, Input } from '@angular/core';

@Component({
  selector: 'tab',
  styles: [
    `
    .pane{
      padding: 0;
    }
  `
  ],
  template: `
    <div [hidden]="!active" class="pane">
      <ng-content></ng-content>
    </div>
  `
})
export class TabComponent {
    // tslint:disable-next-line: no-input-rename
    @Input('tabTitle') title: string;
    @Input() active = false;
    // tslint:disable-next-line: no-input-rename
    @Input('index') index: number;
}
