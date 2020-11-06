import {
    Component,
    ContentChildren,
    QueryList,
    AfterContentInit
} from '@angular/core';

import { TabComponent } from './tab.component';

@Component({
    selector: 'tabs',
    templateUrl: `./tabs.component.html`,
    styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterContentInit {
    @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
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
        tab.active = true;
    }
}
