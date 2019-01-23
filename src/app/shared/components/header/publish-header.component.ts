import { Component, Input } from '@angular/core';

@Component({
  selector: 'publish-header',
  templateUrl:  'publish-header.component.html',
  styleUrls: ['publish-header.component.scss']
})
export class PublishHeaderComponent {

    @Input() title: string;
    expando_href: string;

    constructor() {
        const url = window.location.href.replace(/:/g, '%3A').replace(/\//g, '%2F');
        this.expando_href = `http://expando.github.io/add/?u=${url}&t=M%C3%B6bius%20Modeller%20Publish`;
    }

    getTitle() {
        return this.title.replace(/_/g, ' ');
    }

}
