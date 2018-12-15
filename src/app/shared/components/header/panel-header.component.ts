import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'panel-header',
  templateUrl:  'panel-header.component.html',
  styleUrls: ['panel-header.component.scss']
})
export class PanelHeaderComponent {

    @Input() title: string;

    constructor(private router: Router) {
      }

    getTitle() {
        return this.title.replace(/_/g, ' ');
    }
}
