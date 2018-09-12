import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
  
  private static _data = {  }; 
  
  constructor() { 
      // alert if recreated
  };

  public static get data(){
    return this._data;
  }

  public static set data(data){
    this._data = data;
  }

}