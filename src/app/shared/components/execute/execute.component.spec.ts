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
// import * as galleryUrl from '@assets/gallery/__config__.json';
import { DataOutputService } from '@shared/services/dataOutput.service';
import { _parameterTypes } from '@assets/core/_parameterTypes';
import { EEntType } from '@libs/geo-info/common';

import * as testUrl from '@assets/unit_tests/unit_test.json';
import * as compUrl from '@assets/unit_tests/unit_test_comp.json';

// describe('Execute Component test', () => {
//     let loadURLfixture:   ComponentFixture<LoadUrlComponent>;
//     let executeFixture:   ComponentFixture<ExecuteComponent>;
//     let spinnerFixture:   ComponentFixture<SpinnerComponent>;
//     let router: Router;
//     let dataService: DataService;
//     let dataOutputService: DataOutputService;

//     beforeEach(() => {
//         // jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
//         const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

//         TestBed.configureTestingModule({
//             declarations: [
//                 LoadUrlComponent,
//                 ExecuteComponent,
//                 SpinnerComponent
//             ],
//             imports: [
//                 MatIconModule
//             ],
//             providers: [
//                 DataService,
//                 DataOutputService,
//                 { provide: Router,      useValue: routerSpy },
//                 GoogleAnalyticsService
//             ]
//         }).compileComponents();
//         loadURLfixture = TestBed.createComponent(LoadUrlComponent);
//         executeFixture = TestBed.createComponent(ExecuteComponent);
//         spinnerFixture = TestBed.createComponent(SpinnerComponent);
//         router = TestBed.get(Router);
//         dataService = TestBed.get(DataService);
//         dataOutputService = TestBed.get(DataOutputService);
//         window['ga'] = function() { };
//         // dataService.file.flowchart = undefined;
//     });

