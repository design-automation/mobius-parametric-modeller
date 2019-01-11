import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { LoadUrlComponent } from '@shared/components/file/loadurl.component';
import { HttpClient } from '@angular/common/http';
import { Constants } from './view-gallery.config';
import { Observable } from 'rxjs';
import { IMobius } from '@models/mobius';
// import {Router} from '@angular/router';

import { DataService } from '@services';
import * as circularJSON from 'circular-json';
import { Router } from '@angular/router';

import * as galleryUrls from '@assets/gallery/__config__.json';

@Component({
  selector: 'view-gallery',
  templateUrl: './view-gallery.component.html',
  styleUrls: ['./view-gallery.component.scss']
})
export class ViewGalleryComponent {

    // private allFiles: Observable<any>;
    private allGalleries = [];
    @Output() switch = new EventEmitter();

    /*
    constructor(private http: HttpClient, private dataService: DataService, private router: Router) {
        this.allFiles = this.getFilesFromURL();
    }

    */

    constructor(private http: HttpClient, private dataService: DataService, private router: Router) {
        this.allGalleries = galleryUrls.data.map(gallery => gallery.name);
        if (!this.dataService.activeGallery || !this.switchGallery(this.dataService.activeGallery.name)) {
            this.dataService.activeGallery = galleryUrls.data[0];
        }
        /*
        if (!this.dataService.galleryFiles) {
            this.dataService.galleryFiles = this.getFilesFromURL();
        }
        */
        new LoadUrlComponent(this.dataService).loadStartUpURL(this.router.url);
   }

    getFilesFromURL(): Observable<any> {
        return this.http.get(Constants.GALLERY_URL, {responseType: 'json'});
    }

    openGalleryMenu(e: MouseEvent) {
        const stl = document.getElementById('galleryMenu').style;
        if (!stl.display || stl.display === 'none') {
            stl.display = 'block';
        } else {
            stl.display = 'none';
        }
        e.stopPropagation();

    }


    switchGallery(galleryName: string): boolean {
        for (const gallery of galleryUrls.data) {
            if (gallery.name === galleryName) {
                this.dataService.activeGallery = gallery;
                return true;
            }
        }
        return false;
    }

    loadFile(fileLink) {

        new LoadUrlComponent(this.dataService).loadURL(fileLink + '.mob');
        this.router.navigate(['/dashboard']);

        // const stream = Observable.create(observer => {
        //     const request = new XMLHttpRequest();

        //     request.open('GET', fileLink + '.mob');
        //     request.onload = () => {
        //         if (request.status === 200) {
        //             const f = circularJSON.parse(request.responseText);
        //             const file: IMobius = {
        //                 name: f.name,
        //                 author: f.author,
        //                 flowchart: f.flowchart,
        //                 last_updated: f.last_updated,
        //                 version: f.version
        //             };
        //             observer.next(file);
        //             observer.complete();
        //         } else {
        //             observer.error('error happened');
        //         }
        //     };

        //     request.onerror = () => {
        //     observer.error('error happened');
        //     };
        //     request.send();
        // });
        // stream.subscribe(loadeddata => {
        //     this.dataService.file = loadeddata;
        //     this.dataService.newFlowchart = true;
        //     if (this.dataService.node.type !== 'end') {
        //         for (let i = 0; i < loadeddata.flowchart.nodes.length; i++) {
        //             if (loadeddata.flowchart.nodes[i].type === 'end') {
        //                 loadeddata.flowchart.meta.selected_nodes = [i];
        //                 break;
        //             }
        //         }
        //     }
        //     this.router.navigate(['/dashboard']);
        //     document.getElementById('executeButton').click();
        // });
    }

    viewerData(): any {
        const node = this.dataService.flowchart.nodes[this.dataService.flowchart.meta.selected_nodes[0]];
        if (!node) { return ''; }
        // if (node.type === 'output') { return node.input.value; }
        return node.model;
    }

    setSplit(e) { this.dataService.splitVal = e.sizes[1]; }
    getSplit() { return this.dataService.splitVal; }
    getFlowchart() { return this.dataService.flowchart; }
    getActiveGallery() { return this.dataService.activeGallery; }
}
