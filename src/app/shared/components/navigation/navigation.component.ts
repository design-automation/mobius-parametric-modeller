import { Component } from '@angular/core';

@Component({
  selector: 'navigation',
  template: `<ul class='nav'>
                <li class='link' [routerLink]="['/about']">About</li>
                <li class='link' [routerLink]="['/gallery']">Gallery</li>
                <li class='link' [routerLink]="['/viewer']">Viewer</li>
                <li class='link' [routerLink]="['/editor']">Editor</li>
              </ul>`,
  styles: [`
      ul.nav{
        margin: 0px;
        padding: 0px;
      }

      li.link{
        display: inline;
        border: 2px solid gray;
        border-radius: 4px;
        margin: 15px 15px 15px 0px;
        padding: 5px;
        text-transform: uppercase;
        font-weight: 600;
        cursor: pointer;
        font-size: 16px;
      }

      li.link:hover{
        background-color: gray;
        color: white;
      }
  `],
})
export class NavigationComponent{
    constructor(){  }
}