//     for (const test of testUrl.test_data) {
//         let testName: any = test.url.split('/');
//         testName = testName[testName.length - 1];
//         let nodeCheck = false;
//         if (test.url.indexOf('node=') !== -1) {
//             nodeCheck = true;
//         }
//         it(`load and execute test file: ${testName.split('.mob')[0]}\n` +
//         `url: ${test.url}`, async (done: DoneFn) => {
//             const loadCheck = await loadURLfixture.componentInstance.loadStartUpURL(`?file=${test.url}`);
//             expect(loadCheck).toBeTruthy(`Unable to load ${testName}`);
//             const spy = router.navigate as jasmine.Spy;
//             if (loadCheck) {
//                 let nodeProcedures = 0;
//                 for (const node of dataService.flowchart.nodes) {
//                     nodeProcedures += node.procedure.length;
//                 }
//                 expect(nodeProcedures > dataService.flowchart.nodes.length + 1).toBe(true,
//                         `${testName}.mob is an empty flowchart`);
//                 if (nodeCheck) {
//                     expect(spy.calls.first().args[0][0]).toBe('/editor', 'Navigate to editor');
//                 }
//                 await executeFixture.componentInstance.execute(true);
//                 expect(testName.split('.mob')[0]).toBe(dataService.file.name,
//                     'Loaded file name and the file name in dataService do not match.');
//                 const output = dataService.flowchart.nodes[dataService.flowchart.nodes.length - 1];
//                 const model = JSON.parse(output.model);
//                 const oModel = _parameterTypes.newFn();
//                 oModel.setData(model);
//                 if (test.requirements.hasOwnProperty('geometry')) {
//                     if (test.requirements.geometry.hasOwnProperty('num_positions')) {
//                         expect(oModel.geom.query.numEnts(EEntType.POSI, false)).
//                         toBe(test.requirements.geometry['num_positions'], 'No. positions do not match');
//                     }
//                     if (test.requirements.geometry.hasOwnProperty('num_vertices')) {
//                         expect(oModel.geom.query.numEnts(EEntType.VERT, false)).
//                         toBe(test.requirements.geometry['num_vertices'], 'No. vertices do not match');
//                     }
//                     if (test.requirements.geometry.hasOwnProperty('num_edges')) {
//                         expect(oModel.geom.query.numEnts(EEntType.EDGE, false)).
//                         toBe(test.requirements.geometry['num_edges'], 'No. edges do not match');
//                     }
//                     if (test.requirements.geometry.hasOwnProperty('num_wires')) {
//                         expect(oModel.geom.query.numEnts(EEntType.WIRE, false)).
//                         toBe(test.requirements.geometry['num_wires'], 'No. wires do not match');
//                     }
//                     if (test.requirements.geometry.hasOwnProperty('num_faces')) {
//                         expect(oModel.geom.query.numEnts(EEntType.FACE, false)).
//                         toBe(test.requirements.geometry['num_faces'], 'No. faces do not match');
//                     }
//                     if (test.requirements.geometry.hasOwnProperty('num_points')) {
//                         expect(oModel.geom.query.numEnts(EEntType.POINT, false)).
//                         toBe(test.requirements.geometry['num_points'], 'No. points do not match');
//                     }
//                     if (test.requirements.geometry.hasOwnProperty('num_polylines')) {
//                         expect(oModel.geom.query.numEnts(EEntType.PLINE, false)).
//                         toBe(test.requirements.geometry['num_polylines'], 'No. polylines do not match');
//                     }
//                     if (test.requirements.geometry.hasOwnProperty('num_polygons')) {
//                         expect(oModel.geom.query.numEnts(EEntType.PGON, false)).
//                         toBe(test.requirements.geometry['num_polygons'], 'No. polygons do not match');
//                     }
//                     if (test.requirements.geometry.hasOwnProperty('num_collections')) {
//                         expect(oModel.geom.query.numEnts(EEntType.COLL, false)).
//                         toBe(test.requirements.geometry['num_collections'], 'No. collections do not match');
//                     }
//                 }
//                 if (test.requirements.hasOwnProperty('attributes')) {
//                     const attrb_data = model.attributes;
//                     let testSet, resultSet;
//                     if (test.requirements.attributes.hasOwnProperty('position_attribs')) {
//                         testSet = new Set(oModel.attribs.query.getAttribNames(EEntType.POSI));
//                         resultSet = new Set(test.requirements.attributes['position_attribs']);
//                         expect(testSet).toEqual(resultSet, 'No. position attributes do not match');
//                     }
//                     if (test.requirements.attributes.hasOwnProperty('vertex_attribs')) {
//                         testSet = new Set(oModel.attribs.query.getAttribNames(EEntType.VERT));
//                         resultSet = new Set(test.requirements.attributes['vertex_attribs']);
//                         expect(testSet).toEqual(resultSet, 'No. vertex attributes do not match');
//                     }
//                     if (test.requirements.attributes.hasOwnProperty('edge_attribs')) {
//                         testSet = new Set(oModel.attribs.query.getAttribNames(EEntType.EDGE));
//                         resultSet = new Set(test.requirements.attributes['edge_attribs']);
//                         expect(testSet).toEqual(resultSet, 'No. edge attributes do not match');
//                     }
//                     if (test.requirements.attributes.hasOwnProperty('wire_attribs')) {
//                         testSet = new Set(oModel.attribs.query.getAttribNames(EEntType.WIRE));
//                         resultSet = new Set(test.requirements.attributes['wire_attribs']);
//                         expect(testSet).toEqual(resultSet, 'No. wire attributes do not match');
//                     }
//                     if (test.requirements.attributes.hasOwnProperty('face_attribs')) {
//                         testSet = new Set(oModel.attribs.query.getAttribNames(EEntType.FACE));
//                         resultSet = new Set(test.requirements.attributes['face_attribs']);
//                         expect(testSet).toEqual(resultSet, 'No. face attributes do not match');
//                     }
//                     if (test.requirements.attributes.hasOwnProperty('point_attribs')) {
//                         testSet = new Set(oModel.attribs.query.getAttribNames(EEntType.POINT));
//                         resultSet = new Set(test.requirements.attributes['point_attribs']);
//                         expect(testSet).toEqual(resultSet, 'No. point attributes do not match');
//                     }
//                     if (test.requirements.attributes.hasOwnProperty('polyline_attribs')) {
//                         testSet = new Set(oModel.attribs.query.getAttribNames(EEntType.PLINE));
//                         resultSet = new Set(test.requirements.attributes['polyline_attribs']);
//                         expect(testSet).toEqual(resultSet, 'No. polyline attributes do not match');
//                     }
//                     if (test.requirements.attributes.hasOwnProperty('polygon_attribs')) {
//                         testSet = new Set(oModel.attribs.query.getAttribNames(EEntType.PGON));
//                         resultSet = new Set(test.requirements.attributes['polygon_attribs']);
//                         expect(testSet).toEqual(resultSet, 'No. polygon attributes do not match');
//                     }
//                     if (test.requirements.attributes.hasOwnProperty('collection_attribs')) {
//                         testSet = new Set(oModel.attribs.query.getAttribNames(EEntType.COLL));
//                         resultSet = new Set(test.requirements.attributes['collection_attribs']);
//                         expect(testSet).toEqual(resultSet, 'No. collection attributes do not match');
//                     }
//                     if (test.requirements.attributes.hasOwnProperty('model_attribs')) {
//                         testSet = new Set(oModel.attribs.query.getAttribNames(EEntType.MOD));
//                         resultSet = new Set(test.requirements.attributes['model_attribs']);
//                         expect(testSet).toEqual(resultSet, 'No. model attributes do not match');
//                     }
//                 }
//                 if (test.returns) {
//                     expect(output.output.value).toBe(test.returns, 'Return values do not match');
//                 }
//                 // expect(_model.__checkModel__(oModel)).toEqual([], '_model.__checkModel__ failed');
//             }
//             done();
//         });

