import { Component, DoCheck, OnDestroy } from '@angular/core';
import { ModuleList} from '@shared/decorators';
import { DataService } from '@shared/services';
import * as showdown from 'showdown';
import { FaceNormalsHelper } from 'three';
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
    description = '';
    Modules = [];
    activeModIndex: string;
    mdConverter = new showdown.Converter({literalMidWordUnderscores: true});

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

        const extraMods = ['variable', 'comment', 'expression', 'control_flow'];
        for (const i of extraMods) {
            this.Modules.push({
                'module': i,
                'src': `assets/typedoc-json/docCF/${i}.md`,
                'functions': {}
            });
        }

        for (const mod of ModuleList) {
            if (mod.module[0] === '_') {continue; }
            const nMod = {  'module': mod.module,
                            'src': `assets/typedoc-json/docMD/${mod.module}.md`,
                            'functions': {}};
            this.Modules.push(nMod);
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
