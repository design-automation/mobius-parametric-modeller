import { Component, Input, DoCheck, OnDestroy } from '@angular/core';
import { ModuleList, ModuleDocList } from '@shared/decorators';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '@shared/services';

/**
 * HelpViewerComponent
 */
 @Component({
  selector: 'help-viewer',
  templateUrl: './help-viewer.component.html',
  styleUrls: ['./help-viewer.component.scss']
})
export class HelpViewerComponent implements DoCheck, OnDestroy {
    output: any;
    ModuleDoc = ModuleDocList;
    Modules = [];
    activeModIndex: string;

    // TODO: update mobius url
    urlString: string;
    /**
     * constructor
     */
    constructor(private mainDataService: DataService) {
        this.urlString = `${window.location.origin}` +
                        '/flowchart?file=' +
                        'https://raw.githubusercontent.com/design-automation/' +
                        'mobius-parametric-modeller/master/src/assets/gallery/function_examples/';

        for (const mod of ModuleList) {
            if (mod.module[0] === '_') {continue; }
            const nMod = {'module': mod.module, 'functions': [], 'description': ModuleDocList[mod.module].description};
            for (const func of mod.functions) {
                if (func.name[0] === '_') {continue; }
                nMod.functions.push(ModuleDocList[mod.module][func.name]);
            }
            if (mod.functions.length > 0) {
                this.Modules.push(nMod);
            }
        }
        this.output = this.mainDataService.helpViewData[0];
        this.activeModIndex = this.mainDataService.helpViewData[1];
    }

    ngOnDestroy() {
        this.mainDataService.helpViewData = [this.output, this.activeModIndex];
    }

    ngDoCheck() {
        if (this.mainDataService.helpView[1] === true) {
            this.output = this.mainDataService.helpView[2];
            this.mainDataService.togglePageHelp(false);
        }
    }

    openHelpMenu(e: MouseEvent) {
        let stl = document.getElementById('helpMenu').style;
        if (!stl.display || stl.display === 'none') {
            stl.display = 'block';
        } else {
            stl.display = 'none';
        }
        e.stopPropagation();
        stl = null;
    }

    getActiveModule() {
        if (this.output) { return ''; }
        if (this.activeModIndex === '') { return ''; }
        return this.Modules[this.activeModIndex].module.toUpperCase();
    }

    getFuncs() {
        if (this.activeModIndex === '') { return []; }
        return this.Modules[this.activeModIndex].functions;
    }

    switchHelp(mod) {
        this.output = undefined;
        this.activeModIndex = mod;
    }
}
