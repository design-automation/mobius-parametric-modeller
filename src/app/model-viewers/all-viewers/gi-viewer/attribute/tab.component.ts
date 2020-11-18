import { Component, Input } from '@angular/core';

@Component({
  selector: 'my-tab',
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
export class ATabComponent {
    // tslint:disable-next-line: no-input-rename
    @Input('tabTitle') title: string;
    @Input() active = false;
    // tslint:disable-next-line: no-input-rename
    @Input('index') index: number;
}
