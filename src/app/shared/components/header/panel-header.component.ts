import { Component, Input, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '@shared/services';
import * as circularJSON from 'circular-json';

@Component({
  selector: 'panel-header',
  templateUrl:  'panel-header.component.html',
  styleUrls: ['panel-header.component.scss']
})
export class PanelHeaderComponent {

    @Input() title: string;
    executeCheck: boolean;
    dialogBox: HTMLDialogElement;

    urlSet = ['', 'publish', '', ''];
    urlValid: boolean;
    urlNodes;

    constructor(private dataService: DataService, private router: Router) {
        if (this.router.url === '/about' || this.router.url === '/gallery') {
            this.executeCheck = false;
        } else {
            this.executeCheck = true;
        }
    }

    getTitle() {
        return this.title.replace(/_/g, ' ');
    }

    getUrl() {
        return this.router.url;
    }

    loadFile() {
        document.getElementById('file-input').click();
        // this.router.navigate(['/dashboard']);
    }

    openDropdownMenu(e: MouseEvent) {
        /*
        const dropdowns = document.getElementsByClassName('dropdown-content');
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
            }
        }
        */
        const stl = document.getElementById('dropdownMenu').style;
        if (!stl.display || stl.display === 'none') {
            stl.display = 'block';
            // const bRect = (<Element>e.target).getBoundingClientRect();
            // stl.transform = `translate(` + bRect.left + `px, ` + bRect.height + `px)`;
        } else {
            stl.display = 'none';
        }
        e.stopPropagation();

    }

    openUrlDialog(event) {
        event.stopPropagation();
        this.dialogBox = <HTMLDialogElement>document.getElementById('genUrlDialog');
        this.dialogBox.showModal();
    }

    @HostListener('window:click', ['$event'])
    onWindowClick(event: MouseEvent) {
        const dropdownMenu = document.getElementById('dropdownMenu');
        if (dropdownMenu) {
            dropdownMenu.style.display = 'none';
        }
        const nodeMenu = document.getElementById('nodeMenu');
        if (nodeMenu) {
            nodeMenu.style.display = 'none';
        }
        const galleryMenu = document.getElementById('galleryMenu');
        if (galleryMenu) {
            galleryMenu.style.display = 'none';
        }
        const helpMenu = document.getElementById('helpMenu');
        if (helpMenu) {
            helpMenu.style.display = 'none';
        }
        if (this.dialogBox) {
            if ((<HTMLElement>event.target).tagName === 'SELECT') { return; }

            const rect = this.dialogBox.getBoundingClientRect();

            const isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height
              && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
            if (!isInDialog) {
                this.dialogBox.close();
                this.dialogBox = undefined;
            }
        }
    }

    validateUrl() {
        if (this.urlSet[0] === '') {
            this.urlValid = false;
            return;
        }
        const request = new XMLHttpRequest();

        let url = this.urlSet[0];
        if (url.indexOf('dropbox') !== -1) {
            url = url.replace('www', 'dl').replace('dl=0', 'dl=1');
        }
        request.open('GET', url);

        request.onload = () => {
            if (request.status === 200) {
                try {
                    const f = circularJSON.parse(request.responseText);
                    this.urlNodes = f.flowchart.nodes;
                    this.urlValid = true;
                } catch (ex) {
                    this.urlValid = false;
                }
            } else {
                this.urlValid = false;
            }
        };
        request.onerror = () => {
            this.urlValid = false;
        };
        request.send();
    }

    generateUrl() {
        if (this.urlSet[0] === '') {
            return;
        }
        if (this.urlSet[1] === 'publish') {
            this.urlSet[2] = '';
            this.urlSet[3] = '';
        } else if (this.urlSet[2] === '') {
            this.urlSet[3] = '';
        } else if (this.urlSet[3] === '') {
            this.urlSet[2] = '';
        }

        let url = this.urlSet[0];
        if (url.indexOf('dropbox') !== -1) {
            url = url.replace('www', 'dl').replace('dl=0', 'dl=1');
        }
        url = url.replace(/\//g, '%2F');

        const txtArea = document.getElementById('generatedLink');
        txtArea.innerHTML = `${window.location.origin}/${this.urlSet[1]}` +
                            `?file=${url}${this.urlSet[2]}${this.urlSet[3]}`;
    }

}
