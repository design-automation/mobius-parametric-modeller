import {
    Component,
    ContentChildren,
    QueryList,
    AfterContentInit,
    Output,
    EventEmitter,
    AfterViewInit
} from '@angular/core';

import { ATabComponent } from './tab.component';

@Component({
    selector: 'my-tabs',
    templateUrl: `./tabs.component.html`,
    styleUrls: ['./tabs.component.scss']
})
export class ATabsComponent implements AfterContentInit, AfterViewInit {
    @Output() selectedTab = new EventEmitter<number>();
    @Output() selectedTopology = new EventEmitter<number>();

    @ContentChildren(ATabComponent) tabs: QueryList<ATabComponent>;

    tab_active = 0;

    topology_dropdown;
    topology_text = 'Topology';
    topologyActive = false;
    topology_open = false;

    topology: { tab: number, title: string }[] =
        [
            { tab: 1, title: 'Vertices' },
            { tab: 2, title: 'Edges' },
            { tab: 3, title: 'Wires' },
            { tab: 4, title: 'Faces' }
        ];

    object_dropdown;
    object_text = 'Objects';
    objectActive = false;
    object_open = false;

    object: { tab: number, title: string }[] =
        [
            { tab: 5, title: 'Points' },
            { tab: 6, title: 'Polylines' },
            { tab: 7, title: 'Polygons' }
        ];

    // contentChildren are set
    ngAfterContentInit() {
        setTimeout(() => {// get all active tabs
            const activeTabs = this.tabs.filter((tab) => tab.active);
            // if there is no active tab set, activate the first
            if (activeTabs.length === 0) {
                this.selectTab(0);
            }
        }, 0);
    }

    ngAfterViewInit(): void {
        this.topology_dropdown = document.getElementById('topology_dropdown');
        this.topology_dropdown.style.display = 'none';

        this.object_dropdown = document.getElementById('object_dropdown');
        this.object_dropdown.style.display = 'none';
    }

    selectTab(tab: number) {
        // deactivate all tabs
        this.tabs.toArray().forEach(_tab => _tab.active = false);
        // activate the tab the user has clicked on.
        this.tab_active = tab;
        const tt = this.tabs.find(t => Number(t.index) === tab);
        if (tt) {
            tt.active = true;
        }

        this.selectedTab.emit(tab);
        this.topology_dropdown.style.display = 'none';
        this.topology_text = 'Topology';
        this.topology_open = false;

        this.object_dropdown.style.display = 'none';
        this.object_text = 'Objects';
        this.object_open = false;
    }

    selectTopology(option, event: Event) {
        this.tabs.toArray().forEach(_tab => _tab.active = false);
        this.tab_active = 1;
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
    }

    selectObject(option, event: Event) {
        this.tabs.toArray().forEach(_tab => _tab.active = false);
        this.tab_active = 2;
        if (option !== 999) {
            this.selectedTopology.emit(Number(option.tab));
            this.object_text = option.title;
            this.tabs.toArray()[option.tab].active = true;
        } else {
            this.selectedTopology.emit(999);
            this.object_text = 'Objects';
        }
        // @ts-ignore
        event.target.parentElement.style.display = 'none';
        this.object_open = false;
    }

    showTDropdown() {
        this.object_text = 'Objects';
        this.object_open = false;
        this.object_dropdown.style.display = 'none';
        // this.tabs.toArray().forEach(_tab => _tab.active = false);
        if (this.topology_dropdown.style.display === 'none') {
            this.topology_dropdown.style.display = 'block';
            this.topology_open = true;
        } else {
            this.topology_dropdown.style.display = 'none';
            this.topology_open = false;
        }
    }

    showODropdown() {
        this.topology_text = 'Topology';
        this.topology_open = false;
        this.topology_dropdown.style.display = 'none';
        // this.tabs.toArray().forEach(_tab => _tab.active = false);
        if (this.object_dropdown.style.display === 'none') {
            this.object_dropdown.style.display = 'block';
            this.object_open = true;
        } else {
            this.object_dropdown.style.display = 'none';
            this.object_open = false;
        }
    }
}
