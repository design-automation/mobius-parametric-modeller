import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'navigation',
  template: `<ul class='nav'>
                <li class='link' *ngFor='let link of _links;'
                      [class.active]='link.path == _router.url'
                      [routerLink]="link.path"
                      >{{link.name}}</li>
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

      .active{
        background-color: #222;
        color: white;
        border-color: #222 !important;
      }
  `],
})
export class NavigationComponent {

    _links = [
      { path: '/about',
        name: 'about'
      },
      { path: '/gallery',
        name: 'gallery'
      },
      { path: '/dashboard',
        name: 'dashboard'
      },
      { path: '/editor',
        name: 'editor'
      },

    ];

    constructor(private _router: Router) { }

}
