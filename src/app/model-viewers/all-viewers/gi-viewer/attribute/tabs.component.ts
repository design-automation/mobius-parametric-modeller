import {
    Component,
    ContentChildren,
    QueryList,
    AfterContentInit,
    Output,
    EventEmitter,
    AfterViewInit
} from '@angular/core';

import { TabComponent } from './tab.component';

@Component({
    selector: 'my-tabs',
    templateUrl: `./tabs.component.html`,
    styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterContentInit, AfterViewInit {
    @Output() selectedTab = new EventEmitter<number>();
    @Output() selectedTopology = new EventEmitter<number>();
    @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
    topology_dropdown;
    topology_text = 'Topology';
    topologyActive = false;
    topology_open = false;

    topology: { tab: number, title: string }[] =
        [
            { tab: 1, title: 'Vertex' },
            { tab: 2, title: 'Edges' },
            { tab: 3, title: 'Wires' },
            { tab: 4, title: 'Faces' }
        ];
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

    ngAfterViewInit(): void {
        this.topology_dropdown = document.getElementById('topology_dropdown');
        this.topology_dropdown.style.display = 'none';
    }

    selectTab(tab: TabComponent) {
        // deactivate all tabs
        this.tabs.toArray().forEach(_tab => _tab.active = false);
        // activate the tab the user has clicked on.
        tab.active = true;
        this.selectedTab.emit(tab.index);
        this.topology_dropdown.style.display = 'none';
        this.topologyActive = false;
        this.topology_text = 'Topology';
        this.topology_open = false;
    }

    selectTopology(option, event: Event) {
        this.tabs.toArray().forEach(_tab => _tab.active = false);
        if (option !== 999) {
            this.selectedTopology.emit(Number(option.tab));
            this.topology_text = option.title;
            this.tabs.toArray()[option.tab].active = true;
        } else {
            this.selectedTopology.emit(999);
            this.topology_text = 'Topology';
        }
        // @ts-ignore
        event.target.parentElement.style.display = 'none';
        this.topology_open = false;
        this.topologyActive = true;
    }

    showDropdown() {
        // this.tabs.toArray().forEach(_tab => _tab.active = false);
        if (this.topology_dropdown.style.display === 'none') {
            this.topology_dropdown.style.display = 'block';
            this.topology_open = true;
        } else {
            this.topology_dropdown.style.display = 'none';
            this.topology_open = false;
        }
    }
}
