import { Component, Input, DoCheck, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ModuleList, ModuleDocList, ControlFlowDocList} from '@shared/decorators';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '@shared/services';
import * as showdown from 'showdown';
/**
 * HelpViewerComponent
 */
 @Component({
  selector: 'help-viewer',
  templateUrl: './help-viewer.component.html',
  styleUrls: ['./help-viewer.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class HelpViewerComponent implements DoCheck, OnDestroy {
    output: any;
    description = '';
    ModuleDoc = ModuleDocList;
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

                        const extraMods = ['Variable', 'Comment', 'Expression']
        for (const i of extraMods) {
            this.Modules.push({
                'module': i,
                'functions': [{
                    description: ControlFlowDocList[i].description,
                    module: '',
                    name: i,
                    displayedName: i,
                    parameters: [],
                    returns: undefined,
                    example: ControlFlowDocList[i].example,
                    example_info: ControlFlowDocList[i].example_info,
                }],
                'description': ''
            });
        }
        const controlFlowMod = {'module': 'Control Flow', 'functions': [], 'description': ''};
        for (const basicfunc of Object.keys(ControlFlowDocList)) {
            if (extraMods.indexOf(basicfunc) !== -1) { continue; }
            controlFlowMod.functions.push({
                description: ControlFlowDocList[basicfunc].description,
                module: '',
                name: basicfunc,
                displayedName: basicfunc,
                parameters: [],
                returns: undefined,
                example: ControlFlowDocList[basicfunc].example,
                example_info: ControlFlowDocList[basicfunc].example_info,
            });
        }
        this.Modules.push(controlFlowMod);

        for (const mod of ModuleList) {
            if (mod.module[0] === '_') {continue; }
            const nMod = {'module': mod.module, 'functions': [], 'description': ModuleDocList[mod.module].description};
            for (const func of mod.functions) {
                if (func.name[0] === '_') {continue; }
                ModuleDocList[mod.module][func.name].displayedName = func.module + '.' + func.name;
                ModuleDocList[mod.module][func.name].description = ModuleDocList[mod.module][func.name].description;
                nMod.functions.push(ModuleDocList[mod.module][func.name]);
            }
            if (mod.functions.length > 0) {
                this.Modules.push(nMod);
            }
        }
        this.output = this.mainDataService.helpViewData[0];
        this.activeModIndex = this.mainDataService.helpViewData[1];
        if (this.output) {
            this.description = this.output.description;
        } else {
            this.description = '';
        }
    }

    ngOnDestroy() {
        this.mainDataService.helpViewData = [this.output, this.activeModIndex];
    }

    ngDoCheck() {
        if (this.mainDataService.helpView[1] === true) {
            this.output = this.mainDataService.helpView[2];
            this.mainDataService.togglePageHelp(false);
            if (this.output) {
                this.description = this.output.description;
            } else {
                this.description = '';
            }
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
