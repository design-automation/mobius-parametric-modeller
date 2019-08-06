import { DataService } from '../../../shared/services/data.service';
import { Router } from '@angular/router';
import { TestBed, ComponentFixture, fakeAsync, tick, async } from '@angular/core/testing';
import { LoadUrlComponent } from '../file/loadurl.component';
import { ExecuteComponent } from './execute.component';
import { MatIconModule } from '@angular/material';
import { GoogleAnalyticsService } from '@shared/services/google.analytics';
import { SpinnerComponent } from '../spinner/spinner.component';
import { FlowchartUtils } from '@models/flowchart';
import { _model } from '@modules';
import * as galleryUrl from '@assets/gallery/__config__.json';
import * as testUrl from '@assets/unit_tests/unit_test.json';
import { DataOutputService } from '@shared/services/dataOutput.service';
import { _parameterTypes } from '@assets/core/_parameterTypes';

describe('Execute Component test', () => {
    let loadURLfixture:   ComponentFixture<LoadUrlComponent>;
    let executeFixture:   ComponentFixture<ExecuteComponent>;
    let spinnerFixture:   ComponentFixture<SpinnerComponent>;
    let router: Router;
    let dataService: DataService;
    let dataOutputService: DataOutputService;

    beforeEach(() => {
        // jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
                DataOutputService,
                { provide: Router,      useValue: routerSpy },
                GoogleAnalyticsService
            ]
        }).compileComponents();
        loadURLfixture = TestBed.createComponent(LoadUrlComponent);
        executeFixture = TestBed.createComponent(ExecuteComponent);
        spinnerFixture = TestBed.createComponent(SpinnerComponent);
        router = TestBed.get(Router);
        dataService = TestBed.get(DataService);
        dataOutputService = TestBed.get(DataOutputService);
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
                    dataService.flagModifiedNode(dataService.file.flowchart.nodes[0].id);

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
                const model = JSON.parse(output.model);
                if (test.requirements.hasOwnProperty('geometry')) {
                    const geom_data = model.geometry;
                    if (test.requirements.geometry.hasOwnProperty('num_positions')) {
                        expect(geom_data.num_positions).toBe(test.requirements.geometry['num_positions'], 'No. positions do not match');
                    }
                    if (test.requirements.geometry.hasOwnProperty('num_triangles')) {
                        expect(geom_data.triangles.length).toBe(test.requirements.geometry['num_triangles'], 'No. triangles do not match');
                    }
                    if (test.requirements.geometry.hasOwnProperty('num_vertices')) {
                        expect(geom_data.vertices.length).toBe(test.requirements.geometry['num_vertices'], 'No. vertices do not match');
                    }
                    if (test.requirements.geometry.hasOwnProperty('num_edges')) {
                        expect(geom_data.edges.length).toBe(test.requirements.geometry['num_edges'], 'No. edges do not match');
                    }
                    if (test.requirements.geometry.hasOwnProperty('num_wires')) {
                        expect(geom_data.wires.length).toBe(test.requirements.geometry['num_wires'], 'No. wires do not match');
                    }
                    if (test.requirements.geometry.hasOwnProperty('num_faces')) {
                        expect(geom_data.faces.length).toBe(test.requirements.geometry['num_faces'], 'No. faces do not match');
                    }
                    if (test.requirements.geometry.hasOwnProperty('num_points')) {
                        expect(geom_data.points.length).toBe(test.requirements.geometry['num_points'], 'No. points do not match');
                    }
                    if (test.requirements.geometry.hasOwnProperty('num_polylines')) {
                        expect(geom_data.polylines.length).toBe(test.requirements.geometry['num_polylines'], 'No. polylines do not match');
                    }
                    if (test.requirements.geometry.hasOwnProperty('num_polygons')) {
                        expect(geom_data.polygons.length).toBe(test.requirements.geometry['num_polygons'], 'No. polygons do not match');
                    }
                    if (test.requirements.geometry.hasOwnProperty('num_collections')) {
                        expect(geom_data.collections.length).toBe(test.requirements.geometry['num_collections'],
                        'No. collections do not match');
                    }
                }
                if (test.requirements.hasOwnProperty('attributes')) {
                    const attrb_data = model.attributes;
                    let testSet, resultSet;
                    if (test.requirements.attributes.hasOwnProperty('position_attribs')) {
                        testSet = new Set(attrb_data.positions.map(x => x.name));
                        resultSet = new Set(test.requirements.attributes['position_attribs']);
                        expect(testSet).toEqual(resultSet, 'No. position attributes do not match');
                    }
                    if (test.requirements.attributes.hasOwnProperty('vertex_attribs')) {
                        testSet = new Set(attrb_data.vertices.map(x => x.name));
                        resultSet = new Set(test.requirements.attributes['vertex_attribs']);
                        expect(testSet).toEqual(resultSet, 'No. vertex attributes do not match');
                    }
                    if (test.requirements.attributes.hasOwnProperty('edge_attribs')) {
                        testSet = new Set(attrb_data.edges.map(x => x.name));
                        resultSet = new Set(test.requirements.attributes['edge_attribs']);
                        expect(testSet).toEqual(resultSet, 'No. edge attributes do not match');
                    }
                    if (test.requirements.attributes.hasOwnProperty('wire_attribs')) {
                        testSet = new Set(attrb_data.wires.map(x => x.name));
                        resultSet = new Set(test.requirements.attributes['wire_attribs']);
                        expect(testSet).toEqual(resultSet, 'No. wire attributes do not match');
                    }
                    if (test.requirements.attributes.hasOwnProperty('face_attribs')) {
                        testSet = new Set(attrb_data.faces.map(x => x.name));
                        resultSet = new Set(test.requirements.attributes['face_attribs']);
                        expect(testSet).toEqual(resultSet, 'No. face attributes do not match');
                    }
                    if (test.requirements.attributes.hasOwnProperty('point_attribs')) {
                        testSet = new Set(attrb_data.points.map(x => x.name));
                        resultSet = new Set(test.requirements.attributes['point_attribs']);
                        expect(testSet).toEqual(resultSet, 'No. point attributes do not match');
                    }
                    if (test.requirements.attributes.hasOwnProperty('polyline_attribs')) {
                        testSet = new Set(attrb_data.polylines.map(x => x.name));
                        resultSet = new Set(test.requirements.attributes['polyline_attribs']);
                        expect(testSet).toEqual(resultSet, 'No. polyline attributes do not match');
                    }
                    if (test.requirements.attributes.hasOwnProperty('polygon_attribs')) {
                        testSet = new Set(attrb_data.polygons.map(x => x.name));
                        resultSet = new Set(test.requirements.attributes['polygon_attribs']);
                        expect(testSet).toEqual(resultSet, 'No. polygon attributes do not match');
                    }
                    if (test.requirements.attributes.hasOwnProperty('collection_attribs')) {
                        testSet = new Set(attrb_data.collections.map(x => x.name));
                        resultSet = new Set(test.requirements.attributes['collection_attribs']);
                        expect(testSet).toEqual(resultSet, 'No. collection attributes do not match');
                    }
                    if (test.requirements.attributes.hasOwnProperty('model_attribs')) {
                        testSet = new Set(attrb_data.model.map(x => x.name));
                        resultSet = new Set(test.requirements.attributes['model_attribs']);
                        expect(testSet).toEqual(resultSet, 'No. model attributes do not match');
                    }
                }
                if (test.returns) {
                    expect(output.output.value).toBe(test.returns, 'Return values do not match');
                }
                const oModel = _parameterTypes.newFn();
                oModel.setData(model);
                expect(_model.__checkModel__(oModel)).toEqual([], '_model.__checkModel__ failed');
            }
            done();
        });

    }
});

