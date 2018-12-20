import { Component, Injector,
  Input, OnChanges, SimpleChanges, ViewChildren, QueryList } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { GIModel } from '@libs/geo-info/GIModel';
import { DataService } from '../data/data.service';
import { GICommon, GIAttribs } from '@libs/geo-info';

@Component({
  selector: 'attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.scss']
})

export class AttributeComponent implements OnChanges {
  @Input() data: GIModel;
  private _data;

  tabs: string[] = ['Positions', 'Vetex', 'Edges', 'Wires', 'Faces', 'Collections'];
  displayedColumns: string[] = [];

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  dataSource;

  protected dataService: DataService;

  constructor(injector: Injector) {
    this.dataService = injector.get(DataService);
  }

  ngOnChanges(changes: SimpleChanges) {
    if ( changes['data'] && this.data) {
      this._data = this.data;
      setTimeout(() => {
        this.generateTable(0);
      });
    }
  }

  generateTable(tabIndex) {
    const EntityType = GICommon.EEntityTypeStr;
    const tab_map = {
      0: EntityType.POSI,
      1: EntityType.VERT,
      2: EntityType.EDGE,
      3: EntityType.WIRE,
      4: EntityType.FACE,
      5: EntityType.COLL
    };
    const attribData = this._data.getAttibs().getAttribsForTable(tab_map[tabIndex]);
    if (attribData.length > 0) {
      this.displayedColumns = Object.keys(attribData[0]);
      this.dataSource = new MatTableDataSource<object>(attribData);
    } else {
      this.displayedColumns = [];
      this.dataSource = new MatTableDataSource<object>();
    }
    this.dataSource.paginator = this.paginator.toArray()[tabIndex];
    this.dataSource.sort = this.sort.toArray()[tabIndex];
  }

  _setDataSource(tabIndex) {
    setTimeout(() => {
      this.generateTable(tabIndex);
    });
  }
}
