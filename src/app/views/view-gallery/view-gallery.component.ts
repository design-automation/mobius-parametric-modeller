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
        const linkSplit = (this.urlPrefix + fileLink).split(/\s*&\s*/);
        linkSplit[0] = linkSplit[0].trim();
        let nodeIndex = null;
        let defaultViewer = null;
        for (const split of linkSplit) {
            if (split.indexOf('node') !== -1) {
                nodeIndex = Number(split.split('=')[1].trim());
            }
            if (split.indexOf('defaultViewer') !== -1) {
                defaultViewer = split.split('=')[1].trim();
            }
        }
        new LoadUrlComponent(this.dataService, this.router).loadURL(linkSplit[0], nodeIndex);
        this.router.navigate(['/dashboard']);
        if (defaultViewer) {
            setTimeout(() => {
                let viewerBtn;
                switch (defaultViewer) {
                    case '0':
                        viewerBtn = document.getElementById('Console');
                        break;
                    case '1':
                        viewerBtn = document.getElementById('3D Viewer');
                        break;
                    case '2':
                        viewerBtn = document.getElementById('Three Geo Viewer');
                        break;
                }
                if (viewerBtn) { viewerBtn.click(); }
            }, 100);
        }
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
