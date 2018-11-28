(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/appmodule/app.component.html":
/*!**********************************************!*\
  !*** ./src/app/appmodule/app.component.html ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n<div class='container'>\r\n    <as-split direction=\"horizontal\">\r\n        <as-split-area size=\"50\" >\r\n            <div class='container__header'>\r\n\r\n                <!-- top left tab menu  -->\r\n                <div class=\"tab\">\r\n                    <button class='btn-tab' [class.active]='activeView==\"publish\"' (click)='updateView(\"publish\")'>Publish</button>\r\n                    <button class='btn-tab' [class.active]='activeView==\"flowchart\"' (click)='updateView(\"flowchart\")'>Flowchart</button>\r\n                    <!--\r\n                    <button class='btn' [class.active]='false' (click)='updateView(\"editor\")'>Procedures</button>\r\n                    -->\r\n                </div>\r\n\r\n                <!-- hidden components (new file, save file, loaf file) for the dropdown menu-->\r\n                <div style=\"display: none;\">\r\n                    <file-new (create)='updateFile($event)'></file-new>\r\n                    <file-save [file]='file'></file-save>\r\n                    <file-load (loaded)='updateFile($event)'></file-load>        \r\n                </div>\r\n\r\n                <!-- top right dropdown menu -->\r\n                <div class=\"dropmenu\">\r\n                    <!-- execute button -->\r\n                    <div>\r\n                        <execute [flowchart]='flowchart'></execute>\r\n                    </div>\r\n                    <!-- dropdown menu for new file, save file, loaf file-->\r\n                    <div>\r\n                        <button class='btn' mat-icon-button [matMenuTriggerFor]=\"menu\">\r\n                            <mat-icon>more_vert</mat-icon>\r\n                        </button>\r\n                        <mat-menu #menu=\"matMenu\">\r\n                            <button  mat-menu-item onclick=\"document.getElementById('newfile').click();\"\r\n                            title=\"Reset Flowchart to Default\">\r\n                                <mat-icon>rotate_left</mat-icon>\r\n                                <span>Reset</span>\r\n                            </button>\r\n                            <button mat-menu-item onclick=\"document.getElementById('savefile').click();\"\r\n                            title=\"Save Flowchart File to Computer\">\r\n                                <mat-icon>save_alt</mat-icon>\r\n                                <span>Save File</span>\r\n                            </button>\r\n                            <button mat-menu-item onclick=\"document.getElementById('file-input').click();\"\r\n                            title=\"Load Flowchart File from Computer\">\r\n                                <mat-icon>launch</mat-icon>\r\n                                <span>Load File</span>\r\n                            </button>\r\n                        </mat-menu>\r\n                    </div>\r\n                    \r\n                </div>\r\n            </div>\r\n            <!-- viewchild content -->\r\n            <div class='content__panel'>\r\n                <ng-container #vc></ng-container>\r\n            </div>\r\n        </as-split-area>\r\n\r\n        <as-split-area size=\"50\">\r\n            <!-- mViewer panel -->\r\n            <div class='content__viewer' >\r\n                <mviewer [data]='viewerData()'></mviewer>\r\n            </div>\r\n        </as-split-area>\r\n        \r\n\r\n    </as-split>\r\n\r\n</div>\r\n\r\n"

/***/ }),

/***/ "./src/app/appmodule/app.component.scss":
/*!**********************************************!*\
  !*** ./src/app/appmodule/app.component.scss ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".container {\n  position: relative;\n  overflow: auto;\n  height: 100%;\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around; }\n  .container h1, .container h2, .container h3, .container h4, .container h5, .container h6, .container p {\n    margin: 0px;\n    padding: 0px; }\n  .container .container__header {\n    flex: 0 1 auto;\n    min-height: 35px;\n    display: flex;\n    flex-direction: row;\n    justify-content: space-between;\n    padding: 0px 0px 0px 15px;\n    background-color: #ccc;\n    border-bottom: 3px solid #eeeeee;\n    line-height: 35px;\n    font-size: 18px;\n    font-weight: 600;\n    text-align: center;\n    /* tab styling */\n    /* dropdown menu styling */ }\n  .container .container__header .tab {\n      border: 2px;\n      overflow: hidden;\n      background-color: #ccc; }\n  .container .container__header .tab button {\n      display: inline-block;\n      vertical-align: bottom;\n      background-color: inherit;\n      color: #505050;\n      border: none;\n      outline: none;\n      cursor: pointer;\n      padding: 8px 10px;\n      transition: 0.3s;\n      font-size: 14px; }\n  .container .container__header .tab button:hover {\n      color: blue; }\n  .container .container__header .tab button.active {\n      background-color: #ccc;\n      color: #000096;\n      font-weight: 600;\n      border-color: #222 !important; }\n  .container .container__header .dropmenu {\n      display: inline-flex; }\n  .container .container__content {\n    flex-grow: 1;\n    height: 0px;\n    border: 2px solid #3F4651;\n    overflow: auto; }\n  .container .container__footer {\n    text-align: center;\n    font-size: 12px;\n    line-height: 18px;\n    background-color: #3F4651;\n    color: #E7BF00; }\n  .content__panel {\n  background-color: gainsboro;\n  height: 95%;\n  overflow: hidden auto; }\n  .content__viewer {\n  background-color: gainsboro;\n  height: 100%;\n  overflow: auto; }\n  ul.nav {\n  margin: 0px;\n  padding: 0px; }\n  li.link {\n  display: inline;\n  border: 2px solid gray;\n  border-radius: 4px;\n  margin: 5px 5px 0px 0px;\n  padding: 5px;\n  text-transform: uppercase;\n  line-height: 12px;\n  font-weight: 600;\n  cursor: pointer;\n  font-size: 12px; }\n  li.link:hover {\n  background-color: gray;\n  color: white; }\n  button.btn {\n  display: inline-block;\n  vertical-align: middle;\n  margin: 0px 0px 0px 0px;\n  font-size: 12px;\n  line-height: 10px;\n  height: 30px;\n  border: none;\n  border-radius: 4px;\n  background-color: transparent;\n  color: #505050; }\n  button.btn:hover {\n  color: blue; }\n  .active {\n  background-color: #222;\n  color: white;\n  border-color: #222 !important; }\n"

/***/ }),

/***/ "./src/app/appmodule/app.component.ts":
/*!********************************************!*\
  !*** ./src/app/appmodule/app.component.ts ***!
  \********************************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _views__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @views */ "./src/app/views/index.ts");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @services */ "./src/app/core/services/index.ts");
/* harmony import */ var circular_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! circular-json */ "./node_modules/circular-json/build/circular-json.node.js");
/* harmony import */ var circular_json__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(circular_json__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _ngFlowchart_svg_flowchart_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../ngFlowchart-svg/flowchart.component */ "./src/app/ngFlowchart-svg/flowchart.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





// @ts-ignore
console.stdlog = console.log.bind(console);
// @ts-ignore
console.logs = [];
// @ts-ignore
console.log = function () {
    // @ts-ignore
    console.logs.push(Array.from(arguments));
    // @ts-ignore
    console.stdlog.apply(console, arguments);
};
/*

*/
var AppComponent = /** @class */ (function () {
    function AppComponent(dataService, injector, r) {
        this.dataService = dataService;
        this.injector = injector;
        this.r = r;
        this.views = [];
        this.Viewers = {
            "editor": _views__WEBPACK_IMPORTED_MODULE_1__["ViewEditorComponent"],
            "publish": _views__WEBPACK_IMPORTED_MODULE_1__["ViewPublishComponent"],
            "flowchart": _ngFlowchart_svg_flowchart_component__WEBPACK_IMPORTED_MODULE_4__["FlowchartComponent"] // src/ngFlowchart-svg/
        };
        this.file = dataService.file;
        this.flowchart = dataService.flowchart;
    }
    AppComponent.prototype.ngOnInit = function () {
        this.activeView = "flowchart";
        this.updateView("flowchart");
    };
    AppComponent.prototype.updateFile = function (event) {
        this.dataService.file = circular_json__WEBPACK_IMPORTED_MODULE_3__["parse"](event);
        this.file = this.dataService.file;
        this.flowchart = this.dataService.flowchart;
        this.updateValue();
    };
    AppComponent.prototype.createView = function (view) {
        var _this = this;
        var component = this.Viewers[view];
        var factory = this.r.resolveComponentFactory(component);
        var componentRef = factory.create(this.injector);
        if (view == "flowchart") {
            componentRef.instance["data"] = this.flowchart;
            componentRef.instance["switch"].subscribe(function (data) { return _this.updateView(data); });
        }
        else if (view == "editor") {
            componentRef.instance["flowchart"] = this.flowchart;
            componentRef.instance["node"] = this.flowchart.nodes[this.flowchart.meta.selected_nodes[0]];
        }
        else if (view == "publish") {
            componentRef.instance["flowchart"] = this.flowchart;
        }
        return componentRef;
    };
    AppComponent.prototype.updateView = function (view) {
        this.activeView = view;
        if (this.views[view] == undefined) {
            this.views[view] = this.createView(view);
        }
        else
            this.updateValue();
        this.vc.detach();
        this.vc.insert(this.views[view].hostView);
    };
    AppComponent.prototype.updateValue = function () {
        for (var view in this.Viewers) {
            if (!this.views[view])
                continue;
            var componentRef = this.views[view];
            if (view == "flowchart") {
                componentRef.instance["data"] = this.flowchart;
            }
            else if (view == "editor") {
                componentRef.instance["flowchart"] = this.flowchart;
                componentRef.instance["node"] = this.flowchart.nodes[this.flowchart.meta.selected_nodes[0]];
            }
            else if (view == "publish") {
                componentRef.instance["flowchart"] = this.flowchart;
            }
        }
    };
    AppComponent.prototype.viewerData = function () {
        var node = this.flowchart.nodes[this.flowchart.meta.selected_nodes[0]];
        if (!node)
            return '';
        if (node.type == 'output')
            return node.input.value;
        return node.output.value;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('vc', { read: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"] }),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"])
    ], AppComponent.prototype, "vc", void 0);
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/appmodule/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.scss */ "./src/app/appmodule/app.component.scss")]
        }),
        __metadata("design:paramtypes", [_services__WEBPACK_IMPORTED_MODULE_2__["DataService"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ComponentFactoryResolver"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/appmodule/app.module.ts":
/*!*****************************************!*\
  !*** ./src/app/appmodule/app.module.ts ***!
  \*****************************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app.component */ "./src/app/appmodule/app.component.ts");
/* harmony import */ var _views__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @views */ "./src/app/views/index.ts");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @shared/shared.module */ "./src/app/shared/shared.module.ts");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @services */ "./src/app/core/services/index.ts");
/* harmony import */ var _ngFlowchart_svg_flowchart_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../ngFlowchart-svg/flowchart.component */ "./src/app/ngFlowchart-svg/flowchart.component.ts");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




//import { AppRoutingModule } from './app-routing.module';









var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"],
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_2__["BrowserAnimationsModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"],
                //FormsModule,
                //AppRoutingModule,
                //CoreModule,
                _views__WEBPACK_IMPORTED_MODULE_5__["ViewEditorModule"],
                _views__WEBPACK_IMPORTED_MODULE_5__["ViewPublishModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_6__["SharedModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_9__["MatMenuModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_9__["MatIconModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_9__["MatButtonModule"],
            ],
            entryComponents: [
                _views__WEBPACK_IMPORTED_MODULE_5__["ViewEditorComponent"],
                _views__WEBPACK_IMPORTED_MODULE_5__["ViewPublishComponent"],
                _ngFlowchart_svg_flowchart_component__WEBPACK_IMPORTED_MODULE_8__["FlowchartComponent"],
            ],
            providers: [_services__WEBPACK_IMPORTED_MODULE_7__["DataService"]],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"]]
        }),
        __metadata("design:paramtypes", [])
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/core/modules/Input.ts":
/*!***************************************!*\
  !*** ./src/app/core/modules/Input.ts ***!
  \***************************************/
/*! exports provided: declare_constant */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "declare_constant", function() { return declare_constant; });
/**
 * Declare a new constant for the input node
 * @summary Declare new constant
 *
 * @param {JSON} __constList__  List of constants to be added.
 * @param {string} const_name  Name of the constant.
 * @param {any} __input__  Value of the constant.
 *
 * @returns Void
 */
function declare_constant(__constList__, const_name, __input__) {
    __constList__[const_name] = __input__;
}


/***/ }),

/***/ "./src/app/core/modules/Output.ts":
/*!****************************************!*\
  !*** ./src/app/core/modules/Output.ts ***!
  \****************************************/
/*! exports provided: return_value */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "return_value", function() { return return_value; });
/**
 * Return certain value from the model for the flowchart's end node
 * @summary Return a specific value
 * @param {any[]} __model__  Model of the node.
 * @param {number} index  Index of the value to be returned.
 * @returns {any} Value
 */
function return_value(__model__, index) {
    if (index > __model__.length)
        return __model__;
    return __model__[index].value;
}


/***/ }),

/***/ "./src/app/core/modules/_parameterTypes.ts":
/*!*************************************************!*\
  !*** ./src/app/core/modules/_parameterTypes.ts ***!
  \*************************************************/
/*! exports provided: _parameterTypes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_parameterTypes", function() { return _parameterTypes; });
var _parameterTypes = {
    constList: "__constList__",
    model: "__model__",
    input: "__input__",
    new: "__new__",
    merge: "__megre__",
    preprocess: "__preprocess__",
    prostprocess: "__postprocess__"
};


/***/ }),

/***/ "./src/app/core/modules/functions.ts":
/*!*******************************************!*\
  !*** ./src/app/core/modules/functions.ts ***!
  \*******************************************/
/*! exports provided: __new__, __preprocess__, __postprocess__, __merge__, addData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__new__", function() { return __new__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__preprocess__", function() { return __preprocess__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__postprocess__", function() { return __postprocess__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__merge__", function() { return __merge__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addData", function() { return addData; });
/**
 * Functions for working with gs-json models.
 * Models are datastructures that contain geometric entities with attributes.
 */
//  ===============================================================================================================
//  Enums, Types, and Interfaces
//  ===============================================================================================================
//enums
var data_types;
(function (data_types) {
    data_types["Int"] = "Int";
    data_types["Float"] = "Float";
    data_types["String"] = "String";
})(data_types || (data_types = {}));
//  ===============================================================================================================
//  Functions used by Mobius
//  ===============================================================================================================
/**
 * Creates a new empty model.
 *
 * @returns New model empty.
 */
function __new__() {
    return {
        topology: {
            triangles: [],
            vertices: [],
            edges: [],
            wires: [],
            faces: [],
            collections: []
        },
        attributes: {
            positions: {
                name: "coordinates",
                data_type: data_types.Float,
                data_length: 3,
                keys: [],
                values: []
            },
            vertices: [],
            edges: [],
            wires: [],
            faces: [],
            collections: []
        }
    };
}
/**
 * A function to preprocess the model, before it enters the node.
 * In cases where there is more than one model connected to a node,
 * the preprocess function will be called before the merge function.
 *
 * @param model The model to preprocess.
 */
function __preprocess__(__model__) {
    // TODO
}
/**
 * A function to postprocess the model, after it enters the node.
 *
 * @param model The model to postprocess.
 */
function __postprocess__(__model__) {
    // TODO
    // Remove all the undefined values for the arrays
}
/**
 * Merges the second model into the first model. The geometry, attribues, and groups are all merged.
 * If the models contain contain groups with the same names, then the groups will be merged.
 *
 * @param model1 The model to merge into.
 * @param model2 The model to merge from    .
 */
function __merge__(model1, model2) {
    // Get the lengths of data arrays in model1, required later
    var num_positions = model2.attributes.positions.keys.length;
    var num_triangles = model2.topology.triangles.length;
    var num_vertices = model2.topology.vertices.length;
    var num_edges = model2.topology.edges.length;
    var num_wires = model2.topology.wires.length;
    var num_faces = model2.topology.faces.length;
    var num_collections = model2.topology.collections.length;
    // Add triangles from model2 to model1
    var new_triangles = model2.topology.triangles.map(function (t) { return t.map(function (p) { return p + num_positions; }); });
    model1.topology.triangles = model1.topology.triangles.concat(new_triangles);
    // Add vertices from model2 to model1
    var new_vertices = model2.topology.vertices.map(function (p) { return p + num_positions; });
    model1.topology.vertices = model1.topology.vertices.concat(new_vertices);
    // Add edges from model2 to model1
    var new_edges = model2.topology.edges.map(function (e) { return e.map(function (v) { return v + num_vertices; }); });
    model1.topology.edges = model1.topology.edges.concat(new_edges);
    // Add wires from model2 to model1
    var new_wires = model2.topology.wires.map(function (w) { return w.map(function (e) { return e + num_edges; }); });
    model1.topology.wires = model1.topology.wires.concat(new_wires);
    // Add faces from model2 to model1
    var new_faces = model2.topology.faces.map(function (f) { return [
        f[0].map(function (w) { return w + num_wires; }),
        f[1].map(function (t) { return t + num_triangles; })
    ]; });
    model1.topology.faces = model1.topology.faces.concat(new_faces);
    // Add collections from model2 to model1
    var new_collections = model2.topology.collections.map(function (c) { return [
        c[0] + num_collections,
        c[1].map(function (v) { return v + num_vertices; }),
        c[2].map(function (w) { return w + num_wires; }),
        c[3].map(function (f) { return f + num_faces; })
    ]; });
    model1.topology.collections = model1.topology.collections.concat(new_collections);
    // Add  attributes from model2 to model1
    _addKeysValues(model1.attributes.positions, model2.attributes.positions);
    _addAttribs(model1.attributes.vertices, model2.attributes.vertices, num_vertices);
    _addAttribs(model1.attributes.edges, model2.attributes.edges, num_edges);
    _addAttribs(model1.attributes.wires, model2.attributes.wires, num_wires);
    _addAttribs(model1.attributes.faces, model2.attributes.faces, num_faces);
    _addAttribs(model1.attributes.collections, model2.attributes.collections, num_collections);
    // No return
}
/*
 * Helper function that adds attributes
 */
function _addAttribs(attribs1, attribs2, size1) {
    var attribs_map = new Map();
    attribs1.forEach(function (attrib, idx) {
        attribs_map[attrib.name + attrib.data_type + attrib.data_length] = attrib;
    });
    attribs2.forEach(function (attrib2) {
        var attrib1 = attribs_map[attrib2.name + attrib2.data_type + attrib2.data_length];
        if (attrib1 === undefined) {
            attrib2.values = Array(size1).fill(undefined).concat(attrib2.values);
            attribs1.push(attrib2);
        }
        else {
            _addKeysValues(attrib1, attrib2);
        }
    });
}
/*
 * Helper function that adds values, updates keys.
 * The values are all assumed to be unique.
 * Values are added from the values to array to the values1 array is the are unique.
 * New keys are added to the keys1 array.
 */
function _addKeysValues(kv1, kv2) {
    var values_map = new Map();
    kv2.values.forEach(function (val, idx) {
        var idx_new = kv1.values.indexOf(val);
        if (idx_new === -1) {
            idx_new = kv1.values.push(val) - 1;
        }
        values_map[idx] = idx_new;
    });
    kv2.keys.forEach(function (idx) {
        kv1.keys.push(values_map[idx]);
    });
}
//  ===============================================================================================================
//  End user functions
//  ===============================================================================================================
/**
 * Creates a new model and populates the model with data.
 *
 * @param model_data The model data in gs-json format.
 * @returns New model if successful, null if unsuccessful or on error.
 */
function addData(__model__, model) {
    __model__ = __merge__(__model__, model);
}


/***/ }),

/***/ "./src/app/core/modules/index.ts":
/*!***************************************!*\
  !*** ./src/app/core/modules/index.ts ***!
  \***************************************/
/*! exports provided: functions, Input, Output, _parameterTypes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./functions */ "./src/app/core/modules/functions.ts");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "functions", function() { return _functions__WEBPACK_IMPORTED_MODULE_0__; });
/* harmony import */ var _Input__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Input */ "./src/app/core/modules/Input.ts");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "Input", function() { return _Input__WEBPACK_IMPORTED_MODULE_1__; });
/* harmony import */ var _Output__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Output */ "./src/app/core/modules/Output.ts");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "Output", function() { return _Output__WEBPACK_IMPORTED_MODULE_2__; });
/* harmony import */ var _parameterTypes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_parameterTypes */ "./src/app/core/modules/_parameterTypes.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "_parameterTypes", function() { return _parameterTypes__WEBPACK_IMPORTED_MODULE_3__["_parameterTypes"]; });







//./old/point

//./old/ray./old/query./old/string./old/topo


/***/ }),

/***/ "./src/app/core/services/data.service.ts":
/*!***********************************************!*\
  !*** ./src/app/core/services/data.service.ts ***!
  \***********************************************/
/*! exports provided: DataService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataService", function() { return DataService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _models_flowchart__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @models/flowchart */ "./src/app/shared/models/flowchart/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var DataService = /** @class */ (function () {
    function DataService() {
    }
    DataService_1 = DataService;
    Object.defineProperty(DataService.prototype, "file", {
        get: function () { return DataService_1._data; },
        set: function (data) {
            DataService_1._data = {
                name: data.name,
                author: data.author,
                flowchart: data.flowchart,
                last_updated: data.last_updated,
                version: data.version
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataService.prototype, "flowchart", {
        get: function () { return DataService_1._data.flowchart; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataService.prototype, "node", {
        get: function () { return DataService_1._data.flowchart.nodes[DataService_1._selected]; },
        enumerable: true,
        configurable: true
    });
    ;
    var DataService_1;
    DataService._data = {
        name: "default_file",
        author: "new_user",
        last_updated: new Date(),
        version: 1,
        flowchart: _models_flowchart__WEBPACK_IMPORTED_MODULE_1__["FlowchartUtils"].newflowchart()
    };
    DataService._selected = 0;
    DataService = DataService_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])()
    ], DataService);
    return DataService;
}());



/***/ }),

/***/ "./src/app/core/services/index.ts":
/*!****************************************!*\
  !*** ./src/app/core/services/index.ts ***!
  \****************************************/
/*! exports provided: DataService, ViewerService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _data_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data.service */ "./src/app/core/services/data.service.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DataService", function() { return _data_service__WEBPACK_IMPORTED_MODULE_0__["DataService"]; });

/* harmony import */ var _viewer_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./viewer.service */ "./src/app/core/services/viewer.service.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ViewerService", function() { return _viewer_service__WEBPACK_IMPORTED_MODULE_1__["ViewerService"]; });





/***/ }),

/***/ "./src/app/core/services/viewer.service.ts":
/*!*************************************************!*\
  !*** ./src/app/core/services/viewer.service.ts ***!
  \*************************************************/
/*! exports provided: ViewerService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewerService", function() { return ViewerService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var ViewerService = /** @class */ (function () {
    function ViewerService() {
        this.contextReceivedSource = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        this.contextReceived$ = this.contextReceivedSource.asObservable();
    }
    ViewerService.prototype.receiveContext = function (componentFactoryResolver, injector) {
        this.contextReceivedSource.next({ resolver: componentFactoryResolver, injector: injector });
    };
    ViewerService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])()
    ], ViewerService);
    return ViewerService;
}());



/***/ }),

/***/ "./src/app/mViewer/mobius-viewer.component.html":
/*!******************************************************!*\
  !*** ./src/app/mViewer/mobius-viewer.component.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class='viewer-container'>  \r\n    <div class='container__header'>\r\n        <div class=\"tab\">\r\n            <button class='btn-tab' \r\n            [class.active]='view.name == activeView.name'\r\n            *ngFor='let view of Viewers;' \r\n            (click)='updateView(view)'>\r\n            {{view.name}}\r\n            </button>\r\n        </div>\r\n    </div>\r\n    <div class='content__panel'>\r\n        <ng-container #vc></ng-container>\r\n    </div>\r\n</div>"

/***/ }),

/***/ "./src/app/mViewer/mobius-viewer.component.scss":
/*!******************************************************!*\
  !*** ./src/app/mViewer/mobius-viewer.component.scss ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".viewer-container {\n  display: block;\n  height: 100%;\n  overflow: hidden; }\n\n.container__header {\n  flex: 0 1 auto;\n  height: 35px;\n  width: 100%;\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  padding: 0px 0px 0px 15px;\n  background-color: #ccc;\n  border-bottom: 3px solid #eeeeee;\n  line-height: 35px;\n  font-size: 18px;\n  font-weight: 600;\n  text-align: center; }\n\n.content__panel {\n  background-color: gainsboro;\n  width: 97%;\n  height: 93%;\n  overflow: auto; }\n\nbutton.btn {\n  margin: 10px;\n  font-size: 14px;\n  line-height: 18px;\n  border: 2px solid gray;\n  border-radius: 4px;\n  padding: 2px 10px;\n  background-color: transparent;\n  color: #505050; }\n\nbutton.btn:hover {\n  color: blue; }\n\n/* tab styling */\n\n.tab {\n  border: 2px;\n  overflow: hidden;\n  background-color: #ccc; }\n\n.tab button {\n  display: inline-block;\n  vertical-align: bottom;\n  background-color: inherit;\n  color: #505050;\n  border: none;\n  outline: none;\n  cursor: pointer;\n  padding: 8px 10px;\n  transition: 0.3s;\n  font-size: 14px; }\n\n.tab button:hover {\n  color: blue; }\n\n.tab button.active {\n  background-color: #ccc;\n  color: #000096;\n  font-weight: 600;\n  border-color: #222 !important; }\n"

/***/ }),

/***/ "./src/app/mViewer/mobius-viewer.component.ts":
/*!****************************************************!*\
  !*** ./src/app/mViewer/mobius-viewer.component.ts ***!
  \****************************************************/
/*! exports provided: ViewerContainerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewerContainerComponent", function() { return ViewerContainerComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _viewers_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./viewers.config */ "./src/app/mViewer/viewers.config.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ViewerContainerComponent = /** @class */ (function () {
    function ViewerContainerComponent(injector, r) {
        this.injector = injector;
        this.r = r;
        this.views = [];
        this.Viewers = _viewers_config__WEBPACK_IMPORTED_MODULE_1__["Viewers"];
    }
    ViewerContainerComponent.prototype.ngOnInit = function () {
        this.activeView = this.Viewers[0];
        this.updateView(this.activeView);
    };
    ViewerContainerComponent.prototype.ngOnDestroy = function () {
        console.log('onDestroy');
        for (var _i = 0, _a = this.views; _i < _a.length; _i++) {
            var view = _a[_i];
            view.destroy();
        }
    };
    ViewerContainerComponent.prototype.ngOnChanges = function () {
        this.updateValue();
    };
    ViewerContainerComponent.prototype.createView = function (view) {
        var component = view.component;
        var factory = this.r.resolveComponentFactory(component);
        var componentRef = factory.create(this.injector);
        if (view.name != 'Console') {
            componentRef.instance["data"] = this.data;
        }
        return componentRef;
    };
    ViewerContainerComponent.prototype.updateView = function (view) {
        this.activeView = view;
        if (this.views[this.activeView.name] == undefined) {
            this.views[this.activeView.name] = this.createView(view);
        }
        else {
            this.updateValue();
        }
        this.vc.detach();
        this.vc.insert(this.views[this.activeView.name].hostView);
    };
    ViewerContainerComponent.prototype.updateValue = function () {
        try {
            var componentRef = this.views[this.activeView.name];
            if (this.activeView.name != 'Console') {
                componentRef.instance["data"] = this.data;
            }
        }
        catch (ex) {
            //console.log(`Active View not defined`);
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('vc', { read: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"] }),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"])
    ], ViewerContainerComponent.prototype, "vc", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], ViewerContainerComponent.prototype, "data", void 0);
    ViewerContainerComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'mviewer',
            template: __webpack_require__(/*! ./mobius-viewer.component.html */ "./src/app/mViewer/mobius-viewer.component.html"),
            styles: [__webpack_require__(/*! ./mobius-viewer.component.scss */ "./src/app/mViewer/mobius-viewer.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ComponentFactoryResolver"]])
    ], ViewerContainerComponent);
    return ViewerContainerComponent;
}());



/***/ }),

/***/ "./src/app/mViewer/mobius-viewer.module.ts":
/*!*************************************************!*\
  !*** ./src/app/mViewer/mobius-viewer.module.ts ***!
  \*************************************************/
/*! exports provided: MobiusViewerModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MobiusViewerModule", function() { return MobiusViewerModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _mobius_viewer_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./mobius-viewer.component */ "./src/app/mViewer/mobius-viewer.component.ts");
/* harmony import */ var _viewers_config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./viewers.config */ "./src/app/mViewer/viewers.config.ts");
/* harmony import */ var _viewers_gs_viewer_gs_viewer_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./viewers/gs-viewer/gs-viewer.module */ "./src/app/mViewer/viewers/gs-viewer/gs-viewer.module.ts");
/* harmony import */ var _viewers_mobius_cesium_mobius_cesium_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./viewers/mobius-cesium/mobius-cesium.module */ "./src/app/mViewer/viewers/mobius-cesium/mobius-cesium.module.ts");
/* harmony import */ var _viewers__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./viewers */ "./src/app/mViewer/viewers/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









//import { VisualiseComponent } from "./viewers/mobius-cesium/setting/visualise.component";
//import { AttributesComponent } from "./viewers/mobius-cesium/setting/attributes.copmponent";
var MobiusViewerModule = /** @class */ (function () {
    function MobiusViewerModule() {
    }
    MobiusViewerModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            declarations: [
                _mobius_viewer_component__WEBPACK_IMPORTED_MODULE_3__["ViewerContainerComponent"],
                _viewers__WEBPACK_IMPORTED_MODULE_7__["TextViewerComponent"],
                _viewers__WEBPACK_IMPORTED_MODULE_7__["ConsoleViewerComponent"],
            ],
            exports: [_mobius_viewer_component__WEBPACK_IMPORTED_MODULE_3__["ViewerContainerComponent"]],
            imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _viewers_gs_viewer_gs_viewer_module__WEBPACK_IMPORTED_MODULE_5__["GSViewer"],
                _viewers_mobius_cesium_mobius_cesium_module__WEBPACK_IMPORTED_MODULE_6__["MobiusCesium"],
            ],
            entryComponents: _viewers_config__WEBPACK_IMPORTED_MODULE_4__["VIEWER_ARR"].slice(),
            providers: []
        }),
        __metadata("design:paramtypes", [])
    ], MobiusViewerModule);
    return MobiusViewerModule;
}());



/***/ }),

/***/ "./src/app/mViewer/viewers.config.ts":
/*!*******************************************!*\
  !*** ./src/app/mViewer/viewers.config.ts ***!
  \*******************************************/
/*! exports provided: VIEWER_ARR, Viewers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VIEWER_ARR", function() { return VIEWER_ARR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Viewers", function() { return Viewers; });
/* harmony import */ var _viewers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./viewers */ "./src/app/mViewer/viewers/index.ts");
/* harmony import */ var _viewers_gs_viewer_gs_viewer_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./viewers/gs-viewer/gs-viewer.component */ "./src/app/mViewer/viewers/gs-viewer/gs-viewer.component.ts");
/* harmony import */ var _viewers_console_viewer_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./viewers/console-viewer.component */ "./src/app/mViewer/viewers/console-viewer.component.ts");
// Step-1: Add new ViewerComponet here



//import { procedureHelpComponent } from './viewers/procedure-help.component';
var VIEWER_ARR = [
    _viewers__WEBPACK_IMPORTED_MODULE_0__["TextViewerComponent"],
    _viewers_console_viewer_component__WEBPACK_IMPORTED_MODULE_2__["ConsoleViewerComponent"],
    //procedureHelpComponent,
    //JSONViewerComponent, 
    //ThreeViewerComponent
    // Step-2: Add Component here
    //CesiumViewerComponent,
    _viewers_gs_viewer_gs_viewer_component__WEBPACK_IMPORTED_MODULE_1__["GSViewerComponent"],
];
var Viewers = [
    { name: 'Summary', icon: undefined, component: _viewers__WEBPACK_IMPORTED_MODULE_0__["TextViewerComponent"] },
    { name: 'gs-viewer', icon: undefined, component: _viewers_gs_viewer_gs_viewer_component__WEBPACK_IMPORTED_MODULE_1__["GSViewerComponent"] },
    { name: 'Console', icon: undefined, component: _viewers_console_viewer_component__WEBPACK_IMPORTED_MODULE_2__["ConsoleViewerComponent"] },
];


/***/ }),

/***/ "./src/app/mViewer/viewers/console-viewer.component.ts":
/*!*************************************************************!*\
  !*** ./src/app/mViewer/viewers/console-viewer.component.ts ***!
  \*************************************************************/
/*! exports provided: ConsoleViewerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConsoleViewerComponent", function() { return ConsoleViewerComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ConsoleViewerComponent = /** @class */ (function () {
    function ConsoleViewerComponent() {
    }
    ConsoleViewerComponent.prototype.ngOnInit = function () {
        // @ts-ignore
        this.text = console.logs.join('\n---------------------------------------------------------\n');
    };
    ConsoleViewerComponent.prototype.ngDoCheck = function () {
        // @ts-ignore
        this.text = console.logs.join('\n---------------------------------------------------------\n');
    };
    ConsoleViewerComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'console-viewer',
            template: "<textarea>{{ text || \"\" }}</textarea>",
            styles: ["\n  :host{\n    height: 100%;\n    width: 100%;\n  }\n  textarea{\n    height: 99%;\n    width: 99%;\n    overflow: auto;\n    resize: none;\n    background-color: rgb(220,220,220);\n    text-color: rgb(80,80,80);\n    border: none;\n  }"]
        }),
        __metadata("design:paramtypes", [])
    ], ConsoleViewerComponent);
    return ConsoleViewerComponent;
}());



/***/ }),

/***/ "./src/app/mViewer/viewers/gs-viewer/data/DataSubscriber.ts":
/*!******************************************************************!*\
  !*** ./src/app/mViewer/viewers/gs-viewer/data/DataSubscriber.ts ***!
  \******************************************************************/
/*! exports provided: DataSubscriber */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataSubscriber", function() { return DataSubscriber; });
/* harmony import */ var _data_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data.service */ "./src/app/mViewer/viewers/gs-viewer/data/data.service.ts");

var DataSubscriber = /** @class */ (function () {
    function DataSubscriber(injector) {
        var _this = this;
        this.dataService = injector.get(_data_service__WEBPACK_IMPORTED_MODULE_0__["DataService"]);
        this._subscription = this.dataService.getMessage().subscribe(function (message) {
            _this._message = message;
            _this.notify(message.text);
        });
    }
    DataSubscriber.prototype.notify = function (message) {
        console.warn("Notify function not Implemented");
    };
    return DataSubscriber;
}());



/***/ }),

/***/ "./src/app/mViewer/viewers/gs-viewer/data/data.service.ts":
/*!****************************************************************!*\
  !*** ./src/app/mViewer/viewers/gs-viewer/data/data.service.ts ***!
  \****************************************************************/
/*! exports provided: DataService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataService", function() { return DataService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs_Subject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/Subject */ "./node_modules/rxjs-compat/_esm5/Subject.js");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var gs_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! gs-json */ "./node_modules/gs-json/dist2015/index.js");
/* harmony import */ var gs_json__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(gs_json__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var three_orbit_controls__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! three-orbit-controls */ "./node_modules/three-orbit-controls/index.js");
/* harmony import */ var three_orbit_controls__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(three_orbit_controls__WEBPACK_IMPORTED_MODULE_4__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var DataService = /** @class */ (function () {
    function DataService() {
        // intializations
        // this only runs once
        this.selecting = [];
        this.grid = true;
        this.scenechildren = [];
        this.textlabels = [];
        this.point = true;
        this.click = false;
        this.checkpointid = false;
        this.checkedgeid = false;
        this.imVisible = false;
        // ---- 
        // Subscription Handling
        // 
        this.subject = new rxjs_Subject__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        var default_width = 1510, default_height = 720;
        // scene
        var scene = new three__WEBPACK_IMPORTED_MODULE_2__["Scene"]();
        scene.background = new three__WEBPACK_IMPORTED_MODULE_2__["Color"](0xcccccc);
        // renderer
        var renderer = new three__WEBPACK_IMPORTED_MODULE_2__["WebGLRenderer"]({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        // camera settings
        var aspect_ratio = this._width / this._height;
        var camera = new three__WEBPACK_IMPORTED_MODULE_2__["PerspectiveCamera"](50, aspect_ratio, 0.01, 1000); //0.0001, 100000000 );
        camera.position.y = 10;
        camera.up.set(0, 0, 1);
        camera.lookAt(scene.position);
        camera.updateProjectionMatrix();
        // orbit controls
        var _OC = three_orbit_controls__WEBPACK_IMPORTED_MODULE_4__(three__WEBPACK_IMPORTED_MODULE_2__);
        var controls = new _OC(camera, renderer.domElement);
        controls.enableKeys = false;
        // default directional lighting
        var directional_light = new three__WEBPACK_IMPORTED_MODULE_2__["DirectionalLight"](0xffffff, 0.5);
        directional_light.castShadow = false;
        directional_light.position.copy(camera.position);
        controls.addEventListener('change', function () {
            directional_light.position.copy(camera.position);
        });
        directional_light.target.position.set(0, 0, 0);
        scene.add(directional_light);
        // default ambient lighting
        var default_hue = 0;
        var default_saturation = 0.01;
        var default_lightness = 0.47;
        var hemi_light = new three__WEBPACK_IMPORTED_MODULE_2__["HemisphereLight"](0xffffff, 0.5);
        hemi_light.color.setHSL(default_hue, default_saturation, default_lightness);
        scene.add(hemi_light);
        this._scene = scene;
        this._renderer = renderer;
        this._camera = camera;
        this._orbitControls = controls;
        // add it to alight - what does alight do?
        this._alight = hemi_light;
        //this._alight.push(hemi_light);
        this.checkname = [];
        this.pointname = [];
    }
    DataService.prototype.sendMessage = function (message) {
        this.subject.next({ text: message });
    };
    DataService.prototype.clearMessage = function () {
        this.subject.next();
    };
    DataService.prototype.getMessage = function () {
        return this.subject.asObservable();
    };
    //
    //  Getter and Setting for gs-model
    //
    DataService.prototype.getGsModel = function () {
        return this._gsModel;
    };
    DataService.prototype.setGsModel = function (model) {
        this._gsModel = model;
        if (this._gsModel !== undefined) {
            this.generateSceneMaps();
        }
        else {
            // remove all children from the scene
            for (var i = 0; i < this._scene.children.length; i++) {
                if (this._scene.children[i].type === "Scene") {
                    this._scene.remove(this._scene.children[i]);
                }
            }
        }
        this.sendMessage("model_update");
    };
    DataService.prototype.generateSceneMaps = function () {
        var scene_and_maps = gs_json__WEBPACK_IMPORTED_MODULE_3__["genThreeOptModelAndMaps"](this._gsModel);
        this.scenemaps = scene_and_maps;
    };
    DataService.prototype.getscememaps = function () {
        return this.scenemaps;
    };
    DataService.prototype.getScene = function (width, height) {
        if (width && height) {
            this._width = width;
            this._height = height;
        }
        return this._scene;
    };
    DataService.prototype.getRenderer = function () {
        this._camera.aspect = this._width / this._height;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(this._width, this._height);
        return this._renderer;
    };
    DataService.prototype.getCamera = function () {
        return this._camera;
    };
    DataService.prototype.getControls = function () {
        return this._orbitControls;
    };
    //
    //
    //
    DataService.prototype.getalight = function () {
        return this._alight;
    };
    DataService.prototype.addraycaster = function (raycaster) {
        this.raycaster = raycaster;
    };
    DataService.prototype.getraycaster = function () {
        return this.raycaster;
    };
    DataService.prototype.gethue = function (_hue) {
        this.hue = _hue;
    };
    DataService.prototype.getsaturation = function (_saturation) {
        this.saturation = _saturation;
    };
    DataService.prototype.getlightness = function (_lightness) {
        this.lightness = _lightness;
    };
    DataService.prototype.getpointsize = function (pointszie) {
        this.pointsize = pointszie;
    };
    DataService.prototype.getmaterialpoint = function (materialpoint) {
        this.materialpoint = materialpoint;
    };
    DataService.prototype.getradius = function (point) {
        this.pointradius = point;
    };
    DataService.prototype.getcenterx = function (centerx) {
        this.centerx = centerx;
    };
    DataService.prototype.getcentery = function (centery) {
        this.centery = centery;
    };
    DataService.prototype.getcenterz = function (centerz) {
        this.centerz = centerz;
    };
    DataService.prototype.getcentersize = function (centersize) {
        this.centersize = centersize;
    };
    DataService.prototype.addGeom = function (Geom) {
        this._Geom = Geom;
    };
    DataService.prototype.getGeom = function () {
        return this._Geom;
    };
    DataService.prototype.addscenechange = function (scenechange) {
        this.scenechange = scenechange;
    };
    DataService.prototype.getscenechange = function () {
        return this.scenechange;
    };
    DataService.prototype.addINTERSECTEDColor = function (INTERSECTEDColor) {
        if (this.INTERSECTEDColor == null) {
            this.INTERSECTEDColor = INTERSECTEDColor;
        }
    };
    DataService.prototype.getINTERSECTEDColor = function () {
        return this.INTERSECTEDColor;
    };
    DataService.prototype.addselecting = function (selecting) {
        if (selecting[selecting.length - 1] == undefined) {
            this.selecting = [];
        }
        this.sendMessage();
    };
    DataService.prototype.pushselecting = function (selecting) {
        this.selecting.push(selecting);
        this.sendMessage();
    };
    DataService.prototype.spliceselecting = function (index, number) {
        this.selecting.splice(index, number);
        this.sendMessage();
    };
    DataService.prototype.getselecting = function () {
        return this.selecting;
    };
    DataService.prototype.addclickshow = function (clickshow) {
        this.clickshow = clickshow;
    };
    DataService.prototype.addattrvertix = function (attributevertix) {
        this.attributevertix = attributevertix;
    };
    DataService.prototype.getattrvertix = function () {
        return this.attributevertix;
    };
    DataService.prototype.addgrid = function (grid) {
        this.grid = grid;
    };
    DataService.prototype.addaxis = function (axis) {
        this.axis = axis;
    };
    DataService.prototype.addshadow = function (shadow) {
        this.shadow = shadow;
    };
    DataService.prototype.addframe = function (frame) {
        this.frame = frame;
    };
    DataService.prototype.addpoint = function (point) {
        this.point = point;
    };
    DataService.prototype.getSelectingIndex = function (uuid) {
        for (var i = 0; i < this.selecting.length; i++) {
            if (this.selecting[i].uuid == uuid) {
                return i;
            }
        }
        return -1;
    };
    DataService.prototype.addscenechild = function (scenechildren) {
        this.scenechildren = scenechildren;
        this.sendMessage();
    };
    DataService.prototype.getscenechild = function () {
        this.sendMessage();
        return this.scenechildren;
    };
    DataService.prototype.addlabel = function (label) {
        this.label = label;
        this.sendMessage();
    };
    DataService.prototype.getlabel = function () {
        this.sendMessage();
        return this.label;
    };
    DataService.prototype.addgetpoints = function (getpoints) {
        this.getpoints = getpoints;
    };
    DataService.prototype.addpointname = function (pointname) {
        this.pointname = pointname;
    };
    DataService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [])
    ], DataService);
    return DataService;
}());



/***/ }),

/***/ "./src/app/mViewer/viewers/gs-viewer/gs-viewer.component.html":
/*!********************************************************************!*\
  !*** ./src/app/mViewer/viewers/gs-viewer/gs-viewer.component.html ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"appdiv\" (mousedown)=\"leaflet()\">\r\n\t<as-split direction=\"vertical\">\r\n\t\t<as-split-area [size]=\"90\" id=\"splitcontainer\">\r\n\t\t  <div style=\"height: 100%\">\r\n\t\t    <as-split direction=\"horizontal\">\r\n\t\t      <as-split-area [size]=\"0.5\" id=\"splitgroups\" style=\"overflow-x:hidden;overflow-y: auto;\">\r\n\t\t        <app-groups></app-groups>\r\n\t\t      </as-split-area>\r\n\t\t      <as-split-area [size]=\"99.5\" id=\"splitviewer\">\r\n\t\t        <!-- <app-viewer *ngIf=\"imVisible===false\"></app-viewer>\r\n\t\t        <app-map *ngIf=\"imVisible===true\"></app-map> -->\r\n\t\t        <app-viewer></app-viewer>\r\n\t\t      </as-split-area>\r\n\t\t    </as-split>\r\n\t\t  </div>\r\n\t\t</as-split-area>\r\n\t\t<as-split-area [size]=\"10\" id=\"splittoolwindow\">\r\n\t\t\t<app-toolwindow></app-toolwindow>\r\n\t\t</as-split-area>\r\n\t</as-split>\r\n</div>"

/***/ }),

/***/ "./src/app/mViewer/viewers/gs-viewer/gs-viewer.component.scss":
/*!********************************************************************!*\
  !*** ./src/app/mViewer/viewers/gs-viewer/gs-viewer.component.scss ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@import url(\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css\");\n@font-face {\n  font-family: \"FontAwesome\"; }\n.font-awesome-hand {\n  font-family: FontAwesome; }\n.font-awesome-hand::after {\n  font-family: FontAwesome; }\nhtml, body {\n  font-family: 'Open Sans', sans-serif;\n  text-align: justify;\n  margin: 0px;\n  padding: 0px; }\n#appdiv {\n  height: 95%;\n  background-color: white; }\n#splittoolwindow {\n  overflow: scroll !important; }\na {\n  text-decoration: none;\n  color: #fff;\n  text-transform: uppercase; }\n.toolbar {\n  background-color: #333; }\n.toolbar ul {\n  list-style: none;\n  overflow: hidden;\n  margin-bottom: 0px;\n  z-index: 1; }\n.toolbar div > ul > li {\n  display: inline-block;\n  float: left; }\n.toolbar div > ul > li:hover {\n  background-color: #fff; }\n.toolbar div > ul > li:hover a {\n  color: #333; }\n.toolbar div > ul > li > a {\n  font-size: 12px;\n  line-height: 20px;\n  display: block;\n  float: left;\n  padding: 0 16px; }\n/**\r\n * Carets\r\n */\n.toolbar div ul li i.icon-sort {\n  display: none; }\n.toolbar div ul li:hover i.icon-sort {\n  display: inline; }\n.toolbar div ul li:hover i.icon-caret-down {\n  display: none; }\n.toolbar .dropdown i {\n  margin: 0px; }\n.toolbar div > ul > li > a:hover {\n  background-color: #fff;\n  color: #333; }\n.dropdown {\n  float: left; }\n/**\r\n * Sub navigaton\r\n **/\n.sub {\n  min-width: 180px;\n  margin: 20px;\n  display: none;\n  position: absolute;\n  border-left: 1px solid #ebebeb;\n  border-right: 1px solid #ebebeb;\n  border-bottom: 1px solid #ebebeb; }\n.sub li a {\n  display: block;\n  background-color: #fff;\n  color: #333 !important;\n  border-left: 4px solid #fff;\n  padding: 4px 12px;\n  font-size: 12px;\n  line-height: 26px; }\n.sub li a:hover {\n  border-left: 4px solid #ff0000;\n  float: top; }\n.toolbar div > ul > li:hover .sub {\n  display: block; }\n.sub li a {\n  transition: all .5s linear;\n  overflow: hidden; }\n#toolwindow {\n  position: relative;\n  background-color: slategrey; }\n.sidebar {\n  position: absolute;\n  top: 0px;\n  right: 0px;\n  height: 100%; }\n.tool-form {\n  padding-top: 10px;\n  padding-left: 10px;\n  color: white; }\n.tool-form-heading {\n  border-bottom: 2px solid #ddd;\n  margin: 0px;\n  padding-bottom: 3px; }\n.tool-form label {\n  font-family: 'Open Sans', sans-serif;\n  font-size: 13px;\n  color: black;\n  display: block;\n  margin: 0px 0px 15px 0px; }\n.tool-form label > span {\n  width: 150px;\n  font-family: 'Open Sans', sans-serif;\n  font-size: 13px;\n  float: left;\n  padding-top: 4px;\n  padding-right: 5px; }\n.tool-form span.required {\n  color: red; }\n.tool-form .tel-number-field {\n  width: 30px;\n  text-align: center; }\n.tool-form input.input-field {\n  width: 30px; }\n.tool-form input.file-input-field {\n  border: 1px solid #ccc;\n  height: 20px;\n  display: inline-block;\n  padding: 6px 6px;\n  cursor: pointer;\n  background-color: #888888; }\n.tool-form input.input-field,\n.tool-form .tel-number-field,\n.tool-form .textarea-field,\n.tool-form .select-field {\n  height: 20px;\n  overflow: hidden;\n  width: 240px;\n  background-color: #888888;\n  border-radius: 5px;\n  color: #ffffff; }\n.tool-form .input-field:focus,\n.tool-form .tel-number-field:focus,\n.tool-form .textarea-field:focus,\n.tool-form .select-field:focus {\n  border: 1px solid #0C0; }\n.tool-form .textarea-field {\n  height: 100px;\n  width: 55%; }\n.tool-form input[type=submit],\n.tool-form input[type=button] {\n  height: 25px;\n  border: none;\n  padding: 2px 8px 2px 8px;\n  background: #444466;\n  color: #fff;\n  box-shadow: 1px 1px 4px #DADADA;\n  -moz-box-shadow: 1px 1px 4px #DADADA;\n  -webkit-box-shadow: 1px 1px 4px #DADADA;\n  border-radius: 3px;\n  -webkit-border-radius: 3px;\n  -moz-border-radius: 3px;\n  color: #ffffff; }\n.tool-form input[type=submit]:hover,\n.tool-form input[type=button]:hover {\n  background: #333377;\n  color: #fff; }\n.rightstyle {\n  width: 30px;\n  height: 100%;\n  float: right;\n  background: #FFFFFF;\n  background-repeat: repeat;\n  background-attachment: scroll;\n  overflow: auto; }\n.leftstyle {\n  background: #e6e6e6;\n  height: 100%; }\n.slider {\n  width: 0;\n  height: 0;\n  border-top: 30px solid transparent;\n  border-right: 10px solid black;\n  border-bottom: 30px solid transparent; }\n"

/***/ }),

/***/ "./src/app/mViewer/viewers/gs-viewer/gs-viewer.component.ts":
/*!******************************************************************!*\
  !*** ./src/app/mViewer/viewers/gs-viewer/gs-viewer.component.ts ***!
  \******************************************************************/
/*! exports provided: GSViewerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GSViewerComponent", function() { return GSViewerComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _data_data_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./data/data.service */ "./src/app/mViewer/viewers/gs-viewer/data/data.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var GSViewerComponent = /** @class */ (function () {
    function GSViewerComponent(dataService) {
        this.dataService = dataService;
        this.imVisible = false;
    }
    ;
    GSViewerComponent.prototype.setModel = function (data) {
        try {
            this.dataService.setGsModel(data);
        }
        catch (ex) {
            this.modelData = undefined;
            console.error("Error generating model");
        }
    };
    GSViewerComponent.prototype.ngOnInit = function () {
        this.modelData = this.data;
        this.setModel(this.modelData);
    };
    GSViewerComponent.prototype.ngDoCheck = function () {
        if (this.modelData !== this.data) {
            this.modelData = this.data;
            this.setModel(this.modelData);
        }
    };
    GSViewerComponent.prototype.leaflet = function () {
        this.imVisible = this.dataService.imVisible;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], GSViewerComponent.prototype, "data", void 0);
    GSViewerComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'gs-viewer',
            template: __webpack_require__(/*! ./gs-viewer.component.html */ "./src/app/mViewer/viewers/gs-viewer/gs-viewer.component.html"),
            styles: [__webpack_require__(/*! ./gs-viewer.component.scss */ "./src/app/mViewer/viewers/gs-viewer/gs-viewer.component.scss")]
        }),
        __metadata("design:paramtypes", [_data_data_service__WEBPACK_IMPORTED_MODULE_1__["DataService"]])
    ], GSViewerComponent);
    return GSViewerComponent;
}());



/***/ }),

/***/ "./src/app/mViewer/viewers/gs-viewer/gs-viewer.module.ts":
/*!***************************************************************!*\
  !*** ./src/app/mViewer/viewers/gs-viewer/gs-viewer.module.ts ***!
  \***************************************************************/
/*! exports provided: GSViewer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GSViewer", function() { return GSViewer; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var angular_split__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! angular-split */ "./node_modules/angular-split/fesm5/angular-split.js");
/* harmony import */ var _angular_material_slider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/slider */ "./node_modules/@angular/material/esm5/slider.es5.js");
/* harmony import */ var _gs_viewer_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./gs-viewer.component */ "./src/app/mViewer/viewers/gs-viewer/gs-viewer.component.ts");
/* harmony import */ var _viewer_viewer_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./viewer/viewer.component */ "./src/app/mViewer/viewers/gs-viewer/viewer/viewer.component.ts");
/* harmony import */ var _setting_setting_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./setting/setting.component */ "./src/app/mViewer/viewers/gs-viewer/setting/setting.component.ts");
/* harmony import */ var _toolwindow_toolwindow_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./toolwindow/toolwindow.component */ "./src/app/mViewer/viewers/gs-viewer/toolwindow/toolwindow.component.ts");
/* harmony import */ var _data_data_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./data/data.service */ "./src/app/mViewer/viewers/gs-viewer/data/data.service.ts");
/* harmony import */ var _toolwindow_groups_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./toolwindow/groups.component */ "./src/app/mViewer/viewers/gs-viewer/toolwindow/groups.component.ts");
/* harmony import */ var ngx_pagination__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ngx-pagination */ "./node_modules/ngx-pagination/dist/ngx-pagination.js");
/* harmony import */ var _angular_material_expansion__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/expansion */ "./node_modules/@angular/material/esm5/expansion.es5.js");
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/tabs */ "./node_modules/@angular/material/esm5/tabs.es5.js");
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/tooltip */ "./node_modules/@angular/material/esm5/tooltip.es5.js");
/* harmony import */ var _angular_material_sort__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/sort */ "./node_modules/@angular/material/esm5/sort.es5.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};















var GSViewer = /** @class */ (function () {
    function GSViewer() {
    }
    GSViewer_1 = GSViewer;
    GSViewer.forRoot = function () {
        return {
            ngModule: GSViewer_1,
            providers: [
                _data_data_service__WEBPACK_IMPORTED_MODULE_8__["DataService"]
            ]
        };
    };
    var GSViewer_1;
    GSViewer = GSViewer_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                angular_split__WEBPACK_IMPORTED_MODULE_2__["AngularSplitModule"],
                _angular_material_slider__WEBPACK_IMPORTED_MODULE_3__["MatSliderModule"],
                ngx_pagination__WEBPACK_IMPORTED_MODULE_10__["NgxPaginationModule"],
                _angular_material_expansion__WEBPACK_IMPORTED_MODULE_11__["MatExpansionModule"],
                _angular_material_tabs__WEBPACK_IMPORTED_MODULE_12__["MatTabsModule"],
                _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_13__["MatTooltipModule"],
                _angular_material_sort__WEBPACK_IMPORTED_MODULE_14__["MatSortModule"]
            ],
            exports: [_gs_viewer_component__WEBPACK_IMPORTED_MODULE_4__["GSViewerComponent"]],
            declarations: [_gs_viewer_component__WEBPACK_IMPORTED_MODULE_4__["GSViewerComponent"],
                _viewer_viewer_component__WEBPACK_IMPORTED_MODULE_5__["ViewerComponent"],
                _setting_setting_component__WEBPACK_IMPORTED_MODULE_6__["SettingComponent"],
                _toolwindow_toolwindow_component__WEBPACK_IMPORTED_MODULE_7__["ToolwindowComponent"],
                _toolwindow_groups_component__WEBPACK_IMPORTED_MODULE_9__["GroupsComponent"]],
            providers: [_data_data_service__WEBPACK_IMPORTED_MODULE_8__["DataService"]],
        })
    ], GSViewer);
    return GSViewer;
}());



/***/ }),

/***/ "./src/app/mViewer/viewers/gs-viewer/setting/setting.component.css":
/*!*************************************************************************!*\
  !*** ./src/app/mViewer/viewers/gs-viewer/setting/setting.component.css ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#settingview{\r\n  position:absolute;\r\n  background-color: white;\r\n  top:0px;\r\n  right:30px;\r\n  color:#395d73;\r\n  width:400px;\r\n  height:430px;\r\n}\r\n#grid{\r\n  margin-left: 20px;\r\n  font-family:sans-serif;\r\n  margin-top:10px;\r\n}\r\n#axis{\r\n  margin-left: 30px;\r\n  font-family:sans-serif;\r\n}\r\n#shadow{\r\n  margin-left: 30px;\r\n  font-family:sans-serif;\r\n}\r\n#frame{\r\n  margin-left: 30px;\r\n  font-family:sans-serif;\r\n}\r\n#nomal{\r\n  margin-left: 20px;\r\n  font-family:sans-serif;\r\n}\r\n#point{\r\n  margin-left: 20px;\r\n  font-family:sans-serif;\r\n}\r\n#huerange{\r\n  margin-left: 41px;\r\n  width: 60%;\r\n  font-family:sans-serif;\r\n}\r\n#satrange{\r\n  margin-left: 18px;\r\n  width: 60%;\r\n  font-family:sans-serif;\r\n}\r\n#lirange{\r\n  margin-left: 20px;\r\n  width: 60%;\r\n  font-family:sans-serif;\r\n}\r\n#oprange{\r\n  margin-left: 20px;\r\n  width: 60%;\r\n  font-family:sans-serif;\r\n}\r\n#name{\r\n  font-family:sans-serif;\r\n}\r\n#redrange{\r\n  margin-left: 60px;\r\n  width: 60%;\r\n  font-family:sans-serif;\r\n}\r\n#greenrange{\r\n  margin-left: 60px;\r\n  width: 60%;\r\n  font-family:sans-serif;\r\n}\r\n#bluerange{\r\n  margin-left: 60px;\r\n  width: 60%;\r\n  font-family:sans-serif;\r\n}\r\n#linerange{\r\n  margin-left: 5px;\r\n  width: 50%;\r\n  font-family:sans-serif;\r\n}\r\n#pointrange{\r\n  margin-left: 3px;\r\n  width: 50%;\r\n  font-family:sans-serif;\r\n}\r\n#sizerange{\r\n  width: 50%;\r\n  font-family:sans-serif;\r\n}\r\n#centerx{\r\n  width:30px;\r\n  margin-left:10px;\r\n}\r\n#centery{\r\n  width:30px;\r\n  margin-left:10px;\r\n}\r\n#centerz{\r\n  width:30px;\r\n  margin-left:10px;\r\n}\r\n#centersize{\r\n  width:30px;\r\n  margin-left:10px;\r\n}\r\n.name{\r\n  margin-left: 10px;\r\n}\r\n.center{\r\n  margin-left: 10px;\r\n}\r\n::ng-deep .mat-accent .mat-slider-thumb {\r\n    background-color: #395d73;\r\n    font-family:sans-serif;\r\n}\r\n::ng-deep .mat-accent .mat-slider-thumb-label {\r\n    background-color: #395d73;\r\n    font-family:sans-serif;\r\n}\r\n::ng-deep .mat-accent .mat-slider-track-fill {\r\n    background-color: #395d73;\r\n    font-family:sans-serif;\r\n} "

/***/ }),

/***/ "./src/app/mViewer/viewers/gs-viewer/setting/setting.component.html":
/*!**************************************************************************!*\
  !*** ./src/app/mViewer/viewers/gs-viewer/setting/setting.component.html ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"settingview\" (click)=\"setting($event)\">\r\n  <input id=\"grid\" #grid type=\"checkbox\" [checked]=\"gridVisible\" (click)=\"changegrid()\"> <label id=\"name\" value=\"gridVisible\">grid</label>\r\n  <input id=\"axis\"  type=\"checkbox\" [checked]=\"axisVisible\" (click)=\"changeaxis()\"> <label id=\"name\" value=\"axisVisible\">axis</label>\r\n  <input id=\"shadow\"  type=\"checkbox\" [checked]=\"shadowVisible\" (click)=\"changeshadow()\"> <label id=\"name\" value=\"shadowVisible\">shadow</label>\r\n  <input id=\"frame\"  type=\"checkbox\" [checked]=\"frameVisible\" (click)=\"changeframe()\"> <label id=\"name\" value=\"frameVisible\">frame</label><br/>\r\n  <!-- <input id=\"nomal\"  type=\"checkbox\" [checked]=\"normalVisible\" (click)=\"changenormal()\"> <label id=\"name\" value=\"nomalVisible\">nomal</label> -->\r\n  <input id=\"point\"  type=\"checkbox\" [checked]=\"pointVisible\" (click)=\"changepoint()\"> <label id=\"name\" value=\"pointVisible\">point</label><br/>\r\n  \r\n  <hr/><label class=\"name\" >Grid Center</label><br/>\r\n  <label class=\"name\" >X</label><input type=\"text\" name=\"center\" id=\"centerx\" #centerx value={{_centerx}} (change)=changecenter(centerx.value,centery.value,centerz.value,size.value)>\r\n  &nbsp;&nbsp;&nbsp;&nbsp;<label id=\"name\" >Y</label><input type=\"text\" name=\"center\" #centery id=\"centery\" value={{_centery}} (change)=changecenter(centerx.value,centery.value,centerz.value,size.value)>\r\n  &nbsp;&nbsp;&nbsp;&nbsp;<label id=\"name\" >Z</label><input type=\"text\" name=\"center\"  #centerz id=\"centerz\" value={{_centerz}} (change)=changecenter(centerx.value,centery.value,centerz.value,size.value)>\r\n  &nbsp;&nbsp;&nbsp;&nbsp;<label id=\"name\" >Size</label><input type=\"text\" name=\"center\"  #size id=\"centersize\" value={{_centersize}} (change)=changecenter(centerx.value,centery.value,centerz.value,size.value)>\r\n  &nbsp;&nbsp;&nbsp;&nbsp;<button (click)=\"getcenter()\">Get</button><br/>\r\n  <!--< button (click)=\"changecenter(centerx.value,centery.value,centerz.value)\">Set</button> -->\r\n  <!-- <hr/>&nbsp;&nbsp;&nbsp;&nbsp;<label id=\"name\" >Raycaster Precision</label>&nbsp;&nbsp;<br/>-->\r\n  <label class=\"name\" >Line Precision</label>\r\n  <mat-slider class=\"slider\" name=\"range\" id=\"linerange\" min=0 max=1 step=0.01  value={{_linepre}} #linepre (change)=\"changeline(linepre.value)\" ></mat-slider><label id=\"name\" >{{linepre.value.toPrecision(2)}}</label><br/>\r\n  <!-- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label id=\"name\" >Point Precision</label>\r\n  <mat-slider class=\"slider\" name=\"range\" id=\"pointrange\" min=0 max=1 step=0.01  value={{_pointpre}} #pointpre (change)=\"changepoint(pointpre.value)\" ></mat-slider><label id=\"name\" >{{pointpre.value.toPrecision(2)}}</label><br/> -->\r\n  <label class=\"name\" >Points Size</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n  <mat-slider class=\"slider\" name=\"range\" id=\"sizerange\" min=0 max=5 step=0.1  value={{_pointsize}} #pointsize (change)=\"changepointsize(pointsize.value)\" ></mat-slider><label id=\"name\" >{{pointsize.value.toPrecision(2)}}</label><br/>\r\n\r\n  <hr/><label class=\"name\" >Hemisphere Light</label>&nbsp;&nbsp;<br/>\r\n  <label class=\"name\" >hue</label>&nbsp;&nbsp;&nbsp;\r\n  <mat-slider class=\"slider\" name=\"range\" id=\"huerange\" min=0 max=1 step=0.01  value={{hue}} #slider (change)=\"changelight(slider.value,slider1.value,slider2.value)\" ></mat-slider><label id=\"name\" >{{slider.value.toPrecision(2)}}</label><br/>\r\n  <label class=\"name\" >saturation</label>\r\n  <mat-slider name=\"range\" id=\"satrange\" min=0 max=1 step=0.01 value={{saturation}} #slider1 (change)=\"changelight(slider.value,slider1.value,slider2.value)\" ></mat-slider><label id=\"name\" >{{slider1.value.toPrecision(2)}}</label><br/>\r\n  <label class=\"name\" >lightness</label>\r\n  <mat-slider name=\"range\" id=\"lirange\" min=0 max=1 step=0.01 value={{lightness}} #slider2 (change)=\"changelight(slider.value,slider1.value,slider2.value)\" ></mat-slider><label id=\"name\" >{{slider2.value.toPrecision(2)}}</label><br/>\r\n  <!-- &nbsp;&nbsp;&nbsp;&nbsp;<label id=\"name\" >opacity</label>&nbsp;&nbsp;&nbsp;\r\n  <mat-slider name=\"range\" id=\"oprange\" min=0 max=1 step=0.01 value={{opacity}} #slider3 (change)=\"changeopa(slider3.value)\" ></mat-slider><label id=\"name\" >{{slider3.value.toPrecision(2)}}</label><br/> -->\r\n  <!-- <hr/>&nbsp;&nbsp;&nbsp;&nbsp;<label id=\"name\" >Backeground Color</label>&nbsp;&nbsp;<br/>\r\n  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label id=\"name\" >R</label>\r\n  <mat-slider  name=\"range\" id=\"redrange\" min=0 max=1 step=0.01  value={{red}} #slider4 (change)=\"changeback(slider4.value,slider5.value,slider6.value)\" ></mat-slider><label id=\"name\" >{{slider4.value.toPrecision(2)}}</label><br/>\r\n  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label id=\"name\" >G</label>\r\n  <mat-slider name=\"range\" id=\"greenrange\" min=0 max=1 step=0.01 value={{green}} #slider5 (change)=\"changeback(slider4.value,slider5.value,slider6.value)\" ></mat-slider><label id=\"name\" >{{slider5.value.toPrecision(2)}}</label><br/>\r\n  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label id=\"name\" >B</label>\r\n  <mat-slider name=\"range\" id=\"bluerange\" min=0 max=1 step=0.01 value={{blue}} #slider6 (change)=\"changeback(slider4.value,slider5.value,slider6.value)\" ></mat-slider><label id=\"name\" >{{slider6.value.toPrecision(2)}}</label><br/> -->\r\n</div>"

/***/ }),

/***/ "./src/app/mViewer/viewers/gs-viewer/setting/setting.component.ts":
/*!************************************************************************!*\
  !*** ./src/app/mViewer/viewers/gs-viewer/setting/setting.component.ts ***!
  \************************************************************************/
/*! exports provided: SettingComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingComponent", function() { return SettingComponent; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _data_data_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../data/data.service */ "./src/app/mViewer/viewers/gs-viewer/data/data.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var SettingComponent = /** @class */ (function () {
    function SettingComponent(dataService) {
        this.dataService = dataService;
        // avoid manipulating the scene here
        // shift to dataservice
        this.scene = this.dataService.getScene();
        this.alight = this.dataService.getalight();
        this.hue = this.dataService.hue;
        this.saturation = this.dataService.saturation;
        this.lightness = this.dataService.lightness;
        this._centerx = this.dataService.centerx;
        this._centery = this.dataService.centery;
        this._centerz = this.dataService.centerz;
        this._centersize = this.dataService.centersize;
        this.raycaster = this.dataService.getraycaster();
        this._linepre = this.raycaster.linePrecision;
        this._pointpre = this.raycaster.params.Points.threshold;
        this._pointsize = this.dataService.pointsize;
    }
    SettingComponent.prototype.ngOnInit = function () {
        if (this.hue == undefined) {
            this.hue = 0;
        }
        else {
            this.hue = this.dataService.hue;
        }
        if (this.saturation == undefined) {
            this.saturation = 0.01;
        }
        else {
            this.saturation = this.dataService.saturation;
        }
        if (this.lightness == undefined) {
            this.lightness = 0.47;
        }
        else {
            this.lightness = this.dataService.lightness;
        }
        this.gridVisible = this.dataService.grid;
        this.axisVisible = this.dataService.axis;
        this.shadowVisible = this.dataService.shadow;
        this.frameVisible = this.dataService.frame;
        this.pointVisible = this.dataService.point;
        if (this._centerx == undefined) {
            this._centerx = 0;
        }
        else {
            this._centerx = this.dataService.centerx;
        }
        if (this._centery == undefined) {
            this._centery = 0;
        }
        else {
            this._centery = this.dataService.centery;
        }
        if (this._centerz == undefined) {
            this._centerz = 0;
        }
        else {
            this._centerz = this.dataService.centerz;
        }
        if (this._centersize == undefined) {
            this._centersize = 100;
        }
        else {
            this._centersize = this.dataService.centersize;
        }
        this.raycaster = this.dataService.getraycaster();
        if (this._linepre == undefined) {
            this._linepre = 0.05;
        }
        else {
            this._linepre = this.raycaster.linePrecision;
        }
        if (this._pointpre == undefined) {
            this._pointpre = 1;
        }
        else {
            this._pointpre = this.raycaster.params.Points.threshold;
        }
        if (this._pointsize == undefined) {
            this._pointsize = 1;
        }
        else {
            this._pointsize = this.dataService.pointsize;
        }
    };
    SettingComponent.prototype.changegrid = function () {
        this.gridVisible = !this.gridVisible;
        if (this.gridVisible) {
            var gridhelper = new three__WEBPACK_IMPORTED_MODULE_0__["GridHelper"](100, 100);
            gridhelper.name = "GridHelper";
            var vector = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](0, 1, 0);
            gridhelper.lookAt(vector);
            this.scene.add(gridhelper);
        }
        else {
            this.scene.remove(this.scene.getObjectByName("GridHelper"));
        }
        this.dataService.addgrid(this.gridVisible);
    };
    SettingComponent.prototype.changecenter = function (centerx, centery, centerz, centersize) {
        if (this.gridVisible) {
            var gridhelper = this.scene.getObjectByName("GridHelper");
            gridhelper = new three__WEBPACK_IMPORTED_MODULE_0__["GridHelper"](centersize, centersize);
            gridhelper.position.set(centerx, centery, centerz);
            console.log(gridhelper);
            this._centerx = centerx;
            this._centery = centery;
            this._centerz = centerz;
            this._centersize = centersize;
            this.dataService.getcenterx(centerx);
            this.dataService.getcentery(centery);
            this.dataService.getcenterz(centerz);
            this.dataService.getcentersize(centersize);
        }
    };
    SettingComponent.prototype.changeline = function (lineprecision) {
        this._linepre = lineprecision;
        this.raycaster.linePrecision = lineprecision;
        this.dataService.addraycaster(this.raycaster);
    };
    SettingComponent.prototype.changepoint = function () {
        this.pointVisible = !this.pointVisible;
        var children = [];
        for (var i = 0; i < this.scene.children.length; i++) {
            if (this.scene.children[i].type === "Scene") {
                for (var j = 0; j < this.scene.children[i].children.length; j++) {
                    if (this.scene.children[i].children[j].type === "Points") {
                        children.push(this.scene.children[i].children[j]);
                    }
                }
            }
        }
        if (this.pointVisible) {
            for (var i = 0; i < children.length; i++) {
                children[i]["material"].transparent = false;
                children[i]["material"].opacity = 1;
            }
        }
        else {
            for (var i = 0; i < children.length; i++) {
                children[i]["material"].transparent = true;
                children[i]["material"].opacity = 0;
            }
        }
        this.dataService.addpoint(this.pointVisible);
    };
    SettingComponent.prototype.changepointsize = function (pointsize) {
        this._pointsize = pointsize;
        for (var i = 0; i < this.scene.children.length; i++) {
            if (this.scene.children[i].name === "sphereInter") {
                var geometry = new three__WEBPACK_IMPORTED_MODULE_0__["SphereGeometry"](pointsize / 3);
                this.scene.children[i]["geometry"] = geometry;
            }
            if (this.scene.children[i].name === "selects" && this.scene.children[i].type === "Points") {
                this.scene.children[i]["material"].size = pointsize;
            }
        }
        this.dataService.getpointsize(pointsize);
    };
    SettingComponent.prototype.changeaxis = function () {
        this.axisVisible = !this.axisVisible;
        if (this.axisVisible) {
            var axishelper = new three__WEBPACK_IMPORTED_MODULE_0__["AxesHelper"](10);
            axishelper.name = "AxisHelper";
            this.scene.add(axishelper);
        }
        else {
            this.scene.remove(this.scene.getObjectByName("AxisHelper"));
        }
        this.dataService.addaxis(this.axisVisible);
    };
    SettingComponent.prototype.changeshadow = function () {
        this.shadowVisible = !this.shadowVisible;
        for (var i = 0; i < this.scene.children.length; i++) {
            if (this.scene.children[i].type === "DirectionalLight") {
                if (this.shadowVisible) {
                    this.scene.children[i].castShadow = true;
                }
                else {
                    this.scene.children[i].castShadow = false;
                }
            }
        }
        this.dataService.addshadow(this.shadowVisible);
    };
    SettingComponent.prototype.changelight = function (_hue, _saturation, _lightness) {
        this.hue = _hue;
        this.saturation = _saturation;
        this.lightness = _lightness;
        var alight = this.alight;
        this.dataService.gethue(_hue);
        this.dataService.getsaturation(_saturation);
        this.dataService.getlightness(_lightness);
        this.alight.color.setHSL(_hue, _saturation, _lightness);
    };
    SettingComponent.prototype.changeframe = function () {
        this.frameVisible = !this.frameVisible;
        if (this.frameVisible) {
            for (var i = 0; i < this.scene.children.length; i++) {
                if (this.scene.children[i].type === "Scene") {
                    if (this.scene.children[i].children[0].type === "Mesh") {
                        this.scene.children[i].children[0].visible = false;
                    }
                }
            }
        }
        else {
            for (var i = 0; i < this.scene.children.length; i++) {
                if (this.scene.children[i].type === "Scene") {
                    if (this.scene.children[i].children[0].type === "Mesh") {
                        this.scene.children[i].children[0].visible = true;
                    }
                }
            }
        }
        this.dataService.addframe(this.frameVisible);
    };
    SettingComponent.prototype.changenormal = function () {
        this.nomalVisible = !this.nomalVisible;
        if (this.nomalVisible) {
            /*for(var i=0;i<this.scene.children.length;i++){
              if(this.scene.children[i].type==="Scene"){
                for(var j=0;j<this.scene.children[i].children.length;j++){
                  if(this.scene.children[i].children[j].type==="Mesh"){
                    var mesh=this.scene.children[i].children[j];
                    var faceNormalsHelper = new THREE.FaceNormalsHelper( mesh, 10 );
                    mesh.add( faceNormalsHelper );
                    var verticehelper = new THREE.VertexNormalsHelper( mesh, 10 );
                    this.scene.add(verticehelper);
                    console.log(this.scene);
                    //facehelper.visible=false;
                    //this.scene.add(verticehelper);
                  }
                }
              }
            }*/
        }
    };
    SettingComponent.prototype.setting = function (event) {
        event.stopPropagation();
    };
    SettingComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-setting',
            template: __webpack_require__(/*! ./setting.component.html */ "./src/app/mViewer/viewers/gs-viewer/setting/setting.component.html"),
            styles: [__webpack_require__(/*! ./setting.component.css */ "./src/app/mViewer/viewers/gs-viewer/setting/setting.component.css")]
        }),
        __metadata("design:paramtypes", [_data_data_service__WEBPACK_IMPORTED_MODULE_2__["DataService"]])
    ], SettingComponent);
    return SettingComponent;
}());



/***/ }),

/***/ "./src/app/mViewer/viewers/gs-viewer/toolwindow/groups.component.css":
/*!***************************************************************************!*\
  !*** ./src/app/mViewer/viewers/gs-viewer/toolwindow/groups.component.css ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#setandgroup{\r\n  position: relative;\r\n  background-color: #F1F1F1 !important;\r\n  height: 100%;\r\n  width: 100%;\r\n  font-family: Roboto,\"Helvetica Neue\",sans-serif;\r\n  font-size: 12px !important;\r\n  line-height: 14px;\r\n  overflow-x: hidden !important;\r\n}\r\n#groupsview{\r\n  color:#395d73;\r\n  background-color: #F1F1F1 !important;\r\n  font-family: Roboto,\"Helvetica Neue\",sans-serif;\r\n  font-size: 12px !important;\r\n}\r\n#settingview{\r\n  font-family: Roboto,\"Helvetica Neue\",sans-serif;\r\n  background-color: #F1F1F1 !important;\r\n  font-size: 12px !important;\r\n  line-height: 14px;\r\n  overflow-x: hidden !important;\r\n  overflow-y: hidden !important;\r\n  width: 1600px;\r\n  height: 800px;\r\n  color: #395d73;\r\n}\r\n.check{\r\n  margin-left:10px;\r\n}\r\n#GridCenter{\r\n  margin-left: 10px;\r\n  margin-top: 3px !important;\r\n  height: 8px;\r\n  vertical-align: bottom;\r\n}\r\n#centerx{\r\n  width:50px;\r\n  margin-left: 10px;\r\n/*  margin-left:25px;*/\r\n}\r\n#centery{\r\n  width:50px;\r\n  /*margin-left:25px;*/\r\n}\r\n#centerz{\r\n  width:50px;\r\n  /*margin-left:25px;*/\r\n}\r\n#centersize{\r\n  width:50px;\r\n  margin-left:9px;\r\n}\r\n.name{\r\n  width: 100%;\r\n  margin-left: 10px;\r\n  margin-top: 8px;\r\n}\r\n#slider-conainer{\r\n  align-items: center !important;\r\n  display: flex;\r\n  float: right;\r\n}\r\n/*::ng-deep .mat-accent .mat-slider-thumb {\r\n    background-color: #395d73;\r\n    font-family:sans-serif;\r\n} \r\n::ng-deep .mat-accent .mat-slider-thumb-label {\r\n    background-color: white;\r\n    color:#395d73;\r\n    font-family:sans-serif;\r\n}\r\n::ng-deep .mat-accent .mat-slider-track-fill {\r\n    background-color: #395d73;\r\n    font-family:sans-serif;\r\n}\r\n\r\n/deep/.mat-slider-min-value.mat-slider-thumb-label-showing .mat-slider-thumb, .mat-slider-min-value.mat-slider-thumb-label-showing .mat-slider-thumb-label {\r\n    background-color: #395d73;\r\n}\r\n/*::ng-deep .mat-expansion-panel {\r\n  margin: 0px !important;\r\n  overflow: hidden !important;\r\n}\r\n/deep/ .slider {\r\n  height: 25px !important;\r\n  vertical-align: unset !important;\r\n  width: unset !important;\r\n}\r\n*/\r\n/deep/.mat-accent .mat-slider-thumb {\r\n    background-color: #395d73 !important;\r\n    cursor: -webkit-grab;\r\n}\r\n/deep/.mat-slider-track-fill{\r\n  background-color: #395d73 !important;\r\n}\r\n/deep/.mat-slider-thumb-label-text {\r\n    color: #395d73 !important;\r\n    font-size: 12px !important;\r\n}\r\n/deep/.mat-slider-thumb-label{\r\n    height: 15px !important;\r\n    width: 15px !important;\r\n    top: -20px !important;\r\n    right: -7px !important;\r\n    background-color: white !important;\r\n    border: 1px solid #395d73 !important;\r\n}\r\n.mat-slider{\r\n    width: 50px !important;\r\n}\r\n/deep/.mat-tab-label, /deep/.mat-tab-label-active{\r\n  min-width: 3px!important;\r\n  padding: 3px!important;\r\n  margin: 3px!important;\r\n  color:#395d73;\r\n}\r\n/deep/.mat-tab-label{\r\n  height: 30px !important;\r\n}\r\n/deep/.mat-tab-header-pagination-controls-enabled .mat-tab-header-pagination{\r\n  display: none !important;\r\n}\r\n/deep/.mat-ink-bar{\r\n  background-color: #395d73 !important;\r\n}\r\n.mat-tab{\r\n  min-width: 30px !important;\r\n}\r\n/deep/.mat-tab-body-content{\r\n  overflow: hidden !important;\r\n}\r\n.mat-expansion-panel-spacing {\r\n  margin-top:0px;\r\n  margin-bottom: 0px;\r\n}\r\n.mat-expansion-panel{\r\n  background-color: #F1F1F1 !important;\r\n  border-color: #395d73;\r\n  line-height: 14px;\r\n  font-weight: bold !important;\r\n  font-size: 12px !important;\r\n  overflow: hidden !important;\r\n}\r\n#groupname{\r\n  margin-right: 0px;\r\n}\r\n.mat-header{\r\n  flex-direction: row;\r\n  font-family: Roboto,\"Helvetica Neue\",sans-serif;\r\n  margin-left: 0px;\r\n  color:#395d73;\r\n  border: 0;\r\n  height: 20px;\r\n}\r\n.mat-list-text{\r\n  cursor :pointer;\r\n  color:#f3a32a;\r\n  font-family: sans-serif;\r\n  font-size: 14px;\r\n  font-weight: 700px;\r\n  line-height: 14px;\r\n  border-top: 2px !important;\r\n  /*margin-top: 2px;*/\r\n}\r\n.mat-list-descr{\r\n  cursor :default;\r\n  color:#f3a32a;\r\n  font-family: sans-serif;\r\n  font-size: 14px;\r\n  font-weight: 700px;\r\n  line-height: 14px;\r\n  border-top: 2px !important;\r\n  margin-top: 8px;\r\n}\r\n.mat-list-text-parent{\r\n  cursor :pointer;\r\n  color:#f3a32a;\r\n  font-family: sans-serif;\r\n  font-size: 14px;\r\n  font-weight: 700px;\r\n  line-height: 14px;\r\n  border-top: 2px !important;\r\n  /*margin-top: 2px;*/\r\n}\r\nhr {\r\n  display: block;\r\n  height: 1px;\r\n  border: 0;\r\n  border-top: 1px solid #ccc;\r\n  /*margin: 1em 0;*/\r\n  padding: 0; \r\n  color:#395d73;\r\n  width: 100%;\r\n  background-color: #395d73;\r\n}\r\n\r\n"

/***/ }),

/***/ "./src/app/mViewer/viewers/gs-viewer/toolwindow/groups.component.html":
/*!****************************************************************************!*\
  !*** ./src/app/mViewer/viewers/gs-viewer/toolwindow/groups.component.html ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"setandgroup\" >\r\n<mat-tab-group class=\"mat-tab-group\">\r\n  <mat-tab label=\"Groups\" >\r\n  \t<div id=\"groupsview\">\r\n\t<mat-accordion>\r\n\t  <mat-expansion-panel *ngFor=\"let group of groups\">\r\n\t\t  <mat-expansion-panel-header *ngIf=\"group.parent===null\" class=\"mat-header\">\r\n\t\t    <div class=\"mat-header\"><label id=\"groupname\">{{group.name}}</label></div>\r\n\t\t  </mat-expansion-panel-header>\r\n\t\t    <!-- <div class=\"mat-list-text-parent\"><span id=\"parent\">parent : {{group.parent}} </span></div> -->\r\n\t\t    <div ><span class=\"mat-list-text\" (click)=\"selectpoint(group)\">point : {{group.num_point}} </span></div>\r\n\t\t    <div ><span class=\"mat-list-text\" (click)=\"selectvertice(group)\">vertice : {{group.num_vertice}} </span></div>\r\n\t\t    <div ><span class=\"mat-list-text\" (click)=\"selectedge(group)\">edge : {{group.num_edge}} </span></div>\r\n\t\t    <div ><span class=\"mat-list-text\" (click)=\"selectwire(group)\">wire : {{group.num_wire}} </span></div>\r\n\t\t    <div ><span class=\"mat-list-text\" (click)=\"selectface(group)\">face : {{group.num_face}} </span></div>\r\n\t\t    <div ><span class=\"mat-list-text\" (click)=\"selectobject(group)\">object : {{group.num_object}} </span><hr/></div>\r\n\t\t    <div class=\"mat-list-descr\" *ngFor=\"let prop of group.props\"><span >{{prop[0]}} : {{prop[1]}} </span></div>\r\n\t\t    <div *ngIf=\"group.child!==null\" >\r\n \t\t    \t<mat-accordion>\r\n\t\t\t  \t\t<mat-expansion-panel >\r\n\t\t\t  \t\t\t<mat-expansion-panel-header ><div class=\"mat-header\"><label id=\"groupname\">{{group.child.name}}</label></div></mat-expansion-panel-header>\r\n\t\t\t  \t\t\t<div class=\"mat-list-text-parent\"><span id=\"parent\">parent : {{group.child.parent}} </span><hr></div>\r\n\t\t\t  \t\t\t<div ><span class=\"mat-list-text\" (click)=\"selectpoint(group)\">point : {{group.child.num_point}} </span></div>\r\n\t\t\t\t\t    <div ><span class=\"mat-list-text\" (click)=\"selectvertice(group)\">vertice : {{group.child.num_vertice}} </span></div>\r\n\t\t\t\t\t    <div ><span class=\"mat-list-text\" (click)=\"selectedge(group)\">edge : {{group.child.num_edge}} </span></div>\r\n\t\t\t\t\t    <div ><span class=\"mat-list-text\" (click)=\"selectwire(group)\">wire : {{group.child.num_wire}} </span></div>\r\n\t\t\t\t\t    <div ><span class=\"mat-list-text\" (click)=\"selectface(group)\">face : {{group.child.num_face}} </span></div>\r\n\t\t\t\t\t    <div ><span class=\"mat-list-text\" (click)=\"selectobject(group)\">object : {{group.child.num_object}} </span><hr/></div>\r\n\t\t\t\t\t    <div class=\"mat-list-descr\" *ngFor=\"let prop of group.child.props\"><span >{{prop[0]}} : {{prop[1]}} </span></div>\r\n \t\t\t  \t\t</mat-expansion-panel>\r\n\t\t \t\t </mat-accordion>\r\n\t\t\t</div>\r\n \t\t</mat-expansion-panel>\r\n\t</mat-accordion>\r\n\t</div>\r\n  </mat-tab>\r\n  <mat-tab label=\"Settings\" >\r\n  \t<div id=\"settingview\">\r\n  \t\t<input id=\"grid\" class=\"check\" #grid type=\"checkbox\" [checked]=\"gridVisible\" (click)=\"changegrid()\"> <label id=\"name\" value=\"gridVisible\">grid</label><br/>\r\n\t\t<input id=\"axis\" class=\"check\" type=\"checkbox\" [checked]=\"axisVisible\" (click)=\"changeaxis()\"> <label id=\"name\" value=\"axisVisible\">axis</label><br/>\r\n\t\t<input id=\"shadow\" class=\"check\"  type=\"checkbox\" [checked]=\"shadowVisible\" (click)=\"changeshadow()\"> <label id=\"name\" value=\"shadowVisible\">shadow</label><br/>\r\n\t\t<input id=\"frame\" class=\"check\" type=\"checkbox\" [checked]=\"frameVisible\" (click)=\"changeframe()\"> <label id=\"name\" value=\"frameVisible\">wireframe</label><br/>\r\n\t\t<input id=\"point\" class=\"check\" type=\"checkbox\" [checked]=\"pointVisible\" (click)=\"changepoint()\"> <label id=\"name\" value=\"pointVisible\">point</label><br/>\r\n\t\t<hr/><div  id=\"GridCenter\" >Grid Center<button (click)=\"getcenter()\" style=\"margin-left: 30px;width: 40px;height: 20px; font-family: sans-serif;font-size: 12px;\">Get</button></div><br/>\r\n\t\t<label class=\"name\" >XYZ</label><input type=\"text\" name=\"center\" id=\"centerx\" #centerx value={{_centerx}} (change)=changecenter(centerx.value,centery.value,centerz.value)><input type=\"text\" name=\"center\" #centery id=\"centery\" value={{_centery}} (change)=changecenter(centerx.value,centery.value,centerz.value)><input type=\"text\" name=\"center\"  #centerz id=\"centerz\" value={{_centerz}} (change)=changecenter(centerx.value,centery.value,centerz.value)><br/>\r\n\t\t<label class=\"name\" >Size</label><input type=\"text\" name=\"center\"  #size id=\"centersize\" value={{_centersize}} (change)=changecentersize(size.value)><br/>\r\n\t\t<hr/><div style=\"margin-left: 10px;\"><label  >Selection Settings:</label></div><!-- <br/> -->\r\n\t\t<div class=\"name\"><label >Line Precision</label></div><!-- <br/> -->\r\n  \t\t&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label class=\"name\" >Radius</label>&nbsp;<input type=\"text\" value={{_linepre}} #linetext (change)=\"changeline(linetext.value)\" style=\"width: 30px; \">&nbsp;<span>0</span>\r\n\r\n  \t\t<mat-slider class=\"slider\" name=\"range\" id=\"linerange\" min=0 max=1 step=0.01 thumbLabel=true value=\"_linepre\" #linepre (change)=\"changeline(linepre.value.toPrecision(2))\" >\r\n  \t\t</mat-slider>\r\n\r\n  \t\t<span>1</span><br/>\r\n  \t\t<div class=\"name\"><label>Points Precision</label></div><!-- <br/> -->\r\n  \t\t&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label class=\"name\" >Radius</label>&nbsp;<input type=\"text\" value={{_materialpoint}} #pointtext1 (change)=\"changeradius(pointtext1.value)\" style=\"width: 30px; \">&nbsp;<span>0</span><mat-slider class=\"slider\" name=\"range\" id=\"sizerange\" min=0 max=5 step=0.1 thumbLabel=true value={{_materialpoint}} #pointsize1 (change)=\"changeradius(pointsize1.value.toPrecision(2))\" ></mat-slider><span>5</span><br/>\r\n  \t\t<!-- &nbsp;&nbsp;&nbsp;&nbsp;<label class=\"name\" >Selected</label>&nbsp;<input type=\"text\" value={{_pointsize}} #pointtext (change)=\"changepointsize(pointtext.value)\" style=\"width: 30px; \">&nbsp;<span>0</span><mat-slider class=\"slider\" name=\"range\" id=\"sizerange\" min=0 max=5 step=0.1 thumbLabel=true value={{_pointsize}} #pointsize (change)=\"changepointsize(pointsize.value.toPrecision(2))\" ></mat-slider><span>5</span><br/> -->\r\n  \t\t<div class=\"name\"><label >Points Size</label></div><!-- <br/> -->\r\n  \t\t&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label class=\"name\" >Size</label>&nbsp;<input type=\"text\" value={{_pointsize}} #pointtext (change)=\"changepointsize(pointtext.value)\" style=\"width: 30px; \">&nbsp;<span>0</span><mat-slider class=\"slider\" name=\"range\" id=\"sizerange\" min=0 max=5 step=0.1 thumbLabel=true value={{_pointsize}} #pointsize (change)=\"changepointsize(pointsize.value.toPrecision(2))\" ></mat-slider><span>5</span><br/><!-- <input type=\"text\" value={{_materialpoint}} #pointtext1 (change)=\"changematerialpoint(pointtext1.value)\" style=\"width: 30px; \">&nbsp;<span>0</span><mat-slider class=\"slider\" name=\"range\" id=\"sizerange\" min=0 max=5 step=0.1 thumbLabel=true value={{_pointsize1}} #pointsize1 (change)=\"changematerialpoint(pointsize1.value.toPrecision(2))\" ></mat-slider><span>5</span><br/> -->\r\n  \t\t<hr/><label class=\"name\" >Hemisphere Light</label>&nbsp;&nbsp;<br/>\r\n\t\t&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label class=\"name\" >Hue</label>&nbsp;\r\n\t\t<input type=\"text\" value={{hue}} #huetext (change)=\"changelight(huetext.value,slider1.value,slider2.value)\" style=\"width: 30px; \">&nbsp;<span>0</span><mat-slider class=\"slider\" name=\"range\" id=\"huerange\" min=0 max=1 step=0.01 thumbLabel=true value={{hue}} #slider (change)=\"changelight(slider.value,slider1.value,slider2.value)\" ></mat-slider><span>1</span><br/>\r\n\t\t&nbsp;<label class=\"name\" >Saturation</label>&nbsp;\r\n\t\t<input type=\"text\" value={{saturation}} #satutext (change)=\"changelight(slider.value,satutext.value,slider2.value)\" style=\"width: 30px; \">&nbsp;<span>0</span><mat-slider class=\"slider\" name=\"range\" id=\"satrange\" min=0 max=1 step=0.01 thumbLabel=true value={{saturation}} #slider1 (change)=\"changelight(slider.value,slider1.value,slider2.value)\" ></mat-slider><span>1</span><br/>\r\n\t\t&nbsp;&nbsp;<label class=\"name\" >Lightness</label>&nbsp;\r\n\t\t<input type=\"text\" value={{lightness}} #lighttext (change)=\"changelight(slider.value,slider1.value,lighttext.value)\" style=\"width: 30px; \">&nbsp;<span>0</span><mat-slider class=\"slider\" name=\"range\" id=\"lirange\" min=0 max=1 step=0.01 thumbLabel=true value={{lightness}} #slider2 (change)=\"changelight(slider.value,slider1.value,slider2.value)\" ></mat-slider><span>1</span><br/>\r\n  \t</div>\r\n  </mat-tab>\r\n</mat-tab-group>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/mViewer/viewers/gs-viewer/toolwindow/groups.component.ts":
/*!**************************************************************************!*\
  !*** ./src/app/mViewer/viewers/gs-viewer/toolwindow/groups.component.ts ***!
  \**************************************************************************/
/*! exports provided: GroupsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GroupsComponent", function() { return GroupsComponent; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _data_DataSubscriber__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../data/DataSubscriber */ "./src/app/mViewer/viewers/gs-viewer/data/DataSubscriber.ts");
/* harmony import */ var gs_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! gs-json */ "./node_modules/gs-json/dist2015/index.js");
/* harmony import */ var gs_json__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(gs_json__WEBPACK_IMPORTED_MODULE_3__);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/*import {MatTabsModule} from '@angular/material/tabs';*/
var GroupsComponent = /** @class */ (function (_super) {
    __extends(GroupsComponent, _super);
    function GroupsComponent(injector, myElement) {
        var _this = _super.call(this, injector) || this;
        _this.scene = _this.dataService.getScene();
        _this.renderer = _this.dataService.getRenderer();
        _this.camera = _this.dataService.getCamera();
        _this.myElement = myElement;
        _this._centerx = _this.dataService.centerx;
        _this._centery = _this.dataService.centery;
        _this._centerz = _this.dataService.centerz;
        _this._centersize = _this.dataService.centersize;
        _this.raycaster = _this.dataService.getraycaster();
        _this._pointsize = _this.dataService.pointsize;
        _this._materialpoint = _this.dataService.pointradius;
        _this.alight = _this.dataService.getalight();
        _this.hue = _this.dataService.hue;
        _this.saturation = _this.dataService.saturation;
        _this.lightness = _this.dataService.lightness;
        return _this;
    }
    GroupsComponent.prototype.ngOnInit = function () {
        this.model = this.dataService.getGsModel();
        this.updateModel();
        this.gridVisible = this.dataService.grid;
        this.axisVisible = this.dataService.axis;
        this.shadowVisible = this.dataService.shadow;
        this.frameVisible = this.dataService.frame;
        this.pointVisible = this.dataService.point;
        if (this._centerx === undefined || this._centerx === 0) {
            this._centerx = 0;
        }
        else {
            this._centerx = this.dataService.centerx;
        }
        if (this._centery === undefined || this._centery === 0) {
            this._centery = 0;
        }
        else {
            this._centery = this.dataService.centery;
        }
        if (this._centerz === undefined || this._centerz === 0) {
            this._centerz = 0;
        }
        else {
            this._centerz = this.dataService.centerz;
        }
        if (this._centersize === undefined || this._centersize === 100) {
            this._centersize = 100;
        }
        else {
            this._centersize = this.dataService.centersize;
        }
        this.raycaster = this.dataService.getraycaster();
        if (this._linepre === undefined || this._linepre === 0.05) {
            this._linepre = 0.05;
        }
        else {
            this._linepre = this.raycaster.linePrecision;
        }
        if (this._pointsize === undefined || this._pointsize === 1) {
            this._pointsize = 1;
        }
        else {
            this._pointsize = this.dataService.pointsize;
        }
        if (this._materialpoint === undefined || this._materialpoint === 0.1) {
            this._materialpoint = 0.1;
        }
        else {
            this._materialpoint = this.dataService.pointradius;
        }
        if (this.hue === undefined || this.hue === 0) {
            this.hue = 0;
        }
        else {
            this.hue = this.dataService.hue;
        }
        if (this.saturation === undefined || this.saturation === 0.01) {
            this.saturation = 0.01;
        }
        else {
            this.saturation = this.dataService.saturation;
        }
        if (this.lightness == undefined || this.lightness === 0.47) {
            this.lightness = 0.47;
        }
        else {
            this.lightness = this.dataService.lightness;
        }
    };
    GroupsComponent.prototype.notify = function (message) {
        if (message == "model_update" && this.scene) {
            this.ngOnInit();
        }
    };
    GroupsComponent.prototype.updateModel = function () {
        if (this.model !== undefined) {
            try {
                this.scene_and_maps = this.dataService.getscememaps();
                this.getgroupname();
            }
            catch (ex) {
                console.error("Error displaying model:", ex);
            }
        }
    };
    GroupsComponent.prototype.animate = function (self) {
    };
    GroupsComponent.prototype.changegrid = function () {
        this.gridVisible = !this.gridVisible;
        if (this.gridVisible) {
            var gridhelper = new three__WEBPACK_IMPORTED_MODULE_0__["GridHelper"](this._centersize, 10);
            gridhelper.name = "GridHelper";
            var vector = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](0, 1, 0);
            gridhelper.lookAt(vector);
            gridhelper.position.set(this._centerx, this._centery, this._centerz);
            this.scene.add(gridhelper);
        }
        else {
            this.scene.remove(this.scene.getObjectByName("GridHelper"));
        }
        this.renderer.render(this.scene, this.camera);
        this.dataService.addgrid(this.gridVisible);
    };
    GroupsComponent.prototype.changepoint = function () {
        this.pointVisible = !this.pointVisible;
        var children = [];
        for (var i = 0; i < this.scene.children.length; i++) {
            if (this.scene.children[i].type === "Scene") {
                for (var j = 0; j < this.scene.children[i].children.length; j++) {
                    if (this.scene.children[i].children[j].type === "Points") {
                        children.push(this.scene.children[i].children[j]);
                    }
                }
            }
        }
        if (this.pointVisible) {
            for (var i = 0; i < children.length; i++) {
                children[i]["material"].transparent = false;
                children[i]["material"].opacity = 1;
            }
        }
        else {
            for (var i = 0; i < children.length; i++) {
                children[i]["material"].transparent = true;
                children[i]["material"].opacity = 0;
            }
        }
        this.renderer.render(this.scene, this.camera);
        this.dataService.addpoint(this.pointVisible);
    };
    GroupsComponent.prototype.changeaxis = function () {
        this.axisVisible = !this.axisVisible;
        if (this.axisVisible) {
            var axishelper = new three__WEBPACK_IMPORTED_MODULE_0__["AxesHelper"](10);
            axishelper.name = "AxisHelper";
            this.scene.add(axishelper);
        }
        else {
            this.scene.remove(this.scene.getObjectByName("AxisHelper"));
        }
        this.renderer.render(this.scene, this.camera);
        this.dataService.addaxis(this.axisVisible);
    };
    GroupsComponent.prototype.changeshadow = function () {
        this.shadowVisible = !this.shadowVisible;
        for (var i = 0; i < this.scene.children.length; i++) {
            if (this.scene.children[i].type === "DirectionalLight") {
                if (this.shadowVisible) {
                    this.scene.children[i].castShadow = true;
                }
                else {
                    this.scene.children[i].castShadow = false;
                }
            }
        }
        this.renderer.render(this.scene, this.camera);
        this.dataService.addshadow(this.shadowVisible);
    };
    GroupsComponent.prototype.changeframe = function () {
        this.frameVisible = !this.frameVisible;
        if (this.frameVisible) {
            for (var i = 0; i < this.scene.children.length; i++) {
                if (this.scene.children[i].type === "Scene") {
                    if (this.scene.children[i].children[0].type === "Mesh") {
                        this.scene.children[i].children[0].visible = false;
                    }
                }
            }
        }
        else {
            for (var i = 0; i < this.scene.children.length; i++) {
                if (this.scene.children[i].type === "Scene") {
                    if (this.scene.children[i].children[0].type === "Mesh") {
                        this.scene.children[i].children[0].visible = true;
                    }
                }
            }
        }
        this.renderer.render(this.scene, this.camera);
        this.dataService.addframe(this.frameVisible);
    };
    GroupsComponent.prototype.changecenter = function (centerx, centery, centerz) {
        if (this.gridVisible) {
            var gridhelper = this.scene.getObjectByName("GridHelper");
            gridhelper.position.set(centerx, centery, centerz);
            this._centerx = centerx;
            this._centery = centery;
            this._centerz = centerz;
            this.dataService.getcenterx(centerx);
            this.dataService.getcentery(centery);
            this.dataService.getcenterz(centerz);
        }
        this.renderer.render(this.scene, this.camera);
    };
    GroupsComponent.prototype.changecentersize = function (centersize) {
        if (this.gridVisible) {
            this._centersize = centersize;
            this.scene.remove(this.scene.getObjectByName("GridHelper"));
            var gridhelper = new three__WEBPACK_IMPORTED_MODULE_0__["GridHelper"](centersize, centersize);
            gridhelper.name = "GridHelper";
            var vector = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](0, 1, 0);
            gridhelper.lookAt(vector);
            gridhelper.position.set(this._centerx, this._centery, this._centerz);
            this.scene.add(gridhelper);
            this.dataService.getcentersize(centersize);
        }
        this.renderer.render(this.scene, this.camera);
    };
    GroupsComponent.prototype.getcenter = function () {
        for (var i = 0; i < this.scene.children.length; i++) {
            if (this.scene.children[i].type === "Scene") {
                for (var j = 0; j < this.scene.children[i].children.length; j++) {
                    if (this.scene.children[i].children[j].name === "All points") {
                        var center = this.scene.children[i].children[j]["geometry"].boundingSphere.center;
                        var radius = this.scene.children[i].children[j]["geometry"].boundingSphere.radius;
                        var max = Math.ceil(radius + Math.max(Math.abs(center.x), Math.abs(center.y), Math.abs(center.z))) * 2;
                        this._centerx = center.x;
                        this._centery = center.y;
                        this._centerz = center.z;
                        this._centersize = max;
                    }
                }
            }
        }
        this.scene.remove(this.scene.getObjectByName("GridHelper"));
        var gridhelper = new three__WEBPACK_IMPORTED_MODULE_0__["GridHelper"](this._centersize, 10);
        gridhelper.name = "GridHelper";
        var vector = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](0, 1, 0);
        gridhelper.lookAt(vector);
        gridhelper.position.set(this._centerx, this._centery, this._centerz);
        this.scene.add(gridhelper);
        this.dataService.getcenterx(this._centerx);
        this.dataService.getcentery(this._centery);
        this.dataService.getcenterz(this._centerz);
        this.dataService.getcentersize(this._centersize);
        this.renderer.render(this.scene, this.camera);
    };
    //chiange line precision
    GroupsComponent.prototype.changeline = function (lineprecision) {
        this._linepre = lineprecision;
        this.raycaster = this.dataService.getraycaster();
        this.raycaster.linePrecision = lineprecision;
        this.dataService.addraycaster(this.raycaster);
        if (this.dataService.SelectVisible === 'Edges' || this.dataService.SelectVisible === 'Wires') {
            for (var i = 0; i < this.scene.children.length; i++) {
                if (this.scene.children[i].name === "sphereInter") {
                    var geometry = new three__WEBPACK_IMPORTED_MODULE_0__["SphereGeometry"](lineprecision * 15);
                    this.scene.children[i]["geometry"] = geometry;
                }
            }
        }
        this.renderer.render(this.scene, this.camera);
    };
    //change points size
    GroupsComponent.prototype.changepointsize = function (pointsize) {
        this._pointsize = pointsize;
        for (var i = 0; i < this.scene.children.length; i++) {
            if (this.scene.children[i].name === "Scene") {
                for (var j = 0; j < this.scene.children[i].children.length; j++) {
                    if (this.scene.children[i].children[j].name === "All points") {
                        this.scene.children[i].children[j]["material"].size = pointsize * 10;
                    }
                }
            }
            if (this.scene.children[i].name === "selects" && this.scene.children[i].type === "Points") {
                this.scene.children[i]["material"].size = pointsize;
            }
        }
        this.renderer.render(this.scene, this.camera);
        this.dataService.getpointsize(pointsize);
        //this.dataService.getmaterialpoint(pointsize);
    };
    //change radius
    GroupsComponent.prototype.changeradius = function (point) {
        this._materialpoint = point;
        if (this.dataService.SelectVisible !== 'Edges' && this.dataService.SelectVisible !== 'Wires') {
            for (var i = 0; i < this.scene.children.length; i++) {
                if (this.scene.children[i].name === "sphereInter") {
                    var geometry = new three__WEBPACK_IMPORTED_MODULE_0__["SphereGeometry"](point * 10);
                    this.scene.children[i]["geometry"] = geometry;
                }
            }
        }
        this.renderer.render(this.scene, this.camera);
        this.dataService.getradius(point);
    };
    GroupsComponent.prototype.changelight = function (_hue, _saturation, _lightness) {
        this.hue = _hue;
        this.saturation = _saturation;
        this.lightness = _lightness;
        var alight = this.alight;
        this.dataService.gethue(_hue);
        this.dataService.getsaturation(_saturation);
        this.dataService.getlightness(_lightness);
        this.alight.color.setHSL(_hue, _saturation, _lightness);
        this.renderer.render(this.scene, this.camera);
    };
    GroupsComponent.prototype.getgroupname = function () {
        this.groups = [];
        var allgroup = this.model.getAllGroups();
        for (var i = 0; i < allgroup.length; i++) {
            var group = {};
            group.parent = allgroup[i].getParentGroup().getName();
            group.props = allgroup[i].getProps();
            group.name = allgroup[i].getName();
            group.num_point = allgroup[i].getPoints().length;
            group.points = allgroup[i].getPoints();
            group.num_vertice = allgroup[i].getTopos(gs_json__WEBPACK_IMPORTED_MODULE_3__["EGeomType"].vertices).length;
            group.vertices = allgroup[i].getTopos(gs_json__WEBPACK_IMPORTED_MODULE_3__["EGeomType"].vertices);
            group.num_edge = allgroup[i].getTopos(gs_json__WEBPACK_IMPORTED_MODULE_3__["EGeomType"].edges).length;
            group.edges = allgroup[i].getTopos(gs_json__WEBPACK_IMPORTED_MODULE_3__["EGeomType"].edges);
            group.num_wire = allgroup[i].getTopos(gs_json__WEBPACK_IMPORTED_MODULE_3__["EGeomType"].wires).length;
            group.wires = allgroup[i].getTopos(gs_json__WEBPACK_IMPORTED_MODULE_3__["EGeomType"].wires);
            group.num_face = allgroup[i].getTopos(gs_json__WEBPACK_IMPORTED_MODULE_3__["EGeomType"].faces).length;
            group.faces = allgroup[i].getTopos(gs_json__WEBPACK_IMPORTED_MODULE_3__["EGeomType"].faces);
            group.num_object = allgroup[i].getObjs().length;
            group.objects = allgroup[i].getObjs();
            group.child = null;
            this.groups.push(group);
        }
        this.addchildren();
        //this.renderer.render(this.scene, this.camera);
    };
    GroupsComponent.prototype.addchildren = function () {
        for (var i = 0; i < this.groups.length; i++) {
            if (this.groups[i].parent !== null) {
                for (var j = 0; j < this.groups.length; j++) {
                    if (this.groups[i].parent === this.groups[j].name) {
                        this.groups[j].child = this.groups[i];
                    }
                }
            }
        }
    };
    GroupsComponent.prototype.selectpoint = function (group) {
        if (group.point !== 0 || group.child.num_point !== 0) {
            var pointinitial = false;
            var grouppoints = void 0;
            ;
            if (group.point !== 0) {
                grouppoints = group.points;
                for (var j = 0; j < this.scene.children.length; j++) {
                    for (var i = 0; i < grouppoints.length; i++) {
                        if (grouppoints[i].getLabel() === this.scene.children[j].userData.id) {
                            pointinitial = true;
                            this.scene.remove(this.scene.children[j]);
                        }
                    }
                }
            }
            if (group.child.num_point !== 0) {
                grouppoints = group.child.points;
                for (var j = 0; j < this.scene.children.length; j++) {
                    for (var i = 0; i < grouppoints.length; i++) {
                        if (grouppoints[i].getLabel() === this.scene.children[j].userData.id) {
                            pointinitial = true;
                            this.scene.remove(this.scene.children[j]);
                        }
                    }
                }
            }
            if (pointinitial === false) {
                for (var i = 0; i < grouppoints.length; i++) {
                    var point = {};
                    var label = grouppoints[i].getLabel();
                    //let id:string=grouppoints[i]._id;
                    var id = grouppoints[i].getID();
                    var verts_xyz = grouppoints[i].getLabelCentroid();
                    var geometry = new three__WEBPACK_IMPORTED_MODULE_0__["Geometry"]();
                    geometry.vertices.push(new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](verts_xyz[0], verts_xyz[1], verts_xyz[2]));
                    var pointsmaterial = new three__WEBPACK_IMPORTED_MODULE_0__["PointsMaterial"]({ color: 0x00ff00, size: 2 });
                    if (this.dataService.pointsize !== undefined) {
                        pointsmaterial.size = this.dataService.pointsize;
                    }
                    var points = new three__WEBPACK_IMPORTED_MODULE_0__["Points"](geometry, pointsmaterial);
                    points.userData.id = label;
                    //points["material"].needsUpdate=true;
                    points.name = "selects";
                    this.scene.add(points);
                    point.label = label;
                    point.id = id;
                    point.label_xyz = verts_xyz;
                    point.path = id;
                    point.type = "All points";
                }
            }
        }
    };
    GroupsComponent.prototype.selectvertice = function (group) {
        if (group.vertice !== 0) {
            var vertixinitial = false;
            var groupvertices = group.vertices;
            for (var j = 0; j < this.scene.children.length; j++) {
                for (var i = 0; i < groupvertices.length; i++) {
                    if (groupvertices[i].getLabel() === this.scene.children[j].userData.id) {
                        vertixinitial = true;
                        this.scene.remove(this.scene.children[j]);
                    }
                }
            }
            if (vertixinitial === false) {
                for (var i = 0; i < groupvertices.length; i++) {
                    var point = [];
                    var label = groupvertices[i].getLabel();
                    var id = groupvertices[i].getPoint().getID();
                    var verts_xyz = groupvertices[i].getLabelCentroid();
                    var geometry = new three__WEBPACK_IMPORTED_MODULE_0__["Geometry"]();
                    geometry.vertices.push(new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](verts_xyz[0], verts_xyz[1], verts_xyz[2]));
                    var pointsmaterial = new three__WEBPACK_IMPORTED_MODULE_0__["PointsMaterial"]({ color: 0x00ff00, size: 2 });
                    if (this.dataService.pointsize !== undefined) {
                        pointsmaterial.size = this.dataService.pointsize;
                    }
                    var points = new three__WEBPACK_IMPORTED_MODULE_0__["Points"](geometry, pointsmaterial);
                    points.userData.id = label;
                    //points["material"].needsUpdate=true;
                    points.name = "selects";
                    this.scene.add(points);
                    point.label = label;
                    point.id = id;
                    point.label_xyz = verts_xyz;
                    point.path = id;
                    point.type = "All points";
                }
            }
        }
    };
    GroupsComponent.prototype.selectedge = function (group) {
        if (group.edge !== 0) {
            var edgeinitial = false;
            var groupedges = group.edges;
            for (var j = 0; j < this.scene.children.length; j++) {
                for (var i = 0; i < groupedges.length; i++) {
                    if (groupedges[i].getLabel() === this.scene.children[j].userData.id) {
                        edgeinitial = true;
                        this.scene.remove(this.scene.children[j]);
                    }
                }
            }
            if (edgeinitial === false) {
                for (var i = 0; i < groupedges.length; i++) {
                    var edge = [];
                    var label = groupedges[i].getLabel();
                    var id = groupedges[i].getLabel();
                    var label_xyz = groupedges[i].getLabelCentroid();
                    var verts = groupedges[i].getVertices();
                    var verts_xyz = verts.map(function (v) { return v.getPoint().getPosition(); });
                    var geometry = new three__WEBPACK_IMPORTED_MODULE_0__["Geometry"]();
                    for (var i = 0; i < verts_xyz.length; i++) {
                        geometry.vertices.push(new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](verts_xyz[i][0], verts_xyz[i][1], verts_xyz[i][2]));
                    }
                    var material = new three__WEBPACK_IMPORTED_MODULE_0__["LineBasicMaterial"]({ color: 0x00ff00, side: three__WEBPACK_IMPORTED_MODULE_0__["DoubleSide"] });
                    var line = new three__WEBPACK_IMPORTED_MODULE_0__["Line"](geometry, material);
                    line.userData.id = edge.getLabel();
                    //line["material"].needsUpdate=true;
                    line.name = "selects";
                    this.scene.add(line);
                }
            }
        }
    };
    GroupsComponent.prototype.selectwire = function (group) {
        if (group.wire !== 0) {
            var groupwires = group.wires;
            var wireinitial = false;
            for (var j = 0; j < this.scene.children.length; j++) {
                for (var i = 0; i < groupwires.length; i++) {
                    if (groupwires[i].getLabel() === this.scene.children[j].userData.id) {
                        wireinitial = true;
                        this.scene.remove(this.scene.children[j]);
                    }
                }
            }
            if (wireinitial === false) {
                for (var i = 0; i < groupwires.length; i++) {
                    var wire = [];
                    var label = groupwires[i].getLabel();
                    var label_xyz = groupwires[i].getLabelCentroid();
                    var verts = groupwires[i].getVertices();
                    var verts_xyz = verts.map(function (v) { return v.getPoint().getPosition(); });
                    if (groupwires[i].isClosed()) {
                        verts_xyz.push(verts_xyz[0]);
                    }
                    var geometry = new three__WEBPACK_IMPORTED_MODULE_0__["Geometry"]();
                    for (var i = 0; i < verts_xyz.length; i++) {
                        geometry.vertices.push(new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](verts_xyz[i][0], verts_xyz[i][1], verts_xyz[i][2]));
                    }
                    var material = new three__WEBPACK_IMPORTED_MODULE_0__["LineBasicMaterial"]({ color: 0x00ff00, side: three__WEBPACK_IMPORTED_MODULE_0__["DoubleSide"] });
                    var line = new three__WEBPACK_IMPORTED_MODULE_0__["Line"](geometry, material);
                    line.userData.id = label;
                    //line["material"].needsUpdate=true;
                    line.name = "selects";
                    this.scene.add(line);
                }
            }
        }
    };
    GroupsComponent.prototype.selectface = function (group) {
        if (group.face !== 0) {
            var groupfaces = group.faces;
            var faceinitial = false;
            for (var j = 0; j < this.scene.children.length; j++) {
                for (var i = 0; i < groupfaces.length; i++) {
                    if (groupfaces[i].getLabel() === this.scene.children[j].userData.id) {
                        faceinitial = true;
                        this.scene.remove(this.scene.children[j]);
                    }
                }
            }
            if (faceinitial === false) {
                for (var i = 0; i < groupfaces.length; i++) {
                    var face = [];
                    var label = groupfaces[i].getLabel();
                    var label_xyz = face.getLabelCentroid();
                    var verts = face.getVertices();
                    var verts_xyz = verts.map(function (v) { return v.getPoint().getPosition(); });
                    var geometry = new three__WEBPACK_IMPORTED_MODULE_0__["Geometry"]();
                    for (var i = 0; i < verts_xyz.length; i++) {
                        geometry.vertices.push(new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](verts_xyz[i][0], verts_xyz[i][1], verts_xyz[i][2]));
                    }
                    var material = new three__WEBPACK_IMPORTED_MODULE_0__["LineBasicMaterial"]({ color: 0x00ff00, side: three__WEBPACK_IMPORTED_MODULE_0__["DoubleSide"] });
                    var line = new three__WEBPACK_IMPORTED_MODULE_0__["Line"](geometry, material);
                    line.userData.id = face.getLabel();
                    //line["material"].needsUpdate=true;
                    line.name = "selects";
                    this.scene.add(line);
                }
            }
        }
    };
    GroupsComponent.prototype.selectobject = function (group) {
        if (group.face !== 0) {
            this.selectface(group);
        }
        else if (group.wire !== 0) {
            this.selectwire(group);
        }
        else if (group.edge !== 0) {
            this.selectedge(group);
        }
        else if (group.point !== 0) {
            this.selectpoint(group);
        }
    };
    GroupsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-groups',
            template: __webpack_require__(/*! ./groups.component.html */ "./src/app/mViewer/viewers/gs-viewer/toolwindow/groups.component.html"),
            styles: [__webpack_require__(/*! ./groups.component.css */ "./src/app/mViewer/viewers/gs-viewer/toolwindow/groups.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injector"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"]])
    ], GroupsComponent);
    return GroupsComponent;
}(_data_DataSubscriber__WEBPACK_IMPORTED_MODULE_2__["DataSubscriber"]));



/***/ }),

/***/ "./src/app/mViewer/viewers/gs-viewer/toolwindow/toolwindow.component.css":
/*!*******************************************************************************!*\
  !*** ./src/app/mViewer/viewers/gs-viewer/toolwindow/toolwindow.component.css ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#toolwindow{\r\n  background-color:white;\r\n  font-family:sans-serif;\r\n  width: 100%;\r\n  position:relative;\r\n}\r\n#gsattri-bar{\r\n  background-color: #f1f1f1 !important;\r\n  position:relative;\r\n  display: inline-flex;\r\n  width: 100%;\r\n}\r\n#toolbar{\r\n  background-color: #f1f1f1 !important;\r\n  width: 48%;\r\n  height: 30px;\r\n  margin:0px;\r\n  overflow: hidden !important;\r\n  font-family:sans-serif;\r\n  position: relative !important;\r\n}\r\n#pagination{\r\n  width: 48%;\r\n  height: 30px;\r\n  position: relative ;\r\n  top:unset !important;\r\n  margin: 0px;\r\n  background-color: #f1f1f1 !important;\r\n}\r\n.table_ojbs{\r\n  table-layout:fixed;\r\n  overflow-x: scroll !important;\r\n  font-family:sans-serif;\r\n}\r\n.Number{\r\n  overflow:hidden; \r\n  white-space:nowrap; \r\n}\r\n#toolview{\r\n  position:relative;\r\n  margin-top: 0px;\r\n  width: 100%;\r\n  float: left;\r\n}\r\n#selectedname{\r\n  font-size: 12px;\r\n  vertical-align: middle;\r\n}\r\n#gsv-point{\r\n  margin-left:25px;\r\n}\r\n#gsv-selected{\r\n  margin-left:30px;\r\n}\r\n.gsv-toolbar{\r\n  font-size:15px;\r\n  background-color:transparent;\r\n  border:0;\r\n  font-family:sans-serif;\r\n  padding-top:1px;\r\n  padding-right: 6px;\r\n  padding-bottom: 1px;\r\n  padding-left: 6px;\r\n  align-items: flex-start;\r\n  text-align: center;\r\n  cursor: default;\r\n  color: unset;\r\n  margin-right: 0px;\r\n  margin-left: 0px;\r\n  margin-bottom: 1px;\r\n  margin-top: 1px;\r\n  box-sizing: border-box;\r\n  border-width: unset;\r\n  border-style: unset;\r\n  border-color: unset;\r\n  -o-border-image: unset;\r\n     border-image: unset;\r\n}\r\n.visible{\r\n  background-color: white !important;\r\n  color:#395d73;\r\n}\r\n.selectvisible{\r\n  background-color:  white !important;\r\n  color:#395d73;\r\n}\r\n#table{\r\n  width:100% ;\r\n  height: 15px;\r\n}\r\n#tablename{\r\n  width:100% ;\r\n  height: 15px;\r\n  color:grey;\r\n}\r\n.table_text{\r\n  width:180px;\r\n  word-wrap:break-word;\r\n  font-weight: normal;\r\n}\r\n#numberbutton{\r\n  width:100%;\r\n  border:0;\r\n}\r\n#attrib{\r\n  overflow: hidden !important;\r\n  text-overflow: ellipsis !important;\r\n  table-layout:fixed !important;\r\n  white-space: nowrap !important;\r\n}\r\n/*.selectid{\r\n  background-color:#66CCFF;\r\n}*/\r\n#select{\r\n  position: relative;\r\n  float:right;\r\n  margin-right: 30px;\r\n}\r\n.my-pagination /deep/ .ngx-pagination{\r\n  margin:0px !important;\r\n  color:black !important;\r\n  float: right;\r\n  margin-right:20px !important;\r\n}\r\n.my-pagination /deep/ .ngx-pagination .current {\r\n  margin-top:0px;\r\n  color:black;\r\n  background-color: white;\r\n}\r\n"

/***/ }),

/***/ "./src/app/mViewer/viewers/gs-viewer/toolwindow/toolwindow.component.html":
/*!********************************************************************************!*\
  !*** ./src/app/mViewer/viewers/gs-viewer/toolwindow/toolwindow.component.html ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"toolwindow\">\r\n  <div id=\"gsattri-bar\" >\r\n  <div id=\"toolbar\">\r\n    <div style=\"width: 350px;position: relative;\">\r\n    <button id=\"gsv-point\" class=\"gsv-toolbar\" [class.visible]=\"Visible === 'Points'\" (click)=\"point(Visible)\"><span matTooltip=\"View Point Attributes\">P</span></button>\r\n    <button id=\"gsv-vertice\" class=\"gsv-toolbar\" [class.visible]=\"Visible === 'Vertices'\" (click)=\"vertice(Visible)\"><span matTooltip=\"View Vertice Attributes\">V</span></button>\r\n    <button id=\"gsv-edge\" class=\"gsv-toolbar\" [class.visible]=\"Visible === 'Edges'\" (click)=\"edge(Visible)\"><span matTooltip=\"View Edge Attributes\">E</span></button>\r\n    <button id=\"gsv-wire\" class=\"gsv-toolbar\" [class.visible]=\"Visible === 'Wires'\" (click)=\"wire(Visible)\"><span matTooltip=\"View Wire Attributes\">W</span></button>\r\n    <button id=\"gsv-face\" class=\"gsv-toolbar\" [class.visible]=\"Visible === 'Faces'\" (click)=\"face(Visible)\"><span matTooltip=\"View Face Attributes\">F</span></button>\r\n    <button id=\"gsv-object\" class=\"gsv-toolbar\" [class.visible]=\"Visible === 'Objs'\" (click)=\"object(Visible)\"><span matTooltip=\"View Object Attributes\">O</span></button>\r\n    <input id=\"gsv-selected\" class=\"gsv-toolbar\" type=\"checkbox\" (click)=\"changeselected()\">\r\n    <label id=\"selectedname\" value=\"selected\">Show selected only</label>\r\n  </div>\r\n  </div>\r\n  <div id=\"pagination\" >\r\n    <pagination-controls *ngIf=\"Visible === 'Points'\" class=\"my-pagination\" (pageChange)=\"p1 = $event\"></pagination-controls> \r\n    <pagination-controls *ngIf=\"Visible === 'Vertices'\" class=\"my-pagination\" (pageChange)=\"p2 = $event\"></pagination-controls> \r\n    <pagination-controls *ngIf=\"Visible === 'Edges'\" class=\"my-pagination\" (pageChange)=\"p3 = $event\"></pagination-controls> \r\n    <pagination-controls *ngIf=\"Visible === 'Wires'\" class=\"my-pagination\" (pageChange)=\"p4 = $event\"></pagination-controls> \r\n    <pagination-controls *ngIf=\"Visible === 'Faces'\" class=\"my-pagination\" (pageChange)=\"p5 = $event\"></pagination-controls>\r\n    <pagination-controls *ngIf=\"Visible === 'Objs'\" class=\"my-pagination\" (pageChange)=\"p6 = $event\"></pagination-controls>  \r\n  </div>\r\n</div>\r\n  <div id=\"toolview\">\r\n    <div *ngIf=\"Visible === 'Points'\">\r\n      <table matSort border=\"1\" cellspacing=\"0\" cellpadding=\"0\" bordercolor=\"#d0d0d0\" (matSortChange)=\"sortData($event)\">\r\n        <tr>\r\n          <th mat-sort-header=\"id\" align=center width=\"180px\"><div class=\"table_text\" >Points ID <input type=\"checkbox\" id=\"id\" class=\"checkbox\" style=\"float:right\" [checked]=\"checkpointid\" (click)=\"checkbox()\"></div></th>\r\n          <th mat-sort-header=\"x\" width=\"180px\" align=center><div class=\"table_text\">X<input type=\"checkbox\" style=\"float:right\" id=\"X\"  class=\"checkbox\" [checked]=\"checkX\" (click)=\"checkbox()\"></div></th>\r\n          <th mat-sort-header=\"y\" width=\"180px\" align=center><div class=\"table_text\">Y<input type=\"checkbox\" style=\"float:right\" id=\"Y\" class=\"checkbox\" [checked]=\"checkY\" (click)=\"checkbox()\"></div></th>\r\n          <th mat-sort-header=\"z\" width=\"180px\" align=center><div class=\"table_text\">Z<input type=\"checkbox\" style=\"float:right\" id=\"Z\" class=\"checkbox\" [checked]=\"checkZ\" (click)=\"checkbox()\"></div></th>\r\n          <th mat-sort-header={{name}} align=center width=\"180px\" class=\"checkbox\" *ngFor=\"let name of point_name;let idx=index\"><div class=\"table_text\" >{{name}}<input type=\"checkbox\" id={{name}} style=\"float:right\" (click)=\"checkbox()\"></div></th>\r\n      <!-- </table>\r\n      <table border=\"1\" cellspacing=\"0\" cellpadding=\"0\"  bordercolor=\"#d0d0d0\" *ngFor=\"let datascale of attribute| paginate: { itemsPerPage: 50, currentPage: p1 }\"> -->\r\n        <tr  *ngFor=\"let datascale of attribute| paginate: { itemsPerPage: 50, currentPage: p1 }\">\r\n          <td name=\"Number\" align=center  width=\"180px\"><div class=\"table_text\"><button width=\"180px\" id=\"numberbutton\" (click)=Onselect(datascale)>{{datascale.id}}</button></div></td>\r\n          <td width=\"180px\" align=center><div class=\"table_text\">{{datascale.x}}</div></td>\r\n          <td width=\"180px\" align=center><div class=\"table_text\">{{datascale.y}}</div></td>\r\n          <td width=\"180px\" align=center><div class=\"table_text\">{{datascale.z}}</div></td>\r\n          <td  id=\"attrib\" width=\"180px\" align=center *ngFor=\"let name of point_name; let idx=index\"><div class=\"table_text\" >{{datascale[idx]}}</div></td> \r\n        <tr>\r\n      </table>\r\n    </div>\r\n    <div *ngIf=\"Visible === 'Vertices'\">\r\n      <table matSort border=\"1\" cellspacing=\"0\" cellpadding=\"0\" bordercolor=\"#d0d0d0\" (matSortChange)=\"sortData($event)\">\r\n        <tr>\r\n          <th mat-sort-header=\"vertixlabel\" align=center width=\"180px\"><div class=\"table_text\">Vertices Label<input type=\"checkbox\" id=\"vertixid\" style=\"float:right\" [checked]=\"vertixid\" (click)=\"checkbox()\"></div></th>\r\n          <th mat-sort-header=\"pointid\" align=center width=\"180px\"><div class=\"table_text\">Points ID<input type=\"checkbox\" id=\"pointid\" style=\"float:right\"  [checked]=\"pointid\" (click)=\"checkbox()\"></div></th>\r\n          <th mat-sort-header={{name}} align=center width=\"180px\" *ngFor=\"let name of vertex_name\"><div class=\"table_text\">{{name}}<input type=\"checkbox\" id={{name}} style=\"float:right\" (click)=\"checkbox()\"></div></th>\r\n        </tr>\r\n      <!-- </table>\r\n      <table border=\"1\" cellspacing=\"0\" cellpadding=\"0\" bordercolor=\"#d0d0d0\" *ngFor=\"let datascale of attribute| paginate: { itemsPerPage: 50, currentPage: p2 }\"> -->\r\n        <tr *ngFor=\"let datascale of attribute| paginate: { itemsPerPage: 50, currentPage: p2 }\">\r\n          <td name=\"Number\" align=center  width=\"180px\"><div class=\"table_text\"><button  id=\"numberbutton\">{{datascale.vertixlabel}}</button></div></td>\r\n          <td  align=center  width=\"180px\"><div class=\"table_text\">{{datascale.pointid}}</div></td>\r\n          <td  id=\"attrib\" width=\"180px\" align=center *ngFor=\"let name of vertex_name; let idx=index\"><div sclass=\"table_text\">{{datascale[idx]}}</div></td> \r\n        </tr>\r\n      </table>\r\n    </div>\r\n    <div *ngIf=\"Visible === 'Edges'\">\r\n      <table matSort border=\"1\" cellspacing=\"0\" cellpadding=\"0\"  bordercolor=\"#d0d0d0\" (matSortChange)=\"sortData($event)\">\r\n        <tr>\r\n          <th mat-sort-header=\"label\" align=center width=\"180px\"><div class=\"table_text\">Edge ID<input type=\"checkbox\" style=\"float:right\" id=\"edgeid\" (click)=\"checkbox()\"></div></th>\r\n          <th mat-sort-header={{name}} align=center width=\"180px\" *ngFor=\"let name of edge_name\"><div class=\"table_text\">{{name}}<input type=\"checkbox\" style=\"float:right\" id={{name}} (click)=\"checkbox()\"></div></th> \r\n        </tr>\r\n      <!--</table>\r\n       <table border=\"1\" cellspacing=\"0\" cellpadding=\"0\"  bordercolor=\"#d0d0d0\" *ngFor=\"let datascale of attribute| paginate: { itemsPerPage: 50, currentPage: p3 }\" > -->\r\n        <tr *ngFor=\"let datascale of attribute| paginate: { itemsPerPage: 50, currentPage: p3 }\">\r\n          <td name=\"Number\" align=center  width=\"180px\"><div class=\"table_text\"><button  id=\"numberbutton\">{{datascale.label}}</button></div></td>\r\n          <td  id=\"attrib\" width=\"180px\" align=center *ngFor=\"let name of edge_name; let idx=index\"><div class=\"table_text\">{{datascale[idx]}}</div></td>\r\n        </tr>\r\n      </table>\r\n    </div>\r\n    <div *ngIf=\"Visible === 'Wires'\">\r\n      <table matSort border=\"1\" cellspacing=\"0\" cellpadding=\"0\"  bordercolor=\"#d0d0d0\" (matSortChange)=\"sortData($event)\">\r\n        <tr>\r\n          <th mat-sort-header=\"label\" align=center width=\"180px\"><div class=\"table_text\">Wire ID<input type=\"checkbox\" style=\"float:right\" (click)=\"checkbox()\"></div></th>\r\n          <th mat-sort-header={{name}} align=center width=\"180px\" *ngFor=\"let name of wire_name\"><div class=\"table_text\">{{name}}<input type=\"checkbox\" style=\"float:right\" id={{name}} (click)=\"checkbox()\"></div></th> \r\n        </tr>\r\n      <!-- </table>\r\n      <table border=\"1\" cellspacing=\"0\" cellpadding=\"0\"  bordercolor=\"#d0d0d0\" *ngFor=\"let datascale of attribute| paginate: { itemsPerPage: 50, currentPage: p4 }\" > -->\r\n        <tr *ngFor=\"let datascale of attribute| paginate: { itemsPerPage: 50, currentPage: p4 }\">\r\n          <td name=\"Number\" align=center  width=\"180px\"><div class=\"table_text\"><button  id=\"numberbutton\">{{datascale.label}}</button></div></td>\r\n          <td  id=\"attrib\" width=\"180px\" align=center *ngFor=\"let name of wire_name; let idx=index\"><div class=\"table_text\">{{datascale[idx]}}</div></td>\r\n        </tr>\r\n      </table>\r\n    </div>\r\n    <div *ngIf=\"Visible === 'Faces'\">\r\n      <table matSort border=\"1\" cellspacing=\"0\" cellpadding=\"0\"  bordercolor=\"#d0d0d0\" (matSortChange)=\"sortData($event)\">\r\n        <tr>\r\n          <th mat-sort-header=\"label\" align=center width=\"180px\"><div class=\"table_text\">Face ID<input type=\"checkbox\" style=\"float:right\" id=\"checkface\" [checked]=\"checkface\" (click)=\"checkbox()\"></div></th>\r\n          <th mat-sort-header={{name}} align=center width=\"180px\" *ngFor=\"let name of face_name\"><div class=\"table_text\">{{name}}<input type=\"checkbox\" style=\"float:right\" id={{name}} (click)=\"checkbox()\"></div></th> \r\n        </tr>\r\n      <!-- </table>\r\n      <table border=\"1\" cellspacing=\"0\" cellpadding=\"0\"  bordercolor=\"#d0d0d0\" *ngFor=\"let datascale of attribute| paginate: { itemsPerPage: 50, currentPage: p5 }\" > -->\r\n        <tr *ngFor=\"let datascale of attribute| paginate: { itemsPerPage: 50, currentPage: p5 }\">\r\n          <td name=\"Number\" align=center  width=\"180px\"><div class=\"table_text\"><button  id=\"numberbutton\">{{datascale.label}}</button></div></td>\r\n          <td  id=\"attrib\" width=\"180px\" align=center *ngFor=\"let name of face_name; let idx=index\"><div class=\"table_text\">{{datascale[idx]}}</div></td>\r\n        </tr>\r\n      </table>\r\n    </div>\r\n    <div *ngIf=\"Visible === 'Objs'\">\r\n      <table matSort border=\"1\" cellspacing=\"0\" cellpadding=\"0\"  bordercolor=\"#d0d0d0\" class=\"table_ojbs\" (matSortChange)=\"sortData($event)\">\r\n        <tr>\r\n          <th mat-sort-header=\"label\" name=\"Number\" align=center width=\"180px\"><div class=\"table_text\">Object ID<input type=\"checkbox\" style=\"float:right\" id=\"checkobj\" [checked]=\"checkobj\" (click)=\"checkbox()\"></div></th>\r\n          <th mat-sort-header={{name}} align=center width=\"180px\" *ngFor=\"let name of obj_name\" ><div class=\"table_text\">{{name}}<input type=\"checkbox\" style=\"float:right\" (click)=\"checkbox()\"></div></th>\r\n        </tr>\r\n      <!-- </table>\r\n      <table border=\"1\" cellspacing=\"0\" cellpadding=\"0\"  bordercolor=\"#d0d0d0\" *ngFor=\"let datascale of attribute| paginate: { itemsPerPage: 50, currentPage: p6 } \" class=\"table_ojbs\" > -->\r\n        <tr *ngFor=\"let datascale of attribute| paginate: { itemsPerPage: 50, currentPage: p6 } \">\r\n          <td name=\"Number\" align=center  width=\"180px\"><div class=\"table_text\"><button  id=\"numberbutton\">{{datascale.label}}</button></div></td>\r\n          <td  id=\"attrib\" width=\"180px\" align=center *ngFor=\"let name of obj_name; let idx=index\"><div class=\"table_text\">{{datascale[idx]}}</div></td>\r\n        </tr>\r\n      </table>\r\n    </div>\r\n  </div>\r\n"

/***/ }),

/***/ "./src/app/mViewer/viewers/gs-viewer/toolwindow/toolwindow.component.ts":
/*!******************************************************************************!*\
  !*** ./src/app/mViewer/viewers/gs-viewer/toolwindow/toolwindow.component.ts ***!
  \******************************************************************************/
/*! exports provided: ToolwindowComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ToolwindowComponent", function() { return ToolwindowComponent; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var gs_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! gs-json */ "./node_modules/gs-json/dist2015/index.js");
/* harmony import */ var gs_json__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(gs_json__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _data_DataSubscriber__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../data/DataSubscriber */ "./src/app/mViewer/viewers/gs-viewer/data/DataSubscriber.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ToolwindowComponent = /** @class */ (function (_super) {
    __extends(ToolwindowComponent, _super);
    function ToolwindowComponent(injector, myElement) {
        var _this = _super.call(this, injector) || this;
        _this.Visible = "Objs";
        _this.scene = _this.dataService.getScene();
        _this.renderer = _this.dataService.getRenderer();
        _this.camera = _this.dataService.getCamera();
        _this.selectedVisible = false;
        _this.attribute = [];
        _this.selectObj = [];
        _this.checkname = [];
        _this.myElement = myElement;
        return _this;
    }
    ToolwindowComponent.prototype.ngOnInit = function () {
        this.model = this.dataService.getGsModel();
        this.Visible = this.dataService.visible;
        this.updateModel();
    };
    ToolwindowComponent.prototype.notify = function (message) {
        if (message == "model_update" && this.scene) {
            //this.updateModel();
            this.ngOnInit();
        }
        this.selectObj = [];
        for (var i = 0; i < this.dataService.selecting.length; i++) {
            for (var n = 0; n < this.scene.children.length; n++) {
                if (this.scene.children[n].type === "Scene") {
                    if (this.dataService.selecting[i].uuid === this.scene.children[n].children[0].uuid) {
                        this.selectObj.push(this.scene.children[n].children[0].parent);
                    }
                }
            }
        }
        if (this.selectedVisible == true) {
            if (this.Visible === "Objs")
                this.objectcheck();
            if (this.Visible === "Faces")
                this.facecheck();
            if (this.Visible === "Wires")
                this.wirecheck();
            if (this.Visible === "Edges")
                this.edgecheck();
            if (this.Visible === "Vertices")
                this.verticecheck();
            if (this.Visible === "Points")
                this.pointcheck();
        }
    };
    ToolwindowComponent.prototype.updateModel = function () {
        if (this.model !== undefined) {
            try {
                this.scene_and_maps = this.dataService.getscememaps();
                this.object(this.Visible);
                this.getvertices();
            }
            catch (ex) {
                console.error("Error displaying model:", ex);
            }
        }
    };
    ToolwindowComponent.prototype.getpoints = function () {
        var attrubtepoints = [];
        this.point_name = [];
        if (this.scene_and_maps !== undefined) {
            if (this.scene_and_maps.points_map !== null && this.scene_and_maps.points_map.size !== 0 && this.scene_and_maps.points_map !== undefined) {
                var point_attribs = this.model.findAttribs(gs_json__WEBPACK_IMPORTED_MODULE_2__["EGeomType"].points);
                if (point_attribs.length !== 0) {
                    for (var j = 0; j < point_attribs.length; j++) {
                        this.point_name.push(point_attribs[0].getName());
                    }
                }
                for (var i = 0; i < this.scene_and_maps.points_map.size; i++) {
                    var points = this.model.getGeom().getPoint(i);
                    var label = points.getLabel();
                    var verts_xyz = points.getLabelCentroid();
                    var attributepoint = [];
                    if (verts_xyz !== undefined) {
                        attributepoint.id = label;
                        attributepoint.x = verts_xyz[0];
                        attributepoint.y = verts_xyz[1];
                        attributepoint.z = verts_xyz[2];
                        if (point_attribs.length !== 0) {
                            for (var j = 0; j < point_attribs.length; j++) {
                                attributepoint[j] = points.getAttribValue(point_attribs[j]);
                            }
                        }
                        attrubtepoints.push(attributepoint);
                    }
                }
            }
        }
        return attrubtepoints;
    };
    ToolwindowComponent.prototype.getvertices = function () {
        var attributevertix = [];
        var points = this.getpoints();
        this.vertex_name = [];
        if (this.scene_and_maps !== undefined) {
            if (this.scene_and_maps.vertices_map !== null && this.scene_and_maps.vertices_map.size !== 0 && this.scene_and_maps.vertices_map !== undefined) {
                var vertex_attribs = this.model.findAttribs(gs_json__WEBPACK_IMPORTED_MODULE_2__["EGeomType"].vertices);
                if (vertex_attribs.length !== 0) {
                    for (var n = 0; n < vertex_attribs.length; n++) {
                        this.vertex_name.push(vertex_attribs[n].getName());
                    }
                }
                for (var i = 0; i < this.scene_and_maps.vertices_map.size; i++) {
                    var path = this.scene_and_maps.vertices_map.get(i);
                    var vertices = this.model.getGeom().getTopo(path);
                    var attributes = [];
                    var label = vertices.getLabel();
                    var verts_xyz = vertices.getLabelCentroid();
                    var attributes = [];
                    for (var j = 0; j < points.length; j++) {
                        if (points[j].x === verts_xyz[0] && points[j].y === verts_xyz[1] && points[j].z === verts_xyz[2]) {
                            attributes.pointid = points[j].id;
                        }
                    }
                    attributes.vertixlabel = label;
                    attributes.path = path;
                    if (vertex_attribs.length !== 0) {
                        for (var j = 0; j < vertex_attribs.length; j++) {
                            //attributes[j]=vertices.getAttribValue(vertex_attribs[j]);
                        }
                    }
                    attributevertix.push(attributes);
                }
                this.dataService.addattrvertix(attributevertix);
            }
        }
        return attributevertix;
    };
    ToolwindowComponent.prototype.getedges = function () {
        var attributeedge = [];
        this.edge_name = [];
        var edgelable = [];
        if (this.scene_and_maps !== undefined) {
            if (this.scene_and_maps.edges_map !== null && this.scene_and_maps.edges_map.size !== 0 && this.scene_and_maps.edges_map !== undefined) {
                var edge_attribs = this.model.findAttribs(gs_json__WEBPACK_IMPORTED_MODULE_2__["EGeomType"].edges);
                if (edge_attribs.length !== 0) {
                    for (var j = 0; j < edge_attribs.length; j++) {
                        this.edge_name.push(edge_attribs[j].getName());
                    }
                }
                for (var i = 0; i < this.scene_and_maps.edges_map.size; i++) {
                    var path = this.scene_and_maps.edges_map.get(i);
                    var edge = this.model.getGeom().getTopo(path);
                    var attributes = [];
                    var label = edge.getLabel();
                    attributes.label = label;
                    if (edgelable.indexOf(label) === -1) {
                        edgelable.push(label);
                        if (edge_attribs.length !== 0) {
                            for (var j = 0; j < edge_attribs.length; j++) {
                                //attributes[j]=edge.getAttribValue(edge_attribs[j]);
                            }
                        }
                        attributeedge.push(attributes);
                    }
                }
            }
        }
        return attributeedge;
    };
    ToolwindowComponent.prototype.getwires = function () {
        var attributewire = [];
        this.wire_name = [];
        var wirelabel = [];
        if (this.scene_and_maps !== undefined) {
            if (this.scene_and_maps.wires_map !== null && this.scene_and_maps.wires_map.size !== 0 && this.scene_and_maps.wires_map !== undefined) {
                var wire_attribs = this.model.findAttribs(gs_json__WEBPACK_IMPORTED_MODULE_2__["EGeomType"].wires);
                if (wire_attribs.length !== 0) {
                    for (var j = 0; j < wire_attribs.length; j++) {
                        this.wire_name.push(wire_attribs[j].getName());
                    }
                }
                for (var i = 0; i < this.scene_and_maps.wires_map.size; i++) {
                    var path = this.scene_and_maps.wires_map.get(i);
                    var wire = this.model.getGeom().getTopo(path);
                    var attributes = [];
                    var label = wire.getLabel();
                    attributes.label = label;
                    if (wirelabel.indexOf(label) === -1) {
                        wirelabel.push(label);
                        if (wire_attribs.length !== 0) {
                            for (var j = 0; j < wire_attribs.length; j++) {
                                attributes[j] = wire.getAttribValue(wire_attribs[j]);
                            }
                        }
                        attributewire.push(attributes);
                    }
                }
            }
        }
        return attributewire;
    };
    ToolwindowComponent.prototype.getfaces = function () {
        var attributeface = [];
        this.face_name = [];
        var facelabel = [];
        if (this.scene_and_maps !== undefined) {
            if (this.scene_and_maps.faces_map !== null && this.scene_and_maps.faces_map.size !== 0 && this.scene_and_maps.faces_map !== undefined) {
                var face_attribs = this.model.findAttribs(gs_json__WEBPACK_IMPORTED_MODULE_2__["EGeomType"].faces);
                if (face_attribs.length !== 0) {
                    for (var j = 0; j < face_attribs.length; j++) {
                        this.face_name.push(face_attribs[j].getName());
                    }
                }
                for (var i = 0; i < this.scene_and_maps.faces_map.size; i++) {
                    var path = this.scene_and_maps.faces_map.get(i);
                    var face = this.model.getGeom().getTopo(path);
                    var attributes = [];
                    var label = face.getLabel();
                    attributes.label = label;
                    if (facelabel.indexOf(label) === -1) {
                        facelabel.push(label);
                        if (face_attribs.length !== 0) {
                            for (var j = 0; j < face_attribs.length; j++) {
                                attributes[j] = face.getAttribValue(face_attribs[j]);
                            }
                        }
                        attributeface.push(attributes);
                    }
                }
            }
        }
        return attributeface;
    };
    ToolwindowComponent.prototype.getoject = function () {
        var attributeobject = [];
        this.obj_name = [];
        this.attrib_name = [];
        var atrib = [];
        if (this.scene_and_maps !== undefined) {
            if (this.scene_and_maps.faces_map !== null && this.scene_and_maps.faces_map.size !== 0 && this.scene_and_maps.faces_map !== undefined) {
                var obj_attribs = this.model.findAttribs(gs_json__WEBPACK_IMPORTED_MODULE_2__["EGeomType"].objs);
                if (obj_attribs.length !== 0) {
                    for (var j = 0; j < obj_attribs.length; j++) {
                        this.obj_name.push(obj_attribs[j].getName());
                        for (var i = 0; i < this.scene_and_maps.faces_map.size; i++) {
                            var path = this.scene_and_maps.faces_map.get(i);
                            var obj = this.model.getGeom().getObj(path.id);
                            atrib[j] = obj.getAttribValue(obj_attribs[j]);
                            this.attrib_name.push(atrib[j]);
                        }
                    }
                }
                for (var i = 0; i < this.scene_and_maps.faces_map.size; i++) {
                    var path = this.scene_and_maps.faces_map.get(i);
                    if (i === 0 || path.id !== this.scene_and_maps.faces_map.get(i - 1).id) {
                        var attribute = [];
                        var label = "o" + path.id;
                        attribute.label = label;
                        for (var j = 0; j < obj_attribs.length; j++) {
                            var obj = this.model.getGeom().getObj(path.id);
                            attribute[j] = obj.getAttribValue(obj_attribs[j]);
                        }
                        attributeobject.push(attribute);
                    }
                }
            }
        }
        return attributeobject;
    };
    ToolwindowComponent.prototype.getchildren = function () {
        var children;
        for (var i = 0; i < this.scene.children.length; i++) {
            if (this.scene.children[i].name == "Scene") {
                children = this.scene.children[i].children;
                break;
            }
            if (i == this.scene.children.length - 1) {
                return [];
            }
        }
        return children;
    };
    ToolwindowComponent.prototype.getscenechildren = function () {
        var scenechildren = [];
        for (var n = 0; n < this.scene.children.length; n++) {
            if (this.scene.children[n].type === "Scene") {
                for (var i = 0; i < this.scene.children[n].children.length; i++) {
                    scenechildren.push(this.scene.children[n].children[i]);
                }
            }
        }
        return scenechildren;
    };
    ToolwindowComponent.prototype.point = function (Visible) {
        this.Visible = "Points";
        this.attribute = this.getpoints();
        if (this.selectedVisible == true) {
            this.pointcheck();
        }
        if (this.dataService.checkpointid == undefined) {
            this.dataService.checkpointid = false;
        }
        else {
            this.checkpointid = this.dataService.checkpointid;
        }
        if (this.dataService.checkX == undefined) {
            this.dataService.checkX = false;
        }
        else {
            this.checkX = this.dataService.checkX;
        }
        if (this.dataService.checkY == undefined) {
            this.dataService.checkY = false;
        }
        else {
            this.checkY = this.dataService.checkY;
        }
        if (this.dataService.checkZ == undefined) {
            this.dataService.checkZ = false;
        }
        else {
            this.checkZ = this.dataService.checkZ;
        }
        this.dataService.visible = this.Visible;
        //this.clearsprite();
        /*this.sortedData=[];
        for(var i=0;i<this.attribute.length;i++){
          var datas={};
          datas["id"]=this.attribute[i].id;
          datas["x"]=this.attribute[i].x;
          datas["y"]=this.attribute[i].y;
          datas["z"]=this.attribute[i].z;
          this.sortedData[i]=datas;
        }*/
    };
    ToolwindowComponent.prototype.pointcheck = function () {
        this.attribute = [];
        var attributes = this.pointtovertix();
        var points = this.getpoints();
        for (var i = 0; i < points.length; i++) {
            for (var j = 0; j < attributes.length; j++) {
                if (points[i].id === attributes[j].pointid && this.attribute.indexOf(points[i]) === -1) {
                    this.attribute.push(points[i]);
                }
            }
        }
    };
    ToolwindowComponent.prototype.pointtovertix = function () {
        var attributes = [];
        var vertices = this.getvertices();
        var selecting = this.dataService.getselecting();
        var char;
        var labels = [];
        if (selecting.length !== 0) {
            for (var i = 0; i < selecting.length; i++) {
                for (var j = 0; j < vertices.length; j++) {
                    if (selecting[i]["id"] === vertices[j].pointid && attributes.indexOf(vertices[j]) == -1) {
                        attributes.push(vertices[j]);
                    }
                    if (selecting[i]["type"] === "All edges") {
                        var edge = this.model.getGeom().getTopo(selecting[i]["path"]);
                        var verts = edge.getVertices();
                        for (var n = 0; n < verts.length; n++) {
                            var label = verts[n].getLabel();
                            if (label === vertices[j].vertixlabel && attributes.indexOf(vertices[j]) == -1) {
                                attributes.push(vertices[j]);
                            }
                        }
                    }
                    if (selecting[i]["type"] === "All wires") {
                        var wire = this.model.getGeom().getTopo(selecting[i]["path"]);
                        var verts = wire.getVertices();
                        for (var n = 0; n < verts.length; n++) {
                            var label = verts[n].getLabel();
                            if (label === vertices[j].vertixlabel && attributes.indexOf(vertices[j]) == -1) {
                                attributes.push(vertices[j]);
                            }
                        }
                    }
                    if (selecting[i]["type"] === "All faces") {
                        var face = this.model.getGeom().getTopo(selecting[i]["path"]);
                        var verts = face.getVertices();
                        for (var n = 0; n < verts.length; n++) {
                            var label = verts[n].getLabel();
                            if (label === vertices[j].vertixlabel && attributes.indexOf(vertices[j]) == -1) {
                                attributes.push(vertices[j]);
                            }
                        }
                    }
                    if (selecting[i]["type"] === "All objs") {
                        var face = this.model.getGeom().getTopo(selecting[i]["path"]);
                        var faces = face.getObj().getFaces();
                        for (var f = 0; f < faces.length; f++) {
                            var verts = faces[f].getVertices();
                            for (var n = 0; n < verts.length; n++) {
                                var label = verts[n].getLabel();
                                if (label === vertices[j].vertixlabel && this.attribute.indexOf(vertices[j]) == -1) {
                                    attributes.push(vertices[j]);
                                }
                            }
                        }
                    }
                }
            }
        }
        return attributes;
    };
    ToolwindowComponent.prototype.vertice = function (Visible) {
        this.Visible = "Vertices";
        this.attribute = this.getvertices();
        if (this.selectedVisible == true) {
            this.verticecheck();
        }
        if (this.dataService.checkvertixid == undefined) {
            this.dataService.checkvertixid = false;
        }
        else {
            this.vertixid = this.dataService.checkvertixid;
        }
        if (this.dataService.pointid == undefined) {
            this.dataService.pointid = false;
        }
        else {
            this.pointid = this.dataService.pointid;
        }
        this.dataService.visible = this.Visible;
        //this.clearsprite();
    };
    ToolwindowComponent.prototype.verticecheck = function () {
        this.attribute = this.pointtovertix();
    };
    ToolwindowComponent.prototype.edge = function (Visible) {
        this.Visible = "Edges";
        this.attribute = [];
        this.attribute = this.getedges();
        if (this.selectedVisible == true) {
            this.edgecheck();
        }
        this.dataService.visible = this.Visible;
        //this.clearsprite();
    };
    ToolwindowComponent.prototype.edgecheck = function () {
        this.attribute = [];
        var edges = this.getedges();
        var selecting = this.dataService.getselecting();
        if (selecting.length !== 0) {
            for (var i = 0; i < selecting.length; i++) {
                for (var j = 0; j < edges.length; j++) {
                    if (selecting[i].type === "All edges") {
                        if (selecting[i]["id"].indexOf(edges[j].label) > -1) {
                            this.attribute.push(edges[j]);
                        }
                    }
                    if (selecting[i]["type"] === "All faces") {
                        var face = this.model.getGeom().getTopo(selecting[i]["path"]);
                        var verts = face.getEdges();
                        for (var n = 0; n < verts.length; n++) {
                            var label = verts[n].getLabel();
                            if (label === edges[j].label && this.attribute.indexOf(edges[j]) == -1) {
                                this.attribute.push(edges[j]);
                            }
                        }
                    }
                    if (selecting[i]["type"] === "All objs") {
                        var face = this.model.getGeom().getTopo(selecting[i]["path"]);
                        var faces = face.getObj().getFaces();
                        for (var f = 0; f < faces.length; f++) {
                            var verts = faces[f].getEdges();
                            for (var n = 0; n < verts.length; n++) {
                                var label = verts[n].getLabel();
                                if (label === edges[j].label && this.attribute.indexOf(edges[j]) == -1) {
                                    this.attribute.push(edges[j]);
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    ToolwindowComponent.prototype.wire = function (Visible) {
        this.Visible = "Wires";
        this.attribute = [];
        this.attribute = this.getwires();
        if (this.selectedVisible == true) {
            this.wirecheck();
        }
        this.dataService.visible = this.Visible;
    };
    ToolwindowComponent.prototype.wirecheck = function () {
        this.attribute = [];
        var wires = this.getwires();
        var selecting = this.dataService.getselecting();
        if (selecting.length !== 0) {
            for (var i = 0; i < selecting.length; i++) {
                for (var j = 0; j < wires.length; j++) {
                    if (selecting[i]["id"] === wires[j].label) {
                        this.attribute.push(wires[j]);
                    }
                    if (selecting[i]["type"] === "All objs") {
                        var face = this.model.getGeom().getTopo(selecting[i]["path"]);
                        var wireses = face.getObj().getWires();
                        for (var w = 0; w < wireses.length; w++) {
                            var label = wireses[w].getLabel();
                            if (label === wires[j].label && this.attribute.indexOf(wires[j]) == -1) {
                                this.attribute.push(wires[j]);
                            }
                        }
                    }
                }
            }
        }
    };
    ToolwindowComponent.prototype.face = function (Visible) {
        this.Visible = "Faces";
        this.attribute = [];
        this.attribute = this.getfaces();
        if (this.selectedVisible == true) {
            this.facecheck();
        }
        if (this.dataService.checkface == undefined) {
            this.dataService.checkface = false;
        }
        else {
            this.checkface = this.dataService.checkface;
        }
        for (var n = 0; n < this.face_name.length; n++) {
            if (this.dataService.checkname[n] === undefined) {
                this.dataService.checkname[n] = false;
            }
            /*else{
              this.face_name[n]=this.dataService.checkname[n];
            }*/
        }
    };
    ToolwindowComponent.prototype.facecheck = function () {
        this.attribute = [];
        var faces = this.getfaces();
        var selecting = this.dataService.getselecting();
        if (selecting.length !== 0) {
            for (var i = 0; i < selecting.length; i++) {
                for (var j = 0; j < faces.length; j++) {
                    if (selecting[i]["id"] === faces[j].label) {
                        this.attribute.push(faces[j]);
                    }
                    if (selecting[i]["type"] === "All objs") {
                        var face = this.model.getGeom().getTopo(selecting[i]["path"]);
                        var faceses = face.getObj().getFaces();
                        for (var f = 0; f < faceses.length; f++) {
                            var label = faceses[f].getLabel();
                            if (label === faces[j].label && this.attribute.indexOf(faces[j]) == -1) {
                                this.attribute.push(faces[j]);
                            }
                        }
                    }
                }
            }
        }
    };
    ToolwindowComponent.prototype.object = function (Visible) {
        this.Visible = "Objs";
        this.attribute = [];
        this.attribute = this.getoject();
        if (this.selectedVisible == true) {
            this.objectcheck();
        }
        if (this.dataService.checkobj == undefined) {
            this.dataService.checkobj = false;
        }
        else {
            this.checkobj = this.dataService.checkobj;
        }
        this.dataService.visible = this.Visible;
    };
    ToolwindowComponent.prototype.objectcheck = function () {
        this.attribute = [];
        var object = this.getoject();
        var selecting = this.dataService.getselecting();
        if (selecting.length !== 0) {
            for (var i = 0; i < selecting.length; i++) {
                for (var j = 0; j < object.length; j++) {
                    if (selecting[i]["id"] === object[j].label) {
                        this.attribute.push(object[j]);
                    }
                }
            }
        }
    };
    ToolwindowComponent.prototype.changeselected = function () {
        this.selectedVisible = !this.selectedVisible;
        if (this.selectedVisible) {
            if (this.Visible === "Points")
                this.pointcheck();
            if (this.Visible === "Vertices")
                this.verticecheck();
            if (this.Visible === "Edges")
                this.edgecheck();
            if (this.Visible === "Wires")
                this.wirecheck();
            if (this.Visible === "Faces")
                this.facecheck();
            if (this.Visible === "Objs")
                this.objectcheck();
        }
        else {
            if (this.Visible === "Points")
                this.point(this.Visible);
            if (this.Visible === "Vertices")
                this.vertice(this.Visible);
            if (this.Visible === "Edges")
                this.edge(this.Visible);
            if (this.Visible === "Wires")
                this.wire(this.Visible);
            if (this.Visible === "Faces")
                this.face(this.Visible);
            if (this.Visible === "Objs")
                this.object(this.Visible);
        }
    };
    ToolwindowComponent.prototype.Onselect = function (datascale) {
        if (this.Visible === "Points") {
            var point = [];
            point.label = datascale.id;
            point.id = datascale.id;
            point.path = datascale.id;
            point.type = "All points";
            point.label_xyz = [datascale.x, datascale.y, datascale.z];
            var geometry = new three__WEBPACK_IMPORTED_MODULE_0__["Geometry"]();
            geometry.vertices.push(new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](point.label_xyz[0], point.label_xyz[1], point.label_xyz[2]));
            var pointsmaterial = new three__WEBPACK_IMPORTED_MODULE_0__["PointsMaterial"]({ color: 0x00ff00, size: 1 });
            if (this.dataService.pointsize !== undefined) {
                pointsmaterial.size = this.dataService.pointsize;
            }
            var points = new three__WEBPACK_IMPORTED_MODULE_0__["Points"](geometry, pointsmaterial);
            points.userData.id = point.id;
            //points["material"].needsUpdate=true;
            points.name = "selects";
            this.scene.add(points);
            this.renderer.render(this.scene, this.camera);
            this.dataService.addclickshow(point);
        }
        if (this.Visible === "Vertices") {
            var vertice = [];
            var path = datascale.path;
            var vertices = this.model.getGeom().getTopo(path);
            var label = vertices.getLabel();
            var verts_xyz = vertices.getLabelCentroid();
            vertice.label = label;
            vertice.id = datascale.pointid;
            vertice.path = datascale.path;
            vertice.type = "All points";
            vertice.label_xyz = [verts_xyz[0], verts_xyz[1], verts_xyz[2]];
            var geometry = new three__WEBPACK_IMPORTED_MODULE_0__["Geometry"]();
            geometry.vertices.push(new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](verts_xyz[0], verts_xyz[1], verts_xyz[2]));
            var pointsmaterial = new three__WEBPACK_IMPORTED_MODULE_0__["PointsMaterial"]({ color: 0x00ff00, size: 1 });
            if (this.dataService.pointsize !== undefined) {
                pointsmaterial.size = this.dataService.pointsize;
            }
            var points = new three__WEBPACK_IMPORTED_MODULE_0__["Points"](geometry, pointsmaterial);
            points.userData.id = vertice.id;
            //points["material"].needsUpdate=true;
            points.name = "selects";
            this.scene.add(points);
            this.renderer.render(this.scene, this.camera);
            this.dataService.addclickshow(vertice);
        }
        /*if(this.Visible==="Vertices"){
          var vertice:any=[];
          const path: gs.ITopoPathData=datascale.path;
          const vertices: gs.IVertex = this.model.getGeom().getTopo(path) as gs.IVertex;
          const label: string = vertices.getLabel();
          const verts_xyz: gs.XYZ = vertices.getLabelCentroid();
          vertice.label=label;
          vertice.id=datascale.pointid;
          vertice.path=datascale.path;
          vertice.type="All points";
          vertice.label_xyz=[verts_xyz[0],verts_xyz[1],verts_xyz[2]];
          var geometry=new THREE.Geometry();
          geometry.vertices.push(new THREE.Vector3(verts_xyz[0],verts_xyz[1],verts_xyz[2]));
          var pointsmaterial=new THREE.PointsMaterial( { color:0x00ff00,size:1} );
          if(this.dataService.pointsize!==undefined){
              pointsmaterial.size=this.dataService.pointsize;
          }
          const points = new THREE.Points( geometry, pointsmaterial);
          points.userData.id=vertice.id;
          //points["material"].needsUpdate=true;
          points.name="selects";
          this.scene.add(points);
          this.dataService.addclickshow(vertice);
        }*/
        if (this.Visible === "Edges") {
        }
    };
    ToolwindowComponent.prototype.pointcheckbox = function () {
        var index = [];
        for (var i = 0; i < this.getpoints().length; i++) {
            if (this.dataService.selecting.length !== 0) {
                for (var j = 0; j < this.dataService.selecting.length; j++) {
                    if (this.dataService.selecting[j].type === "All points") {
                        var label = "";
                        if (this.getpoints()[i].id === this.dataService.selecting[j]["id"]) {
                            if (document.getElementById("X")["checked"] === true) {
                                label = label.concat("X:", this.getpoints()[i].x, '\n');
                            }
                            if (document.getElementById("Y")["checked"] === true) {
                                label = label.concat("Y:", this.getpoints()[i].y, '\n');
                            }
                            if (document.getElementById("Z")["checked"] === true) {
                                label = label.concat("Z:", this.getpoints()[i].z, '\n');
                            }
                            for (var n = 0; n < this.point_name.length; n++) {
                                if (document.getElementById(this.point_name[n])["checked"] == true) {
                                    label = label.concat(this.point_name[n], ":", this.getpoints()[i][n]);
                                }
                            }
                            //console.log(label);
                            this.dataService.addlabel(label);
                        }
                    }
                }
            }
        }
    };
    ToolwindowComponent.prototype.checkbox = function () {
        if (this.Visible === "Points") {
            this.dataService.addgetpoints(this.getpoints());
            this.dataService.checkX = document.getElementById("X")["checked"];
            this.dataService.checkY = document.getElementById("Y")["checked"];
            this.dataService.checkZ = document.getElementById("Z")["checked"];
            this.dataService.checkpointid = document.getElementById("id")["checked"];
            for (var n = 0; n < this.point_name.length; n++) {
                this.dataService.checkname[n] = document.getElementById(this.point_name[n])["checked"];
            }
            this.dataService.addpointname(this.point_name);
        }
        if (this.Visible === "Vertices") {
            this.dataService.addgetpoints(this.getvertices());
            this.dataService.checkvertixid = document.getElementById("vertixid")["checked"];
            this.dataService.pointid = document.getElementById("pointid")["checked"];
            for (var n = 0; n < this.vertex_name.length; n++) {
                this.dataService.checkname[n] = document.getElementById(this.vertex_name[n])["checked"];
            }
            this.dataService.addpointname(this.vertex_name);
        }
        if (this.Visible === "Edges") {
            this.dataService.addgetpoints(this.getedges());
            this.dataService.checkedgeid = document.getElementById("edgeid")["checked"];
            for (var n = 0; n < this.edge_name.length; n++) {
                this.dataService.checkname[n] = document.getElementById(this.edge_name[n])["checked"];
            }
            this.dataService.addpointname(this.edge_name);
        }
        if (this.Visible === "Faces") {
            this.dataService.addgetpoints(this.getfaces());
            this.dataService.checkface = document.getElementById("checkface")["checked"];
            for (var n = 0; n < this.face_name.length; n++) {
                this.dataService.checkname[n] = document.getElementById(this.face_name[n])["checked"];
            }
            this.dataService.addpointname(this.face_name);
        }
        if (this.Visible === "Objs") {
            this.dataService.addgetpoints(this.getoject());
            this.dataService.checkobj = document.getElementById("checkobj")["checked"];
            for (var n = 0; n < this.obj_name.length; n++) {
                this.dataService.checkname[n] = document.getElementById(this.obj_name[n])["checked"];
            }
            this.dataService.addpointname(this.obj_name);
        }
    };
    ToolwindowComponent.prototype.sortData = function (sort) {
        var _this = this;
        var data = this.attribute.slice();
        if (!sort.active || sort.direction == '') {
            this.attribute = data;
            return;
        }
        if (this.Visible === "Points") {
            this.attribute = data.sort(function (a, b) {
                var isAsc = sort.direction == 'asc';
                switch (sort.active) {
                    case 'id': return _this.compareid(a.id, b.id, isAsc);
                    case 'x': return _this.compare(+a.x, +b.x, isAsc);
                    case 'y': return _this.compare(+a.y, +b.y, isAsc);
                    case 'z': return _this.compare(+a.z, +b.z, isAsc);
                    default: return 0;
                }
            });
            for (var i = 0; i < this.point_name.length; i++) {
                this.attribute = data.sort(function (a, b) {
                    var isAsc = sort.direction == 'asc';
                    switch (sort.active) {
                        case _this.point_name[i]: return _this.compare(a[i], b[i], isAsc);
                        default: return 0;
                    }
                });
            }
        }
        if (this.Visible === "Vertices") {
            var labelinitial = false;
            this.attribute = data.sort(function (a, b) {
                var isAsc = sort.direction == 'asc';
                switch (sort.active) {
                    case 'vertixlabel':
                        labelinitial = true;
                        return _this.compare(a.vertixlabel, b.vertixlabel, isAsc);
                    case 'pointid':
                        labelinitial = true;
                        return _this.compareid(a.pointid, b.pointid, isAsc);
                    default: return 0;
                }
            });
            if (labelinitial === false) {
                for (var i = 0; i < this.vertex_name.length; i++) {
                    this.attribute = data.sort(function (a, b) {
                        var isAsc = sort.direction == 'asc';
                        switch (sort.active) {
                            case _this.vertex_name[i]: return _this.compare(a[i], b[i], isAsc);
                            default: return 0;
                        }
                    });
                }
            }
        }
        if (this.Visible === "Edges") {
            this.attribute = data.sort(function (a, b) {
                var isAsc = sort.direction == 'asc';
                switch (sort.active) {
                    case 'label': return _this.compare(a.label, b.label, isAsc);
                    default: return 0;
                }
            });
            for (var i = 0; i < this.edge_name.length; i++) {
                this.attribute = data.sort(function (a, b) {
                    var isAsc = sort.direction == 'asc';
                    switch (sort.active) {
                        case _this.edge_name[i]: return _this.compare(a[i], b[i], isAsc);
                        default: return 0;
                    }
                });
            }
        }
        if (this.Visible === "Wires") {
            this.attribute = data.sort(function (a, b) {
                var isAsc = sort.direction == 'asc';
                switch (sort.active) {
                    case 'label': return _this.compare(a.label, b.label, isAsc);
                    default: return 0;
                }
            });
            for (var i = 0; i < this.wire_name.length; i++) {
                this.attribute = data.sort(function (a, b) {
                    var isAsc = sort.direction == 'asc';
                    switch (sort.active) {
                        case _this.wire_name[i]: return _this.compare(a[i], b[i], isAsc);
                        default: return 0;
                    }
                });
            }
        }
        if (this.Visible === "Faces") {
            this.attribute = data.sort(function (a, b) {
                var isAsc = sort.direction == 'asc';
                switch (sort.active) {
                    case 'label': return _this.compare(a.label, b.label, isAsc);
                    default: return 0;
                }
            });
            for (var i = 0; i < this.face_name.length; i++) {
                this.attribute = data.sort(function (a, b) {
                    var isAsc = sort.direction == 'asc';
                    switch (sort.active) {
                        case _this.face_name[i]: return _this.compare(a[i], b[i], isAsc);
                        default: return 0;
                    }
                });
            }
        }
        if (this.Visible === "Objs") {
            var labelinitial = false;
            this.attribute = data.sort(function (a, b) {
                var isAsc = sort.direction == 'asc';
                switch (sort.active) {
                    case 'label':
                        labelinitial = true;
                        return _this.compareid(a.label, b.label, isAsc);
                    default: return 0;
                }
            });
            if (labelinitial === false) {
                for (var i = 0; i < this.obj_name.length; i++) {
                    this.attribute = data.sort(function (a, b) {
                        var isAsc = sort.direction == 'asc';
                        switch (sort.active) {
                            case _this.obj_name[i]: return _this.compare(a[i], b[i], isAsc);
                            default: return 0;
                        }
                    });
                }
            }
        }
    };
    ToolwindowComponent.prototype.compare = function (a, b, isAsc) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    };
    ToolwindowComponent.prototype.compareid = function (a, b, isAsc) {
        return (Number(a.substring(1, a.length)) < Number(b.substring(1, b.length)) ? -1 : 1) * (isAsc ? 1 : -1);
    };
    ToolwindowComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-toolwindow',
            template: __webpack_require__(/*! ./toolwindow.component.html */ "./src/app/mViewer/viewers/gs-viewer/toolwindow/toolwindow.component.html"),
            styles: [__webpack_require__(/*! ./toolwindow.component.css */ "./src/app/mViewer/viewers/gs-viewer/toolwindow/toolwindow.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injector"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"]])
    ], ToolwindowComponent);
    return ToolwindowComponent;
}(_data_DataSubscriber__WEBPACK_IMPORTED_MODULE_3__["DataSubscriber"]));



/***/ }),

/***/ "./src/app/mViewer/viewers/gs-viewer/viewer/viewer.component.css":
/*!***********************************************************************!*\
  !*** ./src/app/mViewer/viewers/gs-viewer/viewer/viewer.component.css ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#container {\r\n  position: relative;\r\n  height:100%;\r\n  width: 100%;\r\n  margin:0px;\r\n  overflow: hidden;\r\n  color: white;\r\n  font-family:sans-serif;\r\n}\r\n#container-top-right-resize { top: 0px; right: 0px; }\r\n#shownumber{\r\n  position: absolute;\r\n  float: right;\r\n  color:black;\r\n  right: 0px;\r\n  width: 115px;\r\n  bottom: 0px;\r\n  color:#395d73;\r\n  font-family:sans-serif;\r\n}\r\n/*#rotating{\r\n  width: 30px;\r\n  height: 25px;\r\n  font-size:15px;\r\n  right:0px; \r\n  text-align:center;\r\n  position: absolute;\r\n  top: 0px;\r\n  background-color:transparent;\r\n  border:0;\r\n}\r\n\r\n#paning{\r\n  width: 30px;\r\n  height: 25px;\r\n  font-size:15px;\r\n  right:0px; \r\n  text-align:center;\r\n  position: absolute;\r\n  top: 25px;\r\n  background-color:transparent;\r\n  border:0;\r\n}\r\n\r\n#zooming{\r\n  width: 30px;\r\n  height: 25px;\r\n  font-size:15px;\r\n  right:0px; \r\n  text-align:center;\r\n  position: absolute;\r\n  margin-top: 50px;\r\n  background-color:transparent;\r\n  border:0;\r\n}*/\r\n/*#imagery{\r\n  width: 30px;\r\n  height: 25px;\r\n  font-size:14px;\r\n  right:0px; \r\n  text-align:center;\r\n  position: absolute;\r\n  margin-top: 10px;\r\n  background-color:transparent;\r\n  border:0;\r\n}*/\r\n#zoomingfit{\r\n  width: 30px;\r\n  height: 25px;\r\n  font-size:14px;\r\n  right:0px; \r\n  text-align:center;\r\n  position: absolute;\r\n  margin-top: 10px;\r\n  background-color:transparent;\r\n  border:0;\r\n}\r\n#selecting{\r\n  width: 30px;\r\n  height: 25px;\r\n  font-size:14px;\r\n  right:0px; \r\n  text-align:center;\r\n  position: absolute;\r\n  margin-top: 35px;\r\n  background-color:transparent;\r\n  border:0;\r\n}\r\n#points{\r\n  width: 30px;\r\n  height: 25px;\r\n  font:14px bolder;\r\n  right:0px; \r\n  text-align:center;\r\n  position: absolute;\r\n  margin-top: 70px;\r\n  background-color:transparent;\r\n  border:0;\r\n  font-family:sans-serif;\r\n}\r\n#vertices{\r\n  width: 30px;\r\n  height: 25px;\r\n  font:14px bolder;\r\n  right:0px; \r\n  text-align:center;\r\n  position: absolute;\r\n  margin-top: 95px;\r\n  background-color:transparent;\r\n  border:0;\r\n  font-family:sans-serif;\r\n}\r\n#edges{\r\n  width: 30px;\r\n  height: 25px;\r\n  font:14px bolder;\r\n  right:0px; \r\n  text-align:center;\r\n  position: absolute;\r\n  margin-top: 120px;\r\n  background-color:transparent;\r\n  border:0;\r\n  font-family:sans-serif;\r\n}\r\n#wires{\r\n  width: 30px;\r\n  height: 25px;\r\n  font:14px bolder;\r\n  right:0px; \r\n  text-align:center;\r\n  position: absolute;\r\n  margin-top: 145px;\r\n  background-color:transparent;\r\n  border:0;\r\n  font-family:sans-serif;\r\n}\r\n#faces{\r\n  width: 30px;\r\n  height: 25px;\r\n  font:14px bolder;\r\n  right:0px; \r\n  text-align:center;\r\n  position: absolute;\r\n  margin-top: 170px;\r\n  background-color:transparent;\r\n  border:0;\r\n  font-family:sans-serif;\r\n}\r\n#objects{\r\n  width: 30px;\r\n  height: 25px;\r\n  font:14px bolder;\r\n  right:0px; \r\n  text-align:center;\r\n  position: absolute;\r\n  margin-top: 195px;\r\n  background-color:transparent;\r\n  border:0;\r\n  font-family:sans-serif;\r\n}\r\n#setting{\r\n  width: 30px;\r\n  height: 25px;\r\n  font-size:14px;\r\n  right:0px; \r\n  text-align:center;\r\n  position: absolute;\r\n  top: 10px;\r\n  background-color:transparent;\r\n  border:0;\r\n}\r\n.selected{\r\n  color: grey;\r\n\r\n}\r\n.visible{\r\n  color: grey;\r\n}\r\n.cursor {\r\n\r\n}\r\n.selectvisible{\r\n  background-color:  white !important;\r\n  color:#395d73;\r\n}"

/***/ }),

/***/ "./src/app/mViewer/viewers/gs-viewer/viewer/viewer.component.html":
/*!************************************************************************!*\
  !*** ./src/app/mViewer/viewers/gs-viewer/viewer/viewer.component.html ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"container\"  \r\n    (mousemove)=\"onDocumentMouseMove($event)\" \r\n    (mousedown)=\"mousedown($event)\"\r\n    (mouseup)=\"mouseup($event)\"\r\n    (click)=\"render(this)\"\r\n\t\t(click)=\"onDocumentMouseDown($event)\">\r\n    <div *ngIf=\"_updatemodel === false\" style=\"position:absolute;color:red;margin-top: 50px;left:40%;width: auto;text-align: center;font-family:sans-serif;font-size: 14px;background-color: white;\">Error displaying model:{{text}}</div>\r\n    <div *ngIf=\"_modelshow === false\" style=\"position:absolute;color:red;margin-top: 50px;left:40%;width: auto;text-align: center;font-family:sans-serif;font-size: 14px;background-color: white;\">Model or Scene not defined.</div>\r\n\r\n\r\n    <!-- (mousemove)=\"requestanimate()\" \r\n    (click)=\"requestanimate()\" -->\r\n\r\n    <!-- (window:resize)=\"onResize($event)\" -->\r\n\r\n\t\r\n  \t\t<!-- <button id=\"rotating\" \r\n  \t\t\t[class.visible]=\"Visible === 'rotate'\" \r\n  \t\t\t(click)=\"rotate()\">\r\n  \t\t\t<i class=\"fa fa-refresh\"></i>\r\n  \t\t</button>\r\n\r\n  \t\t<button id=\"paning\"  \r\n  \t\t\t[class.visible]=\"Visible === 'pan'\" \r\n  \t\t\t(click)=\"pan()\">\r\n  \t\t\t<i class=\"fa fa-hand-paper-o\"></i>\r\n  \t\t</button>\r\n\r\n  \t\t<button id=\"zooming\"  \r\n  \t\t\t[class.visible]=\"Visible === 'zoom'\" \r\n  \t\t\t(click)=\"Visible='zoom'\">\r\n  \t\t\t<i class=\"fa fa-search\"></i>\r\n  \t\t</button>-->\r\n  \t\t\r\n  \t\t<button id=\"zoomingfit\"  \r\n  \t\t\t[class.visible]=\"Visible === 'zoomfit'\" \r\n  \t\t\t(click)=\"zoomfit()\">\r\n  \t\t\t<span matTooltip=\"zoom to fit\"><i class=\"fa fa-arrows-alt\"></i></span>\r\n  \t\t</button> \r\n  \t\t\r\n  \t\t<!-- <button id=\"selecting\" [class.visible]=\"Visible === 'select'\" (click)= \"select($event, Visible)\" ><i class=\"fa fa-mouse-pointer\"></i></button> -->\r\n  \t\t\r\n  \t\t<!-- <button id=\"setting\" [class.selected]=\"settingVisible\" (click)= \"setting(settingVisible)\"><i class=\"fa fa-cog\"></i></button> -->\r\n\r\n      <button id=\"selecting\" [class.selected]=\"seVisible\" (click)= \"select(seVisible)\" ><span matTooltip=\"select\"><i class=\"fa fa-mouse-pointer\"></i></span></button>\r\n      <div id=\"shownumber\">\r\n        <tr>\r\n        <td  align=left style=\"width: 60px;\">Triangles&nbsp;&nbsp;</td>\r\n        <td  align=left style=\"width: 10px;\">{{renderer.info.render.faces}}</td>\r\n        </tr>\r\n        <tr>\r\n        <td  align=left style=\"width: 60px;\">Lines</td>\r\n        <td  align=left style=\"width: 10px;\">{{LineNo}}</td>\r\n        </tr>\r\n      </div>\r\n\r\n      <!-- <button id=\"imagery\"  \r\n        [class.selected]=\"imVisible\" (click)=\"leaflet()\">I\r\n      </button> -->\r\n      \t\r\n      \t<!--setting-->\r\n      \t\r\n \t\t<!-- <app-setting *ngIf=\"settingVisible == true\"></app-setting> -->\r\n    <div *ngIf=\"seVisible == true\">\r\n        <button id=\"points\" [class.selectvisible]=\"SelectVisible === 'Points'\" (click)=\"pointselect(SelectVisible)\"><span matTooltip=\"Select Points\">P</span></button>\r\n        <button id=\"vertices\" [class.selectvisible]=\"SelectVisible === 'Vertices'\" (click)=\"verticeselect(SelectVisible)\"><span matTooltip=\"Select Vertices\">V</span></button>\r\n        <button id=\"edges\" [class.selectvisible]=\"SelectVisible === 'Edges'\" (click)=\"edgeselect(SelectVisible)\"><span matTooltip=\"Select Edges\">E</span></button>\r\n        <button id=\"wires\" [class.selectvisible]=\"SelectVisible === 'Wires'\" (click)=\"wireselect(SelectVisible)\"><span matTooltip=\"Select Wires\">W</span></button>\r\n        <button id=\"faces\" [class.selectvisible]=\"SelectVisible === 'Faces'\" (click)=\"faceselect(SelectVisible)\"><span matTooltip=\"Select Faces\">F</span></button>\r\n        <button id=\"objects\" [class.selectvisible]=\"SelectVisible === 'Objs'\" (click)=\"objectselect(SelectVisible)\"><span matTooltip=\"Select Objects\">O</span></button>\r\n      </div>\r\n</div>\r\n\r\n\r\n\t\r\n\r\n\r\n"

/***/ }),

/***/ "./src/app/mViewer/viewers/gs-viewer/viewer/viewer.component.ts":
/*!**********************************************************************!*\
  !*** ./src/app/mViewer/viewers/gs-viewer/viewer/viewer.component.ts ***!
  \**********************************************************************/
/*! exports provided: ViewerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewerComponent", function() { return ViewerComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _data_DataSubscriber__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../data/DataSubscriber */ "./src/app/mViewer/viewers/gs-viewer/data/DataSubscriber.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ViewerComponent = /** @class */ (function (_super) {
    __extends(ViewerComponent, _super);
    function ViewerComponent(injector, myElement) {
        var _this = _super.call(this, injector) || this;
        _this.textlabels = [];
        _this.starsGeometry = new three__WEBPACK_IMPORTED_MODULE_1__["Geometry"]();
        _this.seVisible = false;
        _this.imVisible = false;
        _this.SelectVisible = 'Objs';
        _this.settingVisible = false;
        _this.LineNo = 0;
        _this._updatemodel = true;
        _this._modelshow = true;
        _this.lastChanged = undefined;
        _this.myElement = myElement;
        return _this;
    }
    ViewerComponent.prototype.ngOnInit = function () {
        var container = this.myElement.nativeElement.children.namedItem("container");
        /// check for container
        if (!container) {
            console.error("No container in Three Viewer");
            return;
        }
        ///
        var width = container.offsetWidth; //container.clientWidth;
        var height = container.offsetHeight; //container.clientHeight;
        var scene = this.dataService.getScene(width, height);
        var renderer = this.dataService.getRenderer();
        var camera = this.dataService.getCamera();
        var controls = this.dataService.getControls();
        container.appendChild(renderer.domElement);
        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        this.controls = controls;
        this.width = width;
        this.height = height;
        this.updateModel();
        // todo: check and refactor what is required?
        this.selecting = this.dataService.getselecting(); // todo: should this be in the data service??
        this.mouse = new three__WEBPACK_IMPORTED_MODULE_1__["Vector2"]();
        this.raycaster = new three__WEBPACK_IMPORTED_MODULE_1__["Raycaster"]();
        this.raycaster.linePrecision = 0.05;
        this.scenechildren = this.dataService.getscenechild();
        this.dataService.SelectVisible = this.SelectVisible;
        var geometry = new three__WEBPACK_IMPORTED_MODULE_1__["SphereGeometry"](1);
        var material = new three__WEBPACK_IMPORTED_MODULE_1__["MeshBasicMaterial"]({ color: 0x00ff00, transparent: true, opacity: 0.5 });
        this.sphere = new three__WEBPACK_IMPORTED_MODULE_1__["Mesh"](geometry, material);
        this.sphere.visible = false;
        this.sphere.name = "sphereInter";
        this.sphere.scale.set(0.1, 0.1, 0.1);
        this.scene.add(this.sphere);
        var self = this;
        controls.addEventListener('change', function () { self.render(self); });
        for (var i = 0; i < this.getchildren().length; i++) {
            this.getchildren()[i]["material"].transparent = false;
        }
        this.dataService.addraycaster(this.raycaster);
        this.addgrid();
        self.renderer.render(self.scene, self.camera);
    };
    //
    //  checks if the data service has a data and calls update function for the viewer
    //
    ViewerComponent.prototype.notify = function (message) {
        if (message == "model_update" && this.scene) {
            this.updateModel();
        }
    };
    ViewerComponent.prototype.animate = function (self) {
        self.raycaster.setFromCamera(self.mouse, self.camera);
        self.scenechildren = self.dataService.getscenechild();
        var intersects = self.raycaster.intersectObjects(self.scenechildren);
        for (var i = 0; i < self.scenechildren.length; i++) {
            var currObj = self.scenechildren[i];
            if (self.dataService.getSelectingIndex(currObj.uuid) < 0) {
                if (intersects[0] != undefined && intersects[0].object.uuid == currObj.uuid) {
                    self.sphere.visible = true;
                    self.sphere.position.copy(intersects[0].point);
                }
                else {
                    self.sphere.visible = false;
                }
            }
        }
        for (var i = 0; i < self.textlabels.length; i++) {
            self.textlabels[i].updatePosition();
        }
        if (self.dataService.clickshow !== undefined && self.clickatt !== self.dataService.clickshow) {
            self.clickatt = self.dataService.clickshow;
            self.clickshow();
        }
        self.renderer.render(self.scene, self.camera);
    };
    ViewerComponent.prototype.render = function (self) {
        for (var i = 0; i < self.textlabels.length; i++) {
            self.textlabels[i].updatePosition();
        }
        if (self.dataService.clickshow !== undefined && self.clickatt !== self.dataService.clickshow) {
            self.clickatt = self.dataService.clickshow;
            self.clickshow();
        }
        //self.onDocumentMouseDown();
        self.renderer.render(self.scene, self.camera);
    };
    /// clears all children from the scene
    ViewerComponent.prototype.clearScene = function () {
        /// remove children from scene
        for (var i = 0; i < this.scene.children.length; i++) {
            if (this.scene.children[i].type === "Scene") {
                this.scene.remove(this.scene.children[i]);
                i = i - 1;
            }
            if (this.scene.children[i].name == "selects") {
                this.scene.remove(this.scene.children[i]);
                i = i - 1;
            }
        }
        for (var i = 0; i < this.scene.children.length; i++) {
            if (this.scene.children[i].name == "selects") {
                this.scene.remove(this.scene.children[i]);
                i = i - 1;
            }
        }
        for (var i = 0; i < this.textlabels.length; i++) {
            this.removeTextLabel(this.textlabels[i]["id"]);
            i = i - 1;
        }
    };
    ViewerComponent.prototype.ngDoCheck = function () {
        var container = this.myElement.nativeElement.children.namedItem("container");
        var width = container.offsetWidth;
        var height = container.offsetHeight;
        // this is when dimensions change
        if (width !== this.width || height !== this.height) {
            // compute time difference from last changed
            var nowTime = Date.now();
            var difference = this.lastChanged - nowTime;
            if (Math.abs(difference) < 400) {
                // do nothing
                // dimensions still changing
                //console.log("Threshold too low: " + Math.abs(difference) + "ms");
            }
            else {
                //console.log("Threshold matched: " + Math.abs(difference) + "ms");
                this.onResize();
            }
            // add dimension change script
            this.lastChanged = Date.now();
        }
    };
    // TODO Refactor
    ViewerComponent.prototype.onResize = function () {
        var container = this.myElement.nativeElement.children.namedItem("container");
        /// check for container
        if (!container) {
            console.error("No container in Three Viewer");
            return;
        }
        ///
        var width = container.offsetWidth;
        var height = container.offsetHeight;
        this.width = width;
        this.height = height;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    };
    //
    // update mode
    // todo: optimize
    // 
    ViewerComponent.prototype.updateModel = function () {
        this._model = this.dataService.getGsModel();
        if (!this._model || !this.scene) {
            console.warn("Model or Scene not defined.");
            this._modelshow = false;
            return;
        }
        try {
            this._updatemodel = true;
            this._modelshow = true;
            this.scene_and_maps = this.dataService.getscememaps();
            var scene_data = this.scene_and_maps.scene;
            this.clearScene();
            var loader = new three__WEBPACK_IMPORTED_MODULE_1__["ObjectLoader"]();
            // loading data
            var objectData = loader.parse(scene_data);
            this.seVisible = false;
            this.imVisible = false;
            this.LineNo = 0;
            // preprocessing
            if (objectData.children !== undefined) {
                var radius = 0;
                for (var i = 0; i < objectData.children.length; i++) {
                    var chd = objectData.children[i];
                    //chd["material"].needsUpdate=true;
                    chd["material"].transparent = true;
                    chd["material"].blending = 1;
                    if (chd.name === "All faces" || chd.name === "All wires" || chd.name === "All edges" || chd.name === "All vertices" ||
                        chd.name === "Other lines" || chd.name === "All points") {
                        chd["material"].transparent = false;
                        chd["geometry"].computeVertexNormals();
                        chd["geometry"].computeBoundingBox();
                        chd["geometry"].computeBoundingSphere();
                        if (chd.name === "All points") {
                            this.center = chd["geometry"].boundingSphere.center;
                        }
                        if (chd.name === "All edges") {
                            this.basicMat = chd["material"].color;
                        }
                        else if (chd.name === "Other lines") {
                            this.basicMat = chd["material"].color;
                        }
                        if (chd.type === "LineSegments" && chd["geometry"].index.count !== undefined) {
                            this.LineNo = this.LineNo + chd["geometry"].index.count;
                        }
                    }
                    if (chd["geometry"] != undefined && chd["geometry"].boundingSphere.radius !== null) {
                        if (chd["geometry"].boundingSphere.radius > radius) {
                            radius = chd["geometry"].boundingSphere.radius;
                            this.center = chd["geometry"].boundingSphere.center;
                        }
                    }
                }
            }
            // setting controls
            this.controls.target.set(this.center.x, this.center.y, this.center.z);
            this.controls.update();
            // adding the object to the scene
            this.scene.add(objectData);
            this.render(this);
            this.dataService.getpoints = [];
        }
        catch (ex) {
            console.error("Error displaying model:", ex);
            this._updatemodel = false;
            this.text = ex;
        }
    };
    ViewerComponent.prototype.getMaterial = function (name) {
        var canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        var context = canvas.getContext('2d');
        context.textAlign = "center";
        context.fillText(name, canvas.width / 2, canvas.height / 2);
        context.font = "Bold  100px sans-serif";
        var texture = new three__WEBPACK_IMPORTED_MODULE_1__["Texture"](canvas);
        //texture.needsUpdate = true;
        var spriteMaterial = new three__WEBPACK_IMPORTED_MODULE_1__["SpriteMaterial"]({ map: texture, color: 0xffffff });
        return spriteMaterial;
    };
    ViewerComponent.prototype.getchildren = function () {
        var children;
        for (var i = 0; i < this.scene.children.length; i++) {
            if (this.scene.children[i].name == "Scene") {
                children = this.scene.children[i].children;
                break;
            }
            if (i == this.scene.children.length - 1) {
                return [];
            }
        }
        return children;
    };
    ViewerComponent.prototype.clickshow = function () {
        var label = this.clickatt["label"];
        var id = this.clickatt["id"];
        var label_xyz = this.clickatt["label_xyz"];
        var path = this.clickatt["path"];
        this.addTextLabel(label, label_xyz, id, path, "All points");
    };
    ViewerComponent.prototype.select = function (seVisible) {
        event.stopPropagation();
        this.seVisible = !this.seVisible;
        if (this.seVisible) {
            if (this.SelectVisible === "Objs")
                this.objectselect(this.SelectVisible);
            if (this.SelectVisible === "Faces")
                this.faceselect(this.SelectVisible);
            if (this.SelectVisible === "Edges")
                this.edgeselect(this.SelectVisible);
            if (this.SelectVisible === "Vertices")
                this.verticeselect(this.SelectVisible);
            if (this.SelectVisible === "Points")
                this.pointselect(this.SelectVisible);
            for (var i = 0; i < this.getchildren().length; i++) {
                this.getchildren()[i]["material"].transparent = true;
            }
        }
        else {
            for (var i = 0; i < this.getchildren().length; i++) {
                this.getchildren()[i]["material"].transparent = false;
                if (this.getchildren()[i].name == "All edges") {
                    this.getchildren()[i]["material"].color = this.basicMat;
                }
                else if (this.getchildren()[i].name == "Other lines") {
                    this.getchildren()[i]["material"].color = this.basicMat;
                }
            }
        }
    };
    ViewerComponent.prototype.objectselect = function (SelectVisible) {
        event.stopPropagation();
        this.SelectVisible = "Objs";
        this.dataService.visible = "Objs";
        document.getElementById("gsv-object").style.color = null;
        document.getElementById("gsv-face").style.color = null;
        document.getElementById("gsv-wire").style.color = null;
        document.getElementById("gsv-edge").style.color = null;
        document.getElementById("gsv-vertice").style.color = null;
        var scenechildren = [];
        var children = this.getchildren();
        var objsvisibel = true;
        for (var i = 0; i < children.length; i++) {
            if (children[i].name === "All objs" || children[i].name === "All faces") {
                if (children[i]["geometry"].attributes.position.array.length !== 0) {
                    children[i]["material"].opacity = 0.3;
                    children[i].name = "All objs";
                    scenechildren.push(children[i]);
                }
                else {
                    objsvisibel = false;
                }
            }
            if (children[i].name === "All wires") {
                if (objsvisibel === true) {
                    children[i]["material"].opacity = 0;
                }
                else {
                    children[i]["material"].opacity = 0.6;
                    scenechildren.push(children[i]);
                }
            }
            if (children[i].name === "All edges" || children[i].name === "Other lines") {
                children[i]["material"].opacity = 0.1;
                children[i]["material"].color = this.basicMat;
            }
            if (children[i].name === "All vertices")
                children[i]["material"].opacity = 0;
        }
        this.dataService.addscenechild(scenechildren);
        this.dataService.SelectVisible = this.SelectVisible;
    };
    ViewerComponent.prototype.faceselect = function (SelectVisible) {
        event.stopPropagation();
        this.SelectVisible = "Faces";
        this.dataService.visible = "Faces";
        document.getElementById("gsv-object").style.color = "grey";
        document.getElementById("gsv-face").style.color = null;
        document.getElementById("gsv-wire").style.color = null;
        document.getElementById("gsv-edge").style.color = null;
        document.getElementById("gsv-vertice").style.color = null;
        var scenechildren = [];
        var children = this.getchildren();
        for (var i = 0; i < children.length; i++) {
            if (children[i].name === "All wires")
                children[i]["material"].opacity = 0.1;
            if (children[i].name === "All edges" || children[i].name === "Other lines") {
                children[i]["material"].opacity = 0.1;
                children[i]["material"].color = this.basicMat;
            }
            if (children[i].name === "All vertices")
                children[i]["material"].opacity = 0.1;
            if (children[i].name === "All objs" || children[i].name === "All faces") {
                children[i]["material"].opacity = 0.3;
                children[i].name = "All faces";
                scenechildren.push(children[i]);
            }
        }
        this.dataService.addscenechild(scenechildren);
        this.dataService.SelectVisible = this.SelectVisible;
    };
    ViewerComponent.prototype.wireselect = function (SelectVisible) {
        event.stopPropagation();
        this.SelectVisible = "Wires";
        var lineprecision = this.raycaster.linePrecision;
        for (var i = 0; i < this.scene.children.length; i++) {
            if (this.scene.children[i].name === "sphereInter") {
                var geometry = new three__WEBPACK_IMPORTED_MODULE_1__["SphereGeometry"](lineprecision * 2);
                this.scene.children[i]["geometry"] = geometry;
                this.renderer.render(this.scene, this.camera);
            }
        }
        document.getElementById("gsv-object").style.color = "grey";
        document.getElementById("gsv-face").style.color = "grey";
        document.getElementById("gsv-wire").style.color = null;
        document.getElementById("gsv-edge").style.color = null;
        document.getElementById("gsv-vertice").style.color = null;
        var scenechildren = [];
        var children = this.getchildren();
        for (var i = 0; i < children.length; i++) {
            if (children[i].name === "All objs" || children[i].name === "All faces")
                children[i]["material"].opacity = 0.1;
            if (children[i].name === "All edges" || children[i].name === "Other lines") {
                children[i]["material"].opacity = 0.1;
                children[i]["material"].color = this.basicMat;
            }
            if (children[i].name === "All vertices")
                children[i]["material"].opacity = 0.1;
            if (children[i].name === "All wires") {
                children[i]["material"].opacity = 0.6;
                scenechildren.push(children[i]);
            }
        }
        this.dataService.addscenechild(scenechildren);
        this.dataService.SelectVisible = this.SelectVisible;
    };
    ViewerComponent.prototype.edgeselect = function (SelectVisible) {
        event.stopPropagation();
        this.SelectVisible = "Edges";
        var lineprecision = this.raycaster.linePrecision;
        for (var i = 0; i < this.scene.children.length; i++) {
            if (this.scene.children[i].name === "sphereInter") {
                var geometry = new three__WEBPACK_IMPORTED_MODULE_1__["SphereGeometry"](lineprecision * 15);
                this.scene.children[i]["geometry"] = geometry;
                this.renderer.render(this.scene, this.camera);
            }
        }
        document.getElementById("gsv-object").style.color = "grey";
        document.getElementById("gsv-face").style.color = "grey";
        document.getElementById("gsv-wire").style.color = "grey";
        document.getElementById("gsv-edge").style.color = null;
        document.getElementById("gsv-vertice").style.color = null;
        var scenechildren = [];
        var children = this.getchildren();
        var edgevisible = true;
        for (var i = 0; i < children.length; i++) {
            children[i]["material"].transparent = true;
            if (children[i].name === "All edges" || children[i].name === "Other lines") {
                if (children[i].name === "All edges") {
                    if (children[i]["geometry"].attributes.position.array.length !== 0) {
                        children[i]["material"].opacity = 0.3;
                        children[i]["material"].color = new three__WEBPACK_IMPORTED_MODULE_1__["Color"](255, 255, 0);
                        scenechildren.push(children[i]);
                    }
                    else {
                        edgevisible = false;
                    }
                }
                else {
                    if (children[i]["geometry"].attributes.position.array.length !== 0) {
                        children[i]["material"].opacity = 0.3;
                        children[i]["material"].color = new three__WEBPACK_IMPORTED_MODULE_1__["Color"](255, 255, 0);
                        scenechildren.push(children[i]);
                    }
                }
            }
            if (children[i].name === "All objs" || children[i].name === "All faces")
                children[i]["material"].opacity = 0.1;
            if (children[i].name === "All wires")
                children[i]["material"].opacity = 0.1;
            if (children[i].name === "All vertices")
                children[i]["material"].opacity = 0.1;
        }
        this.dataService.addscenechild(scenechildren);
        this.dataService.SelectVisible = this.SelectVisible;
    };
    ViewerComponent.prototype.verticeselect = function (SelectVisible) {
        event.stopPropagation();
        this.SelectVisible = "Vertices";
        var pointradius = this.dataService.pointradius;
        ;
        for (var i = 0; i < this.scene.children.length; i++) {
            if (this.scene.children[i].name === "sphereInter") {
                var geometry = new three__WEBPACK_IMPORTED_MODULE_1__["SphereGeometry"](pointradius * 10);
                this.scene.children[i]["geometry"] = geometry;
                this.renderer.render(this.scene, this.camera);
            }
        }
        document.getElementById("gsv-object").style.color = "grey";
        document.getElementById("gsv-face").style.color = "grey";
        document.getElementById("gsv-wire").style.color = "grey";
        document.getElementById("gsv-edge").style.color = "grey";
        document.getElementById("gsv-vertice").style.color = null;
        var scenechildren = [];
        var children = this.getchildren();
        for (var i = 0; i < children.length; i++) {
            if (children[i].name === "All objs" || children[i].name === "All faces")
                children[i]["material"].opacity = 0.1;
            if (children[i].name === "All wires")
                children[i]["material"].opacity = 0.1;
            if (children[i].name === "All edges" || children[i].name === "Other lines") {
                children[i]["material"].opacity = 0.1;
                children[i]["material"].color = this.basicMat;
            }
            /*if(children[i].name==="All vertices"){
              scenechildren.push(children[i]);
            }*/
            if (children[i].name === "All points") {
                scenechildren.push(children[i]);
                children[i]["material"].opacity = 1;
            }
        }
        this.dataService.addscenechild(scenechildren);
        this.dataService.SelectVisible = this.SelectVisible;
    };
    ViewerComponent.prototype.pointselect = function (SelectVisible) {
        /*event.stopPropagation();
        this.verticeselect("Vertices");
        this.SelectVisible="Points";
        this.dataService.SelectVisible=this.SelectVisible;*/
        event.stopPropagation();
        this.SelectVisible = "Points";
        var pointradius = this.dataService.pointradius;
        ;
        for (var i = 0; i < this.scene.children.length; i++) {
            if (this.scene.children[i].name === "sphereInter") {
                var geometry = new three__WEBPACK_IMPORTED_MODULE_1__["SphereGeometry"](pointradius * 10);
                this.scene.children[i]["geometry"] = geometry;
                this.renderer.render(this.scene, this.camera);
            }
        }
        document.getElementById("gsv-object").style.color = "grey";
        document.getElementById("gsv-face").style.color = "grey";
        document.getElementById("gsv-wire").style.color = "grey";
        document.getElementById("gsv-edge").style.color = "grey";
        document.getElementById("gsv-vertice").style.color = null;
        var scenechildren = [];
        var children = this.getchildren();
        for (var i = 0; i < children.length; i++) {
            if (children[i].name === "All objs" || children[i].name === "All faces")
                children[i]["material"].opacity = 0.1;
            if (children[i].name === "All wires")
                children[i]["material"].opacity = 0.1;
            if (children[i].name === "All edges" || children[i].name === "Other lines") {
                children[i]["material"].opacity = 0.1;
                children[i]["material"].color = this.basicMat;
            }
            if (children[i].name === "All vertices") {
                children[i]["material"].opacity = 1;
            }
            if (children[i].name === "All points") {
                scenechildren.push(children[i]);
            }
        }
        this.dataService.addscenechild(scenechildren);
        this.dataService.SelectVisible = this.SelectVisible;
    };
    //
    //  events
    //
    ViewerComponent.prototype.mousedown = function ($event) {
        this.animate(this);
        this.mDownTime = (new Date()).getTime();
    };
    ViewerComponent.prototype.mouseup = function ($event) {
        this.mUpTime = (new Date()).getTime();
    };
    ViewerComponent.prototype.onDocumentMouseMove = function (event) {
        //this.onResize();
        if (this.seVisible === true) {
            this.animate(this);
            this.mouse.x = (event.offsetX / this.width) * 2 - 1;
            this.mouse.y = -(event.offsetY / this.height) * 2 + 1;
        }
        else {
            this.render(this);
        }
    };
    ViewerComponent.prototype.addgrid = function () {
        for (var i = 0; i < this.scene.children.length; i++) {
            if (this.scene.children[i].name === "GridHelper") {
                this.scene.remove(this.scene.children[i]);
                i = i - 1;
            }
        }
        // todo: change grid -> grid_value
        if (this.dataService.grid) {
            var gridhelper = new three__WEBPACK_IMPORTED_MODULE_1__["GridHelper"](100, 10);
            gridhelper.name = "GridHelper";
            var vector = new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](0, 1, 0);
            gridhelper.lookAt(vector);
            gridhelper.position.set(0, 0, 0);
            this.scene.add(gridhelper);
            this.dataService.centerx = 0;
            this.dataService.centery = 0;
            this.dataService.centerz = 0;
        }
    };
    /// selects object from three.js scene
    ViewerComponent.prototype.onDocumentMouseDown = function (event) {
        var threshold;
        if (this.seVisible === true) {
            threshold = 100;
        }
        else {
            threshold = 0.1;
        }
        if (Math.abs(this.mDownTime - this.mUpTime) > threshold) {
            this.mDownTime = 0;
            this.mUpTime = 0;
            return;
        }
        var selectedObj, intersects;
        var select = false;
        this.scenechildren = this.dataService.getscenechild();
        this.raycaster.setFromCamera(this.mouse, this.camera);
        intersects = this.raycaster.intersectObjects(this.scenechildren);
        if (intersects.length > 0) {
            selectedObj = intersects[0].object;
            if (this.scenechildren[0].name === "All objs") {
                var index_1 = Math.floor(intersects[0].faceIndex);
                var path_1 = this.scene_and_maps.faces_map.get(index_1);
                var face = this._model.getGeom().getTopo(path_1);
                var label = "";
                var id_1 = "o" + path_1.id;
                var getpoints;
                var getpoints = this.dataService.getpoints;
                var pointname = this.dataService.pointname;
                if (getpoints !== undefined && getpoints.length !== 0) {
                    for (var i = 0; i < getpoints.length; i++) {
                        if (id_1 === getpoints[i].label) {
                            if (this.dataService.checkobj === true)
                                label = id_1;
                            for (var n = 0; n < pointname.length; n++) {
                                if (this.dataService.checkname[n] === true) {
                                    label = label.concat('<br/>', pointname[n], ":", getpoints[i][n]);
                                }
                            }
                        }
                    }
                }
                var label_xyz = face.getLabelCentroid();
                var faces = face.getObj().getFaces();
                if (this.textlabels.length === 0) {
                    for (var n = 0; n < faces.length; n++) {
                        var verts = faces[n].getVertices();
                        var verts_xyz = verts.map(function (v) { return v.getPoint().getPosition(); });
                        var geometry = new three__WEBPACK_IMPORTED_MODULE_1__["Geometry"]();
                        for (var i = 0; i < verts_xyz.length; i++) {
                            geometry.vertices.push(new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](verts_xyz[i][0], verts_xyz[i][1], verts_xyz[i][2]));
                        }
                        /*if(verts.length===4){
                          geometry.faces.push(new THREE.Face3(0,2,1));
                          geometry.faces.push(new THREE.Face3(0,3,2));
                        }else if(verts.length===3){
                          geometry.faces.push(new THREE.Face3(0,2,1));
                        }
                        var mesh=new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color:0x00ff00,side:THREE.DoubleSide} ));
                        mesh["geometry"].computeVertexNormals();
                        mesh.userData.id=label;
                        mesh.name="selects";
                        this.scene.add(mesh);*/
                        var material = new three__WEBPACK_IMPORTED_MODULE_1__["LineBasicMaterial"]({ color: 0x00ff00, side: three__WEBPACK_IMPORTED_MODULE_1__["DoubleSide"] });
                        var line = new three__WEBPACK_IMPORTED_MODULE_1__["Line"](geometry, material);
                        line.userData.id = id_1;
                        //line["material"].needsUpdate=true;
                        line.name = "selects";
                        this.scene.add(line);
                    }
                    this.addTextLabel(label, label_xyz, label, path_1, "All objs");
                }
                else {
                    for (var j = 0; j < this.scene.children.length; j++) {
                        if (id_1 === this.scene.children[j].userData.id) {
                            select = true;
                            this.scene.remove(this.scene.children[j]);
                            j = j - 1;
                        }
                    }
                    for (var j = 0; j < this.textlabels.length; j++) {
                        if (id_1 === this.textlabels[j]["id"]) {
                            select = true;
                            this.removeTextLabel(this.textlabels[j]["id"]);
                            j = j - 1;
                        }
                    }
                    if (select == false) {
                        for (var n = 0; n < faces.length; n++) {
                            var verts = faces[n].getVertices();
                            var verts_xyz = verts.map(function (v) { return v.getPoint().getPosition(); });
                            var geometry = new three__WEBPACK_IMPORTED_MODULE_1__["Geometry"]();
                            for (var i = 0; i < verts_xyz.length; i++) {
                                geometry.vertices.push(new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](verts_xyz[i][0], verts_xyz[i][1], verts_xyz[i][2]));
                            }
                            var material = new three__WEBPACK_IMPORTED_MODULE_1__["LineBasicMaterial"]({ color: 0x00ff00, side: three__WEBPACK_IMPORTED_MODULE_1__["DoubleSide"] });
                            var line = new three__WEBPACK_IMPORTED_MODULE_1__["Line"](geometry, material);
                            line.userData.id = id_1;
                            //line["material"].needsUpdate=true;
                            line.name = "selects";
                            this.scene.add(line);
                        }
                        this.addTextLabel(label, label_xyz, id_1, path_1, "All objs");
                    }
                }
            }
            if (this.scenechildren[0].name === "All faces") {
                var index_2 = Math.floor(intersects[0].faceIndex);
                var path_2 = this.scene_and_maps.faces_map.get(index_2);
                var face = this._model.getGeom().getTopo(path_2);
                var label = "";
                var getpoints;
                var getpoints = this.dataService.getpoints;
                var pointname = this.dataService.pointname;
                if (getpoints !== undefined && getpoints.length !== 0) {
                    for (var i = 0; i < getpoints.length; i++) {
                        if (face.getLabel() === getpoints[i].label) {
                            for (var n = 0; n < pointname.length; n++) {
                                if (this.dataService.checkface === true)
                                    label = face.getLabel();
                                if (this.dataService.checkname[n] === true) {
                                    label = label.concat('<br/>', pointname[n], ":", getpoints[i][n]);
                                }
                            }
                        }
                    }
                }
                var label_xyz = face.getLabelCentroid();
                var verts_1 = face.getVertices();
                var verts_xyz_1 = verts_1.map(function (v) { return v.getPoint().getPosition(); });
                if (this.textlabels.length === 0) {
                    var geometry = new three__WEBPACK_IMPORTED_MODULE_1__["Geometry"]();
                    for (var i = 0; i < verts_xyz_1.length; i++) {
                        geometry.vertices.push(new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](verts_xyz_1[i][0], verts_xyz_1[i][1], verts_xyz_1[i][2]));
                    }
                    var material = new three__WEBPACK_IMPORTED_MODULE_1__["LineBasicMaterial"]({ color: 0x00ff00, side: three__WEBPACK_IMPORTED_MODULE_1__["DoubleSide"] });
                    var line = new three__WEBPACK_IMPORTED_MODULE_1__["Line"](geometry, material);
                    line.userData.id = face.getLabel();
                    //line["material"].needsUpdate=true;
                    line.name = "selects";
                    this.scene.add(line);
                    this.addTextLabel(label, label_xyz, face.getLabel(), path_2, "All faces");
                }
                else {
                    for (var j = 0; j < this.scene.children.length; j++) {
                        if (face.getLabel() === this.scene.children[j].userData.id) {
                            select = true;
                            this.scene.remove(this.scene.children[j]);
                        }
                    }
                    for (var j = 0; j < this.textlabels.length; j++) {
                        if (face.getLabel() === this.textlabels[j]["id"]) {
                            select = true;
                            this.removeTextLabel(this.textlabels[j]["id"]);
                        }
                    }
                    if (select == false) {
                        var geometry = new three__WEBPACK_IMPORTED_MODULE_1__["Geometry"]();
                        for (var i = 0; i < verts_xyz_1.length; i++) {
                            geometry.vertices.push(new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](verts_xyz_1[i][0], verts_xyz_1[i][1], verts_xyz_1[i][2]));
                        }
                        var material = new three__WEBPACK_IMPORTED_MODULE_1__["LineBasicMaterial"]({ color: 0x00ff00, side: three__WEBPACK_IMPORTED_MODULE_1__["DoubleSide"] });
                        var line = new three__WEBPACK_IMPORTED_MODULE_1__["Line"](geometry, material);
                        line.userData.id = face.getLabel();
                        //line["material"].needsUpdate=true;
                        line.name = "selects";
                        this.scene.add(line);
                        this.addTextLabel(label, label_xyz, face.getLabel(), path_2, "All faces");
                    }
                }
            }
            if (this.scenechildren[0].name == "All wires") {
                var index_3 = Math.floor(intersects[0].index / 2);
                var path_3 = this.scene_and_maps.wires_map.get(index_3);
                var wire = this._model.getGeom().getTopo(path_3);
                var label_1 = wire.getLabel();
                var label_xyz = wire.getLabelCentroid();
                var verts_2 = wire.getVertices();
                var verts_xyz_2 = verts_2.map(function (v) { return v.getPoint().getPosition(); });
                if (wire.isClosed()) {
                    verts_xyz_2.push(verts_xyz_2[0]);
                }
                if (this.textlabels.length === 0) {
                    var geometry = new three__WEBPACK_IMPORTED_MODULE_1__["Geometry"]();
                    for (var i = 0; i < verts_xyz_2.length; i++) {
                        geometry.vertices.push(new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](verts_xyz_2[i][0], verts_xyz_2[i][1], verts_xyz_2[i][2]));
                    }
                    var material = new three__WEBPACK_IMPORTED_MODULE_1__["LineBasicMaterial"]({ color: 0x00ff00, side: three__WEBPACK_IMPORTED_MODULE_1__["DoubleSide"] });
                    var line = new three__WEBPACK_IMPORTED_MODULE_1__["Line"](geometry, material);
                    line.userData.id = label_1;
                    //line["material"].needsUpdate=true;
                    line.name = "selects";
                    this.scene.add(line);
                    this.addTextLabel(label_1, label_xyz, label_1, path_3, "All wires");
                }
                else {
                    for (var j = 0; j < this.scene.children.length; j++) {
                        if (label_1 === this.scene.children[j].userData.id) {
                            select = true;
                            this.scene.remove(this.scene.children[j]);
                        }
                    }
                    for (var j = 0; j < this.textlabels.length; j++) {
                        if (label_1 === this.textlabels[j]["id"]) {
                            select = true;
                            this.removeTextLabel(this.textlabels[j]["id"]);
                        }
                    }
                    if (select == false) {
                        var geometry = new three__WEBPACK_IMPORTED_MODULE_1__["Geometry"]();
                        for (var i = 0; i < verts_xyz_2.length; i++) {
                            geometry.vertices.push(new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](verts_xyz_2[i][0], verts_xyz_2[i][1], verts_xyz_2[i][2]));
                        }
                        var material = new three__WEBPACK_IMPORTED_MODULE_1__["LineBasicMaterial"]({ color: 0x00ff00, side: three__WEBPACK_IMPORTED_MODULE_1__["DoubleSide"] });
                        var line = new three__WEBPACK_IMPORTED_MODULE_1__["Line"](geometry, material);
                        line.userData.id = label_1;
                        //line["material"].needsUpdate=true;
                        line.name = "selects";
                        this.scene.add(line);
                        this.addTextLabel(label_1, label_xyz, label_1, path_3, "All wires");
                    }
                }
            }
            if (this.scenechildren[0].name == "All edges") {
                var label = "";
                var index = Math.floor(intersects[0].index / 2);
                if (this.scene_and_maps.edges_map !== null && (index < this.scene_and_maps.edges_map.size || index === this.scene_and_maps.edges_map.size)) {
                    var path = this.scene_and_maps.edges_map.get(index);
                    var edge = this._model.getGeom().getTopo(path);
                    var id = edge.getLabel();
                    var label_show = id;
                    for (var i = 1; i < intersects.length; i++) {
                        if (intersects[0].distance === intersects[i].distance) {
                            index = Math.floor(intersects[i].index / 2);
                            path = this.scene_and_maps.edges_map.get(index);
                            edge = this._model.getGeom().getTopo(path);
                            id = edge.getLabel();
                            if (label_show !== id)
                                label_show = label_show + "<br/>" + id;
                        }
                    }
                    var getpoints;
                    var getpoints = this.dataService.getpoints;
                    var pointname = this.dataService.pointname;
                    if (getpoints !== undefined && getpoints.length !== 0) {
                        for (var i = 0; i < getpoints.length; i++) {
                            if (edge.getLabel() === getpoints[i].label) {
                                if (this.dataService.checkedgeid === true) {
                                    label = label_show;
                                }
                                for (var n = 0; n < pointname.length; n++) {
                                    if (this.dataService.checkname[n] === true) {
                                        label = label.concat('<br/>', pointname[n], ":", getpoints[i][n]);
                                    }
                                }
                            }
                        }
                    }
                    var label_xyz = edge.getLabelCentroid();
                    var verts_3 = edge.getVertices();
                    var verts_xyz_3 = verts_3.map(function (v) { return v.getPoint().getPosition(); });
                    if (this.textlabels.length === 0) {
                        var geometry = new three__WEBPACK_IMPORTED_MODULE_1__["Geometry"]();
                        for (var i = 0; i < verts_xyz_3.length; i++) {
                            geometry.vertices.push(new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](verts_xyz_3[i][0], verts_xyz_3[i][1], verts_xyz_3[i][2]));
                        }
                        var material = new three__WEBPACK_IMPORTED_MODULE_1__["LineBasicMaterial"]({ color: 0x00ff00, side: three__WEBPACK_IMPORTED_MODULE_1__["DoubleSide"] });
                        var line = new three__WEBPACK_IMPORTED_MODULE_1__["Line"](geometry, material);
                        line.userData.id = edge.getLabel();
                        //line["material"].needsUpdate=true;
                        line.name = "selects";
                        this.scene.add(line);
                        this.addTextLabel(label, label_xyz, edge.getLabel(), path, "All edges");
                    }
                    else {
                        for (var j = 0; j < this.scene.children.length; j++) {
                            if (edge.getLabel() === this.scene.children[j].userData.id) {
                                select = true;
                                this.scene.remove(this.scene.children[j]);
                            }
                        }
                        for (var j = 0; j < this.textlabels.length; j++) {
                            if (edge.getLabel() === this.textlabels[j]["id"]) {
                                select = true;
                                this.removeTextLabel(this.textlabels[j]["id"]);
                            }
                        }
                        if (select == false) {
                            var geometry = new three__WEBPACK_IMPORTED_MODULE_1__["Geometry"]();
                            for (var i = 0; i < verts_xyz_3.length; i++) {
                                geometry.vertices.push(new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](verts_xyz_3[i][0], verts_xyz_3[i][1], verts_xyz_3[i][2]));
                            }
                            var material = new three__WEBPACK_IMPORTED_MODULE_1__["LineBasicMaterial"]({ color: 0x00ff00, side: three__WEBPACK_IMPORTED_MODULE_1__["DoubleSide"] });
                            var line = new three__WEBPACK_IMPORTED_MODULE_1__["Line"](geometry, material);
                            line.userData.id = edge.getLabel();
                            line.name = "selects";
                            this.scene.add(line);
                            this.addTextLabel(label, label_xyz, edge.getLabel(), path, "All edges");
                        }
                    }
                }
            }
            else if (this.scenechildren[0].name == "Other lines") {
                var label = "";
                var index = Math.floor(intersects[0].index / 2);
                if (this.scene_and_maps.edges_map !== null && (index < this.scene_and_maps.edges_map.size || index === this.scene_and_maps.edges_map.size)) {
                    var path = this.scene_and_maps.edges_map.get(index);
                    var edge = this._model.getGeom().getTopo(path);
                    var id = edge.getLabel();
                    label = id;
                    for (var i = 1; i < intersects.length; i++) {
                        if (intersects[0].distance === intersects[i].distance) {
                            index = Math.floor(intersects[i].index / 2);
                            path = this.scene_and_maps.edges_map.get(index);
                            edge = this._model.getGeom().getTopo(path);
                            id = edge.getLabel();
                            if (label !== id)
                                label = label + "<br/>" + id;
                        }
                    }
                    var label_xyz = edge.getLabelCentroid();
                    var verts_4 = edge.getVertices();
                    var verts_xyz_4 = verts_4.map(function (v) { return v.getPoint().getPosition(); });
                    if (this.textlabels.length === 0) {
                        var geometry = new three__WEBPACK_IMPORTED_MODULE_1__["Geometry"]();
                        for (var i = 0; i < verts_xyz_4.length; i++) {
                            geometry.vertices.push(new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](verts_xyz_4[i][0], verts_xyz_4[i][1], verts_xyz_4[i][2]));
                        }
                        var material = new three__WEBPACK_IMPORTED_MODULE_1__["LineBasicMaterial"]({ color: 0x00ff00, side: three__WEBPACK_IMPORTED_MODULE_1__["DoubleSide"] });
                        var line = new three__WEBPACK_IMPORTED_MODULE_1__["Line"](geometry, material);
                        line.userData.id = label;
                        //line["material"].needsUpdate=true;
                        line.name = "selects";
                        this.scene.add(line);
                        this.addTextLabel(label, label_xyz, label, path, "Other lines");
                    }
                    else {
                        for (var j = 0; j < this.scene.children.length; j++) {
                            if (label === this.scene.children[j].userData.id) {
                                select = true;
                                this.scene.remove(this.scene.children[j]);
                            }
                        }
                        for (var j = 0; j < this.textlabels.length; j++) {
                            if (label === this.textlabels[j]["id"]) {
                                select = true;
                                this.removeTextLabel(this.textlabels[j]["id"]);
                            }
                        }
                        if (select == false) {
                            var geometry = new three__WEBPACK_IMPORTED_MODULE_1__["Geometry"]();
                            for (var i = 0; i < verts_xyz_4.length; i++) {
                                geometry.vertices.push(new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](verts_xyz_4[i][0], verts_xyz_4[i][1], verts_xyz_4[i][2]));
                            }
                            var material = new three__WEBPACK_IMPORTED_MODULE_1__["LineBasicMaterial"]({ color: 0x00ff00, side: three__WEBPACK_IMPORTED_MODULE_1__["DoubleSide"] });
                            var line = new three__WEBPACK_IMPORTED_MODULE_1__["Line"](geometry, material);
                            line.userData.id = label;
                            line.name = "selects";
                            this.scene.add(line);
                            this.addTextLabel(label, label_xyz, label, path, "Other lines");
                        }
                    }
                }
            }
            if (this.scenechildren[0].name === "All points") {
                var distance = intersects[0].distanceToRay;
                var index = intersects[0].index;
                for (var i = 1; i < intersects.length; i++) {
                    if (distance > intersects[i].distanceToRay) {
                        distance = intersects[i].distanceToRay;
                        index = intersects[i].index;
                    }
                }
                var attributevertix = this.dataService.getattrvertix();
                var id = this._model.getGeom().getAllPoints()[index].getLabel();
                var label = "";
                var getpoints;
                var getpoints = this.dataService.getpoints;
                var pointname = this.dataService.pointname;
                if (this.SelectVisible === "Points") {
                    if (getpoints !== undefined && getpoints.length !== 0) {
                        for (var i = 0; i < getpoints.length; i++) {
                            if (id === getpoints[i].id) {
                                if (this.dataService.checkpointid === true) {
                                    label = id;
                                    for (var j = 1; j < intersects.length; j++) {
                                        if (intersects[0].distance === intersects[j].distance) {
                                            var index = intersects[j].index;
                                            var id = this._model.getGeom().getAllPoints()[index].getLabel();
                                            if (label !== id)
                                                label = label + "<br/>" + id;
                                        }
                                    }
                                }
                                if (this.dataService.checkX === true)
                                    label = label.concat('<br/>', "X:", getpoints[i].x);
                                if (this.dataService.checkY === true)
                                    label = label.concat('<br/>', "Y:", getpoints[i].y);
                                if (this.dataService.checkZ === true)
                                    label = label.concat('<br/>', "Z:", getpoints[i].z);
                                for (var n = 0; n < pointname.length; n++) {
                                    if (this.dataService.checkname[n] === true) {
                                        label = label.concat('<br/>', pointname[n], ":", getpoints[i][n]);
                                    }
                                }
                            }
                        }
                    }
                }
                if (this.SelectVisible === "Vertices") {
                    var pointid = "";
                    if (getpoints !== undefined && getpoints.length !== 0) {
                        for (var i = 0; i < attributevertix.length; i++) {
                            if (id === attributevertix[i].pointid) {
                                pointid = id;
                                if (this.dataService.checkvertixid === true) {
                                    if (label === "")
                                        label = attributevertix[i].vertixlabel;
                                    else {
                                        label = label + "<br/>" + attributevertix[i].vertixlabel;
                                    }
                                }
                            }
                        }
                        if (this.dataService.pointid === true) {
                            if (pointid !== "") {
                                if (label === "")
                                    label = id;
                                else {
                                    label = label + "<br/>" + id;
                                }
                            }
                        }
                    }
                }
                var verts_xyz_5 = this._model.getGeom().getAllPoints()[index].getPosition(); //vertices.getPoint().getPosition();
                if (this.textlabels.length === 0) {
                    var geometry = new three__WEBPACK_IMPORTED_MODULE_1__["Geometry"]();
                    geometry.vertices.push(new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](verts_xyz_5[0], verts_xyz_5[1], verts_xyz_5[2]));
                    var pointsmaterial = new three__WEBPACK_IMPORTED_MODULE_1__["PointsMaterial"]({ color: 0x00ff00, size: 1 });
                    //pointsmaterial.sizeAttenuation=false;
                    if (this.dataService.pointsize !== undefined) {
                        pointsmaterial.size = this.dataService.pointsize;
                    }
                    var points = new three__WEBPACK_IMPORTED_MODULE_1__["Points"](geometry, pointsmaterial);
                    points.userData.id = id;
                    //points["material"].needsUpdate=true;
                    points.name = "selects";
                    this.scene.add(points);
                    this.addTextLabel(label, verts_xyz_5, id, id, "All points");
                }
                else {
                    for (var j = 0; j < this.scene.children.length; j++) {
                        if (id === this.scene.children[j].userData.id) {
                            select = true;
                            this.scene.remove(this.scene.children[j]);
                        }
                    }
                    for (var j = 0; j < this.textlabels.length; j++) {
                        if (id === this.textlabels[j]["id"]) {
                            select = true;
                            this.removeTextLabel(this.textlabels[j]["id"]);
                        }
                    }
                    if (select == false) {
                        var geometry = new three__WEBPACK_IMPORTED_MODULE_1__["Geometry"]();
                        geometry.vertices.push(new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](verts_xyz_5[0], verts_xyz_5[1], verts_xyz_5[2]));
                        var pointsmaterial = new three__WEBPACK_IMPORTED_MODULE_1__["PointsMaterial"]({ color: 0x00ff00, size: 1 });
                        if (this.dataService.pointsize !== undefined) {
                            pointsmaterial.size = this.dataService.pointsize;
                        }
                        var points = new three__WEBPACK_IMPORTED_MODULE_1__["Points"](geometry, pointsmaterial);
                        points.userData.id = id;
                        //points["material"].needsUpdate=true;
                        points.name = "selects";
                        this.scene.add(points);
                        this.addTextLabel(label, verts_xyz_5, id, id, "All points");
                    }
                }
            }
            /*if(this.scenechildren[0].name === "All vertices"){
              var distance:number=intersects[ 0 ].distanceToRay;
              var index:number=intersects[ 0 ].index;
              for(var i=1;i<intersects.length;i++){
                if(distance>intersects[ i ].distanceToRay){
                  distance=intersects[ i ].distanceToRay;
                  index=intersects[ i ].index;
                }
              }
              var id:string=this._model.getGeom().getAllPoints()[index].getLabel();
              var label:string="";
              var getpoints:Array<any>;
              var getpoints=this.dataService.getpoints;
              var pointname=this.dataService.pointname;
      
              /*var path: gs.ITopoPathData = this.scene_and_maps.vertices_map.get(index);
              var vertices: gs.IVertex = this._model.getGeom().getTopo(path) as gs.IVertex;
              var id: string = "";
              var attributevertix=this.dataService.getattrvertix();*/
            //var vertices: gs.IVertex= this._model.getGeom().getTopo(path) as gs.IVertex;
            //var id:string=this._model.getGeom().getAllPoints()[index].getLabel();
            //console.log(vertices.getPoint().getPosition());
            /*var label:string="";
            var attributevertix=this.dataService.getattrvertix();
            console.log(attributevertix);
            for(var i=0;i<attributevertix.length;i++){
              if(vertices.getLabel()===attributevertix[i].vertixlabel){
                id=attributevertix[i].pointid;
                label=vertices.getLabel();
                break;
              }
            }
            console.log(id);
            if(id!==""){
              for(var i=0;i<attributevertix.length;i++){
                if(id===attributevertix[i].pointid){
                  var str=attributevertix[i].vertixlabel;
                  if(label!==str) label=label+"<br/>"+str;
                }
              }
            }*/
            /*const verts_xyz: gs.XYZ = vertices.getPoint().getPosition();//this._model.getGeom().getAllPoints()[index].getPosition();//vertices.getPoint().getPosition();
            console.log(verts_xyz);
            if(this.textlabels.length===0) {
              var geometry=new THREE.Geometry();
              geometry.vertices.push(new THREE.Vector3(verts_xyz[0],verts_xyz[1],verts_xyz[2]));
              var pointsmaterial=new THREE.PointsMaterial( { color:0x00ff00,size:1} );
              //pointsmaterial.sizeAttenuation=false;
              if(this.dataService.pointsize!==undefined){
                pointsmaterial.size=this.dataService.pointsize;
              }
              const points = new THREE.Points( geometry, pointsmaterial);
              points.userData.id=id;
              //points["material"].needsUpdate=true;
              points.name="selects";
              this.scene.add(points);
              this.addTextLabel(label,verts_xyz, id,id,"All points");
            }else{
              for(var j=0;j<this.scene.children.length;j++){
                if(id===this.scene.children[j].userData.id){
                  select=true;
                  this.scene.remove(this.scene.children[j]);
                }
              }
              for(var j=0;j<this.textlabels.length;j++){
                  if(id===this.textlabels[j]["id"]){
                    select=true;
                    this.removeTextLabel(this.textlabels[j]["id"]);
                  }
              }
              if(select==false){
                var geometry=new THREE.Geometry();
                geometry.vertices.push(new THREE.Vector3(verts_xyz[0],verts_xyz[1],verts_xyz[2]));
                var pointsmaterial=new THREE.PointsMaterial( { color:0x00ff00,size:1} );
                if(this.dataService.pointsize!==undefined){
                  pointsmaterial.size=this.dataService.pointsize;
                }
                const points = new THREE.Points( geometry, pointsmaterial);
                points.userData.id=id;
                //points["material"].needsUpdate=true;
                points.name="selects";
                this.scene.add(points);
                this.addTextLabel(label,verts_xyz, id,id,"All points");
              }
            }
          }*/
        }
        else {
            /*for(var i=0;i<this.dataService.sprite.length;i++){
              this.dataService.sprite[i].visible=false;
            }*/
            for (var i = 0; i < this.scene.children.length; i++) {
                if (this.scene.children[i].name == "selects") {
                    this.scene.remove(this.scene.children[i]);
                    i = i - 1;
                }
            }
            for (var i = 0; i < this.textlabels.length; i++) {
                this.removeTextLabel(this.textlabels[i]["id"]);
                i = i - 1;
            }
        }
    };
    //To add text labels just provide label text, label position[x,y,z] and its id
    ViewerComponent.prototype.addTextLabel = function (label, label_xyz, id, path, type) {
        var container = this.myElement.nativeElement.children.namedItem("container");
        var star = this.creatStarGeometry(label_xyz);
        var textLabel = this.createTextLabel(label, star, id, path, type);
        this.starsGeometry.vertices.push(star);
        this.textlabels.push(textLabel);
        this.dataService.pushselecting(textLabel);
        container.appendChild(textLabel.element);
    };
    //To remove text labels just provide its id
    ViewerComponent.prototype.removeTextLabel = function (id) {
        var i = 0;
        for (i = 0; i < this.textlabels.length; i++) {
            if (this.textlabels[i].id == id) {
                var container = this.myElement.nativeElement.children.namedItem("container");
                container.removeChild(this.textlabels[i].element);
                var index = this.starsGeometry.vertices.indexOf(this.textlabels[i].parent);
                if (index !== -1) {
                    this.starsGeometry.vertices.splice(index, 1);
                }
                break;
            }
        }
        if (i < this.textlabels.length) {
            this.textlabels.splice(i, 1);
            this.dataService.spliceselecting(i, 1);
        }
    };
    ViewerComponent.prototype.creatStarGeometry = function (label_xyz) {
        var star = new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"]();
        star.x = label_xyz[0];
        star.y = label_xyz[1];
        star.z = label_xyz[2];
        return star;
    };
    ViewerComponent.prototype.createTextLabel = function (label, star, id, path, type) {
        var div = this.createLabelDiv();
        var self = this;
        var textLabel = {
            id: id,
            path: path,
            element: div,
            parent: false,
            type: type,
            position: new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](0, 0, 0),
            setHTML: function (html) {
                this.element.innerHTML = html;
            },
            setParent: function (threejsobj) {
                this.parent = threejsobj;
            },
            updatePosition: function () {
                if (parent) {
                    //this.position.copy(this.parent);
                    this.position.copy(this.parent);
                }
                var coords2d = this.get2DCoords(this.position, self.camera);
                this.element.style.left = coords2d.x + 'px';
                this.element.style.top = coords2d.y + 'px';
            },
            get2DCoords: function (position, camera) {
                var vector = position.project(camera);
                vector.x = (vector.x + 1) / 2 * self.width;
                vector.y = -(vector.y - 1) / 2 * self.height;
                return vector;
            }
        };
        textLabel.setHTML(label);
        textLabel.setParent(star);
        return textLabel;
    };
    ViewerComponent.prototype.createLabelDiv = function () {
        var div = document.createElement("div");
        div.style.color = '#00f';
        div.style.fontFamily = '"Fira Mono", Monaco, "Andale Mono", "Lucida Console", "Bitstream Vera Sans Mono", "Courier New", Courier, monospace';
        div.style.margin = '-5px 0 0 15px';
        div.style.pointerEvents = 'none';
        div.style.position = 'absolute';
        div.style.width = '100';
        div.style.height = '100';
        div.style.top = '-1000';
        div.style.left = '-1000';
        div.style.textShadow = "0px 0px 3px white";
        div.style.color = "black";
        return div;
    };
    ViewerComponent.prototype.zoomfit = function () {
        event.stopPropagation();
        if (this.dataService.selecting.length === 0) {
            var obj = new three__WEBPACK_IMPORTED_MODULE_1__["Object3D"]();
            for (var i = 0; i < this.getchildren().length; i++) {
                obj.children.push(this.getchildren()[i]);
            }
            var boxHelper = new three__WEBPACK_IMPORTED_MODULE_1__["BoxHelper"](obj);
            boxHelper["geometry"].computeBoundingBox();
            boxHelper["geometry"].computeBoundingSphere();
            var boundingSphere = boxHelper["geometry"].boundingSphere;
            var center = boundingSphere.center;
            var radius = boundingSphere.radius;
            var fov = this.camera.fov * (Math.PI / 180);
            var vec_centre_to_pos = new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"]();
            vec_centre_to_pos.subVectors(this.camera.position, center);
            var tmp_vec = new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](Math.abs(radius / Math.sin(fov / 2) / 2), Math.abs(radius / Math.sin(fov / 2) / 2), Math.abs(radius / Math.sin(fov / 2) / 2));
            vec_centre_to_pos.setLength(tmp_vec.length());
            var perspectiveNewPos = new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"]();
            perspectiveNewPos.addVectors(center, vec_centre_to_pos);
            var newLookAt = new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](center.x, center.y, center.z);
            this.camera.position.copy(perspectiveNewPos);
            this.camera.lookAt(newLookAt);
            this.camera.updateProjectionMatrix();
            this.controls.target.set(newLookAt.x, newLookAt.y, newLookAt.z);
            this.controls.update();
        }
        else {
            var box = this.selectbox();
            var center = new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](box["geometry"].boundingSphere.center.x, box["geometry"].boundingSphere.center.y, box["geometry"].boundingSphere.center.z);
            var radius = box["geometry"].boundingSphere.radius;
            if (radius === 0)
                radius = 1;
            var fov = this.camera.fov * (Math.PI / 180);
            var vec_centre_to_pos = new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"]();
            vec_centre_to_pos.subVectors(this.camera.position, center);
            var tmp_vec = new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](Math.abs(radius / Math.sin(fov / 2)), Math.abs(radius / Math.sin(fov / 2)), Math.abs(radius / Math.sin(fov / 2)));
            vec_centre_to_pos.setLength(tmp_vec.length());
            var perspectiveNewPos = new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"]();
            perspectiveNewPos.addVectors(center, vec_centre_to_pos);
            var newLookAt = new three__WEBPACK_IMPORTED_MODULE_1__["Vector3"](center.x, center.y, center.z);
            this.camera.position.copy(perspectiveNewPos);
            this.camera.lookAt(newLookAt);
            this.camera.updateProjectionMatrix();
            this.controls.target.set(newLookAt.x, newLookAt.y, newLookAt.z);
            this.controls.update();
        }
    };
    ViewerComponent.prototype.selectbox = function () {
        if (this.dataService.selecting.length !== 0) {
            var select = new three__WEBPACK_IMPORTED_MODULE_1__["Object3D"]();
            for (var i = 0; i < this.scene.children.length; i++) {
                if (this.scene.children[i].name === "selects") {
                    select.children.push(this.scene.children[i]);
                }
            }
            var box = new three__WEBPACK_IMPORTED_MODULE_1__["BoxHelper"](select);
            box["geometry"].computeBoundingBox();
            box["geometry"].computeBoundingSphere();
            return box;
        }
    };
    ViewerComponent.prototype.setting = function (settingVisible) {
        event.stopPropagation();
        this.settingVisible = !this.settingVisible;
    };
    ViewerComponent.prototype.leaflet = function () {
        event.stopPropagation();
        this.imVisible = !this.imVisible;
        this.dataService.imVisible = this.imVisible;
        //console.log(this.dataService.imVisible);
        /*for(var i=0;i<this.scene.children.length;i++){
          if(this.scene.children[i].type!=="DirectionalLight"&&this.scene.children[i].type!=="HemisphereLight"){
            this.scene.remove(this.scene.children[i]);
          }
        }*/
        /*var mymap = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'your.mapbox.access.token'
        }).addTo(mymap);*/
        /*let map = L.map("map").setView([38, -77], 13);
        console.log(map);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);*/
    };
    ViewerComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-viewer',
            template: __webpack_require__(/*! ./viewer.component.html */ "./src/app/mViewer/viewers/gs-viewer/viewer/viewer.component.html"),
            styles: [__webpack_require__(/*! ./viewer.component.css */ "./src/app/mViewer/viewers/gs-viewer/viewer/viewer.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]])
    ], ViewerComponent);
    return ViewerComponent;
}(_data_DataSubscriber__WEBPACK_IMPORTED_MODULE_2__["DataSubscriber"]));



/***/ }),

/***/ "./src/app/mViewer/viewers/index.ts":
/*!******************************************!*\
  !*** ./src/app/mViewer/viewers/index.ts ***!
  \******************************************/
/*! exports provided: ConsoleViewerComponent, TextViewerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _viewer_text_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./viewer-text.component */ "./src/app/mViewer/viewers/viewer-text.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TextViewerComponent", function() { return _viewer_text_component__WEBPACK_IMPORTED_MODULE_0__["TextViewerComponent"]; });

/* harmony import */ var _console_viewer_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./console-viewer.component */ "./src/app/mViewer/viewers/console-viewer.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ConsoleViewerComponent", function() { return _console_viewer_component__WEBPACK_IMPORTED_MODULE_1__["ConsoleViewerComponent"]; });



//export * from './template.component';


/***/ }),

/***/ "./src/app/mViewer/viewers/mobius-cesium/data/DataSubscriber.ts":
/*!**********************************************************************!*\
  !*** ./src/app/mViewer/viewers/mobius-cesium/data/DataSubscriber.ts ***!
  \**********************************************************************/
/*! exports provided: DataSubscriber */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataSubscriber", function() { return DataSubscriber; });
/* harmony import */ var _data_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data.service */ "./src/app/mViewer/viewers/mobius-cesium/data/data.service.ts");

var DataSubscriber = /** @class */ (function () {
    function DataSubscriber(injector) {
        var _this = this;
        this.dataService = injector.get(_data_service__WEBPACK_IMPORTED_MODULE_0__["DataService"]);
        this._subscription = this.dataService.getMessage().subscribe(function (message) {
            _this._message = message;
            _this.notify(message.text);
        });
    }
    DataSubscriber.prototype.notify = function (message) {
        console.warn("Notify function not Implemented");
    };
    return DataSubscriber;
}());



/***/ }),

/***/ "./src/app/mViewer/viewers/mobius-cesium/data/data.service.ts":
/*!********************************************************************!*\
  !*** ./src/app/mViewer/viewers/mobius-cesium/data/data.service.ts ***!
  \********************************************************************/
/*! exports provided: DataService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataService", function() { return DataService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs_Subject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/Subject */ "./node_modules/rxjs-compat/_esm5/Subject.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var DataService = /** @class */ (function () {
    function DataService() {
        this.subject = new rxjs_Subject__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
    }
    DataService.prototype.sendMessage = function (message) {
        this.subject.next({ text: message });
    };
    DataService.prototype.clearMessage = function () {
        this.subject.next();
    };
    DataService.prototype.getMessage = function () {
        return this.subject.asObservable();
    };
    //get geojson
    DataService.prototype.getGsModel = function () {
        return this._jsonModel;
    };
    //set mode 
    DataService.prototype.setMode = function (mode) {
        this.mode = mode;
    };
    //set new json file
    DataService.prototype.setGsModel = function (model) {
        delete this._jsonModel;
        var json = this._jsonModel;
        this._jsonModel = model;
        if (this._jsonModel !== undefined) {
            this.clearAll();
        }
        this.sendMessage("model_update");
    };
    //before loading geojson, clear all for last geojson
    DataService.prototype.clearAll = function () {
        delete this.hideElementArr;
        delete this._HideNum;
        delete this._ViData;
        delete this._PuData;
        delete this._index;
        delete this._Filter;
    };
    //get viewer
    DataService.prototype.getViewer = function () {
        return this.viewer;
    };
    //set viewer
    DataService.prototype.setViewer = function (_viewer) {
        this.viewer = _viewer;
    };
    //get selected entity
    DataService.prototype.get_SelectedEntity = function () {
        return this._SelectedEntity;
    };
    //set selected entity
    DataService.prototype.set_SelectedEntity = function (_SelectedEntity) {
        this._SelectedEntity = _SelectedEntity;
    };
    //get promise
    DataService.prototype.getcesiumpromise = function () {
        return this.cesiumpromise;
    };
    //set promise
    DataService.prototype.setcesiumpromise = function (cesiumpromise) {
        delete this.cesiumpromise;
        this.cesiumpromise = cesiumpromise;
    };
    // get filter array
    DataService.prototype.gethideElementArr = function () {
        return this.hideElementArr;
    };
    //get filter number
    DataService.prototype.get_HideNum = function () {
        return this._HideNum;
    };
    //get mode
    DataService.prototype.getmode = function () {
        return this.mode;
    };
    //get index after changing select, data, display, publish
    DataService.prototype.get_index = function () {
        return this._index;
    };
    //set index after changing select, data, display, publish
    DataService.prototype.set_index = function (_index) {
        this._index = _index;
    };
    //set sun true/false in Display
    DataService.prototype.set_Sun = function (_Sun) {
        this._Sun = _Sun;
    };
    //get sun true/false in Display
    DataService.prototype.get_Sun = function () {
        return this._Sun;
    };
    //set shadow true/false in Display
    DataService.prototype.set_Shadow = function (_Shadow) {
        this._Shadow = _Shadow;
    };
    //get shadow true/false in Display
    DataService.prototype.get_Shadow = function () {
        return this._Shadow;
    };
    //set date in Display
    DataService.prototype.set_Date = function (_Date) {
        this._Date = _Date;
    };
    //get date in Display
    DataService.prototype.get_Date = function () {
        return this._Date;
    };
    //set UTC in Display
    DataService.prototype.set_UTC = function (_UTC) {
        this._UTC = _UTC;
    };
    //get UTC in Display
    DataService.prototype.get_UTC = function () {
        return this._UTC;
    };
    //set imagery in Display
    DataService.prototype.set_Imagery = function (_Imagery) {
        this._Imagery = _Imagery;
    };
    //get imagery in Display
    DataService.prototype.get_Imagery = function () {
        return this._Imagery;
    };
    //convert json to ViData(editor version) to store every thing in setting
    DataService.prototype.getValue = function (model) {
        if (model !== undefined) {
            var propertyName = Object.keys(model["features"][0].properties);
            var feature_instance_1 = model["features"][0];
            var _HeightKeys = propertyName.filter(function (prop_name) {
                var value = feature_instance_1.properties[prop_name];
                return (typeof (value) === "number");
            });
            if (model["features"].length > 1) {
                for (var i = 1; i < model["features"].length; i++) {
                    for (var _i = 0, _a = Object.keys(model["features"][i].properties); _i < _a.length; _i++) {
                        var properties = _a[_i];
                        if (propertyName.indexOf(String(properties)) < 0) {
                            propertyName.push(properties);
                            if (typeof (model["features"][i].properties[properties]) === "number") {
                                _HeightKeys.push(properties);
                            }
                        }
                    }
                }
            }
            propertyName.sort();
            propertyName.unshift("None");
            var propertyNames = propertyName.filter(function (value) {
                return value != 'TYPE' && value != 'COLOR' && value != 'HEIGHT' && value != 'EXTRUDEDHEIGHT';
            });
            var _ColorValue_1 = propertyNames[0];
            var _HeightKey = _HeightKeys.filter(function (value) {
                return value != 'TYPE' && value != 'COLOR' && value != 'HEIGHT' && value != 'EXTRUDEDHEIGHT';
            });
            _HeightKey.sort();
            _HeightKey.unshift("None");
            var _HeightValue_1 = _HeightKey[0];
            var promise = this.cesiumpromise;
            var _Heighttexts_1 = [];
            var _Colortexts_1 = [];
            var _indexArr_1 = [];
            var self_1 = this;
            promise.then(function (dataSource) {
                var entities = dataSource.entities.values;
                for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
                    var entity = entities_1[_i];
                    if (entity.properties["TYPE"] === undefined || entity.properties["TYPE"]._value !== "STATIC") {
                        if (entity.properties[_HeightValue_1] !== undefined) {
                            if (entity.properties[_HeightValue_1]._value !== " ") {
                                if (_Heighttexts_1.length === 0) {
                                    _Heighttexts_1[0] = entity.properties[_HeightValue_1]._value;
                                }
                                else {
                                    if (_Heighttexts_1.indexOf(entity.properties[_HeightValue_1]._value) === -1) {
                                        _Heighttexts_1.push(entity.properties[_HeightValue_1]._value);
                                    }
                                }
                            }
                        }
                        if (entity.properties[_ColorValue_1] !== undefined) {
                            if (entity.properties[_ColorValue_1]._value !== " ") {
                                if (_Colortexts_1.length === 0) {
                                    _Colortexts_1[0] = entity.properties[_ColorValue_1]._value;
                                }
                                else {
                                    if (_Colortexts_1.indexOf(entity.properties[_ColorValue_1]._value) === -1) {
                                        _Colortexts_1.push(entity.properties[_ColorValue_1]._value);
                                    }
                                }
                            }
                        }
                        _indexArr_1.push(entities.indexOf(entity));
                    }
                    else {
                        entity.polygon.height = entity.properties["HEIGHT"];
                        entity.polygon.extrudedHeight = entity.properties["EXTRUDEDHEIGHT"];
                        var ColorValue = entity.properties["COLOR"]._value;
                        entity.polygon.material = Cesium.Color.fromBytes(ColorValue[0], ColorValue[1], ColorValue[2], ColorValue[3]);
                    }
                    if (entity.polygon !== undefined) {
                        entity.polygon.outlineColor = Cesium.Color.Black;
                    }
                    if (entity.billboard !== undefined) {
                        entity.billboard = undefined;
                        entity.point = new Cesium.PointGraphics({
                            color: Cesium.Color.BLUE,
                            pixelSize: 10,
                        });
                    }
                }
            });
            var _MinColor = Math.min.apply(Math, _Colortexts_1);
            var _MaxColor = Math.max.apply(Math, _Colortexts_1);
            var _MinHeight = Math.min.apply(Math, _Heighttexts_1);
            var _MaxHeight = Math.max.apply(Math, _Heighttexts_1);
            var _Filter = [];
            var _HideNum = [];
            this.getViData(propertyNames, _Colortexts_1.sort(), _ColorValue_1, _MinColor, _MaxColor, false, _HeightKey, _Heighttexts_1.sort(), _HeightValue_1, _MinHeight, _MaxHeight, 1, false, false, _Filter, _HideNum, _indexArr_1);
        }
    };
    //get ViData(editor version)
    DataService.prototype.get_ViData = function () {
        return this._ViData;
    };
    //convert geojson to PuData(publish version)
    DataService.prototype.LoadJSONData = function () {
        if (this._jsonModel !== undefined && this._jsonModel["cesium"] !== undefined) {
            var cesiumData = this._jsonModel["cesium"];
            var _ColorDescr = void 0;
            var _ColorValue_2;
            var _MinColor = void 0;
            var _MaxColor = void 0;
            var _ColorInvert = void 0;
            var _HeightDescr = void 0;
            var _HeightKey = [];
            var _HeightValue_2;
            var _MinHeight = void 0;
            var _MaxHeight = void 0;
            var _HeightInvert = void 0;
            var _HeightScale = void 0;
            var _HeightLine = void 0;
            var _filters = void 0;
            var _ceisumData = [];
            var _propertyNames = [];
            var _HideNum = [];
            var _indexArr_2 = [];
            if (cesiumData["colour"] !== undefined) {
                if (cesiumData["colour"]["descr"] !== undefined) {
                    _ColorDescr = cesiumData["colour"]["descr"];
                }
                if (cesiumData["colour"]["attribs"] !== undefined) {
                    for (var _i = 0, _a = cesiumData["colour"]["attribs"]; _i < _a.length; _i++) {
                        var data = _a[_i];
                        _propertyNames.push(data["name"]);
                    }
                    _ColorValue_2 = _propertyNames[0];
                    _MinColor = cesiumData["colour"]["attribs"][0]["min"];
                    _MaxColor = cesiumData["colour"]["attribs"][0]["max"];
                    if (cesiumData["colour"]["attribs"][0]["invert"] === true) {
                        _ColorInvert = true;
                    }
                    else {
                        _ColorInvert = false;
                    }
                }
            }
            if (cesiumData["extrude"] !== undefined) {
                if (cesiumData["extrude"]["descr"] !== undefined) {
                    _HeightDescr = cesiumData["extrude"]["descr"];
                }
                if (cesiumData["extrude"]["attribs"] !== undefined) {
                    for (var _b = 0, _c = cesiumData["extrude"]["attribs"]; _b < _c.length; _b++) {
                        var data = _c[_b];
                        _HeightKey.push(data["name"]);
                    }
                    _HeightValue_2 = _HeightKey[0];
                    _MinHeight = cesiumData["extrude"]["attribs"][0]["min"];
                    _MaxHeight = cesiumData["extrude"]["attribs"][0]["max"];
                    if (cesiumData["extrude"]["attribs"][0]["invert"] === true) {
                        _HeightInvert = true;
                    }
                    else {
                        _HeightInvert = false;
                    }
                    if (cesiumData["extrude"]["attribs"][0]["line"] === true) {
                        _HeightLine = true;
                    }
                    else {
                        _HeightLine = false;
                    }
                    if (cesiumData["extrude"]["attribs"][0]["scale"] !== undefined) {
                        _HeightScale = cesiumData["extrude"]["attribs"][0]["scale"];
                    }
                    else {
                        _HeightScale = 1;
                    }
                }
            }
            var promise = this.cesiumpromise;
            var _Heighttexts_2 = [];
            var _Colortexts_2 = [];
            var self_2 = this;
            promise.then(function (dataSource) {
                var entities = dataSource.entities.values;
                for (var _i = 0, entities_2 = entities; _i < entities_2.length; _i++) {
                    var entity = entities_2[_i];
                    if (entity.properties[_HeightValue_2] !== undefined) {
                        if (entity.properties[_HeightValue_2]._value !== " ") {
                            if (_Heighttexts_2.length === 0) {
                                _Heighttexts_2[0] = entity.properties[_HeightValue_2]._value;
                            }
                            else {
                                if (_Heighttexts_2.indexOf(entity.properties[_HeightValue_2]._value) === -1) {
                                    _Heighttexts_2.push(entity.properties[_HeightValue_2]._value);
                                }
                            }
                        }
                    }
                    if (entity.properties[_ColorValue_2] !== undefined) {
                        if (entity.properties[_ColorValue_2]._value !== " ") {
                            if (_Colortexts_2.length === 0) {
                                _Colortexts_2[0] = entity.properties[_ColorValue_2]._value;
                            }
                            else {
                                if (_Colortexts_2.indexOf(entity.properties[_ColorValue_2]._value) === -1) {
                                    _Colortexts_2.push(entity.properties[_ColorValue_2]._value);
                                }
                            }
                        }
                    }
                    if (entity.polygon !== undefined) {
                        entity.polygon.outlineColor = Cesium.Color.Black;
                    }
                    if (entity.billboard !== undefined) {
                        entity.billboard = undefined;
                        entity.point = new Cesium.PointGraphics({
                            color: Cesium.Color.BLUE,
                            pixelSize: 10,
                        });
                    }
                    _indexArr_2.push(entities.indexOf(entity));
                }
            });
            if (cesiumData["filters"] !== undefined) {
                _filters = cesiumData["filters"];
                var lastnumber = void 0;
                this._Filter = [];
                this._HideNum = [];
                if (_filters !== undefined && _filters.length !== 0) {
                    for (var _d = 0, _filters_1 = _filters; _d < _filters_1.length; _d++) {
                        var _filter = _filters_1[_d];
                        if (this._HideNum.length === 0) {
                            this._HideNum[0] = "0";
                            lastnumber = this._HideNum[0];
                        }
                        else {
                            for (var j = 0; j < this._HideNum.length + 1; j++) {
                                if (this._HideNum.indexOf(String(j)) === -1) {
                                    this._HideNum.push(String(j));
                                    lastnumber = String(j);
                                    break;
                                }
                            }
                        }
                        if (_filter["name"] !== undefined) {
                            var _propertyname = _filter["name"];
                            var _relation = Number(_filter["relation"]);
                            var _text = _filter["value"];
                            var _descr = _filter["descr"];
                            var _HideType = void 0;
                            var _texts = void 0;
                            if (typeof (_text) === "number") {
                                _HideType = "number";
                                _texts = this.Initial(_propertyname);
                            }
                            else if (typeof (_text) === "string") {
                                _HideType = "category";
                                _texts = this.Initial(_propertyname);
                                _texts = ["None"].concat(_texts);
                            }
                            this._Filter.push({ divid: String("addHide".concat(String(lastnumber))), id: lastnumber,
                                HeightHide: _propertyname, type: _HideType, Category: _texts,
                                CategaryHide: _text, descr: _descr, RelaHide: _relation,
                                textHide: _text, HideMax: Math.ceil(Math.max.apply(Math, _texts)),
                                HideMin: Math.floor(Math.min.apply(Math, _texts) * 100) / 100, Disabletext: null });
                        }
                    }
                }
            }
            else {
                this._Filter = [];
                this._HideNum = [];
            }
            this.getPuData(_ColorDescr, _propertyNames, _Colortexts_2.sort(), _ColorValue_2, _MinColor, _MaxColor, _ColorInvert, _HeightDescr, _HeightKey, _Heighttexts_2.sort(), _HeightValue_2, _MinHeight, _MaxHeight, _HeightScale, _HeightInvert, _HeightLine, this._Filter, this._HideNum, _indexArr_2);
        }
    };
    //get text for the certain property
    DataService.prototype.Initial = function (_HideValue) {
        var texts = [];
        var promise = this.getcesiumpromise();
        var self = this;
        promise.then(function (dataSource) {
            var entities = dataSource.entities.values;
            for (var _i = 0, entities_3 = entities; _i < entities_3.length; _i++) {
                var entity = entities_3[_i];
                if (entity.properties[_HideValue] !== undefined) {
                    if (entity.properties[_HideValue]._value !== " ") {
                        if (texts.length === 0) {
                            texts[0] = entity.properties[_HideValue]._value;
                        }
                        else {
                            if (texts.indexOf(entity.properties[_HideValue]._value) === -1) {
                                texts.push(entity.properties[_HideValue]._value);
                            }
                        }
                    }
                }
            }
        });
        return texts;
    };
    //get PuData
    DataService.prototype.get_PuData = function () {
        return this._PuData;
    };
    //// ------------------- Settings
    /*
     * to set visualize settings
     *
     */
    /*
     *  _PuData : Object with properties .... <todo>
     */
    DataService.prototype.set_PuData = function (_PuData) {
        this._PuData = _PuData;
    };
    /*
     *  _ViData : Object with properties .... <todo>
     */
    DataService.prototype.set_ViData = function (_ViData) {
        this._ViData = _ViData;
    };
    /*
    _ColorProperty: collect all property names,
    _ColorText: collect all values under _ColorKey,
    _ColorKey: Select color property name in Data tab,
    _ColorMin: minimum value of Color property in Data tab,
    _ColorMax: maximum value of Color property in Data tab,
    _ColorInvert: color invert is true or false,
    _ExtrudeProperty: collect all property names that whose values are number,
    _ExtrudeText: collect all values under _ExturdeValue,
    _ExturdeValue: Select Extrude property name in Data tab,
    _ExtrudeMin: minimum value of Extrude property in Data tab,
    _ExtrudeMax: maximum value of Extrude property in Data tab,
    _Scale: extrude height scale,
    _Invert: extrude height invert is true or false,
    _HeightChart: it will show height chart or not,
    _Filter: collect filters,
    _HideNum: collect filter id numbers,
    _indexArr: collect entity number whose "TYPE" is not static
    */
    DataService.prototype.getViData = function (_ColorProperty, _ColorText, _ColorKey, _ColorMin, _ColorMax, _ColorInvert, _ExtrudeProperty, _ExtrudeText, _ExturdeValue, _ExtrudeMin, _ExtrudeMax, _Scale, _Invert, _HeightChart, _Filter, _HideNum, _indexArr) {
        this._ViData = { ColorProperty: _ColorProperty, ColorText: _ColorText, ColorKey: _ColorKey,
            ColorMin: _ColorMin, ColorMax: _ColorMax, ColorInvert: _ColorInvert,
            ExtrudeProperty: _ExtrudeProperty, ExtrudeText: _ExtrudeText, ExtrudeKey: _ExturdeValue,
            ExtrudeMin: _ExtrudeMin, ExtrudeMax: _ExtrudeMax, Scale: _Scale, Invert: _Invert,
            HeightChart: _HeightChart, Filter: _Filter, HideNum: _HideNum, indexArr: _indexArr };
    };
    /*
    _ColorDescr: description of Color property,
    _ColorProperty: collect all property names,
    _ColorText: collect all values under _ColorKey,
    _ColorKey: Select color property name in Data tab,
    _ColorMin: minimum value of Color property in Data tab,
    _ColorMax: maximum value of Color property in Data tab,
    _ColorInvert: color invert is true or false,
    _ExtrudeDescr: description of extrude height property,
    _ExtrudeProperty: collect all property names that whose values are number,
    _ExtrudeText: collect all values under _ExturdeValue,
    _ExturdeValue: Select Extrude property name in Data tab,
    _ExtrudeMin: minimum value of Extrude property in Data tab,
    _ExtrudeMax: maximum value of Extrude property in Data tab,
    _Scale: extrude height scale,
    _Invert: extrude height invert is true or false,
    _HeightChart: it will show height chart or not,
    _Filter: collect filters,
    _HideNum: collect filter id numbers,
    _indexArr: collect entity number whose "TYPE" is not static
     */
    DataService.prototype.getPuData = function (_ColorDescr, _ColorProperty, _ColorText, _ColorKey, _ColorMin, _ColorMax, _ColorInvert, _ExtrudeDescr, _ExtrudeProperty, _ExtrudeText, _ExturdeValue, _ExtrudeMin, _ExtrudeMax, _Scale, _Invert, _HeightChart, _Filter, _HideNum, _indexArr) {
        this._PuData = { ColorDescr: _ColorDescr, ColorProperty: _ColorProperty, ColorText: _ColorText,
            ColorKey: _ColorKey, ColorMin: _ColorMin, ColorMax: _ColorMax, ColorInvert: _ColorInvert,
            ExtrudeDescr: _ExtrudeDescr, ExtrudeProperty: _ExtrudeProperty, ExtrudeText: _ExtrudeText,
            ExtrudeKey: _ExturdeValue, ExtrudeMin: _ExtrudeMin, ExtrudeMax: _ExtrudeMax,
            Scale: _Scale, Invert: _Invert, HeightChart: _HeightChart, Filter: _Filter, HideNum: _HideNum, indexArr: _indexArr };
    };
    DataService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])()
    ], DataService);
    return DataService;
}());



/***/ }),

/***/ "./src/app/mViewer/viewers/mobius-cesium/mobius-cesium.component.html":
/*!****************************************************************************!*\
  !*** ./src/app/mViewer/viewers/mobius-cesium/mobius-cesium.component.html ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"mobiuscesium\" style=\"height: 100%\">\r\n\t<cesium-viewer></cesium-viewer>\r\n\t<div id=\"Toggle\" (click)=\"toggleSlider()\" ><span style=\"vertical-align: middle;\">▹</span></div>\r\n\t<div id=\"slide-nav\"  [@slide_in_out]=\"slider_state\" style=\"position: absolute;z-index: 101;top:0px;height: 100%\">\r\n  \t\t<app-setting-cesium ></app-setting-cesium>\r\n\t</div>\r\n\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/mViewer/viewers/mobius-cesium/mobius-cesium.component.scss":
/*!****************************************************************************!*\
  !*** ./src/app/mViewer/viewers/mobius-cesium/mobius-cesium.component.scss ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@import url(\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css\");\n@font-face {\n  font-family: \"FontAwesome\"; }\n.font-awesome-hand {\n  font-family: FontAwesome; }\n.font-awesome-hand::after {\n  font-family: FontAwesome; }\n#mobiuscesium {\n  height: 101%;\n  font-family: sans-serif !important;\n  margin: 0px !important;\n  padding: 0px !important;\n  font-size: 14px; }\n#button {\n  position: absolute;\n  z-index: 99; }\n#Toggle {\n  position: absolute;\n  top: calc(50% - 30px);\n  z-index: 200;\n  width: 30px;\n  height: 70px;\n  border-top: 1px solid gray;\n  border-right: 1px solid gray;\n  border-bottom: 1px solid gray;\n  background-color: rgba(20, 20, 20, 0.5);\n  color: #ddd;\n  text-align: center;\n  font-size: 32px;\n  line-height: 70px;\n  cursor: pointer; }\n"

/***/ }),

/***/ "./src/app/mViewer/viewers/mobius-cesium/mobius-cesium.component.ts":
/*!**************************************************************************!*\
  !*** ./src/app/mViewer/viewers/mobius-cesium/mobius-cesium.component.ts ***!
  \**************************************************************************/
/*! exports provided: MobiuscesiumComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MobiuscesiumComponent", function() { return MobiuscesiumComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _data_data_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./data/data.service */ "./src/app/mViewer/viewers/mobius-cesium/data/data.service.ts");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/animations */ "./node_modules/@angular/animations/fesm5/animations.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var defaultText = "{\n  \"type\": \"FeatureCollection\",\n  \"name\": \"default\",\n  \"crs\": { \"type\": \"name\", \"properties\": { \"name\": \"0\" } },\n  \"features\": [\n  { \"type\": \"Feature\", \"properties\": { \"OBJECTID\": 1, \"OID_1\": 0, \"INC_CRC\": \"593E775CE158CC1F\", \"FMEL_UPD_D\": \"2014/06/23\", \"X_ADDR\": 26044.8109, \"Y_ADDR\": 48171.43, \"SHAPE_Leng\": 298.85929234299999, \"SHAPE_Area\": 1070.8993405900001 }, \"geometry\": { \"type\": \"MultiPolygon\", \"coordinates\": [] } }\n  ]\n  }";
var MobiuscesiumComponent = /** @class */ (function () {
    function MobiuscesiumComponent(dataService) {
        this.dataService = dataService;
        //create slider to switch setting
        this.slider_state = "slide_out";
    }
    ;
    //pass data to dataService
    MobiuscesiumComponent.prototype.setModel = function (data) {
        try {
            this.dataService.setGsModel(data);
        }
        catch (ex) {
            this.text = '';
            this.data = undefined;
        }
    };
    //pass data to dataService
    MobiuscesiumComponent.prototype.ngOnInit = function () {
        this.text = this.node.output.value;
        this.data = JSON.parse(this.text || defaultText);
        this.setModel(this.data);
        this.dataService.setMode(this.mode);
        // console.log(this.data);
    };
    MobiuscesiumComponent.prototype.ngDoCheck = function () {
        if (this.text !== this.node.output.value) {
            this.text = this.node.output.value;
            this.data = JSON.parse(this.text || defaultText);
            this.setModel(this.data);
            // console.log("data changed");
            // console.log("mode:", this.mode);
        }
    };
    MobiuscesiumComponent.prototype.toggleSlider = function () {
        // do something to change the animation_state variable
        this.slider_state = this.slider_state === "slide_out" ? "slide_in" : "slide_out";
        var toggle = document.getElementById("Toggle");
        if (this.slider_state === "slide_out") {
            toggle.style.left = "0px";
            toggle.innerHTML = "▹";
        }
        else if (this.slider_state === "slide_in") {
            toggle.style.left = "280px";
            toggle.innerHTML = "◃";
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], MobiuscesiumComponent.prototype, "node", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], MobiuscesiumComponent.prototype, "mode", void 0);
    MobiuscesiumComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: "mobius-cesium",
            template: __webpack_require__(/*! ./mobius-cesium.component.html */ "./src/app/mViewer/viewers/mobius-cesium/mobius-cesium.component.html"),
            styles: [__webpack_require__(/*! ./mobius-cesium.component.scss */ "./src/app/mViewer/viewers/mobius-cesium/mobius-cesium.component.scss")],
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["trigger"])("slide_in_out", [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["state"])("slide_in", Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["style"])({
                        width: "280px",
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["state"])("slide_out", Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["style"])({
                        width: "0px"
                        // css styles when the element is in slide_out
                    })),
                    // animation effect when transitioning from one state to another
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["transition"])("slide_in <=> slide_out", Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["animate"])(300))
                ]),
            ],
        }),
        __metadata("design:paramtypes", [_data_data_service__WEBPACK_IMPORTED_MODULE_1__["DataService"]])
    ], MobiuscesiumComponent);
    return MobiuscesiumComponent;
}());



/***/ }),

/***/ "./src/app/mViewer/viewers/mobius-cesium/mobius-cesium.module.ts":
/*!***********************************************************************!*\
  !*** ./src/app/mViewer/viewers/mobius-cesium/mobius-cesium.module.ts ***!
  \***********************************************************************/
/*! exports provided: MobiusCesium */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MobiusCesium", function() { return MobiusCesium; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _mobius_cesium_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mobius-cesium.component */ "./src/app/mViewer/viewers/mobius-cesium/mobius-cesium.component.ts");
/* harmony import */ var _viewer_viewer_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./viewer/viewer.component */ "./src/app/mViewer/viewers/mobius-cesium/viewer/viewer.component.ts");
/* harmony import */ var _data_data_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./data/data.service */ "./src/app/mViewer/viewers/mobius-cesium/data/data.service.ts");
/* harmony import */ var angular_split__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! angular-split */ "./node_modules/angular-split/fesm5/angular-split.js");
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/tabs */ "./node_modules/@angular/material/esm5/tabs.es5.js");
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/tooltip */ "./node_modules/@angular/material/esm5/tooltip.es5.js");
/* harmony import */ var _angular_material_slider__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/slider */ "./node_modules/@angular/material/esm5/slider.es5.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _setting_setting_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./setting/setting.component */ "./src/app/mViewer/viewers/mobius-cesium/setting/setting.component.ts");
/* harmony import */ var _setting_visualise_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./setting/visualise.component */ "./src/app/mViewer/viewers/mobius-cesium/setting/visualise.component.ts");
/* harmony import */ var _setting_attributes_copmponent__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./setting/attributes.copmponent */ "./src/app/mViewer/viewers/mobius-cesium/setting/attributes.copmponent.ts");
/* harmony import */ var _setting_publish_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./setting/publish.component */ "./src/app/mViewer/viewers/mobius-cesium/setting/publish.component.ts");
/* harmony import */ var _setting_display_copmponent__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./setting/display.copmponent */ "./src/app/mViewer/viewers/mobius-cesium/setting/display.copmponent.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};















var MobiusCesium = /** @class */ (function () {
    function MobiusCesium() {
    }
    MobiusCesium_1 = MobiusCesium;
    MobiusCesium.forRoot = function () {
        return {
            ngModule: MobiusCesium_1,
            providers: [
                _data_data_service__WEBPACK_IMPORTED_MODULE_4__["DataService"],
            ],
        };
    };
    var MobiusCesium_1;
    MobiusCesium = MobiusCesium_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                angular_split__WEBPACK_IMPORTED_MODULE_5__["AngularSplitModule"],
                _angular_material_tabs__WEBPACK_IMPORTED_MODULE_6__["MatTabsModule"],
                _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_7__["MatTooltipModule"],
                _angular_material_slider__WEBPACK_IMPORTED_MODULE_8__["MatSliderModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_9__["FormsModule"]
            ],
            exports: [_mobius_cesium_component__WEBPACK_IMPORTED_MODULE_2__["MobiuscesiumComponent"]],
            declarations: [_mobius_cesium_component__WEBPACK_IMPORTED_MODULE_2__["MobiuscesiumComponent"],
                _viewer_viewer_component__WEBPACK_IMPORTED_MODULE_3__["ViewerComponent"],
                _setting_setting_component__WEBPACK_IMPORTED_MODULE_10__["SettingComponent"],
                _setting_visualise_component__WEBPACK_IMPORTED_MODULE_11__["DataComponent"],
                _setting_attributes_copmponent__WEBPACK_IMPORTED_MODULE_12__["SelectComponent"],
                _setting_publish_component__WEBPACK_IMPORTED_MODULE_13__["PublishComponent"],
                _setting_display_copmponent__WEBPACK_IMPORTED_MODULE_14__["DisplayComponent"]],
            providers: [_data_data_service__WEBPACK_IMPORTED_MODULE_4__["DataService"]],
        })
    ], MobiusCesium);
    return MobiusCesium;
}());



/***/ }),

/***/ "./src/app/mViewer/viewers/mobius-cesium/setting/attributes.component.css":
/*!********************************************************************************!*\
  !*** ./src/app/mViewer/viewers/mobius-cesium/setting/attributes.component.css ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/deep/.mat-tab-label, /deep/.mat-tab-label-active{\r\n  min-width: 60px!important;\r\n  padding: 3px!important;\r\n  margin: 3px!important;\r\n  color:#D3D3D3 !important;\r\n  background-color: transparent !important;\r\n}\r\n/deep/.mat-tab-label{\r\n  height: 30px !important;\r\n  width: 60px !important;\r\n  background-color: transparent !important;\r\n}\r\n/deep/.mat-tab-labels{\r\n  background-color: rgba(20,20,20,0.9) !important;\r\n}\r\n/deep/.mat-tab-header{\r\n  width: 700px !important;\r\n}\r\n/deep/.mat-tab-header-pagination-controls-enabled{\r\n  display: none !important;\r\n}\r\n/deep/.mat-ink-bar{\r\n  background-color: #395d73 !important;\r\n}\r\n/deep/.mat-tab{\r\n  min-width: 30px !important;\r\n}\r\n/deep/.mat-tab-body-content{\r\n  overflow: hidden !important;\r\n}\r\n/deep/.mat-header{\r\n  flex-direction: row;\r\n  font-family: Roboto,\"Helvetica Neue\",sans-serif;\r\n  margin-left: 0px;\r\n  color:#395d73;\r\n  border: 0;\r\n  height: 20px;\r\n  background-color: rgba(20,20,20,0.9) !important;\r\n}\r\n/deep/.mat-tab-body-wrapper{\r\n  height:100% !important;\r\n\r\n}\r\n/deep/split-gutter{\r\n  background-color:rgb(138, 168, 192) !important;\r\n}\r\n/deep/.mat-accent .mat-slider-thumb {\r\n    background-color: #8AA8C0 !important;\r\n    cursor: -webkit-grab;\r\n}\r\n/deep/.mat-slider-thumb{\r\n  width: 5px !important;\r\n  right: -5px !important;\r\n}\r\n/deep/.mat-slider-track-fill{\r\n  background-color: #F0BFA0 !important;\r\n}\r\n/deep/.mat-slider-thumb-label-text {\r\n    color: #395d73 !important;\r\n    font-size: 12px !important;\r\n}\r\n/deep/.mat-slider-thumb-label{\r\n    height: 15px !important;\r\n    width: 15px !important;\r\n    top: -20px !important;\r\n    right: -7px !important;\r\n    background-color: white !important;\r\n    border: 1px solid #395d73 !important;\r\n}\r\n/deep/.mat-slider-track-background{\r\n  background-color: #D3D3D3 !important;\r\n}\r\n.mat-slider{\r\n    width: 150px !important;\r\n}\r\n.cesium-button {\r\n  display: inline-block;\r\n  position: relative;\r\n  border: 1px solid #8AA8C0;\r\n  color: #D3D3D3;\r\n  fill: #8AA8C0;\r\n  border-radius: 0px;\r\n  padding: 3px 0px;\r\n  margin: 0px 0px;\r\n  cursor: pointer;\r\n  overflow: hidden;\r\n  -moz-user-select: none;\r\n  -webkit-user-select: none;\r\n  -ms-user-select: none;\r\n  user-select: none;\r\n  width: 80px;\r\n  font-family:sans-serif !important;\r\n  background: transparent;\r\n}\r\n.cesium-button-select{\r\n  display: inline-block;\r\n  position: relative;\r\n  border: 1px solid #8AA8C0;\r\n  fill: #8AA8C0;\r\n  border-radius: 0px;\r\n  padding: 3px 0px;\r\n  margin: 0px 0px;\r\n  cursor: pointer;\r\n  overflow: hidden;\r\n  -moz-user-select: none;\r\n  -webkit-user-select: none;\r\n  -ms-user-select: none;\r\n  user-select: none;\r\n  width: 80px;\r\n  font-family:sans-serif !important;\r\n  color: #D3D3D3;\r\n  background: transparent;\r\n}\r\n.cesium-option{\r\n  background-color: #F1F1F1;\r\n  /*opacity: 0.8;*/\r\n  color: #8AA8C0;\r\n  border: 1px solid #8AA8C0;\r\n}\r\nhr {\r\n  display: block;\r\n  height: 1px;\r\n  border: 0;\r\n  border-top: 1px solid #D3D3D3 !important;\r\n  padding: 0; \r\n  color:#D3D3D3 !important;\r\n  width: 100%;\r\n  background-color: #D3D3D3 !important;\r\n}\r\n\r\n"

/***/ }),

/***/ "./src/app/mViewer/viewers/mobius-cesium/setting/attributes.component.html":
/*!*********************************************************************************!*\
  !*** ./src/app/mViewer/viewers/mobius-cesium/setting/attributes.component.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"AttribsView\"  style=\"background-color: rgba(20,20,20,0.9);height: 100%;overflow-y:overlay;\"  >\r\n\t<table border=\"1\" cellspacing=\"0\" cellpadding=\"0\" bordercolor=\"#d0d0d0\">\r\n\t  <tr >\r\n\t    <th style=\"font-size: 10px;font-weight: normal;width: 135px;\"><div style=\"width: 135px;height:16px;background: #395D73;color:white;white-space: nowrap;display:block;overflow: hidden !important;text-overflow: ellipsis !important;cursor:pointer;\">ID</div></th>\r\n\t    <th style=\"font-size: 10px;font-weight: normal;width: 135px\"><div matTooltip={{ID}} style=\"width: 135px;height:16px;background: #395D73;color:white;white-space: nowrap;display:block;overflow: hidden !important;text-overflow: ellipsis !important;cursor:pointer;\">{{ID}}</div></th>\r\n\t  </tr>\r\n\t</table>\r\n\t<table border=\"1\" cellspacing=\"0\" cellpadding=\"0\" bordercolor=\"#d0d0d0\">\r\n\t  <tr *ngFor=\"let Property of _Properties\">\r\n\t    <th style=\"font-size: 10px;font-weight: normal;color:#D3D3D3 ;width: 135px;height: 14px\"><div matTooltip={{Property.Name}} style=\"width: 135px;height:14px;text-align: left;white-space: nowrap;display:block;overflow: hidden !important;text-overflow: ellipsis !important;cursor:pointer;\">{{Property.Name}}</div></th>\r\n\t    <th style=\"font-size: 10px;font-weight: normal;color:#D3D3D3 ;width: 135px;height: 14px\"><div matTooltip={{Property.Value}} style=\"width: 135px;height:14px;text-align: left;white-space: nowrap;display:block;overflow: hidden !important;text-overflow: ellipsis !important;cursor:pointer;\">{{Property.Value}}</div></th>\r\n\t  </tr>\r\n\t</table>\r\n</div>\r\n  "

/***/ }),

/***/ "./src/app/mViewer/viewers/mobius-cesium/setting/attributes.copmponent.ts":
/*!********************************************************************************!*\
  !*** ./src/app/mViewer/viewers/mobius-cesium/setting/attributes.copmponent.ts ***!
  \********************************************************************************/
/*! exports provided: SelectComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SelectComponent", function() { return SelectComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _data_DataSubscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../data/DataSubscriber */ "./src/app/mViewer/viewers/mobius-cesium/data/DataSubscriber.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var SelectComponent = /** @class */ (function (_super) {
    __extends(SelectComponent, _super);
    function SelectComponent(injector, myElement) {
        return _super.call(this, injector) || this;
    }
    SelectComponent.prototype.ngOnInit = function () {
        this.data = this.dataService.getGsModel();
        this.mode = this.dataService.getmode();
        this.viewer = this.dataService.getViewer();
        this.dataArr = this.dataService.get_ViData();
    };
    SelectComponent.prototype.notify = function (message) {
        if (message === "model_update") {
            this.data = this.dataService.getGsModel();
            this.mode = this.dataService.getmode();
            this.dataArr = this.dataService.get_ViData();
        }
    };
    //check whether ID is changed or not and show in  Select tab
    SelectComponent.prototype.ngDoCheck = function () {
        if (this.viewer !== undefined && this.dataService.get_SelectedEntity() !== undefined && this.mode === "editor") {
            if (this.ID !== this.dataService.get_SelectedEntity()._id) {
                var _Property = void 0;
                this.ID = this.dataService.get_SelectedEntity()._id;
                this._Properties = [];
                for (var _i = 0, _a = this.dataArr["ColorProperty"]; _i < _a.length; _i++) {
                    var _ColorPro = _a[_i];
                    if (_ColorPro !== "None") {
                        _Property = [];
                        _Property.Name = _ColorPro;
                        if (this.dataService.get_SelectedEntity().properties[_Property.Name] !== undefined) {
                            _Property.Value = this.dataService.get_SelectedEntity().properties[_Property.Name]._value;
                        }
                        else {
                            _Property.Value = ' ';
                        }
                        this._Properties.push(_Property);
                    }
                }
            }
        }
    };
    SelectComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: "app-select",
            template: __webpack_require__(/*! ./attributes.component.html */ "./src/app/mViewer/viewers/mobius-cesium/setting/attributes.component.html"),
            styles: [__webpack_require__(/*! ./attributes.component.css */ "./src/app/mViewer/viewers/mobius-cesium/setting/attributes.component.css")],
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]])
    ], SelectComponent);
    return SelectComponent;
}(_data_DataSubscriber__WEBPACK_IMPORTED_MODULE_1__["DataSubscriber"]));



/***/ }),

/***/ "./src/app/mViewer/viewers/mobius-cesium/setting/display.copmponent.css":
/*!******************************************************************************!*\
  !*** ./src/app/mViewer/viewers/mobius-cesium/setting/display.copmponent.css ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*/deep/.mat-tab-label, /deep/.mat-tab-label-active{\r\n  min-width: 60px!important;\r\n  padding: 3px!important;\r\n  margin: 3px!important;\r\n  color:#D3D3D3 !important;\r\n  background-color: transparent !important;\r\n}\r\n/deep/.mat-tab-label{\r\n  height: 30px !important;\r\n  width: 60px !important;\r\n  background-color: transparent !important;\r\n}\r\n/deep/.mat-tab-labels{\r\n  background-color: rgba(20,20,20,0.9) !important;\r\n}\r\n/deep/.mat-tab-header{\r\n  width: 700px !important;\r\n}\r\n/deep/.mat-tab-header-pagination-controls-enabled{\r\n  display: none !important;\r\n}\r\n\r\n/deep/.mat-ink-bar{\r\n  background-color: #395d73 !important;\r\n}\r\n\r\n/deep/.mat-tab{\r\n  min-width: 30px !important;\r\n}\r\n/deep/.mat-tab-body-content{\r\n  overflow: hidden !important;\r\n}\r\n\r\n/deep/.mat-header{\r\n  flex-direction: row;\r\n  font-family: Roboto,\"Helvetica Neue\",sans-serif;\r\n  margin-left: 0px;\r\n  color:#395d73;\r\n  border: 0;\r\n  height: 20px;\r\n  background-color: rgba(20,20,20,0.9) !important;\r\n}\r\n/deep/.mat-tab-body-wrapper{\r\n  height:100% !important;\r\n\r\n}\r\n\r\n\r\n/deep/split-gutter{\r\n  background-color:rgb(138, 168, 192) !important;\r\n}\r\n\r\n/deep/.mat-accent .mat-slider-thumb {\r\n    background-color: #8AA8C0 !important;\r\n    cursor: -webkit-grab;\r\n}\r\n/deep/.mat-slider-thumb{\r\n  width: 5px !important;\r\n  right: -5px !important;\r\n}\r\n\r\n/deep/.mat-slider-track-fill{\r\n  background-color: #F0BFA0 !important;\r\n}\r\n\r\n/deep/.mat-slider-thumb-label-text {\r\n    color: #395d73 !important;\r\n    font-size: 12px !important;\r\n}\r\n/deep/.mat-slider-thumb-label{\r\n    height: 15px !important;\r\n    width: 15px !important;\r\n    top: -20px !important;\r\n    right: -7px !important;\r\n    background-color: white !important;\r\n    border: 1px solid #395d73 !important;\r\n}\r\n/deep/.mat-slider-track-background{\r\n  background-color: #D3D3D3 !important;\r\n}\r\n.mat-slider{\r\n    width: 150px !important;\r\n}*/\r\n\r\n.cesium-button {\r\n  display: inline-block;\r\n  position: relative;\r\n  border: 1px solid #8AA8C0;\r\n  color: #D3D3D3;\r\n  fill: #8AA8C0;\r\n  border-radius: 0px;\r\n  padding: 3px 0px;\r\n  margin: 0px 0px;\r\n  cursor: pointer;\r\n  overflow: hidden;\r\n  -moz-user-select: none;\r\n  -webkit-user-select: none;\r\n  -ms-user-select: none;\r\n  user-select: none;\r\n  width: 80px;\r\n  font-family:sans-serif !important;\r\n  background: transparent;\r\n}\r\n\r\n.cesium-button-select{\r\n  display: inline-block;\r\n  position: relative;\r\n  border: 1px solid #8AA8C0;\r\n  fill: #8AA8C0;\r\n  border-radius: 0px;\r\n  padding: 3px 0px;\r\n  margin: 0px 0px;\r\n  cursor: pointer;\r\n  overflow: hidden;\r\n  -moz-user-select: none;\r\n  -webkit-user-select: none;\r\n  -ms-user-select: none;\r\n  user-select: none;\r\n  width: 80px;\r\n  font-family:sans-serif !important;\r\n  color: #D3D3D3;\r\n  background: transparent;\r\n}\r\n\r\n.cesium-option{\r\n  background-color: #F1F1F1;\r\n  /*opacity: 0.8;*/\r\n  color: #8AA8C0;\r\n  border: 1px solid #8AA8C0;\r\n}\r\n\r\nhr {\r\n  display: block;\r\n  height: 1px;\r\n  border: 0;\r\n  border-top: 1px solid #D3D3D3 !important;\r\n  padding: 0; \r\n  color:#D3D3D3 !important;\r\n  width: 100%;\r\n  background-color: #D3D3D3 !important;\r\n}\r\n\r\n"

/***/ }),

/***/ "./src/app/mViewer/viewers/mobius-cesium/setting/display.copmponent.html":
/*!*******************************************************************************!*\
  !*** ./src/app/mViewer/viewers/mobius-cesium/setting/display.copmponent.html ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"DisplayView\"  style=\"background-color: rgba(20,20,20,0.9);height: 100%;overflow-y:overlay;\"  >\r\n\t<table>\r\n      <tr>\r\n      <th class=\"colorkey\" style=\"width: 80px\"><div class=\"Hide\" style=\"width: 80px;color:#D3D3D3 !important;border:0;text-align: left;font-weight: normal;\">Imagery</div></th>\r\n      <th><div>\r\n        <select class=\"cesium-button\" (change)=\"onChangeImagery($event.target.value)\" [ngModel]=\"_Imagery\">\r\n          <option class=\"cesium-option\"  *ngFor=\"let Imagery of _ImageryList\" value={{Imagery}}>{{Imagery}}</option>\r\n        </select>\r\n      </div></th>\r\n      </tr>\r\n    </table>\r\n    <hr>\r\n    <table>\r\n      <tr ><th style=\"width:80px;height: 25px;\"><div style=\"width: 80px;color:#D3D3D3 !important;font-weight: normal;text-align: left;border:0;\">Sun</div></th>\r\n      <th style=\"width:80px;height: 25px;\"><div style=\"width:80px;color:#D3D3D3 !important;font-weight: normal;text-align: left;border:0;\"><input type=\"checkbox\" [checked]=\"_Sun\" (click)=\"changeSun()\"></div></th></tr>\r\n    </table>\r\n    <table>\r\n      <tr ><th style=\"width:80px;height: 25px;\"><div style=\"width: 80px;color:#D3D3D3 !important;font-weight: normal;text-align: left;border:0;\">Shadows</div></th>\r\n      <th style=\"width:80px;height: 25px;\"><div style=\"width:80px;color:#D3D3D3 !important;font-weight: normal;text-align: left;border:0;\"><input type=\"checkbox\" [checked]=\"_Shadow\" (click)=\"changeShadow()\"></div></th></tr>\r\n    </table>\r\n    <table>\r\n      <tr ><th style=\"width:80px;height: 25px;\"><div style=\"width: 80px;color:#D3D3D3 !important;font-weight: normal;text-align: left;border:0;\">Date</div></th>\r\n      <th style=\"width:80px;height: 18px;\"><input type=\"text\"  value={{_Date}} style=\"width:80px;height: 18px;background:transparent;color:#D3D3D3;border:1px solid #8AA8C0;font-weight: normal;text-align: left\" (change)=\"changeDate($event.target.value,_UTC)\"></th></tr>  \r\n    </table>\r\n    <table>\r\n      <tr ><th style=\"width:80px;height: 25px;\"><div style=\"width: 80px;color:#D3D3D3 !important;font-weight: normal;text-align: left;border:0;\">UTC</div></th>\r\n      <th style=\"width:80px;height: 18px;\"><input type=\"text\"  value={{_UTC}} style=\"width:80px;height: 18px;background:transparent;color:#D3D3D3;border:1px solid #8AA8C0;font-weight: normal;text-align: left\" (change)=\"changeDate(_Date,$event.target.value)\"></th></tr>  \r\n    </table>\r\n    \r\n</div>\r\n  "

/***/ }),

/***/ "./src/app/mViewer/viewers/mobius-cesium/setting/display.copmponent.ts":
/*!*****************************************************************************!*\
  !*** ./src/app/mViewer/viewers/mobius-cesium/setting/display.copmponent.ts ***!
  \*****************************************************************************/
/*! exports provided: DisplayComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DisplayComponent", function() { return DisplayComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _data_DataSubscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../data/DataSubscriber */ "./src/app/mViewer/viewers/mobius-cesium/data/DataSubscriber.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var DisplayComponent = /** @class */ (function (_super) {
    __extends(DisplayComponent, _super);
    function DisplayComponent(injector, myElement) {
        return _super.call(this, injector) || this;
    }
    DisplayComponent.prototype.ngOnInit = function () {
        this.data = this.dataService.getGsModel();
        this._ImageryList = ["Disable", "Stamen Toner", "Stamen Toner(Lite)", "Terrain(Standard)", "Terrain(Background)",
            "OpenStreetMap", "Earth at Night", "Natural Earth\u00a0II", "Blue Marble"];
        if (this._Imagery === undefined) {
            this._Imagery = this._ImageryList[3];
            this.onChangeImagery(this._Imagery);
        }
        else {
            this._Imagery = this.dataService.get_Imagery();
        }
        if (this._Sun === undefined) {
            this._Sun = false;
            this.dataService.set_Sun(this._Sun);
        }
        else {
            this._Sun = this.dataService.get_Sun();
        }
        if (this._Shadow === undefined) {
            this._Shadow = false;
            this.dataService.set_Shadow(this._Shadow);
        }
        else {
            this._Shadow = this.dataService.get_Shadow();
        }
        this._UTC = +8;
        this.dataService.set_UTC(this._UTC);
        if (this._Date === undefined) {
            var today = new Date();
            var year = today.getFullYear();
            var month = String(today.getMonth() + 1).padStart(2, "0");
            var day = String(today.getDate()).padStart(2, "0");
            this._Date = year + "-" + month + "-" + day;
        }
        else {
            this._Date = this.dataService.get_Date();
            this.changeDate(this._Date, this._UTC);
        }
        this.dataService.set_Date(this._Date);
    };
    DisplayComponent.prototype.notify = function (message) {
    };
    //chanage imagery in Display tab
    DisplayComponent.prototype.onChangeImagery = function (_Imagery) {
        this._Imagery = _Imagery;
        this.dataService.set_Imagery(_Imagery);
        var layers = this.dataService.getViewer().scene.imageryLayers;
        if (_Imagery === this._ImageryList[0]) {
            layers.removeAll();
            this.dataService.getViewer().scene.globe.baseColor = Cesium.Color.GRAY;
        }
        else if (_Imagery === this._ImageryList[1]) {
            layers.removeAll();
            var blackMarble = layers.addImageryProvider(Cesium.createOpenStreetMapImageryProvider({
                url: "https://stamen-tiles.a.ssl.fastly.net/toner/"
            }));
        }
        else if (_Imagery === this._ImageryList[2]) {
            layers.removeAll();
            var blackMarble = layers.addImageryProvider(Cesium.createOpenStreetMapImageryProvider({
                url: "https://stamen-tiles.a.ssl.fastly.net/toner-lite/"
            }));
        }
        else if (_Imagery === this._ImageryList[3]) {
            layers.removeAll();
            var blackMarble = layers.addImageryProvider(Cesium.createOpenStreetMapImageryProvider({
                url: "https://stamen-tiles.a.ssl.fastly.net/terrain/"
            }));
        }
        else if (_Imagery === this._ImageryList[4]) {
            layers.removeAll();
            var blackMarble = layers.addImageryProvider(Cesium.createOpenStreetMapImageryProvider({
                url: "https://stamen-tiles.a.ssl.fastly.net/terrain-background/"
            }));
        }
        else if (_Imagery === this._ImageryList[5]) {
            layers.removeAll();
            var blackMarble = layers.addImageryProvider(Cesium.createOpenStreetMapImageryProvider({
                url: "https://a.tile.openstreetmap.org/"
            }));
        }
        else if (_Imagery === this._ImageryList[6]) {
            layers.removeAll();
            var blackMarble = layers.addImageryProvider(new Cesium.IonImageryProvider({ assetId: 3812 }));
        }
        else if (_Imagery === this._ImageryList[7]) {
            layers.removeAll();
            var blackMarble = layers.addImageryProvider(Cesium.createTileMapServiceImageryProvider({
                url: Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII"),
            }));
        }
        else if (_Imagery === this._ImageryList[8]) {
            layers.removeAll();
            var blackMarble = layers.addImageryProvider(new Cesium.IonImageryProvider({ assetId: 3845 }));
        }
    };
    //change sun
    DisplayComponent.prototype.changeSun = function () {
        var viewer = this.dataService.getViewer();
        this._Sun = !this._Sun;
        if (this._Sun === true) {
            viewer.terrainShadows = Cesium.ShadowMode.ENABLED;
            viewer.scene.globe.enableLighting = true;
            viewer.scene.sun.show = true;
        }
        else {
            viewer.terrainShadows = undefined;
            viewer.scene.globe.enableLighting = false;
            viewer.scene.sun.show = false;
        }
        this.dataService.set_Sun(this._Sun);
    };
    //change shadow
    DisplayComponent.prototype.changeShadow = function () {
        this._Shadow = !this._Shadow;
        var promise = this.dataService.getcesiumpromise();
        if (this._Shadow === true) {
            promise.then(function (dataSource) {
                var entities = dataSource.entities.values;
                for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
                    var entity = entities_1[_i];
                    entity.polygon.shadows = Cesium.ShadowMode.ENABLED;
                }
            });
        }
        else {
            promise.then(function (dataSource) {
                var entities = dataSource.entities.values;
                for (var _i = 0, entities_2 = entities; _i < entities_2.length; _i++) {
                    var entity = entities_2[_i];
                    entity.polygon.shadows = undefined;
                }
            });
        }
        this.dataService.set_Shadow(this._Shadow);
    };
    //change date
    DisplayComponent.prototype.changeDate = function (_Date, _UTC) {
        this._Date = _Date;
        this._UTC = _UTC;
        var viewer = this.dataService.getViewer();
        var now = new Cesium.JulianDate.fromIso8601(this._Date);
        var tomorrow = now.clone();
        tomorrow.dayNumber = tomorrow.dayNumber + 1;
        viewer.clock.currentTime = Cesium.JulianDate.addHours(now, this._UTC, now);
        viewer.clock.startTime = now.clone();
        viewer.clock.stopTime = tomorrow.clone();
        viewer.timeline.zoomTo(viewer.clock.startTime, viewer.clock.stopTime);
        this.dataService.set_Date(this._Date);
        this.dataService.set_UTC(this._UTC);
        viewer.timeline.updateFromClock();
    };
    DisplayComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: "app-display",
            template: __webpack_require__(/*! ./display.copmponent.html */ "./src/app/mViewer/viewers/mobius-cesium/setting/display.copmponent.html"),
            styles: [__webpack_require__(/*! ./display.copmponent.css */ "./src/app/mViewer/viewers/mobius-cesium/setting/display.copmponent.css")],
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]])
    ], DisplayComponent);
    return DisplayComponent;
}(_data_DataSubscriber__WEBPACK_IMPORTED_MODULE_1__["DataSubscriber"]));



/***/ }),

/***/ "./src/app/mViewer/viewers/mobius-cesium/setting/publish.component.css":
/*!*****************************************************************************!*\
  !*** ./src/app/mViewer/viewers/mobius-cesium/setting/publish.component.css ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#publishwindow{\r\n  position: relative;\r\n  height: 100%;\r\n  width: 100%;\r\n  color:#D3D3D3 !important;\r\n  font-family: Roboto,\"Helvetica Neue\",sans-serif;\r\n  font-size: 14px !important;\r\n  line-height: 16px;\r\n  overflow-x: hidden !important;\r\n}\r\n\r\n/deep/split-gutter{\r\n  background-color:rgb(138, 168, 192) !important;\r\n}\r\n\r\n/deep/.mat-accent .mat-slider-thumb {\r\n    background-color: #8AA8C0 !important;\r\n    cursor: -webkit-grab;\r\n    padding: 0px;\r\n    height: 24px;\r\n    /*min-width: 50px;*/\r\n    flex-grow: 1;\r\n    touch-action: none;\r\n    -webkit-user-select: none;\r\n       -moz-user-select: none;\r\n        -ms-user-select: none;\r\n            user-select: none;\r\n    -webkit-user-drag: none;\r\n    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\r\n}\r\n\r\n/deep/.mat-slider-thumb{\r\n  width: 5px !important;\r\n  right: -5px !important;\r\n}\r\n\r\n/deep/.mat-slider-track-fill{\r\n  background-color: #F0BFA0 !important;\r\n}\r\n\r\n/deep/.mat-slider-thumb-label-text {\r\n    color: #395d73 !important;\r\n    font-size: 12px !important;\r\n}\r\n\r\n/deep/.mat-slider-thumb-label{\r\n    height: 15px !important;\r\n    width: 15px !important;\r\n    top: -20px !important;\r\n    right: -7px !important;\r\n    background-color: white !important;\r\n    border: 1px solid #395d73 !important;\r\n}\r\n\r\n/deep/.mat-slider-track-background{\r\n  background-color: #D3D3D3 !important;\r\n}\r\n\r\n.mat-slider{\r\n    width: 100%;\r\n    display: inline-block;\r\n    position: relative;\r\n    box-sizing: border-box;\r\n    outline: 0;\r\n    vertical-align: middle;\r\n}\r\n\r\n.cesium-button {\r\n  display: inline-block;\r\n  position: relative;\r\n  border: 1px solid #8AA8C0;\r\n  color: #D3D3D3;\r\n  fill: #8AA8C0;\r\n  border-radius: 0px;\r\n  padding: 3px 0px;\r\n  margin: 0px 0px;\r\n  cursor: pointer;\r\n  overflow: hidden;\r\n  -moz-user-select: none;\r\n  -webkit-user-select: none;\r\n  -ms-user-select: none;\r\n  user-select: none;\r\n  width: 80px;\r\n  font-family:sans-serif !important;\r\n  background: transparent;\r\n}\r\n\r\n.cesium-button-select{\r\n  display: inline-block;\r\n  position: relative;\r\n  border: 1px solid #8AA8C0;\r\n  fill: #8AA8C0;\r\n  border-radius: 0px;\r\n  padding: 3px 0px;\r\n  margin: 0px 0px;\r\n  cursor: pointer;\r\n  overflow: hidden;\r\n  -moz-user-select: none;\r\n  -webkit-user-select: none;\r\n  -ms-user-select: none;\r\n  user-select: none;\r\n  width: 80px;\r\n  font-family:sans-serif !important;\r\n  color: #D3D3D3;\r\n  background: transparent;\r\n}\r\n\r\n.cesium-option{\r\n  background-color: #F1F1F1;\r\n  /*opacity: 0.8;*/\r\n  color: #8AA8C0;\r\n  border: 1px solid #8AA8C0;\r\n}\r\n\r\nhr {\r\n  display: block;\r\n  height: 1px;\r\n  border: 0;\r\n  border-top: 1px solid #D3D3D3 !important;\r\n  padding: 0; \r\n  color:#D3D3D3 !important;\r\n  width: 100%;\r\n  background-color: #D3D3D3 !important;\r\n}\r\n"

/***/ }),

/***/ "./src/app/mViewer/viewers/mobius-cesium/setting/publish.component.html":
/*!******************************************************************************!*\
  !*** ./src/app/mViewer/viewers/mobius-cesium/setting/publish.component.html ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"publish\" style=\"background-color: rgba(20,20,20,0.9);height: 100%;overflow-y:overlay;\"  >\r\n\r\n<div id=\"publishwindow\" *ngIf=\"dataArr!==undefined\">\r\n        <div *ngIf=\"_ColorKey!==undefined\">\r\n        <table >\r\n          <tr>\r\n          <th class=\"colorkey\" style=\"width: 280px\" *ngIf=\"_ColorDescr!==undefined\"><div style=\"color:#D3D3D3 !important;border:0;text-align: left;font-weight: normal;font-size:14px;line-height:16px;\">{{_ColorDescr}}</div></th></tr>\r\n        </table>\r\n        <table>\r\n          <tr>\r\n            <th class=\"colorkey\" style=\"width: 80px\"><div class=\"Hide\" style=\"width: 80px;color:#D3D3D3 !important;border:0;text-align: left;font-weight: normal;\">Color&nbsp;&nbsp;:</div></th>\r\n          <th><div>\r\n            <select class=\"cesium-button\" (change)=\"onChangeColor($event.target.value)\" [ngModel]=\"_ColorKey\">\r\n              <option class=\"cesium-option\"  *ngFor=\"let ColorName of _ColorProperty\" value={{ColorName}}>{{ColorName}}</option>\r\n            </select>\r\n          </div></th>\r\n          </tr>\r\n          </table>\r\n    </div>\r\n    <div *ngIf=\"_ExtrudeKey!==undefined\">\r\n        <hr>\r\n          <table >\r\n          <tr>\r\n          <th class=\"colorkey\" style=\"width: 280px\" *ngIf=\"_ExtrudeDescr!==undefined\"><div style=\"color:#D3D3D3 !important;border:0;text-align: left;font-weight: normal;font-size:14px;line-height:16px;\">{{_ExtrudeDescr}}</div></th></tr>\r\n        </table>\r\n        <table>\r\n          <tr>\r\n            <th class=\"colorkey\" style=\"width: 80px\"><div class=\"Hide\" style=\"width: 80px;color:#D3D3D3 !important;border:0;text-align: left;font-weight: normal;\">Extrude&nbsp;&nbsp;:</div></th>\r\n          <th><div>\r\n            <select class=\"cesium-button\" (change)=\"onChangeHeight($event.target.value)\" [ngModel]=\"_ExtrudeKey\">\r\n               <option class=\"cesium-option\"  *ngFor=\"let Height of _ExtrudeProperty\" value={{Height}}>{{Height}}</option>\r\n            </select>\r\n          </div></th>\r\n          </tr>\r\n        </table>\r\n        <table>\r\n          <tr ><th style=\"width:40px;height: 25px;\"><div style=\"width: 40px;color:#D3D3D3 !important;font-weight: normal;text-align: left;border:0;\">Min&nbsp;&nbsp;:</div></th>\r\n          <th style=\"width:40px;\"><div style=\"width: 40px;color:#D3D3D3 !important;font-weight: normal;text-align: left;border:0;\" *ngIf=\"_ExtrudeMin!==undefined\">{{_ExtrudeMin}}</div></th></tr>\r\n\r\n          <tr><th style=\"width:40px;\"><div style=\"width: 40px;color:#D3D3D3 !important;font-weight: normal;text-align: left;border:0;\">Max&nbsp;&nbsp;:</div></th>\r\n          <th style=\"width:60px;\"><div style=\"width: 60px;color:#D3D3D3 !important;font-weight: normal;text-align: left;border:0;\" *ngIf=\"_ExtrudeMax!==undefined\">{{_ExtrudeMax}}</div></th></tr>\r\n      </table>\r\n    </div>\r\n    <div *ngIf=\"_Filter!==undefined\">\r\n      <hr>\r\n      <div class=\"hide-container\" style=\"margin-top:5px;\">\r\n        <div *ngFor=\"let item of _Filter;\" id={{item.divid}}>\r\n      <table>\r\n        <tr >\r\n          <th style=\"width:280px;height: 25px;\"><div style=\"color:#D3D3D3 !important;text-align: left;vertical-align: middle;font-weight: normal;font-size:14px;line-height:16px;\">{{item.descr}}</div></th></tr>\r\n        </table>\r\n        <table>\r\n          <tr>\r\n            <th style=\"max-width: 80px;height: 25px;\"><div matTooltip={{item.HeightHide}} style=\"max-width: 80px;color:#D3D3D3 !important;text-align: left;vertical-align: middle;font-weight: normal;white-space: nowrap;display:block;overflow: hidden !important;text-overflow: ellipsis !important;cursor:pointer;\">{{item.HeightHide}}</div></th>\r\n        <th *ngIf=\"item.type === 'number'\" style=\"width:20px;height: 25px;\">\r\n          <div style=\"width:20px;height: 25px;color:#D3D3D3 !important;vertical-align: middle;font-weight: normal;margin-top: 10px;\" *ngIf=\"item.RelaHide === 0\">></div>\r\n          <div style=\"width:20px;height: 25px;color:#D3D3D3 !important;vertical-align: middle;font-weight: normal;margin-top: 10px;\" *ngIf=\"item.RelaHide === 1\"><</div>\r\n          <div style=\"width:20px;height: 25px;color:#D3D3D3 !important;vertical-align: middle;font-weight: normal;margin-top: 10px;\" *ngIf=\"item.RelaHide === 2\">=</div></th>\r\n          <th *ngIf=\"item.type === 'category'\" style=\"width:30px;height: 25px;\">\r\n          <div style=\"width:20px;height: 25px;color:#D3D3D3 !important;vertical-align: middle;font-weight: normal;margin-top: 10px;\" *ngIf=\"item.RelaHide === 0\">none</div>\r\n          <div style=\"width:20px;height: 25px;color:#D3D3D3 !important;vertical-align: middle;font-weight: normal;margin-top: 10px;\" *ngIf=\"item.RelaHide === 1\">=</div>\r\n          <div style=\"width:20px;height: 25px;color:#D3D3D3 !important;vertical-align: middle;font-weight: normal;margin-top: 10px;\" *ngIf=\"item.RelaHide === 2\">!=</div></th>\r\n          <th *ngIf=\"item.type === 'number'\" style=\"width:80px;color:#395D73 !important;\"><input type=\"text\" id={{item.id}} value={{item.textHide}} (change)=\"Changetext($event.target.value,item.id)\" style=\"width:80px;background:transparent;color:#D3D3D3;border:1px solid #8AA8C0;\"></th>\r\n          <th *ngIf=\"item.type === 'category'\" style=\"width:73px;height: 25px;\"><div style=\"width:73px;height: 25px;\">\r\n          <select class=\"cesium-button-select\" [ngModel]=\"item.CategaryHide\" (change)=\"ChangeCategory($event.target.value,item.id,1)\" style=\"width:73px;height: 25px;\">\r\n            <option class=\"cesium-option\" *ngFor=\"let caty of item.Category\" value={{caty}}>{{caty}}</option>\r\n          </select></div></th>\r\n        <th style=\"width:20px;height: 22px;\" id={{item.id}}><input type=\"checkbox\" id={{item.id}} checked=\"checked\" (click)=\"Disable(item.id)\" style=\"width:20px;height: 22px;cursor:pointer;\"></th></tr>\r\n      </table>\r\n      <table>\r\n        <tr>\r\n        <th *ngIf=\"item.type === 'number'\" style=\"max-width: 30px;height: 25px;vertical-align: top;padding-top: 10px;\"><div style=\"font-weight: normal;display: inline-block;color:#D3D3D3 !important;text-align: left;max-width: 30px;\">{{item.HideMin}}</div></th>\r\n        <th *ngIf=\"item.type === 'number'\" style=\"width:200px;height: 25px;\"><div style=\"font-weight: normal;display: inline-block;width:200px;\"><mat-slider class=\"slider\" name=\"range\" id=\"0\" min={{item.HideMin}} max={{item.HideMax}} step=0.01 thumbLabel=true value={{item.textHide}} #textscale (change)=\"Changetext(textscale.value.toPrecision(2),item.id)\" >\r\n        </mat-slider></div></th>\r\n        <th *ngIf=\"item.type === 'number'\" style=\"max-width: 30px;height: 25px;vertical-align: top;padding-top: 10px;\"><div style=\"font-weight: normal;display: inline-block;color:#D3D3D3 !important;max-width: 30px;text-align: left;\">{{item.HideMax}}</div></th></tr>\r\n      </table><hr>\r\n        </div>\r\n      </div>\r\n      <div>\r\n      <button style=\"color:#D3D3D3;border:2px solid #8AA8C0;background-color: transparent;cursor:pointer;\" (click)=\"reset()\">Reset</button></div>\r\n      </div>\r\n</div>\r\n\r\n  "

/***/ }),

/***/ "./src/app/mViewer/viewers/mobius-cesium/setting/publish.component.ts":
/*!****************************************************************************!*\
  !*** ./src/app/mViewer/viewers/mobius-cesium/setting/publish.component.ts ***!
  \****************************************************************************/
/*! exports provided: PublishComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PublishComponent", function() { return PublishComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _data_DataSubscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../data/DataSubscriber */ "./src/app/mViewer/viewers/mobius-cesium/data/DataSubscriber.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var PublishComponent = /** @class */ (function (_super) {
    __extends(PublishComponent, _super);
    function PublishComponent(injector, myElement) {
        var _this = _super.call(this, injector) || this;
        _this._CheckDisable = false;
        return _this;
    }
    PublishComponent.prototype.ngOnInit = function () {
        this.mode = this.dataService.getmode();
        this.dataArr = this.dataService.get_PuData();
        if (this.dataArr !== undefined) {
            this.LoadData();
        }
    };
    PublishComponent.prototype.notify = function (message) {
        if (message === "model_update") {
            try {
                this.dataArr = this.dataService.get_PuData();
                if (this.dataArr !== undefined) {
                    this.LoadData();
                }
            }
            catch (ex) {
                console.log(ex);
            }
        }
    };
    //load data in publish version
    PublishComponent.prototype.LoadData = function () {
        this._ColorDescr = this.dataArr["ColorDescr"];
        this._ColorProperty = this.dataArr["ColorProperty"];
        this._ColorKey = this.dataArr["ColorKey"];
        this._ColorMax = this.dataArr["ColorMax"];
        this._ColorMin = this.dataArr["ColorMin"];
        this._ColorInvert = this.dataArr["ColorInvert"];
        this._ExtrudeDescr = this.dataArr["ExtrudeDescr"];
        this._ExtrudeProperty = this.dataArr["ExtrudeProperty"];
        this._ExtrudeKey = this.dataArr["ExtrudeKey"];
        this._ExtrudeMax = this.dataArr["ExtrudeMax"];
        this._ExtrudeMin = this.dataArr["ExtrudeMin"];
        this._HeightChart = this.dataArr["HeightChart"];
        this._Invert = this.dataArr["Invert"];
        this._Scale = this.dataArr["Scale"];
        this._HideNum = this.dataArr["HideNum"];
        this._Filter = this.dataArr["Filter"];
    };
    //disable button in publish version
    PublishComponent.prototype.Disable = function (event) {
        var index = this._HideNum.indexOf(event);
        var divid = String("addHide".concat(String(event)));
        var addHide = document.getElementById(divid);
        if (this._Filter[index].Disabletext === null) {
            this._CheckDisable = false;
        }
        else {
            this._CheckDisable = true;
        }
        if (this._CheckDisable === false) {
            if (this._Filter[index].type === "number") {
                var textHide = this._Filter[index].textHide;
                this._Filter[index].Disabletext = Number(textHide);
                if (this._Filter[index].RelaHide === "0" || this._Filter[index].RelaHide === 0) {
                    this._Filter[index].textHide = this._Filter[index].HideMin;
                }
                if (this._Filter[index].RelaHide === "1" || this._Filter[index].RelaHide === 1) {
                    this._Filter[index].textHide = this._Filter[index].HideMax;
                }
            }
            else if (this._Filter[index].type === "category") {
                var textHide = this._Filter[index].RelaHide;
                this._Filter[index].Disabletext = Number(textHide);
                this._Filter[index].RelaHide = 0;
            }
        }
        else {
            if (this._Filter[index].type === "number") {
                this._Filter[index].textHide = this._Filter[index].Disabletext;
                this._Filter[index].Disabletext = null;
            }
            else if (this._Filter[index].type === "category") {
                this._Filter[index].RelaHide = this._Filter[index].Disabletext;
                this._Filter[index].Disabletext = null;
            }
        }
        this.dataArr["Filter"] = this._Filter;
        this.dataArr["HideNum"] = this._HideNum;
        this.dataService.set_PuData(this.dataArr);
    };
    //change category in filter
    PublishComponent.prototype.ChangeCategory = function (categary, id, type) {
        var _index = this._HideNum.indexOf(id);
        if (type === 1) {
            this._Filter[_index].CategaryHide = categary;
        }
        if (type === 0) {
            this._Filter[_index].RelaHide = Number(categary);
        }
    };
    //change text in filter
    PublishComponent.prototype.Changetext = function (value, id) {
        var _index = this._HideNum.indexOf(id);
        this._Filter[_index].textHide = value;
    };
    //change color property in publish version
    PublishComponent.prototype.onChangeColor = function (value) {
        var data = this.dataService.getGsModel()["cesium"]["colour"]["attribs"];
        this.dataArr["ColorKey"] = value;
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var _data = data_1[_i];
            if (_data["name"] === value) {
                this.dataArr["ColorMin"] = _data["min"];
                this.dataArr["ColorMax"] = _data["max"];
                this.dataArr["ColorInvert"] = _data["invert"];
            }
        }
        var promise = this.dataService.getcesiumpromise();
        var _Colortexts = [];
        var self = this;
        promise.then(function (dataSource) {
            var entities = dataSource.entities.values;
            for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
                var entity = entities_1[_i];
                if (entity.properties[value] !== undefined) {
                    if (entity.properties[value]._value !== " ") {
                        if (_Colortexts.length === 0) {
                            _Colortexts[0] = entity.properties[value]._value;
                        }
                        else {
                            if (_Colortexts.indexOf(entity.properties[value]._value) === -1) {
                                _Colortexts.push(entity.properties[value]._value);
                            }
                        }
                    }
                }
            }
        });
        this.dataArr["ColorText"] = _Colortexts.sort();
        this.dataService.set_PuData(this.dataArr);
        this.LoadData();
    };
    //change extrudeheight property in publish version
    PublishComponent.prototype.onChangeHeight = function (value) {
        var data = this.dataService.getGsModel()["cesium"]["extrude"]["attribs"];
        this.dataArr["ExtrudeKey"] = value;
        for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
            var _data = data_2[_i];
            if (_data["name"] === value) {
                this.dataArr["ExtrudeMin"] = _data["min"];
                this.dataArr["ExtrudeMax"] = _data["max"];
                this.dataArr["HeightChart"] = _data["line"];
                this.dataArr["Invert"] = _data["invert"];
                this.dataArr["Scale"] = _data["scale"];
            }
        }
        var promise = this.dataService.getcesiumpromise();
        var _Heighttexts = [];
        var self = this;
        promise.then(function (dataSource) {
            var entities = dataSource.entities.values;
            for (var _i = 0, entities_2 = entities; _i < entities_2.length; _i++) {
                var entity = entities_2[_i];
                if (entity.properties[value] !== undefined) {
                    if (entity.properties[value]._value !== " ") {
                        if (_Heighttexts.length === 0) {
                            _Heighttexts[0] = entity.properties[value]._value;
                        }
                        else {
                            if (_Heighttexts.indexOf(entity.properties[value]._value) === -1) {
                                _Heighttexts.push(entity.properties[value]._value);
                            }
                        }
                    }
                }
            }
        });
        this.dataArr["ExtrudeText"] = _Heighttexts.sort();
        this.dataService.set_PuData(this.dataArr);
        this.LoadData();
    };
    //reset button to load again
    PublishComponent.prototype.reset = function () {
        this.dataService.LoadJSONData();
        this.dataArr = this.dataService.get_PuData();
        if (this.dataArr !== undefined) {
            this.LoadData();
        }
    };
    PublishComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: "app-publish",
            template: __webpack_require__(/*! ./publish.component.html */ "./src/app/mViewer/viewers/mobius-cesium/setting/publish.component.html"),
            styles: [__webpack_require__(/*! ./publish.component.css */ "./src/app/mViewer/viewers/mobius-cesium/setting/publish.component.css")],
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]])
    ], PublishComponent);
    return PublishComponent;
}(_data_DataSubscriber__WEBPACK_IMPORTED_MODULE_1__["DataSubscriber"]));



/***/ }),

/***/ "./src/app/mViewer/viewers/mobius-cesium/setting/setting.component.css":
/*!*****************************************************************************!*\
  !*** ./src/app/mViewer/viewers/mobius-cesium/setting/setting.component.css ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#setting{\r\n  position: relative;\r\n  height: 100%;\r\n  width: 100%;\r\n  color:#D3D3D3 !important;\r\n  font-family: Roboto,\"Helvetica Neue\",sans-serif;\r\n  font-size: 14px !important;\r\n  line-height: 14px;\r\n  overflow-x: hidden !important;\r\n  border-right: 1px solid gray;\r\n}\r\n\r\n/deep/.mat-tab-label, /deep/.mat-tab-label-active{\r\n  min-width: 60px!important;\r\n  padding: 3px!important;\r\n  margin: 3px!important;\r\n  color:#D3D3D3 !important;\r\n  background-color: transparent !important;\r\n}\r\n\r\n/deep/.mat-tab-label{\r\n  height: 30px !important;\r\n  width: 60px !important;\r\n  background-color: transparent !important;\r\n}\r\n\r\n/deep/.mat-tab-labels{\r\n  background-color: rgba(20,20,20,0.9) !important;\r\n}\r\n\r\n/deep/.mat-tab-header{\r\n  width: 700px !important;\r\n}\r\n\r\n/deep/.mat-tab-header-pagination-controls-enabled{\r\n  display: none !important;\r\n}\r\n\r\n/deep/.mat-ink-bar{\r\n  background-color: #395d73 !important;\r\n}\r\n\r\n/deep/.mat-tab{\r\n  min-width: 30px !important;\r\n}\r\n\r\n/deep/.mat-tab-body-content{\r\n  overflow: hidden !important;\r\n}\r\n\r\n/deep/.mat-header{\r\n  flex-direction: row;\r\n  font-family: Roboto,\"Helvetica Neue\",sans-serif;\r\n  margin-left: 0px;\r\n  color:#395d73;\r\n  border: 0;\r\n  height: 20px;\r\n  background-color: rgba(20,20,20,0.9) !important;\r\n}\r\n\r\n/deep/.mat-tab-body-wrapper{\r\n  height:100% !important;\r\n\r\n}\r\n\r\n/deep/split-gutter{\r\n  background-color:rgb(138, 168, 192) !important;\r\n}\r\n\r\n/deep/.mat-accent .mat-slider-thumb {\r\n    background-color: #8AA8C0 !important;\r\n    cursor: -webkit-grab;\r\n}\r\n\r\n/deep/.mat-slider-thumb{\r\n  width: 5px !important;\r\n  right: -5px !important;\r\n}\r\n\r\n/deep/.mat-slider-track-fill{\r\n  background-color: #F0BFA0 !important;\r\n}\r\n\r\n/deep/.mat-slider-thumb-label-text {\r\n    color: #395d73 !important;\r\n    font-size: 12px !important;\r\n}\r\n\r\n/deep/.mat-slider-thumb-label{\r\n    height: 15px !important;\r\n    width: 15px !important;\r\n    top: -20px !important;\r\n    right: -7px !important;\r\n    background-color: white !important;\r\n    border: 1px solid #395d73 !important;\r\n}\r\n\r\n/deep/.mat-slider-track-background{\r\n  background-color: #D3D3D3 !important;\r\n}\r\n\r\n.mat-slider{\r\n    width: 150px !important;\r\n}\r\n"

/***/ }),

/***/ "./src/app/mViewer/viewers/mobius-cesium/setting/setting.component.html":
/*!******************************************************************************!*\
  !*** ./src/app/mViewer/viewers/mobius-cesium/setting/setting.component.html ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"setting\" >\r\n  <mat-tab-group class=\"mat-tab-group\" style=\"height: 100%;\" (selectedTabChange)=\"changedata($event.index)\" *ngIf=\"mode==='editor'\" >\r\n    <mat-tab label=\"&nbsp;Select&nbsp;\">\r\n      <app-select></app-select>\r\n    </mat-tab>\r\n    <mat-tab label=\"&nbsp;Data&nbsp;\" >\r\n      <app-data (change)=\"LoadViewer()\" (click)=\"LoadViewer()\"></app-data>\r\n    </mat-tab>\r\n    <mat-tab label=\"&nbsp;Display&nbsp;\" >\r\n      <app-display></app-display>\r\n    </mat-tab>\r\n    <mat-tab label=\"&nbsp;Publish&nbsp;\" >\r\n      <app-publish  (change)=\"LoadViewer()\" (click)=\"Reset();LoadViewer();\"></app-publish>\r\n    </mat-tab>\r\n  </mat-tab-group>\r\n    <app-publish *ngIf=\"mode==='viewer'\" (change)=\"LoadViewer()\" (click)=\"Reset();LoadViewer();\"></app-publish>\r\n</div>"

/***/ }),

/***/ "./src/app/mViewer/viewers/mobius-cesium/setting/setting.component.ts":
/*!****************************************************************************!*\
  !*** ./src/app/mViewer/viewers/mobius-cesium/setting/setting.component.ts ***!
  \****************************************************************************/
/*! exports provided: SettingComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingComponent", function() { return SettingComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _data_DataSubscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../data/DataSubscriber */ "./src/app/mViewer/viewers/mobius-cesium/data/DataSubscriber.ts");
/* harmony import */ var chroma_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! chroma-js */ "./node_modules/chroma-js/chroma.js");
/* harmony import */ var chroma_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(chroma_js__WEBPACK_IMPORTED_MODULE_2__);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var SettingComponent = /** @class */ (function (_super) {
    __extends(SettingComponent, _super);
    function SettingComponent(injector, myElement) {
        return _super.call(this, injector) || this;
    }
    //get data and mode
    SettingComponent.prototype.ngOnInit = function () {
        this.data = this.dataService.getGsModel();
        this.mode = this.dataService.getmode();
        if (this.mode === "viewer") {
            this.changedata(3);
        }
        else if (this.mode === "editor") {
            this.changedata(1);
        }
    };
    //change data and load new data
    SettingComponent.prototype.notify = function (message) {
        if (message === "model_update") {
            this.data = this.dataService.getGsModel();
            this.mode = this.dataService.getmode();
            try {
                if (this.data !== undefined && this.data["features"] !== undefined) {
                    if (this.mode === "viewer") {
                        this.changedata(3);
                    }
                    else if (this.mode === "editor") {
                        this.changedata(1);
                    }
                }
            }
            catch (ex) {
                console.log(ex);
            }
        }
    };
    //change index from editor version to publish version
    SettingComponent.prototype.changedata = function (id) {
        this.dataService.set_index(id);
        if (id === 1) {
            this.dataArr = this.dataService.get_ViData();
        }
        else if (id === 3) {
            this.dataArr = this.dataService.get_PuData();
        }
        if (this.dataArr !== undefined) {
            this.LoadViewer();
        }
    };
    //reset button to reset everthing in publish version
    SettingComponent.prototype.Reset = function () {
        this.dataArr = this.dataService.get_PuData();
    };
    //change color and extrudeHeight of entity
    SettingComponent.prototype.LoadViewer = function () {
        var promise = this.dataService.getcesiumpromise();
        var _ColorKey = this.dataArr["ColorKey"];
        var _ColorMax = this.dataArr["ColorMax"];
        var _ColorMin = this.dataArr["ColorMin"];
        var _ColorText = this.dataArr["ColorText"];
        var _ColorInvert = this.dataArr["ColorInvert"];
        var _ExtrudeKey = this.dataArr["ExtrudeKey"];
        var _ExtrudeMax = this.dataArr["ExtrudeMax"];
        var _ExtrudeMin = this.dataArr["ExtrudeMin"];
        var _HeightChart = this.dataArr["HeightChart"];
        var _Invert = this.dataArr["Invert"];
        var _Scale = this.dataArr["Scale"];
        var _indexArr = this.dataArr["indexArr"];
        var _Filter;
        if (this.dataArr["Filter"] !== undefined && this.dataArr["Filter"].length !== 0) {
            _Filter = this.dataArr["Filter"];
        }
        else {
            _Filter = [];
        }
        var _ChromaScale = chroma_js__WEBPACK_IMPORTED_MODULE_2__["scale"]("SPECTRAL");
        if (_ColorInvert === true) {
            _ChromaScale = chroma_js__WEBPACK_IMPORTED_MODULE_2__["scale"]("SPECTRAL").domain([1, 0]);
        }
        var self = this;
        promise.then(function (dataSource) {
            var entities = dataSource.entities.values;
            for (var _i = 0, _indexArr_1 = _indexArr; _i < _indexArr_1.length; _i++) {
                var i = _indexArr_1[_i];
                var entity = entities[i];
                var _CheckHide = void 0;
                if (entity.polygon !== undefined) {
                    if (_Filter.length !== 0) {
                        _CheckHide = self.Hide(_Filter, entity, _HeightChart);
                        if (_CheckHide === true) {
                            if (entity.polygon !== undefined) {
                                entity.polygon.extrudedHeight = 0;
                                entity.polygon.material = Cesium.Color.LIGHTSLATEGRAY.withAlpha(1);
                                if (_HeightChart === true) {
                                    if (entity.polyline !== undefined) {
                                        entity.polyline.show = false;
                                    }
                                }
                            }
                            if (entity.polyline !== undefined) {
                                entity.polyline.material = Cesium.Color.LIGHTSLATEGRAY.withAlpha(1);
                            }
                        }
                    }
                    if (_Filter.length === 0 || _CheckHide === false) {
                        if (_ColorKey !== "None") {
                            if (typeof (_ColorText[0]) === "number") {
                                self.colorByNum(entity, _ColorMax, _ColorMin, _ColorKey, _ChromaScale);
                            }
                            else {
                                self.colorByCat(entity, _ColorText, _ColorKey, _ChromaScale);
                            }
                        }
                        else {
                            entity.polygon.material = Cesium.Color.DARKGREY;
                        }
                        if (_ExtrudeKey !== "None") {
                            if (_HeightChart === false) {
                                entity.polyline = undefined;
                                if (entity.properties[_ExtrudeKey] !== undefined) {
                                    entity.polygon.extrudedHeight = self.ExtrudeHeight(entity.properties[_ExtrudeKey]._value, _ExtrudeMax, _ExtrudeMin, _Invert) * _Scale;
                                }
                                else {
                                    entity.polygon.extrudedHeight = 0;
                                }
                            }
                            else {
                                entity.polygon.extrudedHeight = 0;
                                var center = Cesium.BoundingSphere.fromPoints(entity.polygon.hierarchy.getValue().positions).center;
                                var radius = Math.min(Math.round(Cesium.BoundingSphere.fromPoints(entity.polygon.hierarchy.getValue().positions).radius / 100), 10);
                                var longitudeString = Cesium.Math.toDegrees(Cesium.Ellipsoid.WGS84.
                                    cartesianToCartographic(center).longitude).toFixed(10);
                                var latitudeString = Cesium.Math.toDegrees(Cesium.Ellipsoid.WGS84.cartesianToCartographic(center).
                                    latitude).toFixed(10);
                                entity.polyline = new Cesium.PolylineGraphics({
                                    positions: new Cesium.Cartesian3.fromDegreesArrayHeights([longitudeString, latitudeString, 0, longitudeString,
                                        latitudeString, self.ExtrudeHeight(entity.properties[_ExtrudeKey]._value, _ExtrudeMax, _ExtrudeMin, _Invert) * _Scale]),
                                    width: radius,
                                    material: entity.polygon.material,
                                    show: true,
                                });
                            }
                        }
                        else {
                            entity.polyline = undefined;
                            entity.polygon.extrudedHeight = 0;
                        }
                    }
                }
                else if (entity.polyline !== undefined) {
                    if (_ColorKey !== "None") {
                        if (typeof (_ColorText[0]) === "number") {
                            self.colorByNum(entity, _ColorMax, _ColorMin, _ColorKey, _ChromaScale);
                        }
                        else {
                            self.colorByCat(entity, _ColorText, _ColorKey, _ChromaScale);
                        }
                    }
                    else {
                        entity.polyline.material = Cesium.Color.DARKGREY;
                    }
                }
                else if (entity.point !== undefined) {
                    if (_ColorKey !== "None") {
                        if (typeof (_ColorText[0]) === "number") {
                            self.colorByNum(entity, _ColorMax, _ColorMin, _ColorKey, _ChromaScale);
                        }
                        else {
                            self.colorByCat(entity, _ColorText, _ColorKey, _ChromaScale);
                        }
                    }
                    else {
                        entity.point.color = Cesium.Color.DARKGREY;
                    }
                }
            }
        });
    };
    //check whether entity should be hided or not
    SettingComponent.prototype.Hide = function (_Filter, entity, _HeightChart) {
        var _CheckHide = false;
        for (var _i = 0, _Filter_1 = _Filter; _i < _Filter_1.length; _i++) {
            var filter = _Filter_1[_i];
            var value = entity.properties[filter.HeightHide]._value;
            if (value !== undefined) {
                if (typeof (value) === "number") {
                    if (this._compare(value, Number(filter.textHide), Number(filter.RelaHide))) {
                        _CheckHide = true;
                    }
                }
                else if (typeof (value) === "string") {
                    if (this._compareCat(value, filter.CategaryHide, Number(filter.RelaHide))) {
                        _CheckHide = true;
                    }
                }
            }
        }
        return _CheckHide;
    };
    SettingComponent.prototype._compare = function (value, slider, relation) {
        switch (relation) {
            case 0:
                return value < slider;
            case 1:
                return value > slider;
            case 2:
                return value !== slider;
        }
    };
    SettingComponent.prototype._compareCat = function (value, _Categary, relation) {
        switch (relation) {
            case 0:
                return value === undefined;
            case 1:
                return value !== _Categary;
            case 2:
                return value === _Categary;
        }
    };
    //caculate the extrudeHeight of entity
    SettingComponent.prototype.ExtrudeHeight = function (value, _ExtrudeMax, _ExtrudeMin, _Invert) {
        var diff;
        if (_ExtrudeMin < 0) {
            diff = Math.abs(_ExtrudeMin);
        }
        else {
            diff = 0;
        }
        if (value > _ExtrudeMax) {
            value = _ExtrudeMax;
        }
        if (value < _ExtrudeMin) {
            value = _ExtrudeMin;
        }
        switch (_Invert) {
            case true:
                return _ExtrudeMax - value;
            case false:
                return value;
        }
    };
    SettingComponent.prototype.colorByNum = function (entity, max, min, _ColorKey, _ChromaScale) {
        if (entity.properties[_ColorKey] !== undefined) {
            var texts = entity.properties[_ColorKey]._value;
            var rgb = _ChromaScale(Number(((max - texts) / (max - min)).toFixed(2)))._rgb;
            if (entity.polygon !== undefined) {
                entity.polygon.material = Cesium.Color.fromBytes(rgb[0], rgb[1], rgb[2]);
            }
            if (entity.polyline !== undefined) {
                var newColor = new Cesium.Color.fromBytes(rgb[0], rgb[1], rgb[2]);
                entity.polyline.material.color.setValue(newColor);
            }
            if (entity.point !== undefined) {
                var newColor = new Cesium.Color.fromBytes(rgb[0], rgb[1], rgb[2]);
                entity.point.color = newColor;
            }
        }
        else {
            if (entity.polygon !== undefined) {
                entity.polygon.material = Cesium.Color.LIGHTSLATEGRAY.withAlpha(1);
            }
            if (entity.polyline !== undefined) {
                entity.polyline.material = Cesium.Color.LIGHTSLATEGRAY.withAlpha(1);
            }
            if (entity.point !== undefined) {
                entity.point.color = Cesium.Color.LIGHTSLATEGRAY.withAlpha(1);
            }
        }
    };
    SettingComponent.prototype.colorByCat = function (entity, _ColorText, _ColorKey, _ChromaScale) {
        if (entity.properties[_ColorKey] !== undefined) {
            var initial = false;
            for (var j = 0; j < _ColorText.length; j++) {
                if (entity.properties[_ColorKey]._value === _ColorText[j]) {
                    var rgb = _ChromaScale(1 - (j / _ColorText.length));
                    if (entity.polygon !== undefined) {
                        entity.polygon.material = Cesium.Color.fromBytes(rgb._rgb[0], rgb._rgb[1], rgb._rgb[2]);
                    }
                    if (entity.polyline !== undefined) {
                        var newColor = new Cesium.Color.fromBytes(rgb[0], rgb[1], rgb[2]);
                        entity.polyline.material.color.setValue(newColor);
                    }
                    if (entity.point !== undefined) {
                        var newColor = new Cesium.Color.fromBytes(rgb[0], rgb[1], rgb[2]);
                        entity.point.color = newColor;
                    }
                    initial = true;
                }
            }
            if (initial === false) {
                if (entity.polygon !== undefined) {
                    entity.polygon.material = Cesium.Color.LIGHTSLATEGRAY.withAlpha(1);
                }
                if (entity.polyline !== undefined) {
                    entity.polyline.material = Cesium.Color.LIGHTSLATEGRAY.withAlpha(1);
                }
                if (entity.point !== undefined) {
                    entity.point.color = Cesium.Color.LIGHTSLATEGRAY.withAlpha(1);
                }
            }
        }
        else {
            if (entity.polygon !== undefined) {
                entity.polygon.material = Cesium.Color.LIGHTSLATEGRAY.withAlpha(1);
            }
            if (entity.polyline !== undefined) {
                entity.polyline.material = Cesium.Color.LIGHTSLATEGRAY.withAlpha(1);
            }
            if (entity.point !== undefined) {
                entity.point.color = Cesium.Color.LIGHTSLATEGRAY.withAlpha(1);
            }
        }
    };
    SettingComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: "app-setting-cesium",
            template: __webpack_require__(/*! ./setting.component.html */ "./src/app/mViewer/viewers/mobius-cesium/setting/setting.component.html"),
            styles: [__webpack_require__(/*! ./setting.component.css */ "./src/app/mViewer/viewers/mobius-cesium/setting/setting.component.css")],
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]])
    ], SettingComponent);
    return SettingComponent;
}(_data_DataSubscriber__WEBPACK_IMPORTED_MODULE_1__["DataSubscriber"]));



/***/ }),

/***/ "./src/app/mViewer/viewers/mobius-cesium/setting/visualise.component.css":
/*!*******************************************************************************!*\
  !*** ./src/app/mViewer/viewers/mobius-cesium/setting/visualise.component.css ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#SettingView{\r\n  position: relative;\r\n  padding:0px;\r\n  height: 100%;\r\n  width: 100%;\r\n  color:#D3D3D3 !important;\r\n  font-family: Roboto,\"Helvetica Neue\",sans-serif;\r\n  font-size: 14px !important;\r\n  line-height: 14px;\r\n  overflow-x: hidden !important;\r\n  background-color: rgba(20,20,20,0.9);\r\n  overflow-y:overlay;\r\n}\r\n/deep/.mat-tab-label, /deep/.mat-tab-label-active{\r\n  min-width: 60px!important;\r\n  padding: 3px!important;\r\n  margin: 3px!important;\r\n  color:#D3D3D3 !important;\r\n  background-color: transparent !important;\r\n}\r\n/deep/.mat-tab-label{\r\n  height: 30px !important;\r\n  width: 60px !important;\r\n  background-color: transparent !important;\r\n}\r\n/deep/.mat-tab-labels{\r\n  background-color: rgba(20,20,20,0.9) !important;\r\n}\r\n/deep/.mat-tab-header{\r\n  width: 700px !important;\r\n}\r\n/deep/.mat-tab-header-pagination-controls-enabled{\r\n  display: none !important;\r\n}\r\n/deep/.mat-ink-bar{\r\n  background-color: #395d73 !important;\r\n}\r\n/deep/.mat-tab{\r\n  min-width: 30px !important;\r\n}\r\n/deep/.mat-tab-body-content{\r\n  overflow: hidden !important;\r\n}\r\n/deep/.mat-header{\r\n  flex-direction: row;\r\n  font-family: Roboto,\"Helvetica Neue\",sans-serif;\r\n  margin-left: 0px;\r\n  color:#395d73;\r\n  border: 0;\r\n  height: 20px;\r\n  background-color: rgba(20,20,20,0.9) !important;\r\n}\r\n/deep/.mat-tab-body-wrapper{\r\n  height:100% !important;\r\n\r\n}\r\n/deep/split-gutter{\r\n  background-color:rgb(138, 168, 192) !important;\r\n}\r\n/deep/.mat-accent .mat-slider-thumb {\r\n    background-color: #8AA8C0 !important;\r\n    cursor: -webkit-grab;\r\n}\r\n/deep/.mat-slider-thumb{\r\n  width: 5px !important;\r\n  right: -5px !important;\r\n}\r\n/deep/.mat-slider-track-fill{\r\n  background-color: #F0BFA0 !important;\r\n}\r\n/deep/.mat-slider-thumb-label-text {\r\n    color: #8AA8C0 !important;\r\n    font-size: 12px !important;\r\n}\r\n/deep/.mat-slider-thumb-label{\r\n    height: 15px !important;\r\n    width: 15px !important;\r\n    top: -20px !important;\r\n    right: -7px !important;\r\n    background-color: white !important;\r\n    border: 1px solid #8AA8C0 !important;\r\n}\r\n/deep/.mat-slider-track-background{\r\n  background-color: #D3D3D3 !important;\r\n}\r\n.mat-slider{\r\n    width: 150px !important;\r\n}\r\n.cesium-button {\r\n  display: inline-block;\r\n  position: relative;\r\n  border: 1px solid #8AA8C0;\r\n  color: #D3D3D3;\r\n  fill: #8AA8C0;\r\n  border-radius: 0px;\r\n  padding: 3px 0px;\r\n  margin: 0px 0px;\r\n  cursor: pointer;\r\n  overflow: hidden;\r\n  -moz-user-select: none;\r\n  -webkit-user-select: none;\r\n  -ms-user-select: none;\r\n  user-select: none;\r\n  width: 80px;\r\n  font-family:sans-serif !important;\r\n  background: transparent;\r\n}\r\n.cesium-button-select{\r\n  display: inline-block;\r\n  position: relative;\r\n  border: 1px solid #8AA8C0;\r\n  fill: #8AA8C0;\r\n  border-radius: 0px;\r\n  padding: 3px 0px;\r\n  margin: 0px 0px;\r\n  cursor: pointer;\r\n  overflow: hidden;\r\n  -moz-user-select: none;\r\n  -webkit-user-select: none;\r\n  -ms-user-select: none;\r\n  user-select: none;\r\n  width: 80px;\r\n  font-family:sans-serif !important;\r\n  color: #D3D3D3;\r\n  background: transparent;\r\n}\r\n.cesium-option{\r\n  background-color: #F1F1F1;\r\n  /*opacity: 0.8;*/\r\n  color: #8AA8C0;\r\n  border: 1px solid #8AA8C0;\r\n}\r\nhr {\r\n  display: block;\r\n  height: 1px;\r\n  border: 0;\r\n  border-top: 1px solid #D3D3D3 !important;\r\n  padding: 0; \r\n  color:#D3D3D3 !important;\r\n  width: 100%;\r\n  background-color: #8AA8C0 !important;\r\n}\r\n"

/***/ }),

/***/ "./src/app/mViewer/viewers/mobius-cesium/setting/visualise.component.html":
/*!********************************************************************************!*\
  !*** ./src/app/mViewer/viewers/mobius-cesium/setting/visualise.component.html ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"SettingView\" >\r\n    <table>\r\n      <tr>\r\n      <th class=\"colorkey\" style=\"width: 80px\"><div class=\"Hide\" style=\"width: 80px;color:#D3D3D3 !important;border:0;text-align: left;font-weight: normal;\">Color</div></th>\r\n      <th><div>\r\n        <select class=\"cesium-button\" (change)=\"onChangeColor($event.target.value)\" [ngModel]=\"_ColorKey\">\r\n          <option class=\"cesium-option\"  *ngFor=\"let ColorName of _ColorProperty\" value={{ColorName}}>{{ColorName}}</option>\r\n        </select>\r\n      </div></th>\r\n      </tr>\r\n      </table>\r\n      <table>\r\n      <tr ><th style=\"width:80px;height: 25px;\"><div style=\"width: 80px;color:#D3D3D3 !important;font-weight: normal;text-align: left;border:0;\">Min</div></th>\r\n      <th style=\"width:80px;height: 18px;\"><input type=\"text\"  value={{_ColorMin}} style=\"width:80px;height: 18px;background:transparent;color:#D3D3D3;border:1px solid #8AA8C0;font-weight: normal;text-align: left;\" (change)=\"changeColorMin($event.target.value)\"></th></tr>  \r\n      </table>\r\n      <table >\r\n      <tr ><th style=\"width:80px;\"><div style=\"width: 80px;color:#D3D3D3 !important;font-weight: normal;text-align: left;border:0;\">Max</div></th>\r\n      <th style=\"width:80px;height: 18px;\"><input type=\"text\" value={{_ColorMax}} style=\"width: 80px;height: 18px;background:transparent;color:#D3D3D3;border:1px solid #8AA8C0;font-weight: normal;text-align: left;\" (change)=\"changeColorMax($event.target.value)\"></th></tr>\r\n  </table>\r\n    <table>\r\n      <tr ><th style=\"width:80px;height: 25px;\"><div style=\"width: 80px;color:#D3D3D3 !important;font-weight: normal;text-align: left;border:0;\">Invert</div></th>\r\n      <th style=\"width:80px;height: 25px;\"><div style=\"width:80px;color:#D3D3D3 !important;font-weight: normal;text-align: left;border:0;\"><input type=\"checkbox\" [checked]=\"_ColorInvert\" (click)=\"changeColorInvert()\"></div></th></tr>\r\n    </table>\r\n    <hr>\r\n      <table>\r\n      <tr>\r\n      <th class=\"colorkey\" style=\"width: 80px\"><div class=\"Hide\" style=\"width: 80px;color:#D3D3D3 !important;border:0;text-align: left;font-weight: normal;\">Extrude</div></th>\r\n      <th><div>\r\n        <select class=\"cesium-button\" (change)=\"onChangeHeight($event.target.value)\" [ngModel]=\"_ExtrudeKey\">\r\n           <option class=\"cesium-option\"  *ngFor=\"let Height of _ExtrudeProperty\" value={{Height}}>{{Height}}</option>\r\n        </select>\r\n      </div></th>\r\n      </tr>\r\n    </table>\r\n    <table>\r\n      <tr ><th style=\"width:80px;height: 25px;\"><div style=\"width: 80px;color:#D3D3D3 !important;font-weight: normal;text-align: left;border:0;\">Min</div></th>\r\n      <th style=\"width:80px;height: 18px;\"><input type=\"text\"  value={{_ExtrudeMin}} style=\"width:80px;height: 18px;background:transparent;color:#D3D3D3;border:1px solid #8AA8C0;font-weight: normal;text-align: left\" (change)=\"changeHeightMin($event.target.value)\"></th></tr>  \r\n      </table>\r\n      <table >\r\n      <tr ><th style=\"width:80px;\"><div style=\"width: 80px;color:#D3D3D3 !important;font-weight: normal;text-align: left;border:0;\">Max</div></th>\r\n      <th style=\"width:80px;height: 18px;\"><input type=\"text\" value={{_ExtrudeMax}} style=\"width: 80px;height: 18px;background:transparent;color:#D3D3D3;border:1px solid #8AA8C0;font-weight: normal;text-align: left;\" (change)=\"changeHeightMax($event.target.value)\"></th></tr>\r\n  </table>\r\n   <table>\r\n      <tr ><th style=\"width:80px;height: 25px;\"><div style=\"width: 80px;color:#D3D3D3 !important;font-weight: normal;text-align: left;border:0;\">Scale</div></th>\r\n      <th style=\"width:80px;height: 18px;\"><input type=\"text\" value={{_Scale}} style=\"width:80px;height: 18px;background:transparent;color:#D3D3D3;border:1px solid #8AA8C0;font-weight: normal;text-align: left;\" (change)=\"changescale($event.target.value)\" ></th></tr>\r\n      <tr ><th style=\"width:80px;height: 25px;\"><div style=\"width: 80px;color:#D3D3D3 !important;font-weight: normal;text-align: left;border:0;\">Invert</div></th>\r\n      <th style=\"width:80px;height: 25px;\"><div style=\"width:80px;color:#D3D3D3 !important;font-weight: normal;text-align: left;border:0;\"><input type=\"checkbox\" [checked]=\"_Invert\" (click)=\"changeopp()\"></div></th></tr>\r\n      <tr ><th style=\"width:80px;height: 25px;\"><div style=\"width: 80px;color:#D3D3D3 !important;font-weight: normal;text-align: left;border:0;\">Height Chart</div></th>\r\n      <th style=\"width:80px;height: 25px;\"><div style=\"width:80px;color:#D3D3D3 !important;font-weight: normal;text-align: left;border:0;\"><input type=\"checkbox\" [checked]=\"_HeightChart\" (click)=\"changeExtrude();\"></div></th></tr>  \r\n  </table>\r\n  <hr>\r\n  <table>\r\n    <tr>\r\n    <th class=\"colorkey\" style=\"width: 75px;height: 25px;\"><div class=\"Hide\" style=\"width: 75px;height: 25;color:#D3D3D3 !important;border-color:#395d73;border:0;text-align: left;font-weight: normal;\"><input type=\"button\" value=\"Add Filter\" style=\"color:#D3D3D3;border:1px solid #8AA8C0;width: 75px;height: 25px;background-color: transparent;cursor:pointer;\" (click)=\"addHide()\"></div></th>\r\n    <th style=\"width:20px;height: 22px;\"><div style=\"width:20px;height: 22px;margin-left: 10px\">\r\n      <select class=\"cesium-button-select\"  (change)=\"ChangeHeight($event.target.value)\">\r\n         <option class=\"cesium-option\"  *ngFor=\"let ColorName of _ColorProperty\" value={{ColorName}}>{{ColorName}}</option>\r\n      </select></div></th>\r\n    </tr>\r\n  </table>\r\n  <div class=\"hide-container\" style=\"margin-top:5px;\">\r\n    <div *ngFor=\"let item of _Filter;\" id={{item.divid}}>\r\n  <table>\r\n    <tr ><th style=\"width:85px;height: 22px;\"><div style=\"width:85px;color:#D3D3D3 !important;text-align: left;vertical-align: middle;font-weight: normal;\">{{item.HeightHide}}</div></th>\r\n    <th *ngIf=\"item.type === 'number'\" style=\"width:40px;height: 22px;\"><div style=\"width:40px;height: 22px;\">\r\n      <select class=\"cesium-button-select\" [ngModel]=\"item.RelaHide\" (change)=\"Changerelation($event.target.value,item.id)\" style=\"width:40px;height: 22px;\">\r\n         <option class=\"cesium-option\" value=0>></option>\r\n         <option class=\"cesium-option\" value=1><</option>\r\n         <option class=\"cesium-option\" value=2>=</option>\r\n      </select></div></th>\r\n      <th *ngIf=\"item.type === 'category'\" style=\"width:40px;height: 22px;\"><div style=\"width:40px;height: 22px;\">\r\n      <select class=\"cesium-button-select\" [ngModel]=\"item.RelaHide\" (change)=\"ChangeCategory($event.target.value,item.id,0)\" style=\"width:40px;height: 22px;\">\r\n        <option class=\"cesium-option\" value=0>none</option>\r\n        <option class=\"cesium-option\" value=1>=</option>\r\n        <option class=\"cesium-option\" value=2>!=</option>\r\n      </select></div></th>\r\n      <th *ngIf=\"item.type === 'number'\" style=\"width:70px;height: 20px;\"><input type=\"text\" id={{item.id}} value={{item.textHide}} (change)=\"Changetext($event.target.value,item.id)\" style=\"width:70px;height: 20px;background:transparent;color:#D3D3D3;border:1px solid #8AA8C0;\"></th>\r\n      <th *ngIf=\"item.type === 'category'\" style=\"width:73px;height: 22px;\"><div style=\"width:73px;height: 22px;\">\r\n      <select class=\"cesium-button-select\" [ngModel]=\"item.CategaryHide\" (change)=\"ChangeCategory($event.target.value,item.id,1)\" style=\"width:73px;height: 22px;\">\r\n        <option class=\"cesium-option\" *ngFor=\"let caty of item.Category\" value={{caty}}>{{caty}}</option>\r\n      </select></div></th>\r\n    <th style=\"width:20px;height: 22px;\" id={{item.id}}><span id={{item.id}} (click)=\"deleteHide(item.id)\" style=\"width:20px;height: 22px;cursor:pointer;\"><i class=\"material-icons\" style=\"color:#D3D3D3;font-size:16px\">delete</i></span></th>\r\n    <th style=\"width:20px;height: 25px;\" id={{item.id}}><input type=\"checkbox\" id={{item.id}} checked=\"checked\" (click)=\"Disable(item.id)\" tyle=\"width:20px;height: 25px;cursor:pointer;\"></th></tr>\r\n  </table>\r\n  <table>\r\n    <tr>\r\n    <th *ngIf=\"item.type === 'number'\" style=\"width:50px;height: 25px;vertical-align: top;padding-top: 10px;\"><div style=\"font-weight: normal;display: inline-block;color:#D3D3D3 !important;width:30px;\">{{item.HideMin}}</div></th>\r\n    <th *ngIf=\"item.type === 'number'\" style=\"width:150px;height: 22px;\"><div style=\"font-weight: normal;display: inline-block;width:150px;\"><mat-slider class=\"slider\" name=\"range\" id=\"0\" min={{item.HideMin}} max={{item.HideMax}} step=0.01 thumbLabel=true value={{item.textHide}} #textscale (change)=\"Changetext(textscale.value.toPrecision(2),item.id)\" >\r\n    </mat-slider></div></th>\r\n    <th *ngIf=\"item.type === 'number'\" style=\"width:50px;height: 25px;vertical-align: top;padding-top: 10px;\"><div style=\"font-weight: normal;display: inline-block;color:#D3D3D3 !important;width:30px;text-align: left;\">{{item.HideMax}}</div></th></tr>\r\n  </table><hr>\r\n    </div>\r\n  </div>\r\n  </div>\r\n  "

/***/ }),

/***/ "./src/app/mViewer/viewers/mobius-cesium/setting/visualise.component.ts":
/*!******************************************************************************!*\
  !*** ./src/app/mViewer/viewers/mobius-cesium/setting/visualise.component.ts ***!
  \******************************************************************************/
/*! exports provided: DataComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataComponent", function() { return DataComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _data_DataSubscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../data/DataSubscriber */ "./src/app/mViewer/viewers/mobius-cesium/data/DataSubscriber.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var DataComponent = /** @class */ (function (_super) {
    __extends(DataComponent, _super);
    function DataComponent(injector, myElement) {
        var _this = _super.call(this, injector) || this;
        _this._CheckDisable = true;
        return _this;
    }
    DataComponent.prototype.ngOnInit = function () {
        this.dataArr = this.dataService.get_ViData();
        if (this.dataArr !== undefined) {
            this.LoadData();
        }
    };
    DataComponent.prototype.notify = function (message) {
        if (message === "model_update") {
            try {
                this.dataArr = this.dataService.get_ViData();
                if (this.dataArr !== undefined) {
                    this.LoadData();
                }
            }
            catch (ex) {
                console.log(ex);
            }
        }
    };
    //load data
    DataComponent.prototype.LoadData = function () {
        this._ColorProperty = this.dataArr["ColorProperty"];
        this._ColorKey = this.dataArr["ColorKey"];
        this._ColorMax = this.dataArr["ColorMax"];
        this._ColorMin = this.dataArr["ColorMin"];
        this._ColorInvert = this.dataArr["ColorInvert"];
        this._ExtrudeProperty = this.dataArr["ExtrudeProperty"];
        this._ExtrudeKey = this.dataArr["ExtrudeKey"];
        this._ExtrudeMax = this.dataArr["ExtrudeMax"];
        this._ExtrudeMin = this.dataArr["ExtrudeMin"];
        this._HeightChart = this.dataArr["HeightChart"];
        this._Invert = this.dataArr["Invert"];
        this._Scale = this.dataArr["Scale"];
        this._Filter = this.dataArr["Filter"];
        this._HideNum = this.dataArr["HideNum"];
    };
    //change color property in editor version
    DataComponent.prototype.onChangeColor = function (value) {
        this.dataArr["ColorKey"] = value;
        var promise = this.dataService.getcesiumpromise();
        var _Colortexts = [];
        var self = this;
        promise.then(function (dataSource) {
            var entities = dataSource.entities.values;
            for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
                var entity = entities_1[_i];
                if (entity.properties[value] !== undefined) {
                    if (entity.properties[value]._value !== " ") {
                        if (_Colortexts.length === 0) {
                            _Colortexts[0] = entity.properties[value]._value;
                        }
                        else {
                            if (_Colortexts.indexOf(entity.properties[value]._value) === -1) {
                                _Colortexts.push(entity.properties[value]._value);
                            }
                        }
                    }
                }
            }
        });
        this.dataArr["ColorMin"] = Math.min.apply(Math, _Colortexts);
        this.dataArr["ColorMax"] = Math.max.apply(Math, _Colortexts);
        this.dataArr["ColorText"] = _Colortexts.sort();
        this.dataService.set_ViData(this.dataArr);
        this.LoadData();
    };
    //change color min in editor version
    DataComponent.prototype.changeColorMin = function (_Min) {
        this.dataArr["ColorMin"] = Number(_Min);
        this._ColorMin = this.dataArr["ColorMin"];
        this.dataService.set_ViData(this.dataArr);
    };
    //change color max in editor version
    DataComponent.prototype.changeColorMax = function (_Max) {
        this.dataArr["ColorMax"] = Number(_Max);
        this._ColorMax = this.dataArr["ColorMax"];
        this.dataService.set_ViData(this.dataArr);
    };
    //change color invert in editor version
    DataComponent.prototype.changeColorInvert = function () {
        this._ColorInvert = !this._ColorInvert;
        this.dataArr["ColorInvert"] = this._ColorInvert;
        this.dataService.set_ViData(this.dataArr);
    };
    //change extrudeheight property in editor version
    DataComponent.prototype.onChangeHeight = function (value) {
        this.dataArr["ExtrudeKey"] = value;
        var promise = this.dataService.getcesiumpromise();
        var _Heighttexts = [];
        var self = this;
        promise.then(function (dataSource) {
            var entities = dataSource.entities.values;
            for (var _i = 0, entities_2 = entities; _i < entities_2.length; _i++) {
                var entity = entities_2[_i];
                if (entity.properties[value] !== undefined) {
                    if (entity.properties[value]._value !== " ") {
                        if (_Heighttexts.length === 0) {
                            _Heighttexts[0] = entity.properties[value]._value;
                        }
                        else {
                            if (_Heighttexts.indexOf(entity.properties[value]._value) === -1) {
                                _Heighttexts.push(entity.properties[value]._value);
                            }
                        }
                    }
                }
            }
        });
        this.dataArr["ExtrudeMin"] = Math.min.apply(Math, _Heighttexts);
        this.dataArr["ExtrudeMax"] = Math.max.apply(Math, _Heighttexts);
        this.dataArr["ExtrudeText"] = _Heighttexts.sort();
        this.dataService.set_ViData(this.dataArr);
        this.LoadData();
    };
    //change extrudeheight min in editor version
    DataComponent.prototype.changeHeightMin = function (_Min) {
        this.dataArr["ExtrudeMin"] = Number(_Min);
        this._ExtrudeMin = this.dataArr["ExtrudeMin"];
        this.dataService.set_ViData(this.dataArr);
    };
    //change extrudeHeight max in editor version
    DataComponent.prototype.changeHeightMax = function (_Max) {
        this.dataArr["ExtrudeMax"] = Number(_Max);
        this._ExtrudeMax = this.dataArr["ExtrudeMax"];
        this.dataService.set_ViData(this.dataArr);
    };
    //change scale in editor version
    DataComponent.prototype.changescale = function (_ScaleValue) {
        this.dataArr["Scale"] = Number(_ScaleValue);
        this._Scale = this.dataArr["Scale"];
        this.dataService.set_ViData(this.dataArr);
    };
    //change extrudeheight invert in editor version
    DataComponent.prototype.changeopp = function () {
        this._Invert = !this._Invert;
        this.dataArr["Invert"] = this._Invert;
        this.dataService.set_ViData(this.dataArr);
    };
    //change heightChart in editor version
    DataComponent.prototype.changeExtrude = function () {
        this._HeightChart = !this._HeightChart;
        this.dataArr["HeightChart"] = this._HeightChart;
        this.dataService.set_ViData(this.dataArr);
    };
    //add filter in editor version
    DataComponent.prototype.addHide = function () {
        var lastnumber;
        if (this.dataArr["HideNum"] !== undefined) {
            this._HideNum = this.dataArr["HideNum"];
            this._Filter = this.dataArr["Filter"];
        }
        if (this._HideNum === null || this._HideNum.length === 0) {
            this._HideNum[0] = "0";
            lastnumber = this._HideNum[0];
        }
        else {
            for (var i = 0; i < this._HideNum.length + 1; i++) {
                if (this._HideNum.indexOf(String(i)) === -1) {
                    this._HideNum.push(String(i));
                    lastnumber = String(i);
                    break;
                }
            }
        }
        if (this._HideValue === undefined) {
            this._HideValue = this._ColorProperty[0];
        }
        var texts = this.Initial(this._HideValue);
        var _HideType;
        if (typeof (texts[0]) === "number") {
            _HideType = "number";
        }
        else if (typeof (texts[0]) === "string") {
            _HideType = "category";
        }
        this._Filter.push({ divid: String("addHide".concat(String(lastnumber))), id: lastnumber,
            HeightHide: this._HideValue, type: _HideType, Category: texts, CategaryHide: texts[0],
            RelaHide: 0, textHide: Math.round(Math.min.apply(Math, texts) * 100) / 100,
            HideMax: Math.ceil(Math.max.apply(Math, texts)),
            HideMin: Math.round(Math.min.apply(Math, texts) * 100) / 100, Disabletext: null });
        this.dataArr["Filter"] = this._Filter;
        this.dataArr["HideNum"] = this._HideNum;
        this.dataService.set_ViData(this.dataArr);
    };
    //delete filter in editor version
    DataComponent.prototype.deleteHide = function (event) {
        var index = this._HideNum.indexOf(event);
        var divid = String("addHide".concat(String(event)));
        var addHide = document.getElementById(divid);
        var hidecontainer = document.getElementsByClassName("hide-container")[0];
        hidecontainer.removeChild(addHide);
        if (this._Filter[index].type === "number") {
            if (this._Filter[index].RelaHide === "0" || this._Filter[index].RelaHide === 0) {
                this._Filter[index].textHide = this._Filter[index].HideMin;
            }
            if (this._Filter[index].RelaHide === "1" || this._Filter[index].RelaHide === 1) {
                this._Filter[index].textHide = this._Filter[index].HideMax;
            }
        }
        else if (this._Filter[index].type === "category") {
            this._Filter[index].RelaHide = 0;
        }
        this._Filter.splice(index, 1);
        this._HideNum.splice(index, 1);
        this.dataArr["Filter"] = this._Filter;
        this.dataArr["HideNum"] = this._HideNum;
        this.dataService.set_ViData(this.dataArr);
    };
    //change disable button in filter
    DataComponent.prototype.Disable = function (event) {
        var index = this._HideNum.indexOf(event);
        var divid = String("addHide".concat(String(event)));
        var addHide = document.getElementById(divid);
        if (this._Filter[index].Disabletext === null) {
            this._CheckDisable = false;
        }
        else {
            this._CheckDisable = true;
        }
        if (this._CheckDisable === false) {
            if (this._Filter[index].type === "number") {
                var textHide = this._Filter[index].textHide;
                this._Filter[index].Disabletext = Number(textHide);
                if (this._Filter[index].RelaHide === "0" || this._Filter[index].RelaHide === 0) {
                    this._Filter[index].textHide = this._Filter[index].HideMin;
                }
                if (this._Filter[index].RelaHide === "1" || this._Filter[index].RelaHide === 1) {
                    this._Filter[index].textHide = this._Filter[index].HideMax;
                }
            }
            else if (this._Filter[index].type === "category") {
                var textHide = this._Filter[index].RelaHide;
                this._Filter[index].Disabletext = Number(textHide);
                this._Filter[index].RelaHide = 0;
            }
        }
        else {
            if (this._Filter[index].type === "number") {
                this._Filter[index].textHide = this._Filter[index].Disabletext;
                this._Filter[index].Disabletext = null;
            }
            else if (this._Filter[index].type === "category") {
                this._Filter[index].RelaHide = this._Filter[index].Disabletext;
                this._Filter[index].Disabletext = null;
            }
        }
        this.dataArr["Filter"] = this._Filter;
        this.dataArr["HideNum"] = this._HideNum;
        this.dataService.set_ViData(this.dataArr);
    };
    //change height slider in filter
    DataComponent.prototype.ChangeHeight = function (_HeightHide) {
        this._HideValue = _HeightHide;
    };
    //change relation in filter
    DataComponent.prototype.Changerelation = function (_RelaHide, id) {
        var index = this._HideNum.indexOf(id);
        var HeightHide = this._Filter[index].HeightHide;
        this._Filter[index].RelaHide = _RelaHide;
        var texts = [];
        var promise = this.dataService.getcesiumpromise();
        var self = this;
        promise.then(function (dataSource) {
            var entities = dataSource.entities.values;
            for (var _i = 0, entities_3 = entities; _i < entities_3.length; _i++) {
                var entity = entities_3[_i];
                if (entity.properties[HeightHide] !== undefined) {
                    if (entity.properties[HeightHide]._value !== " ") {
                        if (texts.length === 0) {
                            texts[0] = entity.properties[HeightHide]._value;
                        }
                        else {
                            if (texts.indexOf(entity.properties[HeightHide]._value) === -1) {
                                texts.push(entity.properties[HeightHide]._value);
                            }
                        }
                    }
                }
            }
        });
        this._Filter[index].HideMax = Math.ceil(Math.max.apply(Math, texts));
        this._Filter[index].HideMin = Math.round(Math.min.apply(Math, texts) * 100) / 100;
        if (_RelaHide === "0" || _RelaHide === 0) {
            this._Filter[index].textHide = this._Filter[index].HideMin;
        }
        if (_RelaHide === "1" || _RelaHide === 1) {
            this._Filter[index].textHide = this._Filter[index].HideMax;
        }
    };
    //change category in filter
    DataComponent.prototype.ChangeCategory = function (categary, id, type) {
        var index = this._HideNum.indexOf(id);
        if (type === 1) {
            this._Filter[index].CategaryHide = categary;
        }
        if (type === 0) {
            this._Filter[index].RelaHide = Number(categary);
        }
    };
    //change text in filter
    DataComponent.prototype.Changetext = function (value, id) {
        var index = this._HideNum.indexOf(id);
        this._Filter[index].textHide = value;
    };
    //get text according to property
    DataComponent.prototype.Initial = function (_HideValue) {
        var texts = [];
        var promise = this.dataService.getcesiumpromise();
        var self = this;
        promise.then(function (dataSource) {
            var entities = dataSource.entities.values;
            for (var _i = 0, entities_4 = entities; _i < entities_4.length; _i++) {
                var entity = entities_4[_i];
                if (entity.properties[_HideValue] !== undefined) {
                    if (entity.properties[_HideValue]._value !== " ") {
                        if (texts.length === 0) {
                            texts[0] = entity.properties[_HideValue]._value;
                        }
                        else {
                            if (texts.indexOf(entity.properties[_HideValue]._value) === -1) {
                                texts.push(entity.properties[_HideValue]._value);
                            }
                        }
                    }
                }
            }
        });
        return texts;
    };
    DataComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: "app-data",
            template: __webpack_require__(/*! ./visualise.component.html */ "./src/app/mViewer/viewers/mobius-cesium/setting/visualise.component.html"),
            styles: [__webpack_require__(/*! ./visualise.component.css */ "./src/app/mViewer/viewers/mobius-cesium/setting/visualise.component.css")],
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]])
    ], DataComponent);
    return DataComponent;
}(_data_DataSubscriber__WEBPACK_IMPORTED_MODULE_1__["DataSubscriber"]));



/***/ }),

/***/ "./src/app/mViewer/viewers/mobius-cesium/viewer/viewer.component.css":
/*!***************************************************************************!*\
  !*** ./src/app/mViewer/viewers/mobius-cesium/viewer/viewer.component.css ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "body{\r\n  background: red;\r\n}\r\n#cesiumContainer{\r\n height: 100%;\r\n width: 100%; \r\n font-family: sans-serif !important;\r\n margin: 0px !important;\r\n padding: 0px !important;\r\n font-size: 14px;\r\n}\r\n#ColorBar{\r\n  z-index:99;\r\n  margin: 5px;\r\n  width: 100%;\r\n  padding: 2px 5px;\r\n  position: absolute;\r\n  display:inline-block;\r\n  bottom: 7%;\r\n  overflow: hidden !important;\r\n  text-overflow: ellipsis !important;\r\n  table-layout:fixed !important;\r\n  white-space: nowrap !important;\r\n}\r\n#ColorKey{\r\n  z-index:99;\r\n  margin: 5px;\r\n  width: 100%;\r\n  padding: 2px 5px;\r\n  position: absolute;\r\n  display:inline-block;\r\n  bottom: 2%;\r\n  overflow: hidden !important;\r\n  text-overflow: ellipsis !important;\r\n  table-layout:fixed !important;\r\n  white-space: nowrap !important;\r\n}\r\n#Download{\r\n  z-index: 99;\r\n  top: 5px;\r\n  position: absolute;\r\n  right: 120px;\r\n  width: 32px;\r\n  height: 32px;\r\n  font-size: 16px;\r\n  box-sizing: border-box;\r\n  border-radius: 14%;\r\n  padding: 0;\r\n  vertical-align: middle;\r\n}\r\n\r\n"

/***/ }),

/***/ "./src/app/mViewer/viewers/mobius-cesium/viewer/viewer.component.html":
/*!****************************************************************************!*\
  !*** ./src/app/mViewer/viewers/mobius-cesium/viewer/viewer.component.html ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"cesiumContainer\" (click)=\"select();showAttribs($event)\" (mousemove)=\"Colortext();\">\r\n  <button class=\"cesium-button cesium-button-toolbar\" (click)=\"save_geojson()\" id=\"Download\"><i class=\"fa fa-download\"></i></button>\r\n  <div id=\"ColorBar\" *ngIf=\"texts!==undefined\">\r\n  \t<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" bordercolor=\"#d0d0d0\" style=\"width: 88%;margin-left: 9%\">\r\n       <tr >\r\n          <th *ngFor=\"let text of texts;\" style=\"text-align:right;width: 7%\"><div  style=\"width: 8%;vertical-align: text-top;color:white;text-shadow: 0px 0px 3px black;\">{{text}}</div></th>\r\n        </tr>\r\n    </table>\r\n\t<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" bordercolor=\"#d0d0d0\" style=\"width: 80%;margin: 0 auto;\">\r\n       <tr>\r\n          <th  *ngFor=\"let color of _Colorbar;let indx=index\" style=\"width: 0.5px;\" ><div [ngStyle]=\"{ 'background-color': color}\" ><div *ngIf=\"indx%8===0\" style=\"border-left: #FFFFFF 1px solid;border-color: black\">&nbsp;</div><div *ngIf=\"indx%8!==0\">&nbsp;</div></div></th>\r\n        </tr>\r\n    </table>\r\n  </div>\r\n  <div id=\"ColorBar\" *ngIf=\"_Cattexts!==undefined\" style=\"width: 100%;text-align: center\">\r\n    <table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" bordercolor=\"#d0d0d0\" *ngFor=\"let cattext of _Cattexts\" style=\"display:inline-block;overflow: hidden !important;text-overflow: ellipsis !important;table-layout:fixed !important;white-space: nowrap !important; \">\r\n          <tr >\r\n            <th  style=\"width:80px;display:inline-block;overflow: hidden !important;text-overflow: ellipsis !important;table-layout:fixed !important;white-space: nowrap !important; \"><div [ngStyle]=\"{ 'background-color': cattext.color}\" >&nbsp;&nbsp;&nbsp;</div></th>\r\n        </tr>\r\n        <tr>\r\n            <th><div matTooltip={{cattext.text}}  style=\"width:80px;text-align: left;white-space: nowrap;display:inline-block;overflow: hidden !important;text-overflow: ellipsis !important;cursor:pointer;color:white;text-shadow: 0px 0px 3px black;\">{{cattext.text}}</div></th>\r\n          </tr>\r\n        </table>\r\n  </div>\r\n  <div id=\"ColorBar\" *ngIf=\"_CatNumtexts!==undefined\" >\r\n    <table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" bordercolor=\"#d0d0d0\" style=\"width: 82%;margin: 0 auto;\">\r\n      <tr >\r\n        <th *ngFor=\"let cattext of _CatNumtexts;\" style=\"text-align:left;max-width: 3%\"><div *ngIf=\"cattext.text!==null\" style=\"width: 0.5px;vertical-align: text-top;color:white;text-shadow: 0px 0px 3px black;\">{{cattext.text}}</div><div *ngIf=\"cattext.text===null\" style=\"width: 0.5px;vertical-align: text-top;color:white;text-shadow: 0px 0px 3px black;\">&nbsp;&nbsp;&nbsp;</div></th>\r\n      </tr>\r\n    </table>\r\n    <table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" bordercolor=\"#d0d0d0\" style=\"width: 80%;margin: 0 auto;\">\r\n      <tr>\r\n        <th  *ngFor=\"let cattext of _CatNumtexts;let indx=index\" style=\"width: 0.5px;\" ><div [ngStyle]=\"{ 'background-color': cattext.color}\" ><div style=\"border-color: black\">&nbsp;</div></div></th>\r\n      </tr>\r\n    </table>\r\n  </div>\r\n  <div *ngIf=\"mode==='viewer'\" id=\"ColorKey\">\r\n    <table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" bordercolor=\"#d0d0d0\" style=\"width: 80%;margin: 0 auto;text-align:center;color:white;text-shadow: 0px 0px 3px black;\" >\r\n      <tr>\r\n        <th  style=\"width: 40%;\" ><div>Color:&nbsp;{{_ColorKey}}</div></th>\r\n        <th  style=\"width: 40%;\" ><div>Extrude:&nbsp;{{_ExtrudeKey}}</div></th>\r\n      </tr>\r\n    </table>\r\n  </div>\r\n  <div>\r\n    <table id=\"cesium-infoBox-defaultTable\" style=\"width: 140px;position:absolute;padding:4px;background-color:white;display: none;\">\r\n       <tr *ngFor=\"let pickupArr of pickupArrs\"><th style=\"font-size: 10px;font-weight: normal;color:#395d73;width: 60px;height: 14px\"><div matTooltip={{pickupArr.name}} style=\"width: 60px;height:14px;text-align: left;white-space: nowrap;display:block;overflow: hidden !important;text-overflow: ellipsis !important;cursor:pointer;\">{{pickupArr.name}}</div></th><th style=\"font-size: 10px;font-weight: normal;color:#395d73;width: 80px;height: 14px\"><div matTooltip={{pickupArr.data}} style=\"width: 80px;height:14px;text-align: left;white-space: nowrap;display:block;overflow: hidden !important;text-overflow: ellipsis !important;cursor:pointer;\">{{pickupArr.data}}</div></th></tr>\r\n       </table>\r\n        \r\n     </div>\r\n</div>"

/***/ }),

/***/ "./src/app/mViewer/viewers/mobius-cesium/viewer/viewer.component.ts":
/*!**************************************************************************!*\
  !*** ./src/app/mViewer/viewers/mobius-cesium/viewer/viewer.component.ts ***!
  \**************************************************************************/
/*! exports provided: ViewerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewerComponent", function() { return ViewerComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _data_DataSubscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../data/DataSubscriber */ "./src/app/mViewer/viewers/mobius-cesium/data/DataSubscriber.ts");
/* harmony import */ var chroma_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! chroma-js */ "./node_modules/chroma-js/chroma.js");
/* harmony import */ var chroma_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(chroma_js__WEBPACK_IMPORTED_MODULE_2__);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


// import * as d3 from "d3-array";

var ViewerComponent = /** @class */ (function (_super) {
    __extends(ViewerComponent, _super);
    function ViewerComponent(injector, myElement) {
        var _this = _super.call(this, injector) || this;
        _this.selectEntity = null;
        _this.myElement = myElement;
        return _this;
    }
    ViewerComponent.prototype.ngOnInit = function () {
        //pass mode to dataService
        this.mode = this.dataService.getmode();
        if (this.dataService.getViewer() === undefined) {
            this.CreateViewer();
        }
        //pass data to dataService
        this.data = this.dataService.getGsModel();
        //load data
        this.LoadData(this.data);
    };
    ViewerComponent.prototype.notify = function (message) {
        if (message === "model_update") {
            this.data = this.dataService.getGsModel();
            try {
                if (this.dataService.getViewer() === undefined) {
                    this.CreateViewer();
                }
                this.LoadData(this.data);
            }
            catch (ex) {
                console.log(ex);
            }
        }
    };
    //create cesium viewer and change home button funciton
    ViewerComponent.prototype.CreateViewer = function () {
        var viewer = new Cesium.Viewer("cesiumContainer", {
            infoBox: false,
            showRenderLoopErrors: false,
            orderIndependentTranslucency: false,
            baseLayerPicker: false,
            fullscreenButton: false,
            automaticallyTrackDataSourceClocks: false,
            animation: false,
            shadows: true,
            scene3DOnly: true,
        });
        viewer.scene.imageryLayers.removeAll();
        viewer.scene.globe.baseColor = Cesium.Color.GRAY;
        document.getElementsByClassName("cesium-viewer-bottom")[0].remove();
        var self = this;
        viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (e) {
            e.cancel = true;
            viewer.zoomTo(self.dataService.getcesiumpromise());
        });
        this.dataService.setViewer(viewer);
    };
    //Cesium geoJson to load data and check mode
    ViewerComponent.prototype.LoadData = function (data) {
        if (this.data !== undefined) {
            //get viewer from dataService and remove the last dataSources
            var viewer = this.dataService.getViewer();
            viewer.dataSources.removeAll({ destroy: true });
            //load geojson and add geojson to dataSources
            this.data = data;
            var promise = Cesium.GeoJsonDataSource.load(this.data);
            viewer.dataSources.add(promise);
            //check whether show colorbar or not
            promise.then(function (dataSource) {
                var entities = dataSource.entities.values;
                var self = this;
                if (entities[0].polygon !== undefined) {
                    self._ShowColorBar = true;
                }
                else {
                    self._ShowColorBar = false;
                }
            });
            // pass promise to dataService
            this.dataService.setcesiumpromise(promise);
            //check the mode and load different data
            if (this.mode === "editor") {
                this.dataService.getValue(this.data);
                this.dataService.LoadJSONData();
                this.dataArr = this.dataService.get_ViData();
                this._index = 1;
            }
            if (this.mode === "viewer") {
                this.dataService.LoadJSONData();
                this.dataArr = this.dataService.get_PuData();
                this._index = 3;
            }
            viewer.zoomTo(promise);
            this.Colortext();
        }
    };
    //create color bar and text at bottom of viewer
    ViewerComponent.prototype.Colortext = function () {
        if (this.dataArr !== undefined) {
            if (this._index !== this.dataService.get_index()) {
                this._index = this.dataService.get_index();
                if (this._index === 1) {
                    this.dataArr = this.dataService.get_ViData();
                }
                else if (this._index === 3) {
                    this.dataArr = this.dataService.get_PuData();
                }
            }
            var propertyname = this.dataArr["ColorKey"];
            var texts = this.dataArr["ColorText"].sort();
            var _Max = this.dataArr["ColorMax"];
            var _Min = this.dataArr["ColorMin"];
            if (this.mode === "viewer") {
                this._ColorKey = this.dataArr["ColorKey"];
                this._ExtrudeKey = this.dataArr["ExtrudeKey"];
            }
            this.texts = undefined;
            this._Cattexts = [];
            this._CatNumtexts = [];
            var _ColorKey = void 0;
            var _ChromaScale = chroma_js__WEBPACK_IMPORTED_MODULE_2__["scale"]("SPECTRAL");
            if (this.dataArr["ColorInvert"] === true) {
                _ChromaScale = chroma_js__WEBPACK_IMPORTED_MODULE_2__["scale"]("SPECTRAL").domain([1, 0]);
            }
            this._Colorbar = [];
            for (var i = 79; i > -1; i--) {
                this._Colorbar.push(_ChromaScale(i / 80));
            }
            if (typeof (texts[0]) === "number") {
                this.texts = [Number(_Min.toFixed(2))];
                for (var i = 1; i < 10; i++) {
                    this.texts.push(Number((_Min + (_Max - _Min) * (i / 10)).toFixed(2)));
                }
                this.texts.push(Number(_Max.toFixed(2)));
                for (var i = 0; i < this.texts.length; i++) {
                    if (this.texts[i] / 1000000000 > 1) {
                        this.texts[i] = String(Number((this.texts[i] / 1000000000).toFixed(3))).concat("B");
                    }
                    else if (this.texts[i] / 1000000 > 1) {
                        this.texts[i] = String(Number((this.texts[i] / 1000000).toFixed(3))).concat("M");
                    }
                    else if (this.texts[i] / 1000 > 1) {
                        this.texts[i] = String(Number(((this.texts[i] / 1000)).toFixed(3))).concat("K");
                    }
                }
            }
            if (typeof (texts[0]) === "string") {
                if (texts.length <= 12) {
                    for (var j = 0; j < texts.length; j++) {
                        _ColorKey = [];
                        _ColorKey.text = texts[j];
                        _ColorKey.color = _ChromaScale(1 - (j / texts.length));
                        this._Cattexts.push(_ColorKey);
                    }
                }
                else {
                    for (var j = 0; j < this._Colorbar.length; j++) {
                        _ColorKey = [];
                        if (j === 0) {
                            _ColorKey.text = texts[j];
                        }
                        else if (j === this._Colorbar.length - 1) {
                            if (texts[texts.length - 1] !== null) {
                                _ColorKey.text = texts[texts.length - 1];
                            }
                            else {
                                _ColorKey.text = texts[texts.length - 2];
                            }
                        }
                        else {
                            _ColorKey.text = null;
                        }
                        _ColorKey.color = this._Colorbar[j];
                        this._CatNumtexts.push(_ColorKey);
                    }
                }
            }
        }
        if (this._ShowColorBar === false) {
            this._Cattexts = undefined;
            this._Colorbar = undefined;
        }
    };
    //click building to select and  pass whole entity to dataService
    ViewerComponent.prototype.select = function () {
        event.stopPropagation();
        var viewer = this.dataService.getViewer(); //this.viewer;
        if (this.dataArr !== undefined) {
            if (this.selectEntity !== undefined && this.selectEntity !== null) {
                this.ColorSelect(this.selectEntity);
            }
            if (viewer.selectedEntity !== undefined && viewer.selectedEntity.polygon !== null) {
                this.dataService.set_SelectedEntity(viewer.selectedEntity);
                var material = void 0;
                if (viewer.selectedEntity.polygon !== undefined) {
                    material = viewer.selectedEntity.polygon.material;
                    viewer.selectedEntity.polygon.material = Cesium.Color.WHITE;
                }
                if (viewer.selectedEntity.polyline !== undefined) {
                    material = viewer.selectedEntity.polyline.material;
                    viewer.selectedEntity.polyline.material = Cesium.Color.WHITE;
                }
                this.selectEntity = viewer.selectedEntity;
                this.material = material;
            }
            else {
                this.dataService.set_SelectedEntity(undefined);
                this.selectEntity = undefined;
                this.material = undefined;
            }
        }
    };
    //if unselect the building, it will show the color before
    ViewerComponent.prototype.ColorSelect = function (entity) {
        var promise = this.dataService.getcesiumpromise();
        var _ColorKey = this.dataArr["ColorKey"];
        var _ColorMax = this.dataArr["ColorMax"];
        var _ColorMin = this.dataArr["ColorMin"];
        var _ColorText = this.dataArr["ColorText"];
        var _ColorInvert = this.dataArr["ColorInvert"];
        var _ExtrudeKey = this.dataArr["ExtrudeKey"];
        var _ExtrudeMax = this.dataArr["ExtrudeMax"];
        var _ExtrudeMin = this.dataArr["ExtrudeMin"];
        var _HeightChart = this.dataArr["HeightChart"];
        var _Invert = this.dataArr["Invert"];
        var _Scale = this.dataArr["Scale"];
        var _Filter = this.dataArr["Filter"];
        var _ChromaScale = chroma_js__WEBPACK_IMPORTED_MODULE_2__["scale"]("SPECTRAL");
        if (_ColorInvert === true) {
            _ChromaScale = chroma_js__WEBPACK_IMPORTED_MODULE_2__["scale"]("SPECTRAL").domain([1, 0]);
        }
        var _CheckHide;
        if (entity.properties["TYPE"] === undefined || entity.properties["TYPE"]._value !== "STATIC") {
            if (_Filter.length !== 0) {
                _CheckHide = this.Hide(_Filter, entity, _HeightChart);
                if (_CheckHide === true) {
                    if (entity.polygon !== undefined) {
                        entity.polygon.extrudedHeight = 0;
                        entity.polygon.material = Cesium.Color.LIGHTSLATEGRAY.withAlpha(1);
                        if (_HeightChart === true) {
                            if (entity.polyline !== undefined) {
                                entity.polyline.show = false;
                            }
                        }
                    }
                    if (entity.polyline !== undefined) {
                        entity.polyline.material = Cesium.Color.LIGHTSLATEGRAY.withAlpha(1);
                    }
                }
            }
            if (_Filter.length === 0 || _CheckHide === false) {
                if (_ColorKey !== "None") {
                    if (typeof (_ColorText[0]) === "number") {
                        this.colorByNum(entity, _ColorMax, _ColorMin, _ColorKey, _ChromaScale);
                    }
                    else {
                        this.colorByCat(entity, _ColorText, _ColorKey, _ChromaScale);
                    }
                }
                else {
                    entity.polygon.material = Cesium.Color.DARKGREY;
                }
            }
        }
        else {
            entity.polygon.height = entity.properties["HEIGHT"];
            entity.polygon.extrudedHeight = entity.properties["EXTRUHEIGHT"];
            var ColorValue = entity.properties["COLOR"]._value;
            entity.polygon.material = Cesium.Color.fromBytes(ColorValue[0], ColorValue[1], ColorValue[2], ColorValue[3]);
        }
    };
    //check the selected building  color before
    ViewerComponent.prototype.Hide = function (_Filter, entity, _HeightChart) {
        var _CheckHide = false;
        for (var _i = 0, _Filter_1 = _Filter; _i < _Filter_1.length; _i++) {
            var filter = _Filter_1[_i];
            var value = entity.properties[filter.HeightHide]._value;
            if (value !== undefined) {
                if (typeof (value) === "number") {
                    if (this._compare(value, Number(filter.textHide), Number(filter.RelaHide))) {
                        _CheckHide = true;
                    }
                }
                else if (typeof (value) === "string") {
                    if (this._compareCat(value, filter.CategaryHide, Number(filter.RelaHide))) {
                        _CheckHide = true;
                    }
                }
            }
        }
        return _CheckHide;
    };
    ViewerComponent.prototype._compare = function (value, slider, relation) {
        switch (relation) {
            case 0:
                return value < slider;
            case 1:
                return value > slider;
            case 2:
                return value !== slider;
        }
    };
    ViewerComponent.prototype._compareCat = function (value, _Categary, relation) {
        switch (relation) {
            case 0:
                return value === undefined;
            case 1:
                return value !== _Categary;
            case 2:
                return value === _Categary;
        }
    };
    ViewerComponent.prototype.colorByNum = function (entity, max, min, _ColorKey, _ChromaScale) {
        if (entity.properties[_ColorKey] !== undefined) {
            var texts = entity.properties[_ColorKey]._value;
            var rgb = _ChromaScale(Number(((max - texts) / (max - min)).toFixed(2)))._rgb;
            if (entity.polygon !== undefined) {
                entity.polygon.material = Cesium.Color.fromBytes(rgb[0], rgb[1], rgb[2]);
            }
            if (entity.polyline !== undefined) {
                var newColor = new Cesium.Color.fromBytes(rgb[0], rgb[1], rgb[2]);
                entity.polyline.material.color.setValue(newColor);
            }
            if (entity.point !== undefined) {
                var newColor = new Cesium.Color.fromBytes(rgb[0], rgb[1], rgb[2]);
                entity.point.color = newColor;
            }
        }
        else {
            if (entity.polygon !== undefined) {
                entity.polygon.material = Cesium.Color.LIGHTSLATEGRAY.withAlpha(1);
            }
            if (entity.polyline !== undefined) {
                entity.polyline.material = Cesium.Color.LIGHTSLATEGRAY.withAlpha(1);
            }
            if (entity.point !== undefined) {
                entity.point.color = Cesium.Color.LIGHTSLATEGRAY.withAlpha(1);
            }
        }
    };
    ViewerComponent.prototype.colorByCat = function (entity, _ColorText, _ColorKey, _ChromaScale) {
        if (entity.properties[_ColorKey] !== undefined) {
            var initial = false;
            for (var j = 0; j < _ColorText.length; j++) {
                if (entity.properties[_ColorKey]._value === _ColorText[j]) {
                    var rgb = _ChromaScale(1 - (j / _ColorText.length));
                    if (entity.polygon !== undefined) {
                        entity.polygon.material = Cesium.Color.fromBytes(rgb._rgb[0], rgb._rgb[1], rgb._rgb[2]);
                    }
                    if (entity.polyline !== undefined) {
                        var newColor = new Cesium.Color.fromBytes(rgb[0], rgb[1], rgb[2]);
                        entity.polyline.material.color.setValue(newColor);
                    }
                    if (entity.point !== undefined) {
                        var newColor = new Cesium.Color.fromBytes(rgb[0], rgb[1], rgb[2]);
                        entity.point.color = newColor;
                    }
                    initial = true;
                }
            }
            if (initial === false) {
                if (entity.polygon !== undefined) {
                    entity.polygon.material = Cesium.Color.LIGHTSLATEGRAY.withAlpha(1);
                }
                if (entity.polyline !== undefined) {
                    entity.polyline.material = Cesium.Color.LIGHTSLATEGRAY.withAlpha(1);
                }
                if (entity.point !== undefined) {
                    entity.point.color = Cesium.Color.LIGHTSLATEGRAY.withAlpha(1);
                }
            }
        }
        else {
            if (entity.polygon !== undefined) {
                entity.polygon.material = Cesium.Color.LIGHTSLATEGRAY.withAlpha(1);
            }
            if (entity.polyline !== undefined) {
                entity.polyline.material = Cesium.Color.LIGHTSLATEGRAY.withAlpha(1);
            }
            if (entity.point !== undefined) {
                entity.point.color = Cesium.Color.LIGHTSLATEGRAY.withAlpha(1);
            }
        }
    };
    //in viewer mode,set some attibutes to show
    ViewerComponent.prototype.showAttribs = function (event) {
        var viewer = this.dataService.getViewer();
        if (this.data !== undefined && this.mode === "viewer") {
            if (this.data["cesium"] !== undefined) {
                if (this.data["cesium"].select !== undefined) {
                    if (viewer.selectedEntity !== undefined) {
                        var pickup = viewer.scene.pick(new Cesium.Cartesian2(event.clientX, event.clientY));
                        this.pickupArrs = [];
                        this.pickupArrs.push({ name: "ID", data: pickup.id.id });
                        for (var _i = 0, _a = this.data["cesium"].select; _i < _a.length; _i++) {
                            var _propertyName = _a[_i];
                            this.pickupArrs.push({ name: _propertyName, data: this.dataService.get_SelectedEntity().properties[_propertyName]._value });
                        }
                        var nameOverlay = document.getElementById("cesium-infoBox-defaultTable");
                        viewer.container.appendChild(nameOverlay);
                        nameOverlay.style.bottom = viewer.canvas.clientHeight - event.clientY + "px";
                        nameOverlay.style.left = event.clientX + "px";
                        nameOverlay.style.display = "block";
                    }
                    else {
                        document.getElementById("cesium-infoBox-defaultTable").style.display = "none";
                    }
                }
            }
        }
    };
    // save the geojson
    ViewerComponent.prototype.save_geojson = function () {
        var fileString = JSON.stringify(this.data);
        var blob = new Blob([fileString], { type: 'application/json' });
        FileUtils.downloadContent(blob, "output.geojson");
    };
    ViewerComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: "cesium-viewer",
            template: __webpack_require__(/*! ./viewer.component.html */ "./src/app/mViewer/viewers/mobius-cesium/viewer/viewer.component.html"),
            styles: [__webpack_require__(/*! ./viewer.component.css */ "./src/app/mViewer/viewers/mobius-cesium/viewer/viewer.component.css")],
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]])
    ], ViewerComponent);
    return ViewerComponent;
}(_data_DataSubscriber__WEBPACK_IMPORTED_MODULE_1__["DataSubscriber"]));

//download geojson
var FileUtils = /** @class */ (function () {
    function FileUtils() {
    }
    FileUtils.downloadContent = function (blob, filename) {
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, filename);
        }
        else {
            var a_1 = document.createElement('a');
            document.body.appendChild(a_1);
            var url_1 = window.URL.createObjectURL(blob);
            a_1.href = url_1;
            a_1.download = filename;
            a_1.click();
            setTimeout(function () {
                window.URL.revokeObjectURL(url_1);
                document.body.removeChild(a_1);
            }, 0);
        }
    };
    return FileUtils;
}());


/***/ }),

/***/ "./src/app/mViewer/viewers/viewer-text.component.ts":
/*!**********************************************************!*\
  !*** ./src/app/mViewer/viewers/viewer-text.component.ts ***!
  \**********************************************************/
/*! exports provided: TextViewerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextViewerComponent", function() { return TextViewerComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

//import { gsConstructor } from '@modules';
var TextViewerComponent = /** @class */ (function () {
    function TextViewerComponent() {
        //console.log(`Text Viewer Created`); 
    }
    TextViewerComponent.prototype.ngOnInit = function () {
        if (typeof this.data === 'number' || this.data === undefined) {
            this.output = this.data;
        }
        else if (typeof this.data === 'string') {
            this.output = '"' + this.data + '"';
        }
        else if (this.data.constructor === [].constructor) {
            this.output = JSON.stringify(this.data);
        }
        else if (this.data.constructor === {}.constructor) {
            this.output = JSON.stringify(this.data);
        }
        else {
            console.log('Unknown output type:', this.data);
            this.output = this.data;
        }
    };
    TextViewerComponent.prototype.ngDoCheck = function () {
        if (typeof this.data === 'number' || this.data === undefined) {
            this.output = this.data;
        }
        else if (typeof this.data === 'string') {
            this.output = '"' + this.data + '"';
        }
        else if (this.data.constructor === [].constructor) {
            this.output = JSON.stringify(this.data);
        }
        else if (this.data.constructor === {}.constructor) {
            this.output = JSON.stringify(this.data);
        }
        else {
            console.log('Unknown output type:', this.data);
            this.output = this.data;
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], TextViewerComponent.prototype, "data", void 0);
    TextViewerComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'text-viewer',
            template: "<textarea>{{ output || \"no-value\" }}</textarea>",
            styles: ["\n  :host{\n    height: 100%;\n    width: 100%;\n  }\n  textarea{\n    height: 99%;\n    width: 99%;\n    overflow: auto;\n    resize: none;\n    background-color: rgb(220,220,220);\n    text-color: rgb(80,80,80);\n    border: none;\n    font-family: arial;\n  }"]
        }),
        __metadata("design:paramtypes", [])
    ], TextViewerComponent);
    return TextViewerComponent;
}());



/***/ }),

/***/ "./src/app/ngFlowchart-svg/edge/edge.component.html":
/*!**********************************************************!*\
  !*** ./src/app/ngFlowchart-svg/edge/edge.component.html ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--the main line-->\r\n<svg:polyline \r\nid=\"main-edge\" \r\nclass = \"edge\" \r\n[class.selected] = \"edge.selected\"\r\n[attr.points] = \"(edge.source.parentNode.position.x + outputOffset[0]) + ',' +\r\n                    (edge.source.parentNode.position.y + outputOffset[1]+ 8) + ' ' +\r\n\r\n                    (edge.source.parentNode.position.x + outputOffset[0]) + ',' +\r\n                    (edge.source.parentNode.position.y + outputOffset[1] + 16) + ' ' +\r\n\r\n                    (edge.target.parentNode.position.x + inputOffset[0]) + ',' +\r\n                    (edge.target.parentNode.position.y + inputOffset[1] - 27) + ' ' +\r\n\r\n                    (edge.target.parentNode.position.x + inputOffset[0]) + ',' +\r\n                    (edge.target.parentNode.position.y + inputOffset[1] - 22)\" \r\n/>\r\n\r\n<!--a wider invisible line to make the wire easier to click-->\r\n<svg:polyline \r\nid=\"invisible-edge\" \r\nclass = \"inviEdge\" \r\n[attr.points] = \"(edge.source.parentNode.position.x + outputOffset[0]) + ',' +\r\n                    (edge.source.parentNode.position.y + outputOffset[1]+ 15) + ' ' +\r\n\r\n                    (edge.source.parentNode.position.x + outputOffset[0]) + ',' +\r\n                    (edge.source.parentNode.position.y + outputOffset[1] + 17) + ' ' +\r\n\r\n                    (edge.target.parentNode.position.x + inputOffset[0]) + ',' +\r\n                    (edge.target.parentNode.position.y + inputOffset[1] - 27) + ' ' +\r\n\r\n                    (edge.target.parentNode.position.x + inputOffset[0]) + ',' +\r\n                    (edge.target.parentNode.position.y + inputOffset[1] - 12)\" \r\n(click)='select($event)'/>\r\n    \r\n\r\n"

/***/ }),

/***/ "./src/app/ngFlowchart-svg/edge/edge.component.ts":
/*!********************************************************!*\
  !*** ./src/app/ngFlowchart-svg/edge/edge.component.ts ***!
  \********************************************************/
/*! exports provided: EdgeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EdgeComponent", function() { return EdgeComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var EdgeComponent = /** @class */ (function () {
    function EdgeComponent() {
        this.delete = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.selected = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
    // select a wire
    EdgeComponent.prototype.select = function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (this.edge.selected) {
            this.selected.emit(event.ctrlKey);
        }
        else {
            if (event.ctrlKey)
                this.selected.emit('ctrl');
            else
                this.selected.emit('single');
        }
    };
    // delete a wire
    EdgeComponent.prototype.deleteEdge = function () {
        this.delete.emit();
    };
    EdgeComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('canvas'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], EdgeComponent.prototype, "canvas", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], EdgeComponent.prototype, "edge", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], EdgeComponent.prototype, "inputOffset", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], EdgeComponent.prototype, "outputOffset", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], EdgeComponent.prototype, "delete", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], EdgeComponent.prototype, "selected", void 0);
    EdgeComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: '[edge]',
            template: __webpack_require__(/*! ./edge.component.html */ "./src/app/ngFlowchart-svg/edge/edge.component.html"),
            styles: ["\n    .edge{\n        fill: none;\n        stroke: rgb(80, 80, 80);\n        stroke-linecap: round;\n        stroke-linejoin: round;\n        stroke-width: 2px;\n        opacity: 1;\n        pointer-events: stroke;\n        marker-end: url(#arrow);\n    }  \n    .inviEdge{\n        fill: none;\n        stroke: gray;\n        stroke-width: 30px;\n        opacity: 0;\n        pointer-events: stroke;\n    }  \n    .selected{\n        stroke: rgb(0, 0, 150);\n        opacity: 1;\n        marker-end: url(#arrow_selected);\n\n    }\n  "]
        })
    ], EdgeComponent);
    return EdgeComponent;
}());



/***/ }),

/***/ "./src/app/ngFlowchart-svg/flowchart.component.html":
/*!**********************************************************!*\
  !*** ./src/app/ngFlowchart-svg/flowchart.component.html ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id = 'flowchart-main-container' class='container'>\r\n\r\n      <!-- svg component -->\r\n      <svg id=\"svg-canvas\" class = \"svgCanvas\" viewBox=\"0 0 1500 1500\" \r\n      (mousedown)='panStart($event)'\r\n      (mousemove)='handleMouseMove($event)'  \r\n      (mouseup)='handleMouseUp($event)'\r\n      (mouseenter)='activateKeyEvent()'\r\n      (mouseleave)='deactivateKeyEvent()'\r\n      (wheel)='scale($event)'\r\n      >\r\n            <!-- definitions for svg: grid patterns, arrow head for connecting wire-->\r\n            <defs>\r\n                  <!-- grid pattern -->\r\n                  <pattern id=\"smallGrid\" width=\"20\" height=\"20\" patternUnits=\"userSpaceOnUse\">\r\n                    <path d=\"M 20 0 L 0 0 0 20\" fill=\"none\" stroke=\"gray\" stroke-width=\"0.5\"/>\r\n                  </pattern>\r\n                  <pattern id=\"grid\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\">\r\n                    <rect width=\"100\" height=\"100\" fill=\"url(#smallGrid)\"/>\r\n                    <path d=\"M 100 0 L 0 0 0 100\" fill=\"none\" stroke=\"gray\" stroke-width=\"1\"/>\r\n                  </pattern>\r\n\r\n                  <!-- arrow head -->\r\n                  <marker id=\"arrow\" markerWidth=\"30\" markerHeight=\"30\" refX=\"0\" refY=\"4\" orient=\"auto\" markerUnits=\"strokeWidth\" viewBox=\"0 0 40 40\">\r\n                    <path d=\"M0,0 L0,8 L9,4 z\" stroke=\"rgb(80, 80, 80)\" fill=\"transparent\" />\r\n                  </marker>\r\n                  <marker id=\"arrow_selected\" markerWidth=\"30\" markerHeight=\"30\" refX=\"0\" refY=\"4\" orient=\"auto\" markerUnits=\"strokeWidth\" viewBox=\"0 0 40 40\">\r\n                        <path d=\"M0,0 L0,8 L9,4 z\" stroke=\"rgb(0, 0, 150)\" fill=\"transparent\"  />\r\n                  </marker>\r\n            </defs>\r\n\r\n            <!-- svg frame-->\r\n            <rect width=\"100%\" height=\"100%\" fill=\"url(#grid)\" />\r\n                          \r\n\r\n            <!-- wires => edge.component -->\r\n            <g edge *ngFor=\"let edge of data.edges; let edge_index = index\" \r\n            [edge]='edge'\r\n            [inputOffset]='inputOffset'\r\n            [outputOffset]='outputOffset'\r\n            (selected)='selectEdge($event, edge_index)'\r\n            />\r\n\r\n            <!-- temporary wire while dragging port, default position to <(0,0),(0,0)>, modified when a port is being dragged -->\r\n            <line id=\"temporary-wire\" class=\"temp-wire\" x1=\"0\" y1='0' x2='0' y2='0'></line>\r\n\r\n            <!-- nodes => node.component -->\r\n            <g node *ngFor=\"let node of data.nodes; let node_index = index\" \r\n            id='flw_node_{{node_index}}'\r\n            [node]='node' \r\n            [selected]='isSelected(node_index)'\r\n            [inputOffset]='inputOffset'\r\n            [outputOffset]='outputOffset'\r\n            (action)='nodeAction($event, node_index)'\r\n            />\r\n      </svg>\r\n\r\n      <!-- 3 top left buttons of the svg: add Node, delete Node and delete Wire -->\r\n      <div class='button-row'>\r\n            <button mat-icon-button disableRipple='true' (click)='addNode()' title=\"Add Node\">\r\n            <mat-icon>add</mat-icon>\r\n            </button>\r\n            <button mat-icon-button disableRipple='true' (click)='deleteSelectedNodes()' title=\"Delete Selected Node\">\r\n            <mat-icon>remove</mat-icon>\r\n            </button>\r\n            <button mat-icon-button disableRipple='true' (click)='deleteSelectedEdges()' title=\"Delete Selected Wires\">\r\n            <mat-icon>link_off</mat-icon>\r\n            </button>\r\n      </div>\r\n\r\n      <!-- focus on flowchart button on the top right of the svg -->\r\n      <button class='resetViewer-button' mat-icon-button disableRipple='true' (click)='focusFlowchart()' title=\"Zoom to Fit\">\r\n            <mat-icon>control_camera</mat-icon>\r\n      </button>\r\n      \r\n\r\n</div>\r\n\r\n\r\n\r\n"

/***/ }),

/***/ "./src/app/ngFlowchart-svg/flowchart.component.scss":
/*!**********************************************************!*\
  !*** ./src/app/ngFlowchart-svg/flowchart.component.scss ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".reset {\n  margin: 0px;\n  padding: 0px; }\n\n.default {\n  font-size: 12px;\n  color: #8AA8C0;\n  line-height: 150px;\n  text-align: center; }\n\n.viewer {\n  /* \twidth: 100%; \r\noverflow: auto;\r\n\r\npadding: 0px;\r\nmargin: 0px;\r\n\r\n.header{\r\n\r\n\tdisplay: flex; \r\n\tflex-direction: row; \r\n\tjustify-content: space-between;\r\n\r\n\tposition: relative;\r\n\tfont-size: 14px; \r\n\tfont-weight: 600; \r\n\tline-height: $header-height;\r\n\ttext-transform: uppercase;\r\n\tletter-spacing: 1.5px;\r\n\theight: $header-height;\r\n\r\n\tcolor: #ADADAD;\r\n\r\n\t.btn-group{\r\n\t\theight: $header-height; \r\n\r\n\t\tbutton{\r\n\t\t\twidth: 0.9*$header-height; \r\n\t\t\theight: 0.9*$header-height; \r\n\t\t\tmargin: 0px;\r\n\t\t\tborder: 1px solid #B4B1B1;\r\n\t\t\tbox-shadow: none;\r\n\r\n\t\t\t&:focus{\r\n\t\t\t\t\r\n\t\t\t}\r\n\t\t}\r\n\t\t\r\n\t}\r\n\r\n}\r\n\r\n.container{\r\n}\r\n\r\nbutton{\r\n\t&:focus{\r\n\t\t\r\n\t}\r\n} */ }\n\n.viewer .container {\n    display: flex;\n    flex-direction: row;\n    height: 100%; }\n\n.viewer .container .sidebar {\n      z-index: 100; }\n\n.viewer .container .view-container {\n      box-sizing: border-box;\n      height: 100%;\n      width: 100%;\n      padding-bottom: 30px;\n      overflow: auto; }\n\n.container {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  overflow: hidden; }\n\n.container .svgCanvas .temp-wire {\n    stroke: #505050;\n    stroke-width: 2px;\n    stroke-dasharray: 10 15;\n    opacity: 0.5; }\n\n.transform--container {\n  position: absolute;\n  width: 100%;\n  transition: -webkit-transform 0.1s;\n  transition: transform 0.1s;\n  transition: transform 0.1s, -webkit-transform 0.1s; }\n\nsplit-area {\n  overflow: auto !important; }\n\ninput {\n  border: none; }\n\ninput:focus {\n  border-bottom: 1px dashed gray; }\n\n#flowchart__name {\n  margin: 0 auto;\n  font-size: 14px;\n  line-height: 28px;\n  font-weight: bold;\n  color: #8AA8C0; }\n\n.button-row {\n  position: absolute;\n  top: 0px;\n  left: 10px; }\n\n.button-row button {\n    color: #505050;\n    width: 28px; }\n\n.resetViewer-button {\n  position: absolute;\n  top: 0px;\n  right: 0px;\n  color: #505050; }\n\n.viewer {\n  position: relative;\n  height: 100%;\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  background-image: repeating-linear-gradient(0deg, transparent, transparent 70px, #F1F1F1 70px, #F1F1F1 71px), repeating-linear-gradient(-90deg, transparent, transparent 70px, #F1F1F1 70px, #F1F1F1 71px);\n  background-size: 71px 71px;\n  background-color: white;\n  box-sizing: border-box;\n  height: 100%;\n  width: 100%;\n  padding-bottom: 30px; }\n\n.viewer .container {\n    position: absolute;\n    height: 100%;\n    overflow: hidden; }\n\n.viewer .container .disabled {\n      color: #8AA8C0; }\n\n.viewer .container .disabled:hover {\n        color: #8AA8C0 !important; }\n\n.viewer .container .sidebar {\n      font-size: 12px;\n      background-color: #F1F1F1;\n      color: #395D73;\n      white-space: nowrap;\n      overflow-x: hidden !important; }\n\n.viewer .container .sidebar section {\n        padding-left: 15px;\n        padding-bottom: 5px;\n        padding-top: 5px;\n        border-bottom: 1px solid #8AA8C0; }\n\n.viewer .container .sidebar section div {\n          cursor: pointer; }\n\n.viewer .container .sidebar section div:hover {\n            color: #F0BFA0; }\n\n.viewer .content-wrapper {\n    position: relative;\n    height: 100%;\n    width: 100%;\n    -webkit-transform-origin: top left;\n            transform-origin: top left; }\n\n.viewer .info-container {\n    padding: 0px 30px;\n    display: flex;\n    flex-direction: row;\n    justify-content: space-between; }\n\n.viewer .info-container .info {\n      display: flex;\n      flex-direction: column; }\n\n.viewer .info-container .info .label {\n        font-size: 12px;\n        font-weight: 100;\n        color: #F07A79; }\n\n.viewer .info-container .info .value {\n        color: #395D73;\n        font-size: 11px;\n        font-weight: 600; }\n\n.viewer .info-container .info .action {\n        cursor: pointer;\n        font-size: 11px;\n        color: #8AA8C0; }\n\n.viewer .graph-container {\n    position: absolute;\n    height: 100%;\n    width: 100%;\n    -webkit-transform-origin: top left;\n            transform-origin: top left; }\n\n.viewer .graph-container #graph-edges {\n      background-color: transparent;\n      z-index: 1000; }\n\n.viewer .graph-container #graph-edges #temporary-edge .hidden {\n        display: none; }\n\n.viewer .graph-container #graph-nodes {\n      background-color: transparent;\n      overflow: hidden;\n      z-index: 1000; }\n\n.viewer .info-container {\n    position: absolute;\n    right: 0;\n    bottom: 0; }\n\n.viewer .info-container .label, .viewer .info-container .value {\n      margin-right: 5px;\n      font-weight: normal !important; }\n\n.viewer .node-container {\n    position: relative; }\n\n.viewer .node-container .node {\n      position: absolute;\n      -webkit-transform-origin: top left;\n              transform-origin: top left;\n      z-index: 3;\n      margin: 0px;\n      color: #395D73; }\n\n.viewer .node-container .node.hidden {\n        display: none; }\n\n.viewer .node-container .node .btn-container {\n        position: absolute;\n        right: -30px;\n        display: flex;\n        flex-direction: column;\n        justify-content: space-between;\n        height: 100px; }\n\n.viewer .node-container .node .btn-container .btn-group {\n          position: relative;\n          display: flex;\n          flex-direction: column;\n          justify-content: center;\n          background: none; }\n\n.viewer .node-container .node .btn-container .btn-group .action-button {\n            position: relative;\n            width: 25px;\n            height: 24px;\n            cursor: pointer;\n            font-size: 9px;\n            text-align: center; }\n\n.viewer .node-container .node .btn-container .btn-group .action-button .material-icons {\n              font-size: 18px;\n              line-height: 24px;\n              color: #8AA8C0; }\n\n.viewer .node-container .node .btn-container .btn-group .action-button:hover {\n              color: white; }\n\n.viewer .node-container .node .btn-container .btn-group .action-button:hover .mat-icon {\n                color: #F0BFA0; }\n\n.viewer .node-container .node .node-body {\n        display: flex;\n        flex-direction: column;\n        justify-content: center;\n        position: relative;\n        min-height: 30px;\n        min-width: 70px;\n        width: auto;\n        border: 1px solid #395D73;\n        background-color: rgba(255, 255, 255, 0.7);\n        cursor: move; }\n\n.viewer .node-container .node .node-body.disabled {\n          opacity: 0.4; }\n\n.viewer .node-container .node .node-body.selected {\n          border-color: green; }\n\n.viewer .node-container .node .node-body.library {\n          border-color: #395D73;\n          border-style: solid; }\n\n.viewer .node-container .node .node-body.error {\n          background-color: #E94858; }\n\n.viewer .node-container .node .node-body.function {\n          background-color: yellow;\n          border: 1px dashed green; }\n\n.viewer .node-container .node .node-body .node-name {\n          font-family: sans-serif;\n          font-size: 12px;\n          border-bottom: 1px solid #395D73;\n          text-align: center;\n          background-color: #F1F1F1; }\n\n.viewer .node-container .node .node-body .node-name input {\n            background-color: inherit;\n            border: 0px;\n            color: #395D73;\n            text-align: center; }\n\n.viewer .node-container .node .node-body .node-name.selected {\n            background-color: #8AA8C0; }\n\n.viewer .node-container .node .node-body .node-name.selected input {\n              color: white;\n              font-weight: bold; }\n\n.viewer .node-container .node .node-body .node-name.selected input:focus {\n                color: #395D73;\n                background-color: #F0BFA0; }\n\n.viewer .node-container .node .node-body .port-container {\n          display: flex;\n          flex-direction: column;\n          margin-top: 10px;\n          margin-bottom: 10px; }\n\n.viewer .node-container .node .node-body .port-container .divider {\n            height: 2px;\n            width: 100%;\n            background-color: #8AA8C0; }\n\n.viewer .node-container .node .node-body .port-container .port {\n            display: flex;\n            flex-direction: row;\n            margin: 5px 0px; }\n\n.viewer .node-container .node .node-body .port-container .port.hidden {\n              display: none; }\n\n.viewer .node-container .node .node-body .port-container .port .port-grip {\n              width: 15px;\n              height: 15px;\n              border-radius: 50%;\n              background-color: #F1F1F1;\n              border: 1px solid #395D73;\n              cursor: pointer; }\n\n.viewer .node-container .node .node-body .port-container .port .port-grip.isFunction {\n                border-style: dashed;\n                background-color: gray;\n                border-radius: 0px; }\n\n.viewer .node-container .node .node-body .port-container .port .port-grip.selected {\n                border: 2px solid #8AA8C0;\n                background-color: #F0BFA0; }\n\n.viewer .node-container .node .node-body .port-container .port .port-grip:hover {\n                background-color: #F0BFA0; }\n\n.viewer .node-container .node .node-body .port-container .port .port-name {\n              font-size: 12px;\n              margin: 0px 5px; }\n\n.viewer .node-container .node .node-body .port-container .port .port-name.isFunction {\n                color: black;\n                font-size: 9.6px; }\n\n.viewer .node-container .node .node-body .port-container .port.input {\n              justify-content: flex-start;\n              margin-left: -7.5px; }\n\n.viewer .node-container .node .node-body .port-container .port.output {\n              justify-content: flex-end;\n              margin-right: -7.5px; }\n\n.viewer .node-container .node:active {\n        cursor: none; }\n"

/***/ }),

/***/ "./src/app/ngFlowchart-svg/flowchart.component.ts":
/*!********************************************************!*\
  !*** ./src/app/ngFlowchart-svg/flowchart.component.ts ***!
  \********************************************************/
/*! exports provided: FlowchartComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FlowchartComponent", function() { return FlowchartComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _models_node__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @models/node */ "./src/app/shared/models/node/index.ts");
/* harmony import */ var _node_node_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node/node.actions */ "./src/app/ngFlowchart-svg/node/node.actions.ts");
/* harmony import */ var circular_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! circular-json */ "./node_modules/circular-json/build/circular-json.node.js");
/* harmony import */ var circular_json__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(circular_json__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var FlowchartComponent = /** @class */ (function () {
    function FlowchartComponent() {
        this.switch = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.startCoords = [];
        // variable for flowchart zooming
        this.mousePos = [0, 0];
        this.zoom = 1;
        // variable for edge
        this.edge = { source: undefined, target: undefined, selected: false };
        this.selectedEdge = [];
        // listener for events, only activated when the mouse is hovering over the svg component
        this.keydownListener = Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["fromEvent"])(document, 'keydown');
        this.copyListener = Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["fromEvent"])(document, 'copy');
        this.pasteListener = Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["fromEvent"])(document, 'paste');
        this.listenerActive = false;
        // constants for offset positions of input/output port relative to the node's position
        this.inputOffset = [50, -8];
        this.outputOffset = [50, 88];
    }
    FlowchartComponent_1 = FlowchartComponent;
    FlowchartComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.canvas = document.getElementById("svg-canvas");
        var bRect = this.canvas.getBoundingClientRect();
        this.offset = [bRect.left, bRect.top];
        // copy: copy node
        this.copySub = this.copyListener.subscribe(function (val) {
            if (!_this.listenerActive)
                return;
            var node = _this.data.nodes[_this.data.meta.selected_nodes[0]];
            if (node.type != 'start' && node.type != 'end') {
                console.log('copied node:', node);
                var cp = circular_json__WEBPACK_IMPORTED_MODULE_3__["parse"](circular_json__WEBPACK_IMPORTED_MODULE_3__["stringify"](node));
                _this.copied = circular_json__WEBPACK_IMPORTED_MODULE_3__["stringify"](cp);
            }
        });
        // paste: paste copied node
        this.pasteSub = this.pasteListener.subscribe(function (val) {
            if (!_this.listenerActive)
                return;
            if (_this.copied) {
                event.preventDefault();
                var newNode = circular_json__WEBPACK_IMPORTED_MODULE_3__["parse"](_this.copied);
                var pt = _this.canvas.createSVGPoint();
                pt.x = 20;
                pt.y = 100;
                var svgP = void 0;
                var isFirefox = typeof InstallTrigger !== 'undefined';
                if (isFirefox) {
                    var ctm = _this.canvas.getScreenCTM();
                    var bRect_1 = _this.canvas.getBoundingClientRect();
                    ctm.a = ctm.a * _this.zoom;
                    ctm.d = ctm.d * _this.zoom;
                    ctm.e = bRect_1.x;
                    ctm.f = bRect_1.y;
                    svgP = pt.matrixTransform(ctm.inverse());
                }
                else {
                    svgP = pt.matrixTransform(_this.canvas.getScreenCTM().inverse());
                }
                _models_node__WEBPACK_IMPORTED_MODULE_1__["NodeUtils"].updateNode(newNode, svgP);
                _this.data.nodes.push(newNode);
                console.log('pasting node:', newNode);
            }
        });
        // delete: delete selected edge(s)
        this.keydownSub = this.keydownListener.subscribe(function (val) {
            if (!_this.listenerActive)
                return;
            if (val.key == 'Delete') {
                _this.deleteSelectedEdges();
            }
        });
    };
    /*
    handle event received from node component
    */
    FlowchartComponent.prototype.nodeAction = function (event, node_index) {
        switch (event.action) {
            // switch the viewchild of the appModule to the node's procedure view when double-click on the node
            case _node_node_actions__WEBPACK_IMPORTED_MODULE_2__["ACTIONS"].PROCEDURE:
                this.switch.emit("editor");
                this.deactivateKeyEvent();
                break;
            // select a node
            case _node_node_actions__WEBPACK_IMPORTED_MODULE_2__["ACTIONS"].SELECT:
                this.data.meta.selected_nodes = [node_index];
                break;
            // initiate dragging node
            case _node_node_actions__WEBPACK_IMPORTED_MODULE_2__["ACTIONS"].DRAGNODE:
                this.element = this.data.nodes[node_index];
                var pt = this.canvas.createSVGPoint();
                // get current mouse position in the page
                pt.x = event.data.pageX;
                pt.y = event.data.pageY;
                // convert mouse position to svg position (special procedure for firefox)
                var svgP = void 0;
                var isFirefox = typeof InstallTrigger !== 'undefined';
                if (isFirefox) {
                    var ctm = this.canvas.getScreenCTM();
                    var bRect = this.canvas.getBoundingClientRect();
                    ctm.a = ctm.a * this.zoom;
                    ctm.d = ctm.d * this.zoom;
                    ctm.e = bRect.x;
                    ctm.f = bRect.y;
                    svgP = pt.matrixTransform(ctm.inverse());
                }
                else {
                    svgP = pt.matrixTransform(this.canvas.getScreenCTM().inverse());
                }
                // save the svg position as startCoords
                this.startCoords = [
                    svgP.x,
                    svgP.y
                ];
                if (this.startCoords[0] == NaN) {
                    this.startCoords = [0, 0];
                }
                // mark the dragging mode as dragNode
                this.isDown = 2;
                break;
            // initiate dragging input/output port
            case _node_node_actions__WEBPACK_IMPORTED_MODULE_2__["ACTIONS"].DRAGPORT:
                // create a new edge
                this.edge = { source: undefined, target: undefined, selected: false };
                // assign the port to the edge's input/output accordingly
                if (event.type == 'input') {
                    this.edge.target = event.data;
                }
                else {
                    this.edge.source = event.data;
                }
                this.startType = event.type;
                // modify the temporary-edge's coordinate
                this.element = document.getElementById("temporary-wire");
                this.element.setAttribute('x1', event.position[0]);
                this.element.setAttribute('y1', event.position[1]);
                this.element.setAttribute('x2', event.position[0]);
                this.element.setAttribute('y2', event.position[1]);
                this.isDown = 3;
                break;
        }
    };
    // check if the node at node_index is selected 
    FlowchartComponent.prototype.isSelected = function (node_index) {
        return this.data.meta.selected_nodes.indexOf(node_index) > -1;
    };
    // add a new node
    FlowchartComponent.prototype.addNode = function () {
        // create a new node
        var newNode = _models_node__WEBPACK_IMPORTED_MODULE_1__["NodeUtils"].getNewNode();
        // the new node's position would be (20,100) relative to the current view
        var pt = this.canvas.createSVGPoint();
        pt.x = 20;
        pt.y = 100;
        // convert the position to svg position
        var svgP;
        var isFirefox = typeof InstallTrigger !== 'undefined';
        if (isFirefox) {
            var ctm = this.canvas.getScreenCTM();
            var bRect = this.canvas.getBoundingClientRect();
            ctm.a = ctm.a * this.zoom;
            ctm.d = ctm.d * this.zoom;
            ctm.e = bRect.x;
            ctm.f = bRect.y;
            svgP = pt.matrixTransform(ctm.inverse());
        }
        else {
            svgP = pt.matrixTransform(this.canvas.getScreenCTM().inverse());
        }
        // assign the position to the new node and add it to the flowchart
        newNode.position.x = svgP.x;
        newNode.position.y = svgP.y;
        this.data.nodes.push(newNode);
    };
    // activate event listener for copy (ctrl+c), paste (ctrl+v), delete (Delete) when mouse hover over the svg component
    FlowchartComponent.prototype.activateKeyEvent = function () {
        this.listenerActive = true;
    };
    // deactivate the event listeners when the mouse exit the svg component
    FlowchartComponent.prototype.deactivateKeyEvent = function () {
        this.listenerActive = false;
    };
    // delete selected node
    FlowchartComponent.prototype.deleteSelectedNodes = function () {
        // for each of the selected node
        while (this.data.meta.selected_nodes.length > 0) {
            var node_index = this.data.meta.selected_nodes.pop();
            var node = this.data.nodes[node_index];
            // continue if the node is a start/end node
            if (node.type == "start" || node.type == "end")
                continue;
            var edge_index = 0;
            // delete all the edges connected to the node
            while (edge_index < this.data.edges.length) {
                var tbrEdge = this.data.edges[edge_index];
                if (tbrEdge.target.parentNode == node || tbrEdge.source.parentNode == node) {
                    this.deleteEdge(edge_index, node.id);
                    continue;
                }
                edge_index += 1;
            }
            // remove the node from the flowchart
            this.data.nodes.splice(Number(node_index), 1);
        }
    };
    // delete an edge with a known index
    FlowchartComponent.prototype.deleteEdge = function (edge_index, deletedNode) {
        if (deletedNode === void 0) { deletedNode = undefined; }
        var tbrEdge = this.data.edges[edge_index];
        // remove the edge from the target node's list of edges
        for (var i in this.data.edges) {
            if (tbrEdge.target.edges[i] == tbrEdge) {
                tbrEdge.target.edges.splice(Number(i), 1);
                break;
            }
        }
        // remove the edge from the source node's list of edges
        for (var i in tbrEdge.source.edges) {
            if (tbrEdge.source.edges[i] == tbrEdge) {
                tbrEdge.source.edges.splice(Number(i), 1);
                break;
            }
        }
        if (tbrEdge.target.parentNode.input.edges.length == 0 && deletedNode !== tbrEdge.target.parentNode.id) {
            FlowchartComponent_1.disableNode(tbrEdge.target.parentNode);
        }
        else {
            FlowchartComponent_1.enableNode(tbrEdge.target.parentNode);
        }
        // remove the edge from the general list of edges
        this.data.edges.splice(edge_index, 1);
        this.data.ordered = false;
    };
    // delete all the selected edges
    FlowchartComponent.prototype.deleteSelectedEdges = function () {
        this.selectedEdge.sort().reverse();
        for (var _i = 0, _a = this.selectedEdge; _i < _a.length; _i++) {
            var edge_index = _a[_i];
            this.deleteEdge(edge_index);
        }
        this.selectedEdge = [];
    };
    // select an edge
    FlowchartComponent.prototype.selectEdge = function (event, edge_index) {
        // if ctrl is pressed, add the edge into the list of selected edges
        if (event == 'ctrl') {
            this.selectedEdge.push(edge_index);
            this.data.edges[edge_index].selected = true;
        }
        else if (event == 'single' || (event === false && this.selectedEdge.length > 1)) {
            if (this.selectedEdge.length > 0) {
                for (var _i = 0, _a = this.selectedEdge; _i < _a.length; _i++) {
                    var e = _a[_i];
                    this.data.edges[e].selected = false;
                }
            }
            this.selectedEdge = [edge_index];
            this.data.edges[edge_index].selected = true;
        }
        else {
            this.data.edges[edge_index].selected = false;
            for (var i = 0; i < this.selectedEdge.length; i++)
                if (this.selectedEdge[i] == edge_index) {
                    this.selectedEdge.splice(i, 1);
                    break;
                }
        }
    };
    // focus view onto the flowchart
    FlowchartComponent.prototype.focusFlowchart = function () {
        // find the frame of the flowchart: frame = [minX, minY, maxX, maxY]
        var frame = [this.data.nodes[0].position.x, this.data.nodes[0].position.y,
            this.data.nodes[0].position.x, this.data.nodes[0].position.y];
        for (var _i = 0, _a = this.data.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            if (node.position.x < frame[0]) {
                frame[0] = node.position.x;
            }
            else if (node.position.x > frame[2]) {
                frame[2] = node.position.x;
            }
            if (node.position.y < frame[1]) {
                frame[1] = node.position.y;
            }
            else if (node.position.y > frame[3]) {
                frame[3] = node.position.y;
            }
        }
        frame[2] += 100;
        frame[3] += 80;
        // calculate the zoom to fit the whole flowchart
        var bRect = this.canvas.getBoundingClientRect();
        var ctm = this.canvas.getScreenCTM();
        var zoom = bRect.width / (ctm.a * (frame[2] - frame[0]));
        var heightZoom = bRect.height / (ctm.d * (frame[3] - frame[1]));
        if (zoom > heightZoom)
            zoom = heightZoom;
        if (zoom > 2.5)
            zoom = 2.5;
        // calculate the difference between height and width, if height is bigger than width, centering the flowchart based on the difference
        var height_width_diff = ((frame[3] - frame[1]) - (frame[2] - frame[0])) / 2;
        if (height_width_diff > 0) {
            frame[0] -= height_width_diff;
        }
        // if the minX or minY goes below 0 (outside of svg frame), change them back to 0
        if (frame[0] < 0)
            frame[0] = 0;
        if (frame[1] < 0)
            frame[1] = 0;
        // transform
        this.canvas.style.transition = 'transform 0ms ease-in';
        this.canvas.style.transformOrigin = 'top left';
        this.canvas.style.transform = "matrix(" + zoom + ",0,0," + zoom + "," + -frame[0] * ctm.a * zoom / this.zoom + "," + -frame[1] * ctm.a * zoom / this.zoom + ")";
        this.zoom = zoom;
    };
    // scale view on mouse wheel
    FlowchartComponent.prototype.scale = function (event) {
        event.preventDefault();
        event.stopPropagation();
        // calculate new zoom value
        var scaleFactor = 0.1;
        var value = this.zoom - (Math.sign(event.deltaY)) * scaleFactor;
        // limit the zoom value to be between 1 and 2.5
        if (value >= 1 && value <= 2.5) {
            value = Number((value).toPrecision(5));
        }
        else {
            return;
        }
        // if new zoom is bigger than current zoom, update the mouse position to current position
        if (value > this.zoom) {
            this.mousePos = [event.clientX - this.offset[0], event.clientY - this.offset[1]];
        }
        // find transformation matrix
        var m = this.canvas.createSVGMatrix()
            .translate(this.mousePos[0], this.mousePos[1])
            .scale(value)
            .translate(-this.mousePos[0], -this.mousePos[1]);
        var transf = "matrix(" + m.a + "," + m.b + "," + m.c + "," + m.d + "," + m.e + "," + m.f + ")";
        // transform
        this.canvas.style.transition = 'transform 50ms ease-in';
        this.canvas.style.transformOrigin = "top left";
        this.canvas.style.transform = transf;
        this.zoom = value;
    };
    // initiate dragging the view window
    FlowchartComponent.prototype.panStart = function (event) {
        event.preventDefault();
        this.canvas.style.transition = 'transform 0ms linear';
        this.canvas.style.transformOrigin = "top left";
        var bRect = this.canvas.getBoundingClientRect();
        // set start coords to current view window position
        this.startCoords = [
            event.clientX - (bRect.left - this.offset[0]),
            event.clientY - (bRect.top - this.offset[1])
        ];
        // set drag mode to drag view
        this.isDown = 1;
    };
    // handle mouse move for dragging view/node/port
    FlowchartComponent.prototype.handleMouseMove = function (event) {
        // return if no dragging initiated
        if (!this.isDown) {
            return;
            // if drag view
        }
        else if (this.isDown == 1) {
            event.preventDefault();
            var bRect = this.canvas.getBoundingClientRect();
            var x = Number(event.clientX - this.startCoords[0]);
            var y = Number(event.clientY - this.startCoords[1]);
            var boundingDiv = document.getElementById("flowchart-main-container").getBoundingClientRect();
            if (x > 0 || bRect.width < boundingDiv.width) {
                x = 0;
            }
            else if (boundingDiv.width - x > bRect.width) {
                x = boundingDiv.width - bRect.width;
            }
            if (y > 0 || bRect.height < boundingDiv.height) {
                y = 0;
            }
            else if (boundingDiv.height - y > bRect.height) {
                y = boundingDiv.height - bRect.height;
            }
            this.canvas.style.transform = "matrix(" + this.zoom + ",0,0," + this.zoom + "," + x + "," + y + ")";
            // if drag node
        }
        else if (this.isDown == 2) {
            var pt = this.canvas.createSVGPoint();
            pt.x = event.pageX;
            pt.y = event.pageY;
            var svgP = void 0;
            var isFirefox = typeof InstallTrigger !== 'undefined';
            if (isFirefox) {
                var ctm = this.canvas.getScreenCTM();
                var bRect = this.canvas.getBoundingClientRect();
                ctm.a = ctm.a * this.zoom;
                ctm.d = ctm.d * this.zoom;
                ctm.e = bRect.x;
                ctm.f = bRect.y;
                svgP = pt.matrixTransform(ctm.inverse());
            }
            else {
                svgP = pt.matrixTransform(this.canvas.getScreenCTM().inverse());
            }
            var xDiff = this.startCoords[0] - svgP.x;
            var yDiff = this.startCoords[1] - svgP.y;
            this.startCoords[0] = svgP.x;
            this.startCoords[1] = svgP.y;
            this.element.position.x -= xDiff;
            this.element.position.y -= yDiff;
            // if drag port
        }
        else if (this.isDown == 3) {
            event.preventDefault();
            var pt = this.canvas.createSVGPoint();
            pt.x = event.pageX;
            pt.y = event.pageY;
            var isFirefox = typeof InstallTrigger !== 'undefined';
            if (isFirefox) {
                var ctm = this.canvas.getScreenCTM();
                var bRect = this.canvas.getBoundingClientRect();
                ctm.a = ctm.a * this.zoom;
                ctm.d = ctm.d * this.zoom;
                ctm.e = bRect.x;
                ctm.f = bRect.y;
                var svgP = pt.matrixTransform(ctm.inverse());
                this.element.setAttribute('x2', svgP.x);
                this.element.setAttribute('y2', svgP.y);
            }
            else {
                var svgP = pt.matrixTransform(this.canvas.getScreenCTM().inverse());
                this.element.setAttribute('x2', svgP.x);
                this.element.setAttribute('y2', svgP.y);
            }
        }
    };
    FlowchartComponent.prototype.handleMouseUp = function (event) {
        this.element = undefined;
        // drop port --> create new edge if drop position is within 15px of an input/output port
        if (this.isDown == 3) {
            var pt = this.canvas.createSVGPoint();
            pt.x = event.pageX;
            pt.y = event.pageY;
            var svgP = void 0;
            var isFirefox = typeof InstallTrigger !== 'undefined';
            if (isFirefox) {
                var ctm = this.canvas.getScreenCTM();
                var bRect = this.canvas.getBoundingClientRect();
                ctm.a = ctm.a * this.zoom;
                ctm.d = ctm.d * this.zoom;
                ctm.e = bRect.x;
                ctm.f = bRect.y;
                svgP = pt.matrixTransform(ctm.inverse());
            }
            else {
                svgP = pt.matrixTransform(this.canvas.getScreenCTM().inverse());
            }
            // reset temporary edge position to <(0,0),(0,0)>
            var tempLine = document.getElementById("temporary-wire");
            tempLine.setAttribute('x1', '0');
            tempLine.setAttribute('y1', '0');
            tempLine.setAttribute('x2', '0');
            tempLine.setAttribute('y2', '0');
            // go through all of the nodes' input/output ports
            for (var _i = 0, _a = this.data.nodes; _i < _a.length; _i++) {
                var n = _a[_i];
                var pPos;
                // find the node's corresponding port and its position
                if (this.startType == 'input') {
                    if (this.edge.target.parentNode == n || n.type == 'end')
                        continue;
                    this.edge.source = n.output;
                    pPos = [n.position.x + this.outputOffset[0], n.position.y + this.outputOffset[1]];
                }
                else {
                    if (this.edge.source.parentNode == n || n.type == 'start')
                        continue;
                    this.edge.target = n.input;
                    pPos = [n.position.x + this.inputOffset[0], n.position.y + this.inputOffset[1]];
                }
                // if the distance between the port's position and the dropped position is bigger than 15px, continue
                if (Math.abs(pPos[0] - svgP.x) > 25 || Math.abs(pPos[1] - svgP.y) > 25)
                    continue;
                // if there is already an existing edge with the same source and target as the new edge, return
                for (var _b = 0, _c = this.data.edges; _b < _c.length; _b++) {
                    var edge = _c[_b];
                    if (edge.target == this.edge.target && edge.source == this.edge.source) {
                        this.isDown = 0;
                        return;
                    }
                }
                this.edge.target.edges.push(this.edge);
                this.edge.source.edges.push(this.edge);
                this.data.edges.push(this.edge);
                this.data.ordered = false;
                if (this.edge.source.parentNode.enabled) {
                    FlowchartComponent_1.enableNode(this.edge.target.parentNode);
                }
                else {
                    FlowchartComponent_1.disableNode(this.edge.target.parentNode);
                }
                break;
            }
        }
        this.isDown = 0;
    };
    FlowchartComponent.enableNode = function (node) {
        for (var _i = 0, _a = node.input.edges; _i < _a.length; _i++) {
            var edge = _a[_i];
            if (!edge.source.parentNode.enabled)
                return;
        }
        node.enabled = true;
        for (var _b = 0, _c = node.output.edges; _b < _c.length; _b++) {
            var edge = _c[_b];
            FlowchartComponent_1.enableNode(edge.target.parentNode);
        }
    };
    FlowchartComponent.disableNode = function (node) {
        node.enabled = false;
        for (var _i = 0, _a = node.output.edges; _i < _a.length; _i++) {
            var edge = _a[_i];
            FlowchartComponent_1.disableNode(edge.target.parentNode);
        }
    };
    var FlowchartComponent_1;
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], FlowchartComponent.prototype, "data", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], FlowchartComponent.prototype, "switch", void 0);
    FlowchartComponent = FlowchartComponent_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'flowchart',
            template: __webpack_require__(/*! ./flowchart.component.html */ "./src/app/ngFlowchart-svg/flowchart.component.html"),
            styles: [__webpack_require__(/*! ./flowchart.component.scss */ "./src/app/ngFlowchart-svg/flowchart.component.scss")]
        })
    ], FlowchartComponent);
    return FlowchartComponent;
}());



/***/ }),

/***/ "./src/app/ngFlowchart-svg/flowchart.module.ts":
/*!*****************************************************!*\
  !*** ./src/app/ngFlowchart-svg/flowchart.module.ts ***!
  \*****************************************************/
/*! exports provided: SVGFlowchartModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SVGFlowchartModule", function() { return SVGFlowchartModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _flowchart_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./flowchart.component */ "./src/app/ngFlowchart-svg/flowchart.component.ts");
/* harmony import */ var _node_node_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node/node.component */ "./src/app/ngFlowchart-svg/node/node.component.ts");
/* harmony import */ var _edge_edge_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./edge/edge.component */ "./src/app/ngFlowchart-svg/edge/edge.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var SVGFlowchartModule = /** @class */ (function () {
    function SVGFlowchartModule() {
    }
    SVGFlowchartModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            declarations: [
                _flowchart_component__WEBPACK_IMPORTED_MODULE_4__["FlowchartComponent"],
                _node_node_component__WEBPACK_IMPORTED_MODULE_5__["NodeComponent"],
                _edge_edge_component__WEBPACK_IMPORTED_MODULE_6__["EdgeComponent"],
            ],
            exports: [_flowchart_component__WEBPACK_IMPORTED_MODULE_4__["FlowchartComponent"]],
            imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatIconModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatButtonModule"]],
            entryComponents: [],
            providers: []
        }),
        __metadata("design:paramtypes", [])
    ], SVGFlowchartModule);
    return SVGFlowchartModule;
}());



/***/ }),

/***/ "./src/app/ngFlowchart-svg/index.ts":
/*!******************************************!*\
  !*** ./src/app/ngFlowchart-svg/index.ts ***!
  \******************************************/
/*! exports provided: SVGFlowchartModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _flowchart_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./flowchart.module */ "./src/app/ngFlowchart-svg/flowchart.module.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SVGFlowchartModule", function() { return _flowchart_module__WEBPACK_IMPORTED_MODULE_0__["SVGFlowchartModule"]; });




/***/ }),

/***/ "./src/app/ngFlowchart-svg/node/node.actions.ts":
/*!******************************************************!*\
  !*** ./src/app/ngFlowchart-svg/node/node.actions.ts ***!
  \******************************************************/
/*! exports provided: ACTIONS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ACTIONS", function() { return ACTIONS; });
var ACTIONS;
(function (ACTIONS) {
    ACTIONS[ACTIONS["SELECT"] = 0] = "SELECT";
    ACTIONS[ACTIONS["DELETE"] = 1] = "DELETE";
    ACTIONS[ACTIONS["COPY"] = 2] = "COPY";
    ACTIONS[ACTIONS["CONNECT"] = 3] = "CONNECT";
    ACTIONS[ACTIONS["DRAGNODE"] = 4] = "DRAGNODE";
    ACTIONS[ACTIONS["DROPPORT"] = 5] = "DROPPORT";
    ACTIONS[ACTIONS["DRAGPORT"] = 6] = "DRAGPORT";
    ACTIONS[ACTIONS["PROCEDURE"] = 7] = "PROCEDURE";
})(ACTIONS || (ACTIONS = {}));


/***/ }),

/***/ "./src/app/ngFlowchart-svg/node/node.component.html":
/*!**********************************************************!*\
  !*** ./src/app/ngFlowchart-svg/node/node.component.html ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!-- svg group for the selectable and draggable area of normal node -->\r\n<svg:g (click)='nodeSelect($event)' draggable=\"true\" \r\n(mousedown)='startDragNode($event)' \r\n(dblclick)='switchToProcedure($event)'\r\n*ngIf='node.type==\"\"'>\r\n\r\n    <!-- rectangular box with border -->\r\n    <rect class=\"node\" \r\n    width=\"100\" height=\"80\"\r\n    [class.node--selected]='selected'\r\n    [class.node--error]=\"node.hasError\"\r\n    [class.node--disabled]='!node.enabled'\r\n    [attr.x]=\"node.position.x\" \r\n    [attr.y]=\"node.position.y\"\r\n    />\r\n\r\n    <!-- node description inside the rectangular box -->\r\n    <svg:foreignObject [attr.x]=\"node.position.x\" [attr.y]=\"node.position.y + 3\" \r\n    width=\"100\" height = \"80\"\r\n    (mousedown)='focusText($event)'>\r\n        <xhtml:div class='textdiv'>\r\n            <xhtml:textarea \r\n                id={{node.id}}\r\n                autocomplete=off \r\n                [(ngModel)]='node.name'\r\n                [class.selected]='selected'\r\n                [class.disabled]='!node.enabled'\r\n                title={{node.name}}\r\n                style=\"font-weight: 600;\"\r\n                placeholder='Description of Node'/>  \r\n        </xhtml:div>\r\n    </svg:foreignObject>\r\n</svg:g>\r\n\r\n<!-- svg group for the selectable and draggable area of start node -->\r\n<svg:g (click)='nodeSelect($event)' draggable=\"true\" \r\n(mousedown)='startDragNode($event)' \r\n(dblclick)='switchToProcedure($event)'\r\n*ngIf='node.type==\"start\"'>\r\n\r\n    <!-- ellipse with border -->\r\n    <ellipse class=\"node\" \r\n        [class.node--selected]='selected'\r\n        [class.node--error]=\"node.hasError\"\r\n        [attr.cx]=\"node.position.x + inputOffset[0]\" \r\n        [attr.cy]=\"node.position.y + (inputOffset[1]+outputOffset[1])/2 + 10\"\r\n        [attr.rx]=\"40\"\r\n        [attr.ry]=\"30\"\r\n        />\r\n\r\n    <!-- node description inside the ellipse -->\r\n    <svg:foreignObject \r\n    [attr.x]=\"node.position.x\" [attr.y]=\"node.position.y + 38\" \r\n    width=\"100\" height = \"40\">\r\n        <xhtml:div class='textdiv'>\r\n            <xhtml:textarea \r\n                id={{node.id}}\r\n                class='textarea_startend'\r\n                autocomplete=off \r\n                [class.selected]='selected'\r\n                [(ngModel)]='node.name'/>  \r\n        </xhtml:div>\r\n    </svg:foreignObject>\r\n</svg:g>\r\n\r\n<!-- svg group for the selectable and draggable area of end node -->\r\n<svg:g (click)='nodeSelect($event)' draggable=\"true\" \r\n(mousedown)='startDragNode($event)' \r\n(dblclick)='switchToProcedure($event)'\r\n*ngIf='node.type==\"end\"'>\r\n\r\n    <!-- ellipse with border -->\r\n    <ellipse class=\"node\" \r\n        [class.node--selected]='selected'\r\n        [class.node--error]=\"node.hasError\"\r\n        [class.node--disabled]='!node.enabled'\r\n        [attr.cx]=\"node.position.x + inputOffset[0]\" \r\n        [attr.cy]=\"node.position.y + (inputOffset[1]+outputOffset[1])/2 - 10\"\r\n        [attr.rx]=\"40\"\r\n        [attr.ry]=\"30\"\r\n        />\r\n\r\n    <!-- node description inside the ellipse -->\r\n    <svg:foreignObject [attr.x]=\"node.position.x\" [attr.y]=\"node.position.y + 18\" \r\n    width=\"100\" height = \"40\">\r\n        <xhtml:div class='textdiv'>\r\n            <xhtml:textarea \r\n                id={{node.id}}\r\n                class='textarea_startend'\r\n                autocomplete=off \r\n                [class.selected]='selected'\r\n                [class.disabled]='!node.enabled'\r\n                [(ngModel)]='node.name'/>  \r\n        </xhtml:div>\r\n    </svg:foreignObject>\r\n</svg:g>\r\n\r\n\r\n\r\n<!-- circles as draggable input/output ports of the node -->\r\n<svg:circle\r\nr=3\r\n[attr.cx]=\"node.position.x + inputOffset[0]\" \r\n[attr.cy]=\"node.position.y + inputOffset[1]\"\r\n*ngIf=\"inputDraggable()\" \r\nclass='inputPort'\r\nid = 'node.input.id'\r\n(mousedown)='startDragPort($event, \"input\")'/>\r\n\r\n<svg:circle *ngIf=\"outputDraggable()\" \r\nclass='outputPort'\r\nid = 'node.output.id'\r\n(mousedown)='startDragPort($event, \"output\")' \r\n[attr.cx]=\"node.position.x + outputOffset[0]\" \r\n[attr.cy]=\"node.position.y + outputOffset[1]\" \r\npointer-events=\"all\"\r\nr=3\r\nfill=\"black\"/>\r\n\r\n"

/***/ }),

/***/ "./src/app/ngFlowchart-svg/node/node.component.scss":
/*!**********************************************************!*\
  !*** ./src/app/ngFlowchart-svg/node/node.component.scss ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*\r\n$color-main: #2D4885;\r\n$color-accent: #50ABB9;\r\n$color-muted: #88D4DD;\r\n$color-text-accent: #DC772F;\r\n*/\n.node {\n  fill: #fafafa;\n  stroke-width: 2px;\n  stroke: #505050;\n  stroke-opacity: 1;\n  stroke-linecap: round;\n  stroke-linejoin: round; }\n.node.node--disabled {\n    stroke-opacity: 0.5;\n    fill-opacity: 0.5; }\n.node.node--selected {\n    stroke: #000096; }\n.node.node--error {\n    stroke: red; }\n.textdiv {\n  text-align: center;\n  width: 94px; }\n.foreignObject {\n  width: 100;\n  height: 80; }\ntextarea {\n  font-family: sans-serif;\n  background: transparent;\n  display: inline-block;\n  border: none;\n  font-size: 14px;\n  width: 100%;\n  height: 70px;\n  font-weight: 600;\n  text-align: center;\n  vertical-align: middle;\n  resize: none;\n  overflow: hidden;\n  color: #505050; }\ntextarea.selected {\n    color: #000096; }\ntextarea.disabled {\n    opacity: 0.5; }\n.textarea_startend {\n  font-size: 14px;\n  font-weight: 600;\n  color: #505050;\n  height: 20px;\n  pointer-events: none; }\n.inputPort {\n  stroke: transparent;\n  stroke-width: 20px;\n  pointer-events: all;\n  fill: #505050; }\n.outputPort {\n  stroke: transparent;\n  stroke-width: 20px;\n  pointer-events: all;\n  fill: #505050; }\n"

/***/ }),

/***/ "./src/app/ngFlowchart-svg/node/node.component.ts":
/*!********************************************************!*\
  !*** ./src/app/ngFlowchart-svg/node/node.component.ts ***!
  \********************************************************/
/*! exports provided: NodeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NodeComponent", function() { return NodeComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _node_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node.actions */ "./src/app/ngFlowchart-svg/node/node.actions.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var NodeComponent = /** @class */ (function () {
    function NodeComponent() {
        this.action = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.last = [0, 0];
        this.isDown = false;
    }
    /*
    update the position of the node
    */
    NodeComponent.prototype.updatePosition = function (position) {
        this.node.position = position;
    };
    ;
    /*
    select a node
    */
    NodeComponent.prototype.nodeSelect = function (event) {
        this.action.emit({ action: _node_actions__WEBPACK_IMPORTED_MODULE_1__["ACTIONS"].SELECT });
    };
    ;
    /*
    check if the input port of the node is draggable --> false only for start node, true otherwise
    */
    NodeComponent.prototype.inputDraggable = function () {
        return !(this.node.type == 'start');
    };
    /*
    check if the output port of the node is draggable --> false only for end node, true otherwise
    */
    NodeComponent.prototype.outputDraggable = function () {
        return !(this.node.type == 'end');
    };
    /*
    initiate dragging node when mousedown inside the node group
    */
    NodeComponent.prototype.startDragNode = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.action.emit({ action: _node_actions__WEBPACK_IMPORTED_MODULE_1__["ACTIONS"].DRAGNODE, data: event });
    };
    /*
    initiate dragging port when mousedown inside the port (inside the invisible stroke of the port)
    */
    NodeComponent.prototype.startDragPort = function (event, portType) {
        event.preventDefault();
        event.stopPropagation();
        var pos = this.node.position;
        var data;
        if (portType == 'input') {
            data = this.node.input;
            pos = [pos.x + this.inputOffset[0], pos.y + this.inputOffset[1]];
        }
        else {
            data = this.node.output;
            pos = [pos.x + this.outputOffset[0], pos.y + this.outputOffset[1]];
        }
        this.action.emit({ action: _node_actions__WEBPACK_IMPORTED_MODULE_1__["ACTIONS"].DRAGPORT, data: data, position: pos, type: portType });
    };
    /*
    focus on the description of the node when mouse down inside the node
    ** no stopPropagation to allow propagation to startDragNode --> node can still be dragged
    */
    NodeComponent.prototype.focusText = function (event) {
        document.getElementById(this.node.id).focus();
    };
    /*
    switch the viewchild of the appModule to the node's procedure view when double-click on the node
    */
    NodeComponent.prototype.switchToProcedure = function (event) {
        this.action.emit({ action: _node_actions__WEBPACK_IMPORTED_MODULE_1__["ACTIONS"].PROCEDURE });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], NodeComponent.prototype, "node", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], NodeComponent.prototype, "selected", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], NodeComponent.prototype, "inputOffset", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], NodeComponent.prototype, "outputOffset", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], NodeComponent.prototype, "action", void 0);
    NodeComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: '[node]',
            template: __webpack_require__(/*! ./node.component.html */ "./src/app/ngFlowchart-svg/node/node.component.html"),
            styles: [__webpack_require__(/*! ./node.component.scss */ "./src/app/ngFlowchart-svg/node/node.component.scss")]
        })
    ], NodeComponent);
    return NodeComponent;
}());



/***/ }),

/***/ "./src/app/shared/components/add-components/add_input.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/shared/components/add-components/add_input.component.ts ***!
  \*************************************************************************/
/*! exports provided: AddInputComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AddInputComponent", function() { return AddInputComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AddInputComponent = /** @class */ (function () {
    function AddInputComponent() {
    }
    AddInputComponent.prototype.addInput = function () {
        return;
        /*
        let newPort = PortUtils.getNewInput();
        newPort.parentNode = this.node;
        this.node.input.push(newPort);
        */
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], AddInputComponent.prototype, "node", void 0);
    AddInputComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'add-input',
            template: "<button (click)='addInput()'>AddInput</button>",
            styles: []
        }),
        __metadata("design:paramtypes", [])
    ], AddInputComponent);
    return AddInputComponent;
}());



/***/ }),

/***/ "./src/app/shared/components/add-components/add_node.component.ts":
/*!************************************************************************!*\
  !*** ./src/app/shared/components/add-components/add_node.component.ts ***!
  \************************************************************************/
/*! exports provided: AddNodeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AddNodeComponent", function() { return AddNodeComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _models_node__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @models/node */ "./src/app/shared/models/node/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AddNodeComponent = /** @class */ (function () {
    function AddNodeComponent() {
    }
    AddNodeComponent.prototype.addNode = function () { this.flowchart.nodes.push(_models_node__WEBPACK_IMPORTED_MODULE_1__["NodeUtils"].getNewNode()); };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], AddNodeComponent.prototype, "flowchart", void 0);
    AddNodeComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'add-node',
            template: "<button (click)='addNode()'>AddNode</button>",
            styles: []
        }),
        __metadata("design:paramtypes", [])
    ], AddNodeComponent);
    return AddNodeComponent;
}());



/***/ }),

/***/ "./src/app/shared/components/add-components/add_output.component.ts":
/*!**************************************************************************!*\
  !*** ./src/app/shared/components/add-components/add_output.component.ts ***!
  \**************************************************************************/
/*! exports provided: AddOutputComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AddOutputComponent", function() { return AddOutputComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AddOutputComponent = /** @class */ (function () {
    function AddOutputComponent() {
    }
    AddOutputComponent.prototype.addOutput = function () {
        return;
        /*
        let newPort = PortUtils.getNewOutput();
        newPort.parentNode = this.node;
        this.node.output.push(newPort);
        */
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], AddOutputComponent.prototype, "node", void 0);
    AddOutputComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'add-output',
            template: "<button (click)='addOutput()'>AddOutput</button>",
            styles: []
        }),
        __metadata("design:paramtypes", [])
    ], AddOutputComponent);
    return AddOutputComponent;
}());



/***/ }),

/***/ "./src/app/shared/components/execute/execute.component.ts":
/*!****************************************************************!*\
  !*** ./src/app/shared/components/execute/execute.component.ts ***!
  \****************************************************************/
/*! exports provided: ExecuteComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExecuteComponent", function() { return ExecuteComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _models_flowchart__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @models/flowchart */ "./src/app/shared/models/flowchart/index.ts");
/* harmony import */ var _models_code__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @models/code */ "./src/app/shared/models/code/index.ts");
/* harmony import */ var _modules__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @modules */ "./src/app/core/modules/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




var AsyncFunction = Object.getPrototypeOf(function () {
    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); });
}).constructor;
var ExecuteComponent = /** @class */ (function () {
    function ExecuteComponent() {
    }
    ExecuteComponent.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var p;
            var _this = this;
            return __generator(this, function (_a) {
                p = new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                    var _i, _a, node, funcStrings, _b, _c, func, _d, _e, _f, _g, node;
                    return __generator(this, function (_h) {
                        switch (_h.label) {
                            case 0:
                                this.globalVars = '';
                                // @ts-ignore
                                console.logs = [];
                                // reset input of all nodes except start
                                for (_i = 0, _a = this.flowchart.nodes; _i < _a.length; _i++) {
                                    node = _a[_i];
                                    if (node.type != 'start') {
                                        if (node.input.edges) {
                                            node.input.value = undefined;
                                        }
                                    }
                                }
                                // order the flowchart
                                if (!this.flowchart.ordered) {
                                    _models_flowchart__WEBPACK_IMPORTED_MODULE_1__["FlowchartUtils"].orderNodes(this.flowchart);
                                }
                                funcStrings = {};
                                _b = 0, _c = this.flowchart.functions;
                                _h.label = 1;
                            case 1:
                                if (!(_b < _c.length)) return [3 /*break*/, 4];
                                func = _c[_b];
                                _d = funcStrings;
                                _e = func.name;
                                return [4 /*yield*/, _models_code__WEBPACK_IMPORTED_MODULE_2__["CodeUtils"].getFunctionString(func)];
                            case 2:
                                _d[_e] = _h.sent();
                                _h.label = 3;
                            case 3:
                                _b++;
                                return [3 /*break*/, 1];
                            case 4:
                                _f = 0, _g = this.flowchart.nodes;
                                _h.label = 5;
                            case 5:
                                if (!(_f < _g.length)) return [3 /*break*/, 8];
                                node = _g[_f];
                                if (!node.enabled) {
                                    node.output.value = undefined;
                                    return [3 /*break*/, 7];
                                }
                                return [4 /*yield*/, this.executeNode(node, funcStrings)];
                            case 6:
                                _h.sent();
                                _h.label = 7;
                            case 7:
                                _f++;
                                return [3 /*break*/, 5];
                            case 8:
                                resolve('');
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/, p];
            });
        });
    };
    ExecuteComponent.prototype.executeNode = function (node, funcStrings) {
        return __awaiter(this, void 0, void 0, function () {
            var params, fnString, hasFunctions, funcName, mergeString, fn, result, constant, constString, ex_1, prodWithError_1, markError_1, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = { "currentProcedure": [''] };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, _models_code__WEBPACK_IMPORTED_MODULE_2__["CodeUtils"].getNodeCode(node, true)];
                    case 2:
                        fnString = _a.sent();
                        // add the constants from the start node
                        fnString = this.globalVars + fnString;
                        params["model"] = node.input.value;
                        hasFunctions = false;
                        for (funcName in funcStrings) {
                            fnString = funcStrings[funcName] + fnString;
                            hasFunctions = true;
                        }
                        if (hasFunctions) {
                            mergeString = _models_code__WEBPACK_IMPORTED_MODULE_2__["CodeUtils"].mergeInputs.toString();
                            fnString = 'function mergeInputs' + mergeString.substring(9, mergeString.length) + '\n\n' + fnString;
                        }
                        console.log(" ______________________________________________________________\n            \n/*    " + node.name.toUpperCase() + "    */\n            \n" + fnString + "--------------------------\n");
                        fn = new Function('__modules__', '__params__', fnString);
                        result = fn(_modules__WEBPACK_IMPORTED_MODULE_3__, params);
                        node.output.value = result;
                        if (node.type == 'start') {
                            for (constant in params["constants"]) {
                                constString = JSON.stringify(params["constants"][constant]);
                                this.globalVars += "const " + constant + " = " + constString + ";\n";
                            }
                            this.globalVars += '\n';
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        ex_1 = _a.sent();
                        node.hasError = true;
                        prodWithError_1 = params["currentProcedure"][0];
                        markError_1 = function (prod, id) {
                            if (prod["ID"] && id && prod["ID"] == id) {
                                prod.hasError = true;
                            }
                            if (prod.hasOwnProperty('children')) {
                                prod.children.map(function (p) {
                                    markError_1(p, id);
                                });
                            }
                        };
                        if (prodWithError_1 != '') {
                            node.procedure.map(function (prod) {
                                if (prod["ID"] == prodWithError_1) {
                                    prod.hasError = true;
                                }
                                if (prod.hasOwnProperty('children')) {
                                    prod.children.map(function (p) {
                                        markError_1(p, prodWithError_1);
                                    });
                                }
                            });
                        }
                        error = void 0;
                        if (ex_1.toString().indexOf("Unexpected identifier") > -1) {
                            error = new Error("Unexpected Identifier error. Did you declare everything? Check that your strings are enclosed in quotes (\")");
                        }
                        else if (ex_1.toString().indexOf("Unexpected token") > -1) {
                            error = new Error("Unexpected token error. Check for stray spaces or reserved keywords?");
                        }
                        else {
                            error = new Error(ex_1);
                        }
                        throw error;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], ExecuteComponent.prototype, "flowchart", void 0);
    ExecuteComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'execute',
            /*
            template: `<button class="btn--execute"
                              (click)="execute()">
                          Execute
                       </button>`,
              */
            template: "<button class=\"btn\" mat-icon-button title=\"Execute\" (click)=\"execute()\">\n    <mat-icon>play_circle_outline</mat-icon>\n    </button>\n    ",
            styles: [
                ".btn--execute{ \n                display: inline-block;\n                vertical-align: middle;\n                font-size: 14px;\n                line-height: 18px;\n                border: 3px solid #E0C229;\n                border-radius: 4px;\n                padding: 1px 10px;\n                background-color: #E0C229; \n                color: #494D59;\n                font-weight: 600;\n                text-transform: uppercase;\n              }\n              .btn{\n                vertical-align: middle;\n                background-color: transparent; \n                border: none;\n                color: rgb(80,80,80);\n              }\n              .btn:hover{\n                color: blue;\n              }"
            ]
        })
    ], ExecuteComponent);
    return ExecuteComponent;
}());



/***/ }),

/***/ "./src/app/shared/components/file/download.utils.ts":
/*!**********************************************************!*\
  !*** ./src/app/shared/components/file/download.utils.ts ***!
  \**********************************************************/
/*! exports provided: downloadUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "downloadUtils", function() { return downloadUtils; });
var downloadUtils = /** @class */ (function () {
    function downloadUtils() {
    }
    downloadUtils.downloadFile = function (fileName, fileContent) {
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(fileContent, fileName);
        }
        else {
            var a_1 = document.createElement('a');
            document.body.appendChild(a_1);
            var url_1 = window.URL.createObjectURL(fileContent);
            a_1.href = url_1;
            a_1.download = fileName;
            a_1.click();
            setTimeout(function () {
                window.URL.revokeObjectURL(url_1);
                document.body.removeChild(a_1);
            }, 0);
        }
    };
    return downloadUtils;
}());



/***/ }),

/***/ "./src/app/shared/components/file/index.ts":
/*!*************************************************!*\
  !*** ./src/app/shared/components/file/index.ts ***!
  \*************************************************/
/*! exports provided: SaveFileComponent, LoadFileComponent, NewFileComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _savefile_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./savefile.component */ "./src/app/shared/components/file/savefile.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SaveFileComponent", function() { return _savefile_component__WEBPACK_IMPORTED_MODULE_0__["SaveFileComponent"]; });

/* harmony import */ var _loadfile_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./loadfile.component */ "./src/app/shared/components/file/loadfile.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LoadFileComponent", function() { return _loadfile_component__WEBPACK_IMPORTED_MODULE_1__["LoadFileComponent"]; });

/* harmony import */ var _newfile_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./newfile.component */ "./src/app/shared/components/file/newfile.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NewFileComponent", function() { return _newfile_component__WEBPACK_IMPORTED_MODULE_2__["NewFileComponent"]; });






/***/ }),

/***/ "./src/app/shared/components/file/loadfile.component.ts":
/*!**************************************************************!*\
  !*** ./src/app/shared/components/file/loadfile.component.ts ***!
  \**************************************************************/
/*! exports provided: LoadFileComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoadFileComponent", function() { return LoadFileComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var circular_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! circular-json */ "./node_modules/circular-json/build/circular-json.node.js");
/* harmony import */ var circular_json__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(circular_json__WEBPACK_IMPORTED_MODULE_2__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var LoadFileComponent = /** @class */ (function () {
    function LoadFileComponent() {
        this.loaded = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        //   @ViewChild('fileInput') fileInput: ElementRef;
        //   openPicker(): void{
        //     let el: HTMLElement = this.fileInput.nativeElement as HTMLElement;
        //     el.click();
        //   }
        //   loadFile(url ?:string): void{
        //     let file = this.fileInput.nativeElement.files[0];
        //     if (file) {
        //         var reader = new FileReader();
        //         reader.readAsText(file, "UTF-8");
        //         let fs = this.flowchartService;
        //         reader.onload = function (evt) {
        //           let fileString: string = evt.target["result"];
        //           fs.loadFile(fileString);
        //         }
        //         reader.onerror = function (evt) {
        //             console.log("Error reading file");
        //         }
        //     }
        // this.flowchartService.loadFile(url);
    }
    LoadFileComponent.prototype.sendloadfile = function () {
        var _this = this;
        var selectedFile = document.getElementById('file-input').files[0];
        var stream = rxjs__WEBPACK_IMPORTED_MODULE_1__["Observable"].create(function (observer) {
            var reader = new FileReader();
            reader.onloadend = function () {
                //if (typeof reader.result === 'string') {}
                var f = circular_json__WEBPACK_IMPORTED_MODULE_2__["parse"](reader.result);
                var file = {
                    name: f.name,
                    author: f.author,
                    flowchart: f.flowchart,
                    last_updated: f.last_updated,
                    version: f.version
                };
                observer.next(file);
                observer.complete();
            };
            reader.readAsText(selectedFile);
        });
        stream.subscribe(function (loadeddata) {
            _this.loaded.emit(circular_json__WEBPACK_IMPORTED_MODULE_2__["stringify"](loadeddata));
        });
        document.getElementById('file-input').value = "";
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], LoadFileComponent.prototype, "loaded", void 0);
    LoadFileComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'file-load',
            template: "<button id='loadfile' class='btn' onclick=\"document.getElementById('file-input').click();\">Load</button>\n              <input id=\"file-input\" type=\"file\" name=\"name\" (change)=\"sendloadfile()\" style=\" display: none;\" />",
            styles: [
                "            \n            button.btn{ \n                margin: 0px 0px 0px 0px;\n                font-size: 10px;\n                line-height: 12px;\n                border: 2px solid gray;\n                border-radius: 4px;\n                padding: 2px 5px;\n                background-color: #3F4651; \n                color: #E7BF00;\n                font-weight: 600;\n                text-transform: uppercase;\n             }\n            button.btn:hover{\n                background-color: gray;\n                color: white;\n            }\n\n             "
            ]
        })
    ], LoadFileComponent);
    return LoadFileComponent;
}());



/***/ }),

/***/ "./src/app/shared/components/file/newfile.component.ts":
/*!*************************************************************!*\
  !*** ./src/app/shared/components/file/newfile.component.ts ***!
  \*************************************************************/
/*! exports provided: NewFileComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NewFileComponent", function() { return NewFileComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _models_flowchart__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @models/flowchart */ "./src/app/shared/models/flowchart/index.ts");
/* harmony import */ var circular_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! circular-json */ "./node_modules/circular-json/build/circular-json.node.js");
/* harmony import */ var circular_json__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(circular_json__WEBPACK_IMPORTED_MODULE_2__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var NewFileComponent = /** @class */ (function () {
    function NewFileComponent(cdr) {
        this.cdr = cdr;
        this.create = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
    NewFileComponent.prototype.sendNewFile = function () {
        var confirmed = confirm("Resetting would delete the current flowchart. Would you like to continue?");
        if (!confirmed)
            return;
        var file = {
            name: "default_file.mob",
            author: "new_user",
            flowchart: _models_flowchart__WEBPACK_IMPORTED_MODULE_1__["FlowchartUtils"].newflowchart(),
            last_updated: new Date(),
            version: 1
        };
        this.create.emit(circular_json__WEBPACK_IMPORTED_MODULE_2__["stringify"](file));
        this.cdr.detectChanges();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], NewFileComponent.prototype, "create", void 0);
    NewFileComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'file-new',
            template: "<button id='newfile' class='btn' (click)='sendNewFile()'>New</button>",
            styles: [
                "\n            button.btn{ \n                margin: 0px 0px 0px 0px;\n                font-size: 10px;\n                line-height: 12px;\n                border: 2px solid gray;\n                border-radius: 4px;\n                padding: 2px 5px;\n                background-color: #3F4651; \n                color: #E7BF00;\n                font-weight: 600;\n                text-transform: uppercase;\n            }\n            button.btn:hover{\n                background-color: gray;\n                color: white;\n            }\n             "
            ]
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"]])
    ], NewFileComponent);
    return NewFileComponent;
}());



/***/ }),

/***/ "./src/app/shared/components/file/savefile.component.ts":
/*!**************************************************************!*\
  !*** ./src/app/shared/components/file/savefile.component.ts ***!
  \**************************************************************/
/*! exports provided: SaveFileComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SaveFileComponent", function() { return SaveFileComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _download_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./download.utils */ "./src/app/shared/components/file/download.utils.ts");
/* harmony import */ var circular_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! circular-json */ "./node_modules/circular-json/build/circular-json.node.js");
/* harmony import */ var circular_json__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(circular_json__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _models_flowchart__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @models/flowchart */ "./src/app/shared/models/flowchart/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var SaveFileComponent = /** @class */ (function () {
    function SaveFileComponent() {
    }
    // todo: save file
    SaveFileComponent.prototype.download = function () {
        if (!this.file.flowchart.ordered) {
            _models_flowchart__WEBPACK_IMPORTED_MODULE_3__["FlowchartUtils"].orderNodes(this.file.flowchart);
        }
        var savedfile = circular_json__WEBPACK_IMPORTED_MODULE_2__["parse"](circular_json__WEBPACK_IMPORTED_MODULE_2__["stringify"](this.file));
        for (var _i = 0, _a = savedfile.flowchart.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            if (node.input.hasOwnProperty('value')) {
                node.input.value = undefined;
            }
            if (node.output.hasOwnProperty('value')) {
                node.output.value = undefined;
            }
            for (var _b = 0, _c = node.state.procedure; _b < _c.length; _b++) {
                var prod = _c[_b];
                prod.selected = false;
            }
            node.state.procedure = [];
        }
        // **** need to modify this when changing the input's constant function: 
        // **** this part resets the value of the last argument of the function when saving the file
        for (var _d = 0, _e = savedfile.flowchart.nodes[0].procedure; _d < _e.length; _d++) {
            var prod = _e[_d];
            prod.args[prod.argCount - 1].value = undefined;
        }
        savedfile.flowchart.meta.selected_nodes = [0];
        for (var _f = 0, _g = savedfile.flowchart.edges; _f < _g.length; _f++) {
            var edge = _g[_f];
            edge.selected = false;
        }
        savedfile.name = savedfile.flowchart.name;
        var fileString = circular_json__WEBPACK_IMPORTED_MODULE_2__["stringify"](savedfile);
        var fname = savedfile.flowchart.name.replace(/\ /g, '_') + ".mob";
        var blob = new Blob([fileString], { type: 'application/json' });
        _download_utils__WEBPACK_IMPORTED_MODULE_1__["downloadUtils"].downloadFile(fname, blob);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], SaveFileComponent.prototype, "file", void 0);
    SaveFileComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'file-save',
            template: "<button id='savefile' class='btn' (click)='download()'>Save</button>",
            styles: [
                "\n            button.btn{ \n                margin: 0px 0px 0px 0px;\n                font-size: 10px;\n                line-height: 12px;\n                border: 2px solid gray;\n                border-radius: 4px;\n                padding: 2px 5px;\n                background-color: #3F4651; \n                color: #E7BF00;\n                font-weight: 600;\n                text-transform: uppercase;\n             }\n            button.btn:hover{\n                background-color: gray;\n                color: white;\n            }\n             "
            ]
        })
    ], SaveFileComponent);
    return SaveFileComponent;
}());



/***/ }),

/***/ "./src/app/shared/components/header/header.component.ts":
/*!**************************************************************!*\
  !*** ./src/app/shared/components/header/header.component.ts ***!
  \**************************************************************/
/*! exports provided: HeaderComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HeaderComponent", function() { return HeaderComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var HeaderComponent = /** @class */ (function () {
    function HeaderComponent() {
    }
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], HeaderComponent.prototype, "node", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], HeaderComponent.prototype, "title", void 0);
    HeaderComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'panel-header',
            template: "<div class='panel__header'> \n                    <h3>{{node?.name}} // {{title}}</h3>\n              </div>",
            styles: [
                ".panel__header{ \n                font-weight: 600;\n                border: 2px solid #222;\n                border-radius: 4px;\n                padding: 5px;\n             }\n             h3{\n                margin: 0px;\n             }"
            ]
        }),
        __metadata("design:paramtypes", [])
    ], HeaderComponent);
    return HeaderComponent;
}());



/***/ }),

/***/ "./src/app/shared/components/navigation/navigation.component.ts":
/*!**********************************************************************!*\
  !*** ./src/app/shared/components/navigation/navigation.component.ts ***!
  \**********************************************************************/
/*! exports provided: NavigationComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NavigationComponent", function() { return NavigationComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var NavigationComponent = /** @class */ (function () {
    function NavigationComponent(_router) {
        this._router = _router;
        this._links = [
            { path: '/about',
                name: 'about'
            },
            { path: '/gallery',
                name: 'gallery'
            },
            { path: '/publish',
                name: 'publish'
            },
            { path: '/editor',
                name: 'editor'
            },
        ];
    }
    NavigationComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'navigation',
            template: "<ul class='nav'>\n                <li class='link' *ngFor='let link of _links;' \n                      [class.active]='link.path == _router.url'\n                      [routerLink]=\"link.path\" \n                      >{{link.name}}</li>\n              </ul>",
            styles: ["\n      ul.nav{\n        margin: 0px;\n        padding: 0px;\n      }\n\n      li.link{\n        display: inline;\n        border: 2px solid gray;\n        border-radius: 4px;\n        margin: 15px 15px 15px 0px;\n        padding: 5px;\n        text-transform: uppercase;\n        font-weight: 600;\n        cursor: pointer;\n        font-size: 16px;\n      }\n\n      li.link:hover{\n        background-color: gray;\n        color: white;\n      }\n\n      .active{\n        background-color: #222;\n        color: white;\n        border-color: #222 !important;\n      }\n  "],
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
    ], NavigationComponent);
    return NavigationComponent;
}());



/***/ }),

/***/ "./src/app/shared/components/not-found/not-found.component.html":
/*!**********************************************************************!*\
  !*** ./src/app/shared/components/not-found/not-found.component.html ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h1>Page Not Found</h1>\r\n<p>Dolore ex aliqua ut incididunt laborum deserunt pariatur officia.</p>\r\n"

/***/ }),

/***/ "./src/app/shared/components/not-found/not-found.component.scss":
/*!**********************************************************************!*\
  !*** ./src/app/shared/components/not-found/not-found.component.scss ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/shared/components/not-found/not-found.component.ts":
/*!********************************************************************!*\
  !*** ./src/app/shared/components/not-found/not-found.component.ts ***!
  \********************************************************************/
/*! exports provided: PageNotFoundComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PageNotFoundComponent", function() { return PageNotFoundComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var PageNotFoundComponent = /** @class */ (function () {
    function PageNotFoundComponent() {
    }
    PageNotFoundComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'page-not-found',
            template: __webpack_require__(/*! ./not-found.component.html */ "./src/app/shared/components/not-found/not-found.component.html"),
            styles: [__webpack_require__(/*! ./not-found.component.scss */ "./src/app/shared/components/not-found/not-found.component.scss")],
        }),
        __metadata("design:paramtypes", [])
    ], PageNotFoundComponent);
    return PageNotFoundComponent;
}());



/***/ }),

/***/ "./src/app/shared/components/parameter-viewer/input-port-viewer/input-port-viewer.component.html":
/*!*******************************************************************************************************!*\
  !*** ./src/app/shared/components/parameter-viewer/input-port-viewer/input-port-viewer.component.html ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class='container container--parameter'>\r\n\r\n    <div class='parameter__name'>{{ port.name }}</div>\r\n\r\n    <!-- Slider, SimpleInput ... etc -->\r\n    <div class='parameter__mode' [ngSwitch]=\"port.meta.mode\">\r\n        \r\n        <!-- Simple Input Template -->\r\n        <div *ngSwitchCase=\"PortTypes.SimpleInput\">\r\n            <input [(ngModel)]='port.value' name='port.name' placeholder='Enter Value: Defaults to {{port.default}}'> \r\n        </div>\r\n\r\n        <div *ngSwitchCase=\"PortTypes.Slider\">\r\n            <!-- <input  placeholder='Enter Value: Defaults to {{port.default}}'> -->\r\n            <input [(ngModel)]='port.value' value='port.value' placeholder='{{port.default}}' disabled>\r\n            <input [(ngModel)]='port.value' name='port.name' placeholder='{{port.default}}' type=\"range\">\r\n        </div>\r\n\r\n        <div *ngSwitchCase=\"PortTypes.Checkbox\">\r\n            <input *ngSwitchCase=\"PortTypes.Checkbox\" [(ngModel)]='port.value' name='port.name' type=\"checkbox\">\r\n        </div>\r\n\r\n        <div *ngSwitchCase=\"PortTypes.URL\">\r\n            <input [(ngModel)]='port.value' name='port.name' placeholder='Enter URL: Defaults to {{port.default}}'> \r\n        </div>\r\n        <div *ngSwitchCase=\"PortTypes.File\">\r\n            <input (change)=\"onFileChange($event)\" type=\"file\">\r\n        </div>\r\n    \r\n        <!-- TODO1: SwitchCase for remaining PortTypes -->\r\n        <!-- TODO2: Connect values to port.value -->\r\n    \r\n    </div>\r\n\r\n</div>"

/***/ }),

/***/ "./src/app/shared/components/parameter-viewer/input-port-viewer/input-port-viewer.component.scss":
/*!*******************************************************************************************************!*\
  !*** ./src/app/shared/components/parameter-viewer/input-port-viewer/input-port-viewer.component.scss ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".container {\n  margin: 5px 0px; }\n\n.container--parameter {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap; }\n\n.parameter__name {\n  width: 100px;\n  height: auto;\n  word-wrap: break-word; }\n"

/***/ }),

/***/ "./src/app/shared/components/parameter-viewer/input-port-viewer/input-port-viewer.component.ts":
/*!*****************************************************************************************************!*\
  !*** ./src/app/shared/components/parameter-viewer/input-port-viewer/input-port-viewer.component.ts ***!
  \*****************************************************************************************************/
/*! exports provided: InputPortViewerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InputPortViewerComponent", function() { return InputPortViewerComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _models_port__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @models/port */ "./src/app/shared/models/port/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var InputPortViewerComponent = /** @class */ (function () {
    function InputPortViewerComponent() {
        this.PortTypes = _models_port__WEBPACK_IMPORTED_MODULE_1__["InputType"];
    }
    InputPortViewerComponent.prototype.onFileChange = function (event) {
        this.port.value = event.target.files[0];
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], InputPortViewerComponent.prototype, "port", void 0);
    InputPortViewerComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'input-port-viewer',
            template: __webpack_require__(/*! ./input-port-viewer.component.html */ "./src/app/shared/components/parameter-viewer/input-port-viewer/input-port-viewer.component.html"),
            styles: [__webpack_require__(/*! ./input-port-viewer.component.scss */ "./src/app/shared/components/parameter-viewer/input-port-viewer/input-port-viewer.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], InputPortViewerComponent);
    return InputPortViewerComponent;
}());



/***/ }),

/***/ "./src/app/shared/components/parameter-viewer/parameter-viewer.component.html":
/*!************************************************************************************!*\
  !*** ./src/app/shared/components/parameter-viewer/parameter-viewer.component.html ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h2>{{flowchart.name}}</h2>\r\n<p>{{flowchart.description}}</p>\r\n<hr>\r\n\r\n<!-- <p>Edit the parameters of your flowchart here. These parameters are visible in the viewer when you share your flowchart.</p> -->\r\n<procedure-input-viewer *ngFor=\"let prod of startNode.procedure\" [prod]=\"prod\"></procedure-input-viewer>\r\n"

/***/ }),

/***/ "./src/app/shared/components/parameter-viewer/parameter-viewer.component.scss":
/*!************************************************************************************!*\
  !*** ./src/app/shared/components/parameter-viewer/parameter-viewer.component.scss ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".container {\n  background-color: transparent;\n  width: auto;\n  height: auto;\n  display: flex;\n  flex-direction: column;\n  flex-wrap: wrap; }\n\nh2 {\n  color: #505050;\n  text-align: left;\n  padding-left: 15px;\n  font-size: 12px;\n  line-height: 16px; }\n\np {\n  color: #505050;\n  text-align: left;\n  padding-left: 15px;\n  font-size: 12px;\n  line-height: 14px; }\n\nhr {\n  border-top: 2px solid #efefef; }\n\ndiv[class^=\"container--\"] {\n  display: flex;\n  flex-direction: column;\n  margin: 10px 0px; }\n"

/***/ }),

/***/ "./src/app/shared/components/parameter-viewer/parameter-viewer.component.ts":
/*!**********************************************************************************!*\
  !*** ./src/app/shared/components/parameter-viewer/parameter-viewer.component.ts ***!
  \**********************************************************************************/
/*! exports provided: ParameterViewerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ParameterViewerComponent", function() { return ParameterViewerComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ParameterViewerComponent = /** @class */ (function () {
    function ParameterViewerComponent() {
    }
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], ParameterViewerComponent.prototype, "flowchart", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], ParameterViewerComponent.prototype, "startNode", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], ParameterViewerComponent.prototype, "endNode", void 0);
    ParameterViewerComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'parameter-viewer',
            template: __webpack_require__(/*! ./parameter-viewer.component.html */ "./src/app/shared/components/parameter-viewer/parameter-viewer.component.html"),
            styles: [__webpack_require__(/*! ./parameter-viewer.component.scss */ "./src/app/shared/components/parameter-viewer/parameter-viewer.component.scss")]
        })
    ], ParameterViewerComponent);
    return ParameterViewerComponent;
}());



/***/ }),

/***/ "./src/app/shared/components/parameter-viewer/procedure-input-viewer/procedure-input-viewer.component.html":
/*!*****************************************************************************************************************!*\
  !*** ./src/app/shared/components/parameter-viewer/procedure-input-viewer/procedure-input-viewer.component.html ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class='container'>\r\n    <div class='container--parameter'>\r\n        <input [class.disabled-input]='true' value='{{prod.args[prod.argCount-2].value||\"Undefined\"}}:' disabled>\r\n        <!--\r\n        <select name={{prod.id}}_type [(ngModel)]=\"prod.meta.inputMode\">\r\n            <option \r\n                *ngFor=\"let ptype of PortTypesArr\" \r\n                [value]=\"PortTypes[ptype]\" \r\n                [selected]=\"prod.meta.inputMode == ptype\">{{ptype}}</option>\r\n        </select>\r\n        -->\r\n        <ng-container class='parameter__name' [ngSwitch]=\"prod.meta.inputMode\">\r\n            <!--\r\n\r\n            <div *ngSwitchCase=\"PortTypes.SimpleInput\">\r\n                <input [(ngModel)]='port.value' name='port.name' placeholder='Enter Value: Defaults to {{port.default}}'> \r\n            </div>\r\n\r\n            <div *ngSwitchCase=\"PortTypes.Slider\">\r\n                <input [(ngModel)]='port.value' value='port.value' placeholder='{{port.default}}' disabled>\r\n                <input [(ngModel)]='port.value' name='port.name' placeholder='{{port.default}}' type=\"range\">\r\n            </div>\r\n\r\n            <div *ngSwitchCase=\"PortTypes.Checkbox\">\r\n                <input *ngSwitchCase=\"PortTypes.Checkbox\" [(ngModel)]='port.value' name='port.name' type=\"checkbox\">\r\n            </div>\r\n\r\n            <div *ngSwitchCase=\"PortTypes.URL\">\r\n                <input [(ngModel)]='port.value' name='port.name' placeholder='Enter URL: Defaults to {{port.default}}'> \r\n            </div>\r\n            <div *ngSwitchCase=\"PortTypes.File\">\r\n                <input (change)=\"onFileChange($event)\" type=\"file\">\r\n            </div>\r\n        \r\n            -->\r\n\r\n            <input *ngSwitchCase=\"PortTypes.SimpleInput\" [(ngModel)]='prod.args[prod.argCount-1].value' \r\n            placeholder='{{prod.args[prod.argCount-1].default}}'\r\n            size={{prod.args[prod.argCount-1].value?.length||prod.args[prod.argCount-1].default.length}}>\r\n            \r\n            <ng-container *ngSwitchCase=\"PortTypes.Slider\">\r\n                <mat-slider\r\n                    [(ngModel)]='prod.args[prod.argCount-1].value'\r\n                    thumbLabel\r\n                    tickInterval=\"auto\"\r\n                    min={{prod.args[prod.argCount-1].min||0}}\r\n                    max={{prod.args[prod.argCount-1].max||100}}></mat-slider>\r\n                <input [class.disabled-input]='true' [(ngModel)]='prod.args[prod.argCount-1].value' size={{prod.args[prod.argCount-1].value?.length||1}} disabled>\r\n\r\n\r\n                <!--\r\n                <input [(ngModel)]='prod.args[prod.argCount-1].value' name='prod.args[prod.argCount-1].value' type=\"range\" placeholder='{{prod.args[prod.argCount-1].default}}'>\r\n                <input [(ngModel)]='prod.args[prod.argCount-1].value' value='prod.args[prod.argCount-1].value'  placeholder='{{prod.args[prod.argCount-1].default}}' disabled>\r\n                -->\r\n            </ng-container>\r\n            <input *ngSwitchCase=\"PortTypes.Checkbox\" [(ngModel)]='prod.args[prod.argCount-1].value' type=\"checkbox\">\r\n            <input *ngSwitchCase=\"PortTypes.URL\" [(ngModel)]='prod.args[prod.argCount-1].value' placeholder='Enter URL: Defaults to {{prod.args[prod.argCount-1].default}}'>\r\n            <input *ngSwitchCase=\"PortTypes.File\" (change)=\"onFileChange($event)\" type=\"file\">\r\n        </ng-container>\r\n    </div>\r\n</div>\r\n\r\n"

/***/ }),

/***/ "./src/app/shared/components/parameter-viewer/procedure-input-viewer/procedure-input-viewer.component.scss":
/*!*****************************************************************************************************************!*\
  !*** ./src/app/shared/components/parameter-viewer/procedure-input-viewer/procedure-input-viewer.component.scss ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".container {\n  display: block;\n  margin: 5px 0px 0px 5px;\n  width: 100%; }\n\n.container--parameter {\n  display: inline-block;\n  flex-direction: row;\n  flex-wrap: wrap;\n  bottom: 0px;\n  padding-bottom: 5px;\n  border-bottom: 1px solid #efefef;\n  border-left: 1px solid #efefef;\n  width: 100%; }\n\n.container--input {\n  display: inline-flex;\n  flex-direction: row; }\n\ninput {\n  color: #505050;\n  background-color: gainsboro;\n  border: none;\n  border-bottom: 1px solid #505050;\n  margin-left: 5px;\n  vertical-align: bottom; }\n\ninput.disabled-input {\n    border-bottom: none; }\n\n.parameter__name {\n  display: inline-block;\n  flex-direction: row;\n  flex-wrap: wrap;\n  width: 100px; }\n\nmat-slider {\n  width: 300px; }\n"

/***/ }),

/***/ "./src/app/shared/components/parameter-viewer/procedure-input-viewer/procedure-input-viewer.component.ts":
/*!***************************************************************************************************************!*\
  !*** ./src/app/shared/components/parameter-viewer/procedure-input-viewer/procedure-input-viewer.component.ts ***!
  \***************************************************************************************************************/
/*! exports provided: procedureInputViewerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "procedureInputViewerComponent", function() { return procedureInputViewerComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _models_port__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @models/port */ "./src/app/shared/models/port/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var procedureInputViewerComponent = /** @class */ (function () {
    function procedureInputViewerComponent() {
        this.delete = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.PortTypes = _models_port__WEBPACK_IMPORTED_MODULE_1__["InputType"];
    }
    procedureInputViewerComponent.prototype.editOptions = function () { };
    procedureInputViewerComponent.prototype.onFileChange = function (event) {
        this.prod.args[this.prod.argCount - 1].value = event.target.files[0];
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], procedureInputViewerComponent.prototype, "prod", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], procedureInputViewerComponent.prototype, "delete", void 0);
    procedureInputViewerComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'procedure-input-viewer',
            template: __webpack_require__(/*! ./procedure-input-viewer.component.html */ "./src/app/shared/components/parameter-viewer/procedure-input-viewer/procedure-input-viewer.component.html"),
            styles: [__webpack_require__(/*! ./procedure-input-viewer.component.scss */ "./src/app/shared/components/parameter-viewer/procedure-input-viewer/procedure-input-viewer.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], procedureInputViewerComponent);
    return procedureInputViewerComponent;
}());



/***/ }),

/***/ "./src/app/shared/decorators/index.ts":
/*!********************************************!*\
  !*** ./src/app/shared/decorators/index.ts ***!
  \********************************************/
/*! exports provided: ModuleAware, ProcedureTypesAware, ViewerTypesAware, PortTypesAware */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _module_aware_decorator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./module-aware.decorator */ "./src/app/shared/decorators/module-aware.decorator.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ModuleAware", function() { return _module_aware_decorator__WEBPACK_IMPORTED_MODULE_0__["ModuleAware"]; });

/* harmony import */ var _prodtypes_aware_decorator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./prodtypes-aware.decorator */ "./src/app/shared/decorators/prodtypes-aware.decorator.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ProcedureTypesAware", function() { return _prodtypes_aware_decorator__WEBPACK_IMPORTED_MODULE_1__["ProcedureTypesAware"]; });

/* harmony import */ var _viewertypes_aware_decorator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./viewertypes-aware.decorator */ "./src/app/shared/decorators/viewertypes-aware.decorator.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ViewerTypesAware", function() { return _viewertypes_aware_decorator__WEBPACK_IMPORTED_MODULE_2__["ViewerTypesAware"]; });

/* harmony import */ var _porttypes_aware_decorator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./porttypes-aware.decorator */ "./src/app/shared/decorators/porttypes-aware.decorator.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PortTypesAware", function() { return _porttypes_aware_decorator__WEBPACK_IMPORTED_MODULE_3__["PortTypesAware"]; });







/***/ }),

/***/ "./src/app/shared/decorators/module-aware.decorator.ts":
/*!*************************************************************!*\
  !*** ./src/app/shared/decorators/module-aware.decorator.ts ***!
  \*************************************************************/
/*! exports provided: ModuleAware */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ModuleAware", function() { return ModuleAware; });
/* harmony import */ var _modules__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @modules */ "./src/app/core/modules/index.ts");
//import * as doc from '@assets/typedoc-json/doc.json';
var doc = __webpack_require__(/*! @assets/typedoc-json/doc.json */ "./src/assets/typedoc-json/doc.json");

// todo: bug fix for defaults
function extract_params(func) {
    var fnStr = func.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, '');
    var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).split(","); //.match( /([^\s,]+)/g);
    if (result === null || result[0] == "") {
        result = [];
    }
    var final_result = result.map(function (r) {
        r = r.trim();
        var r_value = r.split("=");
        if (r_value.length == 1) {
            return { name: r_value[0].trim(), value: undefined, default: 0 };
        }
        else {
            return { name: r_value[0].trim(), value: undefined, default: 0 };
        }
    });
    var hasReturn = true;
    if (fnStr.indexOf("return") === -1 || fnStr.indexOf("return;") !== -1) {
        hasReturn = false;
    }
    return [final_result, hasReturn];
}
function extract_docs() {
    var docs = {};
    for (var _i = 0, _a = doc.children; _i < _a.length; _i++) {
        var mod = _a[_i];
        if (mod.name.substr(1, 1) == '_' || mod.name == '"index"') {
            continue;
        }
        var modName = mod.name.substr(1, mod.name.length - 2);
        var moduleDoc = {};
        for (var _b = 0, _c = mod.children; _b < _c.length; _b++) {
            var func = _c[_b];
            var fn = {};
            fn["name"] = func.name;
            fn["description"] = func["signatures"][0].comment.shortText;
            if (func["signatures"][0].comment.tags) {
                for (var _d = 0, _e = func["signatures"][0].comment.tags; _d < _e.length; _d++) {
                    var fnTag = _e[_d];
                    if (fnTag.tag == 'summary')
                        fn["summary"] = fnTag.text;
                }
            }
            fn["returns"] = func["signatures"][0].comment.returns;
            if (fn["returns"])
                fn["returns"] = fn["returns"].trim();
            fn["parameters"] = [];
            if (func["signatures"][0].parameters) {
                for (var _f = 0, _g = func["signatures"][0].parameters; _f < _g.length; _f++) {
                    var param = _g[_f];
                    var namecheck = true;
                    for (var systemVarName in _modules__WEBPACK_IMPORTED_MODULE_0__["_parameterTypes"]) {
                        if (param.name == _modules__WEBPACK_IMPORTED_MODULE_0__["_parameterTypes"][systemVarName]) {
                            namecheck = false;
                            break;
                        }
                    }
                    if (!namecheck)
                        continue;
                    var pr = {};
                    pr["name"] = param.name;
                    pr["description"] = param.comment.shortText || param.comment.text;
                    if (param.type.type == 'array') {
                        pr["type"] = param.type.elementType.name + "[]";
                    }
                    else if (param.type.type == "intrinsic") {
                        pr["type"] = param.type.name;
                    }
                    else {
                        /**
                         * TODO: Update param type here
                         */
                        console.log('param type requires updating:', param.type);
                        pr["type"] = param.type.type;
                    }
                    fn["parameters"].push(pr);
                }
            }
            moduleDoc[func.name] = fn;
        }
        docs[modName] = moduleDoc;
    }
    return docs;
}
function ModuleAware(constructor) {
    var module_list = [];
    for (var m_name in _modules__WEBPACK_IMPORTED_MODULE_0__) {
        if (m_name[0] == '_' || m_name == 'gs' || m_name == 'gsConstructor') {
            continue;
        }
        var modObj = {};
        modObj.module = m_name;
        modObj.functions = [];
        for (var _i = 0, _a = Object.keys(_modules__WEBPACK_IMPORTED_MODULE_0__[m_name]); _i < _a.length; _i++) {
            var fn_name = _a[_i];
            var func = _modules__WEBPACK_IMPORTED_MODULE_0__[m_name][fn_name];
            var fnObj = {};
            fnObj.module = m_name;
            fnObj.name = fn_name;
            fnObj.argCount = func.length;
            var args = extract_params(func);
            fnObj.args = args[0];
            fnObj.hasReturn = args[1];
            modObj.functions.push(fnObj);
        }
        module_list.push(modObj);
    }
    constructor.prototype.Modules = module_list;
    constructor.prototype.ModulesDoc = extract_docs();
}


/***/ }),

/***/ "./src/app/shared/decorators/porttypes-aware.decorator.ts":
/*!****************************************************************!*\
  !*** ./src/app/shared/decorators/porttypes-aware.decorator.ts ***!
  \****************************************************************/
/*! exports provided: PortTypesAware */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PortTypesAware", function() { return PortTypesAware; });
/* harmony import */ var _models_port__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @models/port */ "./src/app/shared/models/port/index.ts");

function PortTypesAware(constructor) {
    constructor.prototype.PortTypes = _models_port__WEBPACK_IMPORTED_MODULE_0__["InputType"];
    // array form
    var keys = Object.keys(_models_port__WEBPACK_IMPORTED_MODULE_0__["InputType"]);
    constructor.prototype.PortTypesArr = keys.slice(keys.length / 2);
}


/***/ }),

/***/ "./src/app/shared/decorators/prodtypes-aware.decorator.ts":
/*!****************************************************************!*\
  !*** ./src/app/shared/decorators/prodtypes-aware.decorator.ts ***!
  \****************************************************************/
/*! exports provided: ProcedureTypesAware */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProcedureTypesAware", function() { return ProcedureTypesAware; });
/* harmony import */ var _models_procedure__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @models/procedure */ "./src/app/shared/models/procedure/index.ts");

function ProcedureTypesAware(constructor) {
    constructor.prototype.ProcedureTypes = _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"];
    // array form
    var keys = Object.keys(_models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"]);
    constructor.prototype.ProcedureTypesArr = keys.slice(keys.length / 2);
}


/***/ }),

/***/ "./src/app/shared/decorators/viewertypes-aware.decorator.ts":
/*!******************************************************************!*\
  !*** ./src/app/shared/decorators/viewertypes-aware.decorator.ts ***!
  \******************************************************************/
/*! exports provided: ViewerTypesAware */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewerTypesAware", function() { return ViewerTypesAware; });
/* harmony import */ var _models_port__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @models/port */ "./src/app/shared/models/port/index.ts");

function ViewerTypesAware(constructor) {
    constructor.prototype.ViewerTypes = _models_port__WEBPACK_IMPORTED_MODULE_0__["OutputType"];
    // array form
    var keys = Object.keys(_models_port__WEBPACK_IMPORTED_MODULE_0__["OutputType"]);
    constructor.prototype.ViewerTypesArr = keys.slice(keys.length / 2);
}


/***/ }),

/***/ "./src/app/shared/directives/filesys/index.ts":
/*!****************************************************!*\
  !*** ./src/app/shared/directives/filesys/index.ts ***!
  \****************************************************/
/*! exports provided: MbFileReaderDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mobfile_reader_directive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mobfile-reader.directive */ "./src/app/shared/directives/filesys/mobfile-reader.directive.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MbFileReaderDirective", function() { return _mobfile_reader_directive__WEBPACK_IMPORTED_MODULE_0__["MbFileReaderDirective"]; });




/***/ }),

/***/ "./src/app/shared/directives/filesys/mobfile-reader.directive.ts":
/*!***********************************************************************!*\
  !*** ./src/app/shared/directives/filesys/mobfile-reader.directive.ts ***!
  \***********************************************************************/
/*! exports provided: MbFileReaderDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MbFileReaderDirective", function() { return MbFileReaderDirective; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var circular_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! circular-json */ "./node_modules/circular-json/build/circular-json.node.js");
/* harmony import */ var circular_json__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(circular_json__WEBPACK_IMPORTED_MODULE_1__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/*
 *	Adding this to an HTML5 input element
 *	allows for the file being read to be converted into a Mobius
 *	Flowchart
 *
 */


var MbFileReaderDirective = /** @class */ (function () {
    function MbFileReaderDirective(el) {
        this.el = el;
        this.data = {};
        this.load = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
    MbFileReaderDirective.prototype.onFileChange = function () {
        var f = this.el.nativeElement.files[0];
        if (f) {
            var reader = new FileReader();
            reader.readAsText(f, "UTF-8");
            var ins_1 = this;
            reader.onload = function (evt) {
                var fileString = evt.target["result"];
                ins_1.load_flowchart_from_string(fileString);
            };
            reader.onerror = function (evt) {
                console.log("Error reading file");
            };
        }
    };
    //
    // Input: string
    // Output: MobiusFile DS
    //  
    //
    MbFileReaderDirective.prototype.load_flowchart_from_string = function (fileString) {
        var _this = this;
        var jsonData;
        var flowchart; // IFlowchart;
        try {
            var data = circular_json__WEBPACK_IMPORTED_MODULE_1__["parse"](fileString);
            this.load.emit(data);
            // this.data.flowchart = data.flowchart; 
            // this.data.modules = data.modules;
            // this.data.language = data.language;
            // this.update_code_generator(CodeFactory.getCodeGenerator(data["language"]));
            //TODO: this.update_modules();
            //flowchart = FlowchartReader.read_flowchart_from_data(data["flowchart"]);
            // TODO: select a node
        }
        catch (err) {
            console.error("Mob-file-reader error", err);
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], MbFileReaderDirective.prototype, "data", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], MbFileReaderDirective.prototype, "load", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostListener"])("change"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], MbFileReaderDirective.prototype, "onFileChange", null);
    MbFileReaderDirective = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"])({
            selector: "[mbFileReader]"
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]])
    ], MbFileReaderDirective);
    return MbFileReaderDirective;
}());



/***/ }),

/***/ "./src/app/shared/directives/textarea/autogrow.directive.ts":
/*!******************************************************************!*\
  !*** ./src/app/shared/directives/textarea/autogrow.directive.ts ***!
  \******************************************************************/
/*! exports provided: autogrowDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "autogrowDirective", function() { return autogrowDirective; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var autogrowDirective = /** @class */ (function () {
    function autogrowDirective(el) {
        this.el = el;
    }
    autogrowDirective.prototype.onKeyUp = function () {
        this.el.nativeElement.style.height = "5px";
        this.el.nativeElement.style.height = (this.el.nativeElement.scrollHeight) + "px";
    };
    autogrowDirective.prototype.onKeyDown = function () {
        this.el.nativeElement.style.height = "5px";
        this.el.nativeElement.style.height = (this.el.nativeElement.scrollHeight) + "px";
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostListener"])("keyup"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], autogrowDirective.prototype, "onKeyUp", null);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostListener"])("keydown"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], autogrowDirective.prototype, "onKeyDown", null);
    autogrowDirective = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"])({
            selector: "[autogrow]"
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]])
    ], autogrowDirective);
    return autogrowDirective;
}());



/***/ }),

/***/ "./src/app/shared/directives/textarea/index.ts":
/*!*****************************************************!*\
  !*** ./src/app/shared/directives/textarea/index.ts ***!
  \*****************************************************/
/*! exports provided: autogrowDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _autogrow_directive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./autogrow.directive */ "./src/app/shared/directives/textarea/autogrow.directive.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "autogrowDirective", function() { return _autogrow_directive__WEBPACK_IMPORTED_MODULE_0__["autogrowDirective"]; });




/***/ }),

/***/ "./src/app/shared/models/code/code.utils.ts":
/*!**************************************************!*\
  !*** ./src/app/shared/models/code/code.utils.ts ***!
  \**************************************************/
/*! exports provided: CodeUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CodeUtils", function() { return CodeUtils; });
/* harmony import */ var _models_procedure__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @models/procedure */ "./src/app/shared/models/procedure/index.ts");
/* harmony import */ var _models_port__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @models/port */ "./src/app/shared/models/port/index.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var circular_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! circular-json */ "./node_modules/circular-json/build/circular-json.node.js");
/* harmony import */ var circular_json__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(circular_json__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _modules__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @modules */ "./src/app/core/modules/index.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};





var CodeUtils = /** @class */ (function () {
    function CodeUtils() {
    }
    CodeUtils.getProcedureCode = function (prod, existingVars, addProdArr) {
        return __awaiter(this, void 0, void 0, function () {
            var codeStr, args, prefix, _a, argVals, _loop_1, _i, _b, arg, argValues, fnCall, argsVals, fn, _c, _d, p, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (prod.enabled === false)
                            return [2 /*return*/, ''];
                        prod.hasError = false;
                        codeStr = [];
                        args = prod.args;
                        prefix = args.hasOwnProperty('0') && existingVars.indexOf(args[0].value) === -1 ? 'let ' : '';
                        codeStr.push('');
                        if (addProdArr && prod.type != _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].Else && prod.type != _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].Elseif) {
                            codeStr.push("__params__.currentProcedure[0] = \"" + prod.ID + "\";");
                        }
                        _a = prod.type;
                        switch (_a) {
                            case _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].Variable: return [3 /*break*/, 1];
                            case _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].If: return [3 /*break*/, 2];
                            case _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].Else: return [3 /*break*/, 3];
                            case _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].Elseif: return [3 /*break*/, 4];
                            case _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].Foreach: return [3 /*break*/, 5];
                            case _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].While: return [3 /*break*/, 6];
                            case _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].Break: return [3 /*break*/, 7];
                            case _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].Continue: return [3 /*break*/, 8];
                            case _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].Function: return [3 /*break*/, 9];
                            case _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].Imported: return [3 /*break*/, 15];
                        }
                        return [3 /*break*/, 16];
                    case 1:
                        if (args[0].value.indexOf('__params__') != -1 || args[1].value.indexOf('__params__') != -1)
                            throw new Error("Unexpected Identifier");
                        codeStr.push("" + prefix + args[0].value + " = " + args[1].value + ";");
                        if (prefix === 'let ') {
                            existingVars.push(args[0].value);
                        }
                        return [3 /*break*/, 16];
                    case 2:
                        if (args[0].value.indexOf('__params__') != -1)
                            throw new Error("Unexpected Identifier");
                        codeStr.push("if (" + args[0].value + "){");
                        return [3 /*break*/, 16];
                    case 3:
                        codeStr.push("else {");
                        return [3 /*break*/, 16];
                    case 4:
                        if (args[0].value.indexOf('__params__') != -1)
                            throw new Error("Unexpected Identifier");
                        codeStr.push("else if(" + args[0].value + "){");
                        return [3 /*break*/, 16];
                    case 5:
                        //codeStr.push(`for (${prefix} ${args[0].value} of [...Array(${args[1].value}).keys()]){`);
                        if (args[0].value.indexOf('__params__') != -1)
                            throw new Error("Unexpected Identifier");
                        codeStr.push("for (" + prefix + " " + args[0].value + " of " + args[1].value + "){");
                        return [3 /*break*/, 16];
                    case 6:
                        if (args[0].value.indexOf('__params__') != -1)
                            throw new Error("Unexpected Identifier");
                        codeStr.push("while (" + args[0].value + "){");
                        return [3 /*break*/, 16];
                    case 7:
                        codeStr.push("break;");
                        return [3 /*break*/, 16];
                    case 8:
                        codeStr.push("continue;");
                        return [3 /*break*/, 16];
                    case 9:
                        argVals = [];
                        _loop_1 = function (arg) {
                            var val, p, p;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(arg.name == _modules__WEBPACK_IMPORTED_MODULE_4__["_parameterTypes"].input)) return [3 /*break*/, 5];
                                        val = arg.value || arg.default;
                                        if (!(prod.meta.inputMode == _models_port__WEBPACK_IMPORTED_MODULE_1__["InputType"].URL)) return [3 /*break*/, 2];
                                        p = new Promise(function (resolve) {
                                            var request = new XMLHttpRequest();
                                            request.open('GET', arg.value || arg.default);
                                            request.onload = function () {
                                                resolve(request.responseText);
                                            };
                                            request.send();
                                        });
                                        return [4 /*yield*/, p];
                                    case 1:
                                        val = _a.sent();
                                        return [3 /*break*/, 4];
                                    case 2:
                                        if (!(prod.meta.inputMode == _models_port__WEBPACK_IMPORTED_MODULE_1__["InputType"].File)) return [3 /*break*/, 4];
                                        p = new Promise(function (resolve) {
                                            var reader = new FileReader();
                                            reader.onload = function () {
                                                resolve(reader.result);
                                            };
                                            reader.readAsText(arg.value || arg.default);
                                        });
                                        return [4 /*yield*/, p];
                                    case 3:
                                        val = _a.sent();
                                        return [3 /*break*/, 4];
                                    case 4:
                                        argVals.push(val);
                                        return [2 /*return*/, "continue"];
                                    case 5:
                                        if (arg.value && arg.value.indexOf('__params__') != -1)
                                            throw new Error("Unexpected Identifier");
                                        if (arg.name == _modules__WEBPACK_IMPORTED_MODULE_4__["_parameterTypes"].constList) {
                                            argVals.push("__params__.constants");
                                            return [2 /*return*/, "continue"];
                                        }
                                        ;
                                        if (arg.name == _modules__WEBPACK_IMPORTED_MODULE_4__["_parameterTypes"].model) {
                                            argVals.push("__params__.model");
                                            return [2 /*return*/, "continue"];
                                        }
                                        if (arg.value && arg.value.substring(0, 1) == '@') {
                                            if (prod.meta.module.toUpperCase() == 'QUERY' && prod.meta.name.toUpperCase() == 'SET' && arg.name.toUpperCase() == 'STATEMENT') {
                                                argVals.push('"' + arg.value.replace(/"/g, "'") + '"');
                                                return [2 /*return*/, "continue"];
                                            }
                                            argVals.push('__modules__.Query.get( __params__.model,"' + arg.value.replace(/"/g, "'") + '" )');
                                            return [2 /*return*/, "continue"];
                                        }
                                        //else if (arg.name.indexOf('__') != -1) return '"'+args[args.indexOf(arg)+1].value+'"';
                                        argVals.push(arg.value);
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, _b = args.slice(1);
                        _g.label = 10;
                    case 10:
                        if (!(_i < _b.length)) return [3 /*break*/, 13];
                        arg = _b[_i];
                        return [5 /*yield**/, _loop_1(arg)];
                    case 11:
                        _g.sent();
                        _g.label = 12;
                    case 12:
                        _i++;
                        return [3 /*break*/, 10];
                    case 13:
                        argValues = argVals.join(',');
                        return [4 /*yield*/, argValues];
                    case 14:
                        _g.sent();
                        fnCall = "__modules__." + prod.meta.module + "." + prod.meta.name + "( " + argValues + " )";
                        if (prod.meta.module.toUpperCase() == 'OUTPUT') {
                            codeStr.push("return " + fnCall + ";");
                        }
                        else if (args[0].name == '__none__') {
                            codeStr.push(fnCall + ";");
                        }
                        else {
                            codeStr.push("" + prefix + args[0].value + " = " + fnCall + ";");
                            if (prefix === 'let ') {
                                existingVars.push(args[0].value);
                            }
                        }
                        return [3 /*break*/, 16];
                    case 15:
                        argsVals = args.slice(1).map(function (arg) { return arg.value; }).join(',');
                        fn = prod.meta.name + "(__params__, " + argsVals + " )";
                        codeStr.push("" + prefix + args[0].value + " = " + fn + ";");
                        if (prefix === 'let ') {
                            existingVars.push(args[0].value);
                        }
                        return [3 /*break*/, 16];
                    case 16:
                        if (!prod.children) return [3 /*break*/, 21];
                        _c = 0, _d = prod.children;
                        _g.label = 17;
                    case 17:
                        if (!(_c < _d.length)) return [3 /*break*/, 20];
                        p = _d[_c];
                        _f = (_e = codeStr).push;
                        return [4 /*yield*/, CodeUtils.getProcedureCode(p, existingVars, addProdArr)];
                    case 18:
                        _f.apply(_e, [_g.sent()]);
                        _g.label = 19;
                    case 19:
                        _c++;
                        return [3 /*break*/, 17];
                    case 20:
                        codeStr.push("}");
                        _g.label = 21;
                    case 21:
                        if (prod.print) {
                            codeStr.push("console.log('" + prod.args[0].value + ": '+ " + prod.args[0].value + ");");
                            //codeStr.push(`wait(5000);`);
                        }
                        return [2 /*return*/, codeStr.join('\n')];
                }
            });
        });
    };
    CodeUtils.loadFile = function (f) {
        var stream = rxjs__WEBPACK_IMPORTED_MODULE_2__["Observable"].create(function (observer) {
            var request = new XMLHttpRequest();
            request.open('GET', f.download_url);
            request.onload = function () {
                if (request.status === 200) {
                    var f_1 = circular_json__WEBPACK_IMPORTED_MODULE_3__["parse"](request.responseText);
                    observer.next(f_1);
                    observer.complete();
                }
                else {
                    observer.error('error happened');
                }
            };
            request.onerror = function () {
                observer.error('error happened');
            };
            request.send();
        });
        stream.subscribe(function (loadeddata) {
            return loadeddata;
        });
    };
    CodeUtils.mergeInputs = function (models) {
        var result = _modules__WEBPACK_IMPORTED_MODULE_4__["functions"].__new__();
        for (var _i = 0, models_1 = models; _i < models_1.length; _i++) {
            var model = models_1[_i];
            _modules__WEBPACK_IMPORTED_MODULE_4__["functions"].__merge__(result, model);
        }
        return result;
    };
    CodeUtils.getInputValue = function (inp, node) {
        var input;
        if (node.type == 'start' || inp.edges.length == 0) {
            input = _modules__WEBPACK_IMPORTED_MODULE_4__["functions"].__new__();
            /*
            if (inp.meta.mode == InputType.URL){
                const p = new Promise((resolve) => {
                    let request = new XMLHttpRequest();
                    request.open('GET', inp.value || inp.default);
                    request.onload = () => {
                        resolve(request.responseText);
                    }
                    request.send();
                });
                input = await p;
            } else if (inp.meta.mode == InputType.File) {
                const p = new Promise((resolve) => {
                    let reader = new FileReader();
                    reader.onload = function(){
                        resolve(reader.result)
                    }
                    reader.readAsText(inp.value || inp.default)
                });
                input = await p;
            } else {
                input = inp.value || inp.default;
            }
            */
        }
        else {
            input = CodeUtils.mergeInputs(inp.edges.map(function (edge) { return edge.source.value; }));
            /*
            if (input.constructor === gsConstructor) {
                input = `new __MODULES__.gs.Model(${input.toJSON()})`
            } else {
                // do nothing
            }
            */
        }
        return input;
    };
    CodeUtils.getNodeCode = function (node, addProdArr) {
        if (addProdArr === void 0) { addProdArr = false; }
        return __awaiter(this, void 0, void 0, function () {
            var codeStr, varsDefined, input, _i, _a, prod, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        node.hasError = false;
                        codeStr = [];
                        varsDefined = [];
                        if (!addProdArr) return [3 /*break*/, 2];
                        return [4 /*yield*/, CodeUtils.getInputValue(node.input, node)];
                    case 1:
                        input = _d.sent();
                        node.input.value = input;
                        _d.label = 2;
                    case 2:
                        if (node.type == 'start') {
                            codeStr.push('__params__.constants = {};\n');
                        }
                        _i = 0, _a = node.procedure;
                        _d.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        prod = _a[_i];
                        _c = (_b = codeStr).push;
                        return [4 /*yield*/, CodeUtils.getProcedureCode(prod, varsDefined, addProdArr)];
                    case 4:
                        _c.apply(_b, [_d.sent()]);
                        _d.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        ;
                        if (node.type == 'end' && node.procedure.length > 0) {
                            return [2 /*return*/, "{\n" + codeStr.join('\n') + "\n}"];
                        }
                        return [2 /*return*/, "\n" + codeStr.join('\n') + "\n\nreturn __params__.model;\n"];
                }
            });
        });
    };
    CodeUtils.getFunctionString = function (func) {
        return __awaiter(this, void 0, void 0, function () {
            var fullCode, fnCode, _i, _a, node, code, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        fullCode = '';
                        fnCode = "function " + func.name + "(__mainParams__," + func.args.map(function (arg) { return arg.name; }).join(',') + "){\nvar merged;\nlet __params__={\"currentProcedure\": [''],\"model\":__modules__.Model.New()};\n";
                        _i = 0, _a = func.module.nodes;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        node = _a[_i];
                        _b = '{';
                        return [4 /*yield*/, CodeUtils.getNodeCode(node, false)];
                    case 2:
                        code = _b + (_c.sent()) + '}';
                        fullCode += "function " + node.id + "(__params__, " + func.args.map(function (arg) { return arg.name; }).join(',') + ")" + code + "\n\n";
                        if (node.type === 'start') {
                            //fnCode += `let result_${node.id} = ${node.id}(__params__);\n`
                            fnCode += "let result_" + node.id + " = __params__.model;\n";
                        }
                        else if (node.input.edges.length == 1) {
                            fnCode += "__params__.model = JSON.parse(JSON.stringify(result_" + node.input.edges[0].source.parentNode.id + "));\n";
                            fnCode += "let result_" + node.id + " = " + node.id + "(__params__, " + func.args.map(function (arg) { return arg.name; }).join(',') + ");\n";
                        }
                        else {
                            fnCode += "merged = mergeInputs([" + node.input.edges.map(function (edge) { return 'result_' + edge.source.parentNode.id; }).join(',') + "]);\n";
                            fnCode += "__params__.model = merged;\n";
                            fnCode += "let result_" + node.id + " = " + node.id + "(__params__, " + func.args.map(function (arg) { return arg.name; }).join(',') + ");\n";
                        }
                        /*
                        } else if (node.input.edges.length == 1) {
                            fnCode += `let result_${node.id} = ${node.id}(result_${node.input.edges[0].source.parentNode.id});\n`
                        } else {
                            fnCode += `merged = mergeResults([${node.input.edges.map((edge)=>'result_'+edge.source.parentNode.id).join(',')}]);\n`;
                            fnCode += `let result_${node.id} = ${node.id}(merged);\n`
            
            
                        */
                        if (node.type === 'end') {
                            fnCode += "\n__mainParams__.model = mergeInputs([__mainParams__.model,__params__.model]);\n";
                            fnCode += "return result_" + node.id + ";\n";
                        }
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        fnCode += '}\n\n';
                        fullCode += fnCode;
                        //console.log(fullCode)
                        return [2 /*return*/, fullCode];
                }
            });
        });
    };
    return CodeUtils;
}());



/***/ }),

/***/ "./src/app/shared/models/code/execute.utils.ts":
/*!*****************************************************!*\
  !*** ./src/app/shared/models/code/execute.utils.ts ***!
  \*****************************************************/
/*! exports provided: ExecuteUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExecuteUtils", function() { return ExecuteUtils; });
var ExecuteUtils = /** @class */ (function () {
    function ExecuteUtils() {
    }
    return ExecuteUtils;
}());



/***/ }),

/***/ "./src/app/shared/models/code/index.ts":
/*!*********************************************!*\
  !*** ./src/app/shared/models/code/index.ts ***!
  \*********************************************/
/*! exports provided: CodeUtils, ExecuteUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _code_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./code.utils */ "./src/app/shared/models/code/code.utils.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CodeUtils", function() { return _code_utils__WEBPACK_IMPORTED_MODULE_0__["CodeUtils"]; });

/* harmony import */ var _execute_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./execute.utils */ "./src/app/shared/models/code/execute.utils.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ExecuteUtils", function() { return _execute_utils__WEBPACK_IMPORTED_MODULE_1__["ExecuteUtils"]; });





/***/ }),

/***/ "./src/app/shared/models/flowchart/flowchart.utils.ts":
/*!************************************************************!*\
  !*** ./src/app/shared/models/flowchart/flowchart.utils.ts ***!
  \************************************************************/
/*! exports provided: FlowchartUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FlowchartUtils", function() { return FlowchartUtils; });
/* harmony import */ var _models_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @models/node */ "./src/app/shared/models/node/index.ts");

var FlowchartUtils = /** @class */ (function () {
    function FlowchartUtils() {
    }
    FlowchartUtils.newflowchart = function () {
        var flw = {
            name: "new_flowchart",
            description: '',
            language: "js",
            meta: {
                selected_nodes: [0]
            },
            nodes: [_models_node__WEBPACK_IMPORTED_MODULE_0__["NodeUtils"].getStartNode(), _models_node__WEBPACK_IMPORTED_MODULE_0__["NodeUtils"].getEndNode()],
            edges: [],
            functions: [],
            ordered: false
        };
        return flw;
    };
    FlowchartUtils.checkNode = function (nodeOrder, node, enabled) {
        if (node.hasExecuted) {
            return;
        }
        else if (node.type === 'start') {
            nodeOrder.push(node);
        }
        else {
            for (var _i = 0, _a = node.input.edges; _i < _a.length; _i++) {
                var edge = _a[_i];
                if (!edge.source.parentNode.hasExecuted) {
                    return;
                }
            }
            nodeOrder.push(node);
        }
        node.hasExecuted = true;
        node.enabled = enabled;
        for (var _b = 0, _c = node.output.edges; _b < _c.length; _b++) {
            var edge = _c[_b];
            FlowchartUtils.checkNode(nodeOrder, edge.target.parentNode, enabled);
        }
    };
    FlowchartUtils.orderNodes = function (flw) {
        var startNode = undefined;
        for (var _i = 0, _a = flw.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            if (node.type === 'start') {
                startNode = node;
            }
            node.hasExecuted = false;
        }
        var nodeOrder = [];
        FlowchartUtils.checkNode(nodeOrder, startNode, true);
        if (nodeOrder.length < flw.nodes.length) {
            for (var _b = 0, _c = flw.nodes; _b < _c.length; _b++) {
                var node = _c[_b];
                if (node.type != 'start' && node.input.edges.length == 0) {
                    FlowchartUtils.checkNode(nodeOrder, node, false);
                }
            }
        }
        flw.nodes = nodeOrder;
        flw.ordered = true;
    };
    return FlowchartUtils;
}());



/***/ }),

/***/ "./src/app/shared/models/flowchart/index.ts":
/*!**************************************************!*\
  !*** ./src/app/shared/models/flowchart/index.ts ***!
  \**************************************************/
/*! exports provided: FlowchartUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _flowchart_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./flowchart.utils */ "./src/app/shared/models/flowchart/flowchart.utils.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FlowchartUtils", function() { return _flowchart_utils__WEBPACK_IMPORTED_MODULE_0__["FlowchartUtils"]; });




/***/ }),

/***/ "./src/app/shared/models/node/index.ts":
/*!*********************************************!*\
  !*** ./src/app/shared/models/node/index.ts ***!
  \*********************************************/
/*! exports provided: NodeUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node.utils */ "./src/app/shared/models/node/node.utils.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NodeUtils", function() { return _node_utils__WEBPACK_IMPORTED_MODULE_0__["NodeUtils"]; });




/***/ }),

/***/ "./src/app/shared/models/node/node.utils.ts":
/*!**************************************************!*\
  !*** ./src/app/shared/models/node/node.utils.ts ***!
  \**************************************************/
/*! exports provided: NodeUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NodeUtils", function() { return NodeUtils; });
/* harmony import */ var _models_procedure__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @models/procedure */ "./src/app/shared/models/procedure/index.ts");
/* harmony import */ var _models_port__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @models/port */ "./src/app/shared/models/port/index.ts");
/* harmony import */ var circular_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! circular-json */ "./node_modules/circular-json/build/circular-json.node.js");
/* harmony import */ var circular_json__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(circular_json__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @utils */ "./src/app/shared/utils/index.ts");




var NodeUtils = /** @class */ (function () {
    function NodeUtils() {
    }
    NodeUtils.getNewNode = function () {
        var node = {
            name: "Node",
            id: _utils__WEBPACK_IMPORTED_MODULE_3__["IdGenerator"].getNodeID(),
            position: { x: 0, y: 0 },
            enabled: false,
            type: '',
            procedure: [],
            state: {
                procedure: [],
                input_port: undefined,
                output_port: undefined
            },
            input: _models_port__WEBPACK_IMPORTED_MODULE_1__["PortUtils"].getNewInput(),
            output: _models_port__WEBPACK_IMPORTED_MODULE_1__["PortUtils"].getNewOutput()
        };
        node.input.parentNode = node;
        node.output.parentNode = node;
        return node;
    };
    ;
    NodeUtils.getStartNode = function () {
        var node = NodeUtils.getNewNode();
        node.enabled = true;
        node.name = 'Start';
        node.type = 'start';
        node.position = { x: 400, y: 0 };
        return node;
    };
    ;
    NodeUtils.getEndNode = function () {
        var node = NodeUtils.getNewNode();
        node.name = 'End';
        node.type = 'end';
        node.position = { x: 400, y: 400 };
        return node;
    };
    ;
    NodeUtils.deselect_procedure = function (node) {
        for (var _i = 0, _a = node.state.procedure; _i < _a.length; _i++) {
            var prod = _a[_i];
            prod.selected = false;
        }
        node.state.procedure = [];
    };
    NodeUtils.rearrangeSelected = function (prodList, tempList, prods) {
        for (var _i = 0, prods_1 = prods; _i < prods_1.length; _i++) {
            var pr = prods_1[_i];
            if (!pr.selected) {
                if (pr.children)
                    NodeUtils.rearrangeSelected(prodList, tempList, pr.children);
                continue;
            }
            ;
            var i = 0;
            while (i < tempList.length) {
                if (tempList[i] === pr) {
                    prodList.push(pr);
                    tempList.splice(i, 1);
                    break;
                }
                i += 1;
            }
            if (pr.children)
                NodeUtils.rearrangeSelected(prodList, tempList, pr.children);
        }
    };
    NodeUtils.select_procedure = function (node, procedure, ctrl) {
        if (!procedure) {
            return;
        }
        if (ctrl) {
            var selIndex = 0;
            var selected = false;
            while (selIndex < node.state.procedure.length) {
                if (node.state.procedure[selIndex] === procedure) {
                    selected = true;
                    node.state.procedure.splice(selIndex, 1);
                    procedure.selected = false;
                    break;
                }
                selIndex += 1;
            }
            if (!selected) {
                procedure.selected = true;
                node.state.procedure.push(procedure);
                var tempArray = node.state.procedure.splice(0, node.state.procedure.length);
                NodeUtils.rearrangeSelected(node.state.procedure, tempArray, node.procedure);
                console.log(node.state.procedure);
            }
        }
        else {
            var sel = procedure.selected;
            for (var _i = 0, _a = node.state.procedure; _i < _a.length; _i++) {
                var prod = _a[_i];
                prod.selected = false;
            }
            if (sel && node.state.procedure.length === 1 && node.state.procedure[0] === procedure) {
                node.state.procedure = [];
            }
            else {
                node.state.procedure = [procedure];
                procedure.selected = true;
            }
        }
    };
    NodeUtils.insert_procedure = function (node, prod) {
        if (node.state.procedure[0]) {
            if (node.state.procedure[0].children) {
                node.state.procedure[0].children.push(prod);
                prod.parent = node.state.procedure[0];
            }
            else {
                if (node.state.procedure[0].parent) {
                    prod.parent = node.state.procedure[0].parent;
                    var list = prod.parent.children;
                }
                else {
                    var list = node.procedure;
                }
                for (var index in list) {
                    if (list[index].selected) {
                        list.splice(parseInt(index) + 1, 0, prod);
                        break;
                    }
                }
            }
        }
        else {
            node.procedure.push(prod);
        }
    };
    NodeUtils.add_procedure = function (node, type, data) {
        var prod = {};
        prod.type = type;
        NodeUtils.insert_procedure(node, prod);
        // add ID to the procedure
        prod.ID = _utils__WEBPACK_IMPORTED_MODULE_3__["IdGenerator"].getProdID();
        prod.enabled = true;
        prod.print = false;
        // select the procedure
        NodeUtils.select_procedure(node, prod, false);
        switch (prod.type) {
            case _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].Variable:
                prod.argCount = 2;
                prod.args = [{ name: 'var_name', value: undefined, default: undefined }, { name: 'value', value: undefined, default: undefined }];
                break;
            case _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].Foreach:
                prod.argCount = 2;
                prod.args = [{ name: 'i', value: undefined, default: undefined }, { name: 'arr', value: undefined, default: [] }];
                prod.children = [];
                break;
            case _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].While:
                prod.argCount = 1;
                prod.args = [{ name: 'condition', value: undefined, default: undefined }];
                prod.children = [];
                break;
            case _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].If:
            case _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].Elseif:
                prod.argCount = 1;
                prod.args = [{ name: 'condition', value: undefined, default: undefined }];
                prod.children = [];
                break;
            case _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].Else:
                prod.argCount = 0;
                prod.args = [];
                prod.children = [];
                break;
            case _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].Break:
            case _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].Continue:
                prod.argCount = 0;
                prod.args = [];
                break;
            case _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].Function:
                if (!data)
                    throw Error('No function data');
                prod.meta = { module: data.module, name: data.name, inputMode: _models_port__WEBPACK_IMPORTED_MODULE_1__["InputType"].SimpleInput };
                prod.argCount = data.argCount + 1;
                var returnArg = { name: 'var_name', value: undefined, default: undefined };
                if (!data.hasReturn) {
                    returnArg = { name: '__none__', value: undefined, default: undefined };
                }
                // --UNSTABLE--
                // changing the value of the last argument of all functions in input node to be undefined
                if (node.type == 'start') {
                    data.args[data.argCount - 1].value = undefined;
                }
                prod.args = [returnArg].concat(data.args);
                break;
            case _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].Imported:
                prod.meta = { module: data.module, name: data.name, inputMode: _models_port__WEBPACK_IMPORTED_MODULE_1__["InputType"].SimpleInput };
                prod.argCount = data.argCount + 1;
                prod.args = [{ name: 'var_name', value: undefined, default: undefined }].concat(data.args);
                break;
        }
    };
    NodeUtils.updateNode = function (newNode, newPos) {
        newNode.id = _utils__WEBPACK_IMPORTED_MODULE_3__["IdGenerator"].getNodeID();
        newNode.input = _models_port__WEBPACK_IMPORTED_MODULE_1__["PortUtils"].getNewInput();
        newNode.output = _models_port__WEBPACK_IMPORTED_MODULE_1__["PortUtils"].getNewOutput();
        newNode.input.parentNode = newNode;
        newNode.output.parentNode = newNode;
        newNode.position.x = newPos.x;
        newNode.position.y = newPos.y;
        return newNode;
    };
    NodeUtils.updateID = function (prod) {
        if (prod.hasOwnProperty('children')) {
            prod.children.map(function (child) {
                NodeUtils.updateID(child);
            });
        }
        prod.ID = _utils__WEBPACK_IMPORTED_MODULE_3__["IdGenerator"].getProdID();
        return prod;
    };
    NodeUtils.paste_procedure = function (node, prod) {
        var newProd = NodeUtils.updateID(circular_json__WEBPACK_IMPORTED_MODULE_2__["parse"](circular_json__WEBPACK_IMPORTED_MODULE_2__["stringify"](prod)));
        newProd.parent = undefined;
        NodeUtils.insert_procedure(node, newProd);
        NodeUtils.select_procedure(node, newProd, false);
    };
    return NodeUtils;
}());



/***/ }),

/***/ "./src/app/shared/models/port/index.ts":
/*!*********************************************!*\
  !*** ./src/app/shared/models/port/index.ts ***!
  \*********************************************/
/*! exports provided: PortUtils, PortType, InputType, OutputType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./src/app/shared/models/port/types.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PortType", function() { return _types__WEBPACK_IMPORTED_MODULE_0__["PortType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "InputType", function() { return _types__WEBPACK_IMPORTED_MODULE_0__["InputType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "OutputType", function() { return _types__WEBPACK_IMPORTED_MODULE_0__["OutputType"]; });

/* harmony import */ var _port_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./port.utils */ "./src/app/shared/models/port/port.utils.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PortUtils", function() { return _port_utils__WEBPACK_IMPORTED_MODULE_1__["PortUtils"]; });





/***/ }),

/***/ "./src/app/shared/models/port/port.utils.ts":
/*!**************************************************!*\
  !*** ./src/app/shared/models/port/port.utils.ts ***!
  \**************************************************/
/*! exports provided: PortUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PortUtils", function() { return PortUtils; });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./src/app/shared/models/port/types.ts");
/* harmony import */ var _shared_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @shared/utils */ "./src/app/shared/utils/index.ts");


var PortUtils = /** @class */ (function () {
    function PortUtils() {
    }
    PortUtils.getNewInput = function () {
        var inp = {
            id: _shared_utils__WEBPACK_IMPORTED_MODULE_1__["IdGenerator"].getId(),
            name: 'input',
            type: _types__WEBPACK_IMPORTED_MODULE_0__["PortType"].Input,
            value: undefined,
            default: undefined,
            edges: [],
            meta: {
                mode: _types__WEBPACK_IMPORTED_MODULE_0__["InputType"].SimpleInput,
                opts: {}
            }
        };
        return inp;
    };
    ;
    PortUtils.getNewOutput = function () {
        var oup = {
            id: _shared_utils__WEBPACK_IMPORTED_MODULE_1__["IdGenerator"].getId(),
            name: 'output',
            type: _types__WEBPACK_IMPORTED_MODULE_0__["PortType"].Output,
            edges: [],
            meta: {
                mode: _types__WEBPACK_IMPORTED_MODULE_0__["OutputType"].Text,
            }
        };
        return oup;
    };
    ;
    return PortUtils;
}());



/***/ }),

/***/ "./src/app/shared/models/port/types.ts":
/*!*********************************************!*\
  !*** ./src/app/shared/models/port/types.ts ***!
  \*********************************************/
/*! exports provided: PortType, InputType, OutputType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PortType", function() { return PortType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InputType", function() { return InputType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OutputType", function() { return OutputType; });
var PortType;
(function (PortType) {
    PortType[PortType["Input"] = 0] = "Input";
    PortType[PortType["Output"] = 1] = "Output";
})(PortType || (PortType = {}));
var InputType;
(function (InputType) {
    InputType[InputType["SimpleInput"] = 0] = "SimpleInput";
    InputType[InputType["Slider"] = 1] = "Slider";
    InputType[InputType["Checkbox"] = 2] = "Checkbox";
    InputType[InputType["URL"] = 3] = "URL";
    InputType[InputType["File"] = 4] = "File";
})(InputType || (InputType = {}));
var OutputType;
(function (OutputType) {
    OutputType[OutputType["Text"] = 0] = "Text";
    OutputType[OutputType["Code"] = 1] = "Code";
})(OutputType || (OutputType = {}));


/***/ }),

/***/ "./src/app/shared/models/procedure/index.ts":
/*!**************************************************!*\
  !*** ./src/app/shared/models/procedure/index.ts ***!
  \**************************************************/
/*! exports provided: ProcedureTypes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./src/app/shared/models/procedure/types.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ProcedureTypes", function() { return _types__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"]; });




/***/ }),

/***/ "./src/app/shared/models/procedure/types.ts":
/*!**************************************************!*\
  !*** ./src/app/shared/models/procedure/types.ts ***!
  \**************************************************/
/*! exports provided: ProcedureTypes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProcedureTypes", function() { return ProcedureTypes; });
var ProcedureTypes;
(function (ProcedureTypes) {
    ProcedureTypes[ProcedureTypes["Variable"] = 0] = "Variable";
    ProcedureTypes[ProcedureTypes["If"] = 1] = "If";
    ProcedureTypes[ProcedureTypes["Elseif"] = 2] = "Elseif";
    ProcedureTypes[ProcedureTypes["Else"] = 3] = "Else";
    ProcedureTypes[ProcedureTypes["Foreach"] = 4] = "Foreach";
    ProcedureTypes[ProcedureTypes["While"] = 5] = "While";
    ProcedureTypes[ProcedureTypes["Break"] = 6] = "Break";
    ProcedureTypes[ProcedureTypes["Continue"] = 7] = "Continue";
    ProcedureTypes[ProcedureTypes["Function"] = 8] = "Function";
    ProcedureTypes[ProcedureTypes["Imported"] = 9] = "Imported";
})(ProcedureTypes || (ProcedureTypes = {}));


/***/ }),

/***/ "./src/app/shared/shared.module.ts":
/*!*****************************************!*\
  !*** ./src/app/shared/shared.module.ts ***!
  \*****************************************/
/*! exports provided: SharedModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SharedModule", function() { return SharedModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _app_ngFlowchart_svg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../app/ngFlowchart-svg */ "./src/app/ngFlowchart-svg/index.ts");
/* harmony import */ var angular_split__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! angular-split */ "./node_modules/angular-split/fesm5/angular-split.js");
/* harmony import */ var _directives_filesys__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./directives/filesys */ "./src/app/shared/directives/filesys/index.ts");
/* harmony import */ var _components_execute_execute_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/execute/execute.component */ "./src/app/shared/components/execute/execute.component.ts");
/* harmony import */ var _components_not_found_not_found_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/not-found/not-found.component */ "./src/app/shared/components/not-found/not-found.component.ts");
/* harmony import */ var _components_navigation_navigation_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/navigation/navigation.component */ "./src/app/shared/components/navigation/navigation.component.ts");
/* harmony import */ var _components_header_header_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/header/header.component */ "./src/app/shared/components/header/header.component.ts");
/* harmony import */ var _components_add_components_add_output_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/add-components/add_output.component */ "./src/app/shared/components/add-components/add_output.component.ts");
/* harmony import */ var _components_add_components_add_node_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/add-components/add_node.component */ "./src/app/shared/components/add-components/add_node.component.ts");
/* harmony import */ var _components_add_components_add_input_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/add-components/add_input.component */ "./src/app/shared/components/add-components/add_input.component.ts");
/* harmony import */ var _components_parameter_viewer_parameter_viewer_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./components/parameter-viewer/parameter-viewer.component */ "./src/app/shared/components/parameter-viewer/parameter-viewer.component.ts");
/* harmony import */ var _components_parameter_viewer_input_port_viewer_input_port_viewer_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./components/parameter-viewer/input-port-viewer/input-port-viewer.component */ "./src/app/shared/components/parameter-viewer/input-port-viewer/input-port-viewer.component.ts");
/* harmony import */ var _components_parameter_viewer_procedure_input_viewer_procedure_input_viewer_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./components/parameter-viewer/procedure-input-viewer/procedure-input-viewer.component */ "./src/app/shared/components/parameter-viewer/procedure-input-viewer/procedure-input-viewer.component.ts");
/* harmony import */ var _components_file__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./components/file */ "./src/app/shared/components/file/index.ts");
/* harmony import */ var _mViewer_mobius_viewer_module__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../mViewer/mobius-viewer.module */ "./src/app/mViewer/mobius-viewer.module.ts");
/* harmony import */ var _directives_textarea__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./directives/textarea */ "./src/app/shared/directives/textarea/index.ts");
/*
 *  This module is to be imported ONLY by the AppModule
 *  Contains all global services
 *
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};





















var SharedModule = /** @class */ (function () {
    function SharedModule(shared) {
        /*
        /// Prevents any module apart from AppModule from re-importing
        if(shared){
            throw new Error("Core Module has already been imported");
        }
        */
    }
    SharedModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            providers: [],
            declarations: [
                _directives_filesys__WEBPACK_IMPORTED_MODULE_7__["MbFileReaderDirective"],
                _directives_textarea__WEBPACK_IMPORTED_MODULE_20__["autogrowDirective"],
                _components_execute_execute_component__WEBPACK_IMPORTED_MODULE_8__["ExecuteComponent"],
                _components_not_found_not_found_component__WEBPACK_IMPORTED_MODULE_9__["PageNotFoundComponent"],
                _components_navigation_navigation_component__WEBPACK_IMPORTED_MODULE_10__["NavigationComponent"],
                _components_header_header_component__WEBPACK_IMPORTED_MODULE_11__["HeaderComponent"],
                _components_add_components_add_node_component__WEBPACK_IMPORTED_MODULE_13__["AddNodeComponent"], _components_add_components_add_input_component__WEBPACK_IMPORTED_MODULE_14__["AddInputComponent"], _components_add_components_add_output_component__WEBPACK_IMPORTED_MODULE_12__["AddOutputComponent"],
                _components_parameter_viewer_parameter_viewer_component__WEBPACK_IMPORTED_MODULE_15__["ParameterViewerComponent"], _components_parameter_viewer_input_port_viewer_input_port_viewer_component__WEBPACK_IMPORTED_MODULE_16__["InputPortViewerComponent"], _components_parameter_viewer_procedure_input_viewer_procedure_input_viewer_component__WEBPACK_IMPORTED_MODULE_17__["procedureInputViewerComponent"],
                _components_file__WEBPACK_IMPORTED_MODULE_18__["NewFileComponent"], _components_file__WEBPACK_IMPORTED_MODULE_18__["SaveFileComponent"], _components_file__WEBPACK_IMPORTED_MODULE_18__["LoadFileComponent"]
            ],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_4__["MatSliderModule"], _angular_material__WEBPACK_IMPORTED_MODULE_4__["MatCheckboxModule"],
                _app_ngFlowchart_svg__WEBPACK_IMPORTED_MODULE_5__["SVGFlowchartModule"],
                _mViewer_mobius_viewer_module__WEBPACK_IMPORTED_MODULE_19__["MobiusViewerModule"],
                angular_split__WEBPACK_IMPORTED_MODULE_6__["AngularSplitModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_4__["MatIconModule"],
            ],
            entryComponents: [],
            exports: [
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                _app_ngFlowchart_svg__WEBPACK_IMPORTED_MODULE_5__["SVGFlowchartModule"],
                _mViewer_mobius_viewer_module__WEBPACK_IMPORTED_MODULE_19__["MobiusViewerModule"],
                angular_split__WEBPACK_IMPORTED_MODULE_6__["AngularSplitModule"],
                _directives_filesys__WEBPACK_IMPORTED_MODULE_7__["MbFileReaderDirective"],
                _directives_textarea__WEBPACK_IMPORTED_MODULE_20__["autogrowDirective"],
                _components_execute_execute_component__WEBPACK_IMPORTED_MODULE_8__["ExecuteComponent"],
                _components_not_found_not_found_component__WEBPACK_IMPORTED_MODULE_9__["PageNotFoundComponent"],
                _components_navigation_navigation_component__WEBPACK_IMPORTED_MODULE_10__["NavigationComponent"],
                _components_header_header_component__WEBPACK_IMPORTED_MODULE_11__["HeaderComponent"],
                _components_add_components_add_node_component__WEBPACK_IMPORTED_MODULE_13__["AddNodeComponent"],
                _components_add_components_add_input_component__WEBPACK_IMPORTED_MODULE_14__["AddInputComponent"],
                _components_add_components_add_output_component__WEBPACK_IMPORTED_MODULE_12__["AddOutputComponent"],
                _components_parameter_viewer_parameter_viewer_component__WEBPACK_IMPORTED_MODULE_15__["ParameterViewerComponent"],
                _components_file__WEBPACK_IMPORTED_MODULE_18__["NewFileComponent"], _components_file__WEBPACK_IMPORTED_MODULE_18__["SaveFileComponent"], _components_file__WEBPACK_IMPORTED_MODULE_18__["LoadFileComponent"]
            ]
        }),
        __param(0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Optional"])()), __param(0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["SkipSelf"])()),
        __metadata("design:paramtypes", [SharedModule])
    ], SharedModule);
    return SharedModule;
}());



/***/ }),

/***/ "./src/app/shared/utils/GUID.ts":
/*!**************************************!*\
  !*** ./src/app/shared/utils/GUID.ts ***!
  \**************************************/
/*! exports provided: IdGenerator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IdGenerator", function() { return IdGenerator; });
var IdGenerator = /** @class */ (function () {
    function IdGenerator() {
    }
    IdGenerator.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    IdGenerator.getId = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    IdGenerator.getNodeID = function () {
        return 'node_' + Math.random().toString(36).substr(2, 16);
    };
    IdGenerator.getProdID = function () {
        return 'prod-' + Math.random().toString(36).substr(2, 16);
    };
    return IdGenerator;
}());



/***/ }),

/***/ "./src/app/shared/utils/index.ts":
/*!***************************************!*\
  !*** ./src/app/shared/utils/index.ts ***!
  \***************************************/
/*! exports provided: IdGenerator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _GUID__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GUID */ "./src/app/shared/utils/GUID.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "IdGenerator", function() { return _GUID__WEBPACK_IMPORTED_MODULE_0__["IdGenerator"]; });




/***/ }),

/***/ "./src/app/views/index.ts":
/*!********************************!*\
  !*** ./src/app/views/index.ts ***!
  \********************************/
/*! exports provided: ViewPublishModule, ViewPublishComponent, ViewEditorModule, ViewEditorComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _view_publish_view_publish_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./view-publish/view-publish.module */ "./src/app/views/view-publish/view-publish.module.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ViewPublishModule", function() { return _view_publish_view_publish_module__WEBPACK_IMPORTED_MODULE_0__["ViewPublishModule"]; });

/* harmony import */ var _view_publish_view_publish_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./view-publish/view-publish.component */ "./src/app/views/view-publish/view-publish.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ViewPublishComponent", function() { return _view_publish_view_publish_component__WEBPACK_IMPORTED_MODULE_1__["ViewPublishComponent"]; });

/* harmony import */ var _view_editor_view_editor_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./view-editor/view-editor.module */ "./src/app/views/view-editor/view-editor.module.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ViewEditorModule", function() { return _view_editor_view_editor_module__WEBPACK_IMPORTED_MODULE_2__["ViewEditorModule"]; });

/* harmony import */ var _view_editor_view_editor_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./view-editor/view-editor.component */ "./src/app/views/view-editor/view-editor.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ViewEditorComponent", function() { return _view_editor_view_editor_component__WEBPACK_IMPORTED_MODULE_3__["ViewEditorComponent"]; });

//export * from './view-about/view-about.module';
//export * from './view-gallery/view-gallery.module';






/***/ }),

/***/ "./src/app/views/view-editor/parameter-editor/parameter-editor.component.html":
/*!************************************************************************************!*\
  !*** ./src/app/views/view-editor/parameter-editor/parameter-editor.component.html ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class='flowchart-info'>\r\n\t<input [(ngModel)]='flowchart.name' size={{flowchart.name?.length||1}}>\r\n\t<textarea autogrow [(ngModel)]='flowchart.description' placeholder=\"flowchart description\"></textarea>\r\n</div>\r\n<hr>\r\n<div class='container--input'>\r\n\t<procedure-input-editor *ngFor=\"let prod of node.procedure\" [prod]=\"prod\" ></procedure-input-editor>\r\n</div>\r\n\t\r\n<!--\r\n<section *ngIf=\"node.type != 'end'\">\r\n\t<panel-header [node]='node' [title]=\"'inputs'\"></panel-header>\r\n\t<div class='container--input'>\r\n\t\t<input-port-editor [port]=\"node?.input\" ></input-port-editor>\r\n\t</div>\r\n</section>\r\n<section *ngIf=\"node.type != 'start'\">\r\n\t<panel-header [node]='node' [title]=\"'output'\"></panel-header>\r\n\t<div class='container--output'>\r\n\t\t<output-port-editor [port]=\"node?.output\" ></output-port-editor>\r\n\t</div>\r\n</section>\r\n-->\r\n"

/***/ }),

/***/ "./src/app/views/view-editor/parameter-editor/parameter-editor.component.scss":
/*!************************************************************************************!*\
  !*** ./src/app/views/view-editor/parameter-editor/parameter-editor.component.scss ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "div[class^=\"container--\"] {\n  display: flex;\n  flex-direction: column;\n  padding-left: 10px;\n  margin: 0px 0px; }\n\n.flowchart-info {\n  display: -ms-grid;\n  display: grid;\n  padding-left: 10px;\n  margin: 5px 0px;\n  width: 100%; }\n\ninput {\n  color: #505050;\n  background-color: #fafafa;\n  border: none;\n  width: -webkit-fit-content;\n  width: -moz-fit-content;\n  width: fit-content;\n  border-left: 1px solid gainsboro;\n  border-bottom: 1px solid gainsboro;\n  padding: 5px;\n  margin-left: 3px;\n  font-weight: 600;\n  font-style: italic;\n  min-width: 40px;\n  max-width: 300px;\n  font-size: 12px;\n  vertical-align: bottom; }\n\ninput.disabled-input {\n    border-bottom: none; }\n\ntextarea {\n  color: #505050;\n  background-color: #fafafa;\n  border: none;\n  border-left: 1px solid gainsboro;\n  border-bottom: 1px solid gainsboro;\n  padding-left: 5px;\n  font-family: sans-serif;\n  font-size: 12px;\n  margin: 10px 0px 5px 3px;\n  height: 18px;\n  width: 90%;\n  resize: none; }\n\nhr {\n  width: inherit;\n  border-top: 2px solid gainsboro; }\n"

/***/ }),

/***/ "./src/app/views/view-editor/parameter-editor/parameter-editor.component.ts":
/*!**********************************************************************************!*\
  !*** ./src/app/views/view-editor/parameter-editor/parameter-editor.component.ts ***!
  \**********************************************************************************/
/*! exports provided: ParameterEditorComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ParameterEditorComponent", function() { return ParameterEditorComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ParameterEditorComponent = /** @class */ (function () {
    function ParameterEditorComponent() {
    }
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], ParameterEditorComponent.prototype, "node", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], ParameterEditorComponent.prototype, "flowchart", void 0);
    ParameterEditorComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'parameter-editor',
            template: __webpack_require__(/*! ./parameter-editor.component.html */ "./src/app/views/view-editor/parameter-editor/parameter-editor.component.html"),
            styles: [__webpack_require__(/*! ./parameter-editor.component.scss */ "./src/app/views/view-editor/parameter-editor/parameter-editor.component.scss")]
        })
    ], ParameterEditorComponent);
    return ParameterEditorComponent;
}());



/***/ }),

/***/ "./src/app/views/view-editor/parameter-editor/procedure-input-editor/procedure-input-editor.component.html":
/*!*****************************************************************************************************************!*\
  !*** ./src/app/views/view-editor/parameter-editor/procedure-input-editor/procedure-input-editor.component.html ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class='container container--parameter'>\r\n    <input [class.disabled-input]='true' value='{{prod.args[prod.argCount-2].value||\"Undefined\"}}:' size='15' disabled>\r\n\r\n    <select name={{prod.ID}}_type [(ngModel)]=\"prod.meta.inputMode\" tabindex=\"-1\">\r\n        <option \r\n            *ngFor=\"let ptype of PortTypesArr\" \r\n            [value]=\"PortTypes[ptype]\" \r\n            [selected]=\"prod.meta.inputMode == ptype\">{{ptype}}</option>\r\n    </select>\r\n    <ng-container [ngSwitch]=\"prod.meta.inputMode\" >\r\n        <input *ngSwitchCase=\"PortTypes.SimpleInput\" [(ngModel)]='prod.args[prod.argCount-1].default' placeholder='Default Value' size={{prod.args[prod.argCount-1].default.length||13}}>\r\n\r\n        <div class='div--slider' *ngSwitchCase=\"PortTypes.Slider\">\r\n            <input [(ngModel)]='prod.args[prod.argCount-1].min' placeholder='Min' size={{prod.args[prod.argCount-1].min?.length||1}}>\r\n            <input [(ngModel)]='prod.args[prod.argCount-1].max' placeholder='Max' size={{prod.args[prod.argCount-1].max?.length||1}}>\r\n            <mat-slider\r\n                [(ngModel)]='prod.args[prod.argCount-1].default'\r\n                thumbLabel\r\n                tickInterval=\"auto\"\r\n                min={{prod.args[prod.argCount-1].min||0}}\r\n                max={{prod.args[prod.argCount-1].max||100}}></mat-slider>\r\n            <input [class.disabled-input]='true' [(ngModel)]='prod.args[prod.argCount-1].default' size={{prod.args[prod.argCount-1].default?.length||1}} disabled>\r\n\r\n        </div>\r\n        <input *ngSwitchCase=\"PortTypes.Checkbox\" [(ngModel)]='prod.args[prod.argCount-1].default' name='prod.args[prod.argCount-1].default' type=\"checkbox\">\r\n        <input *ngSwitchCase=\"PortTypes.URL\" [(ngModel)]='prod.args[prod.argCount-1].default' name='prod.args[prod.argCount-1].default' placeholder='Default URL'>\r\n        <input *ngSwitchCase=\"PortTypes.File\" (change)=\"onFileChange($event)\" type=\"file\">\r\n    </ng-container>\r\n\r\n    \r\n    <!--\r\n    <div class='parameter__name' [ngSwitch]=\"prod.meta.mode\">\r\n        <input *ngSwitchCase=\"PortTypes.SimpleInput\" [(ngModel)]='prod.args[prod.argCount-1].default' name='prod.args[prod.argCount-1].default' placeholder='Default Value'>\r\n        <div *ngSwitchCase=\"PortTypes.Slider\">\r\n            <input [(ngModel)]='prod.args[prod.argCount-1].default' value='prod.args[prod.argCount-1].default' disabled>\r\n            <input [(ngModel)]='prod.args[prod.argCount-1].default' name='prod.args[prod.argCount-1].default' type=\"range\" >\r\n        </div>\r\n        <input *ngSwitchCase=\"PortTypes.Checkbox\" [(ngModel)]='prod.args[prod.argCount-1].default' name='prod.args[prod.argCount-1].default' type=\"checkbox\">\r\n        <input *ngSwitchCase=\"PortTypes.URL\" [(ngModel)]='prod.args[prod.argCount-1].default' name='prod.args[prod.argCount-1].default' placeholder='Default URL'>\r\n        <input *ngSwitchCase=\"PortTypes.File\" (change)=\"onFileChange($event)\" type=\"file\">\r\n    </div>\r\n\r\n    <select name={{prod.name}}_type *ngIf=\"prod.parentNode.type=='start'\"  [(ngModel)]=\"prod.meta.mode\">\r\n        <option \r\n            *ngFor=\"let ptype of PortTypesArr\" \r\n            [value]=\"PortTypes[ptype]\" \r\n            [selected]=\"prod.meta.mode == ptype\">{{ptype}}</option>\r\n    </select>\r\n    -->\r\n\r\n</div>\r\n\r\n"

/***/ }),

/***/ "./src/app/views/view-editor/parameter-editor/procedure-input-editor/procedure-input-editor.component.scss":
/*!*****************************************************************************************************************!*\
  !*** ./src/app/views/view-editor/parameter-editor/procedure-input-editor/procedure-input-editor.component.scss ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".container {\n  margin: 5px 0px; }\n\n.container--parameter {\n  display: inline-block;\n  flex-direction: row;\n  flex-wrap: wrap;\n  color: #505050;\n  vertical-align: bottom;\n  padding-bottom: 5px;\n  border-bottom: 1px solid gainsboro;\n  border-left: 1px solid gainsboro;\n  width: 100%; }\n\nselect {\n  color: #505050;\n  background-color: #fafafa;\n  border: 1px solid #505050; }\n\ninput {\n  color: #505050;\n  background-color: #fafafa;\n  border: none;\n  border-bottom: 1px solid #505050;\n  margin-left: 5px;\n  vertical-align: bottom; }\n\ninput.disabled-input {\n    border-bottom: none; }\n\n.slider-val {\n  color: #505050;\n  resize: horizontal;\n  size: 2;\n  min-width: 1px;\n  max-width: 300px;\n  width: 20px; }\n\n.container--input {\n  display: inline-flex;\n  flex-direction: row; }\n\n.div--slider {\n  display: inline-flex;\n  flex-direction: row; }\n\n.parameter__name {\n  width: 100px;\n  height: auto;\n  word-wrap: break-word; }\n\nmat-slider {\n  width: 300px; }\n"

/***/ }),

/***/ "./src/app/views/view-editor/parameter-editor/procedure-input-editor/procedure-input-editor.component.ts":
/*!***************************************************************************************************************!*\
  !*** ./src/app/views/view-editor/parameter-editor/procedure-input-editor/procedure-input-editor.component.ts ***!
  \***************************************************************************************************************/
/*! exports provided: procedureInputEditorComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "procedureInputEditorComponent", function() { return procedureInputEditorComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _models_port__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @models/port */ "./src/app/shared/models/port/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var keys = Object.keys(_models_port__WEBPACK_IMPORTED_MODULE_1__["InputType"]);
var procedureInputEditorComponent = /** @class */ (function () {
    function procedureInputEditorComponent() {
        this.delete = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.PortTypes = _models_port__WEBPACK_IMPORTED_MODULE_1__["InputType"];
        this.PortTypesArr = keys.slice(keys.length / 2);
    }
    procedureInputEditorComponent.prototype.editOptions = function () { };
    procedureInputEditorComponent.prototype.onFileChange = function (event) {
        this.prod.args[this.prod.argCount - 1].default = event.target.files[0];
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], procedureInputEditorComponent.prototype, "prod", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], procedureInputEditorComponent.prototype, "delete", void 0);
    procedureInputEditorComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'procedure-input-editor',
            template: __webpack_require__(/*! ./procedure-input-editor.component.html */ "./src/app/views/view-editor/parameter-editor/procedure-input-editor/procedure-input-editor.component.html"),
            styles: [__webpack_require__(/*! ./procedure-input-editor.component.scss */ "./src/app/views/view-editor/parameter-editor/procedure-input-editor/procedure-input-editor.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], procedureInputEditorComponent);
    return procedureInputEditorComponent;
}());



/***/ }),

/***/ "./src/app/views/view-editor/procedure-item/procedure-item.component.html":
/*!********************************************************************************!*\
  !*** ./src/app/views/view-editor/procedure-item/procedure-item.component.html ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class='container--line' \r\n    [class.selected]=\"data.selected\"\r\n    [class.error]=\"data.hasError\"\r\n    [class.disabled]=\"!data.enabled\"\r\n    [ngSwitch]=\"data.type\"\r\n    (click)='emitSelect($event, data)'>\r\n    <div class='container--item' >\r\n        <!-- Variable Assignment Template -->\r\n        <div class='line--item' *ngSwitchCase=\"ProcedureTypes.Variable\">\r\n            <input class='input--var'\r\n                [ngModel]='data.args[0].value'\r\n                (ngModelChange)='data.args[0].value=varMod($event)'\r\n                name='data.args[0].name'\r\n                placeholder={{data.args[0].name}}>  \r\n            = \r\n            <input class='input--arg'\r\n                [(ngModel)]='data.args[1].value'\r\n                name='data.args[1].name'\r\n                placeholder={{data.args[1].name}}\r\n                size = {{data.args[1].name.length}}\r\n                (input)='updateInputSize($event)'>  \r\n            </div>\r\n\r\n        <!-- IF Template -->\r\n        <div class='line--item hasChildren' *ngSwitchCase=\"ProcedureTypes.If\">\r\n            <div class='function-text'>\r\n                If\r\n            </div>\r\n            ( <input class='input--arg'\r\n                    (cut)='stopProp($event)' (paste)='stopProp($event)'\r\n                    [(ngModel)]='data.args[0].value'\r\n                    name='data.args[0].name'\r\n                    placeholder={{data.args[0].name}}\r\n                    size={{data.args[0].name.length}}\r\n                    (input)='updateInputSize($event)'>  \r\n                    )\r\n\r\n        </div>\r\n\r\n        <!-- ELSEIF Template -->\r\n        <div class='line--item hasChildren' *ngSwitchCase=\"ProcedureTypes.Elseif\">\r\n            <div class='function-text'>\r\n                Else if\r\n            </div>\r\n            \r\n        \r\n        ( <input class='input--arg'\r\n                (cut)='stopProp($event)' (paste)='stopProp($event)' \r\n                [(ngModel)]='data.args[0].value'\r\n                name='data.args[0].name'\r\n                placeholder={{data.args[0].name}}\r\n                size={{data.args[0].name.length}}\r\n                (input)='updateInputSize($event)'>  \r\n                )\r\n        </div>\r\n\r\n        <!-- ELSE Template -->\r\n        <div class='line--item hasChildren' *ngSwitchCase=\"ProcedureTypes.Else\">\r\n            <div class='function-text'>\r\n                Else\r\n            </div>\r\n        </div>\r\n\r\n        <!-- BREAK Template -->\r\n        <div class='line--item' *ngSwitchCase=\"ProcedureTypes.Break\">\r\n            <div class='function-text'>\r\n                Break\r\n            </div>\r\n        </div>\r\n\r\n        <!-- CONTINUE Template -->\r\n        <div class='line--item' *ngSwitchCase=\"ProcedureTypes.Continue\">\r\n            <div class='function-text'>\r\n                Continue\r\n            </div>\r\n        </div>\r\n\r\n\r\n    <!-- FOREACH Template -->\r\n        <div class='line--item hasChildren' *ngSwitchCase=\"ProcedureTypes.Foreach\">\r\n                <div class='function-text'>\r\n                    For\r\n                </div>\r\n                <input class='input--arg'\r\n                    (cut)='stopProp($event)' (paste)='stopProp($event)'\r\n                    [(ngModel)]='data.args[0].value'\r\n                    name='data.args[0].name'\r\n                    placeholder={{data.args[0].name}}\r\n                    size={{data.args[0].name.length}}\r\n                    (input)='updateInputSize($event)'>  \r\n                <div class='function-text'>\r\n                    in\r\n                </div>\r\n                <input class='input--arg'\r\n                    (cut)='stopProp($event)' (paste)='stopProp($event)'\r\n                    [(ngModel)]='data.args[1].value'\r\n                    name='data.args[1].name'\r\n                    placeholder={{data.args[1].name}}\r\n                    size={{data.args[1].name.length}}\r\n                    (input)='updateInputSize($event)'>  \r\n                    \r\n        </div>\r\n\r\n        <!-- WHILE Template -->\r\n        <div class='line--item hasChildren' *ngSwitchCase=\"ProcedureTypes.While\">\r\n            <div class='function-text'>\r\n                While\r\n            </div>\r\n            <input class='input--arg' \r\n                    (cut)='stopProp($event)' (paste)='stopProp($event)'\r\n                    [(ngModel)]='data.args[0].value'\r\n                    name='data.args[0].name'\r\n                    placeholder={{data.args[0].name}}\r\n                    size={{data.args[0].name.length}}\r\n                    (input)='updateInputSize($event)'>  \r\n\r\n        </div>\r\n        \r\n        <!-- Function Template -->\r\n        <div class='line--item' *ngSwitchCase=\"ProcedureTypes.Function\">\r\n            <ng-container *ngIf=\"data.meta.module.toUpperCase() !='OUTPUT' && data.args[0].name !=='__none__'\">\r\n                <input class='input--var'\r\n                [ngModel]='data.args[0].value'\r\n                (ngModelChange)='data.args[0].value=varMod($event)'\r\n                (cut)='stopProp($event)' \r\n                (paste)='stopProp($event)'\r\n                placeholder={{data.args[0].name}}>  \r\n                = \r\n\r\n            </ng-container>\r\n            <div class='function-text'>{{data.meta.module}}.{{data.meta.name}} </div>\r\n\r\n            <ng-container *ngFor='let p of data.args.slice(1);let i=index'>\r\n                <!--\r\n                <input *ngIf=\"p.name.toUpperCase() !== '__MODEL__'; else text_template\" \r\n                \r\n                (cut)='stopProp($event)' \r\n                (paste)='stopProp($event)' \r\n                [(ngModel)]='p.value' \r\n                placeholder={{p.name}}>    \r\n                \r\n                <ng-template #text_template>\r\n                    model,\r\n                </ng-template>\r\n                -->\r\n\r\n                <input *ngIf=\"p.name.indexOf('__') == -1\" \r\n                        class='input--arg' \r\n                        (cut)='stopProp($event)' \r\n                        (paste)='stopProp($event)' \r\n                        [(ngModel)]='p.value' \r\n                        placeholder={{p.name}}\r\n                        size={{p.name.length}}\r\n                        (input)='updateInputSize($event)'>    \r\n                \r\n                <!--\r\n\r\n                <ng-template #model_template>\r\n                    <ng-container *ngIf=\"p.name == model; else params_template\">\r\n                        model,\r\n                    </ng-container>\r\n                </ng-template>\r\n                <ng-template #params_template>\r\n                    <ng-container *ngIf=\"p.name == constList;\">\r\n                        const_list,\r\n                    </ng-container>\r\n                </ng-template>\r\n                -->\r\n\r\n            </ng-container>\r\n\r\n        </div>\r\n\r\n        <!-- Imported Function Template -->\r\n        <div class='line--item' *ngSwitchCase=\"ProcedureTypes.Imported\">\r\n            <input class='input--var'\r\n                    [ngModel]='data.args[0].value'\r\n                    (ngModelChange)='data.args[0].value=varMod($event)'\r\n                    (cut)='stopProp($event)' (paste)='stopProp($event)'\r\n                    placeholder={{data.args[0].name}}>  \r\n            = \r\n            <div class='function-text'>{{data.meta.name}} </div> \r\n            \r\n            <ng-container *ngFor='let p of data.args.slice(1);let i=index'>\r\n                <input class='input--arg' \r\n                        (cut)='stopProp($event)' (paste)='stopProp($event)' \r\n                        [(ngModel)]='p.value' \r\n                        placeholder={{p.name}}\r\n                        size={{p.name.length}}\r\n                        (input)='updateInputSize($event)'>    \r\n            </ng-container>\r\n            \r\n\r\n        </div>\r\n\r\n\r\n        <!-- delete button-->\r\n        <button class='btn' mat-icon-button title=\"Delete Procedure\" (click)=\"emitDelete()\" tabindex=\"-1\">\r\n            <mat-icon class='icon'>delete_outline</mat-icon>\r\n        </button>\r\n        <!-- Disable button-->\r\n        <button class='btn' mat-icon-button title=\"Disable Procedure\" [class.highlighted]='!data.enabled' (click)='markDisabled()' tabindex=\"-1\">\r\n            <mat-icon class='icon'>tv_off</mat-icon>\r\n        </button>\r\n        <!-- Print button-->\r\n        <button *ngIf='canBePrinted()' class='btn' mat-icon-button title=\"Print Result In Console\" [class.highlighted]='data.print' (click)='markPrint()' tabindex=\"-1\">\r\n            <mat-icon class='icon'>print</mat-icon>\r\n        </button>\r\n        <!-- help button-->\r\n        <button *ngIf='haveHelpText()' class='btn' mat-icon-button title=\"Help\" tabindex=\"-1\">\r\n            <mat-icon class='icon'>help</mat-icon>\r\n        </button>\r\n    </div>\r\n    <!-- list of child procedures (if the procedure has children) -->\r\n    <div *ngIf=\"data?.children\" class='container--nested'>\r\n        <procedure-item \r\n            *ngFor=\"let line of data?.children; let idx=index\" \r\n            [data]=\"line\"\r\n            (select)='selectChild($event, line)'\r\n            (delete)='deleteChild(idx)'></procedure-item>\r\n    </div>\r\n\r\n\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/views/view-editor/procedure-item/procedure-item.component.scss":
/*!********************************************************************************!*\
  !*** ./src/app/views/view-editor/procedure-item/procedure-item.component.scss ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".container--nested {\n  padding-left: 0px; }\n\n.container--line {\n  margin: 8px 0px 2px 10px;\n  padding: 2px 0px 2px 2px;\n  border-bottom: 1px solid gainsboro;\n  border-left: 1px solid gainsboro;\n  color: #505050;\n  min-height: 22px;\n  opacity: 1; }\n\n.container--line.disabled {\n    opacity: 0.5; }\n\n.container--line.selected {\n    border: 1px solid #000096;\n    background-color: gainsboro; }\n\n.container--line.error {\n    border: 1px solid red; }\n\n.container--item {\n  margin: none;\n  padding: none;\n  border: none; }\n\n.btn {\n  height: 24px;\n  width: 24px;\n  float: right;\n  background-color: transparent;\n  border: none;\n  display: none;\n  color: #777; }\n\n.btn.highlighted {\n    background-color: #ff9696; }\n\n.container--item:hover .btn {\n  display: block; }\n\n.icon {\n  vertical-align: top;\n  font-size: 20px; }\n\n.line--item {\n  display: inline-block;\n  color: #505050; }\n\n/*\r\n.hasChildren::before{\r\n    content: '\\25B6';\r\n    position: absolute;\r\n    left: 3px;\r\n    font-size: 8px;\r\n}\r\n*/\n\n.input--var {\n  width: 70px;\n  background-color: #fafafa;\n  border: none;\n  border-bottom: 1px solid #505050;\n  margin-right: 5px; }\n\n.input--arg {\n  resize: horizontal;\n  min-width: 1px;\n  max-width: 300px;\n  width: auto;\n  background-color: #fafafa;\n  border: none;\n  border-bottom: 1px solid #505050;\n  margin-left: 5px; }\n\ninput:focus {\n  border: 1px solid #000096; }\n\n.function-text {\n  display: inline-block;\n  white-space: normal;\n  font-style: italic;\n  color: #be8c1e;\n  font-weight: 600; }\n"

/***/ }),

/***/ "./src/app/views/view-editor/procedure-item/procedure-item.component.ts":
/*!******************************************************************************!*\
  !*** ./src/app/views/view-editor/procedure-item/procedure-item.component.ts ***!
  \******************************************************************************/
/*! exports provided: ProcedureItemComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProcedureItemComponent", function() { return ProcedureItemComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _models_procedure__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @models/procedure */ "./src/app/shared/models/procedure/index.ts");
/* harmony import */ var _shared_decorators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @shared/decorators */ "./src/app/shared/decorators/index.ts");
/* harmony import */ var _modules__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @modules */ "./src/app/core/modules/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var canvas = document.createElement('canvas');
var ctx = canvas.getContext("2d");
ctx.font = "14px Arial";
var ProcedureItemComponent = /** @class */ (function () {
    function ProcedureItemComponent() {
        this.delete = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.select = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.copied = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.pasteOn = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.model = _modules__WEBPACK_IMPORTED_MODULE_3__["_parameterTypes"].model;
        this.constList = _modules__WEBPACK_IMPORTED_MODULE_3__["_parameterTypes"].constList;
        this.ProcedureTypes = _models_procedure__WEBPACK_IMPORTED_MODULE_1__["ProcedureTypes"];
    }
    // delete this procedure
    ProcedureItemComponent.prototype.emitDelete = function () {
        this.delete.emit();
    };
    // select this procedure
    ProcedureItemComponent.prototype.emitSelect = function (event, procedure) {
        event.stopPropagation();
        this.select.emit({ "ctrl": event.ctrlKey, "prod": procedure });
    };
    // delete child procedure (after receiving emitDelete from child procedure)
    ProcedureItemComponent.prototype.deleteChild = function (index) {
        this.data.children.splice(index, 1);
    };
    // select child procedure (after receiving emitSelect from child procedure)
    ProcedureItemComponent.prototype.selectChild = function (event, procedure) {
        this.select.emit(event);
    };
    ProcedureItemComponent.prototype.markPrint = function () {
        this.data.print = !this.data.print;
    };
    ProcedureItemComponent.prototype.markDisabled = function () {
        this.data.enabled = !this.data.enabled;
    };
    ProcedureItemComponent.prototype.canBePrinted = function () {
        return (this.data.argCount > 0 && this.data.args[0].name == 'var_name');
    };
    ProcedureItemComponent.prototype.haveHelpText = function () {
        return (this.data.type == _models_procedure__WEBPACK_IMPORTED_MODULE_1__["ProcedureTypes"].Function || this.data.type == _models_procedure__WEBPACK_IMPORTED_MODULE_1__["ProcedureTypes"].Imported);
    };
    // stopPropagation to prevent cut/paste with input box focused
    ProcedureItemComponent.prototype.stopProp = function (event) {
        event.stopPropagation();
    };
    // modify input: replace space " " with underscore "_"
    ProcedureItemComponent.prototype.varMod = function (event) {
        if (!event)
            return event;
        var str = event.trim();
        str = str.replace(/ /g, "_");
        return str;
    };
    ProcedureItemComponent.prototype.updateInputSize = function (event) {
        var val = event.target.value || event.target.placeholder;
        event.target.style.width = ctx.measureText(val).width + 10 + 'px';
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], ProcedureItemComponent.prototype, "data", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ProcedureItemComponent.prototype, "delete", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ProcedureItemComponent.prototype, "select", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ProcedureItemComponent.prototype, "copied", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ProcedureItemComponent.prototype, "pasteOn", void 0);
    ProcedureItemComponent = __decorate([
        _shared_decorators__WEBPACK_IMPORTED_MODULE_2__["ProcedureTypesAware"],
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'procedure-item',
            template: __webpack_require__(/*! ./procedure-item.component.html */ "./src/app/views/view-editor/procedure-item/procedure-item.component.html"),
            styles: [__webpack_require__(/*! ./procedure-item.component.scss */ "./src/app/views/view-editor/procedure-item/procedure-item.component.scss")]
        })
    ], ProcedureItemComponent);
    return ProcedureItemComponent;
}());



/***/ }),

/***/ "./src/app/views/view-editor/toolset/toolset.component.html":
/*!******************************************************************!*\
  !*** ./src/app/views/view-editor/toolset/toolset.component.html ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ng-container *ngIf=\"nodeType == ''\">\r\n    <!-- basic functions: variable, if, else, else if, for, while, continue, break -->\r\n    <ul class='toolset__basic'>\r\n        <ng-container *ngFor=\"let type of ProcedureTypesArr\">\r\n            <li *ngIf='type.toUpperCase() !== \"FUNCTION\" && type.toUpperCase() !== \"IMPORTED\"'\r\n            class='tooltip'\r\n            (click)='add(ProcedureTypes[type])'> \r\n                {{type}}\r\n                <!--\r\n                <span class=\"tooltiptext\">\r\n                    <p class='funcDesc'>{{type}}</p>\r\n                </span>\r\n                -->\r\n            </li>\r\n        </ng-container>\r\n    </ul>\r\n    \r\n\r\n    <!-- functions from core.modules -->\r\n    <ng-container *ngFor='let mod of Modules' >\r\n\r\n        <button id='{{mod.module}}' class=\"accordion\" \r\n        *ngIf='mod.module.toUpperCase() != \"INPUT\" && mod.module.toUpperCase() != \"OUTPUT\"'\r\n        (click)='toggleAccordion(mod.module)' >{{ mod.module }}</button>\r\n        <div class=\"panel\">\r\n            <ul class='toolset__functions--subset'>\r\n                <div class='tooltip' *ngFor='let fn of mod.functions'>\r\n                    <li \r\n                    (click)='add_function(fn)'> \r\n                        {{fn.name}} \r\n                    </li>\r\n                    <span class=\"tooltiptext\" *ngIf='ModulesDoc[mod.module] && ModulesDoc[mod.module][fn.name]'>\r\n                        <p class='funcDesc'>{{ModulesDoc[mod.module][fn.name].summary||ModulesDoc[mod.module][fn.name].description}}</p>\r\n                        <p *ngIf='ModulesDoc[mod.module][fn.name].parameters?.length > 0'><span>Parameters: </span></p>\r\n                        <p class='paramP' *ngFor='let param of ModulesDoc[mod.module][fn.name].parameters'><span>{{param.name}} - </span> {{param.description}}</p>\r\n                        <p *ngIf='ModulesDoc[mod.module][fn.name].returns'><span>Returns: </span> {{ModulesDoc[mod.module][fn.name].returns}}</p>\r\n                    </span>\r\n                </div>\r\n            </ul>\r\n        </div>\r\n    </ng-container>\r\n\r\n    <!-- imported functions -->\r\n    <ng-container>\r\n        <button id='imported' class=\"accordion\" \r\n        (click)='toggleAccordion(\"imported\")' >Imported</button>\r\n        <div class=\"panel\">\r\n            <ul class='toolset__functions--subset'>\r\n                <li *ngFor='let fn of functions' (click)='add_imported_function(fn)'> {{fn.name}} \r\n                    <button class='remove-btn' (click)='delete_imported_function(fn)'>\r\n                        <mat-icon class='remove-icon'>close</mat-icon>\r\n                    </button>\r\n                </li>\r\n            </ul>\r\n            <br>\r\n            <input type=\"file\" id=\"selectedFile\" (change)=\"import_function($event)\" style=\"display: none;\" />\r\n            <button class='add-btn' onclick=\"document.getElementById('selectedFile').click();\" title=\"Import Function from File\">\r\n                <mat-icon class='add-icon'>open_in_browser</mat-icon>\r\n            </button>\r\n        </div>\r\n    </ng-container>\r\n</ng-container>\r\n\r\n<!-- functions for input nodes -->\r\n<div id='toolset_inp' class = 'toolset' *ngIf=\"nodeType == 'start'\">\r\n    \r\n    <div class='toolset__functions'>\r\n        <section *ngFor='let mod of Modules' >\r\n            <div *ngIf='mod.module.toUpperCase() == \"INPUT\"'>\r\n                <!-- <h3>{{ mod.module }}</h3> -->\r\n                <ul class='toolset__functions--subset'>\r\n                    <li *ngFor='let fn of mod.functions' (click)='add_function(fn)'> {{fn.name}} </li>\r\n                </ul>\r\n            </div>\r\n        </section>\r\n    </div>\r\n</div>\r\n\r\n<!-- functions for output nodes -->\r\n<div id='toolset_inp' class = 'toolset' *ngIf=\"nodeType == 'end'\">\r\n    <div class='toolset__functions' *ngIf=\"hasProd===false\">\r\n        <section *ngFor='let mod of Modules' >\r\n            <div *ngIf='mod.module.toUpperCase() == \"OUTPUT\"'>\r\n                <!-- <h3>{{ mod.module }}</h3> -->\r\n                <ul class='toolset__functions--subset'>\r\n                    <li *ngFor='let fn of mod.functions' (click)='add_function(fn)'> {{fn.name}} </li>\r\n                </ul>\r\n            </div>\r\n        </section>\r\n    </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/views/view-editor/toolset/toolset.component.scss":
/*!******************************************************************!*\
  !*** ./src/app/views/view-editor/toolset/toolset.component.scss ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host {\n  width: 100%;\n  background-color: #efefef; }\n\nul {\n  list-style-type: none;\n  margin: 0px;\n  padding: 0px;\n  padding-left: 15px; }\n\nul li {\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none;\n    margin: 0px;\n    padding: 0px;\n    color: #505050;\n    font-size: 12px;\n    line-height: 18px; }\n\n.remove-btn {\n  background-color: transparent;\n  border: none;\n  height: 13px;\n  float: right; }\n\n.remove-btn .remove-icon {\n    font-size: 11px;\n    height: 11px;\n    color: #505050; }\n\n.add-btn {\n  background-color: transparent;\n  border: none;\n  float: left;\n  padding: 6px;\n  transition: 0.4s; }\n\n.add-btn :hover {\n    background-color: gainsboro; }\n\n.add-btn .add-icon {\n    float: left;\n    color: #505050; }\n\n.accordion {\n  background-color: gainsboro;\n  color: #505050;\n  cursor: pointer;\n  width: 100%;\n  padding: 8px 8px 8px 8px;\n  border: none;\n  display: block;\n  text-align: left;\n  outline: none;\n  font-size: 12px;\n  transition: 0.4s;\n  font-weight: 550; }\n\n.active, .accordion:hover {\n  background-color: #ccc; }\n\n.panel {\n  width: inherit;\n  padding: 0px 10px 0px 0px;\n  display: none;\n  background-color: #efefef;\n  overflow: hidden; }\n\n.tooltip {\n  display: block; }\n\n/* Tooltip text */\n\n.tooltip .tooltiptext {\n  min-width: 50px;\n  max-width: 500px;\n  background-color: #efefef;\n  border: 1px solid #ccc;\n  color: #505050;\n  pointer-events: none;\n  padding: 0px 10px 0px 10px;\n  opacity: 0;\n  position: absolute;\n  z-index: 1; }\n\n.tooltip .tooltiptext p {\n    font-family: sans-serif; }\n\n.tooltip .tooltiptext p.funcDesc {\n      font-weight: 600; }\n\n.tooltip .tooltiptext p.paramP {\n      padding-left: 5px; }\n\n.tooltip .tooltiptext p.paramP ::before {\n        display: inline-block;\n        content: '';\n        border-radius: 0.25rem;\n        height: 0.25rem;\n        width: 0.25rem;\n        margin: 0rem 0.3rem 0.15rem 0rem;\n        background-color: #505050; }\n\n.tooltip .tooltiptext p span {\n      font-style: italic; }\n\n/* Show the tooltip text when you mouse over the tooltip container */\n\n.tooltip:hover .tooltiptext {\n  transition-delay: 1s;\n  transition-duration: 0.3s;\n  opacity: 1; }\n"

/***/ }),

/***/ "./src/app/views/view-editor/toolset/toolset.component.ts":
/*!****************************************************************!*\
  !*** ./src/app/views/view-editor/toolset/toolset.component.ts ***!
  \****************************************************************/
/*! exports provided: ToolsetComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ToolsetComponent", function() { return ToolsetComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _models_procedure__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @models/procedure */ "./src/app/shared/models/procedure/index.ts");
/* harmony import */ var circular_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! circular-json */ "./node_modules/circular-json/build/circular-json.node.js");
/* harmony import */ var circular_json__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(circular_json__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _shared_decorators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @shared/decorators */ "./src/app/shared/decorators/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




var keys = Object.keys(_models_procedure__WEBPACK_IMPORTED_MODULE_1__["ProcedureTypes"]);
var ToolsetComponent = /** @class */ (function () {
    function ToolsetComponent() {
        this.select = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.delete = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.imported = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.ProcedureTypes = _models_procedure__WEBPACK_IMPORTED_MODULE_1__["ProcedureTypes"];
        this.ProcedureTypesArr = keys.slice(keys.length / 2);
    }
    // add selected basic function as a new procedure
    ToolsetComponent.prototype.add = function (type) {
        this.select.emit({ type: type, data: undefined });
    };
    // add selected function from core.modules as a new procedure
    ToolsetComponent.prototype.add_function = function (fnData) {
        // create a fresh copy of the params to avoid linked objects
        // todo: figure out
        fnData.args = fnData.args.map(function (arg) {
            return { name: arg.name, value: arg.value, default: arg.default };
        });
        this.select.emit({ type: _models_procedure__WEBPACK_IMPORTED_MODULE_1__["ProcedureTypes"].Function, data: fnData });
    };
    // add selected imported function as a new procedure
    ToolsetComponent.prototype.add_imported_function = function (fnData) {
        fnData.args = fnData.args.map(function (arg) {
            return { name: arg.name, value: arg.value };
        });
        this.select.emit({ type: _models_procedure__WEBPACK_IMPORTED_MODULE_1__["ProcedureTypes"].Imported, data: fnData });
    };
    // delete imported function
    ToolsetComponent.prototype.delete_imported_function = function (fnData) {
        this.delete.emit(fnData);
    };
    // import a flowchart as function
    ToolsetComponent.prototype.import_function = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var p, fnc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        p = new Promise(function (resolve) {
                            var reader = new FileReader();
                            reader.onload = function () {
                                // parse the flowchart
                                var fl = circular_json__WEBPACK_IMPORTED_MODULE_2__["parse"](reader.result.toString()).flowchart;
                                // create function
                                var funcs = [];
                                var func = {
                                    module: {
                                        name: fl.name,
                                        nodes: fl.nodes,
                                        edges: fl.edges
                                    },
                                    name: event.target.files[0].name.split('.')[0],
                                };
                                // go through the nodes
                                func.argCount = fl.nodes[0].procedure.length;
                                func.args = fl.nodes[0].procedure.map(function (prod) {
                                    return {
                                        name: prod.args[prod.argCount - 2].value.substring(1, prod.args[prod.argCount - 2].value.length - 1),
                                        default: prod.args[prod.argCount - 1].default,
                                        value: undefined,
                                        min: undefined,
                                        max: undefined
                                    };
                                });
                                if (!func.argCount) {
                                    resolve('error');
                                }
                                // add func and all the imported functions of the imported flowchart to funcs
                                funcs.push(func);
                                for (var _i = 0, _a = fl.functions; _i < _a.length; _i++) {
                                    var i = _a[_i];
                                    funcs.push(i);
                                }
                                resolve(funcs);
                            };
                            reader.onerror = function () {
                                resolve('error');
                            };
                            reader.readAsText(event.target.files[0]);
                        });
                        return [4 /*yield*/, p];
                    case 1:
                        fnc = _a.sent();
                        document.getElementById('selectedFile').value = "";
                        if (fnc === 'error') {
                            console.warn('Error reading file');
                            return [2 /*return*/];
                        }
                        this.imported.emit(fnc);
                        return [2 /*return*/];
                }
            });
        });
    };
    ToolsetComponent.prototype.toggleAccordion = function (id) {
        var acc = document.getElementById(id);
        //var acc = document.getElementsByClassName("accordion");
        acc.classList.toggle("active");
        var panel = acc.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        }
        else {
            panel.style.display = "block";
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ToolsetComponent.prototype, "select", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ToolsetComponent.prototype, "delete", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ToolsetComponent.prototype, "imported", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Array)
    ], ToolsetComponent.prototype, "functions", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], ToolsetComponent.prototype, "nodeType", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], ToolsetComponent.prototype, "hasProd", void 0);
    ToolsetComponent = __decorate([
        _shared_decorators__WEBPACK_IMPORTED_MODULE_3__["ModuleAware"],
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'toolset',
            template: __webpack_require__(/*! ./toolset.component.html */ "./src/app/views/view-editor/toolset/toolset.component.html"),
            styles: [__webpack_require__(/*! ./toolset.component.scss */ "./src/app/views/view-editor/toolset/toolset.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], ToolsetComponent);
    return ToolsetComponent;
}());



/***/ }),

/***/ "./src/app/views/view-editor/view-editor.component.html":
/*!**************************************************************!*\
  !*** ./src/app/views/view-editor/view-editor.component.html ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h2>{{node?.name}}</h2>\r\n\r\n<div class='container--editor' (mouseenter)='activateCopyPaste()'  (mouseleave)='deactivateCopyPaste()'\r\n(copy)='copyProd()' (cut)='cutProd($event)' (paste)='pasteProd($event)'>\r\n\r\n\t<div class='container__content'>\r\n\t\t<!-- toolset on the left side -->\r\n\t\t<div class=\"container--toolset\">\r\n\t\t\t<toolset [functions]='flowchart.functions' \r\n\t\t\t[nodeType]='node.type' \r\n\t\t\t[hasProd]='node.procedure.length>0' \r\n\t\t\t(delete)='deleteFunction($event)' \r\n\t\t\t(select)='add($event)' \r\n\t\t\t(imported)='importFunction($event)'></toolset>\r\n\t\t</div>\r\n\r\n\t\t<!-- procedure editor on the right side -->\r\n\t\t<div id='procedure' class=\"container--procedure\">\r\n\t\t\t<!-- parameter-editor only for start node -->\r\n\t\t\t<parameter-editor *ngIf=\"node.type == 'start'\" [flowchart]='flowchart' [node]='node'></parameter-editor>\r\n\r\n\t\t\t<!-- list of procedure items for all nodes -->\r\n\t\t\t<procedure-item \r\n\t\t\t*ngFor=\"let line of node?.procedure; let idx=index\" \r\n\t\t\t[data]=\"line\"\r\n\t\t\t(select)=\"selectProcedure($event,line)\"\r\n\t\t\t(delete)=\"deleteChild(idx)\"></procedure-item>\r\n\t\t\t<br>\r\n\t\t\t<br>\r\n\t\t</div>\r\n\t</div>\r\n\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/views/view-editor/view-editor.component.scss":
/*!**************************************************************!*\
  !*** ./src/app/views/view-editor/view-editor.component.scss ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".container--editor {\n  display: block;\n  height: 95%;\n  width: 100%; }\n\n.container__heading {\n  display: block;\n  text-align: center;\n  width: 98%; }\n\nh2 {\n  color: #505050;\n  text-align: left;\n  width: 100%;\n  font-size: 12px;\n  line-height: 14px;\n  font-weight: 600;\n  padding-left: 15px; }\n\nhr {\n  border-top: 2px solid #efefef; }\n\n.container__content {\n  display: inline-flex;\n  width: 100%;\n  min-height: 95%;\n  overflow: inherit; }\n\n.container--toolset {\n  display: inline-flex;\n  width: 20%; }\n\n.container--procedure {\n  display: block;\n  width: 80%;\n  bottom: 10px;\n  background-color: #fafafa;\n  padding: none; }\n\nhr {\n  border-top: 2px solid #efefef;\n  width: 100%; }\n\n/*\r\n$header-height: 45px;\r\n\r\n.container{\r\n    position: relative;\r\n    overflow: auto;\r\n    margin: 10px 10px;\r\n\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: space-around;\r\n        \r\n    h1, h2, h3, h4, h5, h6, p{\r\n        margin: 0px;\r\n        padding: 0px;\r\n    }\r\n\r\n    .container__header{\r\n        flex: 0 1 auto;\r\n        min-height: $header-height;\r\n\r\n        display: flex;\r\n        flex-direction: row;\r\n        justify-content: space-between;\r\n\r\n        padding: 0px 0px 0px 15px;\r\n\r\n        background-color: #3F4651;\r\n        color: #E7BF00;\r\n        \r\n        line-height: $header-height;\r\n        text-transform: uppercase;\r\n    \r\n        font-size: 18px;\r\n        font-weight: 600;\r\n        text-align: center;\r\n    }\r\n\r\n    .container__content{\r\n        flex-grow: 1;\r\n        height: 0px;\r\n        border: 2px solid #3F4651;\r\n        overflow: auto;\r\n\r\n        split{\r\n            height: 100%;\r\n        }\r\n    }\r\n\r\n    .container__footer{\r\n        text-align: center;\r\n        font-size: 12px;\r\n        line-height: 18px;\r\n\r\n        background-color: #3F4651;\r\n        color: #E7BF00;\r\n    }\r\n}\r\n\r\n\r\n.content__panel{\r\n    height: 100%; \r\n    overflow: auto;\r\n\r\n    //padding: 10px 15px;\r\n}\r\n*/\n"

/***/ }),

/***/ "./src/app/views/view-editor/view-editor.component.ts":
/*!************************************************************!*\
  !*** ./src/app/views/view-editor/view-editor.component.ts ***!
  \************************************************************/
/*! exports provided: ViewEditorComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewEditorComponent", function() { return ViewEditorComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _models_node__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @models/node */ "./src/app/shared/models/node/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ViewEditorComponent = /** @class */ (function () {
    function ViewEditorComponent() {
        this.imported = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.delete_Function = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.copyCheck = false;
    }
    // add a procedure
    ViewEditorComponent.prototype.add = function (data) {
        _models_node__WEBPACK_IMPORTED_MODULE_1__["NodeUtils"].add_procedure(this.node, data.type, data.data);
    };
    // delete a procedure
    ViewEditorComponent.prototype.deleteChild = function (index) {
        this.node.procedure.splice(index, 1);
        _models_node__WEBPACK_IMPORTED_MODULE_1__["NodeUtils"].deselect_procedure(this.node);
    };
    // select a procedure
    ViewEditorComponent.prototype.selectProcedure = function (event, line) {
        _models_node__WEBPACK_IMPORTED_MODULE_1__["NodeUtils"].select_procedure(this.node, event.prod, event.ctrl || false);
    };
    // copy selected procedures
    ViewEditorComponent.prototype.copyProd = function () {
        if (!this.copyCheck)
            return;
        console.log('copying', this.node.state.procedure);
        this.copiedProd = this.node.state.procedure;
    };
    // cut selected procedures
    ViewEditorComponent.prototype.cutProd = function (event) {
        if (!this.copyCheck || document.activeElement.nodeName == "INPUT")
            return;
        console.log('cutting', this.node.state.procedure);
        this.copiedProd = this.node.state.procedure;
        var parentArray;
        for (var _i = 0, _a = this.copiedProd; _i < _a.length; _i++) {
            var prod = _a[_i];
            if (prod.parent) {
                parentArray = prod.parent.children;
            }
            else
                parentArray = this.node.procedure;
            for (var i = 0; i < parentArray.length; i++) {
                if (parentArray[i] === prod) {
                    parentArray.splice(i, 1);
                    break;
                }
            }
        }
        _models_node__WEBPACK_IMPORTED_MODULE_1__["NodeUtils"].deselect_procedure(this.node);
    };
    // paste copied procedures
    ViewEditorComponent.prototype.pasteProd = function (event) {
        if (this.copyCheck && this.copiedProd && document.activeElement.nodeName.toUpperCase() != "INPUT") {
            var pastingPlace = this.node.state.procedure[0];
            if (pastingPlace === undefined) {
                for (var i = 0; i < this.copiedProd.length; i++) {
                    console.log('pasting', this.copiedProd[i].ID);
                    _models_node__WEBPACK_IMPORTED_MODULE_1__["NodeUtils"].paste_procedure(this.node, this.copiedProd[i]);
                    this.node.state.procedure[0].selected = false;
                    this.node.state.procedure = [];
                }
            }
            else if (pastingPlace.children) {
                for (var i = 0; i < this.copiedProd.length; i++) {
                    console.log('pasting', this.copiedProd[i].ID);
                    _models_node__WEBPACK_IMPORTED_MODULE_1__["NodeUtils"].paste_procedure(this.node, this.copiedProd[i]);
                    this.node.state.procedure[0].selected = false;
                    pastingPlace.selected = true;
                    this.node.state.procedure = [pastingPlace];
                }
            }
            else {
                for (var i = this.copiedProd.length - 1; i >= 0; i--) {
                    console.log('pasting', this.copiedProd[i].ID);
                    _models_node__WEBPACK_IMPORTED_MODULE_1__["NodeUtils"].paste_procedure(this.node, this.copiedProd[i]);
                    this.node.state.procedure[0].selected = false;
                    pastingPlace.selected = true;
                    this.node.state.procedure = [pastingPlace];
                }
            }
            //this.copiedProd = undefined;
        }
    };
    // activate copying/cutting/pasting when the mouse hovers over the procedure list
    ViewEditorComponent.prototype.activateCopyPaste = function () {
        this.copyCheck = true;
    };
    // deactivate copying/cutting/pasting when the mouse exit the procedure list
    ViewEditorComponent.prototype.deactivateCopyPaste = function () {
        this.copyCheck = false;
    };
    // import a flowchart as function
    ViewEditorComponent.prototype.importFunction = function (event) {
        for (var _i = 0, event_1 = event; _i < event_1.length; _i++) {
            var func = event_1[_i];
            this.flowchart.functions.push(func);
        }
    };
    // delete an imported function
    ViewEditorComponent.prototype.deleteFunction = function (event) {
        for (var i = 0; i < this.flowchart.functions.length; i++) {
            if (this.flowchart.functions[i] == event) {
                this.flowchart.functions.splice(i, 1);
                break;
            }
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], ViewEditorComponent.prototype, "flowchart", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], ViewEditorComponent.prototype, "node", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ViewEditorComponent.prototype, "imported", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ViewEditorComponent.prototype, "delete_Function", void 0);
    ViewEditorComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'view-editor',
            template: __webpack_require__(/*! ./view-editor.component.html */ "./src/app/views/view-editor/view-editor.component.html"),
            styles: [__webpack_require__(/*! ./view-editor.component.scss */ "./src/app/views/view-editor/view-editor.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], ViewEditorComponent);
    return ViewEditorComponent;
}());



/***/ }),

/***/ "./src/app/views/view-editor/view-editor.module.ts":
/*!*********************************************************!*\
  !*** ./src/app/views/view-editor/view-editor.module.ts ***!
  \*********************************************************/
/*! exports provided: ViewEditorModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewEditorModule", function() { return ViewEditorModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @shared/shared.module */ "./src/app/shared/shared.module.ts");
/* harmony import */ var _view_editor_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./view-editor.component */ "./src/app/views/view-editor/view-editor.component.ts");
/* harmony import */ var _procedure_item_procedure_item_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./procedure-item/procedure-item.component */ "./src/app/views/view-editor/procedure-item/procedure-item.component.ts");
/* harmony import */ var _toolset_toolset_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./toolset/toolset.component */ "./src/app/views/view-editor/toolset/toolset.component.ts");
/* harmony import */ var _parameter_editor_parameter_editor_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./parameter-editor/parameter-editor.component */ "./src/app/views/view-editor/parameter-editor/parameter-editor.component.ts");
/* harmony import */ var _parameter_editor_procedure_input_editor_procedure_input_editor_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./parameter-editor/procedure-input-editor/procedure-input-editor.component */ "./src/app/views/view-editor/parameter-editor/procedure-input-editor/procedure-input-editor.component.ts");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var ViewEditorModule = /** @class */ (function () {
    function ViewEditorModule() {
    }
    ViewEditorModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            declarations: [
                _view_editor_component__WEBPACK_IMPORTED_MODULE_3__["ViewEditorComponent"],
                _procedure_item_procedure_item_component__WEBPACK_IMPORTED_MODULE_4__["ProcedureItemComponent"],
                _toolset_toolset_component__WEBPACK_IMPORTED_MODULE_5__["ToolsetComponent"],
                _parameter_editor_parameter_editor_component__WEBPACK_IMPORTED_MODULE_6__["ParameterEditorComponent"],
                _parameter_editor_procedure_input_editor_procedure_input_editor_component__WEBPACK_IMPORTED_MODULE_7__["procedureInputEditorComponent"],
            ],
            entryComponents: [],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__["SharedModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatSliderModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatIconModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatExpansionModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatButtonModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatSelectModule"],
            ],
            exports: [
                _view_editor_component__WEBPACK_IMPORTED_MODULE_3__["ViewEditorComponent"],
            ],
            providers: []
        }),
        __metadata("design:paramtypes", [])
    ], ViewEditorModule);
    return ViewEditorModule;
}());



/***/ }),

/***/ "./src/app/views/view-publish/view-publish.component.html":
/*!****************************************************************!*\
  !*** ./src/app/views/view-publish/view-publish.component.html ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<parameter-viewer [flowchart]='flowchart' [startNode]='flowchart.nodes[0]' [endNode]='getEndNode()'></parameter-viewer>\r\n\r\n<!--\r\n<div class='container'>\r\n\t<div class='container__content'>\r\n\t\r\n\t\t< !-- Side content__Panel: Split into three panes -- >\r\n\t\t<as-split direction=\"vertical\">\r\n\r\n\t\t\t<as-split-area size='20'>\r\n\t\t\t\t<div class='content__panel'>\r\n\t\t\t\t\t<parameter-viewer [node]='flowchart.nodes[0]'></parameter-viewer>\r\n\t\t\t\t</div>\r\n\t\t\t</as-split-area>\r\n\t\t\t\r\n\t\t\t< !-- \r\n\t\t\t<as-split-area size='20'>\r\n\t\t\t\t<div class='content__panel'>\r\n\t\t\t\t\t\t<flowchart [data]=\"flowchart\" (select)='selectNode($event)'></flowchart>\r\n\t\t\t\t</div>\r\n\t\t\t</as-split-area> \r\n\t\t\t-- >\r\n\t\t\r\n\t\t</as-split>\r\n\t\t\t\t\t\r\n\t</div>\r\n</div>\r\n-->\r\n<!--\r\n<div class='container'>\r\n\r\n\t<div class='container__header'>\r\n\t\tMobius Viewer\t\r\n\t\t<navigation></navigation>\r\n\t\t<execute [flowchart]='flowchart'></execute>\r\n\t</div>\r\n\r\n\t<div class='container__content'>\r\n\t\t<file-new *ngIf='!flowchart'></file-new>\r\n\r\n\t\t<as-split direction=\"horizontal\" *ngIf='flowchart'>\r\n\t\t\t<as-split-area size=\"60\">\r\n\r\n\t\t\t\t<div class='content__panel' *ngIf='flowchart.meta.selected_nodes[0] !== undefined'>\r\n\t\t\t\t\t<mviewer [node]='flowchart.nodes[flowchart.meta.selected_nodes[0]]'></mviewer>\r\n\t\t\t\t</div>\r\n\t\t\t</as-split-area>\r\n\t\t\t\r\n\t\t\t<as-split-area size=\"40\">\r\n\t\r\n\r\n\t\t\t\t<as-split direction=\"vertical\">\r\n\t\r\n\t\t\t\t\t\t<as-split-area size='20'>\r\n\t\t\t\t\t\t\t<div class='content__panel'>\r\n\t\t\t\t\t\t\t\t<parameter-viewer [node]='flowchart.nodes[0]'></parameter-viewer>\r\n\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t</as-split-area>\r\n\t\t\t\t\t\t\r\n\t\t\t\t\t\r\n\t\t\t\t\t</as-split>\r\n\t\t\t\t\t\r\n\t\t\t</as-split-area>\r\n\t\t</as-split>\r\n\t</div>\r\n\r\n\t<div class='container__footer'>\r\n\t\tCopyright © 2018 Design Automation Lab, NUS. All Rights Reserved.\r\n\t</div>\r\n\t\r\n\t\r\n</div>\r\n-->"

/***/ }),

/***/ "./src/app/views/view-publish/view-publish.component.scss":
/*!****************************************************************!*\
  !*** ./src/app/views/view-publish/view-publish.component.scss ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".container {\n  position: relative;\n  overflow: auto;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around; }\n  .container h1, .container h2, .container h3, .container h4, .container h5, .container h6, .container p {\n    margin: 0px;\n    padding: 0px; }\n  .container .container__header {\n    flex: 0 1 auto;\n    min-height: 45px;\n    display: flex;\n    flex-direction: row;\n    justify-content: space-between;\n    padding: 0px 0px 0px 15px;\n    background-color: #3F4651;\n    color: #E7BF00;\n    line-height: 45px;\n    text-transform: uppercase;\n    font-size: 18px;\n    font-weight: 600;\n    text-align: center; }\n  .container .container__content {\n    flex-grow: 1;\n    height: 0px;\n    border: none;\n    overflow: auto; }\n  .container .container__content split {\n      height: 100%; }\n  .container .container__footer {\n    text-align: center;\n    font-size: 12px;\n    line-height: 18px;\n    background-color: #3F4651;\n    color: #E7BF00; }\n  .content__panel {\n  height: 100%;\n  overflow: auto;\n  padding: 10px 15px; }\n"

/***/ }),

/***/ "./src/app/views/view-publish/view-publish.component.ts":
/*!**************************************************************!*\
  !*** ./src/app/views/view-publish/view-publish.component.ts ***!
  \**************************************************************/
/*! exports provided: ViewPublishComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewPublishComponent", function() { return ViewPublishComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ViewPublishComponent = /** @class */ (function () {
    function ViewPublishComponent() {
    }
    ViewPublishComponent.prototype.selectNode = function (node_index) {
        if (typeof (node_index) == 'number') {
            this.flowchart.meta.selected_nodes = [node_index];
        }
    };
    ViewPublishComponent.prototype.getEndNode = function () {
        for (var _i = 0, _a = this.flowchart.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            if (node.type == 'end')
                return node;
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], ViewPublishComponent.prototype, "flowchart", void 0);
    ViewPublishComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'view-publish',
            template: __webpack_require__(/*! ./view-publish.component.html */ "./src/app/views/view-publish/view-publish.component.html"),
            styles: [__webpack_require__(/*! ./view-publish.component.scss */ "./src/app/views/view-publish/view-publish.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], ViewPublishComponent);
    return ViewPublishComponent;
}());



/***/ }),

/***/ "./src/app/views/view-publish/view-publish.module.ts":
/*!***********************************************************!*\
  !*** ./src/app/views/view-publish/view-publish.module.ts ***!
  \***********************************************************/
/*! exports provided: ViewPublishModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewPublishModule", function() { return ViewPublishModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @shared/shared.module */ "./src/app/shared/shared.module.ts");
/* harmony import */ var _view_publish_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./view-publish.component */ "./src/app/views/view-publish/view-publish.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ViewPublishModule = /** @class */ (function () {
    function ViewPublishModule() {
    }
    ViewPublishModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            declarations: [
                _view_publish_component__WEBPACK_IMPORTED_MODULE_3__["ViewPublishComponent"]
            ],
            exports: [
                _view_publish_component__WEBPACK_IMPORTED_MODULE_3__["ViewPublishComponent"]
            ],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__["SharedModule"],
            ],
            entryComponents: [],
            providers: []
        }),
        __metadata("design:paramtypes", [])
    ], ViewPublishModule);
    return ViewPublishModule;
}());



/***/ }),

/***/ "./src/assets/typedoc-json/doc.json":
/*!******************************************!*\
  !*** ./src/assets/typedoc-json/doc.json ***!
  \******************************************/
/*! exports provided: id, name, kind, flags, children, groups, default */
/***/ (function(module) {

module.exports = {"id":0,"name":"mobius-parametric-modeller","kind":0,"flags":{},"children":[{"id":23,"name":"\"_parameterTypes\"","kind":1,"kindString":"External module","flags":{"isExported":true},"originalName":"C:/Users/akibdpt/Documents/Angular/mobius-parametric-modeller/src/app/core/modules/_parameterTypes.ts","children":[{"id":24,"name":"_parameterTypes","kind":2097152,"kindString":"Object literal","flags":{"isExported":true,"isConst":true},"children":[{"id":25,"name":"constList","kind":32,"kindString":"Variable","flags":{"isExported":true},"sources":[{"fileName":"_parameterTypes.ts","line":2,"character":13}],"type":{"type":"intrinsic","name":"string"},"defaultValue":"\"__constList__\""},{"id":27,"name":"input","kind":32,"kindString":"Variable","flags":{"isExported":true},"sources":[{"fileName":"_parameterTypes.ts","line":4,"character":9}],"type":{"type":"intrinsic","name":"string"},"defaultValue":"\"__input__\""},{"id":29,"name":"merge","kind":32,"kindString":"Variable","flags":{"isExported":true},"sources":[{"fileName":"_parameterTypes.ts","line":6,"character":9}],"type":{"type":"intrinsic","name":"string"},"defaultValue":"\"__megre__\""},{"id":26,"name":"model","kind":32,"kindString":"Variable","flags":{"isExported":true},"sources":[{"fileName":"_parameterTypes.ts","line":3,"character":9}],"type":{"type":"intrinsic","name":"string"},"defaultValue":"\"__model__\""},{"id":28,"name":"new","kind":32,"kindString":"Variable","flags":{"isExported":true},"sources":[{"fileName":"_parameterTypes.ts","line":5,"character":7}],"type":{"type":"intrinsic","name":"string"},"defaultValue":"\"__new__\""}],"groups":[{"title":"Variables","kind":32,"children":[25,27,29,26,28]}],"sources":[{"fileName":"_parameterTypes.ts","line":1,"character":28}],"type":{"type":"intrinsic","name":"object"}}],"groups":[{"title":"Object literals","kind":2097152,"children":[24]}],"sources":[{"fileName":"_parameterTypes.ts","line":1,"character":0}]},{"id":1,"name":"\"functions\"","kind":1,"kindString":"External module","flags":{"isExported":true},"originalName":"C:/Users/akibdpt/Documents/Angular/mobius-parametric-modeller/src/app/core/modules/functions.ts","comment":{"shortText":"Functions for working with gs-json models.\nModels are datastructures that contain geometric entities with attributes."},"children":[{"id":4,"name":"__merge__","kind":64,"kindString":"Function","flags":{"isExported":true},"signatures":[{"id":5,"name":"__merge__","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Merges the second model into the first model. The geometry, attribues, and groups are all merged.\nIf the models contain contain groups with the same names, then the groups will be merged.","returns":"The merged model.\n"},"parameters":[{"id":6,"name":"model1","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"The model to merge into."},"type":{"type":"intrinsic","name":"any"}},{"id":7,"name":"model2","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"The model to merge."},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"any"}}],"sources":[{"fileName":"functions.ts","line":44,"character":25}]},{"id":2,"name":"__new__","kind":64,"kindString":"Function","flags":{"isExported":true},"signatures":[{"id":3,"name":"__new__","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Creates a new empty model.","returns":"New model empty.\n"},"type":{"type":"intrinsic","name":"any"}}],"sources":[{"fileName":"functions.ts","line":15,"character":23}]},{"id":8,"name":"addData","kind":64,"kindString":"Function","flags":{"isExported":true},"signatures":[{"id":9,"name":"addData","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Creates a new model and populates the model with data.","returns":"New model if successful, null if unsuccessful or on error.\n"},"parameters":[{"id":10,"name":"__model__","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":11,"name":"model_data","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"The model data in gs-json format."},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"any"}}],"sources":[{"fileName":"functions.ts","line":59,"character":23}]}],"groups":[{"title":"Functions","kind":64,"children":[4,2,8]}],"sources":[{"fileName":"functions.ts","line":1,"character":0}]},{"id":30,"name":"\"index\"","kind":1,"kindString":"External module","flags":{"isExported":true},"originalName":"C:/Users/akibdpt/Documents/Angular/mobius-parametric-modeller/src/app/core/modules/index.ts","sources":[{"fileName":"index.ts","line":1,"character":0}]},{"id":12,"name":"\"input\"","kind":1,"kindString":"External module","flags":{"isExported":true},"originalName":"C:/Users/akibdpt/Documents/Angular/mobius-parametric-modeller/src/app/core/modules/input.ts","children":[{"id":13,"name":"declare_constant","kind":64,"kindString":"Function","flags":{"isExported":true},"signatures":[{"id":14,"name":"declare_constant","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Declare a new constant for the input node","returns":"Void\n","tags":[{"tag":"summary","text":"Declare new constant\n"}]},"parameters":[{"id":15,"name":"__constList__","kind":32768,"kindString":"Parameter","flags":{},"comment":{"shortText":"List of constants to be added."},"type":{"type":"reference","name":"JSON"}},{"id":16,"name":"const_name","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"Name of the constant."},"type":{"type":"intrinsic","name":"string"}},{"id":17,"name":"__input__","kind":32768,"kindString":"Parameter","flags":{},"comment":{"shortText":"Value of the constant.\n"},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"void"}}],"sources":[{"fileName":"input.ts","line":11,"character":32}]}],"groups":[{"title":"Functions","kind":64,"children":[13]}],"sources":[{"fileName":"input.ts","line":1,"character":0}]},{"id":18,"name":"\"output\"","kind":1,"kindString":"External module","flags":{"isExported":true},"originalName":"C:/Users/akibdpt/Documents/Angular/mobius-parametric-modeller/src/app/core/modules/output.ts","children":[{"id":19,"name":"return_value","kind":64,"kindString":"Function","flags":{"isExported":true},"signatures":[{"id":20,"name":"return_value","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Return certain value from the model for the flowchart's end node","returns":"Value\n","tags":[{"tag":"summary","text":"Return a specific value"}]},"parameters":[{"id":21,"name":"__model__","kind":32768,"kindString":"Parameter","flags":{},"comment":{"shortText":"Model of the node."},"type":{"type":"array","elementType":{"type":"intrinsic","name":"any"}}},{"id":22,"name":"index","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"Index of the value to be returned."},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"intrinsic","name":"any"}}],"sources":[{"fileName":"output.ts","line":9,"character":28}]}],"groups":[{"title":"Functions","kind":64,"children":[19]}],"sources":[{"fileName":"output.ts","line":1,"character":0}]}],"groups":[{"title":"External modules","kind":1,"children":[23,1,30,12,18]}]};

/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false
};


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_appmodule_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/appmodule/app.module */ "./src/app/appmodule/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
window['CESIUM_BASE_URL'] = 'assets/cesium';
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_appmodule_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\akibdpt\Documents\Angular\mobius-parametric-modeller\src\main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map