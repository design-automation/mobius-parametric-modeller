import {
    Component, Injector, Input, OnChanges, SimpleChanges,
    ViewChildren, QueryList, Output, EventEmitter, ViewChild, DoCheck
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GIModel } from '@libs/geo-info/GIModel';
import { DataService } from '../data/data.service';
import { EEntType, EEntTypeStr } from '@libs/geo-info/common';
import { GIAttribsThreejs } from '@libs/geo-info/GIAttribsThreejs';
import { ATabsComponent } from './tabs.component';

enum SORT_STATE {
    DEFAULT,
    ASCENDING,
    DESCENDING
}

@Component({
    selector: 'attribute',
    templateUrl: './attribute.component.html',
    styleUrls: ['./attribute.component.scss'],
})

export class AttributeComponent implements OnChanges {
    @ViewChild(ATabsComponent, { static: true }) child: ATabsComponent;

    @Input() model: GIModel;
    @Input() refresh: Event;
    @Input() reset: Event;
    @Output() attrTableSelect = new EventEmitter<Object>();
    @Output() selectSwitch = new EventEmitter<Boolean>();
    @Output() attribLabel = new EventEmitter<string>();
    showSelected = false;
    currentShowingCol = '';
    shiftKeyPressed = false;

    tabs: { type: number, title: string }[] = [
        { type: EEntType.POSI, title: 'Positions' },
        { type: EEntType.VERT, title: 'Vertices' },
        { type: EEntType.EDGE, title: 'Edges' },
        { type: EEntType.WIRE, title: 'Wires' },
        { type: EEntType.FACE, title: 'Faces' },
        { type: EEntType.POINT, title: 'Points' },
        { type: EEntType.PLINE, title: 'Polylines' },
        { type: EEntType.PGON, title: 'Polygons' },
        { type: EEntType.COLL, title: 'Collections' },
        { type: EEntType.MOD, title: 'Model' }
    ];
    displayedColumns: string[] = [];
    displayData: {}[] = [];
    selected_ents = new Map();
    multi_selection = new Map();
    last_selected;
    current_selected;

    table_scroll = null;

    sorting_header = null;
    sorting_state: SORT_STATE = SORT_STATE.DEFAULT;

    @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
    @ViewChildren(MatSort) sort = new QueryList<MatSort>();

    dataSource: MatTableDataSource<object>;

    protected dataService: DataService;

    tab_map = {
        0: EEntType.POSI,
        1: EEntType.VERT,
        2: EEntType.EDGE,
        3: EEntType.WIRE,
        4: EEntType.FACE,
        5: EEntType.POINT,
        6: EEntType.PLINE,
        7: EEntType.PGON,
        8: EEntType.COLL,
        9: EEntType.MOD
    };

    tab_rev_map = {
        0: 0,
        2: 1,
        3: 2,
        4: 3,
        5: 4,
        6: 5, // point
        7: 6, // plines
        8: 7, // pgons
        9: 8,
        10: 9
    };

    columnItalic = 'c2';

    constructor(injector: Injector) {
        this.dataService = injector.get(DataService);
        if (localStorage.getItem('mpm_attrib_current_tab') === null) {
            localStorage.setItem('mpm_attrib_current_tab', '0');
        }
    }

