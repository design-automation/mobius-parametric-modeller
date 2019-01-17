import { Component, Input, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'panel-header',
  templateUrl:  'panel-header.component.html',
  styleUrls: ['panel-header.component.scss']
})
export class PanelHeaderComponent {

    @Input() title: string;
    executeCheck: boolean;

    constructor(private router: Router) {
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
            // console.log(bRect)
            // stl.transform = `translate(` + bRect.left + `px, ` + bRect.height + `px)`;
        } else {
            stl.display = 'none';
        }
        e.stopPropagation();

    }

    @HostListener('window:click', [])
    onWindowClick() {
        const dropdownMenu = document.getElementById('dropdownMenu');
        if (dropdownMenu){
            document.getElementById('dropdownMenu').style.display = 'none';
        }
        const nodeMenu = document.getElementById('nodeMenu');
        if (nodeMenu) {
            document.getElementById('nodeMenu').style.display = 'none';
        }
        const galleryMenu = document.getElementById('galleryMenu');
        if (galleryMenu) {
            document.getElementById('galleryMenu').style.display = 'none';
        }
    }
}