//     }
// });

describe('Execute Model Comparison test', () => {
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

    for (const test of compUrl.test_data) {
        let testName1: any = test.url1.split('/');
        testName1 = testName1[testName1.length - 1];
        let testName2: any = test.url2.split('/');
        testName2 = testName2[testName2.length - 1];

        it('execute and compare two models: ' + testName1 + ' vs ' + testName2, async (done: DoneFn) => {
            const spy = router.navigate as jasmine.Spy;

            const normalize = test.normalize;
            const check_geom_equality = test.check_geom_equality;
            const check_attrib_equality = test.check_attrib_equality;

            console.log(check_geom_equality, check_attrib_equality)

            const oModel1 = _parameterTypes.newFn();
            const oModel2 = _parameterTypes.newFn();
            let loadCheck = await loadURLfixture.componentInstance.loadStartUpURL(`?file=${test.url1}`);
            expect(loadCheck).toBeTruthy(`Unable to load ${testName1}`);
            if (dataService.file.flowchart) {
                await executeFixture.componentInstance.execute(true);
                const output1 = dataService.flowchart.nodes[dataService.flowchart.nodes.length - 1];
                const model1 = JSON.parse(output1.model);
                oModel1.setData(model1);
            }
            loadCheck = await loadURLfixture.componentInstance.loadStartUpURL(`?file=${test.url2}`);
            expect(loadCheck).toBeTruthy(`Unable to load ${testName2}`);
            if (dataService.file.flowchart) {
                await executeFixture.componentInstance.execute(true);
                const output2 = dataService.flowchart.nodes[dataService.flowchart.nodes.length - 1];
                const model2 = JSON.parse(output2.model);
                oModel2.setData(model2);
            }
            const compResult = oModel1.compare(oModel2, normalize, check_geom_equality, check_attrib_equality);
            expect(compResult.percent).toEqual(test.percent, 'The two percentages do not match');
            done();
        });

    }
});