    // ngDoCheck() {
    //     const attrib = document.getElementById('attribTable');
    //     if (attrib) {
    //         const paginators = document.getElementsByClassName('mat-paginator');
    //         const l = paginators.length;
    //         if (attrib.clientWidth < 600) {
    //             let index = 0;
    //             for (; index < l; index++) {
    //                 const p = paginators[index];
    //                 p.className = 'mat-paginator '; // hide
    //             }
    //         } else {
    //             let index = 0;
    //             for (; index < l; index++) {
    //                 const p = paginators[index];
    //                 p.className = 'mat-paginator';
    //             }
    //         }
    //     }
    // }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['model'] && this.model) {
            this.refreshTable();
        }
        if (changes['reset']) {
            this.resetTable();
        }
        if (changes['refresh']) {
            if (document.getElementsByClassName('table--container')[this.getCurrentTab()]) {
                this.table_scroll = document.getElementsByClassName('table--container')[this.getCurrentTab()].scrollTop;
            }
            this.refreshTable();
        }
    }

    generateTable(tabIndex: number) {
        if (this.model) {
            const ThreeJSData = this.model.modeldata.attribs.threejs;
            if (Number(tabIndex) === 9) {
                this.displayData = ThreeJSData.getModelAttribsForTable();
            } else {
                const ready = this.model.modeldata.attribs.threejs instanceof GIAttribsThreejs;
                this.selected_ents = this.dataService.selected_ents.get(EEntTypeStr[this.tab_map[tabIndex]]);

                if (!ready) { return; }
                if (this.showSelected) {
                    const SelectedAttribData = ThreeJSData.getEntsVals(this.selected_ents, this.tab_map[tabIndex]);
                    SelectedAttribData.map(row => {
                        if (this.selected_ents.has(row._id)) {
                            return row.selected = true;
                        }
                    });
                    this.displayData = SelectedAttribData;
                } else {
                    const AllAttribData = ThreeJSData.getAttribsForTable(this.tab_map[tabIndex]).data;
                    AllAttribData.map(row => {
                        if (this.selected_ents.has(row._id)) {
                            return row.selected = true;
                        }
                    });
                    this.displayData = AllAttribData;
                }
            }
            if (this.displayData.length > 0) {
                const columns = Object.keys(this.displayData[0]).filter(e => e !== 'selected');
                let new_columns;
                if (Number(tabIndex) === 9) {
                    new_columns = columns;
                } else {
                    const first = columns.shift();
                    // const second = columns.shift();
                    const selected = columns.find(column => column.substr(0, 1) === '_');
                    const rest_of_columns = columns.filter(column => column.substr(0, 1) !== '_');
                    // new_columns = selected ? [first, second, selected, ...rest_of_columns, ' ']
                    // : [first, second, ...rest_of_columns, ' '];
                    new_columns = selected ? [first, selected, ...rest_of_columns, ' '] : [first, ...rest_of_columns, ' '];
                }
                this.displayedColumns = new_columns;
                this.dataSource = new MatTableDataSource<object>(this.displayData);
            } else {
                this.displayedColumns = [];
                this.dataSource = new MatTableDataSource<object>();
            }
            this.dataSource.sortingDataAccessor = this._sortingDataAccessor;
            this.dataSource.paginator = this.paginator.toArray()[tabIndex];
            this.dataSource.sort = this.sort.toArray()[tabIndex];
            if (this.table_scroll) {
                setTimeout(() => {
                    document.getElementsByClassName('table--container')[this.getCurrentTab()].scrollTop = this.table_scroll;
                    this.table_scroll = null;
                }, 0);
            }
        }
        return tabIndex;
    }

    _sortingDataAccessor(data: object, headerID: string): string|number {
        if (headerID === '_id') {
            return Number(data[headerID].slice(2));
        } else if (headerID === '_parent') {
            if (data[headerID] === '') { return -1; }
            return Number(data[headerID].slice(2));
        }
        return data[headerID];
    }

    _setDataSource(tabIndex: number) {
        setTimeout(() => {
            localStorage.setItem('mpm_attrib_current_tab', tabIndex.toString());
            const settings = JSON.parse(localStorage.getItem('mpm_settings'));
            if (settings !== undefined) {
                if (settings.select !== undefined) {
                    settings.select.tab = tabIndex.toString();
                } else {
                    settings.select = {selector: {id: '_f', name: 'Faces'}, tab: '0'};
                }
                localStorage.setItem('mpm_settings', JSON.stringify(settings));
            }
            if (tabIndex === 999) {
                this.displayedColumns = [];
                this.dataSource = new MatTableDataSource<object>();
                this.dataSource.sortingDataAccessor = this._sortingDataAccessor;
            } else {
                this.generateTable(tabIndex);
            }
            this.last_selected = undefined;
        });
        sessionStorage.setItem('mpm_showSelected', JSON.stringify(this.showSelected));
    }

    getCurrentTab() {
        if (localStorage.getItem('mpm_attrib_current_tab') !== null) {
            return Number(localStorage.getItem('mpm_attrib_current_tab'));
        } else {
            return 0;
        }
    }

    showSelectedSwitch() {
        this.showSelected = !this.showSelected;
        sessionStorage.setItem('mpm_showSelected', JSON.stringify(this.showSelected));
        sessionStorage.setItem('mpm_changetab', 'false');
        this.selectSwitch.emit(this.showSelected);
        this.refreshTable();
    }

    public refreshTable() {
        const currentTab = this.getCurrentTab();
        setTimeout(() => {
            if (sessionStorage.getItem('mpm_showSelected')) {
                this.showSelected = JSON.parse(sessionStorage.getItem('mpm_showSelected'));
            }
            let changeTab;
            if (sessionStorage.getItem('mpm_changetab')) {
                changeTab = JSON.parse(sessionStorage.getItem('mpm_changetab'));
            }
            // sessionStorage.setItem('mpm_changetab', 'true');
            if (changeTab) {
                if (this.model) {
                    if (currentTab === 0 || currentTab === 8 || currentTab === 9) {
                        this.child.selectTab(this.tab_rev_map[currentTab]);
                    } else if (currentTab === 1 || currentTab === 2 || currentTab === 3 || currentTab === 4) {
                        this.child.selectTopology(currentTab, event);
                    } else if (currentTab === 5 || currentTab === 6 || currentTab === 7) {
                        this.child.selectObject(currentTab, event);
                    }
                }
            }
            this.generateTable(currentTab);
        }, 0);
    }

    resetTable() {
        const rows = document.querySelectorAll('.selected-row');
        rows.forEach(row => row.classList.remove('selected-row'));
        this.selected_ents.clear();
        this.multi_selection.clear();
    }

