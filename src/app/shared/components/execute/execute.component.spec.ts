import { DataService } from '../../../shared/services/data.service';
import * as galleryUrl from '@assets/gallery/__config__.json';
import { Router } from '@angular/router';
import { TestBed, ComponentFixture, fakeAsync, tick, async } from '@angular/core/testing';
import { LoadUrlComponent } from '../file/loadurl.component';
import { ExecuteComponent } from './execute.component';
import { MatIconModule } from '@angular/material';
import { GoogleAnalyticsService } from '@shared/services/google.analytics';

describe('Execute Component test', () => {
    let loadURLfixture:   ComponentFixture<LoadUrlComponent>;
    let executeFixture:   ComponentFixture<ExecuteComponent>;
    let router: Router;
    let dataService: DataService;

    beforeEach(() => {
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            declarations: [
                LoadUrlComponent,
                ExecuteComponent
            ],
            imports: [
                MatIconModule
            ],
            providers: [
                DataService,
                { provide: Router,      useValue: routerSpy },
                GoogleAnalyticsService
            ]
        }).compileComponents();
        loadURLfixture = TestBed.createComponent(LoadUrlComponent);
        executeFixture = TestBed.createComponent(ExecuteComponent);
        router = TestBed.get(Router);
        dataService = TestBed.get(DataService);
    });

    for (const exampleSet of galleryUrl.data) {
        for (const file of exampleSet.files) {
            const f = file.replace(/ /g, '');
            let nodeCheck = false;
            if (f.indexOf('node=') !== -1) {
                nodeCheck = true;
            }
            it('load file: ' + f.split('.mob')[0], async (done: DoneFn) => {
                await loadURLfixture.componentInstance.loadStartUpURL(`?file=${exampleSet.link}${f}`);
                const spy = router.navigate as jasmine.Spy;
                let nodeProcedures = 0;
                for (const node of dataService.flowchart.nodes) {
                    nodeProcedures += node.procedure.length;
                }
                expect(nodeProcedures > 4).toBe(true, `successfully imported ${f.split('.mob')[0]}`);
                if (nodeCheck) {
                    expect(spy.calls.first().args[0][0]).toBe('/editor', 'successfully navigate to editor');
                }
                // await executeFixture.componentInstance.execute();
                done();
            });
        }
    }

});

