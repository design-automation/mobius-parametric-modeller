import { Component, Input } from '@angular/core';
import { INode } from '@models/node';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';


@Component({
  selector: 'panel-header',
  templateUrl:  `header.component.html`,
  styleUrls: [`header.component.scss`]
})
export class HeaderComponent {

    @Input() title: string;

    constructor(private router: Router) {
      }

    getTitle() {
        return this.title.replace(/_/g, ' ');
    }
}
