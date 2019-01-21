import { Component, Input } from '@angular/core';

@Component({
  selector: 'publish-header',
  templateUrl:  'publish-header.component.html',
  styleUrls: ['publish-header.component.scss']
})
export class PublishHeaderComponent {

    @Input() title: string;

    constructor() { }

    getTitle() {
        return this.title.replace(/_/g, ' ');
    }

}
