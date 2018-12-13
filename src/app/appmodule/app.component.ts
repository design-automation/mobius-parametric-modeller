import { Component, Injector } from '@angular/core';
import { DataService } from '@services';

// @ts-ignore
console.stdlog = console.log.bind(console);
// @ts-ignore
console.logs = [];
// @ts-ignore
console.log = function() {
    // @ts-ignore
    console.logs.push(Array.from(arguments));
    // @ts-ignore
    console.stdlog.apply(console, arguments);
};
/*

*/
@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {

    constructor(private dataService: DataService, private injector: Injector) {}

}
