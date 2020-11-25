import {
    Component,
    ContentChildren,
    QueryList,
    AfterContentInit,
    Output,
    EventEmitter,
    AfterViewInit,
    OnDestroy
} from '@angular/core';

import { ATabComponent } from './tab.component';

@Component({
    selector: 'my-tabs',
    templateUrl: `./tabs.component.html`,
    styleUrls: ['./tabs.component.scss']
})
export class ATabsComponent implements AfterContentInit, AfterViewInit, OnDestroy {
    @Output() selectedTab = new EventEmitter<number>();

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
            { tab: 3, title: 'Wires' }
        ];

    object_dropdown;
    object_text = 'Objects';
    objectActive = false;
    object_open = false;

    object: { tab: number, title: string }[] =
        [
            { tab: 4, title: 'Points' },
            { tab: 5, title: 'Polylines' },
            { tab: 6, title: 'Polygons' }
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
        // this.topology_dropdown = document.getElementById('topology_dropdown');
        // this.topology_dropdown.style.display = 'none';

        this.object_dropdown = document.getElementById('object_dropdown');
        this.object_dropdown.style.display = 'none';

    }

    ngOnDestroy() {
        // this.topology_dropdown = null;
        this.object_dropdown = null;
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
        // if (this.topology_dropdown) {
        //     this.topology_dropdown.style.display = 'none';
        // }
        // this.topology_text = 'Topology';
        // this.topology_open = false;

        // if (this.object_dropdown) {
        //     this.topology_dropdown.style.display = 'none';
        // }
        this.object_text = 'Objects';
        this.object_open = false;
    }

    selectTopology(tab: number, event?: Event) {
        this.tabs.toArray().forEach(_tab => _tab.active = false);
        this.tab_active = 1;
        const option = this.topology.find(item => item.tab === tab);
        if (!option) {
            return;
        }
        this.selectedTab.emit(Number(tab));
        this.topology_text = option.title;
        this.tabs.toArray()[option.tab].active = true;
        if (event !== undefined) {
            // @ts-ignore
            event.target.parentElement.style.display = 'none';
        }
        this.topology_open = false;
    }

    selectObject(tab: number, event?: Event) {
        this.tabs.toArray().forEach(_tab => _tab.active = false);
        this.tab_active = 2;
        const option = this.object.find(item => item.tab === tab);
        if (!option) {
            return;
        }
        this.selectedTab.emit(Number(tab));
        this.object_text = option.title;
        this.tabs.toArray()[option.tab].active = true;
        if (event !== undefined) {
            // @ts-ignore
            event.target.parentElement.style.display = 'none';
        }
        this.object_open = false;
    }

    showTDropdown() {
        this.object_text = 'Objects';
        this.object_open = false;
        if (!this.topology_dropdown) { return; }
        this.object_dropdown.style.display = 'none';
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
        if (!this.object_dropdown) { return; }
        // this.topology_dropdown.style.display = 'none';
        if (this.object_dropdown.style.display === 'none') {
            this.object_dropdown.style.display = 'block';
            this.object_open = true;
        } else {
            this.object_dropdown.style.display = 'none';
            this.object_open = false;
        }
    }

}
