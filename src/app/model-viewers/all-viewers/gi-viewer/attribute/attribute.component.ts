import { Component, Injector, Input, OnChanges, SimpleChanges, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, Sort } from '@angular/material';
import { GIModel } from '@libs/geo-info/GIModel';
import { DataService } from '../data/data.service';
import { GICommon } from '@libs/geo-info';
import { EEntType, EEntTypeStr } from '@libs/geo-info/common';

@Component({
  selector: 'attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.scss']
})

export class AttributeComponent implements OnChanges {
  @Input() data: GIModel;
  @Input() refresh: Event;
  @Output() attrTableSelect = new EventEmitter<Object>();
  showSelected = false;

  tabs: { type: number, title: string }[] =
    [
      { type: EEntType.POSI, title: 'Positions' },
      { type: EEntType.VERT, title: 'Vertex' },
      { type: EEntType.EDGE, title: 'Edges' },
      { type: EEntType.WIRE, title: 'Wires' },
      { type: EEntType.FACE, title: 'Faces' },
      { type: EEntType.POINT, title: 'Points' },
      { type: EEntType.PLINE, title: 'Polylines' },
      { type: EEntType.PGON, title: 'Polygons' },
      { type: EEntType.COLL, title: 'Collections' }
    ];
  displayedColumns: string[] = [];
  displayData: { id: string }[] = [];
  selected_ents;

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  dataSource: MatTableDataSource<object>;

  protected dataService: DataService;

  constructor(injector: Injector) {
    this.dataService = injector.get(DataService);
    if (localStorage.getItem('mpm_attrib_current_tab') === null) {
      localStorage.setItem('mpm_attrib_current_tab', '0');
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data) {
      this.refreshTable();
    }
    if (changes['refresh']) {
      this.refreshTable();
    }
  }

  async generateTable(tabIndex: number) {
    const EntityType = GICommon.EEntType;
    const tab_map = {
      0: EntityType.POSI,
      1: EntityType.VERT,
      2: EntityType.EDGE,
      3: EntityType.WIRE,
      4: EntityType.FACE,
      5: EntityType.POINT,
      6: EntityType.PLINE,
      7: EntityType.PGON,
      8: EntityType.COLL
    };
    if (this.data) {
      const ThreeJS = this.data.attribs.threejs;
      this.selected_ents = this.dataService.selected_ents.get(EEntTypeStr[tab_map[tabIndex]]);

      if (this.showSelected) {
        const SelectedAttribData = ThreeJS.getEntsVals(this.selected_ents, tab_map[tabIndex]);
        this.displayData = SelectedAttribData;
      } else {
        const AllAttribData = ThreeJS.getAttribsForTable(tab_map[tabIndex]);
        AllAttribData.map(row => {
          if (this.selected_ents.has(row.id)) {
            return row.selected = true;
          }
        });
        this.displayData = AllAttribData;
      }
      if (this.displayData.length > 0) {
        const columns = Object.keys(this.displayData[0]).filter(e => e !== 'selected');
        // columns.shift();
        // let columns_control = [];
        // if (localStorage.getItem('mpm_attrib_columns') === null) {
        //   columns.forEach(col => {
        //     columns_control.push({ name: col, show: true });
        //   });
        //   localStorage.setItem('mpm_attrib_columns', JSON.stringify(columns_control));
        // } else {
        //   columns_control = JSON.parse(localStorage.getItem('mpm_attrib_columns'));
        // }

        // const new_columns = columns_control.filter(col => col.show === true).map(col => col.name);
        this.displayedColumns = columns;
        this.dataSource = new MatTableDataSource<object>(this.displayData);
      } else {
        this.displayedColumns = [];
        this.dataSource = new MatTableDataSource<object>();
      }
      this.dataSource.paginator = await this.paginator.toArray()[tabIndex];
      this.dataSource.sort = await this.sort.toArray()[tabIndex];
    }
    return tabIndex;
  }

  _setDataSource(tabIndex: number) {
    setTimeout(() => {
      localStorage.setItem('mpm_attrib_current_tab', tabIndex.toString());
      if (tabIndex === 999) {
        this.displayedColumns = [];
        this.dataSource = new MatTableDataSource<object>();
      } else {
        this.generateTable(tabIndex);
      }
    });
  }

  private getCurrentTab() {
    if (localStorage.getItem('mpm_attrib_current_tab') !== null) {
      return Number(localStorage.getItem('mpm_attrib_current_tab'));
    } else {
      return 0;
    }
  }

  showSelectedSwitch() {
    this.showSelected = !this.showSelected;
    this.refreshTable();
  }

  public refreshTable() {
    const currentTab = this.getCurrentTab();
    setTimeout(() => {
      this.generateTable(currentTab);
    }, 0);
  }

  selectRow(ent_id: string, event: Event) {
    const ent_type = ent_id.substr(0, 2);
    const id = Number(ent_id.substr(2));
    const target = event.target || event.srcElement || event.currentTarget;

    if (this.selected_ents.has(ent_id)) {
      // @ts-ignore
      target.parentNode.classList.remove('selected');
      this.attrTableSelect.emit({ action: 'unselect', ent_type: ent_type, id: id });
    } else {
      this.attrTableSelect.emit({ action: 'select', ent_type: ent_type, id: id });
      this.selected_ents.set(ent_id, id);
      // @ts-ignore
      target.parentNode.classList.add('selected');
    }

  }

}
