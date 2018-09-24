import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from "./view-gallery.config";
import { Observable } from 'rxjs';

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

    // todo:
    loadFile(f){
      // extract url
      // load file from url
      // update dataservice with file: this.dataService.file = loadedFile
      // navigate route to viewer
    }

}
