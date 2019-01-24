import { DataService } from '../../../shared/services/data.service';
import { Router } from '@angular/router';
import { TestBed, ComponentFixture, fakeAsync, tick, async } from '@angular/core/testing';
import { LoadUrlComponent } from '../file/loadurl.component';
import { ExecuteComponent } from './execute.component';
import { MatIconModule } from '@angular/material';
import { GoogleAnalyticsService } from '@shared/services/google.analytics';
import { SpinnerComponent } from '../spinner/spinner.component';
import { FlowchartUtils } from '@models/flowchart';

import * as galleryUrl from '@assets/gallery/__config__.json';
import * as testUrl from '@assets/unit_tests/unit_test.json';

describe('Execute Component test', () => {
    let loadURLfixture:   ComponentFixture<LoadUrlComponent>;
    let executeFixture:   ComponentFixture<ExecuteComponent>;
    let spinnerFixture:   ComponentFixture<SpinnerComponent>;
    let router: Router;
    let dataService: DataService;

    beforeEach(() => {
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            declarations: [
                LoadUrlComponent,
                ExecuteComponent,
                SpinnerComponent
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
        spinnerFixture = TestBed.createComponent(SpinnerComponent);
        router = TestBed.get(Router);
        dataService = TestBed.get(DataService);
        window['ga'] = function() { };
        // dataService.file.flowchart = undefined;
    });

    for (const exampleSet of galleryUrl.data) {
        for (const file of exampleSet.files) {
            const f = file.replace(/ /g, '');
            let nodeCheck = false;
            if (f.indexOf('node=') !== -1) {
                nodeCheck = true;
            }
            it('load and execute gallery file: ' + f.split('.mob')[0], async (done: DoneFn) => {
                await loadURLfixture.componentInstance.loadStartUpURL(`?file=${exampleSet.link}${f}`);
                const rSpy = router.navigate as jasmine.Spy;
                expect(dataService.file.flowchart).toBeDefined(`Unable to load ${f.split('.mob')[0]}.mob`);
                if (dataService.file.flowchart) {
                    let nodeProcedures = 0;
                    for (const node of dataService.flowchart.nodes) {
                        nodeProcedures += node.procedure.length;
                    }
                    expect(nodeProcedures > dataService.flowchart.nodes.length + 1).toBe(true,
                            `${f.split('.mob')[0]}.mob is an empty flowchart`);
                    if (nodeCheck) {
                        expect(rSpy.calls.first().args[0][0]).toBe('/editor', 'Needs to navigate to editor');
                    }
                    await executeFixture.componentInstance.execute(true);
                    expect(f.split('.mob')[0]).toBe(dataService.file.name,
                        'Loaded file name and the file name in dataService do not match.');
                    expect(dataService.flowchart.nodes[dataService.flowchart.nodes.length - 1].model).toBeDefined(
                        `Execute fails. The end node model is not defined.`);
                }
                done();
            });
        }
    }

    for (const test of testUrl.test_data) {
        let testName: any = test.url.split('/');
        testName = testName[testName.length - 1];
        let nodeCheck = false;
        if (test.url.indexOf('node=') !== -1) {
            nodeCheck = true;
        }
        it('load and execute test file: ' + testName.split('.mob')[0], async (done: DoneFn) => {
            await loadURLfixture.componentInstance.loadStartUpURL(`?file=${test.url}`);
            const spy = router.navigate as jasmine.Spy;
            expect(dataService.file.flowchart).toBeDefined(`Unable to load ${testName}.mob`);
            if (dataService.file.flowchart) {
                let nodeProcedures = 0;
                for (const node of dataService.flowchart.nodes) {
                    nodeProcedures += node.procedure.length;
                }
                expect(nodeProcedures > dataService.flowchart.nodes.length + 1).toBe(true,
                        `${testName}.mob is an empty flowchart`);
                if (nodeCheck) {
                    expect(spy.calls.first().args[0][0]).toBe('/editor', 'Navigate to editor');
                }
                await executeFixture.componentInstance.execute(true);
                expect(testName.split('.mob')[0]).toBe(dataService.file.name,
                    'Loaded file name and the file name in dataService do not match.');
                const output = dataService.flowchart.nodes[dataService.flowchart.nodes.length - 1];
                expect(output.model).toBeDefined(
                    `Execute fails. The end node model is not defined.`);
                const geom_data = output.model.getGeomData();
                if (test.requirements.hasOwnProperty('num_positions')) {
                    expect(geom_data.num_positions).toBe(test.requirements['num_positions'], 'No. positions do not match');
                }
                if (test.requirements.hasOwnProperty('num_triangles')) {
                    expect(geom_data.triangles.length).toBe(test.requirements['num_triangles'], 'No. triangles do not match');
                }
                if (test.requirements.hasOwnProperty('num_vertices')) {
                    expect(geom_data.vertices.length).toBe(test.requirements['num_vertices'], 'No. vertices do not match');
                }
                if (test.requirements.hasOwnProperty('num_edges')) {
                    expect(geom_data.edges.length).toBe(test.requirements['num_edges'], 'No. edges do not match');
                }
                if (test.requirements.hasOwnProperty('num_wires')) {
                    expect(geom_data.wires.length).toBe(test.requirements['num_wires'], 'No. wires do not match');
                }
                if (test.requirements.hasOwnProperty('num_faces')) {
                    expect(geom_data.faces.length).toBe(test.requirements['num_faces'], 'No. faces do not match');
                }
                if (test.requirements.hasOwnProperty('num_points')) {
                    expect(geom_data.points.length).toBe(test.requirements['num_points'], 'No. points do not match');
                }
                if (test.requirements.hasOwnProperty('num_polylines')) {
                    expect(geom_data.polylines.length).toBe(test.requirements['num_polylines'], 'No. polylines do not match');
                }
                if (test.requirements.hasOwnProperty('num_polygons')) {
                    expect(geom_data.polygons.length).toBe(test.requirements['num_polygons'], 'No. polygons do not match');
                }
                if (test.requirements.hasOwnProperty('num_collections')) {
                    expect(geom_data.collections.length).toBe(test.requirements['num_collections'], 'No. collections do not match');
                }
                if (test.returns) {
                    expect(output.output.value).toBe(test.returns, 'Return values do not match');
                }
            }
            done();
        });

    }
});