//   selectRow(ent_id: string, event) {
//     const currentTab = this.getCurrentTab();
//     if (currentTab === 9) {
//       return;
//     }
//     const id = Number(ent_id.substr(2));
//     // Multiple row selection
//     const ThreeJSData = this.data.attribs.threejs;
//     const attrib_table_ents = ThreeJSData.getAttribsForTable(this.tab_map[currentTab]).ents;
//     this.current_selected = id;
//     const s = this.multi_selection;

//     if (event.ctrlKey) {
//       this.last_selected = this.current_selected;
//       s.set(this.current_selected, this.current_selected);
//     } else {
//       if (!event.shiftKey) {
//         s.clear();
//         s.set(this.current_selected, this.current_selected);
//         this.last_selected = this.current_selected;
//       } else {
//         if (this.last_selected === undefined) {
//           this.last_selected = ThreeJSData.getAttribsForTable(this.tab_map[currentTab]).ents[0];
//         }
//         s.clear();
//         if (this.current_selected < this.last_selected) { // select upper row
//           attrib_table_ents.filter(ents => ents > this.current_selected && ents < this.last_selected).forEach(item => {
//             s.set(item, item);
//           });
//           s.set(this.current_selected, this.current_selected);
//           s.set(this.last_selected, this.last_selected);
//         } else if (this.current_selected > this.last_selected) { // select lower row
//           attrib_table_ents.filter(ents => ents < this.current_selected && ents > this.last_selected).forEach(item => {
//             s.set(item, item);
//           });
//           s.set(this.current_selected, this.current_selected);
//           s.set(this.last_selected, this.last_selected);
//         }
//       }
//     }

