import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from "./view-gallery.config";
import { Observable } from 'rxjs';
import { IMobius } from '@models/mobius';

import { DataService } from '@services';

@Component({
  selector: 'view-gallery',
  templateUrl: './view-gallery.component.html',
  styleUrls: ['./view-gallery.component.scss']
})
export class ViewGalleryComponent{

    private allFiles: Observable<any>;
    constructor(private http: HttpClient, private dataService: DataService) { 
        this.allFiles = this.getFilesFromURL()
    }

    getFilesFromURL(): Observable<any> {
      return this.http.get(Constants.GALLERY_URL, {responseType: 'json'});
    }

  loadFile(f){
    let stream = Observable.create(observer => {
      let request = new XMLHttpRequest();
      
      request.open('GET', f.download_url);
      request.onload = () => {
          if (request.status === 200) {
              var f = JSON.parse(request.responseText);
              const file: IMobius = {
                  name: f.name,
                  author: f.author, 
                  flowchart: f.flowchart,
                  last_updated: f.last_updated,
                  version: f.version
              }
              observer.next(file);
              observer.complete();
          } else {
              observer.error('error happened');
          }
      };
  
      request.onerror = () => {
      observer.error('error happened');
      };
      request.send();
    });
    
    stream.subscribe(loadeddata => {
      this.dataService.file = loadeddata;
    });
  }

}
