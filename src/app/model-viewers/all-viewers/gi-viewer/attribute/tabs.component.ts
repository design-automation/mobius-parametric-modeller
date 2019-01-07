import {
    Component,
    ContentChildren,
    QueryList,
    AfterContentInit,
    Output,
    EventEmitter
} from '@angular/core';

import { TabComponent } from './tab.component';

@Component({
    selector: 'my-tabs',
    template: `
      <ul class="nav nav-tabs">
        <li *ngFor="let tab of tabs" (click)="selectTab(tab)" [class.active]="tab.active">
          <span>{{tab.title}}</span>
        </li>
      </ul>
      <ng-content></ng-content>
    `,
    styleUrls: ['./attribute.component.scss']
})
export class TabsComponent implements AfterContentInit {
    @Output() selectedIndexChange = new EventEmitter<number>();
    @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

    // contentChildren are set
    ngAfterContentInit() {
        setTimeout(() => {// get all active tabs
            const activeTabs = this.tabs.filter((tab) => tab.active);

            // if there is no active tab set, activate the first
            if (activeTabs.length === 0) {
                this.selectTab(this.tabs.first);
            }
        }, 0);
    }

    selectTab(tab: TabComponent) {
        // deactivate all tabs
        this.tabs.toArray().forEach(_tab => _tab.active = false);

        // activate the tab the user has clicked on.
        tab.active = true;
        this.selectedIndexChange.emit(tab.index);
    }
}
