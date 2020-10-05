import { Component, Output, EventEmitter, OnInit, HostListener, ViewChild, AfterViewInit } from '@angular/core';
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
import { DataOutputService } from '@shared/services/dataOutput.service';
import { SplitComponent } from 'angular-split';

@Component({
  selector: 'view-gallery',
  templateUrl: './view-gallery.component.html',
  styleUrls: ['./view-gallery.component.scss']
})
export class ViewGalleryComponent implements AfterViewInit {

    // private allFiles: Observable<any>;
    allGalleries = [];
    allGalleriesData = galleryUrls.data;
    urlPrefix = '';
    @Output() switch = new EventEmitter();
    @ViewChild('gallerySplit', { static: false }) gallerySplit: SplitComponent;

    /*
    constructor(private http: HttpClient, private dataService: DataService, private router: Router) {
        this.allFiles = this.getFilesFromURL();
    }

    */

    constructor(private http: HttpClient, private dataService: DataService,
                private dataOutputService: DataOutputService, private router: Router) {
        this.allGalleries = this.allGalleriesData.map(gallery => gallery.name);
        if (window.location.href.indexOf('design-automation.github.io') !== -1) {
            this.urlPrefix = '/' + window.location.href.split('design-automation.github.io/')[1].split('/')[0];
        }
        /*
        if (!this.dataService.galleryFiles) {
            this.dataService.galleryFiles = this.getFilesFromURL();
        }
        */
        new LoadUrlComponent(this.dataService, this.router).loadStartUpURL(this.router.url);
   }

    ngAfterViewInit() {
        if (!this.dataService.activeGallery || !this.switchGallery(this.dataService.activeGallery)) {
            this.dataService.activeGallery = this.allGalleriesData[0].name;
        }
    }

    viewerData() {
        return this.dataOutputService.getViewerData(this.getNode(), this.dataService.flowchart.model, true);
    }

    getFilesFromURL(): Observable<any> {
        return this.http.get(Constants.GALLERY_URL, {responseType: 'json'});
    }

    onGalleryScroll(e: MouseEvent) {
        const contentPanel = document.getElementById('gallery_content_panel');
        const scrollPos = contentPanel.scrollTop + 80;
        let lastHeader = null;
        for (const gallery of this.allGalleriesData) {
            const gallery_header = document.getElementById('gallery-tab_' + gallery.name);
            gallery_header.classList.remove('sticky');
            if (lastHeader === 0) {
            } else if (scrollPos > gallery_header.offsetTop) {
                lastHeader = gallery_header;
                this.dataService.activeGallery = gallery.name;
            } else {
                lastHeader.classList.add('sticky');
                lastHeader = 0;
            }
        }
        if (lastHeader !== 0) {
            lastHeader.classList.add('sticky');
            lastHeader = 0;
        }
    }

    openGalleryMenu(e: MouseEvent) {
        const header = document.getElementById('galleryMenu');
        if (!header.style.display || header.style.display === 'none') {
            header.style.display = 'block';
            let top = e.screenY - 60;
            if (header.offsetHeight + top > window.innerHeight) {
                top = window.innerHeight - header.offsetHeight;
            }
            header.style.top = top + 'px';
        } else {
            header.style.display = 'none';
        }
        e.stopPropagation();
    }


    switchGallery(galleryName: string): boolean {
        const contentPanel = document.getElementById('gallery_content_panel');
        const galleryElm = document.getElementById('gallery-tab_' + galleryName);
        if (!galleryElm) { return false; }
        contentPanel.scrollTop = galleryElm.offsetTop - 41;
        this.dataService.activeGallery = galleryName;
        return true;
        // for (const gallery of this.allGalleriesData) {
        //     if (gallery.name === galleryName) {
        //         this.dataService.activeGallery = gallery;
        //         return true;
        //     }
        // }
        // return false;
    }

    loadFile(fileLink) {
        const linkSplit = (this.urlPrefix + fileLink).split(/\s*&*\s*node\s*=/);
        linkSplit[0] = linkSplit[0].trim();
        // if (!linkSplit[0].endsWith('.mob')) {
        //     linkSplit[0] = linkSplit[0].concat('.mob');
        // }
        if (linkSplit.length > 1) {
            new LoadUrlComponent(this.dataService, this.router).loadURL(linkSplit[0], Number(linkSplit[1].split('&')[0].trim()));
        } else {
            new LoadUrlComponent(this.dataService, this.router).loadURL(linkSplit[0]);
        }
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
        //                 version: f.version,
        //                 settings: f.settings || {}
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

    getImgURL(imgLink: string, f) {
        return this.urlPrefix + imgLink + 'imgs/' + f.split('.mob')[0] + '.JPG';
    }

    // viewerData(): any {
    //     const node = this.dataService.flowchart.nodes[this.dataService.flowchart.meta.selected_nodes[0]];
    //     if (!node || !node.enabled) { return ''; }
    //     // if (node.type === 'output') { return node.input.value; }
    //     return node.model;
    // }

    setSplit(event) {
        this.dataService.splitUpdate = true;
        this.dataService.splitVal = event.sizes[1];
    }

    getSplit() { return this.dataService.splitVal; }
    getFlowchart() { return this.dataService.flowchart; }
    getNode() { return this.dataService.node; }
    getActiveGallery() { return this.dataService.activeGallery; }
    getFlowchartName() { return this.dataService.file.name; }

    @HostListener('document:mouseleave', [])
    onmouseleave() {
        this.gallerySplit.notify('end', this.gallerySplit.gutterSize);
    }

}
