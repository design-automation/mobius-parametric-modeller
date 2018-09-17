import { Injectable } from '@angular/core';

import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../store/store';
import { ADD_NODE } from '../store/actions';

@Injectable()
export class DataService {
  private static _data = {}; 
  private ngRedux: NgRedux<IAppState>;
  
  public static get data(){  return this._data; }
  public static set data(data){ 
    this._data = data; 
    
  }

  public dispatch(){
    this.ngRedux.dispatch({type: ADD_NODE});
  }

  public static get flowchart(){
    return this._data["flowchart"]; 
  }

}