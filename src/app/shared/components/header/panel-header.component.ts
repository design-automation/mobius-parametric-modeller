import { Component, Input, HostListener } from '@angular/core';
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
        document.getElementById('dropdownMenu').style.display = 'none';
        const nodeMenu = document.getElementById('nodeMenu');
        if (nodeMenu) {
            document.getElementById('nodeMenu').style.display = 'none';
        }
    }
}
