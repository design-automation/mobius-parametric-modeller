import {
  Component, Injector, Input, OnChanges, SimpleChanges,
  ViewChildren, QueryList, Output, EventEmitter, ViewChild, DoCheck
} from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { GIModel } from '@libs/geo-info/GIModel';
import { DataService } from '../data/data.service';
import { EEntType, EEntTypeStr } from '@libs/geo-info/common';
import { GIAttribsThreejs } from '@assets/libs/geo-info/GIAttribsThreejs';
import { ATabsComponent } from './tabs.component';

@Component({
  selector: 'attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.scss'],
})

export class AttributeComponent implements OnChanges, DoCheck {
  @ViewChild(ATabsComponent) child: ATabsComponent;

  @Input() data: GIModel;
  @Input() refresh: Event;
  @Input() reset: Event;
  @Output() attrTableSelect = new EventEmitter<Object>();
  @Output() selectSwitch = new EventEmitter<Boolean>();
  @Output() attribLabel = new EventEmitter<string>();
  showSelected = false;
  currentShowingCol = '';

  tabs: { type: number, title: string }[] =
    [
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

  ngDoCheck() {
    const attrib = document.getElementById('attrib');
    if (attrib) {
      const paginators = document.getElementsByClassName('mat-paginator');
      const l = paginators.length;
      if (attrib.clientWidth < 600) {
        let index = 0;
        for (; index < l; index++) {
          const p = paginators[index];
          p.className = 'mat-paginator hide';
        }
      } else {
        let index = 0;
        for (; index < l; index++) {
          const p = paginators[index];
          p.className = 'mat-paginator';
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data) {
      this.refreshTable();
    }
    if (changes['reset']) {
      this.resetTable();
    }
    if (changes['refresh']) {
      this.refreshTable();
    }
  }

  generateTable(tabIndex: number) {
    if (this.data) {
      const ThreeJSData = this.data.attribs.threejs;
      if (Number(tabIndex) === 9) {
        this.displayData = ThreeJSData.getModelAttribsForTable();
      } else {
        const ready = this.data.attribs.threejs instanceof GIAttribsThreejs;
        this.selected_ents = this.dataService.selected_ents.get(EEntTypeStr[this.tab_map[tabIndex]]);

        if (!ready) { return; }
        if (this.showSelected) {
          const SelectedAttribData = ThreeJSData.getEntsVals(this.selected_ents, this.tab_map[tabIndex]);
          this.displayData = SelectedAttribData;
        } else {
          const AllAttribData = ThreeJSData.getAttribsForTable(this.tab_map[tabIndex]);
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
          const second = columns.shift();
          const selected = columns.find(column => column.substr(0, 1) === '_');
          const rest_of_columns = columns.filter(column => column.substr(0, 1) !== '_');
          new_columns = selected ? [first, second, selected, ...rest_of_columns, ' '] : [first, second, ...rest_of_columns, ' '];
        }
        this.displayedColumns = new_columns;
        this.dataSource = new MatTableDataSource<object>(this.displayData);
      } else {
        this.displayedColumns = [];
        this.dataSource = new MatTableDataSource<object>();
      }
      this.dataSource.paginator = this.paginator.toArray()[tabIndex];
      this.dataSource.sort = this.sort.toArray()[tabIndex];

    }
    return tabIndex;
  }

  _setDataSource(tabIndex: number) {
    setTimeout(() => {
      localStorage.setItem('mpm_attrib_current_tab', tabIndex.toString());
      const settings = JSON.parse(localStorage.getItem('mpm_settings'));
      if (settings !== undefined) {
          settings.select.tab = tabIndex.toString();
          localStorage.setItem('mpm_settings', JSON.stringify(settings));
      }
      if (tabIndex === 999) {
        this.displayedColumns = [];
        this.dataSource = new MatTableDataSource<object>();
      } else {
        this.generateTable(tabIndex);
      }
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
    sessionStorage.setItem('mpm_changetab', JSON.stringify(false));
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
      // sessionStorage.setItem('mpm_changetab', JSON.stringify(true));
      if (changeTab) {
        if (this.data) {
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
  }

  selectRow(ent_id: string, event: Event) {
    const currentTab = this.getCurrentTab();
    if (currentTab === 9) {
      return;
    }
    const ent_type = ent_id.substr(0, 2);
    const id = Number(ent_id.substr(2));
    const target = event.target || event.srcElement || event.currentTarget;
    if (this.selected_ents.has(ent_id)) {
      this.attrTableSelect.emit({ action: 'unselect', ent_type: ent_type, id: id });
      this.selected_ents.delete(ent_id);
      // @ts-ignore
      target.parentNode.classList.remove('selected-row');
    } else {
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
}