//     const ent_type = ent_id.substr(0, 2);
//     const target = event.target;
//     if (s.size === 1) {
//       if (this.selected_ents.has(ent_id)) {
//         this.attrTableSelect.emit({ action: 'unselect', ent_type: ent_type, id: id });
//         this.selected_ents.delete(ent_id);
//         target.parentNode.classList.remove('selected-row');
//       } else {
//         this.attrTableSelect.emit({ action: 'select', ent_type: ent_type, id: id });
//         this.selected_ents.set(ent_id, id);
//         target.parentNode.classList.add('selected-row');
//       }
//     } else {
//       this.attrTableSelect.emit({ action: 'select', ent_type: ent_type, id: s });
//       s.forEach(_id => {
//         this.selected_ents.set(ent_id, id);
//       });
//     }
//   }

    selectRow(ent_id: string, event) {
        const currentTab = this.getCurrentTab();
        if (currentTab === 9) {
            return;
        }
        const id = Number(ent_id.substr(2));
        // Multiple row selection
        const ThreeJSData = this.model.modeldata.attribs.threejs;
        const attrib_table = ThreeJSData.getAttribsForTable(this.tab_map[currentTab]);
        this.current_selected = id;
        const s = this.multi_selection;

        // ctrl + click -> multiple selection: if already selected then deselect, if not selected then select
        if (event.ctrlKey || event.metaKey) {
            if (s.has(this.current_selected)) {
                s.delete(this.current_selected);
            } else {
                this.last_selected = this.current_selected;
                s.set(this.current_selected, this.current_selected);
            }
        // shift + click -> multiple selection, select all in between
        } else if (event.shiftKey) {
            // clear all selected
            s.clear();
            // if there is no last selected row -> select only the currently selected, set it as last selected for the next selection
            if (this.last_selected === undefined) {
                this.last_selected = this.current_selected;
                s.set(this.current_selected, this.current_selected);
            // if there is a last selected row -> select all in between current and last
            } else {
                // if sort state is based on "_id" -> filter based on table entities' index
                if (this.sorting_header === null || this.sorting_header === '_id' || this.sorting_state === SORT_STATE.DEFAULT) {
                    if (this.current_selected < this.last_selected) { // select upper row
                    attrib_table.ents.filter(ents => ents > this.current_selected && ents < this.last_selected).forEach(item => {
                        s.set(item, item);
                    });
                    s.set(this.current_selected, this.current_selected);
                    s.set(this.last_selected, this.last_selected);
                    } else if (this.current_selected > this.last_selected) { // select lower row
                    attrib_table.ents.filter(ents => ents < this.current_selected && ents > this.last_selected).forEach(item => {
                        s.set(item, item);
                    });
                    s.set(this.current_selected, this.current_selected);
                    s.set(this.last_selected, this.last_selected);
                    }
                // if sort state is not based on "_id"
                // -> filter based on the sorting values, if the sorting values are the same as current or last,
                // base it on the entities' index according whether the sorting is ascending or descending
                } else {
                    const lastIndex = attrib_table.ents.indexOf(this.last_selected);
                    const lastVal = attrib_table.data[lastIndex][this.sorting_header];
                    const currentIndex = attrib_table.ents.indexOf(this.current_selected);
                    const currentVal = attrib_table.data[currentIndex][this.sorting_header];

                    // if same values between last and current, filtered values must be the same
                    // while their index must be between last and current indices
                    if (lastVal === currentVal) {
                        if (this.current_selected < this.last_selected) { // select upper row
                            for (let i = 0; i < attrib_table.data.length; i++) {
                                const compare_val = attrib_table.data[i][this.sorting_header];
                                if (compare_val === currentVal && i >= currentIndex && i <= lastIndex) {
                                    s.set(attrib_table.ents[i], attrib_table.ents[i]);
                                }
                            }
                        } else if (this.current_selected > this.last_selected) { // select lower row
                            for (let i = 0; i < attrib_table.data.length; i++) {
                                const compare_val = attrib_table.data[i][this.sorting_header];
                                if (compare_val === currentVal && i >= lastIndex && i <= currentIndex) {
                                    s.set(attrib_table.ents[i], attrib_table.ents[i]);
                                }
                            }
                        }

                    // filter down the row (last_selected is before current_selected in ordering) if:
                    //  _ descending and lastVal > currentVal
                    //  _ ascending and lastVal < currentVal
                    // ==> include rows with value = lastVal with index > lastIndex
                    // and rows with value = currentVal with index < currentIndex
                    } else if ((this.sorting_state === SORT_STATE.DESCENDING && lastVal > currentVal) ||
                    (this.sorting_state === SORT_STATE.ASCENDING && lastVal < currentVal)) {
                        const lowerVal = Math.min(currentVal, lastVal);
                        const upperVal = Math.max(currentVal, lastVal);
                        for (let i = 0; i < attrib_table.data.length; i++) {
                            const compare_val = attrib_table.data[i][this.sorting_header];
                            if ((compare_val > lowerVal && compare_val < upperVal)
                            || (compare_val === lastVal && i >= lastIndex)
                            || (compare_val === currentVal && i <= currentIndex)) {
                                s.set(attrib_table.ents[i], attrib_table.ents[i]);
                            }
                        }
                    // filter up the row (last_selected is after current_selected in ordering) if:
                    //  _ descending and lastVal < currentVal
                    //  _ ascending and lastVal > currentVal
                    // ==> include rows with value = lastVal with index < lastIndex
                    // and rows with value = currentVal with index > currentIndex
                    } else {
                        const lowerVal = Math.min(currentVal, lastVal);
                        const upperVal = Math.max(currentVal, lastVal);
                        for (let i = 0; i < attrib_table.data.length; i++) {
                            const compare_val = attrib_table.data[i][this.sorting_header];
                            if ((compare_val > lowerVal && compare_val < upperVal)
                            || (compare_val === lastVal && i <= lastIndex)
                            || (compare_val === currentVal && i >= currentIndex)) {
                                s.set(attrib_table.ents[i], attrib_table.ents[i]);
                            }
                        }
                    }
                }
            }
        } else {
            this.last_selected = this.current_selected;
            s.clear();
            s.set(this.current_selected, this.current_selected);
        }

        const ent_type = ent_id.substr(0, 2);
        const target = event.target;
        this.selected_ents.clear();
        if (s.size === 1) {
            this.attrTableSelect.emit({ action: 'select', ent_type: ent_type, id: id });
            this.selected_ents.set(ent_id, id);
            target.parentNode.classList.add('selected-row');
        } else {
            this.attrTableSelect.emit({ action: 'select', ent_type: ent_type, id: s });
            s.forEach(_id => {
                this.selected_ents.set(ent_id, id);
            });
        }
    }

    add_remove_selected(ent_id, event) {
        const ent_type = ent_id.substr(0, 2);
        const id = Number(ent_id.substr(2));
        const target = event.target || event.srcElement || event.currentTarget;
        if (this.selected_ents.has(ent_id)) {
            this.attrTableSelect.emit({ action: 'unselect', ent_type: ent_type, id: id });
            this.selected_ents.delete(ent_id);
            // @ts-ignore
            target.parentNode.classList.remove('selected-row');
        } else {
            if (event.shiftKey) {
                this.shiftKeyPressed = true;
                // console.log(ent_id);
            }
            this.attrTableSelect.emit({ action: 'select', ent_type: ent_type, id: id });
            this.selected_ents.set(ent_id, id);
            // @ts-ignore
            target.parentNode.classList.add('selected-row');
        }
    }

    showAttribLabel($event, column) {
        $event.stopPropagation();
        if (column === this.currentShowingCol) {
            this.currentShowingCol = '';
            this.attribLabel.emit('');
        } else {
            this.currentShowingCol = column;
            this.attribLabel.emit(column);
        }
    }

    updateSortHeader($event, column) {
        if (this.sorting_header === column) {
            this.sorting_state = (this.sorting_state + 1) % 3;
        } else {
            this.sorting_state = SORT_STATE.ASCENDING;
            this.sorting_header = column;
        }
    }
}


