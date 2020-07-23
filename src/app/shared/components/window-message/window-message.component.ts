import { Component, HostListener } from '@angular/core';
import { DataService } from '@services';
import { _parameterTypes } from '@assets/core/_parameterTypes';
import { ProcedureTypes } from '@models/procedure';
import { InputType } from '@models/port';

@Component({
  selector: 'window-message',
  template:  ``,
  styles: [``]
})

// Component for loading a local .mob file into mobius
export class WindowMessageComponent {

    constructor(private dataService: DataService) {}

    static SendData(data: any): void {
        window.parent.postMessage(data, '*');
    }

    @HostListener('window:message', ['$event'])
    onWindowMessage(event: MessageEvent) {
        // if (event.origin !== "http://example.com:8080") {
        //     return;
        // }
        if (!event.data.messageType) {
            return;
        }
        switch (event.data.messageType) {
            case 'set_param':
                if (!event.data.params) {
                    return;
                }
                const params = event.data.params;
                for (const prod of this.dataService.flowchart.nodes[0].procedure) {
                    if (prod.type === ProcedureTypes.Constant) {
                        if (params[prod.args[0].value] !== undefined) {
                            prod.args[1].value = params[prod.args[0].value];
                        }
                        if (params[prod.args[0].jsValue] !== undefined) {
                            prod.args[1].value = params[prod.args[0].jsValue];
                        }
                        if (typeof prod.args[1].jsValue === 'object') {
                            prod.args[1].value = JSON.stringify(prod.args[1].jsValue);
                        }
                        if (prod.meta.inputMode === InputType.SimpleInput || prod.meta.inputMode === InputType.URL) {
                            prod.args[1].jsValue = prod.args[1].value;
                        }
                    }
                }
                // checkNodeValidity(this.dataService.flowchart.nodes[0]);
                document.getElementById('executeButton').click();
                WindowMessageComponent.SendData('test_param');
                break;
            case 'load_url':
                if (!event.data.url) {
                    return;
                }
                let loadSettings = '&loadSettings';
                if (event.data.hasOwnProperty('loadSettings') && event.data.loadSettings === false) {
                    loadSettings = '';
                }
                const x = document.getElementById('savedata');
                (<HTMLInputElement>document.getElementById('loadurl_input')).value = 'file=' + event.data.url + loadSettings;
                (<HTMLElement>document.getElementById('loadurl')).click();
                WindowMessageComponent.SendData('test_url');
                break;
        }
    }

}
