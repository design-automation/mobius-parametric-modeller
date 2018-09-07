import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
  
  private static _data = {
      'name' : "Akshata", 
      'age' : 27, 
      'interests' : [ 'coding', 'traveling', 'food' ] 
  }; 
  
  constructor() { 

      // alert if recreated
      alert("Data Service recreated!")

  };

  public static get data(){
    return this._data;
  }

  public static set data(data){
    this._data = data;
  }

}