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

/***/ "./src/app/appmodule/app-routing.module.ts":
/*!*************************************************!*\
  !*** ./src/app/appmodule/app-routing.module.ts ***!
  \*************************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _views__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @views */ "./src/app/views/index.ts");
/**/
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var appRoutes = [
    { path: 'flowchart', loadChildren: function () { return _views__WEBPACK_IMPORTED_MODULE_2__["ViewFlowchartModule"]; } },
    { path: 'gallery', loadChildren: function () { return _views__WEBPACK_IMPORTED_MODULE_2__["ViewGalleryModule"]; } },
    { path: 'dashboard', loadChildren: function () { return _views__WEBPACK_IMPORTED_MODULE_2__["ViewDashboardModule"]; } },
    { path: 'editor', loadChildren: function () { return _views__WEBPACK_IMPORTED_MODULE_2__["ViewEditorModule"]; } },
    { path: '', redirectTo: '/gallery', pathMatch: 'full' },
    { path: '**', component: _views__WEBPACK_IMPORTED_MODULE_2__["ViewGalleryModule"] }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(appRoutes, { enableTracing: false } // <-- debugging purposes only
                )
            ],
            exports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]
            ]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());



/***/ }),

/***/ "./src/app/appmodule/app.component.html":
/*!**********************************************!*\
  !*** ./src/app/appmodule/app.component.html ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<router-outlet></router-outlet>"

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
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @services */ "./src/app/core/services/index.ts");
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
    function AppComponent(dataService, injector) {
        this.dataService = dataService;
        this.injector = injector;
    }
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/appmodule/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.scss */ "./src/app/appmodule/app.component.scss")]
        }),
        __metadata("design:paramtypes", [_services__WEBPACK_IMPORTED_MODULE_1__["DataService"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"]])
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
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @services */ "./src/app/core/services/index.ts");
/* harmony import */ var _model_viewers_all_viewers_gi_viewer_data_data_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../model-viewers/all-viewers/gi-viewer/data/data.service */ "./src/app/model-viewers/all-viewers/gi-viewer/data/data.service.ts");
/* harmony import */ var _core_core_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../core/core.module */ "./src/app/core/core.module.ts");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @shared/shared.module */ "./src/app/shared/shared.module.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./app.component */ "./src/app/appmodule/app.component.ts");
/* harmony import */ var _views__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @views */ "./src/app/views/index.ts");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/appmodule/app-routing.module.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// import @angular stuff





// import app services


// import app modules


// import { AppRoutingModule } from './app-routing.module';
// import app components



/**
 * AppModule, the root module for the whole app.
 */
var AppModule = /** @class */ (function () {
    /**
     * constructor
     */
    function AppModule() {
        // Do nothing
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_9__["AppComponent"],
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_2__["BrowserAnimationsModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClientModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                _app_routing_module__WEBPACK_IMPORTED_MODULE_11__["AppRoutingModule"],
                _core_core_module__WEBPACK_IMPORTED_MODULE_7__["CoreModule"],
                _views__WEBPACK_IMPORTED_MODULE_10__["ViewGalleryModule"],
                _views__WEBPACK_IMPORTED_MODULE_10__["ViewEditorModule"],
                _views__WEBPACK_IMPORTED_MODULE_10__["ViewDashboardModule"],
                _views__WEBPACK_IMPORTED_MODULE_10__["ViewFlowchartModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_8__["SharedModule"],
            ],
            entryComponents: [
                _views__WEBPACK_IMPORTED_MODULE_10__["ViewEditorComponent"],
                _views__WEBPACK_IMPORTED_MODULE_10__["ViewDashboardComponent"],
                _views__WEBPACK_IMPORTED_MODULE_10__["ViewFlowchartComponent"],
                _views__WEBPACK_IMPORTED_MODULE_10__["ViewGalleryComponent"],
            ],
            providers: [_services__WEBPACK_IMPORTED_MODULE_5__["DataService"], _model_viewers_all_viewers_gi_viewer_data_data_service__WEBPACK_IMPORTED_MODULE_6__["DataService"]],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_9__["AppComponent"]]
        }),
        __metadata("design:paramtypes", [])
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/core/core.module.ts":
/*!*************************************!*\
  !*** ./src/app/core/core.module.ts ***!
  \*************************************/
/*! exports provided: CoreModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CoreModule", function() { return CoreModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @services */ "./src/app/core/services/index.ts");
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
/*
 *  This module is to be imported ONLY by the AppModule
 *  Contains all global services
 *
 */


var CoreModule = /** @class */ (function () {
    function CoreModule(core) {
        /// Prevents any module apart from AppModule from re-importing
        if (core) {
            throw new Error('Core Module has already been imported');
        }
    }
    CoreModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [],
            declarations: [],
            providers: [_services__WEBPACK_IMPORTED_MODULE_1__["DataService"], _services__WEBPACK_IMPORTED_MODULE_1__["ViewerService"]],
            exports: [],
            entryComponents: []
        }),
        __param(0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Optional"])()), __param(0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["SkipSelf"])()),
        __metadata("design:paramtypes", [CoreModule])
    ], CoreModule);
    return CoreModule;
}());



/***/ }),

/***/ "./src/app/core/modules/Model.ts":
/*!***************************************!*\
  !*** ./src/app/core/modules/Model.ts ***!
  \***************************************/
/*! exports provided: __new__, __preprocess__, __postprocess__, __merge__, __stringify__, addData, numPoints, numLinestrings, numPolygons, addPosition, addPoint, addLinestring, addPolygon, getPositions, getPoints, getLines, getPolygons, getCollections */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__new__", function() { return __new__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__preprocess__", function() { return __preprocess__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__postprocess__", function() { return __postprocess__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__merge__", function() { return __merge__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__stringify__", function() { return __stringify__; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addData", function() { return addData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "numPoints", function() { return numPoints; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "numLinestrings", function() { return numLinestrings; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "numPolygons", function() { return numPolygons; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addPosition", function() { return addPosition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addPoint", function() { return addPoint; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addLinestring", function() { return addLinestring; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addPolygon", function() { return addPolygon; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPositions", function() { return getPositions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPoints", function() { return getPoints; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLines", function() { return getLines; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPolygons", function() { return getPolygons; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCollections", function() { return getCollections; });
/* harmony import */ var _libs_geo_info_GIModel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../libs/geo-info/GIModel */ "./src/libs/geo-info/GIModel.ts");
/* harmony import */ var _libs_geo_info_GIJson__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../libs/geo-info/GIJson */ "./src/libs/geo-info/GIJson.ts");


//  ===============================================================================================================
//  Functions used by Mobius
//  ===============================================================================================================
/**
 * Creates a new empty model.
 *
 * @returns New model empty.
 */
function __new__() {
    var model = new _libs_geo_info_GIModel__WEBPACK_IMPORTED_MODULE_0__["GIModel"]();
    model.attribs().addPosiAttrib('coordinates', _libs_geo_info_GIJson__WEBPACK_IMPORTED_MODULE_1__["EAttribDataTypeStrs"].FLOAT, 3);
    return model;
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
    // Remove all undefined values for the arrays
}
/**
 * Merges the second model into the first model. The geometry, attribues, and groups are all merged.
 * If the models contain contain groups with the same names, then the groups will be merged.
 *
 * @param model1 The model to merge into.
 * @param model2 The model to merge from    .
 */
function __merge__(model1, model2) {
    model1.merge(model2);
}
/**
 * Returns a string representation of this model.
 * @param __model__
 */
function __stringify__(__model__) {
    return JSON.stringify(__model__.getData());
}
//  ===============================================================================================================
//  Functions visible in the Mobius interface.
//  ===============================================================================================================
/**
 * Add new data to the model.
 *
 * @param model_data The model data in gs-json format.
 * @returns New model if successful, null if unsuccessful or on error.
 */
function addData(__model__, model_data) {
    var model = new _libs_geo_info_GIModel__WEBPACK_IMPORTED_MODULE_0__["GIModel"](model_data);
    __merge__(__model__, model);
}
/**
 *  Gets the number of points in the model.
 * @param __model__
 */
function numPoints(__model__) {
    return __model__.geom().numPoints();
}
/**
 *  Gets the number of linestrings in the model.
 * @param __model__
 */
function numLinestrings(__model__) {
    return __model__.geom().numLines();
}
/**
 *  Gets the number of polygons in the model.
 * @param __model__
 */
function numPolygons(__model__) {
    return __model__.geom().numPgons();
}
/**
 * Adds a new position to the model.
 * @param __model__
 * @param coords
 */
function addPosition(__model__, coords) {
    var posi_id = __model__.geom().addPosition();
    __model__.attribs().setAttribValue(posi_id, 'coordinates', coords);
    return posi_id;
}
/**
 * Adds a new point to the model.
 * @param __model__
 * @param coords
 */
function addPoint(__model__, position) {
    return __model__.geom().addPoint(position);
}
/**
 * Adds a new linestring to the model.
 * @param __model__
 * @param coords
 */
function addLinestring(__model__, positions) {
    return __model__.geom().addLine(positions);
}
/**
 * Adds a new polygon to the model.
 * @param __model__
 * @param coords
 */
function addPolygon(__model__, positions) {
    return __model__.geom().addPgon(positions);
}
/**
 * Gets all the positions in the model.
 * @param __model__
 */
function getPositions(__model__) {
    return __model__.geom().getPosis();
}
/**
 * Gets all the points in the model.
 * @param __model__
 */
function getPoints(__model__) {
    return __model__.geom().getPoints();
}
/**
 * Gets all the lines in the model.
 * @param __model__
 */
function getLines(__model__) {
    return __model__.geom().getLines();
}
/**
 * Gets all the points in the model.
 * @param __model__
 */
function getPolygons(__model__) {
    return __model__.geom().getPgons();
}
/**
 * Gets all the collections in the model.
 * @param __model__
 */
function getCollections(__model__) {
    return __model__.geom().getColls();
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
/* harmony import */ var _Model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Model */ "./src/app/core/modules/Model.ts");

var _parameterTypes = {
    constList: '__constList__',
    model: '__model__',
    input: '__input__',
    new: 'Model.__new__',
    newFn: _Model__WEBPACK_IMPORTED_MODULE_0__["__new__"],
    merge: 'Model.__merge__',
    mergeFn: _Model__WEBPACK_IMPORTED_MODULE_0__["__merge__"],
    preprocess: 'Model.__preprocess__',
    postprocess: 'Model.__postprocess__' // TODO - make this genric
};


/***/ }),

/***/ "./src/app/core/modules/index.ts":
/*!***************************************!*\
  !*** ./src/app/core/modules/index.ts ***!
  \***************************************/
/*! exports provided: Model, Input, Output, _parameterTypes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Model */ "./src/app/core/modules/Model.ts");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "Model", function() { return _Model__WEBPACK_IMPORTED_MODULE_0__; });
/* harmony import */ var _input__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./input */ "./src/app/core/modules/input.ts");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "Input", function() { return _input__WEBPACK_IMPORTED_MODULE_1__; });
/* harmony import */ var _output__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./output */ "./src/app/core/modules/output.ts");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "Output", function() { return _output__WEBPACK_IMPORTED_MODULE_2__; });
/* harmony import */ var _parameterTypes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_parameterTypes */ "./src/app/core/modules/_parameterTypes.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "_parameterTypes", function() { return _parameterTypes__WEBPACK_IMPORTED_MODULE_3__["_parameterTypes"]; });










/***/ }),

/***/ "./src/app/core/modules/input.ts":
/*!***************************************!*\
  !*** ./src/app/core/modules/input.ts ***!
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

/***/ "./src/app/core/modules/output.ts":
/*!****************************************!*\
  !*** ./src/app/core/modules/output.ts ***!
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
    if (index > __model__.length) {
        return __model__;
    }
    return __model__[index].value;
}


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
    Object.defineProperty(DataService.prototype, "flowchartPos", {
        get: function () { return DataService_1._flowchartPosition; },
        set: function (transf) { DataService_1._flowchartPosition = transf; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataService.prototype, "newFlowchart", {
        get: function () { return DataService_1._newFlowchart; },
        set: function (check) { DataService_1._newFlowchart = check; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataService.prototype, "activeView", {
        get: function () { return DataService_1._activeModelView; },
        set: function (view) { DataService_1._activeModelView = view; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataService.prototype, "splitVal", {
        get: function () { return DataService_1._splitVal; },
        set: function (num) { DataService_1._splitVal = num; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataService.prototype, "flowchart", {
        get: function () { return DataService_1._data.flowchart; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataService.prototype, "node", {
        get: function () { return DataService_1._data.flowchart.nodes[DataService_1._data.flowchart.meta.selected_nodes[0]]; },
        enumerable: true,
        configurable: true
    });
    var DataService_1;
    DataService._data = {
        name: 'default_file',
        author: 'new_user',
        last_updated: new Date(),
        version: 1,
        flowchart: _models_flowchart__WEBPACK_IMPORTED_MODULE_1__["FlowchartUtils"].newflowchart()
    };
    DataService._flowchartPosition = undefined;
    DataService._newFlowchart = true;
    DataService._activeModelView = undefined;
    DataService._splitVal = 55;
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

/***/ "./src/app/model-viewers/all-viewers/console-viewer/viewer.component.ts":
/*!******************************************************************************!*\
  !*** ./src/app/model-viewers/all-viewers/console-viewer/viewer.component.ts ***!
  \******************************************************************************/
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

/**
 * ConsoleViewerComponent
 */
var ConsoleViewerComponent = /** @class */ (function () {
    /**
     * constructor
     */
    function ConsoleViewerComponent() {
        // console.log(`Console Viewer Created`);
    }
    /**
     * ngOnInit
     */
    ConsoleViewerComponent.prototype.ngOnInit = function () {
        // @ts-ignore
        this.text = console.logs.join('\n');
    };
    /**
     * ngOnInit
     */
    ConsoleViewerComponent.prototype.ngAfterViewInit = function () {
        var ct = document.getElementById('console_textarea');
        ct.scrollTo(0, ct.scrollHeight);
    };
    /**
     * ngDoCheck
     */
    ConsoleViewerComponent.prototype.ngDoCheck = function () {
        // @ts-ignore
        var t = console.logs.join('\n');
        if (this.text !== t) {
            this.text = t;
            this.scrollcheck = true;
        }
    };
    ConsoleViewerComponent.prototype.ngAfterViewChecked = function () {
        if (this.scrollcheck) {
            var ct = document.getElementById('console_textarea');
            ct.scrollTo(0, ct.scrollHeight);
            this.scrollcheck = false;
        }
    };
    ConsoleViewerComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'console-viewer',
            template: "<textarea id='console_textarea'>{{ text || \"\" }}</textarea>",
            styles: [__webpack_require__(/*! ../general-viewer.scss */ "./src/app/model-viewers/all-viewers/general-viewer.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], ConsoleViewerComponent);
    return ConsoleViewerComponent;
}());



/***/ }),

/***/ "./src/app/model-viewers/all-viewers/general-viewer.scss":
/*!***************************************************************!*\
  !*** ./src/app/model-viewers/all-viewers/general-viewer.scss ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host {\n  height: 100%;\n  width: 100%; }\n\ntextarea {\n  height: 93%;\n  width: 99%;\n  overflow: auto;\n  resize: none;\n  font-family: sans-serif;\n  background-color: gainsboro;\n  color: #505050;\n  border: none; }\n\ndiv {\n  font-family: sans-serif;\n  color: #505050;\n  width: 100%;\n  padding-left: 10px; }\n\nh5 {\n  font-weight: 700;\n  font-size: 12px; }\n\n.funcDesc {\n  font-weight: 600; }\n\n.paramP {\n  padding-left: 5px; }\n\nspan {\n  font-weight: 550;\n  font-style: italic; }\n"

/***/ }),

/***/ "./src/app/model-viewers/all-viewers/gi-viewer/data/data.service.ts":
/*!**************************************************************************!*\
  !*** ./src/app/model-viewers/all-viewers/gi-viewer/data/data.service.ts ***!
  \**************************************************************************/
/*! exports provided: DataService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataService", function() { return DataService; });
/* harmony import */ var rxjs_Subject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs/Subject */ "./node_modules/rxjs-compat/_esm5/Subject.js");
/* harmony import */ var _data_threejs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./data.threejs */ "./src/app/model-viewers/all-viewers/gi-viewer/data/data.threejs.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


// import @angular stuff

/**
 * DataService
 * The data service for the Goe-Info viewer.
 */
var DataService = /** @class */ (function () {
    /**
     * Create a data service.
     */
    function DataService() {
        this.selecting = [];
        // Subscription Handling
        this.subject = new rxjs_Subject__WEBPACK_IMPORTED_MODULE_0__["Subject"]();
        // Do nothing
        console.log('CALLING constructor in DATA SERVICE');
    }
    /**
     * Msg
     * @param message
     */
    DataService.prototype.sendMessage = function (message) {
        this.subject.next({ text: message });
    };
    /**
     * Msg
     */
    DataService.prototype.clearMessage = function () {
        this.subject.next();
    };
    /**
     * Msg
     */
    DataService.prototype.getMessage = function () {
        return this.subject.asObservable();
    };
    /**
     * Get the GI Model
     */
    DataService.prototype.getGIModel = function () {
        // console.log('CALLING getModel in DATA SERVICE');
        return this._model;
    };
    /**
     * Get the THreejs Scene
     */
    DataService.prototype.getThreejsScene = function () {
        // console.log('CALLING getThreejs Scene in DATA SERVICE');
        return this._data_threejs;
    };
    DataService.prototype.newThreejsScene = function (model) {
        // this._threejs_scene = new ThreejsScene(model);
    };
    /**
     * Set the GI Model
     * @param model
     */
    DataService.prototype.setModel = function (model) {
        console.log('CALLING setModel in DATA SERVICE');
        this._model = model;
        this._data_threejs = new _data_threejs__WEBPACK_IMPORTED_MODULE_1__["DataThreejs"](model);
        this.sendMessage('model_update');
    };
    DataService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Injectable"])(),
        __metadata("design:paramtypes", [])
    ], DataService);
    return DataService;
}());



/***/ }),

/***/ "./src/app/model-viewers/all-viewers/gi-viewer/data/data.subscriber.ts":
/*!*****************************************************************************!*\
  !*** ./src/app/model-viewers/all-viewers/gi-viewer/data/data.subscriber.ts ***!
  \*****************************************************************************/
/*! exports provided: DataSubscriber */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataSubscriber", function() { return DataSubscriber; });
/* harmony import */ var _data_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data.service */ "./src/app/model-viewers/all-viewers/gi-viewer/data/data.service.ts");

/**
 * DataSubscriber
 */
var DataSubscriber = /** @class */ (function () {
    /**
     * Constructs a new data subscriber.
     * @param injector
     */
    function DataSubscriber(injector) {
        var _this = this;
        this.dataService = injector.get(_data_service__WEBPACK_IMPORTED_MODULE_0__["DataService"]);
        this.dataService.getMessage().subscribe(function (message) {
            _this._message = message;
            // this.notify(message.text);
        });
    }
    return DataSubscriber;
}());



/***/ }),

/***/ "./src/app/model-viewers/all-viewers/gi-viewer/data/data.threejs.ts":
/*!**************************************************************************!*\
  !*** ./src/app/model-viewers/all-viewers/gi-viewer/data/data.threejs.ts ***!
  \**************************************************************************/
/*! exports provided: DataThreejs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataThreejs", function() { return DataThreejs; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_orbit_controls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three-orbit-controls */ "./node_modules/three-orbit-controls/index.js");
/* harmony import */ var three_orbit_controls__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(three_orbit_controls__WEBPACK_IMPORTED_MODULE_1__);


/**
 * ThreejsScene
 */
var DataThreejs = /** @class */ (function () {
    /**
     * Constructs a new data subscriber.
     */
    function DataThreejs(model) {
        // interaction and selection
        this._select_visible = 'Objs';
        // number of threejs points, lines, triangles
        this._threejs_nums = [0, 0, 0];
        // grid
        this._grid_show = true;
        this._grid_center = [0, 0, 0];
        console.log("Calling constructor in DataThreejs");
        //
        this._model = model;
        // scene
        this._scene = new three__WEBPACK_IMPORTED_MODULE_0__["Scene"]();
        this._scene.background = new three__WEBPACK_IMPORTED_MODULE_0__["Color"](0xcccccc);
        // renderer
        this._renderer = new three__WEBPACK_IMPORTED_MODULE_0__["WebGLRenderer"]({ antialias: true });
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.setSize(window.innerWidth / 2, 1000);
        // camera settings
        this._camera = new three__WEBPACK_IMPORTED_MODULE_0__["PerspectiveCamera"](50, 1, 0.01, 20000);
        this._camera.position.x = 150;
        this._camera.position.y = 100;
        this._camera.position.z = 70;
        this._camera.aspect = 1;
        this._camera.up.set(0, 0, 1);
        this._camera.lookAt(this._scene.position);
        this._camera.updateProjectionMatrix();
        // orbit controls
        var orbit_controls = three_orbit_controls__WEBPACK_IMPORTED_MODULE_1__(three__WEBPACK_IMPORTED_MODULE_0__);
        this._controls = new orbit_controls(this._camera, this._renderer.domElement);
        this._controls.enableKeys = false;
        this._controls.update();
        // mouse
        this._mouse = new three__WEBPACK_IMPORTED_MODULE_0__["Vector2"]();
        // selecting
        this._raycaster = new three__WEBPACK_IMPORTED_MODULE_0__["Raycaster"]();
        this._raycaster.linePrecision = 0.05;
        // add grid and lights to the scene
        this._addGrid();
        this._addHemisphereLight();
        // add geometry to the scene
        if (model) {
            // add geometry
            var threejs_data = model.get3jsData();
            // Create buffers that will be used by all geometry
            var posis_buffer = new three__WEBPACK_IMPORTED_MODULE_0__["Float32BufferAttribute"](threejs_data.positions, 3);
            var normals_buffer = new three__WEBPACK_IMPORTED_MODULE_0__["Float32BufferAttribute"](threejs_data.normals, 3);
            var colors_buffer = new three__WEBPACK_IMPORTED_MODULE_0__["Float32BufferAttribute"](threejs_data.colors, 3);
            // Add geometry
            this._addTris(threejs_data.triangle_indices, posis_buffer, normals_buffer, colors_buffer);
            this._addLines(threejs_data.edge_indices, posis_buffer, normals_buffer);
            this._addPoints(threejs_data.point_indices, posis_buffer, colors_buffer);
        }
    }
    // ============================================================================
    // Private methods
    // ============================================================================
    /**
     * Creates a hemisphere light
     */
    DataThreejs.prototype._addHemisphereLight = function () {
        var light = new three__WEBPACK_IMPORTED_MODULE_0__["HemisphereLight"](0xffffbb, // skyColor
        0x080820, // groundColor
        1 // intensity
        );
        this._scene.add(light);
    };
    /**
     * Creates an ambient light
     */
    DataThreejs.prototype._addAmbientLight = function (color, intensity) {
        var light = new three__WEBPACK_IMPORTED_MODULE_0__["AmbientLight"](color, intensity); // soft white light
        this._scene.add(light);
    };
    // Creates a Directional Light
    DataThreejs.prototype._addDirectionalLight = function () {
        var light = new three__WEBPACK_IMPORTED_MODULE_0__["DirectionalLight"](0xffffff, 0.5);
        light.position.set(0, 0, 1).normalize();
        this._scene.add(light);
    };
    /**
     * Draws a grid on the XY plane.
     */
    DataThreejs.prototype._addGrid = function () {
        for (var i = 0; i < this._scene.children.length; i++) {
            if (this._scene.children[i].name === 'GridHelper') {
                this._scene.remove(this._scene.children[i]);
                i = i - 1;
            }
        }
        // todo: change grid -> grid_value
        if (this._grid_show) {
            var gridhelper = new three__WEBPACK_IMPORTED_MODULE_0__["GridHelper"](500, 50);
            gridhelper.name = 'GridHelper';
            var vector = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](0, 1, 0);
            gridhelper.lookAt(vector);
            gridhelper.position.set(0, 0, 0);
            this._scene.add(gridhelper);
            this._grid_center = [0, 0, 0];
        }
    };
    /**
     * Add threejs triangles to the scene
     */
    DataThreejs.prototype._addTris = function (tris_i, posis_buffer, normals_buffer, colors_buffer) {
        var geom = new three__WEBPACK_IMPORTED_MODULE_0__["BufferGeometry"]();
        geom.setIndex(tris_i);
        geom.addAttribute('position', posis_buffer);
        geom.addAttribute('normal', normals_buffer);
        geom.addAttribute('color', colors_buffer);
        var mat = new three__WEBPACK_IMPORTED_MODULE_0__["MeshPhongMaterial"]({
            // specular:  new THREE.Color('rgb(255, 0, 0)'), // 0xffffff,
            specular: 0xffffff,
            emissive: 0xdddddd,
            shininess: 0,
            side: three__WEBPACK_IMPORTED_MODULE_0__["DoubleSide"],
            vertexColors: three__WEBPACK_IMPORTED_MODULE_0__["VertexColors"],
        });
        var mesh = new three__WEBPACK_IMPORTED_MODULE_0__["Mesh"](geom, mat);
        mesh.geometry.computeBoundingSphere();
        mesh.geometry.computeVertexNormals();
        // show vertex normals
        var vnh = new three__WEBPACK_IMPORTED_MODULE_0__["VertexNormalsHelper"](mesh, 3, 0x0000ff);
        this._scene.add(vnh);
        // this._geometries.push(geom);
        // this._meshes.push(mesh);
        // add mesh to scene
        this._scene.add(mesh);
        this._threejs_nums[2] = tris_i.length / 3;
    };
    /**
     * Add threejs lines to the scene
     */
    DataThreejs.prototype._addLines = function (lines_i, posis_buffer, normals_buffer) {
        var geom = new three__WEBPACK_IMPORTED_MODULE_0__["BufferGeometry"]();
        geom.setIndex(lines_i);
        geom.addAttribute('position', posis_buffer);
        geom.addAttribute('normal', normals_buffer);
        // geom.addAttribute( 'color', new THREE.Float32BufferAttribute( colors_flat, 3 ) );
        var mat = new three__WEBPACK_IMPORTED_MODULE_0__["LineBasicMaterial"]({
            color: 0x777777,
            linewidth: 0.1,
            linecap: 'round',
            linejoin: 'round' // ignored by WebGLRenderer
        });
        // this._geometries.push(geom);
        this._scene.add(new three__WEBPACK_IMPORTED_MODULE_0__["LineSegments"](geom, mat));
        this._threejs_nums[1] = lines_i.length / 2;
    };
    /**
     * Add threejs points to the scene
     */
    DataThreejs.prototype._addPoints = function (points_i, posis_buffer, colors_buffer) {
        var geom = new three__WEBPACK_IMPORTED_MODULE_0__["BufferGeometry"]();
        geom.setIndex(points_i);
        geom.addAttribute('position', posis_buffer);
        geom.addAttribute('color', colors_buffer);
        // geom.computeBoundingSphere();
        var mat = new three__WEBPACK_IMPORTED_MODULE_0__["PointsMaterial"]({
            size: 0.1,
            vertexColors: three__WEBPACK_IMPORTED_MODULE_0__["VertexColors"]
        });
        // this._geometries.push(geom);
        this._scene.add(new three__WEBPACK_IMPORTED_MODULE_0__["Points"](geom, mat));
        this._threejs_nums[0] = points_i.length;
    };
    return DataThreejs;
}());



/***/ }),

/***/ "./src/app/model-viewers/all-viewers/gi-viewer/gi-viewer.component.html":
/*!******************************************************************************!*\
  !*** ./src/app/model-viewers/all-viewers/gi-viewer/gi-viewer.component.html ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"gi-viewer-container\" (mousedown)=\"leaflet()\">\r\n    <threejs-viewer></threejs-viewer>\r\n</div>\r\n\r\n<!-- <div id=\"appdiv\" (mousedown)=\"leaflet()\"> -->\r\n\t<!-- <as-split direction=\"vertical\"> -->\r\n\t\t<!-- <as-split-area [size]=\"90\" id=\"splitcontainer\"> -->\r\n\t\t  <!-- <div style=\"height: 100%\"> -->\r\n\t\t    <!-- <as-split direction=\"horizontal\"> -->\r\n\t\t\t\t\t<!-- <as-split-area [size]=\"0.5\" id=\"splitgroups\" style=\"overflow-x:hidden;overflow-y: auto;\"> -->\r\n\t\t\t\t\t\t<!-- group -->\r\n\t\t      <!-- </as-split-area> -->\r\n\t\t      <!-- <as-split-area [size]=\"99.5\" id=\"splitviewer\"> -->\r\n\t\t        <!-- <viewer-container *ngIf=\"imVisible===false\"></viewer-container>\r\n\t\t        <app-map *ngIf=\"imVisible===true\"></app-map> -->\r\n\t\t        <!-- <threejs-viewer></threejs-viewer> -->\r\n\t\t      <!-- </as-split-area> -->\r\n\t\t    <!-- </as-split> -->\r\n\t\t  <!-- </div> -->\r\n\t\t<!-- </as-split-area> -->\r\n\t\t<!-- <as-split-area [size]=\"10\" id=\"splittoolwindow\"> -->\r\n\t\t\t<!-- tool window -->\r\n\t\t<!-- </as-split-area> -->\r\n\t<!-- </as-split> -->\r\n<!-- </div> -->"

/***/ }),

/***/ "./src/app/model-viewers/all-viewers/gi-viewer/gi-viewer.component.scss":
/*!******************************************************************************!*\
  !*** ./src/app/model-viewers/all-viewers/gi-viewer/gi-viewer.component.scss ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#gi-viewer-container {\n  width: 100%;\n  height: 100%;\n  background-color: yellow;\n  overflow: hidden; }\n"

/***/ }),

/***/ "./src/app/model-viewers/all-viewers/gi-viewer/gi-viewer.component.ts":
/*!****************************************************************************!*\
  !*** ./src/app/model-viewers/all-viewers/gi-viewer/gi-viewer.component.ts ***!
  \****************************************************************************/
/*! exports provided: GIViewerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GIViewerComponent", function() { return GIViewerComponent; });
/* harmony import */ var _libs_geo_info_GIModel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @libs/geo-info/GIModel */ "./src/libs/geo-info/GIModel.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _data_data_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./data/data.service */ "./src/app/model-viewers/all-viewers/gi-viewer/data/data.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

// import @angular stuff

// import app services

// import others
/**
 * GIViewerComponent
 * This component is used in /app/model-viewers/model-viewers-container.component.html
 */
var GIViewerComponent = /** @class */ (function () {
    /**
     * constructor
     * @param dataService
     */
    function GIViewerComponent(dataService) {
        this.dataService = dataService;
        this.imVisible = false; // TODO what is this?
        // Do nothing
    }
    /**
     * setModel Sets the model in the data service.
     * @param data
     */
    GIViewerComponent.prototype.setModel = function (data) {
        try {
            this.dataService.setModel(data);
        }
        catch (ex) {
            this.modelData = undefined;
            console.error('Error generating model', ex);
        }
    };
    /**
     * ngOnInit
     */
    GIViewerComponent.prototype.ngOnInit = function () {
        this.modelData = this.data;
        this.setModel(this.modelData);
        // this.dataService.newThreejsScene(this.modelData);
    };
    /**
     * ngDoCheck TODO: change to ngOnChange and ngOnDestroy
     */
    GIViewerComponent.prototype.ngDoCheck = function () {
        if (this.modelData !== this.data) {
            this.modelData = this.data;
            this.setModel(this.modelData);
        }
    };
    /**
     * ??? what does this do?
     */
    GIViewerComponent.prototype.leaflet = function () {
        this.imVisible = this.dataService.imVisible;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        __metadata("design:type", _libs_geo_info_GIModel__WEBPACK_IMPORTED_MODULE_0__["GIModel"])
    ], GIViewerComponent.prototype, "data", void 0);
    GIViewerComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'gi-viewer',
            template: __webpack_require__(/*! ./gi-viewer.component.html */ "./src/app/model-viewers/all-viewers/gi-viewer/gi-viewer.component.html"),
            styles: [__webpack_require__(/*! ./gi-viewer.component.scss */ "./src/app/model-viewers/all-viewers/gi-viewer/gi-viewer.component.scss")]
        }),
        __metadata("design:paramtypes", [_data_data_service__WEBPACK_IMPORTED_MODULE_2__["DataService"]])
    ], GIViewerComponent);
    return GIViewerComponent;
}());



/***/ }),

/***/ "./src/app/model-viewers/all-viewers/gi-viewer/gi-viewer.module.ts":
/*!*************************************************************************!*\
  !*** ./src/app/model-viewers/all-viewers/gi-viewer/gi-viewer.module.ts ***!
  \*************************************************************************/
/*! exports provided: GIViewer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GIViewer", function() { return GIViewer; });
/* harmony import */ var angular_split__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angular-split */ "./node_modules/angular-split/fesm5/angular-split.js");
/* harmony import */ var ngx_pagination__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ngx-pagination */ "./node_modules/ngx-pagination/dist/ngx-pagination.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material_slider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/slider */ "./node_modules/@angular/material/esm5/slider.es5.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/tabs */ "./node_modules/@angular/material/esm5/tabs.es5.js");
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/tooltip */ "./node_modules/@angular/material/esm5/tooltip.es5.js");
/* harmony import */ var _angular_material_sort__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/sort */ "./node_modules/@angular/material/esm5/sort.es5.js");
/* harmony import */ var _angular_material_expansion__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/expansion */ "./node_modules/@angular/material/esm5/expansion.es5.js");
/* harmony import */ var _gi_viewer_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./gi-viewer.component */ "./src/app/model-viewers/all-viewers/gi-viewer/gi-viewer.component.ts");
/* harmony import */ var _threejs_threejs_viewer_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./threejs/threejs-viewer.component */ "./src/app/model-viewers/all-viewers/gi-viewer/threejs/threejs-viewer.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


// import @angular stuff







// import app components


/**
 * GIViewer
 * A viewer for Geo-Info models.
 */
var GIViewer = /** @class */ (function () {
    function GIViewer() {
    }
    GIViewer_1 = GIViewer;
    GIViewer.forRoot = function () {
        return {
            ngModule: GIViewer_1
        };
    };
    var GIViewer_1;
    GIViewer = GIViewer_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            declarations: [
                _gi_viewer_component__WEBPACK_IMPORTED_MODULE_9__["GIViewerComponent"],
                _threejs_threejs_viewer_component__WEBPACK_IMPORTED_MODULE_10__["ThreejsViewerComponent"],
            ],
            exports: [
                _gi_viewer_component__WEBPACK_IMPORTED_MODULE_9__["GIViewerComponent"],
            ],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_4__["CommonModule"],
                angular_split__WEBPACK_IMPORTED_MODULE_0__["AngularSplitModule"],
                _angular_material_slider__WEBPACK_IMPORTED_MODULE_3__["MatSliderModule"],
                ngx_pagination__WEBPACK_IMPORTED_MODULE_1__["NgxPaginationModule"],
                _angular_material_expansion__WEBPACK_IMPORTED_MODULE_8__["MatExpansionModule"],
                _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__["MatTabsModule"],
                _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_6__["MatTooltipModule"],
                _angular_material_sort__WEBPACK_IMPORTED_MODULE_7__["MatSortModule"],
            ]
        })
    ], GIViewer);
    return GIViewer;
}());



/***/ }),

/***/ "./src/app/model-viewers/all-viewers/gi-viewer/threejs/threejs-viewer.component.html":
/*!*******************************************************************************************!*\
  !*** ./src/app/model-viewers/all-viewers/gi-viewer/threejs/threejs-viewer.component.html ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"threejs-container\" (click)=\"render(this)\" >\r\n    <div *ngIf=\"_model_error\" style=\"position:absolute;color:red;margin-top: 50px;left:40%;width: auto;text-align: center;font-family:sans-serif;font-size: 14px;background-color: white;\">Error displaying model:{{text}}</div>\r\n    <div *ngIf=\"_no_model\" style=\"position:absolute;color:red;margin-top: 50px;left:40%;width: auto;text-align: center;font-family:sans-serif;font-size: 14px;background-color: white;\">Model or Scene not defined.</div>\r\n\r\n    <button id=\"zoomingfit\"  \r\n        [class.visible]=\"Visible === 'zoomfit'\" \r\n        (click)=\"zoomfit()\">\r\n        <span matTooltip=\"zoom to fit\"><i class=\"fa fa-arrows-alt\"></i></span>\r\n    </button> \r\n    \r\n    <!-- <button id=\"selecting\" [class.visible]=\"Visible === 'select'\" (click)= \"select($event, Visible)\" ><i class=\"fa fa-mouse-pointer\"></i></button> -->\r\n    <!-- <button id=\"setting\" [class.selected]=\"settingVisible\" (click)= \"setting(settingVisible)\"><i class=\"fa fa-cog\"></i></button> -->\r\n\r\n    <button id=\"selecting\" [class.selected]=\"seVisible\" (click)= \"select(seVisible)\" ><span matTooltip=\"select\"><i class=\"fa fa-mouse-pointer\"></i></span></button>\r\n    <div id=\"shownumber\">\r\n        <tr>\r\n            <td  align=left style=\"width: 60px;\">Triangles&nbsp;&nbsp;</td>\r\n            <td  align=left style=\"width: 10px;\">{{_threejs_nums[2]}}</td>\r\n        </tr>\r\n        <tr>\r\n            <td  align=left style=\"width: 60px;\">Lines</td>\r\n            <td  align=left style=\"width: 10px;\">{{_threejs_nums[1]}}</td>\r\n        </tr>\r\n        <tr>\r\n            <td  align=left style=\"width: 60px;\">Points&nbsp;&nbsp;</td>\r\n            <td  align=left style=\"width: 10px;\">{{_threejs_nums[0]}}</td>\r\n        </tr>\r\n    </div>\r\n\r\n    <!-- <button id=\"imagery\"  \r\n        [class.selected]=\"imVisible\" (click)=\"leaflet()\">I\r\n        </button> -->\r\n    <!--setting-->\r\n    \r\n    <!-- <app-setting *ngIf=\"settingVisible == true\"></app-setting> -->\r\n    <div *ngIf=\"seVisible == true\">\r\n        <button id=\"points\" [class.selectvisible]=\"SelectVisible === 'Points'\"><span matTooltip=\"Select Points\">P</span></button>\r\n        <button id=\"vertices\" [class.selectvisible]=\"SelectVisible === 'Vertices'\"><span matTooltip=\"Select Vertices\">V</span></button>\r\n        <button id=\"edges\" [class.selectvisible]=\"SelectVisible === 'Edges'\"><span matTooltip=\"Select Edges\">E</span></button>\r\n        <button id=\"wires\" [class.selectvisible]=\"SelectVisible === 'Wires'\"><span matTooltip=\"Select Wires\">W</span></button>\r\n        <button id=\"faces\" [class.selectvisible]=\"SelectVisible === 'Faces'\"><span matTooltip=\"Select Faces\">F</span></button>\r\n        <button id=\"objects\" [class.selectvisible]=\"SelectVisible === 'Objs'\"><span matTooltip=\"Select Objects\">O</span></button>\r\n      </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/model-viewers/all-viewers/gi-viewer/threejs/threejs-viewer.component.scss":
/*!*******************************************************************************************!*\
  !*** ./src/app/model-viewers/all-viewers/gi-viewer/threejs/threejs-viewer.component.scss ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host {\n  width: 100%;\n  height: 100%;\n  background-color: green;\n  overflow: hidden; }\n\n#threejs-container {\n  height: 100%;\n  width: 100%;\n  margin: 0px;\n  overflow: hidden;\n  color: blue;\n  font-family: sans-serif; }\n\n#container-top-right-resize {\n  top: 0px;\n  right: 0px; }\n\n#shownumber {\n  position: absolute;\n  float: right;\n  color: black;\n  right: 0px;\n  width: 115px;\n  bottom: 0px;\n  color: #395d73;\n  font-family: sans-serif; }\n\n/*#rotating{\r\n    width: 30px;\r\n    height: 25px;\r\n    font-size:15px;\r\n    right:0px; \r\n    text-align:center;\r\n    position: absolute;\r\n    top: 0px;\r\n    background-color:transparent;\r\n    border:0;\r\n}\r\n\r\n#paning{\r\n    width: 30px;\r\n    height: 25px;\r\n    font-size:15px;\r\n    right:0px; \r\n    text-align:center;\r\n    position: absolute;\r\n    top: 25px;\r\n    background-color:transparent;\r\n    border:0;\r\n}\r\n\r\n#zooming{\r\n    width: 30px;\r\n    height: 25px;\r\n    font-size:15px;\r\n    right:0px; \r\n    text-align:center;\r\n    position: absolute;\r\n    margin-top: 50px;\r\n    background-color:transparent;\r\n    border:0;\r\n}*/\n\n/*#imagery{\r\n    width: 30px;\r\n    height: 25px;\r\n    font-size:14px;\r\n    right:0px; \r\n    text-align:center;\r\n    position: absolute;\r\n    margin-top: 10px;\r\n    background-color:transparent;\r\n    border:0;\r\n}*/\n\n#zoomingfit {\n  width: 30px;\n  height: 25px;\n  font-size: 14px;\n  right: 0px;\n  text-align: center;\n  position: absolute;\n  margin-top: 10px;\n  background-color: transparent;\n  border: 0; }\n\n#selecting {\n  width: 30px;\n  height: 25px;\n  font-size: 14px;\n  right: 0px;\n  text-align: center;\n  position: absolute;\n  margin-top: 35px;\n  background-color: transparent;\n  border: 0; }\n\n#points {\n  width: 30px;\n  height: 25px;\n  font: 14px bolder;\n  right: 0px;\n  text-align: center;\n  position: absolute;\n  margin-top: 70px;\n  background-color: transparent;\n  border: 0;\n  font-family: sans-serif; }\n\n#vertices {\n  width: 30px;\n  height: 25px;\n  font: 14px bolder;\n  right: 0px;\n  text-align: center;\n  position: absolute;\n  margin-top: 95px;\n  background-color: transparent;\n  border: 0;\n  font-family: sans-serif; }\n\n#edges {\n  width: 30px;\n  height: 25px;\n  font: 14px bolder;\n  right: 0px;\n  text-align: center;\n  position: absolute;\n  margin-top: 120px;\n  background-color: transparent;\n  border: 0;\n  font-family: sans-serif; }\n\n#wires {\n  width: 30px;\n  height: 25px;\n  font: 14px bolder;\n  right: 0px;\n  text-align: center;\n  position: absolute;\n  margin-top: 145px;\n  background-color: transparent;\n  border: 0;\n  font-family: sans-serif; }\n\n#faces {\n  width: 30px;\n  height: 25px;\n  font: 14px bolder;\n  right: 0px;\n  text-align: center;\n  position: absolute;\n  margin-top: 170px;\n  background-color: transparent;\n  border: 0;\n  font-family: sans-serif; }\n\n#objects {\n  width: 30px;\n  height: 25px;\n  font: 14px bolder;\n  right: 0px;\n  text-align: center;\n  position: absolute;\n  margin-top: 195px;\n  background-color: transparent;\n  border: 0;\n  font-family: sans-serif; }\n\n#setting {\n  width: 30px;\n  height: 25px;\n  font-size: 14px;\n  right: 0px;\n  text-align: center;\n  position: absolute;\n  top: 10px;\n  background-color: transparent;\n  border: 0; }\n\n.selected {\n  color: grey; }\n\n.visible {\n  color: grey; }\n\n.selectvisible {\n  background-color: white !important;\n  color: #395d73; }\n"

/***/ }),

/***/ "./src/app/model-viewers/all-viewers/gi-viewer/threejs/threejs-viewer.component.ts":
/*!*****************************************************************************************!*\
  !*** ./src/app/model-viewers/all-viewers/gi-viewer/threejs/threejs-viewer.component.ts ***!
  \*****************************************************************************************/
/*! exports provided: ThreejsViewerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ThreejsViewerComponent", function() { return ThreejsViewerComponent; });
/* harmony import */ var _data_data_subscriber__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../data/data.subscriber */ "./src/app/model-viewers/all-viewers/gi-viewer/data/data.subscriber.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
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

// import @angular stuff

/**
 * A threejs viewer for viewing geo-info (GI) models.
 * This component gets used in /app/model-viewers/all-viewers/gi-viewer/gi-viewer.component.html
 */
var ThreejsViewerComponent = /** @class */ (function (_super) {
    __extends(ThreejsViewerComponent, _super);
    /**
     * Creates a new viewer,
     * @param injector
     * @param elem
     */
    function ThreejsViewerComponent(injector, elem) {
        var _this = _super.call(this, injector) || this;
        // flags for displayinhg text in viewer, see html
        _this._no_model = false;
        _this._model_error = false;
        _this._elem = elem;
        return _this;
    }
    /**
     * Called when the viewer is initialised.
     */
    ThreejsViewerComponent.prototype.ngOnInit = function () {
        // console.log('CALLING ngOnInit in THREEJS VIEWER COMPONENT');
        var container = this._elem.nativeElement.children.namedItem('threejs-container');
        // check for container
        if (!container) {
            console.error('No container in Three Viewer');
            return;
        }
        // size of window
        this._width = container.offsetWidth; // container.client_width;
        this._height = container.offsetHeight; // container.client_height;
        // get the model and scene
        this._gi_model = this.dataService.getGIModel();
        this._data_threejs = this.dataService.getThreejsScene();
        container.appendChild(this._data_threejs._renderer.domElement);
        // set the numbers of entities
        this._threejs_nums = this._data_threejs._threejs_nums;
        // ??? What is happening here?
        var self = this;
        this._data_threejs._controls.addEventListener('change', function () { self.render(self); });
        self._data_threejs._renderer.render(self._data_threejs._scene, self._data_threejs._camera);
        // update the model, calles getModel() from data service
        this.updateModel();
    };
    /**
     * TODO What is "self"? why not use "this"
     * @param self
     */
    ThreejsViewerComponent.prototype.render = function (self) {
        console.log('CALLING render in THREEJS VIEWER COMPONENT');
        self._data_threejs._renderer.render(self._data_threejs._scene, self._data_threejs._camera);
    };
    /**
     * Called when anything changes
     */
    ThreejsViewerComponent.prototype.ngDoCheck = function () {
        var _this = this;
        var container = this._elem.nativeElement.children.namedItem('threejs-container');
        var width = container.offsetWidth;
        var height = container.offsetHeight;
        // this is when dimensions change
        if (width !== this._width || height !== this._height) {
            setTimeout(function () {
                _this.onResize();
            }, 50);
        }
    };
    /**
     * Called on window resize.
     */
    ThreejsViewerComponent.prototype.onResize = function () {
        console.log('CALLING onResize in THREEJS VIEWER COMPONENT');
        var container = this._elem.nativeElement.children.namedItem('threejs-container');
        /// check for container
        if (!container) {
            console.error('No container in Three Viewer');
            return;
        }
        ///
        this._width = container.offsetWidth;
        this._height = container.offsetHeight;
        this._data_threejs._camera.aspect = this._width / this._height;
        this._data_threejs._camera.updateProjectionMatrix();
        this._data_threejs._renderer.setSize(this._width, this._height);
        // console.log('ASPECT:::::', this._data_threejs._camera.aspect);
        // this.updateModel();
    };
    /**
     * Called on model updated.
     * @param message
     */
    // public notify(message: string): void {
    //     console.log('CALLING notify in THREEJS VIEWER');
    //     if (message === 'model_update' && this._data_threejs) {
    //         this.updateModel();
    //     }
    // }
    /**
     * Update the model in the viewer.
     */
    ThreejsViewerComponent.prototype.updateModel = function () {
        // console.log('CALLING updateModel in THREEJS VIEWER COMPONENT');
        if (!this._gi_model || !this._data_threejs) {
            console.warn('Model or Scene not defined.');
            this._no_model = true;
            return;
        }
        try {
            // Set model flags
            this._model_error = false;
            this._no_model = false;
            // set renderer size
            this._data_threejs._renderer.setSize(this._width, this._height);
            // set camera aspect ratio
            this._data_threejs._camera.aspect = this._width / this._height;
            // render the scene
            this.render(this);
            // console log the scene
            console.log('>> this.scene >>', this._data_threejs._scene);
        }
        catch (ex) {
            console.error('Error displaying model:', ex);
            this._model_error = true;
            this._data_threejs._text = ex;
        }
    };
    ThreejsViewerComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'threejs-viewer',
            template: __webpack_require__(/*! ./threejs-viewer.component.html */ "./src/app/model-viewers/all-viewers/gi-viewer/threejs/threejs-viewer.component.html"),
            styles: [__webpack_require__(/*! ./threejs-viewer.component.scss */ "./src/app/model-viewers/all-viewers/gi-viewer/threejs/threejs-viewer.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injector"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"]])
    ], ThreejsViewerComponent);
    return ThreejsViewerComponent;
}(_data_data_subscriber__WEBPACK_IMPORTED_MODULE_0__["DataSubscriber"]));



/***/ }),

/***/ "./src/app/model-viewers/all-viewers/help-viewer/viewer.component.ts":
/*!***************************************************************************!*\
  !*** ./src/app/model-viewers/all-viewers/help-viewer/viewer.component.ts ***!
  \***************************************************************************/
/*! exports provided: HelpViewerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HelpViewerComponent", function() { return HelpViewerComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_decorators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @shared/decorators */ "./src/app/shared/decorators/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * HelpViewerComponent
 */
var HelpViewerComponent = /** @class */ (function () {
    /**
     * constructor
     */
    function HelpViewerComponent() {
        // console.log(`Help Viewer Created`);
    }
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], HelpViewerComponent.prototype, "output", void 0);
    HelpViewerComponent = __decorate([
        _shared_decorators__WEBPACK_IMPORTED_MODULE_1__["ModuleDocAware"],
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'procedure-help',
            template: "\n  <div *ngIf='output'>\n    <h2>{{output.name}}</h2>\n    <h4>Module: <span>{{output.module}}</span></h4>\n    <h5><span>Description:</span></h5>\n    <p>{{output.description}}</p>\n    <h5 *ngIf='output.parameters?.length > 0'><span>Parameters: </span></h5>\n    <p class='paramP' *ngFor='let param of output.parameters'><span>{{param.name}} - </span>{{param.description}}</p>\n    <h5 *ngIf='output.returns'>Returns:</h5>\n    <p *ngIf='output.returns'>{{output.returns}}</p>\n  </div>\n\n\n  ",
            styles: [__webpack_require__(/*! ../general-viewer.scss */ "./src/app/model-viewers/all-viewers/general-viewer.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], HelpViewerComponent);
    return HelpViewerComponent;
}());



/***/ }),

/***/ "./src/app/model-viewers/all-viewers/text-viewer/viewer.component.ts":
/*!***************************************************************************!*\
  !*** ./src/app/model-viewers/all-viewers/text-viewer/viewer.component.ts ***!
  \***************************************************************************/
/*! exports provided: TextViewerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextViewerComponent", function() { return TextViewerComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _modules__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @modules */ "./src/app/core/modules/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * TextViewerComponent
 */
var TextViewerComponent = /** @class */ (function () {
    /**
     * constructor
     */
    function TextViewerComponent() {
        // console.log(`Text Viewer Created`);
    }
    /**
     * ngOnInit
     */
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
            // console.log('Unknown output type:', this.data);
            // this.output = functions.__stringify__(this.data);
            this.output = _modules__WEBPACK_IMPORTED_MODULE_1__["Model"].__stringify__(this.data); // TODO - make this generic
        }
    };
    /**
     * ngDoCheck
     */
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
            // console.log('Unknown output type:', this.data);
            this.output = _modules__WEBPACK_IMPORTED_MODULE_1__["Model"].__stringify__(this.data); // TODO - make this generic
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
            styles: [__webpack_require__(/*! ../general-viewer.scss */ "./src/app/model-viewers/all-viewers/general-viewer.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], TextViewerComponent);
    return TextViewerComponent;
}());



/***/ }),

/***/ "./src/app/model-viewers/model-viewers-container.component.html":
/*!**********************************************************************!*\
  !*** ./src/app/model-viewers/model-viewers-container.component.html ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class='viewers-container'>  \r\n    <div class='container__header'>\r\n        <div class=\"tab\">\r\n            <button class='btn-tab' \r\n                [class.active]='view.name == activeView.name'\r\n                *ngFor='let view of Viewers;' \r\n                (click)='updateView(view)'>\r\n            {{view.name}}\r\n            </button>\r\n        </div>\r\n    </div>\r\n    <div class='content__panel'>\r\n        <ng-container #vc></ng-container>\r\n    </div>\r\n</div>"

/***/ }),

/***/ "./src/app/model-viewers/model-viewers-container.component.scss":
/*!**********************************************************************!*\
  !*** ./src/app/model-viewers/model-viewers-container.component.scss ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".viewers-container {\n  display: block;\n  height: 100%;\n  overflow: hidden; }\n\n.container__header {\n  flex: 0 1 auto;\n  height: 35px;\n  width: 100%;\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  padding: 0px 0px 0px 0px;\n  background-color: #ccc;\n  border-bottom: 3px solid #eeeeee;\n  line-height: 35px;\n  font-size: 18px;\n  font-weight: 600;\n  text-align: center; }\n\n.content__panel {\n  background-color: gainsboro;\n  width: 100%;\n  height: 100%;\n  overflow: auto; }\n\nbutton.btn {\n  margin: 10px;\n  font-size: 14px;\n  line-height: 18px;\n  border: 2px solid gray;\n  border-radius: 4px;\n  padding: 2px 10px;\n  background-color: transparent;\n  color: #505050; }\n\nbutton.btn:hover {\n  color: blue; }\n\n/* tab styling */\n\n.tab {\n  border: 2px;\n  overflow: hidden;\n  background-color: #ccc; }\n\n.tab button {\n  display: inline-block;\n  vertical-align: bottom;\n  background-color: inherit;\n  color: #505050;\n  border: none;\n  outline: none;\n  cursor: pointer;\n  padding: 8px 10px;\n  transition: 0.3s;\n  font-size: 14px; }\n\n.tab button:hover {\n  color: blue; }\n\n.tab button.active {\n  background-color: #ccc;\n  color: #000096;\n  font-weight: 600;\n  border-color: #222 !important; }\n"

/***/ }),

/***/ "./src/app/model-viewers/model-viewers-container.component.ts":
/*!********************************************************************!*\
  !*** ./src/app/model-viewers/model-viewers-container.component.ts ***!
  \********************************************************************/
/*! exports provided: DataViewersContainerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataViewersContainerComponent", function() { return DataViewersContainerComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _model_viewers_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./model-viewers.config */ "./src/app/model-viewers/model-viewers.config.ts");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @services */ "./src/app/core/services/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/**
 * A component that contains all the viewers.
 * This component is used in /app/appmodule/app.component.html
 */
var DataViewersContainerComponent = /** @class */ (function () {
    /**
     * Construct the viewer container.
     * @param injector
     * @param r
     */
    function DataViewersContainerComponent(injector, r, dataService) {
        this.injector = injector;
        this.r = r;
        this.dataService = dataService;
        this.views = [];
        this.Viewers = _model_viewers_config__WEBPACK_IMPORTED_MODULE_1__["Viewers"];
        // do nothing
    }
    /**
     * ngOnInit
     */
    DataViewersContainerComponent.prototype.ngOnInit = function () {
        this.activeView = this.Viewers[0];
        if (this.dataService.activeView) {
            for (var _i = 0, _a = this.Viewers; _i < _a.length; _i++) {
                var view = _a[_i];
                if (view.name === this.dataService.activeView) {
                    this.activeView = view;
                }
            }
        }
        this.updateView(this.activeView);
    };
    /**
     * ngOnDestroy
     */
    DataViewersContainerComponent.prototype.ngOnDestroy = function () {
        this.dataService.activeView = this.activeView.name;
        this.vc.clear();
        for (var view in this.views) {
            if (this.views[view]) {
                this.views[view].destroy();
            }
        }
    };
    /**
     * ngOnChanges
     */
    DataViewersContainerComponent.prototype.ngOnChanges = function () {
        if (this.currentHelpView !== this.helpView) {
            var view = void 0;
            for (var _i = 0, _a = this.Viewers; _i < _a.length; _i++) {
                var v = _a[_i];
                if (v.name === 'Help') {
                    view = v;
                }
            }
            this.currentHelpView = this.helpView;
            this.updateView(view);
        }
        else {
            this.updateValue();
        }
    };
    /**
     * createView
     * @param view
     */
    DataViewersContainerComponent.prototype.createView = function (view) {
        var component = view.component;
        var factory = this.r.resolveComponentFactory(component);
        var componentRef = factory.create(this.injector);
        /*
        if (view.name != 'Console'){
            componentRef.instance["data"] = this.data;
        }
        */
        return componentRef;
    };
    /**
     * updateView
     * @param view
     */
    DataViewersContainerComponent.prototype.updateView = function (view) {
        this.activeView = view;
        if (this.views[this.activeView.name] === undefined) {
            this.views[this.activeView.name] = this.createView(view);
        }
        this.updateValue();
        this.vc.detach();
        this.vc.insert(this.views[this.activeView.name].hostView);
    };
    /**
     * updateValue
     */
    DataViewersContainerComponent.prototype.updateValue = function () {
        try {
            var componentRef = this.views[this.activeView.name];
            if (this.activeView.name === 'Help') {
                componentRef.instance['output'] = this.currentHelpView;
            }
            else if (this.activeView.name !== 'Console') {
                componentRef.instance['data'] = this.data;
            }
            else {
                componentRef.instance['scrollcheck'] = true;
            }
        }
        catch (ex) {
            // console.log(`Active View not defined`);
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('vc', { read: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"] }),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"])
    ], DataViewersContainerComponent.prototype, "vc", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], DataViewersContainerComponent.prototype, "data", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], DataViewersContainerComponent.prototype, "helpView", void 0);
    DataViewersContainerComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            // tslint:disable-next-line:component-selector
            selector: 'model-viewers-container',
            template: __webpack_require__(/*! ./model-viewers-container.component.html */ "./src/app/model-viewers/model-viewers-container.component.html"),
            styles: [__webpack_require__(/*! ./model-viewers-container.component.scss */ "./src/app/model-viewers/model-viewers-container.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ComponentFactoryResolver"], _services__WEBPACK_IMPORTED_MODULE_2__["DataService"]])
    ], DataViewersContainerComponent);
    return DataViewersContainerComponent;
}());



/***/ }),

/***/ "./src/app/model-viewers/model-viewers-container.module.ts":
/*!*****************************************************************!*\
  !*** ./src/app/model-viewers/model-viewers-container.module.ts ***!
  \*****************************************************************/
/*! exports provided: DataViewersContainer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataViewersContainer", function() { return DataViewersContainer; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _model_viewers_container_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./model-viewers-container.component */ "./src/app/model-viewers/model-viewers-container.component.ts");
/* harmony import */ var _model_viewers_config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./model-viewers.config */ "./src/app/model-viewers/model-viewers.config.ts");
/* harmony import */ var _all_viewers_text_viewer_viewer_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./all-viewers/text-viewer/viewer.component */ "./src/app/model-viewers/all-viewers/text-viewer/viewer.component.ts");
/* harmony import */ var _all_viewers_console_viewer_viewer_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./all-viewers/console-viewer/viewer.component */ "./src/app/model-viewers/all-viewers/console-viewer/viewer.component.ts");
/* harmony import */ var _all_viewers_help_viewer_viewer_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./all-viewers/help-viewer/viewer.component */ "./src/app/model-viewers/all-viewers/help-viewer/viewer.component.ts");
/* harmony import */ var _all_viewers_gi_viewer_gi_viewer_module__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./all-viewers/gi-viewer/gi-viewer.module */ "./src/app/model-viewers/all-viewers/gi-viewer/gi-viewer.module.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





// viewers




// import { ThreejsViewerComponent } from './viewers/gi-viewer/threejs/threejs-viewer.component';
// import { MobiusCesium } from './viewers/cesium-viewer/mobius-cesium.module';
// import { VisualiseComponent } from "./viewers/cesium-viewer/setting/visualise.component";
// import { AttributesComponent } from "./viewers/cesium-viewer/setting/attributes.copmponent";
/**
 * DataViewersContainer, NgModule
 */
var DataViewersContainer = /** @class */ (function () {
    /**
     * constructor
     */
    function DataViewersContainer() {
        // do nothing
    }
    DataViewersContainer = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            declarations: [
                _model_viewers_container_component__WEBPACK_IMPORTED_MODULE_3__["DataViewersContainerComponent"],
                _all_viewers_text_viewer_viewer_component__WEBPACK_IMPORTED_MODULE_5__["TextViewerComponent"],
                _all_viewers_console_viewer_viewer_component__WEBPACK_IMPORTED_MODULE_6__["ConsoleViewerComponent"],
                _all_viewers_help_viewer_viewer_component__WEBPACK_IMPORTED_MODULE_7__["HelpViewerComponent"],
            ],
            exports: [
                _model_viewers_container_component__WEBPACK_IMPORTED_MODULE_3__["DataViewersContainerComponent"]
            ],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _all_viewers_gi_viewer_gi_viewer_module__WEBPACK_IMPORTED_MODULE_8__["GIViewer"],
            ],
            entryComponents: _model_viewers_config__WEBPACK_IMPORTED_MODULE_4__["VIEWER_ARR"].slice(),
            providers: []
        }),
        __metadata("design:paramtypes", [])
    ], DataViewersContainer);
    return DataViewersContainer;
}());



/***/ }),

/***/ "./src/app/model-viewers/model-viewers.config.ts":
/*!*******************************************************!*\
  !*** ./src/app/model-viewers/model-viewers.config.ts ***!
  \*******************************************************/
/*! exports provided: VIEWER_ARR, Viewers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VIEWER_ARR", function() { return VIEWER_ARR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Viewers", function() { return Viewers; });
/* harmony import */ var _all_viewers_text_viewer_viewer_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./all-viewers/text-viewer/viewer.component */ "./src/app/model-viewers/all-viewers/text-viewer/viewer.component.ts");
/* harmony import */ var _all_viewers_console_viewer_viewer_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./all-viewers/console-viewer/viewer.component */ "./src/app/model-viewers/all-viewers/console-viewer/viewer.component.ts");
/* harmony import */ var _all_viewers_help_viewer_viewer_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./all-viewers/help-viewer/viewer.component */ "./src/app/model-viewers/all-viewers/help-viewer/viewer.component.ts");
/* harmony import */ var _all_viewers_gi_viewer_gi_viewer_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./all-viewers/gi-viewer/gi-viewer.component */ "./src/app/model-viewers/all-viewers/gi-viewer/gi-viewer.component.ts");
// Step-1: Add new ViewerComponet here




var VIEWER_ARR = [
    // Step-2: Add Component here
    _all_viewers_gi_viewer_gi_viewer_component__WEBPACK_IMPORTED_MODULE_3__["GIViewerComponent"],
    _all_viewers_text_viewer_viewer_component__WEBPACK_IMPORTED_MODULE_0__["TextViewerComponent"],
    _all_viewers_console_viewer_viewer_component__WEBPACK_IMPORTED_MODULE_1__["ConsoleViewerComponent"],
    _all_viewers_help_viewer_viewer_component__WEBPACK_IMPORTED_MODULE_2__["HelpViewerComponent"],
];
var Viewers = [
    // Step-3: Add Viewer Definition here: name, icon and component
    { name: '3D Viewer', icon: undefined, component: _all_viewers_gi_viewer_gi_viewer_component__WEBPACK_IMPORTED_MODULE_3__["GIViewerComponent"] },
    { name: 'Summary', icon: undefined, component: _all_viewers_text_viewer_viewer_component__WEBPACK_IMPORTED_MODULE_0__["TextViewerComponent"] },
    { name: 'Console', icon: undefined, component: _all_viewers_console_viewer_viewer_component__WEBPACK_IMPORTED_MODULE_1__["ConsoleViewerComponent"] },
    { name: 'Help', icon: undefined, component: _all_viewers_help_viewer_viewer_component__WEBPACK_IMPORTED_MODULE_2__["HelpViewerComponent"] },
];


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
/*! exports provided: mergeInputsFunc, ExecuteComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mergeInputsFunc", function() { return mergeInputsFunc; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExecuteComponent", function() { return ExecuteComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _models_flowchart__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @models/flowchart */ "./src/app/shared/models/flowchart/index.ts");
/* harmony import */ var _models_code__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @models/code */ "./src/app/shared/models/code/index.ts");
/* harmony import */ var _modules__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @modules */ "./src/app/core/modules/index.ts");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @services */ "./src/app/core/services/index.ts");
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






var mergeInputsFunc = "\nfunction mergeInputs(models){\n    let result = __modules__." + _modules__WEBPACK_IMPORTED_MODULE_3__["_parameterTypes"].new + "();\n    for (let model of models){\n        __modules__." + _modules__WEBPACK_IMPORTED_MODULE_3__["_parameterTypes"].merge + "(result, model);\n    }\n    return result;\n}\n";
var ExecuteComponent = /** @class */ (function () {
    function ExecuteComponent(dataService) {
        this.dataService = dataService;
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
                                for (_i = 0, _a = this.dataService.flowchart.nodes; _i < _a.length; _i++) {
                                    node = _a[_i];
                                    if (node.type !== 'start') {
                                        if (node.input.edges) {
                                            node.input.value = undefined;
                                        }
                                    }
                                }
                                // order the flowchart
                                if (!this.dataService.flowchart.ordered) {
                                    _models_flowchart__WEBPACK_IMPORTED_MODULE_1__["FlowchartUtils"].orderNodes(this.dataService.flowchart);
                                }
                                funcStrings = {};
                                _b = 0, _c = this.dataService.flowchart.functions;
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
                                _f = 0, _g = this.dataService.flowchart.nodes;
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
            var params, nodeCode, fnString, hasFunctions, funcName, _i, nodeCode_1, i, fn, result, constant, constString, ex_1, prodWithError_1, markError_1, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = { 'currentProcedure': [''] };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, _models_code__WEBPACK_IMPORTED_MODULE_2__["CodeUtils"].getNodeCode(node, true)];
                    case 2:
                        nodeCode = _a.sent();
                        fnString = nodeCode.join('\n');
                        // add the constants from the start node
                        fnString = this.globalVars + fnString;
                        params['model'] = node.input.value;
                        hasFunctions = false;
                        for (funcName in funcStrings) {
                            if (funcStrings.hasOwnProperty(funcName)) {
                                fnString = funcStrings[funcName] + fnString;
                                hasFunctions = true;
                            }
                        }
                        if (hasFunctions) {
                            fnString = mergeInputsFunc + '\n\n' + fnString;
                        }
                        console.log("______________________________________________________________\n/*     " + node.name.toUpperCase() + "     */\n");
                        for (_i = 0, nodeCode_1 = nodeCode; _i < nodeCode_1.length; _i++) {
                            i = nodeCode_1[_i];
                            if (i.substring(0, 18) === '__params__.current') {
                                continue;
                            }
                            if (i.length > 500) {
                                console.log(i.substring(0, 500) + '...\n});\n');
                            }
                            else {
                                console.log(i);
                            }
                        }
                        console.log("--------------------------\n");
                        fn = new Function('__modules__', '__params__', fnString);
                        result = fn(_modules__WEBPACK_IMPORTED_MODULE_3__, params);
                        node.output.value = result;
                        if (node.type === 'start') {
                            for (constant in params['constants']) {
                                if (params['constants'].hasOwnProperty(constant)) {
                                    constString = JSON.stringify(params['constants'][constant]);
                                    this.globalVars += "const " + constant + " = " + constString + ";\n";
                                }
                            }
                            this.globalVars += '\n';
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        ex_1 = _a.sent();
                        throw ex_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ExecuteComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'execute',
            /*
            template: `<button class="btn--execute"
                              (click)="execute()">
                          Execute
                       </button>`,
              */
            template: "<button id='executeButton' class=\"btn\" mat-icon-button title=\"Execute\" (click)=\"execute()\">\n    <mat-icon>play_circle_outline</mat-icon>\n    </button>\n    ",
            styles: [
                ".btn--execute{\n                display: inline-block;\n                vertical-align: middle;\n                font-size: 14px;\n                line-height: 18px;\n                border: 3px solid #E0C229;\n                border-radius: 4px;\n                padding: 1px 10px;\n                background-color: #E0C229;\n                color: #494D59;\n                font-weight: 600;\n                text-transform: uppercase;\n              }\n              .btn{\n                vertical-align: middle;\n                background-color: transparent;\n                border: none;\n                color: rgb(80,80,80);\n              }\n              .btn:hover{\n                color: blue;\n              }"
            ]
        }),
        __metadata("design:paramtypes", [_services__WEBPACK_IMPORTED_MODULE_4__["DataService"]])
    ], ExecuteComponent);
    return ExecuteComponent;
}());



/***/ }),

/***/ "./src/app/shared/components/file/download.utils.ts":
/*!**********************************************************!*\
  !*** ./src/app/shared/components/file/download.utils.ts ***!
  \**********************************************************/
/*! exports provided: DownloadUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DownloadUtils", function() { return DownloadUtils; });
var DownloadUtils = /** @class */ (function () {
    function DownloadUtils() {
    }
    DownloadUtils.downloadFile = function (fileName, fileContent) {
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
    return DownloadUtils;
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
/* harmony import */ var _shared_models_procedure__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @shared/models/procedure */ "./src/app/shared/models/procedure/index.ts");
/* harmony import */ var circular_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! circular-json */ "./node_modules/circular-json/build/circular-json.node.js");
/* harmony import */ var circular_json__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(circular_json__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _modules__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @modules */ "./src/app/core/modules/index.ts");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @services */ "./src/app/core/services/index.ts");
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
    function LoadFileComponent(dataService) {
        this.dataService = dataService;
    }
    LoadFileComponent.prototype.sendloadfile = function () {
        var _this = this;
        var selectedFile = document.getElementById('file-input').files[0];
        var stream = rxjs__WEBPACK_IMPORTED_MODULE_1__["Observable"].create(function (observer) {
            var reader = new FileReader();
            reader.onloadend = function () {
                function checkMissingProd(prodList) {
                    var check = true;
                    for (var _i = 0, prodList_1 = prodList; _i < prodList_1.length; _i++) {
                        var prod = prodList_1[_i];
                        if (prod.children) {
                            if (!checkMissingProd(prod.children)) {
                                check = false;
                            }
                        }
                        prod.hasError = false;
                        if (prod.type !== _shared_models_procedure__WEBPACK_IMPORTED_MODULE_2__["ProcedureTypes"].Function) {
                            continue;
                        }
                        if (!_modules__WEBPACK_IMPORTED_MODULE_4__[prod.meta.module] || !_modules__WEBPACK_IMPORTED_MODULE_4__[prod.meta.module][prod.meta.name]) {
                            prod.hasError = true;
                            check = false;
                        }
                    }
                    return check;
                }
                // if (typeof reader.result === 'string') {}
                var f = circular_json__WEBPACK_IMPORTED_MODULE_3__["parse"](reader.result);
                var file = {
                    name: f.name,
                    author: f.author,
                    flowchart: f.flowchart,
                    last_updated: f.last_updated,
                    version: f.version
                };
                var hasError = false;
                for (var _i = 0, _a = file.flowchart.nodes; _i < _a.length; _i++) {
                    var node = _a[_i];
                    if (!checkMissingProd(node.procedure)) {
                        node.hasError = true;
                        hasError = true;
                    }
                }
                if (hasError) {
                    alert('The flowchart contains functions that does not exist in the current version of Mobius');
                }
                observer.next(file);
                observer.complete();
            };
            reader.readAsText(selectedFile);
        });
        stream.subscribe(function (loadeddata) {
            _this.dataService.file = loadeddata;
            _this.dataService.newFlowchart = true;
            if (_this.dataService.node.type !== 'end') {
                for (var i = 0; i < loadeddata.flowchart.nodes.length; i++) {
                    if (loadeddata.flowchart.nodes[i].type === 'end') {
                        loadeddata.flowchart.meta.selected_nodes = [i];
                        break;
                    }
                }
            }
            document.getElementById('executeButton').click();
            var zooming = document.getElementById('zoomToFit');
            if (zooming) {
                zooming.click();
                _this.dataService.newFlowchart = false;
            }
            else {
                _this.dataService.newFlowchart = true;
            }
        });
        document.getElementById('file-input').value = '';
    };
    LoadFileComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'file-load',
            template: "<button id='loadfile' class='btn' onclick=\"document.getElementById('file-input').click();\">Load</button>\n              <input id=\"file-input\" type=\"file\" name=\"name\" (change)=\"sendloadfile()\" style=\" display: none;\" />",
            styles: [
                "\n            button.btn{\n                margin: 0px 0px 0px 0px;\n                font-size: 10px;\n                line-height: 12px;\n                border: 2px solid gray;\n                border-radius: 4px;\n                padding: 2px 5px;\n                background-color: #3F4651;\n                color: #E7BF00;\n                font-weight: 600;\n                text-transform: uppercase;\n             }\n            button.btn:hover{\n                background-color: gray;\n                color: white;\n            }\n\n             "
            ]
        }),
        __metadata("design:paramtypes", [_services__WEBPACK_IMPORTED_MODULE_5__["DataService"]])
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
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @services */ "./src/app/core/services/index.ts");
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
    function NewFileComponent(dataService, cdr) {
        this.dataService = dataService;
        this.cdr = cdr;
        this.create = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
    NewFileComponent.prototype.sendNewFile = function () {
        var confirmed = confirm('Resetting would delete the current flowchart. Would you like to continue?');
        if (!confirmed) {
            return;
        }
        var file = {
            name: 'default_file.mob',
            author: 'new_user',
            flowchart: _models_flowchart__WEBPACK_IMPORTED_MODULE_1__["FlowchartUtils"].newflowchart(),
            last_updated: new Date(),
            version: 1
        };
        this.dataService.file = file;
        var zooming = document.getElementById('zoomToFit');
        if (zooming) {
            zooming.click();
            this.dataService.newFlowchart = false;
        }
        else {
            this.dataService.newFlowchart = true;
        }
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
                "\n            button.btn{\n                margin: 0px 0px 0px 0px;\n                font-size: 10px;\n                line-height: 12px;\n                border: 2px solid gray;\n                border-radius: 4px;\n                padding: 2px 5px;\n                background-color: #3F4651;\n                color: #E7BF00;\n                font-weight: 600;\n                text-transform: uppercase;\n            }\n            button.btn:hover{\n                background-color: gray;\n                color: white;\n            }\n             "
            ]
        }),
        __metadata("design:paramtypes", [_services__WEBPACK_IMPORTED_MODULE_2__["DataService"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"]])
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
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @services */ "./src/app/core/services/index.ts");
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
    function SaveFileComponent(dataService) {
        this.dataService = dataService;
    }
    // todo: save file
    SaveFileComponent.prototype.download = function () {
        var f = this.dataService.file;
        if (!f.flowchart.ordered) {
            _models_flowchart__WEBPACK_IMPORTED_MODULE_3__["FlowchartUtils"].orderNodes(f.flowchart);
        }
        var savedfile = circular_json__WEBPACK_IMPORTED_MODULE_2__["parse"](circular_json__WEBPACK_IMPORTED_MODULE_2__["stringify"](f));
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
        /*
        for (const prod of savedfile.flowchart.nodes[0].procedure) {
            prod.args[prod.argCount - 1].value = undefined;
        }
        */
        savedfile.flowchart.meta.selected_nodes = [0];
        for (var _d = 0, _e = savedfile.flowchart.edges; _d < _e.length; _d++) {
            var edge = _e[_d];
            edge.selected = false;
        }
        savedfile.name = savedfile.flowchart.name;
        var fileString = circular_json__WEBPACK_IMPORTED_MODULE_2__["stringify"](savedfile);
        var fname = savedfile.flowchart.name.replace(/\ /g, '_') + ".mob";
        var blob = new Blob([fileString], { type: 'application/json' });
        _download_utils__WEBPACK_IMPORTED_MODULE_1__["DownloadUtils"].downloadFile(fname, blob);
    };
    SaveFileComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'file-save',
            template: "<button id='savefile' class='btn' (click)='download()'>Save</button>",
            styles: [
                "\n            button.btn{\n                margin: 0px 0px 0px 0px;\n                font-size: 10px;\n                line-height: 12px;\n                border: 2px solid gray;\n                border-radius: 4px;\n                padding: 2px 5px;\n                background-color: #3F4651;\n                color: #E7BF00;\n                font-weight: 600;\n                text-transform: uppercase;\n             }\n            button.btn:hover{\n                background-color: gray;\n                color: white;\n            }\n             "
            ]
        }),
        __metadata("design:paramtypes", [_services__WEBPACK_IMPORTED_MODULE_4__["DataService"]])
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
            template: "<div class='panel__header'>\n                    <h3>{{node?.name}} // {{title}}</h3>\n              </div>",
            styles: [
                ".panel__header{\n                font-weight: 600;\n                border: 2px solid #222;\n                border-radius: 4px;\n                padding: 5px;\n             }\n             h3{\n                margin: 0px;\n             }"
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
            { path: '/dashboard',
                name: 'dashboard'
            },
            { path: '/editor',
                name: 'editor'
            },
        ];
    }
    NavigationComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'navigation',
            template: "<ul class='nav'>\n                <li class='link' *ngFor='let link of _links;'\n                      [class.active]='link.path == _router.url'\n                      [routerLink]=\"link.path\"\n                      >{{link.name}}</li>\n              </ul>",
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

module.exports = "<h2>{{displayName()}}</h2>\r\n<textarea id='display-flowchart-desc' [(ngModel)]='flowchart.description' placeholder=\"Flowchart Description\" disabled></textarea>\r\n<hr>\r\n\r\n<!-- <p>Edit the parameters of your flowchart here. These parameters are visible in the viewer when you share your flowchart.</p> -->\r\n<procedure-input-viewer *ngFor=\"let prod of startNode.procedure\" [prod]=\"prod\"></procedure-input-viewer>\r\n"

/***/ }),

/***/ "./src/app/shared/components/parameter-viewer/parameter-viewer.component.scss":
/*!************************************************************************************!*\
  !*** ./src/app/shared/components/parameter-viewer/parameter-viewer.component.scss ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".container {\n  background-color: transparent;\n  width: auto;\n  height: auto;\n  display: flex;\n  flex-direction: column;\n  flex-wrap: wrap; }\n\nh2 {\n  color: #505050;\n  text-align: left;\n  padding-left: 15px;\n  font-size: 12px;\n  line-height: 16px; }\n\np {\n  color: #505050;\n  text-align: left;\n  padding-left: 15px;\n  font-size: 12px;\n  line-height: 14px; }\n\nhr {\n  border-top: 2px solid #efefef; }\n\ndiv[class^=\"container--\"] {\n  display: flex;\n  flex-direction: column;\n  margin: 10px 0px; }\n\ntextarea {\n  color: #505050;\n  background-color: gainsboro;\n  border: none;\n  padding: 2px 0px 0px 15px;\n  font-family: sans-serif;\n  font-size: 12px;\n  margin: 0px;\n  width: 90%;\n  min-height: 20px;\n  max-height: 300px;\n  resize: none; }\n"

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

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
ctx.font = '12px sans-serif';
var ParameterViewerComponent = /** @class */ (function () {
    function ParameterViewerComponent() {
    }
    ParameterViewerComponent.prototype.ngAfterViewInit = function () {
        var textarea = document.getElementById('display-flowchart-desc');
        var desc = this.flowchart.description.split('\n');
        var textareaWidth = textarea.getBoundingClientRect().width;
        var lineCount = desc.length;
        for (var _i = 0, desc_1 = desc; _i < desc_1.length; _i++) {
            var line = desc_1[_i];
            lineCount += Math.floor(ctx.measureText(line).width / textareaWidth) + 1;
        }
        textarea.style.height = lineCount * 7.5 + 'px';
    };
    ParameterViewerComponent.prototype.displayName = function () {
        return this.flowchart.name.replace(/_/g, ' ');
    };
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

module.exports = "<div class='container'>\r\n    <div class='container--parameter'>\r\n        <input class='input-const-name' [class.disabled-input]='true' [value]='displayConstName()' \r\n        [style.width.px]='inputSize(prod.args[prod.argCount-2].value,\"Undefined\") + 10' disabled>\r\n\r\n        <ng-container class='parameter__name' [ngSwitch]=\"prod.meta.inputMode\">\r\n\r\n            <input *ngSwitchCase=\"PortTypes.SimpleInput\" [(ngModel)]='prod.args[prod.argCount-1].value' \r\n            placeholder='{{prod.args[prod.argCount-1].default}}'\r\n            [style.width.px]='inputSize(prod.args[prod.argCount-1].value, prod.args[prod.argCount-1].default)'>\r\n            \r\n            <ng-container *ngSwitchCase=\"PortTypes.Slider\">\r\n                <mat-slider\r\n                    [(ngModel)]='prod.args[prod.argCount-1].value'\r\n                    thumbLabel\r\n                    tickInterval=\"auto\"\r\n                    min={{prod.args[prod.argCount-1].min||0}}\r\n                    max={{prod.args[prod.argCount-1].max||100}}></mat-slider>\r\n                <input [class.disabled-input]='true' [(ngModel)]='prod.args[prod.argCount-1].value' \r\n                [style.width.px]='inputSize(prod.args[prod.argCount-1].value, \"\")' disabled>\r\n\r\n\r\n                <!--\r\n                <input [(ngModel)]='prod.args[prod.argCount-1].value' name='prod.args[prod.argCount-1].value' type=\"range\" placeholder='{{prod.args[prod.argCount-1].default}}'>\r\n                <input [(ngModel)]='prod.args[prod.argCount-1].value' value='prod.args[prod.argCount-1].value'  placeholder='{{prod.args[prod.argCount-1].default}}' disabled>\r\n                -->\r\n            </ng-container>\r\n            <input *ngSwitchCase=\"PortTypes.Checkbox\" [(ngModel)]='prod.args[prod.argCount-1].value' type=\"checkbox\">\r\n            <input *ngSwitchCase=\"PortTypes.URL\" [(ngModel)]='prod.args[prod.argCount-1].value' placeholder='{{prod.args[prod.argCount-1].default}}' \r\n            [style.width.px]='inputSize(prod.args[prod.argCount-1].value, prod.args[prod.argCount-1].default)'>\r\n            <input *ngSwitchCase=\"PortTypes.File\" (change)=\"onFileChange($event)\" type=\"file\">\r\n        </ng-container>\r\n    </div>\r\n</div>\r\n\r\n"

/***/ }),

/***/ "./src/app/shared/components/parameter-viewer/procedure-input-viewer/procedure-input-viewer.component.scss":
/*!*****************************************************************************************************************!*\
  !*** ./src/app/shared/components/parameter-viewer/procedure-input-viewer/procedure-input-viewer.component.scss ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".container {\n  display: block;\n  margin: 5px 0px 0px 5px;\n  width: 100%; }\n\n.container--parameter {\n  display: inline-block;\n  flex-direction: row;\n  flex-wrap: wrap;\n  bottom: 0px;\n  padding-bottom: 5px;\n  border-bottom: 1px solid #efefef;\n  border-left: 1px solid #efefef;\n  width: 100%; }\n\n.container--input {\n  display: inline-flex;\n  flex-direction: row; }\n\ninput {\n  color: #505050;\n  background-color: gainsboro;\n  max-width: 96%;\n  border: none;\n  border-bottom: 1px solid #505050;\n  margin-left: 5px;\n  vertical-align: bottom; }\n\ninput.disabled-input {\n    border-bottom: none; }\n\n.input-const-name {\n  min-width: 100px; }\n\n.parameter__name {\n  display: inline-block;\n  flex-direction: row;\n  flex-wrap: wrap;\n  width: 100px; }\n\nmat-slider {\n  width: 300px; }\n"

/***/ }),

/***/ "./src/app/shared/components/parameter-viewer/procedure-input-viewer/procedure-input-viewer.component.ts":
/*!***************************************************************************************************************!*\
  !*** ./src/app/shared/components/parameter-viewer/procedure-input-viewer/procedure-input-viewer.component.ts ***!
  \***************************************************************************************************************/
/*! exports provided: ProcedureInputViewerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProcedureInputViewerComponent", function() { return ProcedureInputViewerComponent; });
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


var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
ctx.font = '13px Arial';
var ProcedureInputViewerComponent = /** @class */ (function () {
    function ProcedureInputViewerComponent() {
        this.delete = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.PortTypes = _models_port__WEBPACK_IMPORTED_MODULE_1__["InputType"];
    }
    ProcedureInputViewerComponent.prototype.editOptions = function () { };
    ProcedureInputViewerComponent.prototype.onFileChange = function (event) {
        this.prod.args[this.prod.argCount - 1].value = event.target.files[0];
    };
    ProcedureInputViewerComponent.prototype.displayConstName = function () {
        var val = this.prod.args[this.prod.argCount - 2].value;
        if (!val) {
            return 'undefined :';
        }
        if (val.substring(0, 1) === '"' || val.substring(0, 1) === '\'') {
            val = val.substring(1, val.length - 1);
        }
        return val.replace(/_/g, ' ') + ':';
    };
    ProcedureInputViewerComponent.prototype.inputSize = function (val, defaultVal) {
        if (val === undefined || val === '') {
            return ctx.measureText(defaultVal).width + 5;
        }
        return ctx.measureText(val).width + 5;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], ProcedureInputViewerComponent.prototype, "prod", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ProcedureInputViewerComponent.prototype, "delete", void 0);
    ProcedureInputViewerComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'procedure-input-viewer',
            template: __webpack_require__(/*! ./procedure-input-viewer.component.html */ "./src/app/shared/components/parameter-viewer/procedure-input-viewer/procedure-input-viewer.component.html"),
            styles: [__webpack_require__(/*! ./procedure-input-viewer.component.scss */ "./src/app/shared/components/parameter-viewer/procedure-input-viewer/procedure-input-viewer.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], ProcedureInputViewerComponent);
    return ProcedureInputViewerComponent;
}());



/***/ }),

/***/ "./src/app/shared/decorators/index.ts":
/*!********************************************!*\
  !*** ./src/app/shared/decorators/index.ts ***!
  \********************************************/
/*! exports provided: ModuleAware, ModuleDocAware, ProcedureTypesAware, ViewerTypesAware, PortTypesAware */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _module_aware_decorator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./module-aware.decorator */ "./src/app/shared/decorators/module-aware.decorator.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ModuleAware", function() { return _module_aware_decorator__WEBPACK_IMPORTED_MODULE_0__["ModuleAware"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ModuleDocAware", function() { return _module_aware_decorator__WEBPACK_IMPORTED_MODULE_0__["ModuleDocAware"]; });

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
/*! exports provided: ModuleAware, ModuleDocAware */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ModuleAware", function() { return ModuleAware; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ModuleDocAware", function() { return ModuleDocAware; });
/* harmony import */ var _modules__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @modules */ "./src/app/core/modules/index.ts");
//import * as doc from '@assets/typedoc-json/doc.json';
var doc = __webpack_require__(/*! @assets/typedoc-json/doc.json */ "./src/assets/typedoc-json/doc.json");

var docs;
var module_list = [];
// todo: bug fix for defaults
function extract_params(func) {
    var fnStr = func.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, '');
    var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).split(','); // .match( /([^\s,]+)/g);
    if (result === null || result[0] === '') {
        result = [];
    }
    var final_result = result.map(function (r) {
        r = r.trim();
        var r_value = r.split('=');
        if (r_value.length === 1) {
            return { name: r_value[0].trim(), value: undefined, default: 0 };
        }
        else {
            return { name: r_value[0].trim(), value: undefined, default: 0 };
        }
    });
    var hasReturn = true;
    if (fnStr.indexOf('return') === -1 || fnStr.indexOf('return;') !== -1) {
        hasReturn = false;
    }
    return [final_result, hasReturn];
}
function ModuleAware(constructor) {
    if (module_list.length === 0) {
        for (var m_name in _modules__WEBPACK_IMPORTED_MODULE_0__) {
            if (m_name[0] === '_') {
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
    }
    constructor.prototype.Modules = module_list;
}
function ModuleDocAware(constructor) {
    if (!docs) {
        docs = {};
        for (var _i = 0, _a = doc.children; _i < _a.length; _i++) {
            var mod = _a[_i];
            var modName = mod.name.split('/');
            modName = modName[modName.length - 1];
            if (modName.substr(0, 1) === '"' || modName.substr(0, 1) === "'") {
                modName = modName.substr(1, modName.length - 2);
            }
            else {
                modName = modName.substr(0, modName.length - 1);
            }
            if (modName.substr(0, 1) === '_' || modName === 'index') {
                continue;
            }
            var moduleDoc = {};
            for (var _b = 0, _c = mod.children; _b < _c.length; _b++) {
                var func = _c[_b];
                var fn = {};
                fn['name'] = func.name;
                fn['module'] = modName;
                if (!func['signatures']) {
                    continue;
                }
                if (func['signatures'][0].comment) {
                    var cmmt = func['signatures'][0].comment;
                    fn['description'] = cmmt.shortText;
                    if (cmmt.tags) {
                        for (var _d = 0, _e = cmmt.tags; _d < _e.length; _d++) {
                            var fnTag = _e[_d];
                            if (fnTag.tag === 'summary') {
                                fn['summary'] = fnTag.text;
                            }
                        }
                    }
                    fn['returns'] = cmmt.returns;
                    if (fn['returns']) {
                        fn['returns'] = fn['returns'].trim();
                    }
                }
                fn['parameters'] = [];
                if (func['signatures'][0].parameters) {
                    for (var _f = 0, _g = func['signatures'][0].parameters; _f < _g.length; _f++) {
                        var param = _g[_f];
                        var namecheck = true;
                        for (var systemVarName in _modules__WEBPACK_IMPORTED_MODULE_0__["_parameterTypes"]) {
                            if (param.name === _modules__WEBPACK_IMPORTED_MODULE_0__["_parameterTypes"][systemVarName]) {
                                namecheck = false;
                                break;
                            }
                        }
                        if (!namecheck) {
                            continue;
                        }
                        var pr = {};
                        pr['name'] = param.name;
                        if (param.comment) {
                            pr['description'] = param.comment.shortText || param.comment.text;
                        }
                        if (param.type.type === 'array') {
                            pr['type'] = param.type.elementType.name + "[]";
                        }
                        else if (param.type.type === 'intrinsic') {
                            pr['type'] = param.type.name;
                        }
                        else if (param.type.type === 'reference') {
                            pr['type'] = param.type.name;
                        }
                        else {
                            /**
                             * TODO: Update param type here
                             */
                            console.log('param type requires updating:', param.type);
                            pr['type'] = param.type.type;
                        }
                        fn['parameters'].push(pr);
                    }
                }
                moduleDoc[func.name] = fn;
            }
            docs[modName] = moduleDoc;
        }
    }
    constructor.prototype.ModuleDoc = docs;
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
 *  Adding this to an HTML5 input element
 *  allows for the file being read to be converted into a Mobius
 *  Flowchart
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
            reader.readAsText(f, 'UTF-8');
            var ins_1 = this;
            reader.onload = function (evt) {
                var fileString = evt.target['result'];
                ins_1.load_flowchart_from_string(fileString);
            };
            reader.onerror = function (evt) {
                console.log('Error reading file');
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
        // let jsonData: {language: string, flowchart: JSON, modules: JSON};
        // let flowchart: any; // IFlowchart;
        try {
            var data = circular_json__WEBPACK_IMPORTED_MODULE_1__["parse"](fileString);
            this.load.emit(data);
            // this.data.flowchart = data.flowchart;
            // this.data.modules = data.modules;
            // this.data.language = data.language;
            // this.update_code_generator(CodeFactory.getCodeGenerator(data["language"]));
            // TODO: this.update_modules();
            // flowchart = FlowchartReader.read_flowchart_from_data(data["flowchart"]);
            // TODO: select a node
        }
        catch (err) {
            console.error('Mob-file-reader error', err);
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
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostListener"])('change'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], MbFileReaderDirective.prototype, "onFileChange", null);
    MbFileReaderDirective = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"])({
            selector: '[mbFileReader]'
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
/*! exports provided: AutogrowDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AutogrowDirective", function() { return AutogrowDirective; });
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

var AutogrowDirective = /** @class */ (function () {
    function AutogrowDirective(el) {
        this.el = el;
    }
    AutogrowDirective.prototype.onKeyUp = function () {
        this.el.nativeElement.style.height = '5px';
        this.el.nativeElement.style.height = (this.el.nativeElement.scrollHeight) + 'px';
    };
    AutogrowDirective.prototype.onKeyDown = function () {
        this.el.nativeElement.style.height = '5px';
        this.el.nativeElement.style.height = (this.el.nativeElement.scrollHeight) + 'px';
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostListener"])('keyup'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], AutogrowDirective.prototype, "onKeyUp", null);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostListener"])('keydown'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], AutogrowDirective.prototype, "onKeyDown", null);
    AutogrowDirective = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"])({
            selector: '[autogrow]'
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]])
    ], AutogrowDirective);
    return AutogrowDirective;
}());



/***/ }),

/***/ "./src/app/shared/directives/textarea/index.ts":
/*!*****************************************************!*\
  !*** ./src/app/shared/directives/textarea/index.ts ***!
  \*****************************************************/
/*! exports provided: AutogrowDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _autogrow_directive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./autogrow.directive */ "./src/app/shared/directives/textarea/autogrow.directive.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AutogrowDirective", function() { return _autogrow_directive__WEBPACK_IMPORTED_MODULE_0__["AutogrowDirective"]; });




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
            var codeStr, args, prefix, _a, constName, val, argVals, _i, _b, arg, argVal, argValues, fnCall, argsVals, i, arg, r, fn, _c, _d, p, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (prod.enabled === false) {
                            return [2 /*return*/, ['']];
                        }
                        prod.hasError = false;
                        codeStr = [];
                        args = prod.args;
                        prefix = args.hasOwnProperty('0') && existingVars.indexOf(args[0].value) === -1 ? 'let ' : '';
                        codeStr.push('');
                        if (addProdArr && prod.type !== _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].Else && prod.type !== _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].Elseif) {
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
                            case _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].Constant: return [3 /*break*/, 9];
                            case _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].Return: return [3 /*break*/, 11];
                            case _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].Function: return [3 /*break*/, 12];
                            case _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].Imported: return [3 /*break*/, 19];
                        }
                        return [3 /*break*/, 24];
                    case 1:
                        if (args[0].value.indexOf('__params__') !== -1 || args[1].value.indexOf('__params__') !== -1) {
                            throw new Error('Unexpected Identifier');
                        }
                        codeStr.push("" + prefix + args[0].value + " = " + args[1].value + ";");
                        if (prefix === 'let ') {
                            existingVars.push(args[0].value);
                        }
                        return [3 /*break*/, 24];
                    case 2:
                        if (args[0].value.indexOf('__params__') !== -1) {
                            throw new Error('Unexpected Identifier');
                        }
                        codeStr.push("if (" + args[0].value + "){");
                        return [3 /*break*/, 24];
                    case 3:
                        codeStr.push("else {");
                        return [3 /*break*/, 24];
                    case 4:
                        if (args[0].value.indexOf('__params__') !== -1) {
                            throw new Error('Unexpected Identifier');
                        }
                        codeStr.push("else if(" + args[0].value + "){");
                        return [3 /*break*/, 24];
                    case 5:
                        // codeStr.push(`for (${prefix} ${args[0].value} of [...Array(${args[1].value}).keys()]){`);
                        if (args[0].value.indexOf('__params__') !== -1) {
                            throw new Error('Unexpected Identifier');
                        }
                        codeStr.push("for (" + prefix + " " + args[0].value + " of " + args[1].value + "){");
                        return [3 /*break*/, 24];
                    case 6:
                        if (args[0].value.indexOf('__params__') !== -1) {
                            throw new Error('Unexpected Identifier');
                        }
                        codeStr.push("while (" + args[0].value + "){");
                        return [3 /*break*/, 24];
                    case 7:
                        codeStr.push("break;");
                        return [3 /*break*/, 24];
                    case 8:
                        codeStr.push("continue;");
                        return [3 /*break*/, 24];
                    case 9:
                        constName = args[0].value;
                        if (constName.substring(0, 1) === '"' || constName.substring(0, 1) === '\'') {
                            constName = args[0].value.substring(1, args[0].value.length - 1);
                        }
                        return [4 /*yield*/, CodeUtils.getStartInput(args[1].value || args[1].default, prod.meta.inputMode)];
                    case 10:
                        val = _g.sent();
                        codeStr.push("__params__['constants']['" + constName + "'] = " + val + ";");
                        return [3 /*break*/, 24];
                    case 11:
                        codeStr.push("if (" + args[0].value + " > __params__['model'].length) { return __params__['model']; }");
                        codeStr.push("return __params__['model'][" + args[0].value + "].value;");
                        return [3 /*break*/, 24];
                    case 12:
                        argVals = [];
                        _i = 0, _b = args.slice(1);
                        _g.label = 13;
                    case 13:
                        if (!(_i < _b.length)) return [3 /*break*/, 17];
                        arg = _b[_i];
                        if (!(arg.name === _modules__WEBPACK_IMPORTED_MODULE_4__["_parameterTypes"].input)) return [3 /*break*/, 15];
                        return [4 /*yield*/, CodeUtils.getStartInput(arg.value || arg.default, prod.meta.inputMode)];
                    case 14:
                        argVal = _g.sent();
                        argVals.push(argVal);
                        return [3 /*break*/, 16];
                    case 15:
                        if (arg.value && arg.value.indexOf('__params__') !== -1) {
                            throw new Error('Unexpected Identifier');
                        }
                        if (arg.name === _modules__WEBPACK_IMPORTED_MODULE_4__["_parameterTypes"].constList) {
                            argVals.push('__params__.constants');
                            return [3 /*break*/, 16];
                        }
                        if (arg.name === _modules__WEBPACK_IMPORTED_MODULE_4__["_parameterTypes"].model) {
                            argVals.push('__params__.model');
                            return [3 /*break*/, 16];
                        }
                        if (arg.value && arg.value.substring(0, 1) === '@') {
                            if (prod.meta.module.toUpperCase() === 'QUERY'
                                && prod.meta.name.toUpperCase() === 'SET'
                                && arg.name.toUpperCase() === 'STATEMENT') {
                                argVals.push('"' + arg.value.replace(/"/g, '\'') + '"');
                                return [3 /*break*/, 16];
                            }
                            argVals.push('__modules__.Query.get( __params__.model,"' + arg.value.replace(/"/g, '\'') + '" )');
                            return [3 /*break*/, 16];
                        }
                        // else if (arg.name.indexOf('__') != -1) return '"'+args[args.indexOf(arg)+1].value+'"';
                        argVals.push(arg.value);
                        _g.label = 16;
                    case 16:
                        _i++;
                        return [3 /*break*/, 13];
                    case 17:
                        argValues = argVals.join(',');
                        return [4 /*yield*/, argValues];
                    case 18:
                        _g.sent();
                        fnCall = "__modules__." + prod.meta.module + "." + prod.meta.name + "( " + argValues + " )";
                        if (prod.meta.module.toUpperCase() === 'OUTPUT') {
                            codeStr.push("return " + fnCall + ";");
                        }
                        else if (args[0].name === '__none__') {
                            codeStr.push(fnCall + ";");
                        }
                        else {
                            codeStr.push("" + prefix + args[0].value + " = " + fnCall + ";");
                            if (prefix === 'let ') {
                                existingVars.push(args[0].value);
                            }
                        }
                        return [3 /*break*/, 24];
                    case 19:
                        argsVals = [];
                        i = 1;
                        _g.label = 20;
                    case 20:
                        if (!(i < args.length)) return [3 /*break*/, 23];
                        arg = args[i];
                        // args.slice(1).map((arg) => {
                        if (arg.type.toString() !== _models_port__WEBPACK_IMPORTED_MODULE_1__["InputType"].URL.toString()) {
                            argsVals.push(arg.value);
                        }
                        return [4 /*yield*/, CodeUtils.getStartInput(arg.value, _models_port__WEBPACK_IMPORTED_MODULE_1__["InputType"].URL)];
                    case 21:
                        r = _g.sent();
                        argsVals.push(r);
                        _g.label = 22;
                    case 22:
                        i++;
                        return [3 /*break*/, 20];
                    case 23:
                        argsVals = argsVals.join(',');
                        fn = prod.meta.name + "(__params__, " + argsVals + " )";
                        codeStr.push("" + prefix + args[0].value + " = " + fn + ";");
                        if (prefix === 'let ') {
                            existingVars.push(args[0].value);
                        }
                        return [3 /*break*/, 24];
                    case 24:
                        if (!prod.children) return [3 /*break*/, 29];
                        _c = 0, _d = prod.children;
                        _g.label = 25;
                    case 25:
                        if (!(_c < _d.length)) return [3 /*break*/, 28];
                        p = _d[_c];
                        _f = (_e = codeStr).concat;
                        return [4 /*yield*/, CodeUtils.getProcedureCode(p, existingVars, addProdArr)];
                    case 26:
                        codeStr = _f.apply(_e, [_g.sent()]);
                        _g.label = 27;
                    case 27:
                        _c++;
                        return [3 /*break*/, 25];
                    case 28:
                        codeStr.push("}");
                        _g.label = 29;
                    case 29:
                        if (prod.print) {
                            codeStr.push("console.log('" + prod.args[0].value + ": '+ " + prod.args[0].value + ");");
                            // codeStr.push(`wait(5000);`);
                        }
                        return [2 /*return*/, codeStr];
                }
            });
        });
    };
    CodeUtils.getStartInput = function (val, inputMode) {
        return __awaiter(this, void 0, void 0, function () {
            var result, p, p;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(inputMode.toString() === _models_port__WEBPACK_IMPORTED_MODULE_1__["InputType"].URL.toString())) return [3 /*break*/, 2];
                        if (val.indexOf('dropbox') !== -1) {
                            val = val.replace('www', 'dl').replace('dl=0', 'dl=1');
                        }
                        p = new Promise(function (resolve) {
                            var request = new XMLHttpRequest();
                            request.open('GET', val);
                            request.onload = function () {
                                resolve(request.responseText);
                            };
                            request.send();
                        });
                        return [4 /*yield*/, p];
                    case 1:
                        result = _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        if (!(inputMode.toString() === _models_port__WEBPACK_IMPORTED_MODULE_1__["InputType"].File.toString())) return [3 /*break*/, 4];
                        p = new Promise(function (resolve) {
                            var reader = new FileReader();
                            reader.onload = function () {
                                resolve(reader.result);
                            };
                            reader.readAsText(val);
                        });
                        return [4 /*yield*/, p];
                    case 3:
                        result = _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, result];
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
                    var fl = circular_json__WEBPACK_IMPORTED_MODULE_3__["parse"](request.responseText);
                    observer.next(fl);
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
        var result = _modules__WEBPACK_IMPORTED_MODULE_4__["_parameterTypes"]['newFn']();
        for (var _i = 0, models_1 = models; _i < models_1.length; _i++) {
            var model = models_1[_i];
            _modules__WEBPACK_IMPORTED_MODULE_4__["_parameterTypes"]['mergeFn'](result, model);
        }
        return result;
    };
    CodeUtils.getInputValue = function (inp, node) {
        var input;
        if (node.type === 'start' || inp.edges.length === 0) {
            input = _modules__WEBPACK_IMPORTED_MODULE_4__["_parameterTypes"]['newFn']();
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
                        if (node.type === 'start') {
                            codeStr.push('__params__.constants = {};\n');
                        }
                        codeStr.push("__modules__." + _modules__WEBPACK_IMPORTED_MODULE_4__["_parameterTypes"].preprocess + "( __params__.model);");
                        _i = 0, _a = node.procedure;
                        _d.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        prod = _a[_i];
                        if (node.type === 'start' && !addProdArr) {
                            return [3 /*break*/, 6];
                        }
                        _c = (_b = codeStr).concat;
                        return [4 /*yield*/, CodeUtils.getProcedureCode(prod, varsDefined, addProdArr)];
                    case 4:
                        codeStr = _c.apply(_b, [_d.sent()]);
                        _d.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        if (node.type === 'end' && node.procedure.length > 0) {
                            codeStr.push('}');
                            return [2 /*return*/, ['{'].concat(codeStr)];
                            // return `{\n${codeStr.join('\n')}\n}`;
                        }
                        else {
                            codeStr.push("__modules__." + _modules__WEBPACK_IMPORTED_MODULE_4__["_parameterTypes"].postprocess + "( __params__.model);");
                        }
                        codeStr.push('return __params__.model;');
                        return [2 /*return*/, codeStr];
                }
            });
        });
    };
    CodeUtils.getFunctionString = function (func) {
        return __awaiter(this, void 0, void 0, function () {
            var fullCode, fnCode, _i, _a, node, code;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        fullCode = '';
                        fnCode = "function " + func.name + "(__mainParams__," + func.args.map(function (arg) { return arg.name; }).join(',') + ")" +
                            ("{\nvar merged;\nlet __params__={\"currentProcedure\": [''],\"model\":__modules__." + _modules__WEBPACK_IMPORTED_MODULE_4__["_parameterTypes"]['new'] + "()};\n");
                        _i = 0, _a = func.flowchart.nodes;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        node = _a[_i];
                        return [4 /*yield*/, CodeUtils.getNodeCode(node, false)];
                    case 2:
                        code = _b.sent();
                        code = '{\n' + code.join('\n') + '\n}';
                        fullCode += "function " + node.id + "(__params__, " + func.args.map(function (arg) { return arg.name; }).join(',') + ")" + code + "\n\n";
                        if (node.type === 'start') {
                            // fnCode += `let result_${node.id} = ${node.id}(__params__);\n`
                            fnCode += "let result_" + node.id + " = __params__.model;\n";
                        }
                        else if (node.input.edges.length === 1) {
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
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        fnCode += '}\n\n';
                        fullCode += fnCode;
                        // console.log(fullCode)
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

/***/ "./src/app/shared/models/flowchart/flowchart.interface.ts":
/*!****************************************************************!*\
  !*** ./src/app/shared/models/flowchart/flowchart.interface.ts ***!
  \****************************************************************/
/*! exports provided: canvasSize */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "canvasSize", function() { return canvasSize; });
//
//
// The flowchart is the basic datastructure in Mobius - it is essentially a linked-list.
// It also
//
var canvasSize = 10000;


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
/* harmony import */ var _flowchart_interface__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./flowchart.interface */ "./src/app/shared/models/flowchart/flowchart.interface.ts");
/* harmony import */ var _models_node__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @models/node */ "./src/app/shared/models/node/index.ts");


var FlowchartUtils = /** @class */ (function () {
    function FlowchartUtils() {
    }
    FlowchartUtils.newflowchart = function () {
        var startNode = _models_node__WEBPACK_IMPORTED_MODULE_1__["NodeUtils"].getStartNode();
        startNode.position = { x: _flowchart_interface__WEBPACK_IMPORTED_MODULE_0__["canvasSize"] * 1.07 / 2, y: _flowchart_interface__WEBPACK_IMPORTED_MODULE_0__["canvasSize"] / 2 };
        var middleNode = _models_node__WEBPACK_IMPORTED_MODULE_1__["NodeUtils"].getNewNode();
        middleNode.position = { x: _flowchart_interface__WEBPACK_IMPORTED_MODULE_0__["canvasSize"] * 1.07 / 2, y: 200 + _flowchart_interface__WEBPACK_IMPORTED_MODULE_0__["canvasSize"] / 2 };
        var endNode = _models_node__WEBPACK_IMPORTED_MODULE_1__["NodeUtils"].getEndNode();
        endNode.position = { x: _flowchart_interface__WEBPACK_IMPORTED_MODULE_0__["canvasSize"] * 1.07 / 2, y: 400 + _flowchart_interface__WEBPACK_IMPORTED_MODULE_0__["canvasSize"] / 2 };
        var startMid = {
            source: startNode.output,
            target: middleNode.input,
            selected: false
        };
        startNode.output.edges = [startMid];
        middleNode.input.edges = [startMid];
        var midEnd = {
            source: middleNode.output,
            target: endNode.input,
            selected: false
        };
        middleNode.output.edges = [midEnd];
        endNode.input.edges = [midEnd];
        middleNode.enabled = true;
        endNode.enabled = true;
        var flw = {
            name: 'new_flowchart',
            description: '',
            language: 'js',
            meta: {
                selected_nodes: [2]
            },
            nodes: [startNode, middleNode, endNode],
            edges: [startMid, midEnd],
            functions: [],
            ordered: true
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
        var startNode;
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
                if (node.type !== 'start' && node.input.edges.length === 0) {
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
/*! exports provided: canvasSize, FlowchartUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _flowchart_interface__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./flowchart.interface */ "./src/app/shared/models/flowchart/flowchart.interface.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "canvasSize", function() { return _flowchart_interface__WEBPACK_IMPORTED_MODULE_0__["canvasSize"]; });

/* harmony import */ var _flowchart_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./flowchart.utils */ "./src/app/shared/models/flowchart/flowchart.utils.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FlowchartUtils", function() { return _flowchart_utils__WEBPACK_IMPORTED_MODULE_1__["FlowchartUtils"]; });





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
            name: 'Node',
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
    NodeUtils.getStartNode = function () {
        var node = NodeUtils.getNewNode();
        node.enabled = true;
        node.name = 'Start';
        node.type = 'start';
        return node;
    };
    NodeUtils.getEndNode = function () {
        var node = NodeUtils.getNewNode();
        node.name = 'End';
        node.type = 'end';
        return node;
    };
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
                if (pr.children) {
                    NodeUtils.rearrangeSelected(prodList, tempList, pr.children);
                }
                continue;
            }
            var i = 0;
            while (i < tempList.length) {
                if (tempList[i] === pr) {
                    prodList.push(pr);
                    tempList.splice(i, 1);
                    break;
                }
                i += 1;
            }
            if (pr.children) {
                NodeUtils.rearrangeSelected(prodList, tempList, pr.children);
            }
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
                var list = void 0;
                if (node.state.procedure[0].parent) {
                    prod.parent = node.state.procedure[0].parent;
                    list = prod.parent.children;
                }
                else {
                    list = node.procedure;
                }
                for (var index in list) {
                    if (list[index].selected) {
                        list.splice(parseInt(index, 10) + 1, 0, prod);
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
                prod.args = [
                    { name: 'var_name', value: undefined, default: undefined },
                    { name: 'value', value: undefined, default: undefined }
                ];
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
            case _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].Constant:
                prod.argCount = 2;
                prod.meta = { module: 'Input', name: 'Constant', inputMode: _models_port__WEBPACK_IMPORTED_MODULE_1__["InputType"].SimpleInput, description: undefined };
                prod.args = [
                    { name: 'const_name', value: undefined, default: 0 },
                    { name: '__input__', value: undefined, default: 0 }
                ];
                break;
            case _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].Return:
                prod.meta = { module: 'Output', name: 'Return', description: undefined };
                prod.argCount = 1;
                prod.args = [{ name: 'index', value: undefined, default: 0 }];
                break;
            case _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].Function:
                if (!data) {
                    throw Error('No function data');
                }
                prod.meta = { module: data.module, name: data.name };
                prod.argCount = data.argCount + 1;
                var returnArg = { name: 'var_name', value: undefined, default: undefined };
                if (!data.hasReturn) {
                    returnArg = { name: '__none__', value: undefined, default: undefined };
                }
                prod.args = [returnArg].concat(data.args);
                break;
            case _models_procedure__WEBPACK_IMPORTED_MODULE_0__["ProcedureTypes"].Imported:
                prod.meta = { module: data.module, name: data.name };
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
    ProcedureTypes[ProcedureTypes["Constant"] = 10] = "Constant";
    ProcedureTypes[ProcedureTypes["Return"] = 11] = "Return";
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
/* harmony import */ var angular_split__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angular-split */ "./node_modules/angular-split/fesm5/angular-split.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _directives_filesys__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./directives/filesys */ "./src/app/shared/directives/filesys/index.ts");
/* harmony import */ var _directives_textarea__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./directives/textarea */ "./src/app/shared/directives/textarea/index.ts");
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
/* harmony import */ var _model_viewers_model_viewers_container_module__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../model-viewers/model-viewers-container.module */ "./src/app/model-viewers/model-viewers-container.module.ts");
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
/*
 *  This module is to be imported ONLY by the AppModule
 *  Contains all global services
 *
 */

// @angular stuff





// app directives


// app components











// app model viewers

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
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            providers: [],
            declarations: [
                _directives_filesys__WEBPACK_IMPORTED_MODULE_6__["MbFileReaderDirective"],
                _directives_textarea__WEBPACK_IMPORTED_MODULE_7__["AutogrowDirective"],
                _components_execute_execute_component__WEBPACK_IMPORTED_MODULE_8__["ExecuteComponent"],
                _components_not_found_not_found_component__WEBPACK_IMPORTED_MODULE_9__["PageNotFoundComponent"],
                _components_navigation_navigation_component__WEBPACK_IMPORTED_MODULE_10__["NavigationComponent"],
                _components_header_header_component__WEBPACK_IMPORTED_MODULE_11__["HeaderComponent"],
                _components_add_components_add_node_component__WEBPACK_IMPORTED_MODULE_13__["AddNodeComponent"], _components_add_components_add_input_component__WEBPACK_IMPORTED_MODULE_14__["AddInputComponent"], _components_add_components_add_output_component__WEBPACK_IMPORTED_MODULE_12__["AddOutputComponent"],
                _components_parameter_viewer_parameter_viewer_component__WEBPACK_IMPORTED_MODULE_15__["ParameterViewerComponent"], _components_parameter_viewer_input_port_viewer_input_port_viewer_component__WEBPACK_IMPORTED_MODULE_16__["InputPortViewerComponent"], _components_parameter_viewer_procedure_input_viewer_procedure_input_viewer_component__WEBPACK_IMPORTED_MODULE_17__["ProcedureInputViewerComponent"],
                _components_file__WEBPACK_IMPORTED_MODULE_18__["NewFileComponent"], _components_file__WEBPACK_IMPORTED_MODULE_18__["SaveFileComponent"], _components_file__WEBPACK_IMPORTED_MODULE_18__["LoadFileComponent"]
            ],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_5__["MatSliderModule"], _angular_material__WEBPACK_IMPORTED_MODULE_5__["MatCheckboxModule"],
                _model_viewers_model_viewers_container_module__WEBPACK_IMPORTED_MODULE_19__["DataViewersContainer"],
                angular_split__WEBPACK_IMPORTED_MODULE_0__["AngularSplitModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_5__["MatMenuModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_5__["MatIconModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_5__["MatButtonModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_5__["MatExpansionModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_5__["MatSelectModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_5__["MatFormFieldModule"],
            ],
            entryComponents: [],
            exports: [
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_5__["MatMenuModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_5__["MatIconModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_5__["MatButtonModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_5__["MatSliderModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_5__["MatExpansionModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_5__["MatSelectModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_5__["MatFormFieldModule"],
                _model_viewers_model_viewers_container_module__WEBPACK_IMPORTED_MODULE_19__["DataViewersContainer"],
                angular_split__WEBPACK_IMPORTED_MODULE_0__["AngularSplitModule"],
                _directives_filesys__WEBPACK_IMPORTED_MODULE_6__["MbFileReaderDirective"],
                _directives_textarea__WEBPACK_IMPORTED_MODULE_7__["AutogrowDirective"],
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
        __param(0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Optional"])()), __param(0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["SkipSelf"])()),
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
/*! exports provided: ViewEditorComponent, ViewEditorModule, ViewFlowchartComponent, ViewFlowchartModule, ViewGalleryComponent, ViewGalleryModule, ViewDashboardComponent, ViewDashboardModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _view_editor_view_editor_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./view-editor/view-editor.component */ "./src/app/views/view-editor/view-editor.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ViewEditorComponent", function() { return _view_editor_view_editor_component__WEBPACK_IMPORTED_MODULE_0__["ViewEditorComponent"]; });

/* harmony import */ var _view_editor_view_editor_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./view-editor/view-editor.module */ "./src/app/views/view-editor/view-editor.module.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ViewEditorModule", function() { return _view_editor_view_editor_module__WEBPACK_IMPORTED_MODULE_1__["ViewEditorModule"]; });

/* harmony import */ var _view_flowchart_view_flowchart_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./view-flowchart/view-flowchart.component */ "./src/app/views/view-flowchart/view-flowchart.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ViewFlowchartComponent", function() { return _view_flowchart_view_flowchart_component__WEBPACK_IMPORTED_MODULE_2__["ViewFlowchartComponent"]; });

/* harmony import */ var _view_flowchart_view_flowchart_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./view-flowchart/view-flowchart.module */ "./src/app/views/view-flowchart/view-flowchart.module.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ViewFlowchartModule", function() { return _view_flowchart_view_flowchart_module__WEBPACK_IMPORTED_MODULE_3__["ViewFlowchartModule"]; });

/* harmony import */ var _view_gallery_view_gallery_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./view-gallery/view-gallery.component */ "./src/app/views/view-gallery/view-gallery.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ViewGalleryComponent", function() { return _view_gallery_view_gallery_component__WEBPACK_IMPORTED_MODULE_4__["ViewGalleryComponent"]; });

/* harmony import */ var _view_gallery_view_gallery_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./view-gallery/view-gallery.module */ "./src/app/views/view-gallery/view-gallery.module.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ViewGalleryModule", function() { return _view_gallery_view_gallery_module__WEBPACK_IMPORTED_MODULE_5__["ViewGalleryModule"]; });

/* harmony import */ var _view_dashboard_view_dashboard_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./view-dashboard/view-dashboard.component */ "./src/app/views/view-dashboard/view-dashboard.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ViewDashboardComponent", function() { return _view_dashboard_view_dashboard_component__WEBPACK_IMPORTED_MODULE_6__["ViewDashboardComponent"]; });

/* harmony import */ var _view_dashboard_view_dashboard_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./view-dashboard/view-dashboard.module */ "./src/app/views/view-dashboard/view-dashboard.module.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ViewDashboardModule", function() { return _view_dashboard_view_dashboard_module__WEBPACK_IMPORTED_MODULE_7__["ViewDashboardModule"]; });











/***/ }),

/***/ "./src/app/views/view-dashboard/view-dashboard-routing.module.ts":
/*!***********************************************************************!*\
  !*** ./src/app/views/view-dashboard/view-dashboard-routing.module.ts ***!
  \***********************************************************************/
/*! exports provided: ViewDashboardRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewDashboardRoutingModule", function() { return ViewDashboardRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _view_dashboard_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./view-dashboard.component */ "./src/app/views/view-dashboard/view-dashboard.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var routes = [
    {
        path: '',
        component: _view_dashboard_component__WEBPACK_IMPORTED_MODULE_2__["ViewDashboardComponent"],
        children: []
    }
];
var ViewDashboardRoutingModule = /** @class */ (function () {
    function ViewDashboardRoutingModule() {
    }
    ViewDashboardRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], ViewDashboardRoutingModule);
    return ViewDashboardRoutingModule;
}());



/***/ }),

/***/ "./src/app/views/view-dashboard/view-dashboard.component.html":
/*!********************************************************************!*\
  !*** ./src/app/views/view-dashboard/view-dashboard.component.html ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class='container'>\r\n    <as-split direction=\"horizontal\" (dragEnd)='setSplit($event)'>\r\n        <as-split-area [size]=\"100 - dataService.splitVal\">\r\n            <div class='container__header'>\r\n\r\n                <!-- top left tab menu  -->\r\n                <div class=\"tab\">\r\n                    <button class='btn-tab' [class.active]='router.url==\"/gallery\"' [routerLink]=\"'/gallery'\">Gallery</button>\r\n                    <button class='btn-tab' [class.active]='router.url==\"/dashboard\"' [routerLink]=\"'/dashboard'\">Dashboard</button>\r\n                    <button class='btn-tab' [class.active]='router.url==\"/flowchart\"' [routerLink]=\"'/flowchart'\">Flowchart</button>\r\n                    <!--\r\n                    <button class='btn' [class.active]='false' (click)='updateView(\"editor\")'>Procedures</button>\r\n                    -->\r\n                </div>\r\n\r\n                <!-- hidden components (new file, save file, loaf file) for the dropdown menu-->\r\n                <div style=\"display: none;\">\r\n                    <file-new></file-new>\r\n                    <file-save></file-save>\r\n                    <file-load></file-load>        \r\n                </div>\r\n\r\n                <!-- top right dropdown menu -->\r\n                <div class=\"dropmenu\">\r\n                    <!-- execute button -->\r\n                    <div>\r\n                        <execute></execute>\r\n                    </div>\r\n                    <!-- dropdown menu for new file, save file, loaf file-->\r\n                    <div>\r\n                        <button class='btn' mat-icon-button [matMenuTriggerFor]=\"menu\">\r\n                            <mat-icon>more_vert</mat-icon>\r\n                        </button>\r\n                        <mat-menu #menu=\"matMenu\">\r\n                            <button  mat-menu-item onclick=\"document.getElementById('newfile').click();\"\r\n                            title=\"Create New Flowchart\">\r\n                                <mat-icon>rotate_left</mat-icon>\r\n                                <span>New File</span>\r\n                            </button>\r\n                            <button mat-menu-item onclick=\"document.getElementById('savefile').click();\"\r\n                            title=\"Save Flowchart File to Computer\">\r\n                                <mat-icon>save_alt</mat-icon>\r\n                                <span>Save File</span>\r\n                            </button>\r\n                            <button mat-menu-item onclick=\"document.getElementById('file-input').click();\"\r\n                            title=\"Load Flowchart File from Computer\">\r\n                                <mat-icon>launch</mat-icon>\r\n                                <span>Load File</span>\r\n                            </button>\r\n                        </mat-menu>\r\n                    </div>\r\n                    \r\n                </div>\r\n            </div>\r\n            <!-- viewchild content -->\r\n            <div class='content__panel'>\r\n                <parameter-viewer [flowchart]='dataService.flowchart' [startNode]='dataService.flowchart.nodes[0]' [endNode]='getEndNode()'></parameter-viewer>\r\n            </div>\r\n        </as-split-area>\r\n\r\n        <as-split-area [size]=\"dataService.splitVal\">\r\n            <!-- data viewers panel -->\r\n            <div class='content__viewer' >\r\n                <model-viewers-container [data]='viewerData()' [helpView]='helpView'></model-viewers-container>\r\n            </div>\r\n        </as-split-area>\r\n        \r\n    </as-split>\r\n\r\n</div>\r\n    \r\n\r\n"

/***/ }),

/***/ "./src/app/views/view-dashboard/view-dashboard.component.scss":
/*!********************************************************************!*\
  !*** ./src/app/views/view-dashboard/view-dashboard.component.scss ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "as-split-area {\n  overflow: hidden !important; }\n\n.container {\n  position: relative;\n  overflow: auto;\n  height: 100%;\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around; }\n\n.container h1, .container h2, .container h3, .container h4, .container h5, .container h6, .container p {\n    margin: 0px;\n    padding: 0px; }\n\n.container .container__header {\n    flex: 0 1 auto;\n    min-height: 35px;\n    display: flex;\n    flex-direction: row;\n    justify-content: space-between;\n    padding: 0px 0px 0px 15px;\n    background-color: #ccc;\n    border-bottom: 3px solid #eeeeee;\n    line-height: 35px;\n    font-size: 18px;\n    font-weight: 600;\n    text-align: center;\n    /* tab styling */\n    /* dropdown menu styling */ }\n\n.container .container__header .tab {\n      border: 2px;\n      overflow: hidden;\n      background-color: #ccc; }\n\n.container .container__header .tab button {\n      display: inline-block;\n      vertical-align: bottom;\n      background-color: inherit;\n      color: #505050;\n      border: none;\n      outline: none;\n      cursor: pointer;\n      padding: 8px 10px;\n      transition: 0.3s;\n      font-size: 14px; }\n\n.container .container__header .tab button:hover {\n      color: blue; }\n\n.container .container__header .tab button.active {\n      background-color: #ccc;\n      color: #000096;\n      font-weight: 600;\n      border-color: #222 !important; }\n\n.container .container__header .dropmenu {\n      display: inline-flex; }\n\n.container .container__content {\n    flex-grow: 1;\n    height: 0px;\n    border: 2px solid #3F4651;\n    overflow: auto; }\n\n.container .container__footer {\n    text-align: center;\n    font-size: 12px;\n    line-height: 18px;\n    background-color: #3F4651;\n    color: #E7BF00; }\n\n.content__panel {\n  background-color: gainsboro;\n  height: 95%;\n  overflow: hidden auto; }\n\n.content__viewer {\n  background-color: gainsboro;\n  height: 100%;\n  overflow: auto; }\n\nul.nav {\n  margin: 0px;\n  padding: 0px; }\n\nli.link {\n  display: inline;\n  border: 2px solid gray;\n  border-radius: 4px;\n  margin: 5px 5px 0px 0px;\n  padding: 5px;\n  text-transform: uppercase;\n  line-height: 12px;\n  font-weight: 600;\n  cursor: pointer;\n  font-size: 12px; }\n\nli.link:hover {\n  background-color: gray;\n  color: white; }\n\nbutton.btn {\n  display: inline-block;\n  vertical-align: middle;\n  margin: 0px 0px 0px 0px;\n  font-size: 12px;\n  line-height: 10px;\n  height: 30px;\n  border: none;\n  border-radius: 4px;\n  background-color: transparent;\n  color: #505050; }\n\nbutton.btn:hover {\n  color: blue; }\n\n.active {\n  background-color: #222;\n  color: white;\n  border-color: #222 !important; }\n"

/***/ }),

/***/ "./src/app/views/view-dashboard/view-dashboard.component.ts":
/*!******************************************************************!*\
  !*** ./src/app/views/view-dashboard/view-dashboard.component.ts ***!
  \******************************************************************/
/*! exports provided: ViewDashboardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewDashboardComponent", function() { return ViewDashboardComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @services */ "./src/app/core/services/index.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ViewDashboardComponent = /** @class */ (function () {
    function ViewDashboardComponent(dataService, router) {
        this.dataService = dataService;
        this.router = router;
    }
    ViewDashboardComponent.prototype.selectNode = function (node_index) {
        if (typeof (node_index) === 'number') {
            this.dataService.flowchart.meta.selected_nodes = [node_index];
        }
    };
    ViewDashboardComponent.prototype.getEndNode = function () {
        for (var _i = 0, _a = this.dataService.flowchart.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            if (node.type === 'end') {
                return node;
            }
        }
    };
    ViewDashboardComponent.prototype.viewerData = function () {
        var node = this.dataService.flowchart.nodes[this.dataService.flowchart.meta.selected_nodes[0]];
        if (!node) {
            return '';
        }
        if (node.type === 'output') {
            return node.input.value;
        }
        return node.output.value;
    };
    ViewDashboardComponent.prototype.setSplit = function (e) { this.dataService.splitVal = e.sizes[1]; };
    ViewDashboardComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'view-dashboard',
            template: __webpack_require__(/*! ./view-dashboard.component.html */ "./src/app/views/view-dashboard/view-dashboard.component.html"),
            styles: [__webpack_require__(/*! ./view-dashboard.component.scss */ "./src/app/views/view-dashboard/view-dashboard.component.scss")]
        }),
        __metadata("design:paramtypes", [_services__WEBPACK_IMPORTED_MODULE_1__["DataService"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], ViewDashboardComponent);
    return ViewDashboardComponent;
}());



/***/ }),

/***/ "./src/app/views/view-dashboard/view-dashboard.module.ts":
/*!***************************************************************!*\
  !*** ./src/app/views/view-dashboard/view-dashboard.module.ts ***!
  \***************************************************************/
/*! exports provided: ViewDashboardModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewDashboardModule", function() { return ViewDashboardModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @shared/shared.module */ "./src/app/shared/shared.module.ts");
/* harmony import */ var _view_dashboard_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./view-dashboard-routing.module */ "./src/app/views/view-dashboard/view-dashboard-routing.module.ts");
/* harmony import */ var _view_dashboard_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./view-dashboard.component */ "./src/app/views/view-dashboard/view-dashboard.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ViewDashboardModule = /** @class */ (function () {
    function ViewDashboardModule() {
    }
    ViewDashboardModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            declarations: [
                _view_dashboard_component__WEBPACK_IMPORTED_MODULE_4__["ViewDashboardComponent"]
            ],
            exports: [
                _view_dashboard_component__WEBPACK_IMPORTED_MODULE_4__["ViewDashboardComponent"]
            ],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__["SharedModule"],
                _view_dashboard_routing_module__WEBPACK_IMPORTED_MODULE_3__["ViewDashboardRoutingModule"]
            ],
            entryComponents: [],
            providers: []
        }),
        __metadata("design:paramtypes", [])
    ], ViewDashboardModule);
    return ViewDashboardModule;
}());



/***/ }),

/***/ "./src/app/views/view-editor/parameter-editor/parameter-editor.component.html":
/*!************************************************************************************!*\
  !*** ./src/app/views/view-editor/parameter-editor/parameter-editor.component.html ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class='flowchart-info' *ngIf=\"node.type=='start'\">\r\n    <input id='flowchart-name' [(ngModel)]='flowchart.name' placeholder=\"flowchart name\" size={{flowchart.name?.length||12}}>\r\n    <textarea autogrow\r\n    id='flowchart-desc' [(ngModel)]='flowchart.description' placeholder=\"flowchart description\"></textarea>\r\n</div>\r\n<hr *ngIf=\"node.type=='start'\">\r\n<div class='container--input'>\r\n    <procedure-input-editor *ngFor=\"let prod of node.procedure\" [prod]=\"prod\" ></procedure-input-editor>\r\n</div>\r\n\r\n<!--\r\n<section *ngIf=\"node.type != 'end'\">\r\n    <panel-header [node]='node' [title]=\"'inputs'\"></panel-header>\r\n    <div class='container--input'>\r\n        <input-port-editor [port]=\"node?.input\" ></input-port-editor>\r\n    </div>\r\n</section>\r\n<section *ngIf=\"node.type != 'start'\">\r\n    <panel-header [node]='node' [title]=\"'output'\"></panel-header>\r\n    <div class='container--output'>\r\n        <output-port-editor [port]=\"node?.output\" ></output-port-editor>\r\n    </div>\r\n</section>\r\n-->\r\n"

/***/ }),

/***/ "./src/app/views/view-editor/parameter-editor/parameter-editor.component.scss":
/*!************************************************************************************!*\
  !*** ./src/app/views/view-editor/parameter-editor/parameter-editor.component.scss ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "div[class^=\"container--\"] {\n  display: flex;\n  flex-direction: column;\n  padding-left: 10px;\n  margin: 0px 0px; }\n\n.flowchart-info {\n  display: -ms-grid;\n  display: grid;\n  padding-left: 10px;\n  margin: 5px 0px;\n  width: 100%; }\n\ninput {\n  color: #505050;\n  background-color: #fafafa;\n  border: none;\n  width: -webkit-fit-content;\n  width: -moz-fit-content;\n  width: fit-content;\n  border-left: 1px solid gainsboro;\n  border-bottom: 1px solid gainsboro;\n  padding: 5px;\n  margin-left: 3px;\n  font-weight: 600;\n  font-style: italic;\n  min-width: 40px;\n  max-width: 300px;\n  font-size: 12px;\n  vertical-align: bottom; }\n\ninput.disabled-input {\n    border-bottom: none; }\n\ntextarea {\n  color: #505050;\n  background-color: #fafafa;\n  border: none;\n  border-left: 1px solid gainsboro;\n  border-bottom: 1px solid gainsboro;\n  padding-left: 5px;\n  font-family: sans-serif;\n  font-size: 12px;\n  margin: 10px 0px 5px 3px;\n  width: 90%;\n  resize: none; }\n\nhr {\n  width: inherit;\n  border-top: 2px solid gainsboro; }\n"

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

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
ctx.font = '12px sans-serif';
var ParameterEditorComponent = /** @class */ (function () {
    function ParameterEditorComponent() {
    }
    ParameterEditorComponent.prototype.ngAfterViewInit = function () {
        var textarea = document.getElementById('flowchart-desc');
        if (!textarea) {
            return;
        }
        var desc = this.flowchart.description.split('\n');
        var textareaWidth = textarea.getBoundingClientRect().width;
        var lineCount = desc.length;
        for (var _i = 0, desc_1 = desc; _i < desc_1.length; _i++) {
            var line = desc_1[_i];
            lineCount += Math.floor(ctx.measureText(line).width / textareaWidth) + 1;
        }
        textarea.style.height = lineCount * 7.5 + 'px';
    };
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

module.exports = "<div class='container container--parameter' *ngIf='prod.meta?.module==\"Input\"'>\r\n    <input class='input-const-name' [class.disabled-input]='true' value='{{prod.args[prod.argCount-2].value||\"Undefined\"}}:'\r\n    [style.width.px]='inputSize(prod.args[prod.argCount-2].value,\"Undefined\") + 10' disabled>\r\n\r\n    <select name={{prod.ID}}_type [(ngModel)]=\"prod.meta.inputMode\" tabindex=\"-1\">\r\n        <option \r\n            *ngFor=\"let ptype of PortTypesArr\" \r\n            [value]=\"PortTypes[ptype]\" \r\n            [selected]=\"prod.meta.inputMode == ptype\">{{ptype}}</option>\r\n    </select>\r\n    <ng-container [ngSwitch]=\"prod.meta.inputMode\" >\r\n        <input *ngSwitchCase=\"PortTypes.SimpleInput\" [(ngModel)]='prod.args[prod.argCount-1].default' placeholder='Default Value' \r\n        [style.width.px]='inputSize(prod.args[prod.argCount-1].default,\"Default Value\")'>\r\n\r\n        <div class='div--slider' *ngSwitchCase=\"PortTypes.Slider\">\r\n            <input [(ngModel)]='prod.args[prod.argCount-1].min' placeholder='Min'\r\n            [style.width.px]='inputSize(prod.args[prod.argCount-1].min,\"Min\")'>\r\n            <input [(ngModel)]='prod.args[prod.argCount-1].max' placeholder='Max'\r\n            [style.width.px]='inputSize(prod.args[prod.argCount-1].max,\"Max\")'>\r\n            <mat-slider\r\n                [(ngModel)]='prod.args[prod.argCount-1].default'\r\n                thumbLabel\r\n                tickInterval=\"auto\"\r\n                min={{prod.args[prod.argCount-1].min||0}}\r\n                max={{prod.args[prod.argCount-1].max||100}}></mat-slider>\r\n            <input [class.disabled-input]='true' [(ngModel)]='prod.args[prod.argCount-1].default'\r\n            [style.width.px]='inputSize(prod.args[prod.argCount-1].default,\"\")' disabled>\r\n\r\n        </div>\r\n        <input *ngSwitchCase=\"PortTypes.Checkbox\" [(ngModel)]='prod.args[prod.argCount-1].default' name='prod.args[prod.argCount-1].default' type=\"checkbox\">\r\n        <input *ngSwitchCase=\"PortTypes.URL\" [(ngModel)]='prod.args[prod.argCount-1].default' name='prod.args[prod.argCount-1].default' placeholder='Default URL'\r\n        [style.width.px]='inputSize(prod.args[prod.argCount-1].default,\"Default URL\")'>\r\n        <input *ngSwitchCase=\"PortTypes.File\" (change)=\"onFileChange($event)\" type=\"file\">\r\n    </ng-container>\r\n    <div>\r\n        <input class='inp--desc' placeholder='Constant Description' [(ngModel)]='prod.meta.description'\r\n        [style.width.px]='inputSize(prod.meta.description,\"Constant Description\")'>\r\n    </div>\r\n\r\n</div>\r\n<div class='container container--parameter' *ngIf='prod.meta.module==\"Output\"'>\r\n    <input class='inp--desc' placeholder='Return Description' [(ngModel)]='prod.meta.description'\r\n    [style.width.px]='inputSize(prod.meta.description,\"Return Description\")'>\r\n</div>"

/***/ }),

/***/ "./src/app/views/view-editor/parameter-editor/procedure-input-editor/procedure-input-editor.component.scss":
/*!*****************************************************************************************************************!*\
  !*** ./src/app/views/view-editor/parameter-editor/procedure-input-editor/procedure-input-editor.component.scss ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".container {\n  margin: 5px 0px; }\n\n.container--parameter {\n  display: inline-block;\n  flex-direction: row;\n  flex-wrap: wrap;\n  color: #505050;\n  vertical-align: bottom;\n  padding-bottom: 5px;\n  border-bottom: 1px solid gainsboro;\n  border-left: 1px solid gainsboro;\n  width: 100%; }\n\nselect {\n  color: #505050;\n  background-color: #fafafa;\n  border: 1px solid #505050; }\n\ninput {\n  color: #505050;\n  background-color: #fafafa;\n  border: none;\n  border-bottom: 1px solid #505050;\n  margin-left: 5px;\n  max-width: 95%;\n  vertical-align: bottom; }\n\ninput.disabled-input {\n    border-bottom: none; }\n\n.input-const-name {\n  min-width: 100px; }\n\n.slider-val {\n  color: #505050;\n  resize: horizontal;\n  size: 2;\n  min-width: 1px;\n  max-width: 300px;\n  width: 20px; }\n\n.container--input {\n  display: inline-flex;\n  flex-direction: row; }\n\n.div--slider {\n  display: inline-flex;\n  flex-direction: row; }\n\n.inp--desc {\n  font-size: 13px;\n  padding-top: 5px;\n  max-width: 95%; }\n\n.parameter__name {\n  width: 100px;\n  height: auto;\n  word-wrap: break-word; }\n\nmat-slider {\n  width: 300px; }\n"

/***/ }),

/***/ "./src/app/views/view-editor/parameter-editor/procedure-input-editor/procedure-input-editor.component.ts":
/*!***************************************************************************************************************!*\
  !*** ./src/app/views/view-editor/parameter-editor/procedure-input-editor/procedure-input-editor.component.ts ***!
  \***************************************************************************************************************/
/*! exports provided: ProcedureInputEditorComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProcedureInputEditorComponent", function() { return ProcedureInputEditorComponent; });
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
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
ctx.font = '13px Arial';
var ProcedureInputEditorComponent = /** @class */ (function () {
    function ProcedureInputEditorComponent() {
        this.PortTypes = _models_port__WEBPACK_IMPORTED_MODULE_1__["InputType"];
        this.PortTypesArr = keys.slice(keys.length / 2);
    }
    ProcedureInputEditorComponent.prototype.ngAfterViewInit = function () {
        // console.log(this.prod);
    };
    ProcedureInputEditorComponent.prototype.editOptions = function () { };
    ProcedureInputEditorComponent.prototype.onFileChange = function (event) {
        this.prod.args[this.prod.argCount - 1].default = event.target.files[0];
    };
    ProcedureInputEditorComponent.prototype.inputSize = function (val, defaultVal) {
        if (val === undefined || val === '') {
            return ctx.measureText(defaultVal).width + 5;
        }
        return ctx.measureText(val).width + 5;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], ProcedureInputEditorComponent.prototype, "prod", void 0);
    ProcedureInputEditorComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'procedure-input-editor',
            template: __webpack_require__(/*! ./procedure-input-editor.component.html */ "./src/app/views/view-editor/parameter-editor/procedure-input-editor/procedure-input-editor.component.html"),
            styles: [__webpack_require__(/*! ./procedure-input-editor.component.scss */ "./src/app/views/view-editor/parameter-editor/procedure-input-editor/procedure-input-editor.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], ProcedureInputEditorComponent);
    return ProcedureInputEditorComponent;
}());



/***/ }),

/***/ "./src/app/views/view-editor/procedure-item/procedure-item.component.html":
/*!********************************************************************************!*\
  !*** ./src/app/views/view-editor/procedure-item/procedure-item.component.html ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class='container--line' \r\n    [class.selected]=\"data.selected\"\r\n    [class.error]=\"data.hasError\"\r\n    [class.disabled]=\"!data.enabled\"\r\n    [ngSwitch]=\"data.type\"\r\n    (click)='emitSelect($event, data)'>\r\n    <div class='container--item' >\r\n        <!-- Variable Assignment Template -->\r\n        <div class='line--item' *ngSwitchCase=\"ProcedureTypes.Variable\">\r\n            <input class='input--var'\r\n                [ngModel]='data.args[0].value'\r\n                (ngModelChange)='data.args[0].value=varMod($event)'\r\n                name='data.args[0].name'\r\n                placeholder={{data.args[0].name}}>  \r\n            = \r\n            <input \r\n                class='input--arg'\r\n                [ngModel]='data.args[1].value'\r\n                (ngModelChange)='data.args[1].value=argMod($event)'\r\n                name='data.args[1].name'\r\n                placeholder={{data.args[1].name}}\r\n                [style.width.px]='inputSize(data.args[1].value||data.args[1].name)'>  \r\n            </div>\r\n\r\n        <!-- IF Template -->\r\n        <div class='line--item hasChildren' *ngSwitchCase=\"ProcedureTypes.If\">\r\n            <div class='function-text'>\r\n                If\r\n            </div>\r\n            ( <input class='input--arg'\r\n                    (cut)='stopProp($event)' (paste)='stopProp($event)'\r\n                    [(ngModel)]='data.args[0].value'\r\n                    name='data.args[0].name'\r\n                    placeholder={{data.args[0].name}}\r\n                    [style.width.px]='inputSize(data.args[0].value||data.args[0].name)'\r\n                    >  \r\n                    )\r\n\r\n        </div>\r\n\r\n        <!-- ELSEIF Template -->\r\n        <div class='line--item hasChildren' *ngSwitchCase=\"ProcedureTypes.Elseif\">\r\n            <div class='function-text'>\r\n                Else if\r\n            </div>\r\n            \r\n        \r\n        ( <input class='input--arg'\r\n                (cut)='stopProp($event)' (paste)='stopProp($event)' \r\n                [(ngModel)]='data.args[0].value'\r\n                name='data.args[0].name'\r\n                placeholder={{data.args[0].name}}\r\n                [style.width.px]='inputSize(data.args[0].value||data.args[0].name)'\r\n                >  \r\n                )\r\n        </div>\r\n\r\n        <!-- ELSE Template -->\r\n        <div class='line--item hasChildren' *ngSwitchCase=\"ProcedureTypes.Else\">\r\n            <div class='function-text'>\r\n                Else\r\n            </div>\r\n        </div>\r\n\r\n        <!-- BREAK Template -->\r\n        <div class='line--item' *ngSwitchCase=\"ProcedureTypes.Break\">\r\n            <div class='function-text'>\r\n                Break\r\n            </div>\r\n        </div>\r\n\r\n        <!-- CONTINUE Template -->\r\n        <div class='line--item' *ngSwitchCase=\"ProcedureTypes.Continue\">\r\n            <div class='function-text'>\r\n                Continue\r\n            </div>\r\n        </div>\r\n\r\n\r\n    <!-- FOREACH Template -->\r\n        <div class='line--item hasChildren' *ngSwitchCase=\"ProcedureTypes.Foreach\">\r\n                <div class='function-text'>\r\n                    For\r\n                </div>\r\n                <input class='input--arg'\r\n                    (cut)='stopProp($event)' (paste)='stopProp($event)'\r\n                    [(ngModel)]='data.args[0].value'\r\n                    name='data.args[0].name'\r\n                    placeholder={{data.args[0].name}}\r\n                    [style.width.px]='inputSize(data.args[0].value||data.args[0].name)'\r\n                    >  \r\n                <div class='function-text'>\r\n                    in\r\n                </div>\r\n                <input class='input--arg'\r\n                    (cut)='stopProp($event)' (paste)='stopProp($event)'\r\n                    [(ngModel)]='data.args[1].value'\r\n                    name='data.args[1].name'\r\n                    placeholder={{data.args[1].name}}\r\n                    [style.width.px]='inputSize(data.args[1].value||data.args[1].name)'\r\n                    >  \r\n                    \r\n        </div>\r\n\r\n        <!-- WHILE Template -->\r\n        <div class='line--item hasChildren' *ngSwitchCase=\"ProcedureTypes.While\">\r\n            <div class='function-text'>\r\n                While\r\n            </div>\r\n            <input class='input--arg' \r\n                    (cut)='stopProp($event)' (paste)='stopProp($event)'\r\n                    [(ngModel)]='data.args[0].value'\r\n                    name='data.args[0].name'\r\n                    placeholder={{data.args[0].name}}\r\n                    [style.width.px]='inputSize(data.args[0].value||data.args[0].name)'\r\n                    >  \r\n\r\n        </div>\r\n\r\n        <!-- Constant (Only visible in start node) Template -->\r\n        <div class='line--item' *ngSwitchCase=\"ProcedureTypes.Constant\">\r\n            <div class='function-text'>Constant</div>\r\n\r\n            <input class='input--arg' \r\n                    (cut)='stopProp($event)' (paste)='stopProp($event)'\r\n                    [(ngModel)]='data.args[0].value'\r\n                    name='data.args[0].name'\r\n                    placeholder={{data.args[0].name}}\r\n                    [style.width.px]='inputSize(data.args[0].value||data.args[0].name)'\r\n                    >  \r\n\r\n        </div>\r\n        \r\n        <!-- Return (Only visible in End node) Template -->\r\n        <div class='line--item' *ngSwitchCase=\"ProcedureTypes.Return\">\r\n            <div class='function-text'>Return</div>\r\n\r\n            <input class='input--arg' \r\n                    (cut)='stopProp($event)' (paste)='stopProp($event)'\r\n                    [(ngModel)]='data.args[0].value'\r\n                    name='data.args[0].name'\r\n                    placeholder={{data.args[0].name}}\r\n                    [style.width.px]='inputSize(data.args[0].value||data.args[0].name)'\r\n                    >  \r\n        </div>\r\n        \r\n\r\n        \r\n        <!-- Function Template -->\r\n        <div class='line--item' *ngSwitchCase=\"ProcedureTypes.Function\">\r\n            <ng-container *ngIf=\"data.meta.module.toUpperCase() !='OUTPUT' && data.args[0].name !=='__none__'\">\r\n                <input class='input--var'\r\n                [ngModel]='data.args[0].value'\r\n                (ngModelChange)='data.args[0].value=varMod($event)'\r\n                (cut)='stopProp($event)' \r\n                (paste)='stopProp($event)'\r\n                placeholder={{data.args[0].name}}>  \r\n                = \r\n\r\n            </ng-container>\r\n            <div class='function-text'>{{data.meta.module}}.{{data.meta.name}} </div>\r\n\r\n            <ng-container *ngFor='let p of data.args.slice(1);let i=index'>\r\n                <!--\r\n                <input *ngIf=\"p.name.toUpperCase() !== '__MODEL__'; else text_template\" \r\n                \r\n                (cut)='stopProp($event)' \r\n                (paste)='stopProp($event)' \r\n                [(ngModel)]='p.value' \r\n                placeholder={{p.name}}>    \r\n                \r\n                <ng-template #text_template>\r\n                    model,\r\n                </ng-template>\r\n                -->\r\n\r\n                <input *ngIf=\"p.name.indexOf('__') == -1\" \r\n                        class='input--arg' \r\n                        (cut)='stopProp($event)' \r\n                        (paste)='stopProp($event)' \r\n                        [(ngModel)]='p.value' \r\n                        placeholder={{p.name}}\r\n                        [style.width.px]='inputSize(p.value||p.name)'\r\n                        >    \r\n                \r\n\r\n            </ng-container>\r\n\r\n        </div>\r\n\r\n        <!-- Imported Function Template -->\r\n        <div class='line--item' *ngSwitchCase=\"ProcedureTypes.Imported\">\r\n            <input class='input--var'\r\n                    [ngModel]='data.args[0].value'\r\n                    (ngModelChange)='data.args[0].value=varMod($event)'\r\n                    (cut)='stopProp($event)' (paste)='stopProp($event)'\r\n                    placeholder={{data.args[0].name}}>  \r\n            = \r\n            <div class='function-text'>{{data.meta.name}} </div> \r\n            \r\n            <ng-container *ngFor='let p of data.args.slice(1);let i=index'>\r\n                <input class='input--arg' \r\n                        (cut)='stopProp($event)' (paste)='stopProp($event)' \r\n                        [(ngModel)]='p.value' \r\n                        placeholder={{p.name}}\r\n                        [style.width.px]='inputSize(p.value||p.name)'>    \r\n            </ng-container>\r\n            \r\n\r\n        </div>\r\n\r\n\r\n        <!-- delete button-->\r\n        <button class='btn' mat-icon-button title=\"Delete Procedure\" (click)=\"emitDelete()\" tabindex=\"-1\">\r\n            <mat-icon class='icon'>delete_outline</mat-icon>\r\n        </button>\r\n        <!-- Disable button-->\r\n        <button class='btn' mat-icon-button title=\"Disable Procedure\" [class.highlighted]='!data.enabled' (click)='markDisabled()' tabindex=\"-1\">\r\n            <mat-icon class='icon'>tv_off</mat-icon>\r\n        </button>\r\n        <!-- Print button-->\r\n        <button *ngIf='canBePrinted()' class='btn' mat-icon-button title=\"Print Result In Console\" [class.highlighted]='data.print' (click)='markPrint()' tabindex=\"-1\">\r\n            <mat-icon class='icon'>print</mat-icon>\r\n        </button>\r\n        <!-- help button-->\r\n        <button *ngIf='haveHelpText()' class='btn' mat-icon-button title=\"Help\" tabindex=\"-1\" (click)='emitHelpText(undefined)'>\r\n            <mat-icon class='icon'>help</mat-icon>\r\n        </button>\r\n    </div>\r\n    <!-- list of child procedures (if the procedure has children) -->\r\n    <div *ngIf=\"data?.children\" class='container--nested'>\r\n        <procedure-item \r\n            *ngFor=\"let line of data?.children; let idx=index\" \r\n            [data]=\"line\"\r\n            (select)='selectChild($event, line)'\r\n            (delete)='deleteChild(idx)'\r\n            (helpText)='emitHelpText($event)'></procedure-item>\r\n    </div>\r\n\r\n\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/views/view-editor/procedure-item/procedure-item.component.scss":
/*!********************************************************************************!*\
  !*** ./src/app/views/view-editor/procedure-item/procedure-item.component.scss ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".container--nested {\n  padding-left: 0px; }\n\n.container--line {\n  margin: 8px 0px 2px 10px;\n  padding: 2px 0px 2px 2px;\n  border-bottom: 1px solid gainsboro;\n  border-left: 1px solid gainsboro;\n  color: #505050;\n  min-height: 22px;\n  opacity: 1; }\n\n.container--line.disabled {\n    opacity: 0.5; }\n\n.container--line.selected {\n    border: 1px solid #000096;\n    background-color: gainsboro; }\n\n.container--line.error {\n    border: 1px solid red; }\n\n.container--line .input--var {\n    width: 70px;\n    background-color: #fafafa;\n    border: none;\n    border-bottom: 1px solid #505050;\n    margin-right: 5px; }\n\n.container--line .input--arg {\n    resize: horizontal;\n    min-width: 1px;\n    max-width: 300px;\n    background-color: #fafafa;\n    border: none;\n    border-bottom: 1px solid #505050;\n    margin-left: 5px; }\n\n.container--line .input--arg.error {\n      border: 1px solid red; }\n\n.container--line input:focus {\n    border: 1px solid #000096; }\n\n.container--item {\n  margin: none;\n  padding: none;\n  border: none; }\n\n.btn {\n  height: 24px;\n  width: 24px;\n  float: right;\n  background-color: transparent;\n  border: none;\n  display: none;\n  color: #777; }\n\n.btn.highlighted {\n    background-color: #ff9696; }\n\n.container--item:hover .btn {\n  display: block; }\n\n.icon {\n  vertical-align: top;\n  font-size: 20px; }\n\n.line--item {\n  display: inline-block;\n  color: #505050; }\n\n/*\r\n.hasChildren::before{\r\n    content: '\\25B6';\r\n    position: absolute;\r\n    left: 3px;\r\n    font-size: 8px;\r\n}\r\n*/\n\n.function-text {\n  display: inline-block;\n  white-space: normal;\n  font-style: italic;\n  color: #be8c1e;\n  font-weight: 600; }\n"

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
var ctx = canvas.getContext('2d');
ctx.font = '13px Arial';
var ProcedureItemComponent = /** @class */ (function () {
    function ProcedureItemComponent() {
        this.delete = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.select = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.copied = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.pasteOn = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.helpText = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.ProcedureTypes = _models_procedure__WEBPACK_IMPORTED_MODULE_1__["ProcedureTypes"];
    }
    ProcedureItemComponent.prototype.ngAfterViewInit = function () {
        var elements = document.getElementsByClassName('input--arg');
        [].forEach.call(elements, function (el) {
            console.log(el);
        });
    };
    // delete this procedure
    ProcedureItemComponent.prototype.emitDelete = function () {
        this.delete.emit();
    };
    // select this procedure
    ProcedureItemComponent.prototype.emitSelect = function (event, procedure) {
        event.stopPropagation();
        this.select.emit({ 'ctrl': event.ctrlKey, 'prod': procedure });
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
        return (this.data.argCount > 0 && this.data.args[0].name === 'var_name');
    };
    ProcedureItemComponent.prototype.haveHelpText = function () {
        return (this.data.type === _models_procedure__WEBPACK_IMPORTED_MODULE_1__["ProcedureTypes"].Function || this.data.type === _models_procedure__WEBPACK_IMPORTED_MODULE_1__["ProcedureTypes"].Imported);
    };
    ProcedureItemComponent.prototype.emitHelpText = function ($event) {
        if ($event) {
            this.helpText.emit($event);
            return;
        }
        try {
            if (this.data.type === _models_procedure__WEBPACK_IMPORTED_MODULE_1__["ProcedureTypes"].Imported) {
                this.helpText.emit(this.data.meta.name);
                // this.helpText.emit(this.ModuleDoc[this.data.meta.module][this.data.meta.name]);
            }
            else {
                // @ts-ignore
                this.helpText.emit(this.ModuleDoc[this.data.meta.module][this.data.meta.name]);
            }
        }
        catch (ex) {
            this.helpText.emit('error');
        }
    };
    // stopPropagation to prevent cut/paste with input box focused
    ProcedureItemComponent.prototype.stopProp = function (event) {
        event.stopPropagation();
    };
    // modify variable input: replace space " " with underscore "_"
    ProcedureItemComponent.prototype.varMod = function (event) {
        if (!event) {
            return event;
        }
        var str = event.trim();
        str = str.replace(/ /g, '_');
        return str;
    };
    // modify argument input: check if input is valid
    ProcedureItemComponent.prototype.argMod = function (event) {
        return event;
        console.log(event);
        var string = event.trim();
        if (string.substring(0, 1) === '@' || (/^[a-zA-Z_$][0-9a-zA-Z_$]*/i).test(string)) {
            return event;
        }
        try {
            JSON.parse(string);
        }
        catch (ex) {
            console.log('.........', ex);
            // document.activeElement.style.error = true;
        }
        return event;
    };
    ProcedureItemComponent.prototype.inputSize = function (val) {
        return ctx.measureText(val).width + 5;
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
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ProcedureItemComponent.prototype, "helpText", void 0);
    ProcedureItemComponent = __decorate([
        _shared_decorators__WEBPACK_IMPORTED_MODULE_2__["ProcedureTypesAware"],
        _shared_decorators__WEBPACK_IMPORTED_MODULE_2__["ModuleDocAware"],
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

module.exports = "<ng-container *ngIf=\"nodeType == ''\">\r\n    <!-- basic functions: variable, if, else, else if, for, while, continue, break -->\r\n\r\n    <button id='basic-funcs' class=\"accordion\" \r\n    (click)='toggleAccordion(\"basic-funcs\")' >Basic</button>\r\n    <div class=\"panel\">\r\n        <ul class='toolset__basic'>\r\n            <ng-container *ngFor=\"let type of ProcedureTypesArr\">\r\n                <li *ngIf='type.toUpperCase() !== \"FUNCTION\" && type.toUpperCase() !== \"IMPORTED\"\r\n                && type.toUpperCase() !== \"CONSTANT\" && type.toUpperCase() !== \"RETURN\"'\r\n                class='tooltip'\r\n                (click)='add(ProcedureTypes[type])'> \r\n                    {{type}}\r\n                </li>\r\n            </ng-container>\r\n        </ul>\r\n    </div>\r\n\r\n    <!-- functions from core.modules -->\r\n    <ng-container *ngFor='let mod of Modules' >\r\n\r\n        <button id='{{mod.module}}' class=\"accordion\" \r\n        *ngIf='mod.module.toUpperCase() != \"INPUT\" && mod.module.toUpperCase() != \"OUTPUT\"'\r\n        (click)='toggleAccordion(mod.module)' >{{ mod.module }}</button>\r\n        <div class=\"panel\">\r\n            <ul class='toolset__functions--subset'>\r\n                <ng-container *ngFor='let fn of mod.functions'>\r\n                    <div class='tooltip' *ngIf='fn.name.substring(0,1)!=\"_\"'>\r\n                        <li \r\n                        (click)='add_function(fn)'> \r\n                            {{fn.name}} \r\n                        </li>\r\n                        <span class=\"tooltiptext\" *ngIf='ModuleDoc[mod.module] && ModuleDoc[mod.module][fn.name]'>\r\n                            <p class='funcDesc'>{{ModuleDoc[mod.module][fn.name].summary||ModuleDoc[mod.module][fn.name].description}}</p>\r\n                            <p *ngIf='ModuleDoc[mod.module][fn.name].parameters?.length > 0'><span>Parameters: </span></p>\r\n                            <p class='paramP' *ngFor='let param of ModuleDoc[mod.module][fn.name].parameters'><span>{{param.name}} - </span> {{param.description}}</p>\r\n                            <p *ngIf='ModuleDoc[mod.module][fn.name].returns'><span>Returns: </span> {{ModuleDoc[mod.module][fn.name].returns}}</p>\r\n                        </span>\r\n                    </div>\r\n                </ng-container>\r\n            </ul>\r\n        </div>\r\n    </ng-container>\r\n\r\n    <!-- imported functions -->\r\n    <ng-container>\r\n        <button id='imported' class=\"accordion\" \r\n        (click)='toggleAccordion(\"imported\")' >Imported</button>\r\n        <div class=\"panel\">\r\n            <ul class='toolset__functions--subset'>\r\n                <div class='tooltip' *ngFor='let fn of functions'>\r\n                    <li (click)='add_imported_function(fn)'> {{fn.name}} \r\n                        <button class='remove-btn' (click)='delete_imported_function(fn)'>\r\n                            <mat-icon class='remove-icon'>close</mat-icon>\r\n                        </button>\r\n                    </li>\r\n                    <span class=\"tooltiptext\">\r\n                        <p class='funcDesc'>{{fn.doc.description}}</p>\r\n                        <p *ngIf='fn.doc.parameters?.length > 0'><span>Parameters: </span></p>\r\n                        <p class='paramP' *ngFor='let param of fn.doc.parameters'><span>{{param.name}} - </span> {{param.description}}</p>\r\n                        <p *ngIf='fn.doc.returns'><span>Returns: </span> {{fn.doc.returns}}</p>\r\n                    </span>\r\n                </div>\r\n            </ul>\r\n            <br>\r\n            <input type=\"file\" id=\"selectedFile\" (change)=\"import_function($event)\" style=\"display: none;\" />\r\n            <button class='add-btn' onclick=\"document.getElementById('selectedFile').click();\" title=\"Import Function from File\">\r\n                <mat-icon class='add-icon'>open_in_browser</mat-icon>\r\n            </button>\r\n        </div>\r\n    </ng-container>\r\n</ng-container>\r\n\r\n<!-- functions for input nodes -->\r\n<div id='toolset_inp' class = 'toolset' *ngIf=\"nodeType == 'start'\">\r\n    <div class='toolset__functions'>\r\n        <section *ngFor='let type of ProcedureTypesArr' >\r\n            <div *ngIf='type.toUpperCase() == \"CONSTANT\"'>\r\n                <ul class='toolset__functions--subset'>\r\n                    <li (click)='add(ProcedureTypes[type])'> {{type}} </li>\r\n                </ul>\r\n            </div>\r\n        </section>\r\n        <!--\r\n        <section *ngFor='let mod of Modules' >\r\n            <div *ngIf='mod.module.toUpperCase() == \"INPUT\"'>\r\n                <ul class='toolset__functions--subset'>\r\n                    <li *ngFor='let fn of mod.functions' (click)='add_function(fn)'> {{fn.name}} </li>\r\n                </ul>\r\n            </div>\r\n        </section>\r\n        -->\r\n    </div>\r\n</div>\r\n\r\n<!-- functions for output nodes -->\r\n<div id='toolset_inp' class = 'toolset' *ngIf=\"nodeType == 'end'\">\r\n    <div class='toolset__functions' *ngIf=\"hasProd===false\">\r\n        <!--\r\n        <section *ngFor='let type of ProcedureTypesArr' >\r\n            <div *ngIf='type.toUpperCase() == \"RETURN\"'>\r\n                <ul class='toolset__functions--subset'>\r\n                    <li (click)='add(ProcedureTypes[type])'> {{type}} </li>\r\n                </ul>\r\n            </div>\r\n        </section>\r\n        -->\r\n        <section *ngFor='let mod of Modules' >\r\n            <div *ngIf='mod.module.toUpperCase() == \"OUTPUT\"'>\r\n                <ul class='toolset__functions--subset'>\r\n                    <li *ngFor='let fn of mod.functions' (click)='add_function(fn)'> {{fn.name}} </li>\r\n                </ul>\r\n            </div>\r\n        </section>\r\n    </div>\r\n</div>\r\n"

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
            return { name: arg.name, value: arg.value, type: arg.type };
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
                                // create function and documentation of the function
                                var funcs = [];
                                var funcName = fl.name.replace(/\ /g, '_');
                                var documentation = {
                                    name: funcName,
                                    module: 'Imported',
                                    description: fl.description,
                                    summary: fl.description,
                                    parameters: [],
                                    returns: undefined
                                };
                                var func = {
                                    flowchart: {
                                        name: fl.name,
                                        nodes: fl.nodes,
                                        edges: fl.edges
                                    },
                                    name: funcName,
                                    module: 'Imported',
                                    doc: documentation
                                };
                                func.argCount = fl.nodes[0].procedure.length;
                                func.args = fl.nodes[0].procedure.map(function (prod) {
                                    documentation.parameters.push({
                                        name: prod.args[prod.argCount - 2].value.substring(1, prod.args[prod.argCount - 2].value.length - 1),
                                        description: prod.meta.description
                                    });
                                    return {
                                        name: prod.args[prod.argCount - 2].value.substring(1, prod.args[prod.argCount - 2].value.length - 1),
                                        default: prod.args[prod.argCount - 1].default,
                                        value: undefined,
                                        type: prod.meta.inputMode,
                                    };
                                });
                                if (!func.argCount) {
                                    resolve('error');
                                }
                                // go through the nodes
                                for (var _i = 0, _a = fl.nodes; _i < _a.length; _i++) {
                                    var node = _a[_i];
                                    if (node.type === 'end') {
                                        if (node.procedure.length > 0) {
                                            documentation.returns = node.procedure[0].meta.description;
                                        }
                                    }
                                }
                                // add func and all the imported functions of the imported flowchart to funcs
                                funcs.push(func);
                                for (var _b = 0, _c = fl.functions; _b < _c.length; _b++) {
                                    var i = _c[_b];
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
                        document.getElementById('selectedFile').value = '';
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
        // acc = document.getElementsByClassName("accordion");
        acc.classList.toggle('active');
        var panel = acc.nextElementSibling;
        if (panel.style.display === 'block') {
            panel.style.display = 'none';
        }
        else {
            panel.style.display = 'block';
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
        _shared_decorators__WEBPACK_IMPORTED_MODULE_3__["ModuleDocAware"],
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

/***/ "./src/app/views/view-editor/view-editor-routing.module.ts":
/*!*****************************************************************!*\
  !*** ./src/app/views/view-editor/view-editor-routing.module.ts ***!
  \*****************************************************************/
/*! exports provided: ViewEditorRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewEditorRoutingModule", function() { return ViewEditorRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _view_editor_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./view-editor.component */ "./src/app/views/view-editor/view-editor.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var routes = [
    {
        path: '',
        component: _view_editor_component__WEBPACK_IMPORTED_MODULE_2__["ViewEditorComponent"],
        children: [
        // {
        //   path: '',
        //   loadChildren: '../../mobius-viewer/mobius-viewer.module#MobiusViewerModule',
        // }
        ]
    }
];
var ViewEditorRoutingModule = /** @class */ (function () {
    function ViewEditorRoutingModule() {
    }
    ViewEditorRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], ViewEditorRoutingModule);
    return ViewEditorRoutingModule;
}());



/***/ }),

/***/ "./src/app/views/view-editor/view-editor.component.html":
/*!**************************************************************!*\
  !*** ./src/app/views/view-editor/view-editor.component.html ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class='container'>\r\n    <as-split direction=\"horizontal\" (dragEnd)='setSplit($event)'>\r\n        <as-split-area [size]=\"100 - dataService.splitVal\">\r\n            <div class='container__header'>\r\n\r\n                <!-- top left tab menu  -->\r\n                <div class=\"tab\">\r\n                    <button class='btn-tab' [class.active]='router.url==\"/gallery\"' [routerLink]=\"'/gallery'\">Gallery</button>\r\n                    <button class='btn-tab' [class.active]='router.url==\"/dashboard\"' [routerLink]=\"'/dashboard'\">Dashboard</button>\r\n                    <button class='btn-tab' [class.active]='router.url==\"/flowchart\"' [routerLink]=\"'/flowchart'\">Flowchart</button>\r\n                    <!--\r\n                    <button class='btn' [class.active]='false' (click)='updateView(\"editor\")'>Procedures</button>\r\n                    -->\r\n                </div>\r\n\r\n                <!-- hidden components (new file, save file, loaf file) for the dropdown menu-->\r\n                <div style=\"display: none;\">\r\n                    <file-new></file-new>\r\n                    <file-save></file-save>\r\n                    <file-load></file-load>        \r\n                </div>\r\n\r\n                <!-- top right dropdown menu -->\r\n                <div class=\"dropmenu\">\r\n                    <!-- execute button -->\r\n                    <div>\r\n                        <execute></execute>\r\n                    </div>\r\n                    <!-- dropdown menu for new file, save file, loaf file-->\r\n                    <div>\r\n                        <button class='btn' mat-icon-button [matMenuTriggerFor]=\"menu\">\r\n                            <mat-icon>more_vert</mat-icon>\r\n                        </button>\r\n                        <mat-menu #menu=\"matMenu\">\r\n                            <button  mat-menu-item onclick=\"document.getElementById('newfile').click();\"\r\n                            title=\"Create New Flowchart\">\r\n                                <mat-icon>rotate_left</mat-icon>\r\n                                <span>New File</span>\r\n                            </button>\r\n                            <button mat-menu-item onclick=\"document.getElementById('savefile').click();\"\r\n                            title=\"Save Flowchart File to Computer\">\r\n                                <mat-icon>save_alt</mat-icon>\r\n                                <span>Save File</span>\r\n                            </button>\r\n                            <button mat-menu-item onclick=\"document.getElementById('file-input').click();\"\r\n                            title=\"Load Flowchart File from Computer\">\r\n                                <mat-icon>launch</mat-icon>\r\n                                <span>Load File</span>\r\n                            </button>\r\n                        </mat-menu>\r\n                    </div>\r\n                    \r\n                </div>\r\n            </div>\r\n            <!-- viewchild content -->\r\n            <div class='content__panel'>\r\n                <h2>{{dataService.node?.name}}</h2>\r\n\r\n                <div class='container--editor' (mouseenter)='activateCopyPaste()'  (mouseleave)='deactivateCopyPaste()'\r\n                (copy)='copyProd()' (cut)='cutProd($event)' (paste)='pasteProd($event)'>\r\n                \r\n                    <div class='container__content'>\r\n                        <!-- toolset on the left side -->\r\n                        <div class=\"container--toolset\">\r\n                            <toolset [functions]='dataService.flowchart.functions' \r\n                            [nodeType]='dataService.node.type' \r\n                            [hasProd]='dataService.node.procedure.length>0' \r\n                            (delete)='deleteFunction($event)' \r\n                            (select)='add($event)' \r\n                            (imported)='importFunction($event)'></toolset>\r\n                        </div>\r\n                \r\n                        <!-- procedure editor on the right side -->\r\n                        <div id='procedure' class=\"container--procedure\">\r\n                            <!-- parameter-editor only for start node -->\r\n                            <parameter-editor *ngIf=\"dataService.node.type == 'start' || dataService.node.type == 'end'\" [flowchart]='dataService.flowchart' [node]='dataService.node'></parameter-editor>\r\n                \r\n                            <!-- list of procedure items for all nodes -->\r\n                            <procedure-item \r\n                            *ngFor=\"let line of dataService.node?.procedure; let idx=index\" \r\n                            [data]=\"line\"\r\n                            (select)=\"selectProcedure($event,line)\"\r\n                            (delete)=\"deleteChild(idx)\"\r\n                            (helpText)='updateHelpView($event)'></procedure-item>\r\n                            <br>\r\n                            <br>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </as-split-area>\r\n\r\n        <as-split-area [size]=\"dataService.splitVal\">\r\n            <!-- data viewers panel -->\r\n            <div class='content__viewer' >\r\n                <model-viewers-container [data]='viewerData()' [helpView]='helpView'></model-viewers-container>\r\n            </div>\r\n        </as-split-area>\r\n        \r\n    </as-split>\r\n\r\n</div>\r\n    \r\n\r\n\r\n"

/***/ }),

/***/ "./src/app/views/view-editor/view-editor.component.scss":
/*!**************************************************************!*\
  !*** ./src/app/views/view-editor/view-editor.component.scss ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "as-split-area {\n  overflow: hidden !important; }\n\n.container {\n  position: relative;\n  overflow: auto;\n  height: 100%;\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around;\n  /*\r\n    .container__content{\r\n        flex-grow: 1;\r\n        height: 0px;\r\n        border: 2px solid #3F4651;\r\n        overflow: auto;\r\n\r\n    }\r\n    */ }\n\n.container .container__header {\n    flex: 0 1 auto;\n    min-height: 35px;\n    display: flex;\n    flex-direction: row;\n    justify-content: space-between;\n    padding: 0px 0px 0px 15px;\n    background-color: #ccc;\n    border-bottom: 3px solid #eeeeee;\n    line-height: 35px;\n    font-size: 18px;\n    font-weight: 600;\n    text-align: center;\n    /* tab styling */\n    /* dropdown menu styling */ }\n\n.container .container__header .tab {\n      border: 2px;\n      overflow: hidden;\n      background-color: #ccc; }\n\n.container .container__header .tab button {\n      display: inline-block;\n      vertical-align: bottom;\n      background-color: inherit;\n      color: #505050;\n      border: none;\n      outline: none;\n      cursor: pointer;\n      padding: 8px 10px;\n      transition: 0.3s;\n      font-size: 14px; }\n\n.container .container__header .tab button:hover {\n      color: blue; }\n\n.container .container__header .tab button.active {\n      background-color: #ccc;\n      color: #000096;\n      font-weight: 600;\n      border-color: #222 !important; }\n\n.container .container__header .dropmenu {\n      display: inline-flex; }\n\n.container .container__footer {\n    text-align: center;\n    font-size: 12px;\n    line-height: 18px;\n    background-color: #3F4651;\n    color: #E7BF00; }\n\n.content__panel {\n  background-color: gainsboro;\n  height: 95%;\n  overflow: hidden auto; }\n\n.content__viewer {\n  background-color: gainsboro;\n  height: 100%;\n  overflow: auto; }\n\nul.nav {\n  margin: 0px;\n  padding: 0px; }\n\nli.link {\n  display: inline;\n  border: 2px solid gray;\n  border-radius: 4px;\n  margin: 5px 5px 0px 0px;\n  padding: 5px;\n  text-transform: uppercase;\n  line-height: 12px;\n  font-weight: 600;\n  cursor: pointer;\n  font-size: 12px; }\n\nli.link:hover {\n  background-color: gray;\n  color: white; }\n\nbutton.btn {\n  display: inline-block;\n  vertical-align: middle;\n  margin: 0px 0px 0px 0px;\n  font-size: 12px;\n  line-height: 10px;\n  height: 30px;\n  border: none;\n  border-radius: 4px;\n  background-color: transparent;\n  color: #505050; }\n\nbutton.btn:hover {\n  color: blue; }\n\n.active {\n  background-color: #222;\n  color: white;\n  border-color: #222 !important; }\n\nsplit-area {\n  overflow: auto !important; }\n\n.container--editor {\n  display: block;\n  height: 95%;\n  width: 100%; }\n\n.container__heading {\n  display: block;\n  text-align: center;\n  width: 98%; }\n\nh2 {\n  color: #505050;\n  text-align: left;\n  width: 100%;\n  font-size: 12px;\n  line-height: 14px;\n  font-weight: 600;\n  padding-left: 15px; }\n\nhr {\n  border-top: 2px solid #eeeeee; }\n\n.container__content {\n  display: inline-flex;\n  width: 100%;\n  min-height: 95%;\n  overflow: inherit; }\n\n.container--toolset {\n  display: inline-flex;\n  width: 20%; }\n\n.container--procedure {\n  display: block;\n  width: 80%;\n  bottom: 10px;\n  background-color: #fafafa;\n  padding: none; }\n\nhr {\n  border-top: 2px solid #eeeeee;\n  width: 100%; }\n\n/*\r\n$header-height: 45px;\r\n\r\n.container{\r\n    position: relative;\r\n    overflow: auto;\r\n    margin: 10px 10px;\r\n\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: space-around;\r\n        \r\n    h1, h2, h3, h4, h5, h6, p{\r\n        margin: 0px;\r\n        padding: 0px;\r\n    }\r\n\r\n    .container__header{\r\n        flex: 0 1 auto;\r\n        min-height: $header-height;\r\n\r\n        display: flex;\r\n        flex-direction: row;\r\n        justify-content: space-between;\r\n\r\n        padding: 0px 0px 0px 15px;\r\n\r\n        background-color: #3F4651;\r\n        color: #E7BF00;\r\n        \r\n        line-height: $header-height;\r\n        text-transform: uppercase;\r\n    \r\n        font-size: 18px;\r\n        font-weight: 600;\r\n        text-align: center;\r\n    }\r\n\r\n    .container__content{\r\n        flex-grow: 1;\r\n        height: 0px;\r\n        border: 2px solid #3F4651;\r\n        overflow: auto;\r\n\r\n        split{\r\n            height: 100%;\r\n        }\r\n    }\r\n\r\n    .container__footer{\r\n        text-align: center;\r\n        font-size: 12px;\r\n        line-height: 18px;\r\n\r\n        background-color: #3F4651;\r\n        color: #E7BF00;\r\n    }\r\n}\r\n\r\n\r\n.content__panel{\r\n    height: 100%; \r\n    overflow: auto;\r\n\r\n    //padding: 10px 15px;\r\n}\r\n*/\n"

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
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @services */ "./src/app/core/services/index.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
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
    function ViewEditorComponent(dataService, router) {
        this.dataService = dataService;
        this.router = router;
        /*
        @Input() flowchart: IFlowchart;
        @Input() node: INode;
        */
        this.imported = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.delete_Function = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.copyCheck = false;
    }
    // add a procedure
    ViewEditorComponent.prototype.add = function (data) {
        _models_node__WEBPACK_IMPORTED_MODULE_1__["NodeUtils"].add_procedure(this.dataService.node, data.type, data.data);
    };
    // delete a procedure
    ViewEditorComponent.prototype.deleteChild = function (index) {
        this.dataService.node.procedure.splice(index, 1);
        _models_node__WEBPACK_IMPORTED_MODULE_1__["NodeUtils"].deselect_procedure(this.dataService.node);
    };
    // select a procedure
    ViewEditorComponent.prototype.selectProcedure = function (event, line) {
        _models_node__WEBPACK_IMPORTED_MODULE_1__["NodeUtils"].select_procedure(this.dataService.node, event.prod, event.ctrl || false);
    };
    // copy selected procedures
    ViewEditorComponent.prototype.copyProd = function () {
        var node = this.dataService.node;
        if (!this.copyCheck || node.type === 'end') {
            return;
        }
        console.log('copying', node.state.procedure);
        this.copiedType = node.type;
        this.copiedProd = node.state.procedure;
    };
    // cut selected procedures
    ViewEditorComponent.prototype.cutProd = function (event) {
        var node = this.dataService.node;
        if (!this.copyCheck || document.activeElement.nodeName === 'INPUT' || node.type === 'end') {
            return;
        }
        console.log('cutting', node.state.procedure);
        this.copiedType = node.type;
        this.copiedProd = node.state.procedure;
        var parentArray;
        for (var _i = 0, _a = this.copiedProd; _i < _a.length; _i++) {
            var prod = _a[_i];
            if (prod.parent) {
                parentArray = prod.parent.children;
            }
            else {
                parentArray = node.procedure;
            }
            for (var i = 0; i < parentArray.length; i++) {
                if (parentArray[i] === prod) {
                    parentArray.splice(i, 1);
                    break;
                }
            }
        }
        _models_node__WEBPACK_IMPORTED_MODULE_1__["NodeUtils"].deselect_procedure(node);
    };
    // paste copied procedures
    ViewEditorComponent.prototype.pasteProd = function (event) {
        var node = this.dataService.node;
        if (this.copyCheck
            && this.copiedProd
            && this.copiedType === node.type
            && document.activeElement.nodeName.toUpperCase() !== 'INPUT'
            && document.activeElement.nodeName.toUpperCase() !== 'TEXTAREA') {
            var pastingPlace = node.state.procedure[0];
            if (pastingPlace === undefined) {
                for (var i = 0; i < this.copiedProd.length; i++) {
                    console.log('pasting', this.copiedProd[i].ID);
                    _models_node__WEBPACK_IMPORTED_MODULE_1__["NodeUtils"].paste_procedure(node, this.copiedProd[i]);
                    node.state.procedure[0].selected = false;
                    node.state.procedure = [];
                }
            }
            else if (pastingPlace.children) {
                for (var i = 0; i < this.copiedProd.length; i++) {
                    console.log('pasting', this.copiedProd[i].ID);
                    _models_node__WEBPACK_IMPORTED_MODULE_1__["NodeUtils"].paste_procedure(node, this.copiedProd[i]);
                    node.state.procedure[0].selected = false;
                    pastingPlace.selected = true;
                    node.state.procedure = [pastingPlace];
                }
            }
            else {
                for (var i = this.copiedProd.length - 1; i >= 0; i--) {
                    console.log('pasting', this.copiedProd[i].ID);
                    _models_node__WEBPACK_IMPORTED_MODULE_1__["NodeUtils"].paste_procedure(node, this.copiedProd[i]);
                    node.state.procedure[0].selected = false;
                    pastingPlace.selected = true;
                    node.state.procedure = [pastingPlace];
                }
            }
            // this.copiedProd = undefined;
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
            this.dataService.flowchart.functions.push(func);
        }
    };
    // delete an imported function
    ViewEditorComponent.prototype.deleteFunction = function (event) {
        for (var i = 0; i < this.dataService.flowchart.functions.length; i++) {
            if (this.dataService.flowchart.functions[i] === event) {
                this.dataService.flowchart.functions.splice(i, 1);
                break;
            }
        }
    };
    ViewEditorComponent.prototype.updateHelpView = function (event) {
        if (typeof (event) === 'string') {
            for (var _i = 0, _a = this.dataService.flowchart.functions; _i < _a.length; _i++) {
                var func = _a[_i];
                if (func.name === event) {
                    this.helpView = func.doc;
                }
            }
        }
        else {
            this.helpView = event;
        }
    };
    ViewEditorComponent.prototype.viewerData = function () {
        var node = this.dataService.flowchart.nodes[this.dataService.flowchart.meta.selected_nodes[0]];
        if (!node) {
            return '';
        }
        if (node.type === 'output') {
            return node.input.value;
        }
        return node.output.value;
    };
    ViewEditorComponent.prototype.setSplit = function (e) { this.dataService.splitVal = e.sizes[1]; };
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
        __metadata("design:paramtypes", [_services__WEBPACK_IMPORTED_MODULE_2__["DataService"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]])
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
/* harmony import */ var _view_editor_routing_module__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./view-editor-routing.module */ "./src/app/views/view-editor/view-editor-routing.module.ts");
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
                _parameter_editor_procedure_input_editor_procedure_input_editor_component__WEBPACK_IMPORTED_MODULE_7__["ProcedureInputEditorComponent"],
            ],
            entryComponents: [],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__["SharedModule"],
                _view_editor_routing_module__WEBPACK_IMPORTED_MODULE_8__["ViewEditorRoutingModule"]
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

/***/ "./src/app/views/view-flowchart/edge/edge.component.html":
/*!***************************************************************!*\
  !*** ./src/app/views/view-flowchart/edge/edge.component.html ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--the main line-->\r\n<svg:polyline \r\nid=\"main-edge\" \r\nclass = \"edge\" \r\n[class.selected] = \"edge.selected\"\r\n[attr.points] = \"(edge.source.parentNode.position.x + outputOffset[0]) + ',' +\r\n                    (edge.source.parentNode.position.y + outputOffset[1]+ 8) + ' ' +\r\n\r\n                    (edge.source.parentNode.position.x + outputOffset[0]) + ',' +\r\n                    (edge.source.parentNode.position.y + outputOffset[1] + 16) + ' ' +\r\n\r\n                    (edge.target.parentNode.position.x + inputOffset[0]) + ',' +\r\n                    (edge.target.parentNode.position.y + inputOffset[1] - 27) + ' ' +\r\n\r\n                    (edge.target.parentNode.position.x + inputOffset[0]) + ',' +\r\n                    (edge.target.parentNode.position.y + inputOffset[1] - 22)\" \r\n/>\r\n\r\n<!--a wider invisible line to make the wire easier to click-->\r\n<svg:polyline \r\nid=\"invisible-edge\" \r\nclass = \"inviEdge\" \r\n[attr.points] = \"(edge.source.parentNode.position.x + outputOffset[0]) + ',' +\r\n                    (edge.source.parentNode.position.y + outputOffset[1]+ 15) + ' ' +\r\n\r\n                    (edge.source.parentNode.position.x + outputOffset[0]) + ',' +\r\n                    (edge.source.parentNode.position.y + outputOffset[1] + 17) + ' ' +\r\n\r\n                    (edge.target.parentNode.position.x + inputOffset[0]) + ',' +\r\n                    (edge.target.parentNode.position.y + inputOffset[1] - 27) + ' ' +\r\n\r\n                    (edge.target.parentNode.position.x + inputOffset[0]) + ',' +\r\n                    (edge.target.parentNode.position.y + inputOffset[1] - 12)\" \r\n(click)='select($event)'/>\r\n    \r\n\r\n"

/***/ }),

/***/ "./src/app/views/view-flowchart/edge/edge.component.ts":
/*!*************************************************************!*\
  !*** ./src/app/views/view-flowchart/edge/edge.component.ts ***!
  \*************************************************************/
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
            if (event.ctrlKey) {
                this.selected.emit('ctrl');
            }
            else {
                this.selected.emit('single');
            }
        }
    };
    // delete a wire
    EdgeComponent.prototype.deleteEdge = function () {
        this.delete.emit();
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
            template: __webpack_require__(/*! ./edge.component.html */ "./src/app/views/view-flowchart/edge/edge.component.html"),
            styles: ["\n    .edge{\n        fill: none;\n        stroke: rgb(80, 80, 80);\n        stroke-linecap: round;\n        stroke-linejoin: round;\n        stroke-width: 2px;\n        opacity: 1;\n        pointer-events: stroke;\n        marker-end: url(#arrow);\n    }\n    .inviEdge{\n        fill: none;\n        stroke: gray;\n        stroke-width: 30px;\n        opacity: 0;\n        pointer-events: stroke;\n    }\n    .selected{\n        stroke: rgb(0, 0, 150);\n        opacity: 1;\n        marker-end: url(#arrow_selected);\n\n    }\n  "]
        })
    ], EdgeComponent);
    return EdgeComponent;
}());



/***/ }),

/***/ "./src/app/views/view-flowchart/node/node.actions.ts":
/*!***********************************************************!*\
  !*** ./src/app/views/view-flowchart/node/node.actions.ts ***!
  \***********************************************************/
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

/***/ "./src/app/views/view-flowchart/node/node.component.html":
/*!***************************************************************!*\
  !*** ./src/app/views/view-flowchart/node/node.component.html ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!-- svg group for the selectable and draggable area of normal node -->\r\n<svg:g (click)='nodeSelect($event)' draggable=\"true\" \r\n(mousedown)='startDragNode($event)' \r\n(dblclick)='switchToProcedure($event)'\r\n*ngIf='node.type==\"\"'>\r\n\r\n    <!-- rectangular box with border -->\r\n    <rect class=\"node\" \r\n    width=\"100\" height=\"80\"\r\n    [class.node--selected]='selected'\r\n    [class.node--error]=\"node.hasError\"\r\n    [class.node--disabled]='!node.enabled'\r\n    [attr.x]=\"node.position.x\" \r\n    [attr.y]=\"node.position.y\"\r\n    />\r\n\r\n    <!-- node description inside the rectangular box -->\r\n    <svg:foreignObject [attr.x]=\"node.position.x\" [attr.y]=\"node.position.y + 3\" \r\n    width=\"100\" height = \"80\"\r\n    (mousedown)='focusText($event)'>\r\n        <xhtml:div class='textdiv'>\r\n            <xhtml:textarea \r\n                id={{node.id}}\r\n                autocomplete=off \r\n                [(ngModel)]='node.name'\r\n                [class.selected]='selected'\r\n                [class.disabled]='!node.enabled'\r\n                title={{node.name}}\r\n                style=\"font-weight: 600;\"\r\n                placeholder='Description of Node'/>  \r\n        </xhtml:div>\r\n    </svg:foreignObject>\r\n</svg:g>\r\n\r\n<!-- svg group for the selectable and draggable area of start node -->\r\n<svg:g (click)='nodeSelect($event)' draggable=\"true\" \r\n(mousedown)='startDragNode($event)' \r\n(dblclick)='switchToProcedure($event)'\r\n*ngIf='node.type==\"start\"'>\r\n\r\n    <!-- ellipse with border -->\r\n    <ellipse class=\"node\" \r\n        [class.node--selected]='selected'\r\n        [class.node--error]=\"node.hasError\"\r\n        [attr.cx]=\"node.position.x + inputOffset[0]\" \r\n        [attr.cy]=\"node.position.y + (inputOffset[1]+outputOffset[1])/2 + 10\"\r\n        [attr.rx]=\"40\"\r\n        [attr.ry]=\"30\"\r\n        />\r\n\r\n    <!-- node description inside the ellipse -->\r\n    <svg:foreignObject \r\n    [attr.x]=\"node.position.x\" [attr.y]=\"node.position.y + 38\" \r\n    width=\"100\" height = \"40\">\r\n        <xhtml:div class='textdiv'>\r\n            <xhtml:textarea \r\n                id={{node.id}}\r\n                class='textarea_startend'\r\n                autocomplete=off \r\n                [class.selected]='selected'\r\n                [(ngModel)]='node.name'/>  \r\n        </xhtml:div>\r\n    </svg:foreignObject>\r\n</svg:g>\r\n\r\n<!-- svg group for the selectable and draggable area of end node -->\r\n<svg:g (click)='nodeSelect($event)' draggable=\"true\" \r\n(mousedown)='startDragNode($event)' \r\n(dblclick)='switchToProcedure($event)'\r\n*ngIf='node.type==\"end\"'>\r\n\r\n    <!-- ellipse with border -->\r\n    <ellipse class=\"node\" \r\n        [class.node--selected]='selected'\r\n        [class.node--error]=\"node.hasError\"\r\n        [class.node--disabled]='!node.enabled'\r\n        [attr.cx]=\"node.position.x + inputOffset[0]\" \r\n        [attr.cy]=\"node.position.y + (inputOffset[1]+outputOffset[1])/2 - 10\"\r\n        [attr.rx]=\"40\"\r\n        [attr.ry]=\"30\"\r\n        />\r\n\r\n    <!-- node description inside the ellipse -->\r\n    <svg:foreignObject [attr.x]=\"node.position.x\" [attr.y]=\"node.position.y + 18\" \r\n    width=\"100\" height = \"40\">\r\n        <xhtml:div class='textdiv'>\r\n            <xhtml:textarea \r\n                id={{node.id}}\r\n                class='textarea_startend'\r\n                autocomplete=off \r\n                [class.selected]='selected'\r\n                [class.disabled]='!node.enabled'\r\n                [(ngModel)]='node.name'/>  \r\n        </xhtml:div>\r\n    </svg:foreignObject>\r\n</svg:g>\r\n\r\n\r\n\r\n<!-- circles as draggable input/output ports of the node -->\r\n<svg:circle\r\nr=3\r\n[attr.cx]=\"node.position.x + inputOffset[0]\" \r\n[attr.cy]=\"node.position.y + inputOffset[1]\"\r\n*ngIf=\"inputDraggable()\" \r\nclass='inputPort'\r\nid = 'node.input.id'\r\n(mousedown)='startDragPort($event, \"input\")'/>\r\n\r\n<svg:circle *ngIf=\"outputDraggable()\" \r\nclass='outputPort'\r\nid = 'node.output.id'\r\n(mousedown)='startDragPort($event, \"output\")' \r\n[attr.cx]=\"node.position.x + outputOffset[0]\" \r\n[attr.cy]=\"node.position.y + outputOffset[1]\" \r\npointer-events=\"all\"\r\nr=3\r\nfill=\"black\"/>\r\n\r\n"

/***/ }),

/***/ "./src/app/views/view-flowchart/node/node.component.scss":
/*!***************************************************************!*\
  !*** ./src/app/views/view-flowchart/node/node.component.scss ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*\r\n$color-main: #2D4885;\r\n$color-accent: #50ABB9;\r\n$color-muted: #88D4DD;\r\n$color-text-accent: #DC772F;\r\n*/\n.node {\n  fill: #fafafa;\n  stroke-width: 2px;\n  stroke: #505050;\n  stroke-opacity: 1;\n  stroke-linecap: round;\n  stroke-linejoin: round; }\n.node.node--disabled {\n    stroke-opacity: 0.5;\n    fill-opacity: 0.5; }\n.node.node--selected {\n    stroke: #000096; }\n.node.node--error {\n    stroke: red; }\n.textdiv {\n  text-align: center;\n  width: 94px; }\n.foreignObject {\n  width: 100;\n  height: 80; }\ntextarea {\n  font-family: sans-serif;\n  background: transparent;\n  display: inline-block;\n  border: none;\n  font-size: 14px;\n  width: 100%;\n  height: 70px;\n  font-weight: 600;\n  text-align: center;\n  vertical-align: middle;\n  resize: none;\n  overflow: hidden;\n  color: #505050; }\ntextarea.selected {\n    color: #000096; }\ntextarea.disabled {\n    opacity: 0.5; }\n.textarea_startend {\n  font-size: 14px;\n  font-weight: 600;\n  color: #505050;\n  height: 20px;\n  pointer-events: none; }\n.inputPort {\n  stroke: transparent;\n  stroke-width: 20px;\n  pointer-events: all;\n  fill: #505050; }\n.outputPort {\n  stroke: transparent;\n  stroke-width: 20px;\n  pointer-events: all;\n  fill: #505050; }\n"

/***/ }),

/***/ "./src/app/views/view-flowchart/node/node.component.ts":
/*!*************************************************************!*\
  !*** ./src/app/views/view-flowchart/node/node.component.ts ***!
  \*************************************************************/
/*! exports provided: NodeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NodeComponent", function() { return NodeComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _node_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node.actions */ "./src/app/views/view-flowchart/node/node.actions.ts");
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
    /*
    select a node
    */
    NodeComponent.prototype.nodeSelect = function (event) {
        this.action.emit({ action: _node_actions__WEBPACK_IMPORTED_MODULE_1__["ACTIONS"].SELECT });
    };
    /*
    check if the input port of the node is draggable --> false only for start node, true otherwise
    */
    NodeComponent.prototype.inputDraggable = function () {
        return !(this.node.type === 'start');
    };
    /*
    check if the output port of the node is draggable --> false only for end node, true otherwise
    */
    NodeComponent.prototype.outputDraggable = function () {
        return !(this.node.type === 'end');
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
        if (portType === 'input') {
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
            template: __webpack_require__(/*! ./node.component.html */ "./src/app/views/view-flowchart/node/node.component.html"),
            styles: [__webpack_require__(/*! ./node.component.scss */ "./src/app/views/view-flowchart/node/node.component.scss")]
        })
    ], NodeComponent);
    return NodeComponent;
}());



/***/ }),

/***/ "./src/app/views/view-flowchart/view-flowchart-routing.module.ts":
/*!***********************************************************************!*\
  !*** ./src/app/views/view-flowchart/view-flowchart-routing.module.ts ***!
  \***********************************************************************/
/*! exports provided: ViewFlowchartRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewFlowchartRoutingModule", function() { return ViewFlowchartRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _view_flowchart_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./view-flowchart.component */ "./src/app/views/view-flowchart/view-flowchart.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var routes = [
    {
        path: '',
        component: _view_flowchart_component__WEBPACK_IMPORTED_MODULE_2__["ViewFlowchartComponent"],
        children: [
        // {
        //   path: '',
        //   loadChildren: '../../mobius-viewer/mobius-viewer.module#MobiusViewerModule',
        // }
        ]
    }
];
var ViewFlowchartRoutingModule = /** @class */ (function () {
    function ViewFlowchartRoutingModule() {
    }
    ViewFlowchartRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], ViewFlowchartRoutingModule);
    return ViewFlowchartRoutingModule;
}());



/***/ }),

/***/ "./src/app/views/view-flowchart/view-flowchart.component.html":
/*!********************************************************************!*\
  !*** ./src/app/views/view-flowchart/view-flowchart.component.html ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class='container'>\r\n        <as-split direction=\"horizontal\" (dragEnd)='setSplit($event)'>\r\n            <as-split-area [size]=\"100 - dataService.splitVal\">\r\n                <div class='container__header'>\r\n    \r\n                    <!-- top left tab menu  -->\r\n                    <div class=\"tab\">\r\n                        <button class='btn-tab' [class.active]='router.url==\"/gallery\"' [routerLink]=\"'/gallery'\">Gallery</button>\r\n                        <button class='btn-tab' [class.active]='router.url==\"/dashboard\"' [routerLink]=\"'/dashboard'\">Dashboard</button>\r\n                        <button class='btn-tab' [class.active]='router.url==\"/flowchart\"' [routerLink]=\"'/flowchart'\">Flowchart</button>\r\n                        <!--\r\n                        <button class='btn' [class.active]='false' (click)='updateView(\"editor\")'>Procedures</button>\r\n                        -->\r\n                    </div>\r\n    \r\n                    <!-- hidden components (new file, save file, loaf file) for the dropdown menu-->\r\n                    <div style=\"display: none;\">\r\n                        <file-new></file-new>\r\n                        <file-save></file-save>\r\n                        <file-load></file-load>        \r\n                    </div>\r\n    \r\n                    <!-- top right dropdown menu -->\r\n                    <div class=\"dropmenu\">\r\n                        <!-- execute button -->\r\n                        <div>\r\n                            <execute></execute>\r\n                        </div>\r\n                        <!-- dropdown menu for new file, save file, loaf file-->\r\n                        <div>\r\n                            <button class='btn' mat-icon-button [matMenuTriggerFor]=\"menu\">\r\n                                <mat-icon>more_vert</mat-icon>\r\n                            </button>\r\n                            <mat-menu #menu=\"matMenu\">\r\n                                <!--\r\n                                    \r\n                                    onclick=\"document.getElementById('file-input').click(); \"\r\n                                -->\r\n                                <button  mat-menu-item onclick=\"document.getElementById('newfile').click();\"\r\n                                title=\"Create New Flowchart\">\r\n                                    <mat-icon>rotate_left</mat-icon>\r\n                                    <span>New File</span>\r\n                                </button>\r\n                                <button mat-menu-item onclick=\"document.getElementById('savefile').click();\"\r\n                                title=\"Save Flowchart File to Computer\">\r\n                                    <mat-icon>save_alt</mat-icon>\r\n                                    <span>Save File</span>\r\n                                </button>\r\n                                <button mat-menu-item onclick=\"document.getElementById('file-input').click();\"\r\n                                title=\"Load Flowchart File from Computer\">\r\n                                    <mat-icon>launch</mat-icon>\r\n                                    <span>Load File</span>\r\n                                </button>\r\n                            </mat-menu>\r\n                        </div>\r\n                        \r\n                    </div>\r\n                </div>\r\n                <!-- viewchild content -->\r\n                <div class='content__panel'>\r\n                    <div id = 'flowchart-main-container' class='flowchart-container'>\r\n                            <!--\r\n                            -->\r\n                        \r\n                            <!-- svg component -->\r\n                            <svg id=\"svg-canvas\" class = \"svgCanvas\" \r\n                            [attr.viewBox]=\"viewbox\"\r\n                            (mouseenter)='activateKeyEvent()'\r\n                            (mouseleave)='deactivateKeyEvent($event)'\r\n                            (mousedown)='panStart($event)'\r\n                            (mousemove)='handleMouseMove($event)'  \r\n                            (mouseup)='handleMouseUp($event)'\r\n                            (wheel)='scale($event)'\r\n                            >\r\n                                <!-- definitions for svg: grid patterns, arrow head for connecting wire-->\r\n                                <defs>\r\n                                    <!-- grid pattern -->\r\n                                    <pattern id=\"smallGrid\" width=\"20\" height=\"20\" patternUnits=\"userSpaceOnUse\">\r\n                                        <path d=\"M 20 0 L 0 0 0 20\" fill=\"none\" stroke=\"gray\" stroke-width=\"0.5\"/>\r\n                                    </pattern>\r\n                                    <pattern id=\"grid\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\">\r\n                                        <rect width=\"100\" height=\"100\" fill=\"url(#smallGrid)\"/>\r\n                                        <path d=\"M 100 0 L 0 0 0 100\" fill=\"none\" stroke=\"gray\" stroke-width=\"1\"/>\r\n                                    </pattern>\r\n                        \r\n                                    <!-- arrow head -->\r\n                                    <marker id=\"arrow\" markerWidth=\"30\" markerHeight=\"30\" refX=\"0\" refY=\"4\" orient=\"auto\" markerUnits=\"strokeWidth\" viewBox=\"0 0 40 40\">\r\n                                        <path d=\"M0,0 L0,8 L9,4 z\" stroke=\"rgb(80, 80, 80)\" fill=\"transparent\" />\r\n                                    </marker>\r\n                                    <marker id=\"arrow_selected\" markerWidth=\"30\" markerHeight=\"30\" refX=\"0\" refY=\"4\" orient=\"auto\" markerUnits=\"strokeWidth\" viewBox=\"0 0 40 40\">\r\n                                        <path d=\"M0,0 L0,8 L9,4 z\" stroke=\"rgb(0, 0, 150)\" fill=\"transparent\"  />\r\n                                    </marker>\r\n                                </defs>\r\n                        \r\n                                <!-- svg frame-->\r\n                                <rect width=\"100%\" height=\"100%\" fill=\"url(#grid)\" />\r\n                                            \r\n                        \r\n                                <!-- wires => edge.component -->\r\n                                <g edge *ngFor=\"let edge of dataService.flowchart.edges; let edge_index = index\" \r\n                                [edge]='edge'\r\n                                [inputOffset]='inputOffset'\r\n                                [outputOffset]='outputOffset'\r\n                                (selected)='selectEdge($event, edge_index)'\r\n                                />\r\n                        \r\n                                <!-- temporary wire while dragging port, default position to <(0,0),(0,0)>, modified when a port is being dragged -->\r\n                                <line id=\"temporary-wire\" class=\"temp-wire\" x1=\"0\" y1='0' x2='0' y2='0'></line>\r\n                        \r\n                                <!-- nodes => node.component -->\r\n                                <g node *ngFor=\"let node of dataService.flowchart.nodes; let node_index = index\" \r\n                                id='flw_node_{{node_index}}'\r\n                                [node]='node' \r\n                                [selected]='isSelected(node_index)'\r\n                                [inputOffset]='inputOffset'\r\n                                [outputOffset]='outputOffset'\r\n                                (action)='nodeAction($event, node_index)'\r\n                                />\r\n                            </svg>\r\n                        \r\n                            <!-- 3 top left buttons of the svg: add Node, delete Node and delete Wire -->\r\n                            <div class='button-row'>\r\n                                <button mat-icon-button disableRipple='true' (click)='addNode()' title=\"Add Node\">\r\n                                <mat-icon>add</mat-icon>\r\n                                </button>\r\n                                <button mat-icon-button disableRipple='true' (click)='deleteSelectedNodes()' title=\"Delete Selected Node\">\r\n                                <mat-icon>remove</mat-icon>\r\n                                </button>\r\n                                <button mat-icon-button disableRipple='true' (click)='deleteSelectedEdges()' title=\"Delete Selected Wires\">\r\n                                <mat-icon>link_off</mat-icon>\r\n                                </button>\r\n                            </div>\r\n                        \r\n                            <!-- focus on flowchart button on the top right of the svg -->\r\n                            <button id='zoomToFit' class='resetViewer-button' mat-icon-button disableRipple='true' (click)='focusFlowchart()' title=\"Zoom to Fit\">\r\n                                <mat-icon>control_camera</mat-icon>\r\n                            </button>\r\n                            \r\n                        \r\n                        </div>\r\n                            \r\n                </div>\r\n            </as-split-area>\r\n    \r\n            <as-split-area [size]=\"dataService.splitVal\">\r\n                <!-- data viewers panel -->\r\n                <div class='content__viewer' >\r\n                    <model-viewers-container [data]='viewerData()' [helpView]='helpView'></model-viewers-container>\r\n                </div>\r\n            </as-split-area>\r\n            \r\n        </as-split>\r\n    \r\n    </div>\r\n    \r\n\r\n\r\n\r\n"

/***/ }),

/***/ "./src/app/views/view-flowchart/view-flowchart.component.scss":
/*!********************************************************************!*\
  !*** ./src/app/views/view-flowchart/view-flowchart.component.scss ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".reset {\n  margin: 0px;\n  padding: 0px; }\n\n.default {\n  font-size: 12px;\n  color: #8AA8C0;\n  line-height: 150px;\n  text-align: center; }\n\n.viewer {\n  /*     width: 100%; \r\noverflow: auto;\r\n\r\npadding: 0px;\r\nmargin: 0px;\r\n\r\n.header{\r\n\r\n    display: flex; \r\n    flex-direction: row; \r\n    justify-content: space-between;\r\n\r\n    position: relative;\r\n    font-size: 14px; \r\n    font-weight: 600; \r\n    line-height: $header-height;\r\n    text-transform: uppercase;\r\n    letter-spacing: 1.5px;\r\n    height: $header-height;\r\n\r\n    color: #ADADAD;\r\n\r\n    .btn-group{\r\n        height: $header-height; \r\n\r\n        button{\r\n            width: 0.9*$header-height; \r\n            height: 0.9*$header-height; \r\n            margin: 0px;\r\n            border: 1px solid #B4B1B1;\r\n            box-shadow: none;\r\n\r\n            &:focus{\r\n                \r\n            }\r\n        }\r\n        \r\n    }\r\n\r\n}\r\n\r\n.container{\r\n}\r\n\r\nbutton{\r\n    &:focus{\r\n        \r\n    }\r\n} */ }\n\n.viewer .container {\n    display: flex;\n    flex-direction: row;\n    height: 100%; }\n\n.viewer .container .sidebar {\n      z-index: 100; }\n\n.viewer .container .view-container {\n      box-sizing: border-box;\n      height: 100%;\n      width: 100%;\n      padding-bottom: 30px;\n      overflow: auto; }\n\n.container {\n  position: relative;\n  overflow: auto;\n  height: 100%;\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around; }\n\n.container h1, .container h2, .container h3, .container h4, .container h5, .container h6, .container p {\n    margin: 0px;\n    padding: 0px; }\n\n.container .container__header {\n    flex: 0 1 auto;\n    min-height: 35px;\n    display: flex;\n    flex-direction: row;\n    justify-content: space-between;\n    padding: 0px 0px 0px 15px;\n    background-color: #ccc;\n    border-bottom: 3px solid #eeeeee;\n    line-height: 35px;\n    font-size: 18px;\n    font-weight: 600;\n    text-align: center;\n    /* tab styling */\n    /* dropdown menu styling */ }\n\n.container .container__header .tab {\n      border: 2px;\n      overflow: hidden;\n      background-color: #ccc; }\n\n.container .container__header .tab button {\n      display: inline-block;\n      vertical-align: bottom;\n      background-color: inherit;\n      color: #505050;\n      border: none;\n      outline: none;\n      cursor: pointer;\n      padding: 8px 10px;\n      transition: 0.3s;\n      font-size: 14px; }\n\n.container .container__header .tab button:hover {\n      color: blue; }\n\n.container .container__header .tab button.active {\n      background-color: #ccc;\n      color: #000096;\n      font-weight: 600;\n      border-color: #222 !important; }\n\n.container .container__header .dropmenu {\n      display: inline-flex; }\n\n.container .container__content {\n    flex-grow: 1;\n    height: 0px;\n    border: 2px solid #3F4651;\n    overflow: auto; }\n\n.container .container__footer {\n    text-align: center;\n    font-size: 12px;\n    line-height: 18px;\n    background-color: #3F4651;\n    color: #E7BF00; }\n\n.content__panel {\n  background-color: gainsboro;\n  height: 95%;\n  overflow: hidden auto; }\n\n.content__viewer {\n  background-color: gainsboro;\n  height: 100%;\n  overflow: auto; }\n\nul.nav {\n  margin: 0px;\n  padding: 0px; }\n\nli.link {\n  display: inline;\n  border: 2px solid gray;\n  border-radius: 4px;\n  margin: 5px 5px 0px 0px;\n  padding: 5px;\n  text-transform: uppercase;\n  line-height: 12px;\n  font-weight: 600;\n  cursor: pointer;\n  font-size: 12px; }\n\nli.link:hover {\n  background-color: gray;\n  color: white; }\n\nbutton.btn {\n  display: inline-block;\n  vertical-align: middle;\n  margin: 0px 0px 0px 0px;\n  font-size: 12px;\n  line-height: 10px;\n  height: 30px;\n  border: none;\n  border-radius: 4px;\n  background-color: transparent;\n  color: #505050; }\n\nbutton.btn:hover {\n  color: blue; }\n\n.active {\n  background-color: #222;\n  color: white;\n  border-color: #222 !important; }\n\n.flowchart-container {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  overflow: hidden; }\n\n.flowchart-container .svgCanvas .temp-wire {\n    stroke: #505050;\n    stroke-width: 2px;\n    stroke-dasharray: 10 15;\n    opacity: 0.5; }\n\nsplit-area {\n  overflow: auto !important; }\n\nas-split-area {\n  overflow: hidden !important; }\n\ninput {\n  border: none; }\n\ninput:focus {\n  border-bottom: 1px dashed gray; }\n\n#flowchart__name {\n  margin: 0 auto;\n  font-size: 14px;\n  line-height: 28px;\n  font-weight: bold;\n  color: #8AA8C0; }\n\n.button-row {\n  position: absolute;\n  top: 0px;\n  left: 10px; }\n\n.button-row button {\n    color: #505050;\n    width: 28px; }\n\n.resetViewer-button {\n  position: absolute;\n  top: 0px;\n  right: 0px;\n  color: #505050; }\n\n.viewer {\n  position: relative;\n  height: 100%;\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  background-image: repeating-linear-gradient(0deg, transparent, transparent 70px, #F1F1F1 70px, #F1F1F1 71px), repeating-linear-gradient(-90deg, transparent, transparent 70px, #F1F1F1 70px, #F1F1F1 71px);\n  background-size: 71px 71px;\n  background-color: white;\n  box-sizing: border-box;\n  height: 100%;\n  width: 100%;\n  padding-bottom: 35px; }\n\n.viewer .container {\n    position: absolute;\n    height: 100%;\n    overflow: hidden; }\n\n.viewer .container .disabled {\n      color: #8AA8C0; }\n\n.viewer .container .disabled:hover {\n        color: #8AA8C0 !important; }\n\n.viewer .container .sidebar {\n      font-size: 12px;\n      background-color: #F1F1F1;\n      color: #395D73;\n      white-space: nowrap;\n      overflow-x: hidden !important; }\n\n.viewer .container .sidebar section {\n        padding-left: 15px;\n        padding-bottom: 5px;\n        padding-top: 5px;\n        border-bottom: 1px solid #8AA8C0; }\n\n.viewer .container .sidebar section div {\n          cursor: pointer; }\n\n.viewer .container .sidebar section div:hover {\n            color: #F0BFA0; }\n\n.viewer .content-wrapper {\n    position: relative;\n    height: 100%;\n    width: 100%;\n    -webkit-transform-origin: top left;\n            transform-origin: top left; }\n\n.viewer .info-container {\n    padding: 0px 30px;\n    display: flex;\n    flex-direction: row;\n    justify-content: space-between; }\n\n.viewer .info-container .info {\n      display: flex;\n      flex-direction: column; }\n\n.viewer .info-container .info .label {\n        font-size: 12px;\n        font-weight: 100;\n        color: #F07A79; }\n\n.viewer .info-container .info .value {\n        color: #395D73;\n        font-size: 11px;\n        font-weight: 600; }\n\n.viewer .info-container .info .action {\n        cursor: pointer;\n        font-size: 11px;\n        color: #8AA8C0; }\n\n.viewer .graph-container {\n    position: absolute;\n    height: 100%;\n    width: 100%;\n    -webkit-transform-origin: top left;\n            transform-origin: top left; }\n\n.viewer .graph-container #graph-edges {\n      background-color: transparent;\n      z-index: 1000; }\n\n.viewer .graph-container #graph-edges #temporary-edge .hidden {\n        display: none; }\n\n.viewer .graph-container #graph-nodes {\n      background-color: transparent;\n      overflow: hidden;\n      z-index: 1000; }\n\n.viewer .info-container {\n    position: absolute;\n    right: 0;\n    bottom: 0; }\n\n.viewer .info-container .label, .viewer .info-container .value {\n      margin-right: 5px;\n      font-weight: normal !important; }\n\n.viewer .node-container {\n    position: relative; }\n\n.viewer .node-container .node {\n      position: absolute;\n      -webkit-transform-origin: top left;\n              transform-origin: top left;\n      z-index: 3;\n      margin: 0px;\n      color: #395D73; }\n\n.viewer .node-container .node.hidden {\n        display: none; }\n\n.viewer .node-container .node .btn-container {\n        position: absolute;\n        right: -30px;\n        display: flex;\n        flex-direction: column;\n        justify-content: space-between;\n        height: 100px; }\n\n.viewer .node-container .node .btn-container .btn-group {\n          position: relative;\n          display: flex;\n          flex-direction: column;\n          justify-content: center;\n          background: none; }\n\n.viewer .node-container .node .btn-container .btn-group .action-button {\n            position: relative;\n            width: 25px;\n            height: 24px;\n            cursor: pointer;\n            font-size: 9px;\n            text-align: center; }\n\n.viewer .node-container .node .btn-container .btn-group .action-button .material-icons {\n              font-size: 18px;\n              line-height: 24px;\n              color: #8AA8C0; }\n\n.viewer .node-container .node .btn-container .btn-group .action-button:hover {\n              color: white; }\n\n.viewer .node-container .node .btn-container .btn-group .action-button:hover .mat-icon {\n                color: #F0BFA0; }\n\n.viewer .node-container .node .node-body {\n        display: flex;\n        flex-direction: column;\n        justify-content: center;\n        position: relative;\n        min-height: 30px;\n        min-width: 70px;\n        width: auto;\n        border: 1px solid #395D73;\n        background-color: rgba(255, 255, 255, 0.7);\n        cursor: move; }\n\n.viewer .node-container .node .node-body.disabled {\n          opacity: 0.4; }\n\n.viewer .node-container .node .node-body.selected {\n          border-color: green; }\n\n.viewer .node-container .node .node-body.library {\n          border-color: #395D73;\n          border-style: solid; }\n\n.viewer .node-container .node .node-body.error {\n          background-color: #E94858; }\n\n.viewer .node-container .node .node-body.function {\n          background-color: yellow;\n          border: 1px dashed green; }\n\n.viewer .node-container .node .node-body .node-name {\n          font-family: sans-serif;\n          font-size: 12px;\n          border-bottom: 1px solid #395D73;\n          text-align: center;\n          background-color: #F1F1F1; }\n\n.viewer .node-container .node .node-body .node-name input {\n            background-color: inherit;\n            border: 0px;\n            color: #395D73;\n            text-align: center; }\n\n.viewer .node-container .node .node-body .node-name.selected {\n            background-color: #8AA8C0; }\n\n.viewer .node-container .node .node-body .node-name.selected input {\n              color: white;\n              font-weight: bold; }\n\n.viewer .node-container .node .node-body .node-name.selected input:focus {\n                color: #395D73;\n                background-color: #F0BFA0; }\n\n.viewer .node-container .node .node-body .port-container {\n          display: flex;\n          flex-direction: column;\n          margin-top: 10px;\n          margin-bottom: 10px; }\n\n.viewer .node-container .node .node-body .port-container .divider {\n            height: 2px;\n            width: 100%;\n            background-color: #8AA8C0; }\n\n.viewer .node-container .node .node-body .port-container .port {\n            display: flex;\n            flex-direction: row;\n            margin: 5px 0px; }\n\n.viewer .node-container .node .node-body .port-container .port.hidden {\n              display: none; }\n\n.viewer .node-container .node .node-body .port-container .port .port-grip {\n              width: 15px;\n              height: 15px;\n              border-radius: 50%;\n              background-color: #F1F1F1;\n              border: 1px solid #395D73;\n              cursor: pointer; }\n\n.viewer .node-container .node .node-body .port-container .port .port-grip.isFunction {\n                border-style: dashed;\n                background-color: gray;\n                border-radius: 0px; }\n\n.viewer .node-container .node .node-body .port-container .port .port-grip.selected {\n                border: 2px solid #8AA8C0;\n                background-color: #F0BFA0; }\n\n.viewer .node-container .node .node-body .port-container .port .port-grip:hover {\n                background-color: #F0BFA0; }\n\n.viewer .node-container .node .node-body .port-container .port .port-name {\n              font-size: 12px;\n              margin: 0px 5px; }\n\n.viewer .node-container .node .node-body .port-container .port .port-name.isFunction {\n                color: black;\n                font-size: 9.6px; }\n\n.viewer .node-container .node .node-body .port-container .port.input {\n              justify-content: flex-start;\n              margin-left: -7.5px; }\n\n.viewer .node-container .node .node-body .port-container .port.output {\n              justify-content: flex-end;\n              margin-right: -7.5px; }\n\n.viewer .node-container .node:active {\n        cursor: none; }\n"

/***/ }),

/***/ "./src/app/views/view-flowchart/view-flowchart.component.ts":
/*!******************************************************************!*\
  !*** ./src/app/views/view-flowchart/view-flowchart.component.ts ***!
  \******************************************************************/
/*! exports provided: ViewFlowchartComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewFlowchartComponent", function() { return ViewFlowchartComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _models_node__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @models/node */ "./src/app/shared/models/node/index.ts");
/* harmony import */ var _node_node_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node/node.actions */ "./src/app/views/view-flowchart/node/node.actions.ts");
/* harmony import */ var circular_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! circular-json */ "./node_modules/circular-json/build/circular-json.node.js");
/* harmony import */ var circular_json__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(circular_json__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @services */ "./src/app/core/services/index.ts");
/* harmony import */ var _models_flowchart__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @models/flowchart */ "./src/app/shared/models/flowchart/index.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






// import size of the canvas


var ViewFlowchartComponent = /** @class */ (function () {
    function ViewFlowchartComponent(dataService, router) {
        this.dataService = dataService;
        this.router = router;
        this.switch = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.viewbox = "0 0 " + _models_flowchart__WEBPACK_IMPORTED_MODULE_6__["canvasSize"] + " " + _models_flowchart__WEBPACK_IMPORTED_MODULE_6__["canvasSize"];
        this.startCoords = [];
        // variable for flowchart zooming
        this.mousePos = [0, 0];
        this.zoom = 10;
        this.minZoom = 5;
        this.maxZoom = 25;
        this.zoomFactor = 1;
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
    ViewFlowchartComponent_1 = ViewFlowchartComponent;
    ViewFlowchartComponent.enableNode = function (node) {
        for (var _i = 0, _a = node.input.edges; _i < _a.length; _i++) {
            var edge = _a[_i];
            if (!edge.source.parentNode.enabled) {
                return;
            }
        }
        node.enabled = true;
        for (var _b = 0, _c = node.output.edges; _b < _c.length; _b++) {
            var edge = _c[_b];
            ViewFlowchartComponent_1.enableNode(edge.target.parentNode);
        }
    };
    ViewFlowchartComponent.disableNode = function (node) {
        node.enabled = false;
        for (var _i = 0, _a = node.output.edges; _i < _a.length; _i++) {
            var edge = _a[_i];
            ViewFlowchartComponent_1.disableNode(edge.target.parentNode);
        }
    };
    ViewFlowchartComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.canvas = document.getElementById('svg-canvas');
        // const panZoom = svgPanZoom(this.canvas);
        var bRect = this.canvas.getBoundingClientRect();
        var boundingDiv = document.getElementById('flowchart-main-container').getBoundingClientRect();
        this.offset = [bRect.left, bRect.top];
        /*
        */
        // transform
        if (!this.dataService.flowchartPos) {
            this.dataService.flowchartPos = 'matrix(' + this.zoom + ', 0, 0,' + this.zoom + ', -' +
                boundingDiv.width * this.zoom / 2 + ', -' + boundingDiv.width * this.zoom / 2 + ')';
        }
        else {
            this.zoom = Number(this.dataService.flowchartPos.split(',')[0].split('(')[1]);
        }
        this.canvas.style.transition = 'transform 0ms ease-in';
        this.canvas.style.transformOrigin = "top left";
        this.canvas.style.transform = this.dataService.flowchartPos;
        // copy: copy node
        this.copySub = this.copyListener.subscribe(function (val) {
            if (!_this.listenerActive) {
                return;
            }
            var node = _this.dataService.flowchart.nodes[_this.dataService.flowchart.meta.selected_nodes[0]];
            if (node.type !== 'start' && node.type !== 'end') {
                console.log('copied node:', node);
                var cp = circular_json__WEBPACK_IMPORTED_MODULE_3__["parse"](circular_json__WEBPACK_IMPORTED_MODULE_3__["stringify"](node));
                _this.copied = circular_json__WEBPACK_IMPORTED_MODULE_3__["stringify"](cp);
            }
        });
        // paste: paste copied node
        this.pasteSub = this.pasteListener.subscribe(function (val) {
            if (!_this.listenerActive) {
                return;
            }
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
                    // const bRect = this.canvas.getBoundingClientRect();
                    ctm.a = ctm.a * _this.zoom;
                    ctm.d = ctm.d * _this.zoom;
                    ctm.e = bRect.x;
                    ctm.f = bRect.y;
                    svgP = pt.matrixTransform(ctm.inverse());
                }
                else {
                    svgP = pt.matrixTransform(_this.canvas.getScreenCTM().inverse());
                }
                _models_node__WEBPACK_IMPORTED_MODULE_1__["NodeUtils"].updateNode(newNode, svgP);
                _this.dataService.flowchart.nodes.push(newNode);
                console.log('pasting node:', newNode);
            }
        });
        // delete: delete selected edge(s)
        this.keydownSub = this.keydownListener.subscribe(function (val) {
            if (!_this.listenerActive) {
                return;
            }
            if (val.key === 'Delete') {
                _this.deleteSelectedEdges();
            }
        });
    };
    ViewFlowchartComponent.prototype.ngAfterViewInit = function () {
        if (this.dataService.newFlowchart) {
            this.focusFlowchart();
            this.dataService.newFlowchart = false;
        }
    };
    /*
    handle event received from node component
    */
    ViewFlowchartComponent.prototype.nodeAction = function (event, node_index) {
        switch (event.action) {
            // switch the viewchild of the appModule to the node's procedure view when double-click on the node
            case _node_node_actions__WEBPACK_IMPORTED_MODULE_2__["ACTIONS"].PROCEDURE:
                this.router.navigate(['/editor']);
                // this.switch.emit('editor');
                this.deactivateKeyEvent();
                break;
            // select a node
            case _node_node_actions__WEBPACK_IMPORTED_MODULE_2__["ACTIONS"].SELECT:
                this.dataService.flowchart.meta.selected_nodes = [node_index];
                break;
            // initiate dragging node
            case _node_node_actions__WEBPACK_IMPORTED_MODULE_2__["ACTIONS"].DRAGNODE:
                this.element = this.dataService.flowchart.nodes[node_index];
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
                if (this.startCoords[0] === NaN) {
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
                if (event.type === 'input') {
                    this.edge.target = event.data;
                }
                else {
                    this.edge.source = event.data;
                }
                this.startType = event.type;
                // modify the temporary-edge's coordinate
                this.element = document.getElementById('temporary-wire');
                this.element.setAttribute('x1', event.position[0]);
                this.element.setAttribute('y1', event.position[1]);
                this.element.setAttribute('x2', event.position[0]);
                this.element.setAttribute('y2', event.position[1]);
                this.isDown = 3;
                break;
        }
    };
    // check if the node at node_index is selected
    ViewFlowchartComponent.prototype.isSelected = function (node_index) {
        return this.dataService.flowchart.meta.selected_nodes.indexOf(node_index) > -1;
    };
    // add a new node
    ViewFlowchartComponent.prototype.addNode = function () {
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
        this.dataService.flowchart.nodes.push(newNode);
    };
    // activate event listener for copy (ctrl+c), paste (ctrl+v), delete (Delete) when mouse hover over the svg component
    ViewFlowchartComponent.prototype.activateKeyEvent = function () {
        this.listenerActive = true;
    };
    // deactivate the event listeners when the mouse exit the svg component
    ViewFlowchartComponent.prototype.deactivateKeyEvent = function (event) {
        this.listenerActive = false;
        if (this.isDown) {
            this.handleMouseUp(event);
        }
    };
    // delete selected node
    ViewFlowchartComponent.prototype.deleteSelectedNodes = function () {
        // for each of the selected node
        while (this.dataService.flowchart.meta.selected_nodes.length > 0) {
            var node_index = this.dataService.flowchart.meta.selected_nodes.pop();
            var node = this.dataService.flowchart.nodes[node_index];
            // continue if the node is a start/end node
            if (node.type === 'start' || node.type === 'end') {
                continue;
            }
            var edge_index = 0;
            // delete all the edges connected to the node
            while (edge_index < this.dataService.flowchart.edges.length) {
                var tbrEdge = this.dataService.flowchart.edges[edge_index];
                if (tbrEdge.target.parentNode === node || tbrEdge.source.parentNode === node) {
                    this.deleteEdge(edge_index, node.id);
                    continue;
                }
                edge_index += 1;
            }
            // remove the node from the flowchart
            this.dataService.flowchart.nodes.splice(Number(node_index), 1);
        }
    };
    // delete an edge with a known index
    ViewFlowchartComponent.prototype.deleteEdge = function (edge_index, deletedNode) {
        var tbrEdge = this.dataService.flowchart.edges[edge_index];
        // remove the edge from the target node's list of edges
        for (var i in this.dataService.flowchart.edges) {
            if (tbrEdge.target.edges[i] === tbrEdge) {
                tbrEdge.target.edges.splice(Number(i), 1);
                break;
            }
        }
        // remove the edge from the source node's list of edges
        for (var i in tbrEdge.source.edges) {
            if (tbrEdge.source.edges[i] === tbrEdge) {
                tbrEdge.source.edges.splice(Number(i), 1);
                break;
            }
        }
        if (tbrEdge.target.parentNode.input.edges.length === 0 && deletedNode !== tbrEdge.target.parentNode.id) {
            ViewFlowchartComponent_1.disableNode(tbrEdge.target.parentNode);
        }
        else {
            ViewFlowchartComponent_1.enableNode(tbrEdge.target.parentNode);
        }
        // remove the edge from the general list of edges
        this.dataService.flowchart.edges.splice(edge_index, 1);
        this.dataService.flowchart.ordered = false;
    };
    // delete all the selected edges
    ViewFlowchartComponent.prototype.deleteSelectedEdges = function () {
        this.selectedEdge.sort().reverse();
        for (var _i = 0, _a = this.selectedEdge; _i < _a.length; _i++) {
            var edge_index = _a[_i];
            this.deleteEdge(edge_index, undefined);
        }
        this.selectedEdge = [];
    };
    // select an edge
    ViewFlowchartComponent.prototype.selectEdge = function (event, edge_index) {
        // if ctrl is pressed, add the edge into the list of selected edges
        if (event === 'ctrl') {
            this.selectedEdge.push(edge_index);
            this.dataService.flowchart.edges[edge_index].selected = true;
        }
        else if (event === 'single' || (event === false && this.selectedEdge.length > 1)) {
            if (this.selectedEdge.length > 0) {
                for (var _i = 0, _a = this.selectedEdge; _i < _a.length; _i++) {
                    var e = _a[_i];
                    this.dataService.flowchart.edges[e].selected = false;
                }
            }
            this.selectedEdge = [edge_index];
            this.dataService.flowchart.edges[edge_index].selected = true;
        }
        else {
            this.dataService.flowchart.edges[edge_index].selected = false;
            for (var i = 0; i < this.selectedEdge.length; i++) {
                if (this.selectedEdge[i] === edge_index) {
                    this.selectedEdge.splice(i, 1);
                    break;
                }
            }
        }
    };
    // focus view onto the flowchart
    ViewFlowchartComponent.prototype.focusFlowchart = function () {
        // find the frame of the flowchart: frame = [minX, minY, maxX, maxY]
        var frame = [this.dataService.flowchart.nodes[0].position.x, this.dataService.flowchart.nodes[0].position.y,
            this.dataService.flowchart.nodes[0].position.x, this.dataService.flowchart.nodes[0].position.y];
        for (var _i = 0, _a = this.dataService.flowchart.nodes; _i < _a.length; _i++) {
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
        frame[3] += 150;
        // calculate the zoom to fit the whole flowchart
        var bRect = this.canvas.getBoundingClientRect();
        var ctm = this.canvas.getScreenCTM();
        var zoom = bRect.width / (ctm.a * (frame[2] - frame[0]));
        var heightZoom = bRect.height / (ctm.d * (frame[3] - frame[1]));
        if (zoom > heightZoom) {
            zoom = heightZoom;
        }
        if (zoom > this.maxZoom) {
            zoom = this.maxZoom;
        }
        else if (zoom < this.minZoom) {
            zoom = this.minZoom;
        }
        // calculate the difference between height and width, if height is bigger than width,
        // centering the flowchart based on the difference
        var height_width_diff = ((frame[3] - frame[1]) - (frame[2] - frame[0])) / 2;
        if (height_width_diff > 0) {
            frame[0] -= height_width_diff;
        }
        // if the minX or minY goes below 0 (outside of svg frame), change them back to 0
        if (frame[0] < 0) {
            frame[0] = 0;
        }
        if (frame[1] < 0) {
            frame[1] = 0;
        }
        // transform
        this.dataService.flowchartPos = "matrix(" + zoom + ",0,0," + zoom + "," + -frame[0] * ctm.a *
            zoom / this.zoom + "," + -frame[1] * ctm.a * zoom / this.zoom + ")";
        this.canvas.style.transform = this.dataService.flowchartPos;
        this.zoom = zoom;
    };
    // scale view on mouse wheel
    ViewFlowchartComponent.prototype.scale = function (event) {
        event.preventDefault();
        event.stopPropagation();
        // calculate new zoom value
        var value = this.zoom - (Math.sign(event.deltaY)) * this.zoomFactor;
        // limit the zoom value to be between 1 and 2.5
        if (value >= this.minZoom && value <= this.maxZoom) {
            value = Number((value).toPrecision(5));
        }
        else {
            return;
        }
        /*
        // VER 1: translate before and after re-scaling
        this.mousePos = [event.pageX - this.offset[0], event.pageY - this.offset[1]];

        const bRect = <DOMRect>this.canvas.getBoundingClientRect();
        const beforeX = this.mousePos[0] - bRect.x + this.offset[0];
        const beforeY = this.mousePos[1] - bRect.y + this.offset[1];

        const afterX = beforeX / value + this.mousePos[0] * (value - this.zoom);
        const afterY = beforeY / value + this.mousePos[1] * (value - this.zoom);

        // find transformation matrix
        const m = this.canvas.createSVGMatrix()
        .translate(beforeX / this.zoom, beforeY / this.zoom)
        .scale(value)
        .translate(-afterX, -afterY);

        this.dataService.flowchartPos = 'matrix(' + m.a + ',' + m.b + ',' + m.c + ',' + m.d + ',' + m.e + ',' + m.f + ')';
        */
        /*
        // VER 2 : transform relative to the top-left of the bounding box of the canvas and adjust based on mouse position

        this.mousePos = [event.pageX - this.offset[0], event.pageY - this.offset[1]];

        const bRect = <DOMRect>this.canvas.getBoundingClientRect();
        let newX = (bRect.left - this.offset[0] - this.mousePos[0] * (value - this.zoom)) / this.zoom;
        let newY = (bRect.top - this.offset[1]  - this.mousePos[1] * (value - this.zoom)) / this.zoom;
        const boundingDiv = <DOMRect>document.getElementById('flowchart-main-container').getBoundingClientRect();

        const m = this.canvas.createSVGMatrix()
        .scale(value)
        .translate(newX, newY);

        newX = m.e;
        newY = m.f;

        if (newX > 0) {
            newX = 0;
        } else if (boundingDiv.width - newX > bRect.width * value / this.zoom) {
            newX = boundingDiv.width - bRect.width * value / this.zoom;
        }
        if (newY > 0) {
            newY = 0;
        } else if (boundingDiv.height - newY > bRect.height * value / this.zoom) {
            newY = boundingDiv.height - bRect.height * value / this.zoom;
        }
        if (newY > 0) { newY = 0; }


        this.dataService.flowchartPos = 'matrix(' + value + ', 0, 0,' + value + ',' + newX + ',' + newY + ')';
        */
        /*
        // VER 3: transform relative to the center of the canvas

        const bRect = <DOMRect>this.canvas.getBoundingClientRect();
        const boundingDiv = <DOMRect>document.getElementById('flowchart-main-container').getBoundingClientRect();

        let newX = (bRect.left - this.offset[0]) / this.zoom;
        let newY = (bRect.top - this.offset[1] ) / this.zoom;


        const m = this.canvas.createSVGMatrix()
        .scale(value)
        .translate(newX, newY);

        newX = m.e - boundingDiv.width * (value - this.zoom) / (2 * this.zoom);
        newY = m.f - boundingDiv.width * (value - this.zoom) / (2 * this.zoom);

        if (newX > 0) {
            newX = 0;
        } else if (boundingDiv.width - newX > bRect.width * value / this.zoom) {
            newX = boundingDiv.width - bRect.width * value / this.zoom;
        }
        if (newY > 0) {
            newY = 0;
        } else if (boundingDiv.height - newY > bRect.height * value / this.zoom) {
            newY = boundingDiv.height - bRect.height * value / this.zoom;
        }
        if (newY > 0) { newY = 0; }
        */
        // VER 4: transform relative to the mouse position
        this.mousePos = [event.pageX - this.offset[0], event.pageY - this.offset[1]];
        var bRect = this.canvas.getBoundingClientRect();
        var boundingDiv = document.getElementById('flowchart-main-container').getBoundingClientRect();
        var newX = ((bRect.left - this.offset[0]) * value - this.mousePos[0] * (value - this.zoom)) / this.zoom;
        var newY = ((bRect.top - this.offset[1]) * value - this.mousePos[1] * (value - this.zoom)) / this.zoom;
        // snapping back the x and y coordinates if the zoom goes out of the bounding box
        if (newX > 0) {
            newX = 0;
        }
        else if (boundingDiv.width - newX > bRect.width * value / this.zoom) {
            newX = boundingDiv.width - bRect.width * value / this.zoom;
        }
        if (newY > 0) {
            newY = 0;
        }
        else if (boundingDiv.height - newY > bRect.height * value / this.zoom) {
            newY = boundingDiv.height - bRect.height * value / this.zoom;
        }
        if (newY > 0) {
            newY = 0;
        }
        this.dataService.flowchartPos = 'matrix(' + value + ', 0, 0,' + value + ',' + newX + ',' + newY + ')';
        // transform
        this.canvas.style.transform = this.dataService.flowchartPos;
        this.zoom = value;
    };
    // initiate dragging the view window
    ViewFlowchartComponent.prototype.panStart = function (event) {
        event.preventDefault();
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
    ViewFlowchartComponent.prototype.handleMouseMove = function (event) {
        // return if no dragging initiated
        if (!this.isDown) {
            return;
            // if drag view
        }
        else if (this.isDown === 1) {
            event.preventDefault();
            var bRect = this.canvas.getBoundingClientRect();
            var x = Number(event.clientX - this.startCoords[0]);
            var y = Number(event.clientY - this.startCoords[1]);
            var boundingDiv = document.getElementById('flowchart-main-container').getBoundingClientRect();
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
            this.dataService.flowchartPos = 'matrix(' + this.zoom + ',0,0,' + this.zoom + ',' + x + ',' + y + ')';
            this.canvas.style.transform = this.dataService.flowchartPos;
            // if drag node
        }
        else if (this.isDown === 2) {
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
        else if (this.isDown === 3) {
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
    ViewFlowchartComponent.prototype.handleMouseUp = function (event) {
        this.element = undefined;
        if (this.isDown === 3) {
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
            var tempLine = document.getElementById('temporary-wire');
            tempLine.setAttribute('x1', '0');
            tempLine.setAttribute('y1', '0');
            tempLine.setAttribute('x2', '0');
            tempLine.setAttribute('y2', '0');
            // go through all of the nodes' input/output ports
            for (var _i = 0, _a = this.dataService.flowchart.nodes; _i < _a.length; _i++) {
                var n = _a[_i];
                var pPos = void 0;
                // find the node's corresponding port and its position
                if (this.startType === 'input') {
                    if (this.edge.target.parentNode === n || n.type === 'end') {
                        continue;
                    }
                    this.edge.source = n.output;
                    pPos = [n.position.x + this.outputOffset[0], n.position.y + this.outputOffset[1]];
                }
                else {
                    if (this.edge.source.parentNode === n || n.type === 'start') {
                        continue;
                    }
                    this.edge.target = n.input;
                    pPos = [n.position.x + this.inputOffset[0], n.position.y + this.inputOffset[1]];
                }
                // if the distance between the port's position and the dropped position is bigger than 15px, continue
                if (Math.abs(pPos[0] - svgP.x) > this.maxZoom || Math.abs(pPos[1] - svgP.y) > this.maxZoom) {
                    continue;
                }
                // if there is already an existing edge with the same source and target as the new edge, return
                for (var _b = 0, _c = this.dataService.flowchart.edges; _b < _c.length; _b++) {
                    var edge = _c[_b];
                    if (edge.target === this.edge.target && edge.source === this.edge.source) {
                        this.isDown = 0;
                        return;
                    }
                }
                this.edge.target.edges.push(this.edge);
                this.edge.source.edges.push(this.edge);
                this.dataService.flowchart.edges.push(this.edge);
                this.dataService.flowchart.ordered = false;
                if (this.edge.source.parentNode.enabled) {
                    ViewFlowchartComponent_1.enableNode(this.edge.target.parentNode);
                }
                else {
                    ViewFlowchartComponent_1.disableNode(this.edge.target.parentNode);
                }
                break;
            }
        }
        this.isDown = 0;
    };
    ViewFlowchartComponent.prototype.newfile = function () {
        document.getElementById('newfile').click();
        this.focusFlowchart();
    };
    ViewFlowchartComponent.prototype.viewerData = function () {
        var node = this.dataService.flowchart.nodes[this.dataService.flowchart.meta.selected_nodes[0]];
        if (!node) {
            return '';
        }
        if (node.type === 'output') {
            return node.input.value;
        }
        return node.output.value;
    };
    ViewFlowchartComponent.prototype.setSplit = function (e) { this.dataService.splitVal = e.sizes[1]; };
    var ViewFlowchartComponent_1;
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ViewFlowchartComponent.prototype, "switch", void 0);
    ViewFlowchartComponent = ViewFlowchartComponent_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'view-flowchart',
            template: __webpack_require__(/*! ./view-flowchart.component.html */ "./src/app/views/view-flowchart/view-flowchart.component.html"),
            styles: [__webpack_require__(/*! ./view-flowchart.component.scss */ "./src/app/views/view-flowchart/view-flowchart.component.scss")]
        }),
        __metadata("design:paramtypes", [_services__WEBPACK_IMPORTED_MODULE_5__["DataService"], _angular_router__WEBPACK_IMPORTED_MODULE_7__["Router"]])
    ], ViewFlowchartComponent);
    return ViewFlowchartComponent;
}());



/***/ }),

/***/ "./src/app/views/view-flowchart/view-flowchart.module.ts":
/*!***************************************************************!*\
  !*** ./src/app/views/view-flowchart/view-flowchart.module.ts ***!
  \***************************************************************/
/*! exports provided: ViewFlowchartModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewFlowchartModule", function() { return ViewFlowchartModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _view_flowchart_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./view-flowchart.component */ "./src/app/views/view-flowchart/view-flowchart.component.ts");
/* harmony import */ var _node_node_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node/node.component */ "./src/app/views/view-flowchart/node/node.component.ts");
/* harmony import */ var _edge_edge_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./edge/edge.component */ "./src/app/views/view-flowchart/edge/edge.component.ts");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @shared/shared.module */ "./src/app/shared/shared.module.ts");
/* harmony import */ var _view_flowchart_routing_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./view-flowchart-routing.module */ "./src/app/views/view-flowchart/view-flowchart-routing.module.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// import @angular stuff



// import app components





/**
 * ViewFlowchartModule
 */
var ViewFlowchartModule = /** @class */ (function () {
    function ViewFlowchartModule() {
    }
    ViewFlowchartModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            declarations: [
                _view_flowchart_component__WEBPACK_IMPORTED_MODULE_3__["ViewFlowchartComponent"],
                _node_node_component__WEBPACK_IMPORTED_MODULE_4__["NodeComponent"],
                _edge_edge_component__WEBPACK_IMPORTED_MODULE_5__["EdgeComponent"],
            ],
            exports: [_view_flowchart_component__WEBPACK_IMPORTED_MODULE_3__["ViewFlowchartComponent"]],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_6__["SharedModule"],
                _view_flowchart_routing_module__WEBPACK_IMPORTED_MODULE_7__["ViewFlowchartRoutingModule"]
            ],
            entryComponents: [],
            providers: []
        }),
        __metadata("design:paramtypes", [])
    ], ViewFlowchartModule);
    return ViewFlowchartModule;
}());



/***/ }),

/***/ "./src/app/views/view-gallery/simple-name.pipe.ts":
/*!********************************************************!*\
  !*** ./src/app/views/view-gallery/simple-name.pipe.ts ***!
  \********************************************************/
/*! exports provided: SimpleNamePipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SimpleNamePipe", function() { return SimpleNamePipe; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

/*
 * Shortens a name to a certain length and appends "..." infront of it
 * Usage:
 *   value | length:number
 * Example:
 *   {{ "some_very_long_string" | length:7 }}
 *   formats to: some_ve...
*/
var SimpleNamePipe = /** @class */ (function () {
    function SimpleNamePipe() {
    }
    SimpleNamePipe.prototype.transform = function (value) {
        if (value.endsWith('.mob')) {
            value = value.substr(0, value.length - 4);
        }
        value = value.split('_').join(' ');
        value = value.split('-').join(' ');
        return value;
    };
    SimpleNamePipe = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Pipe"])({ name: 'simplename' })
    ], SimpleNamePipe);
    return SimpleNamePipe;
}());



/***/ }),

/***/ "./src/app/views/view-gallery/view-gallery-routing.module.ts":
/*!*******************************************************************!*\
  !*** ./src/app/views/view-gallery/view-gallery-routing.module.ts ***!
  \*******************************************************************/
/*! exports provided: ViewGalleryRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewGalleryRoutingModule", function() { return ViewGalleryRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _view_gallery_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./view-gallery.component */ "./src/app/views/view-gallery/view-gallery.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var routes = [
    {
        path: '',
        component: _view_gallery_component__WEBPACK_IMPORTED_MODULE_2__["ViewGalleryComponent"],
        children: []
    }
];
var ViewGalleryRoutingModule = /** @class */ (function () {
    function ViewGalleryRoutingModule() {
    }
    ViewGalleryRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], ViewGalleryRoutingModule);
    return ViewGalleryRoutingModule;
}());



/***/ }),

/***/ "./src/app/views/view-gallery/view-gallery.component.html":
/*!****************************************************************!*\
  !*** ./src/app/views/view-gallery/view-gallery.component.html ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class='container'>\r\n    <as-split direction=\"horizontal\" (dragEnd)='setSplit($event)'>\r\n        <as-split-area [size]=\"100 - dataService.splitVal\">\r\n            <div class='container__header'>\r\n\r\n                <!-- top left tab menu  -->\r\n                <div class=\"tab\">\r\n                    <button class='btn-tab' [class.active]='router.url==\"/gallery\"' [routerLink]=\"'/gallery'\">Gallery</button>\r\n                    <button class='btn-tab' [class.active]='router.url==\"/dashboard\"' [routerLink]=\"'/dashboard'\">Dashboard</button>\r\n                    <button class='btn-tab' [class.active]='router.url==\"/flowchart\"' [routerLink]=\"'/flowchart'\">Flowchart</button>\r\n                    <!--\r\n                    <button class='btn' [class.active]='false' (click)='updateView(\"editor\")'>Procedures</button>\r\n                    -->\r\n                </div>\r\n\r\n                <!-- hidden components (new file, save file, loaf file) for the dropdown menu-->\r\n                <div style=\"display: none;\">\r\n                    <file-new></file-new>\r\n                    <file-save></file-save>\r\n                    <file-load></file-load>        \r\n                </div>\r\n\r\n                <!-- top right dropdown menu -->\r\n                <div class=\"dropmenu\">\r\n                    <!-- execute button -->\r\n                    <div>\r\n                        <execute></execute>\r\n                    </div>\r\n                    <!-- dropdown menu for new file, save file, loaf file-->\r\n                    <div>\r\n                        <button class='btn' mat-icon-button [matMenuTriggerFor]=\"menu\">\r\n                            <mat-icon>more_vert</mat-icon>\r\n                        </button>\r\n                        <mat-menu #menu=\"matMenu\">\r\n                            <button  mat-menu-item onclick=\"document.getElementById('newfile').click();\"\r\n                            title=\"Create New Flowchart\">\r\n                                <mat-icon>rotate_left</mat-icon>\r\n                                <span>New File</span>\r\n                            </button>\r\n                            <button mat-menu-item onclick=\"document.getElementById('savefile').click();\"\r\n                            title=\"Save Flowchart File to Computer\">\r\n                                <mat-icon>save_alt</mat-icon>\r\n                                <span>Save File</span>\r\n                            </button>\r\n                            <button mat-menu-item onclick=\"document.getElementById('file-input').click();\"\r\n                            title=\"Load Flowchart File from Computer\">\r\n                                <mat-icon>launch</mat-icon>\r\n                                <span>Load File</span>\r\n                            </button>\r\n                        </mat-menu>\r\n                    </div>\r\n                    \r\n                </div>\r\n            </div>\r\n            <!-- viewchild content -->\r\n            <div class='content__panel'>\r\n                <h2>Möbius Gallery</h2>\r\n                <hr>\r\n                <h4>Displaying {{ (allFiles | async)?.length}} projects</h4>\r\n                <div class=\"container__element container__element--project-container\">\r\n                    <div class=\"project-container__project\" *ngFor=\"let f of  (allFiles | async)\">\r\n                        <div class=\"project__content\" (click)='loadFile(f)'>\r\n                            {{ f.name | simplename }}\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </as-split-area>\r\n\r\n        <as-split-area [size]=\"dataService.splitVal\">\r\n            <!-- data viewers panel -->\r\n            <div class='content__viewer' >\r\n                <model-viewers-container [data]='viewerData()' [helpView]='helpView'></model-viewers-container>\r\n            </div>\r\n        </as-split-area>\r\n        \r\n    </as-split>\r\n\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/views/view-gallery/view-gallery.component.scss":
/*!****************************************************************!*\
  !*** ./src/app/views/view-gallery/view-gallery.component.scss ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "as-split-area {\n  overflow: hidden !important; }\n\n.container {\n  position: relative;\n  overflow: auto;\n  height: 100%;\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around; }\n\n.container h1, .container h2, .container h3, .container h4, .container h5, .container h6, .container p {\n    margin: 0px;\n    padding: 0px; }\n\n.container .container__header {\n    flex: 0 1 auto;\n    min-height: 35px;\n    display: flex;\n    flex-direction: row;\n    justify-content: space-between;\n    padding: 0px 0px 0px 15px;\n    background-color: #ccc;\n    border-bottom: 3px solid #eeeeee;\n    line-height: 35px;\n    font-size: 18px;\n    font-weight: 600;\n    text-align: center;\n    /* tab styling */\n    /* dropdown menu styling */ }\n\n.container .container__header .tab {\n      border: 2px;\n      overflow: hidden;\n      background-color: #ccc; }\n\n.container .container__header .tab button {\n      display: inline-block;\n      vertical-align: bottom;\n      background-color: inherit;\n      color: #505050;\n      border: none;\n      outline: none;\n      cursor: pointer;\n      padding: 8px 10px;\n      transition: 0.3s;\n      font-size: 14px; }\n\n.container .container__header .tab button:hover {\n      color: blue; }\n\n.container .container__header .tab button.active {\n      background-color: #ccc;\n      color: #000096;\n      font-weight: 600;\n      border-color: #222 !important; }\n\n.container .container__header .dropmenu {\n      display: inline-flex; }\n\n.container .container__content {\n    flex-grow: 1;\n    height: 0px;\n    border: 2px solid #3F4651;\n    overflow: auto; }\n\n.container .container__footer {\n    text-align: center;\n    font-size: 12px;\n    line-height: 18px;\n    background-color: #3F4651;\n    color: #E7BF00; }\n\n.content__panel {\n  background-color: gainsboro;\n  height: 95%;\n  overflow: hidden auto; }\n\n.content__viewer {\n  background-color: gainsboro;\n  height: 100%;\n  overflow: auto; }\n\nul.nav {\n  margin: 0px;\n  padding: 0px; }\n\nli.link {\n  display: inline;\n  border: 2px solid gray;\n  border-radius: 4px;\n  margin: 5px 5px 0px 0px;\n  padding: 5px;\n  text-transform: uppercase;\n  line-height: 12px;\n  font-weight: 600;\n  cursor: pointer;\n  font-size: 12px; }\n\nli.link:hover {\n  background-color: gray;\n  color: white; }\n\nbutton.btn {\n  display: inline-block;\n  vertical-align: middle;\n  margin: 0px 0px 0px 0px;\n  font-size: 12px;\n  line-height: 10px;\n  height: 30px;\n  border: none;\n  border-radius: 4px;\n  background-color: transparent;\n  color: #505050; }\n\nbutton.btn:hover {\n  color: blue; }\n\n.active {\n  background-color: #222;\n  color: white;\n  border-color: #222 !important; }\n\n.container__element {\n  padding: 0px 10% 0px 10%; }\n\n.container__element--project-container {\n  font-size: 26px;\n  line-height: 32px;\n  font-weight: 300;\n  padding-top: 30px;\n  padding-bottom: 30px;\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  overflow: auto; }\n\n.project-container__project {\n  position: relative;\n  width: 25%;\n  height: 150px;\n  min-width: 200px; }\n\n.project-container__project .project__content {\n    height: 90%;\n    width: 90%;\n    font-size: 12px;\n    line-height: 24px;\n    color: #000;\n    overflow: hidden;\n    border-radius: 4px;\n    vertical-align: middle;\n    overflow-wrap: break-word;\n    word-wrap: break-word;\n    word-break: break-word;\n    border: 1px solid #bbb;\n    border-radius: 2px; }\n\n.project-container__project .project__content a {\n      display: block;\n      height: 100%;\n      margin: 10px;\n      text-decoration: none;\n      text-align: center;\n      text-transform: uppercase;\n      color: inherit;\n      font-weight: 600; }\n\n.project-container__project .project__content a:visited {\n        color: inherit; }\n\n.project-container__project .project__content:hover {\n      border-color: #222; }\n\nh2 {\n  color: #505050;\n  text-align: left;\n  padding-left: 15px;\n  font-size: 12px;\n  line-height: 19px; }\n\nh4 {\n  color: #505050;\n  text-align: left;\n  padding-left: 15px;\n  font-size: 12px;\n  line-height: 16px; }\n\np {\n  color: #505050;\n  text-align: left;\n  padding-left: 15px;\n  font-size: 12px;\n  line-height: 14px; }\n\nhr {\n  border-top: 2px solid #eeeeee; }\n"

/***/ }),

/***/ "./src/app/views/view-gallery/view-gallery.component.ts":
/*!**************************************************************!*\
  !*** ./src/app/views/view-gallery/view-gallery.component.ts ***!
  \**************************************************************/
/*! exports provided: ViewGalleryComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewGalleryComponent", function() { return ViewGalleryComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _view_gallery_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./view-gallery.config */ "./src/app/views/view-gallery/view-gallery.config.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @services */ "./src/app/core/services/index.ts");
/* harmony import */ var circular_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! circular-json */ "./node_modules/circular-json/build/circular-json.node.js");
/* harmony import */ var circular_json__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(circular_json__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




// import {Router} from '@angular/router';



var ViewGalleryComponent = /** @class */ (function () {
    function ViewGalleryComponent(http, dataService, router) {
        this.http = http;
        this.dataService = dataService;
        this.router = router;
        this.switch = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.allFiles = this.getFilesFromURL();
    }
    ViewGalleryComponent.prototype.getFilesFromURL = function () {
        return this.http.get(_view_gallery_config__WEBPACK_IMPORTED_MODULE_2__["Constants"].GALLERY_URL, { responseType: 'json' });
    };
    ViewGalleryComponent.prototype.loadFile = function (fl) {
        var _this = this;
        var stream = rxjs__WEBPACK_IMPORTED_MODULE_3__["Observable"].create(function (observer) {
            var request = new XMLHttpRequest();
            request.open('GET', fl.download_url);
            request.onload = function () {
                if (request.status === 200) {
                    var f = circular_json__WEBPACK_IMPORTED_MODULE_5__["parse"](request.responseText);
                    var file = {
                        name: f.name,
                        author: f.author,
                        flowchart: f.flowchart,
                        last_updated: f.last_updated,
                        version: f.version
                    };
                    observer.next(file);
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
            _this.dataService.file = loadeddata;
            _this.dataService.newFlowchart = true;
            if (_this.dataService.node.type !== 'end') {
                for (var i = 0; i < loadeddata.flowchart.nodes.length; i++) {
                    if (loadeddata.flowchart.nodes[i].type === 'end') {
                        loadeddata.flowchart.meta.selected_nodes = [i];
                        break;
                    }
                }
            }
            _this.router.navigate(['/dashboard']);
            document.getElementById('executeButton').click();
        });
    };
    ViewGalleryComponent.prototype.viewerData = function () {
        var node = this.dataService.flowchart.nodes[this.dataService.flowchart.meta.selected_nodes[0]];
        if (!node) {
            return '';
        }
        if (node.type === 'output') {
            return node.input.value;
        }
        return node.output.value;
    };
    ViewGalleryComponent.prototype.setSplit = function (e) { this.dataService.splitVal = e.sizes[1]; };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ViewGalleryComponent.prototype, "switch", void 0);
    ViewGalleryComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'view-gallery',
            template: __webpack_require__(/*! ./view-gallery.component.html */ "./src/app/views/view-gallery/view-gallery.component.html"),
            styles: [__webpack_require__(/*! ./view-gallery.component.scss */ "./src/app/views/view-gallery/view-gallery.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"], _services__WEBPACK_IMPORTED_MODULE_4__["DataService"], _angular_router__WEBPACK_IMPORTED_MODULE_6__["Router"]])
    ], ViewGalleryComponent);
    return ViewGalleryComponent;
}());



/***/ }),

/***/ "./src/app/views/view-gallery/view-gallery.config.ts":
/*!***********************************************************!*\
  !*** ./src/app/views/view-gallery/view-gallery.config.ts ***!
  \***********************************************************/
/*! exports provided: Constants */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Constants", function() { return Constants; });
var Constants = /** @class */ (function () {
    function Constants() {
    }
    Object.defineProperty(Constants, "GALLERY_URL", {
        get: function () {
            return 'https://api.github.com/repos/design-automation/mobius-parametric-modeller/contents/src/assets/gallery?ref=master';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "FILE_URL", {
        get: function () {
            return 'https://raw.githubusercontent.com/design-automation/mobius-gallery/master/examples/';
        },
        enumerable: true,
        configurable: true
    });
    return Constants;
}());



/***/ }),

/***/ "./src/app/views/view-gallery/view-gallery.module.ts":
/*!***********************************************************!*\
  !*** ./src/app/views/view-gallery/view-gallery.module.ts ***!
  \***********************************************************/
/*! exports provided: ViewGalleryModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewGalleryModule", function() { return ViewGalleryModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @shared/shared.module */ "./src/app/shared/shared.module.ts");
/* harmony import */ var _view_gallery_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./view-gallery-routing.module */ "./src/app/views/view-gallery/view-gallery-routing.module.ts");
/* harmony import */ var _view_gallery_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./view-gallery.component */ "./src/app/views/view-gallery/view-gallery.component.ts");
/* harmony import */ var _simple_name_pipe__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./simple-name.pipe */ "./src/app/views/view-gallery/simple-name.pipe.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var ViewGalleryModule = /** @class */ (function () {
    function ViewGalleryModule() {
    }
    ViewGalleryModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            declarations: [
                _view_gallery_component__WEBPACK_IMPORTED_MODULE_4__["ViewGalleryComponent"],
                _simple_name_pipe__WEBPACK_IMPORTED_MODULE_5__["SimpleNamePipe"]
            ],
            exports: [],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _view_gallery_routing_module__WEBPACK_IMPORTED_MODULE_3__["ViewGalleryRoutingModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__["SharedModule"]
            ],
            entryComponents: [],
            providers: []
        }),
        __metadata("design:paramtypes", [])
    ], ViewGalleryModule);
    return ViewGalleryModule;
}());



/***/ }),

/***/ "./src/assets/typedoc-json/doc.json":
/*!******************************************!*\
  !*** ./src/assets/typedoc-json/doc.json ***!
  \******************************************/
/*! exports provided: id, name, kind, flags, children, groups, default */
/***/ (function(module) {

module.exports = {"id":0,"name":"mobius-parametric-modeller","kind":0,"flags":{},"children":[{"id":674,"name":"\"app/core/modules/Model\"","kind":1,"kindString":"External module","flags":{"isExported":true},"originalName":"C:/Users/akibdpt/Documents/Angular/mobius-parametric-modeller/src/app/core/modules/Model.ts","children":[{"id":683,"name":"__merge__","kind":64,"kindString":"Function","flags":{"isExported":true},"signatures":[{"id":684,"name":"__merge__","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Merges the second model into the first model. The geometry, attribues, and groups are all merged.\nIf the models contain contain groups with the same names, then the groups will be merged."},"parameters":[{"id":685,"name":"model1","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"The model to merge into."},"type":{"type":"reference","name":"GIModel","id":650}},{"id":686,"name":"model2","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"The model to merge from    .\n"},"type":{"type":"reference","name":"GIModel","id":650}}],"type":{"type":"intrinsic","name":"void"}}],"sources":[{"fileName":"app/core/modules/Model.ts","line":47,"character":25}]},{"id":675,"name":"__new__","kind":64,"kindString":"Function","flags":{"isExported":true},"signatures":[{"id":676,"name":"__new__","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Creates a new empty model.","returns":"New model empty.\n"},"type":{"type":"reference","name":"GIModel","id":650}}],"sources":[{"fileName":"app/core/modules/Model.ts","line":13,"character":23}]},{"id":680,"name":"__postprocess__","kind":64,"kindString":"Function","flags":{"isExported":true},"signatures":[{"id":681,"name":"__postprocess__","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"A function to postprocess the model, after it enters the node."},"parameters":[{"id":682,"name":"__model__","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"reference","name":"GIModel","id":650}}],"type":{"type":"intrinsic","name":"void"}}],"sources":[{"fileName":"app/core/modules/Model.ts","line":35,"character":31}]},{"id":677,"name":"__preprocess__","kind":64,"kindString":"Function","flags":{"isExported":true},"signatures":[{"id":678,"name":"__preprocess__","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"A function to preprocess the model, before it enters the node.\nIn cases where there is more than one model connected to a node,\nthe preprocess function will be called before the merge function."},"parameters":[{"id":679,"name":"__model__","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"reference","name":"GIModel","id":650}}],"type":{"type":"intrinsic","name":"void"}}],"sources":[{"fileName":"app/core/modules/Model.ts","line":26,"character":30}]},{"id":687,"name":"__stringify__","kind":64,"kindString":"Function","flags":{"isExported":true},"signatures":[{"id":688,"name":"__stringify__","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Returns a string representation of this model."},"parameters":[{"id":689,"name":"__model__","kind":32768,"kindString":"Parameter","flags":{},"comment":{"shortText":"\n"},"type":{"type":"reference","name":"GIModel","id":650}}],"type":{"type":"intrinsic","name":"string"}}],"sources":[{"fileName":"app/core/modules/Model.ts","line":54,"character":29}]},{"id":690,"name":"addData","kind":64,"kindString":"Function","flags":{"isExported":true},"signatures":[{"id":691,"name":"addData","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Add new data to the model.","returns":"New model if successful, null if unsuccessful or on error.\n"},"parameters":[{"id":692,"name":"__model__","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"reference","name":"GIModel","id":650}},{"id":693,"name":"model_data","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"The model data in gs-json format."},"type":{"type":"reference","name":"IModelData","id":29}}],"type":{"type":"intrinsic","name":"void"}}],"sources":[{"fileName":"app/core/modules/Model.ts","line":68,"character":23}]},{"id":711,"name":"addLinestring","kind":64,"kindString":"Function","flags":{"isExported":true},"signatures":[{"id":712,"name":"addLinestring","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Adds a new linestring to the model."},"parameters":[{"id":713,"name":"__model__","kind":32768,"kindString":"Parameter","flags":{},"comment":{},"type":{"type":"reference","name":"GIModel","id":650}},{"id":714,"name":"positions","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"array","elementType":{"type":"intrinsic","name":"string"}}}],"type":{"type":"intrinsic","name":"string"}}],"sources":[{"fileName":"app/core/modules/Model.ts","line":117,"character":29}]},{"id":707,"name":"addPoint","kind":64,"kindString":"Function","flags":{"isExported":true},"signatures":[{"id":708,"name":"addPoint","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Adds a new point to the model."},"parameters":[{"id":709,"name":"__model__","kind":32768,"kindString":"Parameter","flags":{},"comment":{},"type":{"type":"reference","name":"GIModel","id":650}},{"id":710,"name":"position","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"string"}}],"type":{"type":"intrinsic","name":"string"}}],"sources":[{"fileName":"app/core/modules/Model.ts","line":109,"character":24}]},{"id":715,"name":"addPolygon","kind":64,"kindString":"Function","flags":{"isExported":true},"signatures":[{"id":716,"name":"addPolygon","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Adds a new polygon to the model."},"parameters":[{"id":717,"name":"__model__","kind":32768,"kindString":"Parameter","flags":{},"comment":{},"type":{"type":"reference","name":"GIModel","id":650}},{"id":718,"name":"positions","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"array","elementType":{"type":"intrinsic","name":"string"}}}],"type":{"type":"intrinsic","name":"string"}}],"sources":[{"fileName":"app/core/modules/Model.ts","line":125,"character":26}]},{"id":703,"name":"addPosition","kind":64,"kindString":"Function","flags":{"isExported":true},"signatures":[{"id":704,"name":"addPosition","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Adds a new position to the model."},"parameters":[{"id":705,"name":"__model__","kind":32768,"kindString":"Parameter","flags":{},"comment":{},"type":{"type":"reference","name":"GIModel","id":650}},{"id":706,"name":"coords","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"\n"},"type":{"type":"reference","name":"TCoord","id":32}}],"type":{"type":"intrinsic","name":"string"}}],"sources":[{"fileName":"app/core/modules/Model.ts","line":99,"character":27}]},{"id":697,"name":"numLinestrings","kind":64,"kindString":"Function","flags":{"isExported":true},"signatures":[{"id":698,"name":"numLinestrings","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":" Gets the number of linestrings in the model."},"parameters":[{"id":699,"name":"__model__","kind":32768,"kindString":"Parameter","flags":{},"comment":{"shortText":"\n"},"type":{"type":"reference","name":"GIModel","id":650}}],"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"app/core/modules/Model.ts","line":84,"character":30}]},{"id":694,"name":"numPoints","kind":64,"kindString":"Function","flags":{"isExported":true},"signatures":[{"id":695,"name":"numPoints","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":" Gets the number of points in the model."},"parameters":[{"id":696,"name":"__model__","kind":32768,"kindString":"Parameter","flags":{},"comment":{"shortText":"\n"},"type":{"type":"reference","name":"GIModel","id":650}}],"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"app/core/modules/Model.ts","line":77,"character":25}]},{"id":700,"name":"numPolygons","kind":64,"kindString":"Function","flags":{"isExported":true},"signatures":[{"id":701,"name":"numPolygons","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":" Gets the number of polygons in the model."},"parameters":[{"id":702,"name":"__model__","kind":32768,"kindString":"Parameter","flags":{},"comment":{"shortText":"\n"},"type":{"type":"reference","name":"GIModel","id":650}}],"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"app/core/modules/Model.ts","line":91,"character":27}]}],"groups":[{"title":"Functions","kind":64,"children":[683,675,680,677,687,690,711,707,715,703,697,694,700]}],"sources":[{"fileName":"app/core/modules/Model.ts","line":1,"character":0}]},{"id":730,"name":"\"app/core/modules/_parameterTypes\"","kind":1,"kindString":"External module","flags":{"isExported":true},"originalName":"C:/Users/akibdpt/Documents/Angular/mobius-parametric-modeller/src/app/core/modules/_parameterTypes.ts","children":[{"id":731,"name":"_parameterTypes","kind":2097152,"kindString":"Object literal","flags":{"isExported":true,"isConst":true},"children":[{"id":732,"name":"constList","kind":32,"kindString":"Variable","flags":{"isExported":true},"sources":[{"fileName":"app/core/modules/_parameterTypes.ts","line":4,"character":13}],"type":{"type":"intrinsic","name":"string"},"defaultValue":"\"__constList__\""},{"id":734,"name":"input","kind":32,"kindString":"Variable","flags":{"isExported":true},"sources":[{"fileName":"app/core/modules/_parameterTypes.ts","line":6,"character":9}],"type":{"type":"intrinsic","name":"string"},"defaultValue":"\"__input__\""},{"id":737,"name":"merge","kind":32,"kindString":"Variable","flags":{"isExported":true},"sources":[{"fileName":"app/core/modules/_parameterTypes.ts","line":11,"character":9}],"type":{"type":"intrinsic","name":"string"},"defaultValue":"\"Model.__merge__\""},{"id":738,"name":"mergeFn","kind":32,"kindString":"Variable","flags":{"isExported":true},"sources":[{"fileName":"app/core/modules/_parameterTypes.ts","line":12,"character":11}],"type":{"type":"reference","name":"__merge__","id":683},"defaultValue":" __merge__"},{"id":733,"name":"model","kind":32,"kindString":"Variable","flags":{"isExported":true},"sources":[{"fileName":"app/core/modules/_parameterTypes.ts","line":5,"character":9}],"type":{"type":"intrinsic","name":"string"},"defaultValue":"\"__model__\""},{"id":735,"name":"new","kind":32,"kindString":"Variable","flags":{"isExported":true},"sources":[{"fileName":"app/core/modules/_parameterTypes.ts","line":8,"character":7}],"type":{"type":"intrinsic","name":"string"},"defaultValue":"\"Model.__new__\""},{"id":736,"name":"newFn","kind":32,"kindString":"Variable","flags":{"isExported":true},"sources":[{"fileName":"app/core/modules/_parameterTypes.ts","line":9,"character":9}],"type":{"type":"reference","name":"__new__","id":675},"defaultValue":" __new__"},{"id":740,"name":"postprocess","kind":32,"kindString":"Variable","flags":{"isExported":true},"sources":[{"fileName":"app/core/modules/_parameterTypes.ts","line":15,"character":15}],"type":{"type":"intrinsic","name":"string"},"defaultValue":"\"Model.__postprocess__\""},{"id":739,"name":"preprocess","kind":32,"kindString":"Variable","flags":{"isExported":true},"sources":[{"fileName":"app/core/modules/_parameterTypes.ts","line":14,"character":14}],"type":{"type":"intrinsic","name":"string"},"defaultValue":"\"Model.__preprocess__\""}],"groups":[{"title":"Variables","kind":32,"children":[732,734,737,738,733,735,736,740,739]}],"sources":[{"fileName":"app/core/modules/_parameterTypes.ts","line":3,"character":28}],"type":{"type":"intrinsic","name":"object"}}],"groups":[{"title":"Object literals","kind":2097152,"children":[731]}],"sources":[{"fileName":"app/core/modules/_parameterTypes.ts","line":1,"character":0}]},{"id":741,"name":"\"app/core/modules/index\"","kind":1,"kindString":"External module","flags":{"isExported":true},"originalName":"C:/Users/akibdpt/Documents/Angular/mobius-parametric-modeller/src/app/core/modules/index.ts","sources":[{"fileName":"app/core/modules/index.ts","line":1,"character":0}]},{"id":719,"name":"\"app/core/modules/input\"","kind":1,"kindString":"External module","flags":{"isExported":true},"originalName":"C:/Users/akibdpt/Documents/Angular/mobius-parametric-modeller/src/app/core/modules/input.ts","children":[{"id":720,"name":"declare_constant","kind":64,"kindString":"Function","flags":{"isExported":true},"signatures":[{"id":721,"name":"declare_constant","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Declare a new constant for the input node","returns":"Void\n","tags":[{"tag":"summary","text":"Declare new constant\n"}]},"parameters":[{"id":722,"name":"__constList__","kind":32768,"kindString":"Parameter","flags":{},"comment":{"shortText":"List of constants to be added."},"type":{"type":"reference","name":"JSON"}},{"id":723,"name":"const_name","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"Name of the constant."},"type":{"type":"intrinsic","name":"string"}},{"id":724,"name":"__input__","kind":32768,"kindString":"Parameter","flags":{},"comment":{"shortText":"Value of the constant.\n"},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"void"}}],"sources":[{"fileName":"app/core/modules/input.ts","line":11,"character":32}]}],"groups":[{"title":"Functions","kind":64,"children":[720]}],"sources":[{"fileName":"app/core/modules/input.ts","line":1,"character":0}]},{"id":725,"name":"\"app/core/modules/output\"","kind":1,"kindString":"External module","flags":{"isExported":true},"originalName":"C:/Users/akibdpt/Documents/Angular/mobius-parametric-modeller/src/app/core/modules/output.ts","children":[{"id":726,"name":"return_value","kind":64,"kindString":"Function","flags":{"isExported":true},"signatures":[{"id":727,"name":"return_value","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Return certain value from the model for the flowchart's end node","returns":"Value\n","tags":[{"tag":"summary","text":"Return a specific value"}]},"parameters":[{"id":728,"name":"__model__","kind":32768,"kindString":"Parameter","flags":{},"comment":{"shortText":"Model of the node."},"type":{"type":"array","elementType":{"type":"intrinsic","name":"any"}}},{"id":729,"name":"index","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"Index of the value to be returned."},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"intrinsic","name":"any"}}],"sources":[{"fileName":"app/core/modules/output.ts","line":9,"character":28}]}],"groups":[{"title":"Functions","kind":64,"children":[726]}],"sources":[{"fileName":"app/core/modules/output.ts","line":1,"character":0}]},{"id":250,"name":"\"libs/arr/arr\"","kind":1,"kindString":"External module","flags":{"isExported":true,"isExternal":true},"originalName":"C:/Users/akibdpt/Documents/Angular/mobius-parametric-modeller/src/libs/arr/arr.ts","children":[{"id":251,"name":"Arr","kind":128,"kindString":"Class","flags":{"isExported":true,"isExternal":true},"comment":{"shortText":"A set of static methods for working with arrays of simple types.\nThe arrays can be nested, but they do not contain any objects."},"children":[{"id":276,"name":"deepCopy","kind":2048,"kindString":"Method","flags":{"isStatic":true,"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":277,"name":"deepCopy","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Make a copy of an nD array.\nIf the input is not an array, then just return the same thing.\nA new array is returned. The input array remains unchanged.\nIf the input array is undefined, an empty array is returned.\nIf the input is s sparse array, then the output will alos be a sparse array.","returns":"The new nD array.\n"},"parameters":[{"id":278,"name":"arr","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"The nD array to copy."},"type":{"type":"array","elementType":{"type":"intrinsic","name":"any"}}}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"any"}}}],"sources":[{"fileName":"libs/arr/arr.ts","line":106,"character":26}]},{"id":283,"name":"deepCount","kind":2048,"kindString":"Method","flags":{"isStatic":true,"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":284,"name":"deepCount","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Counts the number of values in an nD array .\nThe input array remains unchanged.\nIf the input array is undefined, 0 is returned.\nThe input can be a sparse array. Undefined values are ignored.\nFor example, for [1, 2, , , 3], the count will be 3.","returns":"The number of elements in the nD array.\n"},"parameters":[{"id":285,"name":"arr","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"The nD array to count."},"type":{"type":"array","elementType":{"type":"intrinsic","name":"any"}}}],"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/arr/arr.ts","line":150,"character":27}]},{"id":279,"name":"deepFill","kind":2048,"kindString":"Method","flags":{"isStatic":true,"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":280,"name":"deepFill","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Fills an nD array with new values (all the same value).\nThe input array is changed.\nIf the input array is undefined, an empty array is returned.\nThe input can be a sparse array."},"parameters":[{"id":281,"name":"arr","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"The nD array to fill."},"type":{"type":"array","elementType":{"type":"intrinsic","name":"any"}}},{"id":282,"name":"value","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"The value to insert into the array.\n"},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"void"}}],"sources":[{"fileName":"libs/arr/arr.ts","line":129,"character":26}]},{"id":259,"name":"equal","kind":2048,"kindString":"Method","flags":{"isStatic":true,"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":260,"name":"equal","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Check if two nD arrays are equal (i.e. that all elements in the array are equal, ===.).\nIf the arrays are unequal in length, false is returned.\nElements in the array can have any value.","returns":"True or false.\n"},"parameters":[{"id":261,"name":"arr1","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"The first value."},"type":{"type":"intrinsic","name":"any"}},{"id":262,"name":"arr2","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"The second values."},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"boolean"}}],"sources":[{"fileName":"libs/arr/arr.ts","line":34,"character":23}]},{"id":272,"name":"flatten","kind":2048,"kindString":"Method","flags":{"isStatic":true,"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":273,"name":"flatten","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Take an nD array and flattens it.\nA new array is returned. The input array remains unchanged.\nFor example, [1, 2, [3, 4], [5, 6]] will become [1, 2, 3, 4, 5, 6].\nIf the input array is undefined, an empty array is returned.","returns":"A new 1D array.\n"},"parameters":[{"id":274,"name":"arr","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"The multidimensional array to flatten."},"type":{"type":"array","elementType":{"type":"intrinsic","name":"any"}}},{"id":275,"name":"depth","kind":32768,"kindString":"Parameter","flags":{"isOptional":true},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"any"}}}],"sources":[{"fileName":"libs/arr/arr.ts","line":86,"character":25}]},{"id":263,"name":"indexOf","kind":2048,"kindString":"Method","flags":{"isStatic":true,"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":264,"name":"indexOf","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Find the position of the first occurrence of a specified value in an array.\nThe value can be an array (which is not the case for Array.indexOf()).\nIf the value is not found or is undefined, return -1.\nIf the array is null or undefined, return -1.","returns":"The index in the array of the first occurance of the value.\n"},"parameters":[{"id":265,"name":"arr","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"array","elementType":{"type":"intrinsic","name":"any"}}},{"id":266,"name":"value","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"The value, can be a value or a 1D array of values."},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/arr/arr.ts","line":50,"character":25}]},{"id":252,"name":"make","kind":2048,"kindString":"Method","flags":{"isStatic":true,"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":253,"name":"make","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Make an array of numbers. All elements in the array will have the same value.","returns":"The resulting array.\n"},"parameters":[{"id":254,"name":"length","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"The length of the new array. If length is 0, then an empty array is returned."},"type":{"type":"intrinsic","name":"number"}},{"id":255,"name":"value","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"The values in the array."},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}}],"sources":[{"fileName":"libs/arr/arr.ts","line":13,"character":22}]},{"id":256,"name":"makeSeq","kind":2048,"kindString":"Method","flags":{"isStatic":true,"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":257,"name":"makeSeq","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Make an array of numbers. All elements in the array will be a numerical sequence, 0, 1, 2, 3....","returns":"The resulting array.\n"},"parameters":[{"id":258,"name":"length","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"The length of the new array. If length is 0, then an empty array is returned."},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}}],"sources":[{"fileName":"libs/arr/arr.ts","line":22,"character":25}]},{"id":267,"name":"replace","kind":2048,"kindString":"Method","flags":{"isStatic":true,"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":268,"name":"replace","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Replace all occurrences of a specified value in an array.\nThe input array is changed.\nThe value can be an array.\nIf the value is not found or is undefined, return -1."},"parameters":[{"id":269,"name":"arr","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"The array.\n"},"type":{"type":"array","elementType":{"type":"intrinsic","name":"any"}}},{"id":270,"name":"old_value","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"The old value to replace."},"type":{"type":"intrinsic","name":"any"}},{"id":271,"name":"new_value","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"The new value."},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"void"}}],"sources":[{"fileName":"libs/arr/arr.ts","line":69,"character":25}]}],"groups":[{"title":"Methods","kind":2048,"children":[276,283,279,259,272,263,252,256,267]}],"sources":[{"fileName":"libs/arr/arr.ts","line":6,"character":16}]}],"groups":[{"title":"Classes","kind":128,"children":[251]}],"sources":[{"fileName":"libs/arr/arr.ts","line":1,"character":0}]},{"id":491,"name":"\"libs/geo-info/BiMap\"","kind":1,"kindString":"External module","flags":{"isExported":true,"isExternal":true},"originalName":"C:/Users/akibdpt/Documents/Angular/mobius-parametric-modeller/src/libs/geo-info/BiMap.ts","children":[{"id":492,"name":"BiMapManyToOne","kind":128,"kindString":"Class","flags":{"isExported":true,"isExternal":true},"comment":{"shortText":"A bi-directional map that stores many-to-one key value mappings.\nMultiple keys point to the same value.\nBoth the keys and values must be unique.\nThe keys are integers, the values can be any type."},"typeParameter":[{"id":493,"name":"V","kind":131072,"kindString":"Type parameter","flags":{}}],"children":[{"id":496,"name":"constructor","kind":512,"kindString":"Constructor","flags":{"isExported":true,"isExternal":true},"comment":{"shortText":"Creates a new bi-directional many-to-one map.\nIf the data is provided, it will be added to the map."},"signatures":[{"id":497,"name":"new BiMapManyToOne","kind":16384,"kindString":"Constructor signature","flags":{},"comment":{"shortText":"Creates a new bi-directional many-to-one map.\nIf the data is provided, it will be added to the map."},"parameters":[{"id":498,"name":"data","kind":32768,"kindString":"Parameter","flags":{"isOptional":true},"comment":{"shortText":"\n"},"type":{"type":"reference","name":"Array","typeArguments":[{"type":"tuple","elements":[{"type":"array","elementType":{"type":"intrinsic","name":"number"}},{"type":"typeParameter","name":"V"}]}]}}],"type":{"type":"reference","name":"BiMapManyToOne","id":492}}],"sources":[{"fileName":"libs/geo-info/BiMap.ts","line":9,"character":58}]},{"id":494,"name":"kv_map","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/BiMap.ts","line":8,"character":27}],"type":{"type":"reference","name":"Map","typeArguments":[{"type":"intrinsic","name":"number"},{"type":"unknown","name":"V"}]},"defaultValue":" new Map<number, V>()"},{"id":495,"name":"vk_map","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/BiMap.ts","line":9,"character":27}],"type":{"type":"reference","name":"Map","typeArguments":[{"type":"intrinsic","name":"string"},{"type":"array","elementType":{"type":"intrinsic","name":"number"}}]},"defaultValue":" new Map<string, number[]>()"},{"id":499,"name":"addData","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":500,"name":"addData","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Populate the data in this map with an array.\nFor example, [[1,3], 'a'],[[0,4], 'b']"},"parameters":[{"id":501,"name":"data","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"\n"},"type":{"type":"reference","name":"Array","typeArguments":[{"type":"tuple","elements":[{"type":"array","elementType":{"type":"intrinsic","name":"number"}},{"type":"typeParameter","name":"V"}]}]}}],"type":{"type":"intrinsic","name":"void"}}],"sources":[{"fileName":"libs/geo-info/BiMap.ts","line":25,"character":18}]},{"id":526,"name":"getData","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":527,"name":"getData","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Return a a data array.\nFor example, [[1,3], 'a'],[[0,4], 'b']"},"type":{"type":"reference","name":"Array","typeArguments":[{"type":"tuple","elements":[{"type":"array","elementType":{"type":"intrinsic","name":"number"}},{"type":"typeParameter","name":"V"}]}]}}],"sources":[{"fileName":"libs/geo-info/BiMap.ts","line":104,"character":18}]},{"id":510,"name":"getKeys","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":511,"name":"getKeys","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Returns an array of keys that point to this value."},"parameters":[{"id":512,"name":"value","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"\n"},"type":{"type":"typeParameter","name":"V"}}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}}],"sources":[{"fileName":"libs/geo-info/BiMap.ts","line":62,"character":18}]},{"id":513,"name":"getValue","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":514,"name":"getValue","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Returns the value to which this key points."},"parameters":[{"id":515,"name":"key","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"\n"},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"typeParameter","name":"V"}}],"sources":[{"fileName":"libs/geo-info/BiMap.ts","line":70,"character":19}]},{"id":516,"name":"hasKey","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":517,"name":"hasKey","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Returns true if the map contains the key."},"parameters":[{"id":518,"name":"key","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"\n"},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"intrinsic","name":"boolean"}}],"sources":[{"fileName":"libs/geo-info/BiMap.ts","line":77,"character":17}]},{"id":519,"name":"hasValue","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":520,"name":"hasValue","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Returns true if the map contains the value."},"parameters":[{"id":521,"name":"value","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"\n"},"type":{"type":"typeParameter","name":"V"}}],"type":{"type":"intrinsic","name":"boolean"}}],"sources":[{"fileName":"libs/geo-info/BiMap.ts","line":84,"character":19}]},{"id":508,"name":"keys","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":509,"name":"keys","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Returns an array of all keys."},"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}}],"sources":[{"fileName":"libs/geo-info/BiMap.ts","line":55,"character":15}]},{"id":522,"name":"numKeys","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":523,"name":"numKeys","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Total number of keys."},"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/BiMap.ts","line":91,"character":18}]},{"id":524,"name":"numValues","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":525,"name":"numValues","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Total number of values."},"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/BiMap.ts","line":97,"character":20}]},{"id":502,"name":"set","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":503,"name":"set","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Set a single key-value pair."},"parameters":[{"id":504,"name":"key","kind":32768,"kindString":"Parameter","flags":{},"comment":{},"type":{"type":"intrinsic","name":"number"}},{"id":505,"name":"value","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"\n"},"type":{"type":"typeParameter","name":"V"}}],"type":{"type":"intrinsic","name":"void"}}],"sources":[{"fileName":"libs/geo-info/BiMap.ts","line":35,"character":14}]},{"id":506,"name":"values","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":507,"name":"values","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Returns an array of all values."},"type":{"type":"reference","name":"Array","typeArguments":[{"type":"typeParameter","name":"V"}]}}],"sources":[{"fileName":"libs/geo-info/BiMap.ts","line":49,"character":17}]}],"groups":[{"title":"Constructors","kind":512,"children":[496]},{"title":"Properties","kind":1024,"children":[494,495]},{"title":"Methods","kind":2048,"children":[499,526,510,513,516,519,508,522,524,502,506]}],"sources":[{"fileName":"libs/geo-info/BiMap.ts","line":7,"character":27}]}],"groups":[{"title":"Classes","kind":128,"children":[492]}],"sources":[{"fileName":"libs/geo-info/BiMap.ts","line":1,"character":0}]},{"id":528,"name":"\"libs/geo-info/GIAttribMap\"","kind":1,"kindString":"External module","flags":{"isExported":true,"isExternal":true},"originalName":"C:/Users/akibdpt/Documents/Angular/mobius-parametric-modeller/src/libs/geo-info/GIAttribMap.ts","children":[{"id":529,"name":"GIAttribMap","kind":128,"kindString":"Class","flags":{"isExported":true,"isExternal":true},"comment":{"shortText":"Geo-info attribute class.\nThe attributs are stores as key-value pairs.\nMultiple keys point to the same values.\nSo for example, [[1,3], \"a\"],[[0,4], \"b\"] can be converted into sequentia arrays.\nThe sequential values would be [\"a\", \"b\"]\nThe sequentail keys would be [1,0,,0,1] (Note the undefined value in the middle.)"},"children":[{"id":534,"name":"constructor","kind":512,"kindString":"Constructor","flags":{"isExported":true,"isExternal":true},"comment":{"shortText":"Creates an attribute."},"signatures":[{"id":535,"name":"new GIAttribMap","kind":16384,"kindString":"Constructor signature","flags":{},"comment":{"shortText":"Creates an attribute."},"parameters":[{"id":536,"name":"attrib_data","kind":32768,"kindString":"Parameter","flags":{},"comment":{"shortText":"\n"},"type":{"type":"reference","name":"IAttribData","id":17}}],"type":{"type":"reference","name":"GIAttribMap","id":529}}],"sources":[{"fileName":"libs/geo-info/GIAttribMap.ts","line":19,"character":53}]},{"id":533,"name":"bi_map","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIAttribMap.ts","line":19,"character":18}],"type":{"type":"reference","name":"BiMapManyToOne","id":492,"typeArguments":[{"type":"reference","name":"TAttribDataTypes","id":43}]}},{"id":532,"name":"data_size","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIAttribMap.ts","line":18,"character":21}],"type":{"type":"intrinsic","name":"number"}},{"id":531,"name":"data_type","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIAttribMap.ts","line":17,"character":21}],"type":{"type":"reference","name":"EAttribDataTypeStrs","id":2}},{"id":530,"name":"name","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIAttribMap.ts","line":16,"character":16}],"type":{"type":"intrinsic","name":"string"}},{"id":539,"name":"addData","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":540,"name":"addData","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Adds data to this attribute from JSON data.\nThe existing data in the model is not deleted."},"parameters":[{"id":541,"name":"attrib_data","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"The JSON data.\n"},"type":{"type":"reference","name":"IAttribData","id":17}},{"id":542,"name":"offset","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"intrinsic","name":"void"}}],"sources":[{"fileName":"libs/geo-info/GIAttribMap.ts","line":46,"character":18}]},{"id":547,"name":"get","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":548,"name":"get","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Gets a single attribute value."},"parameters":[{"id":549,"name":"key","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"\n"},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"reference","name":"TAttribDataTypes","id":43}}],"sources":[{"fileName":"libs/geo-info/GIAttribMap.ts","line":69,"character":14}]},{"id":537,"name":"getData","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":538,"name":"getData","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Returns the JSON data for this attribute."},"type":{"type":"reference","name":"IAttribData","id":17}}],"sources":[{"fileName":"libs/geo-info/GIAttribMap.ts","line":33,"character":18}]},{"id":550,"name":"getSeqKeys","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":551,"name":"getSeqKeys","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Gets a list of all the attribute keys, in sequential order.\nThe key vaues are mapped.\nThe key value gets maped to the new list position.\nThe key index gets mapped to the new value.\nSo for example, for [[1,3], 'a'],[[0,4], 'b'], the sequentail keys would be [1,0,,0,1]."},"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}}],"sources":[{"fileName":"libs/geo-info/GIAttribMap.ts","line":79,"character":21}]},{"id":552,"name":"getSeqValues","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":553,"name":"getSeqValues","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Gets a list of all the attribute values, in sequential order.\nSo for example, for [[1,3], 'a'],[[0,4], 'b'], the sequentail values would be ['a', 'b']"},"type":{"type":"array","elementType":{"type":"reference","name":"TAttribDataTypes","id":43}}}],"sources":[{"fileName":"libs/geo-info/GIAttribMap.ts","line":88,"character":23}]},{"id":543,"name":"set","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":544,"name":"set","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Sets a single attribute value."},"parameters":[{"id":545,"name":"key","kind":32768,"kindString":"Parameter","flags":{},"comment":{},"type":{"type":"intrinsic","name":"number"}},{"id":546,"name":"value","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"\n"},"type":{"type":"reference","name":"TAttribDataTypes","id":43}}],"type":{"type":"intrinsic","name":"void"}}],"sources":[{"fileName":"libs/geo-info/GIAttribMap.ts","line":62,"character":14}]}],"groups":[{"title":"Constructors","kind":512,"children":[534]},{"title":"Properties","kind":1024,"children":[533,532,531,530]},{"title":"Methods","kind":2048,"children":[539,547,537,550,552,543]}],"sources":[{"fileName":"libs/geo-info/GIAttribMap.ts","line":15,"character":24}]}],"groups":[{"title":"Classes","kind":128,"children":[529]}],"sources":[{"fileName":"libs/geo-info/GIAttribMap.ts","line":1,"character":0}]},{"id":554,"name":"\"libs/geo-info/GIAttribs\"","kind":1,"kindString":"External module","flags":{"isExported":true,"isExternal":true},"originalName":"C:/Users/akibdpt/Documents/Angular/mobius-parametric-modeller/src/libs/geo-info/GIAttribs.ts","children":[{"id":555,"name":"GIAttribs","kind":128,"kindString":"Class","flags":{"isExported":true,"isExternal":true},"comment":{"shortText":"Class for attributes."},"children":[{"id":570,"name":"constructor","kind":512,"kindString":"Constructor","flags":{"isExported":true,"isExternal":true},"comment":{"shortText":"Creates an object to store the attribute data."},"signatures":[{"id":571,"name":"new GIAttribs","kind":16384,"kindString":"Constructor signature","flags":{},"comment":{"shortText":"Creates an object to store the attribute data."},"parameters":[{"id":572,"name":"model","kind":32768,"kindString":"Parameter","flags":{},"comment":{"shortText":"The JSON data\n"},"type":{"type":"reference","name":"GIModel","id":650}}],"type":{"type":"reference","name":"GIAttribs","id":555}}],"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":26,"character":6}]},{"id":562,"name":"colls","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":17,"character":17}],"type":{"type":"reference","name":"Map","typeArguments":[{"type":"intrinsic","name":"string"},{"type":"reference","name":"GIAttribMap","id":529}]},"defaultValue":" new Map()"},{"id":559,"name":"edges","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":14,"character":17}],"type":{"type":"reference","name":"Map","typeArguments":[{"type":"intrinsic","name":"string"},{"type":"reference","name":"GIAttribMap","id":529}]},"defaultValue":" new Map()"},{"id":561,"name":"faces","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":16,"character":17}],"type":{"type":"reference","name":"Map","typeArguments":[{"type":"intrinsic","name":"string"},{"type":"reference","name":"GIAttribMap","id":529}]},"defaultValue":" new Map()"},{"id":556,"name":"model","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":10,"character":17}],"type":{"type":"reference","name":"GIModel","id":650}},{"id":557,"name":"posis","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":12,"character":17}],"type":{"type":"reference","name":"Map","typeArguments":[{"type":"intrinsic","name":"string"},{"type":"reference","name":"GIAttribMap","id":529}]},"defaultValue":" new Map()"},{"id":558,"name":"verts","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":13,"character":17}],"type":{"type":"reference","name":"Map","typeArguments":[{"type":"intrinsic","name":"string"},{"type":"reference","name":"GIAttribMap","id":529}]},"defaultValue":" new Map()"},{"id":560,"name":"wires","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":15,"character":17}],"type":{"type":"reference","name":"Map","typeArguments":[{"type":"intrinsic","name":"string"},{"type":"reference","name":"GIAttribMap","id":529}]},"defaultValue":" new Map()"},{"id":578,"name":"_addAttrib","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":579,"name":"_addAttrib","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Creates a new attribte."},"parameters":[{"id":580,"name":"type_str","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"The level at which to create the attribute."},"type":{"type":"reference","name":"EEntityTypeStr","id":46}},{"id":581,"name":"name","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"The name of the attribute."},"type":{"type":"intrinsic","name":"string"}},{"id":582,"name":"data_type","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"The data type of the attribute."},"type":{"type":"reference","name":"EAttribDataTypeStrs","id":2}},{"id":583,"name":"data_size","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"The data size of the attribute. For example, an XYZ vector has size=3.\n"},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"reference","name":"GIAttribMap","id":529}}],"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":80,"character":22}]},{"id":633,"name":"addCollAttrib","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":634,"name":"addCollAttrib","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":635,"name":"name","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"string"}},{"id":636,"name":"data_type","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"reference","name":"EAttribDataTypeStrs","id":2}},{"id":637,"name":"data_size","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"reference","name":"GIAttribMap","id":529}}],"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":160,"character":24}]},{"id":575,"name":"addData","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":576,"name":"addData","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Adds data to this model from JSON data.\nThe existing data in the model is not deleted."},"parameters":[{"id":577,"name":"attribs_data","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"The JSON data\n"},"type":{"type":"reference","name":"IAttribsData","id":22}}],"type":{"type":"intrinsic","name":"void"}}],"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":52,"character":18}]},{"id":618,"name":"addEdgeAttrib","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":619,"name":"addEdgeAttrib","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":620,"name":"name","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"string"}},{"id":621,"name":"data_type","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"reference","name":"EAttribDataTypeStrs","id":2}},{"id":622,"name":"data_size","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"reference","name":"GIAttribMap","id":529}}],"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":151,"character":24}]},{"id":628,"name":"addFaceAttrib","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":629,"name":"addFaceAttrib","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":630,"name":"name","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"string"}},{"id":631,"name":"data_type","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"reference","name":"EAttribDataTypeStrs","id":2}},{"id":632,"name":"data_size","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"reference","name":"GIAttribMap","id":529}}],"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":157,"character":24}]},{"id":608,"name":"addPosiAttrib","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":609,"name":"addPosiAttrib","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":610,"name":"name","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"string"}},{"id":611,"name":"data_type","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"reference","name":"EAttribDataTypeStrs","id":2}},{"id":612,"name":"data_size","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"reference","name":"GIAttribMap","id":529}}],"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":145,"character":24}]},{"id":613,"name":"addVertAttrib","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":614,"name":"addVertAttrib","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":615,"name":"name","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"string"}},{"id":616,"name":"data_type","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"reference","name":"EAttribDataTypeStrs","id":2}},{"id":617,"name":"data_size","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"reference","name":"GIAttribMap","id":529}}],"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":148,"character":24}]},{"id":623,"name":"addWireAttrib","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":624,"name":"addWireAttrib","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":625,"name":"name","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"string"}},{"id":626,"name":"data_type","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"reference","name":"EAttribDataTypeStrs","id":2}},{"id":627,"name":"data_size","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"reference","name":"GIAttribMap","id":529}}],"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":154,"character":24}]},{"id":638,"name":"get3jsSeqCoords","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":639,"name":"get3jsSeqCoords","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Get a list of all the coordinates.\nThis returns two arrays, one with indexes, and another with values.\nFor example, suppose the bimap contained  [  [[1,3], [2.3,4.5,6.7]],  [[0,2], [9.8,7.6,5.4]]  ].\nThe sequentail coordinate arrays would be [  [1,0,1,0],  [[2.3,4.5,6.7],[9.8,7.6,5.4]]  ].\nThese array can be use for building the threejs scene using typed arrays."},"type":{"type":"tuple","elements":[{"type":"array","elementType":{"type":"intrinsic","name":"number"}},{"type":"array","elementType":{"type":"intrinsic","name":"number"}}]}}],"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":175,"character":26}]},{"id":640,"name":"get3jsSeqTrisNormals","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":641,"name":"get3jsSeqTrisNormals","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}}],"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":181,"character":31}]},{"id":589,"name":"getAttribValue","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":590,"name":"getAttribValue","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Get an entity attrib value"},"parameters":[{"id":591,"name":"id","kind":32768,"kindString":"Parameter","flags":{},"comment":{},"type":{"type":"intrinsic","name":"string"}},{"id":592,"name":"name","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"\n"},"type":{"type":"intrinsic","name":"string"}}],"type":{"type":"reference","name":"TAttribDataTypes","id":43}}],"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":108,"character":25}]},{"id":606,"name":"getCollAttribNames","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":607,"name":"getCollAttribNames","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"array","elementType":{"type":"intrinsic","name":"string"}}}],"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":139,"character":29}]},{"id":573,"name":"getData","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":574,"name":"getData","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Returns the JSON data for this model."},"type":{"type":"reference","name":"IAttribsData","id":22}}],"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":37,"character":18}]},{"id":600,"name":"getEdgeAttribNames","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":601,"name":"getEdgeAttribNames","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"array","elementType":{"type":"intrinsic","name":"string"}}}],"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":130,"character":29}]},{"id":604,"name":"getFaceAttribNames","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":605,"name":"getFaceAttribNames","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"array","elementType":{"type":"intrinsic","name":"string"}}}],"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":136,"character":29}]},{"id":596,"name":"getPosiAttribNames","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":597,"name":"getPosiAttribNames","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"array","elementType":{"type":"intrinsic","name":"string"}}}],"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":124,"character":29}]},{"id":593,"name":"getPosiCoord","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":594,"name":"getPosiCoord","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Shortcut for getting coordinates from a numeric index (i.e. this is not an ID)"},"parameters":[{"id":595,"name":"posi_i","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"\n"},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"reference","name":"TCoord","id":32}}],"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":118,"character":23}]},{"id":598,"name":"getVertAttribNames","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":599,"name":"getVertAttribNames","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"array","elementType":{"type":"intrinsic","name":"string"}}}],"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":127,"character":29}]},{"id":602,"name":"getWireAttribNames","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":603,"name":"getWireAttribNames","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"array","elementType":{"type":"intrinsic","name":"string"}}}],"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":133,"character":29}]},{"id":584,"name":"setAttribValue","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":585,"name":"setAttribValue","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Set an entity attrib value"},"parameters":[{"id":586,"name":"id","kind":32768,"kindString":"Parameter","flags":{},"comment":{},"type":{"type":"intrinsic","name":"string"}},{"id":587,"name":"name","kind":32768,"kindString":"Parameter","flags":{},"comment":{},"type":{"type":"intrinsic","name":"string"}},{"id":588,"name":"value","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"\n"},"type":{"type":"reference","name":"TAttribDataTypes","id":43}}],"type":{"type":"intrinsic","name":"void"}}],"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":97,"character":25}]},{"id":563,"name":"attrib_maps","kind":2097152,"kindString":"Object literal","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"children":[{"id":566,"name":"_e","kind":32,"kindString":"Variable","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":22,"character":10}],"type":{"type":"reference","name":"Map","typeArguments":[{"type":"intrinsic","name":"string"},{"type":"reference","name":"GIAttribMap","id":529}]},"defaultValue":" this.edges"},{"id":568,"name":"_f","kind":32,"kindString":"Variable","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":24,"character":10}],"type":{"type":"reference","name":"Map","typeArguments":[{"type":"intrinsic","name":"string"},{"type":"reference","name":"GIAttribMap","id":529}]},"defaultValue":" this.faces"},{"id":565,"name":"_v","kind":32,"kindString":"Variable","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":21,"character":10}],"type":{"type":"reference","name":"Map","typeArguments":[{"type":"intrinsic","name":"string"},{"type":"reference","name":"GIAttribMap","id":529}]},"defaultValue":" this.verts"},{"id":567,"name":"_w","kind":32,"kindString":"Variable","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":23,"character":10}],"type":{"type":"reference","name":"Map","typeArguments":[{"type":"intrinsic","name":"string"},{"type":"reference","name":"GIAttribMap","id":529}]},"defaultValue":" this.wires"},{"id":569,"name":"co","kind":32,"kindString":"Variable","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":25,"character":10}],"type":{"type":"reference","name":"Map","typeArguments":[{"type":"intrinsic","name":"string"},{"type":"reference","name":"GIAttribMap","id":529}]},"defaultValue":" this.colls"},{"id":564,"name":"po","kind":32,"kindString":"Variable","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":20,"character":10}],"type":{"type":"reference","name":"Map","typeArguments":[{"type":"intrinsic","name":"string"},{"type":"reference","name":"GIAttribMap","id":529}]},"defaultValue":" this.posis"}],"groups":[{"title":"Variables","kind":32,"children":[566,568,565,567,569,564]}],"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":19,"character":23}],"type":{"type":"intrinsic","name":"object"}}],"groups":[{"title":"Constructors","kind":512,"children":[570]},{"title":"Properties","kind":1024,"children":[562,559,561,556,557,558,560]},{"title":"Methods","kind":2048,"children":[578,633,575,618,628,608,613,623,638,640,589,606,573,600,604,596,593,598,602,584]},{"title":"Object literals","kind":2097152,"children":[563]}],"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":9,"character":22}]}],"groups":[{"title":"Classes","kind":128,"children":[555]}],"sources":[{"fileName":"libs/geo-info/GIAttribs.ts","line":1,"character":0}]},{"id":45,"name":"\"libs/geo-info/GICommon\"","kind":1,"kindString":"External module","flags":{"isExported":true,"isExternal":true},"originalName":"C:/Users/akibdpt/Documents/Angular/mobius-parametric-modeller/src/libs/geo-info/GICommon.ts","children":[{"id":46,"name":"EEntityTypeStr","kind":4,"kindString":"Enumeration","flags":{"isExported":true,"isExternal":true},"children":[{"id":56,"name":"COLL","kind":16,"kindString":"Enumeration member","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GICommon.ts","line":12,"character":8}],"defaultValue":"\"co\""},{"id":50,"name":"EDGE","kind":16,"kindString":"Enumeration member","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GICommon.ts","line":6,"character":8}],"defaultValue":"\"_e\""},{"id":52,"name":"FACE","kind":16,"kindString":"Enumeration member","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GICommon.ts","line":8,"character":8}],"defaultValue":"\"_f\""},{"id":54,"name":"LINE","kind":16,"kindString":"Enumeration member","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GICommon.ts","line":10,"character":8}],"defaultValue":"\"ls\""},{"id":55,"name":"PGON","kind":16,"kindString":"Enumeration member","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GICommon.ts","line":11,"character":8}],"defaultValue":"\"pg\""},{"id":53,"name":"POINT","kind":16,"kindString":"Enumeration member","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GICommon.ts","line":9,"character":9}],"defaultValue":"\"pt\""},{"id":47,"name":"POSI","kind":16,"kindString":"Enumeration member","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GICommon.ts","line":3,"character":8}],"defaultValue":"\"po\""},{"id":48,"name":"TRI","kind":16,"kindString":"Enumeration member","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GICommon.ts","line":4,"character":7}],"defaultValue":"\"_t\""},{"id":49,"name":"VERT","kind":16,"kindString":"Enumeration member","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GICommon.ts","line":5,"character":8}],"defaultValue":"\"_v\""},{"id":51,"name":"WIRE","kind":16,"kindString":"Enumeration member","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GICommon.ts","line":7,"character":8}],"defaultValue":"\"_w\""}],"groups":[{"title":"Enumeration members","kind":16,"children":[56,50,52,54,55,53,47,48,49,51]}],"sources":[{"fileName":"libs/geo-info/GICommon.ts","line":2,"character":26}]},{"id":57,"name":"idBreak","kind":64,"kindString":"Function","flags":{"isExported":true,"isExternal":true},"signatures":[{"id":58,"name":"idBreak","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":59,"name":"id","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"string"}}],"type":{"type":"tuple","elements":[{"type":"intrinsic","name":"string"},{"type":"intrinsic","name":"number"}]}}],"sources":[{"fileName":"libs/geo-info/GICommon.ts","line":20,"character":23}]},{"id":66,"name":"idEntityTypeStr","kind":64,"kindString":"Function","flags":{"isExported":true,"isExternal":true},"signatures":[{"id":67,"name":"idEntityTypeStr","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":68,"name":"id","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"string"}}],"type":{"type":"reference","name":"EEntityTypeStr","id":46}}],"sources":[{"fileName":"libs/geo-info/GICommon.ts","line":29,"character":31}]},{"id":60,"name":"idIndex","kind":64,"kindString":"Function","flags":{"isExported":true,"isExternal":true},"signatures":[{"id":61,"name":"idIndex","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":62,"name":"id","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"string"}}],"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GICommon.ts","line":23,"character":23}]},{"id":63,"name":"idIndicies","kind":64,"kindString":"Function","flags":{"isExported":true,"isExternal":true},"signatures":[{"id":64,"name":"idIndicies","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":65,"name":"ids","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"array","elementType":{"type":"intrinsic","name":"string"}}}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}}],"sources":[{"fileName":"libs/geo-info/GICommon.ts","line":26,"character":26}]}],"groups":[{"title":"Enumerations","kind":4,"children":[46]},{"title":"Functions","kind":64,"children":[57,66,60,63]}],"sources":[{"fileName":"libs/geo-info/GICommon.ts","line":1,"character":0}]},{"id":293,"name":"\"libs/geo-info/GIGeom\"","kind":1,"kindString":"External module","flags":{"isExported":true,"isExternal":true},"originalName":"C:/Users/akibdpt/Documents/Angular/mobius-parametric-modeller/src/libs/geo-info/GIGeom.ts","children":[{"id":294,"name":"GIGeom","kind":128,"kindString":"Class","flags":{"isExported":true,"isExternal":true},"comment":{"shortText":"Class for geometry."},"children":[{"id":328,"name":"constructor","kind":512,"kindString":"Constructor","flags":{"isExported":true,"isExternal":true},"comment":{"shortText":"Creates an object to store the geometry data."},"signatures":[{"id":329,"name":"new GIGeom","kind":16384,"kindString":"Constructor signature","flags":{},"comment":{"shortText":"Creates an object to store the geometry data."},"parameters":[{"id":330,"name":"model","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"reference","name":"GIModel","id":650}}],"type":{"type":"reference","name":"GIGeom","id":294}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":54,"character":6}]},{"id":317,"name":"colls","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":42,"character":17}],"type":{"type":"array","elementType":{"type":"reference","name":"TColl","id":41}},"defaultValue":" []"},{"id":304,"name":"edges","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":23,"character":17}],"type":{"type":"array","elementType":{"type":"reference","name":"TEdge","id":35}},"defaultValue":" []"},{"id":309,"name":"faces","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":30,"character":17}],"type":{"type":"array","elementType":{"type":"reference","name":"TFace","id":37}},"defaultValue":" []"},{"id":313,"name":"lines","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":36,"character":17}],"type":{"type":"array","elementType":{"type":"reference","name":"TLine","id":39}},"defaultValue":" []"},{"id":295,"name":"model","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":10,"character":17}],"type":{"type":"reference","name":"GIModel","id":650}},{"id":296,"name":"num_posis","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":12,"character":21}],"type":{"type":"intrinsic","name":"number"},"defaultValue":"0"},{"id":315,"name":"pgons","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":39,"character":17}],"type":{"type":"array","elementType":{"type":"reference","name":"TPgon","id":40}},"defaultValue":" []"},{"id":311,"name":"points","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":33,"character":18}],"type":{"type":"array","elementType":{"type":"reference","name":"TPoint","id":38}},"defaultValue":" []"},{"id":305,"name":"rev_edges_wires","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":24,"character":27}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}},"defaultValue":" []"},{"id":310,"name":"rev_faces_pgons","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":31,"character":27}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}},"defaultValue":" []"},{"id":314,"name":"rev_lines_colls","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":37,"character":27}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}},"defaultValue":" []"},{"id":316,"name":"rev_pgons_colls","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":40,"character":27}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}},"defaultValue":" []"},{"id":312,"name":"rev_points_colls","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":34,"character":28}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}},"defaultValue":" []"},{"id":298,"name":"rev_posis_tris","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":14,"character":26}],"type":{"type":"array","elementType":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}},"defaultValue":" []"},{"id":297,"name":"rev_posis_verts","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":13,"character":27}],"type":{"type":"array","elementType":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}},"defaultValue":" []"},{"id":300,"name":"rev_tris_faces","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":17,"character":26}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}},"defaultValue":" []"},{"id":302,"name":"rev_verts_edges","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":20,"character":27}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}},"defaultValue":" []"},{"id":303,"name":"rev_verts_points","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":21,"character":28}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}},"defaultValue":" []"},{"id":307,"name":"rev_wires_faces","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":27,"character":27}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}},"defaultValue":" []"},{"id":308,"name":"rev_wires_lines","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":28,"character":27}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}},"defaultValue":" []"},{"id":299,"name":"tris","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":16,"character":16}],"type":{"type":"array","elementType":{"type":"reference","name":"TTri","id":33}},"defaultValue":" []"},{"id":301,"name":"verts","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":19,"character":17}],"type":{"type":"array","elementType":{"type":"reference","name":"TVert","id":34}},"defaultValue":" []"},{"id":306,"name":"wires","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":26,"character":17}],"type":{"type":"array","elementType":{"type":"reference","name":"TWire","id":36}},"defaultValue":" []"},{"id":413,"name":"_addEdge","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":414,"name":"_addEdge","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Adds an edge and updates the rev array."},"parameters":[{"id":415,"name":"vert_i1","kind":32768,"kindString":"Parameter","flags":{},"comment":{},"type":{"type":"intrinsic","name":"number"}},{"id":416,"name":"vert_i2","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"\n"},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":309,"character":20}]},{"id":421,"name":"_addFace","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":422,"name":"_addFace","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Adds a face and updates the rev array.\nWires are assumed to be closed!\nNo holes yet... TODO"},"parameters":[{"id":423,"name":"wire_i","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"\n"},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":331,"character":20}]},{"id":410,"name":"_addVertex","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":411,"name":"_addVertex","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Adds a vertex and updates the rev array."},"parameters":[{"id":412,"name":"posi_i","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"\n"},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":296,"character":22}]},{"id":417,"name":"_addWire","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":418,"name":"_addWire","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Adds a wire and updates the rev array.\nEdges are assumed to be sequential!"},"parameters":[{"id":419,"name":"edges_i","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"\n"},"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}},{"id":420,"name":"close","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"boolean"},"defaultValue":"false"}],"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":320,"character":20}]},{"id":371,"name":"_navCollToColl","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":372,"name":"_navCollToColl","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":373,"name":"coll","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":247,"character":26}]},{"id":365,"name":"_navCollToLine","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":366,"name":"_navCollToLine","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":367,"name":"coll","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":241,"character":26}]},{"id":368,"name":"_navCollToPgon","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":369,"name":"_navCollToPgon","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":370,"name":"coll","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":244,"character":26}]},{"id":362,"name":"_navCollToPoint","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":363,"name":"_navCollToPoint","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":364,"name":"coll","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":238,"character":27}]},{"id":341,"name":"_navEdgeToVert","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":342,"name":"_navEdgeToVert","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":343,"name":"edge","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":217,"character":26}]},{"id":386,"name":"_navEdgeToWire","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":387,"name":"_navEdgeToWire","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":388,"name":"edge","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":265,"character":26}]},{"id":398,"name":"_navFaceToPgon","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":399,"name":"_navFaceToPgon","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":400,"name":"face","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":277,"character":26}]},{"id":350,"name":"_navFaceToTri","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":351,"name":"_navFaceToTri","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":352,"name":"face","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":226,"character":25}]},{"id":347,"name":"_navFaceToWire","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":348,"name":"_navFaceToWire","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":349,"name":"face","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":223,"character":26}]},{"id":404,"name":"_navLineToColl","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":405,"name":"_navLineToColl","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":406,"name":"line","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":283,"character":26}]},{"id":356,"name":"_navLineToVert","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":357,"name":"_navLineToVert","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":358,"name":"line","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":232,"character":26}]},{"id":407,"name":"_navPgonToColl","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":408,"name":"_navPgonToColl","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":409,"name":"pgon","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":286,"character":26}]},{"id":359,"name":"_navPgonToVert","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":360,"name":"_navPgonToVert","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":361,"name":"pgon","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":235,"character":26}]},{"id":401,"name":"_navPointToColl","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":402,"name":"_navPointToColl","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":403,"name":"point","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":280,"character":27}]},{"id":353,"name":"_navPointToVert","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":354,"name":"_navPointToVert","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":355,"name":"point","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":229,"character":27}]},{"id":377,"name":"_navPosiToTri","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":378,"name":"_navPosiToTri","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":379,"name":"posi","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":256,"character":25}]},{"id":374,"name":"_navPosiToVert","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":375,"name":"_navPosiToVert","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":376,"name":"posi","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":253,"character":26}]},{"id":380,"name":"_navTriToFace","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":381,"name":"_navTriToFace","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":382,"name":"tri","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":259,"character":25}]},{"id":392,"name":"_navVertToPoint","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":393,"name":"_navVertToPoint","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":394,"name":"vert","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":271,"character":27}]},{"id":338,"name":"_navVertToPosi","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":339,"name":"_navVertToPosi","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":340,"name":"vert","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":214,"character":26}]},{"id":383,"name":"_navVrtToEdge","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":384,"name":"_navVrtToEdge","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":385,"name":"vert","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":262,"character":25}]},{"id":344,"name":"_navWireToEdge","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":345,"name":"_navWireToEdge","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":346,"name":"wire","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":220,"character":26}]},{"id":389,"name":"_navWireToFace","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":390,"name":"_navWireToFace","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":391,"name":"wire","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":268,"character":26}]},{"id":395,"name":"_navWireToLine","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":396,"name":"_navWireToLine","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":397,"name":"wire","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"number"}}],"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":274,"character":26}]},{"id":336,"name":"_updateRevArrays","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":337,"name":"_updateRevArrays","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Updates the rev arrays the create the reveres links."},"type":{"type":"intrinsic","name":"void"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":141,"character":28}]},{"id":436,"name":"addColl","kind":2048,"kindString":"Method","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"signatures":[{"id":437,"name":"addColl","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Adds a collection and updates the rev array."},"parameters":[{"id":438,"name":"parent_id","kind":32768,"kindString":"Parameter","flags":{},"comment":{},"type":{"type":"intrinsic","name":"string"}},{"id":439,"name":"points_id","kind":32768,"kindString":"Parameter","flags":{},"comment":{},"type":{"type":"array","elementType":{"type":"intrinsic","name":"string"}}},{"id":440,"name":"lines_id","kind":32768,"kindString":"Parameter","flags":{},"comment":{},"type":{"type":"array","elementType":{"type":"intrinsic","name":"string"}}},{"id":441,"name":"pgons_id","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"\n"},"type":{"type":"array","elementType":{"type":"intrinsic","name":"string"}}}],"type":{"type":"intrinsic","name":"string"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":415,"character":19}]},{"id":333,"name":"addData","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":334,"name":"addData","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Adds data to this model from JSON data.\nThe existing data in the model is not deleted."},"parameters":[{"id":335,"name":"geom_data","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"The JSON data\n"},"type":{"type":"reference","name":"IGeomData","id":6}}],"type":{"type":"intrinsic","name":"void"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":84,"character":18}]},{"id":429,"name":"addLine","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":430,"name":"addLine","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Adds a new linestring entity to the model."},"parameters":[{"id":431,"name":"posis_id","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"\n"},"type":{"type":"array","elementType":{"type":"intrinsic","name":"string"}}},{"id":432,"name":"close","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"boolean"},"defaultValue":"false"}],"type":{"type":"intrinsic","name":"string"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":371,"character":18}]},{"id":433,"name":"addPgon","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":434,"name":"addPgon","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Adds a new polygon entity to the model."},"parameters":[{"id":435,"name":"posis_id","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"\n"},"type":{"type":"array","elementType":{"type":"intrinsic","name":"string"}}}],"type":{"type":"intrinsic","name":"string"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":392,"character":18}]},{"id":426,"name":"addPoint","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":427,"name":"addPoint","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Adds a new point entity to the model."},"parameters":[{"id":428,"name":"posi_id","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"The position for the point.\n"},"type":{"type":"intrinsic","name":"string"}}],"type":{"type":"intrinsic","name":"string"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":358,"character":19}]},{"id":424,"name":"addPosition","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":425,"name":"addPosition","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Adds a new position to the model and returns the index to that position."},"type":{"type":"intrinsic","name":"string"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":349,"character":22}]},{"id":485,"name":"get3jsEdges","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":486,"name":"get3jsEdges","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"array","elementType":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":506,"character":22}]},{"id":487,"name":"get3jsLines","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":488,"name":"get3jsLines","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":509,"character":22}]},{"id":489,"name":"get3jsPoints","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":490,"name":"get3jsPoints","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":512,"character":23}]},{"id":483,"name":"get3jsTris","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":484,"name":"get3jsTris","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":503,"character":21}]},{"id":461,"name":"getColls","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":462,"name":"getColls","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"array","elementType":{"type":"intrinsic","name":"string"}}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":461,"character":19}]},{"id":331,"name":"getData","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":332,"name":"getData","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Returns the JSON data for this model."},"type":{"type":"reference","name":"IGeomData","id":6}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":65,"character":18}]},{"id":449,"name":"getEdges","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":450,"name":"getEdges","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"array","elementType":{"type":"intrinsic","name":"string"}}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":443,"character":19}]},{"id":453,"name":"getFaces","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":454,"name":"getFaces","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"array","elementType":{"type":"intrinsic","name":"string"}}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":449,"character":19}]},{"id":457,"name":"getLines","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":458,"name":"getLines","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"array","elementType":{"type":"intrinsic","name":"string"}}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":455,"character":19}]},{"id":459,"name":"getPgons","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":460,"name":"getPgons","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"array","elementType":{"type":"intrinsic","name":"string"}}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":458,"character":19}]},{"id":455,"name":"getPoints","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":456,"name":"getPoints","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"array","elementType":{"type":"intrinsic","name":"string"}}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":452,"character":20}]},{"id":445,"name":"getTris","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":446,"name":"getTris","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"array","elementType":{"type":"intrinsic","name":"string"}}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":437,"character":18}]},{"id":447,"name":"getVerts","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":448,"name":"getVerts","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"array","elementType":{"type":"intrinsic","name":"string"}}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":440,"character":19}]},{"id":451,"name":"getWires","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":452,"name":"getWires","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"array","elementType":{"type":"intrinsic","name":"string"}}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":446,"character":19}]},{"id":442,"name":"has","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":443,"name":"has","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":444,"name":"id","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"string"}}],"type":{"type":"intrinsic","name":"boolean"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":430,"character":14}]},{"id":473,"name":"numCollections","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":474,"name":"numCollections","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":482,"character":25}]},{"id":481,"name":"numColls","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":482,"name":"numColls","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":494,"character":19}]},{"id":467,"name":"numEdges","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":468,"name":"numEdges","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":473,"character":19}]},{"id":471,"name":"numFaces","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":472,"name":"numFaces","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":479,"character":19}]},{"id":477,"name":"numLines","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":478,"name":"numLines","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":488,"character":19}]},{"id":479,"name":"numPgons","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":480,"name":"numPgons","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":491,"character":19}]},{"id":475,"name":"numPoints","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":476,"name":"numPoints","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":485,"character":20}]},{"id":463,"name":"numPosis","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":464,"name":"numPosis","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":467,"character":19}]},{"id":465,"name":"numVerts","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":466,"name":"numVerts","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":470,"character":19}]},{"id":469,"name":"numWires","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":470,"name":"numWires","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":476,"character":19}]},{"id":318,"name":"geom_arrs","kind":2097152,"kindString":"Object literal","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"children":[{"id":321,"name":"_e","kind":32,"kindString":"Variable","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":47,"character":10}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"Object"}},"defaultValue":" this.edges"},{"id":323,"name":"_f","kind":32,"kindString":"Variable","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":49,"character":10}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"Object"}},"defaultValue":" this.faces"},{"id":319,"name":"_t","kind":32,"kindString":"Variable","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":45,"character":10}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"Object"}},"defaultValue":" this.tris"},{"id":320,"name":"_v","kind":32,"kindString":"Variable","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":46,"character":10}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}},"defaultValue":" this.verts"},{"id":322,"name":"_w","kind":32,"kindString":"Variable","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":48,"character":10}],"type":{"type":"array","elementType":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}},"defaultValue":" this.wires"},{"id":327,"name":"co","kind":32,"kindString":"Variable","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":53,"character":10}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"Object"}},"defaultValue":" this.colls"},{"id":325,"name":"ls","kind":32,"kindString":"Variable","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":51,"character":10}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}},"defaultValue":" this.lines"},{"id":326,"name":"pg","kind":32,"kindString":"Variable","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":52,"character":10}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}},"defaultValue":" this.pgons"},{"id":324,"name":"pt","kind":32,"kindString":"Variable","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":50,"character":10}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}},"defaultValue":" this.points"}],"groups":[{"title":"Variables","kind":32,"children":[321,323,319,320,322,327,325,326,324]}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":44,"character":21}],"type":{"type":"intrinsic","name":"object"}}],"groups":[{"title":"Constructors","kind":512,"children":[328]},{"title":"Properties","kind":1024,"children":[317,304,309,313,295,296,315,311,305,310,314,316,312,298,297,300,302,303,307,308,299,301,306]},{"title":"Methods","kind":2048,"children":[413,421,410,417,371,365,368,362,341,386,398,350,347,404,356,407,359,401,353,377,374,380,392,338,383,344,389,395,336,436,333,429,433,426,424,485,487,489,483,461,331,449,453,457,459,455,445,447,451,442,473,481,467,471,477,479,475,463,465,469]},{"title":"Object literals","kind":2097152,"children":[318]}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":9,"character":19}]}],"groups":[{"title":"Classes","kind":128,"children":[294]}],"sources":[{"fileName":"libs/geo-info/GIGeom.ts","line":1,"character":0}]},{"id":1,"name":"\"libs/geo-info/GIJson\"","kind":1,"kindString":"External module","flags":{"isExported":true,"isExternal":true},"originalName":"C:/Users/akibdpt/Documents/Angular/mobius-parametric-modeller/src/libs/geo-info/GIJson.ts","children":[{"id":2,"name":"EAttribDataTypeStrs","kind":4,"kindString":"Enumeration","flags":{"isExported":true,"isExternal":true},"children":[{"id":4,"name":"FLOAT","kind":16,"kindString":"Enumeration member","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":4,"character":9}],"defaultValue":"\"Float\""},{"id":3,"name":"INT","kind":16,"kindString":"Enumeration member","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":3,"character":7}],"defaultValue":"\"Int\""},{"id":5,"name":"STRING","kind":16,"kindString":"Enumeration member","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":5,"character":10}],"defaultValue":"\"String\""}],"groups":[{"title":"Enumeration members","kind":16,"children":[4,3,5]}],"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":2,"character":31}]},{"id":17,"name":"IAttribData","kind":256,"kindString":"Interface","flags":{"isExported":true,"isExternal":true},"children":[{"id":21,"name":"data","kind":1024,"kindString":"Property","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":40,"character":8}],"type":{"type":"reference","name":"TAttribValuesArr","id":44}},{"id":20,"name":"data_size","kind":1024,"kindString":"Property","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":39,"character":13}],"type":{"type":"intrinsic","name":"number"}},{"id":19,"name":"data_type","kind":1024,"kindString":"Property","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":38,"character":13}],"type":{"type":"reference","name":"EAttribDataTypeStrs","id":2}},{"id":18,"name":"name","kind":1024,"kindString":"Property","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":37,"character":8}],"type":{"type":"intrinsic","name":"string"}}],"groups":[{"title":"Properties","kind":1024,"children":[21,20,19,18]}],"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":36,"character":28}]},{"id":22,"name":"IAttribsData","kind":256,"kindString":"Interface","flags":{"isExported":true,"isExternal":true},"children":[{"id":28,"name":"collections","kind":1024,"kindString":"Property","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":48,"character":15}],"type":{"type":"array","elementType":{"type":"reference","name":"IAttribData","id":17}}},{"id":25,"name":"edges","kind":1024,"kindString":"Property","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":45,"character":9}],"type":{"type":"array","elementType":{"type":"reference","name":"IAttribData","id":17}}},{"id":27,"name":"faces","kind":1024,"kindString":"Property","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":47,"character":9}],"type":{"type":"array","elementType":{"type":"reference","name":"IAttribData","id":17}}},{"id":23,"name":"positions","kind":1024,"kindString":"Property","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":43,"character":13}],"type":{"type":"array","elementType":{"type":"reference","name":"IAttribData","id":17}}},{"id":24,"name":"vertices","kind":1024,"kindString":"Property","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":44,"character":12}],"type":{"type":"array","elementType":{"type":"reference","name":"IAttribData","id":17}}},{"id":26,"name":"wires","kind":1024,"kindString":"Property","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":46,"character":9}],"type":{"type":"array","elementType":{"type":"reference","name":"IAttribData","id":17}}}],"groups":[{"title":"Properties","kind":1024,"children":[28,25,27,23,24,26]}],"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":42,"character":29}]},{"id":6,"name":"IGeomData","kind":256,"kindString":"Interface","flags":{"isExported":true,"isExternal":true},"children":[{"id":16,"name":"collections","kind":1024,"kindString":"Property","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":34,"character":15}],"type":{"type":"array","elementType":{"type":"reference","name":"TColl","id":41}}},{"id":10,"name":"edges","kind":1024,"kindString":"Property","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":28,"character":9}],"type":{"type":"array","elementType":{"type":"reference","name":"TEdge","id":35}}},{"id":12,"name":"faces","kind":1024,"kindString":"Property","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":30,"character":9}],"type":{"type":"array","elementType":{"type":"reference","name":"TFace","id":37}}},{"id":14,"name":"linestrings","kind":1024,"kindString":"Property","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":32,"character":15}],"type":{"type":"array","elementType":{"type":"reference","name":"TLine","id":39}}},{"id":7,"name":"num_positions","kind":1024,"kindString":"Property","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":25,"character":17}],"type":{"type":"intrinsic","name":"number"}},{"id":13,"name":"points","kind":1024,"kindString":"Property","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":31,"character":10}],"type":{"type":"array","elementType":{"type":"reference","name":"TPoint","id":38}}},{"id":15,"name":"polygons","kind":1024,"kindString":"Property","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":33,"character":12}],"type":{"type":"array","elementType":{"type":"reference","name":"TPgon","id":40}}},{"id":8,"name":"triangles","kind":1024,"kindString":"Property","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":26,"character":13}],"type":{"type":"array","elementType":{"type":"reference","name":"TTri","id":33}}},{"id":9,"name":"vertices","kind":1024,"kindString":"Property","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":27,"character":12}],"type":{"type":"array","elementType":{"type":"reference","name":"TVert","id":34}}},{"id":11,"name":"wires","kind":1024,"kindString":"Property","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":29,"character":9}],"type":{"type":"array","elementType":{"type":"reference","name":"TWire","id":36}}}],"groups":[{"title":"Properties","kind":1024,"children":[16,10,12,14,7,13,15,8,9,11]}],"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":24,"character":26}]},{"id":29,"name":"IModelData","kind":256,"kindString":"Interface","flags":{"isExported":true,"isExternal":true},"children":[{"id":31,"name":"attributes","kind":1024,"kindString":"Property","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":52,"character":14}],"type":{"type":"reference","name":"IAttribsData","id":22}},{"id":30,"name":"geometry","kind":1024,"kindString":"Property","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":51,"character":12}],"type":{"type":"reference","name":"IGeomData","id":6}}],"groups":[{"title":"Properties","kind":1024,"children":[31,30]}],"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":50,"character":27}]},{"id":43,"name":"TAttribDataTypes","kind":4194304,"kindString":"Type alias","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":20,"character":28}],"type":{"type":"union","types":[{"type":"intrinsic","name":"string"},{"type":"array","elementType":{"type":"intrinsic","name":"string"}},{"type":"intrinsic","name":"number"},{"type":"array","elementType":{"type":"intrinsic","name":"number"}}]}},{"id":44,"name":"TAttribValuesArr","kind":4194304,"kindString":"Type alias","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":21,"character":28}],"type":{"type":"reference","name":"Array","typeArguments":[{"type":"tuple","elements":[{"type":"array","elementType":{"type":"intrinsic","name":"number"}},{"type":"reference","name":"TAttribDataTypes","id":43}]}]}},{"id":41,"name":"TColl","kind":4194304,"kindString":"Type alias","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":18,"character":17}],"type":{"type":"tuple","elements":[{"type":"intrinsic","name":"number"},{"type":"array","elementType":{"type":"intrinsic","name":"number"}},{"type":"array","elementType":{"type":"intrinsic","name":"number"}},{"type":"array","elementType":{"type":"intrinsic","name":"number"}}]}},{"id":32,"name":"TCoord","kind":4194304,"kindString":"Type alias","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":9,"character":18}],"type":{"type":"tuple","elements":[{"type":"intrinsic","name":"number"},{"type":"intrinsic","name":"number"},{"type":"intrinsic","name":"number"}]}},{"id":35,"name":"TEdge","kind":4194304,"kindString":"Type alias","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":12,"character":17}],"type":{"type":"tuple","elements":[{"type":"intrinsic","name":"number"},{"type":"intrinsic","name":"number"}]}},{"id":42,"name":"TEntity","kind":4194304,"kindString":"Type alias","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":19,"character":19}],"type":{"type":"union","types":[{"type":"reference","name":"TTri","id":33},{"type":"reference","name":"TVert","id":34},{"type":"reference","name":"TEdge","id":35},{"type":"reference","name":"TWire","id":36},{"type":"reference","name":"TFace","id":37},{"type":"reference","name":"TPoint","id":38},{"type":"reference","name":"TLine","id":39},{"type":"reference","name":"TPgon","id":40},{"type":"reference","name":"TColl","id":41}]}},{"id":37,"name":"TFace","kind":4194304,"kindString":"Type alias","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":14,"character":17}],"type":{"type":"tuple","elements":[{"type":"array","elementType":{"type":"intrinsic","name":"number"}},{"type":"array","elementType":{"type":"intrinsic","name":"number"}}]}},{"id":39,"name":"TLine","kind":4194304,"kindString":"Type alias","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":16,"character":17}],"type":{"type":"intrinsic","name":"number"}},{"id":40,"name":"TPgon","kind":4194304,"kindString":"Type alias","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":17,"character":17}],"type":{"type":"intrinsic","name":"number"}},{"id":38,"name":"TPoint","kind":4194304,"kindString":"Type alias","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":15,"character":18}],"type":{"type":"intrinsic","name":"number"}},{"id":33,"name":"TTri","kind":4194304,"kindString":"Type alias","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":10,"character":16}],"type":{"type":"tuple","elements":[{"type":"intrinsic","name":"number"},{"type":"intrinsic","name":"number"},{"type":"intrinsic","name":"number"}]}},{"id":34,"name":"TVert","kind":4194304,"kindString":"Type alias","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":11,"character":17}],"type":{"type":"intrinsic","name":"number"}},{"id":36,"name":"TWire","kind":4194304,"kindString":"Type alias","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":13,"character":17}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}}],"groups":[{"title":"Enumerations","kind":4,"children":[2]},{"title":"Interfaces","kind":256,"children":[17,22,6,29]},{"title":"Type aliases","kind":4194304,"children":[43,44,41,32,35,42,37,39,40,38,33,34,36]}],"sources":[{"fileName":"libs/geo-info/GIJson.ts","line":1,"character":0}]},{"id":649,"name":"\"libs/geo-info/GIModel\"","kind":1,"kindString":"External module","flags":{"isExported":true,"isExternal":true},"originalName":"C:/Users/akibdpt/Documents/Angular/mobius-parametric-modeller/src/libs/geo-info/GIModel.ts","children":[{"id":650,"name":"GIModel","kind":128,"kindString":"Class","flags":{"isExported":true,"isExternal":true},"comment":{"shortText":"Geo-info model class."},"children":[{"id":653,"name":"constructor","kind":512,"kindString":"Constructor","flags":{"isExported":true,"isExternal":true},"comment":{"shortText":"Creates a model."},"signatures":[{"id":654,"name":"new GIModel","kind":16384,"kindString":"Constructor signature","flags":{},"comment":{"shortText":"Creates a model."},"parameters":[{"id":655,"name":"model_data","kind":32768,"kindString":"Parameter","flags":{"isOptional":true},"comment":{"shortText":"The JSON data\n"},"type":{"type":"reference","name":"IModelData","id":29}}],"type":{"type":"reference","name":"GIModel","id":650}}],"sources":[{"fileName":"libs/geo-info/GIModel.ts","line":10,"character":32}]},{"id":652,"name":"_attribs","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIModel.ts","line":10,"character":20}],"type":{"type":"reference","name":"GIAttribs","id":555}},{"id":651,"name":"_geom","kind":1024,"kindString":"Property","flags":{"isPrivate":true,"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/GIModel.ts","line":9,"character":17}],"type":{"type":"reference","name":"GIGeom","id":294}},{"id":660,"name":"addData","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":661,"name":"addData","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Sets the data in this model from JSON data.\nThe existing data in the model is deleted."},"parameters":[{"id":662,"name":"model_data","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"The JSON data\n"},"type":{"type":"reference","name":"IModelData","id":29}}],"type":{"type":"intrinsic","name":"void"}}],"sources":[{"fileName":"libs/geo-info/GIModel.ts","line":30,"character":18}]},{"id":658,"name":"attribs","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":659,"name":"attribs","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"reference","name":"GIAttribs","id":555}}],"sources":[{"fileName":"libs/geo-info/GIModel.ts","line":24,"character":18}]},{"id":656,"name":"geom","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":657,"name":"geom","kind":4096,"kindString":"Call signature","flags":{},"type":{"type":"reference","name":"GIGeom","id":294}}],"sources":[{"fileName":"libs/geo-info/GIModel.ts","line":23,"character":15}]},{"id":672,"name":"get3jsData","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":673,"name":"get3jsData","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Returns arrays for visualization in Threejs."},"type":{"type":"reference","name":"IThreeJS","id":643}}],"sources":[{"fileName":"libs/geo-info/GIModel.ts","line":67,"character":21}]},{"id":670,"name":"getAttribsData","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":671,"name":"getAttribsData","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Returns the JSON data for the attributes in this model."},"type":{"type":"reference","name":"IAttribsData","id":22}}],"sources":[{"fileName":"libs/geo-info/GIModel.ts","line":61,"character":25}]},{"id":666,"name":"getData","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":667,"name":"getData","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Returns the JSON data for this model."},"type":{"type":"reference","name":"IModelData","id":29}}],"sources":[{"fileName":"libs/geo-info/GIModel.ts","line":46,"character":18}]},{"id":668,"name":"getGeomData","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":669,"name":"getGeomData","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Returns the JSON data for the geometry in this model."},"type":{"type":"reference","name":"IGeomData","id":6}}],"sources":[{"fileName":"libs/geo-info/GIModel.ts","line":55,"character":22}]},{"id":663,"name":"merge","kind":2048,"kindString":"Method","flags":{"isExported":true,"isExternal":true,"isPublic":true},"signatures":[{"id":664,"name":"merge","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Adds data to this model from JSON data.\nThe existing data in the model is not deleted."},"parameters":[{"id":665,"name":"model","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"reference","name":"GIModel","id":650}}],"type":{"type":"intrinsic","name":"void"}}],"sources":[{"fileName":"libs/geo-info/GIModel.ts","line":39,"character":16}]}],"groups":[{"title":"Constructors","kind":512,"children":[653]},{"title":"Properties","kind":1024,"children":[652,651]},{"title":"Methods","kind":2048,"children":[660,658,656,672,670,666,668,663]}],"sources":[{"fileName":"libs/geo-info/GIModel.ts","line":8,"character":20}]}],"groups":[{"title":"Classes","kind":128,"children":[650]}],"sources":[{"fileName":"libs/geo-info/GIModel.ts","line":1,"character":0}]},{"id":642,"name":"\"libs/geo-info/ThreejsJSON\"","kind":1,"kindString":"External module","flags":{"isExported":true,"isExternal":true},"originalName":"C:/Users/akibdpt/Documents/Angular/mobius-parametric-modeller/src/libs/geo-info/ThreejsJSON.ts","children":[{"id":643,"name":"IThreeJS","kind":256,"kindString":"Interface","flags":{"isExported":true,"isExternal":true},"children":[{"id":646,"name":"lines","kind":1024,"kindString":"Property","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/ThreejsJSON.ts","line":4,"character":9}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}},{"id":648,"name":"normals","kind":1024,"kindString":"Property","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/ThreejsJSON.ts","line":6,"character":11}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}},{"id":645,"name":"points","kind":1024,"kindString":"Property","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/ThreejsJSON.ts","line":3,"character":10}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}},{"id":644,"name":"positions","kind":1024,"kindString":"Property","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/ThreejsJSON.ts","line":2,"character":13}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}},{"id":647,"name":"triangles","kind":1024,"kindString":"Property","flags":{"isExported":true,"isExternal":true},"sources":[{"fileName":"libs/geo-info/ThreejsJSON.ts","line":5,"character":13}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}}],"groups":[{"title":"Properties","kind":1024,"children":[646,648,645,644,647]}],"sources":[{"fileName":"libs/geo-info/ThreejsJSON.ts","line":1,"character":25}]}],"groups":[{"title":"Interfaces","kind":256,"children":[643]}],"sources":[{"fileName":"libs/geo-info/ThreejsJSON.ts","line":1,"character":0}]},{"id":69,"name":"\"libs/threex/threex\"","kind":1,"kindString":"External module","flags":{"isExported":true,"isExternal":true},"originalName":"C:/Users/akibdpt/Documents/Angular/mobius-parametric-modeller/src/libs/threex/threex.ts","children":[{"id":70,"name":"EPS","kind":32,"kindString":"Variable","flags":{"isExternal":true,"isConst":true},"sources":[{"fileName":"libs/threex/threex.ts","line":3,"character":9}],"type":{"type":"unknown","name":"0.000001"},"defaultValue":"0.000001"},{"id":89,"name":"addVectors","kind":64,"kindString":"Function","flags":{"isExported":true,"isExternal":true},"signatures":[{"id":90,"name":"addVectors","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":91,"name":"v1","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"reference","name":"Vector3"}},{"id":92,"name":"v2","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"reference","name":"Vector3"}},{"id":93,"name":"norm","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"boolean"},"defaultValue":"false"}],"type":{"type":"reference","name":"Vector3"}}],"sources":[{"fileName":"libs/threex/threex.ts","line":45,"character":26}]},{"id":94,"name":"crossVectors","kind":64,"kindString":"Function","flags":{"isExported":true,"isExternal":true},"signatures":[{"id":95,"name":"crossVectors","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":96,"name":"v1","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"reference","name":"Vector3"}},{"id":97,"name":"v2","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"reference","name":"Vector3"}},{"id":98,"name":"norm","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"boolean"},"defaultValue":"false"}],"type":{"type":"reference","name":"Vector3"}}],"sources":[{"fileName":"libs/threex/threex.ts","line":52,"character":28}]},{"id":81,"name":"matrixInv","kind":64,"kindString":"Function","flags":{"isExported":true,"isExternal":true},"signatures":[{"id":82,"name":"matrixInv","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":83,"name":"m","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"reference","name":"Matrix4"}}],"type":{"type":"reference","name":"Matrix4"}}],"sources":[{"fileName":"libs/threex/threex.ts","line":31,"character":25}]},{"id":71,"name":"multVectorMatrix","kind":64,"kindString":"Function","flags":{"isExported":true,"isExternal":true},"signatures":[{"id":72,"name":"multVectorMatrix","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Utility functions for threejs."},"parameters":[{"id":73,"name":"v","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"reference","name":"Vector3"}},{"id":74,"name":"m","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"reference","name":"Matrix4"}}],"type":{"type":"reference","name":"Vector3"}}],"sources":[{"fileName":"libs/threex/threex.ts","line":10,"character":32}]},{"id":84,"name":"subVectors","kind":64,"kindString":"Function","flags":{"isExported":true,"isExternal":true},"signatures":[{"id":85,"name":"subVectors","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":86,"name":"v1","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"reference","name":"Vector3"}},{"id":87,"name":"v2","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"reference","name":"Vector3"}},{"id":88,"name":"norm","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"boolean"},"defaultValue":"false"}],"type":{"type":"reference","name":"Vector3"}}],"sources":[{"fileName":"libs/threex/threex.ts","line":38,"character":26}]},{"id":75,"name":"xformMatrix","kind":64,"kindString":"Function","flags":{"isExported":true,"isExternal":true},"signatures":[{"id":76,"name":"xformMatrix","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":77,"name":"o","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"reference","name":"Vector3"}},{"id":78,"name":"x","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"reference","name":"Vector3"}},{"id":79,"name":"y","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"reference","name":"Vector3"}},{"id":80,"name":"z","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"reference","name":"Vector3"}}],"type":{"type":"reference","name":"Matrix4"}}],"sources":[{"fileName":"libs/threex/threex.ts","line":16,"character":27}]}],"groups":[{"title":"Variables","kind":32,"children":[70]},{"title":"Functions","kind":64,"children":[89,94,81,71,84,75]}],"sources":[{"fileName":"libs/threex/threex.ts","line":1,"character":0}]},{"id":99,"name":"\"libs/triangulate/earcut\"","kind":1,"kindString":"External module","flags":{"isExported":true,"isExternal":true},"originalName":"C:/Users/akibdpt/Documents/Angular/mobius-parametric-modeller/src/libs/triangulate/earcut.ts","children":[{"id":239,"name":"Node","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":240,"name":"Node","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":241,"name":"i","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":242,"name":"x","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":243,"name":"y","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"void"}}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":769,"character":13}]},{"id":199,"name":"area","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":200,"name":"area","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":201,"name":"p","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":202,"name":"q","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":203,"name":"r","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":624,"character":13}]},{"id":154,"name":"compareX","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":155,"name":"compareX","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":156,"name":"a","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":157,"name":"b","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":373,"character":17}]},{"id":135,"name":"cureLocalIntersections","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":136,"name":"cureLocalIntersections","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":137,"name":"start","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":138,"name":"triangles","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":139,"name":"dim","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"any"}}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":268,"character":31}]},{"id":117,"name":"earcutLinked","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":118,"name":"earcutLinked","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":119,"name":"ear","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":120,"name":"triangles","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":121,"name":"dim","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":122,"name":"minX","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":123,"name":"minY","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":124,"name":"invSize","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":125,"name":"pass","kind":32768,"kindString":"Parameter","flags":{"isOptional":true},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"void"}}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":117,"character":21}]},{"id":158,"name":"eliminateHole","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":159,"name":"eliminateHole","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":160,"name":"hole","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":161,"name":"outerNode","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"void"}}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":381,"character":22}]},{"id":148,"name":"eliminateHoles","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":149,"name":"eliminateHoles","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":150,"name":"data","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":151,"name":"holeIndices","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":152,"name":"outerNode","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":153,"name":"dim","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"any"}}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":344,"character":23}]},{"id":204,"name":"equals","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":205,"name":"equals","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":206,"name":"p1","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":207,"name":"p2","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"boolean"}}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":632,"character":15}]},{"id":113,"name":"filterPoints","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":114,"name":"filterPoints","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":115,"name":"start","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":116,"name":"end","kind":32768,"kindString":"Parameter","flags":{"isOptional":true},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"any"}}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":85,"character":21}]},{"id":162,"name":"findHoleBridge","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":163,"name":"findHoleBridge","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":164,"name":"hole","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":165,"name":"outerNode","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"any"}}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":397,"character":23}]},{"id":182,"name":"getLeftmost","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":183,"name":"getLeftmost","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":184,"name":"start","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"any"}}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":588,"character":20}]},{"id":166,"name":"indexCurve","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":167,"name":"indexCurve","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":168,"name":"start","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":169,"name":"minX","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":170,"name":"minY","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":171,"name":"invSize","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"void"}}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":477,"character":19}]},{"id":230,"name":"insertNode","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":231,"name":"insertNode","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":232,"name":"i","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":233,"name":"x","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":234,"name":"y","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":235,"name":"last","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"any"}}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":737,"character":19}]},{"id":208,"name":"intersects","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":209,"name":"intersects","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":210,"name":"p1","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":211,"name":"q1","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":212,"name":"p2","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":213,"name":"q2","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"boolean"}}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":640,"character":19}]},{"id":214,"name":"intersectsPolygon","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":215,"name":"intersectsPolygon","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":216,"name":"a","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":217,"name":"b","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"boolean"}}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":652,"character":26}]},{"id":126,"name":"isEar","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":127,"name":"isEar","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":128,"name":"ear","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"boolean"}}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":188,"character":14}]},{"id":129,"name":"isEarHashed","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":130,"name":"isEarHashed","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":131,"name":"ear","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":132,"name":"minX","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":133,"name":"minY","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":134,"name":"invSize","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"boolean"}}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":215,"character":20}]},{"id":195,"name":"isValidDiagonal","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":196,"name":"isValidDiagonal","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":197,"name":"a","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":198,"name":"b","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"boolean"}}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":615,"character":24}]},{"id":106,"name":"linkedList","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":107,"name":"linkedList","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":108,"name":"data","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":109,"name":"start","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":110,"name":"end","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":111,"name":"dim","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":112,"name":"clockwise","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"any"}}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":58,"character":19}]},{"id":218,"name":"locallyInside","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":219,"name":"locallyInside","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":220,"name":"a","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":221,"name":"b","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"boolean"}}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":675,"character":22}]},{"id":222,"name":"middleInside","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":223,"name":"middleInside","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":224,"name":"a","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":225,"name":"b","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"boolean"}}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":685,"character":21}]},{"id":185,"name":"pointInTriangle","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":186,"name":"pointInTriangle","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":187,"name":"ax","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":188,"name":"ay","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":189,"name":"bx","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":190,"name":"by","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":191,"name":"cx","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":192,"name":"cy","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":193,"name":"px","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":194,"name":"py","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"boolean"}}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":605,"character":24}]},{"id":236,"name":"removeNode","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":237,"name":"removeNode","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":238,"name":"p","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"void"}}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":759,"character":19}]},{"id":244,"name":"signedArea","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":245,"name":"signedArea","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":246,"name":"data","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":247,"name":"start","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":248,"name":"end","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":249,"name":"dim","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":794,"character":19}]},{"id":172,"name":"sortLinked","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":173,"name":"sortLinked","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":174,"name":"list","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"any"}}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":500,"character":19}]},{"id":140,"name":"splitEarcut","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":141,"name":"splitEarcut","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":142,"name":"start","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":143,"name":"triangles","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":144,"name":"dim","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":145,"name":"minX","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":146,"name":"minY","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":147,"name":"invSize","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"void"}}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":301,"character":20}]},{"id":226,"name":"splitPolygon","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":227,"name":"splitPolygon","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":228,"name":"a","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":229,"name":"b","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"any"}}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":712,"character":21}]},{"id":175,"name":"zOrder","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":176,"name":"zOrder","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":177,"name":"x","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":178,"name":"y","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":179,"name":"minX","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":180,"name":"minY","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":181,"name":"invSize","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"intrinsic","name":"number"}}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":565,"character":15}]},{"id":100,"name":"Earcut","kind":2097152,"kindString":"Object literal","flags":{"isExternal":true,"isConst":true},"comment":{"tags":[{"tag":"author","text":"Mugen87 / https://github.com/Mugen87\nPort from https://github.com/mapbox/earcut (v2.1.2)\n"}]},"children":[{"id":101,"name":"triangulate","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":102,"name":"triangulate","kind":4096,"kindString":"Call signature","flags":{},"parameters":[{"id":103,"name":"data","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"intrinsic","name":"any"}},{"id":104,"name":"holeIndices","kind":32768,"kindString":"Parameter","flags":{"isOptional":true},"type":{"type":"intrinsic","name":"any"}},{"id":105,"name":"dim","kind":32768,"kindString":"Parameter","flags":{"isOptional":true},"type":{"type":"intrinsic","name":"any"}}],"type":{"type":"array","elementType":{"type":"intrinsic","name":"any"}}}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":8,"character":15}]}],"groups":[{"title":"Functions","kind":64,"children":[101]}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":6,"character":12}],"type":{"type":"intrinsic","name":"object"}}],"groups":[{"title":"Functions","kind":64,"children":[239,199,154,135,117,158,148,204,113,162,182,166,230,208,214,126,129,195,106,218,222,185,236,244,172,140,226,175]},{"title":"Object literals","kind":2097152,"children":[100]}],"sources":[{"fileName":"libs/triangulate/earcut.ts","line":1,"character":0}]},{"id":286,"name":"\"libs/triangulate/triangulate\"","kind":1,"kindString":"External module","flags":{"isExported":true,"isExternal":true},"originalName":"C:/Users/akibdpt/Documents/Angular/mobius-parametric-modeller/src/libs/triangulate/triangulate.ts","children":[{"id":287,"name":"_makeVertices2D","kind":64,"kindString":"Function","flags":{"isExternal":true},"signatures":[{"id":288,"name":"_makeVertices2D","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Function to transform a set of vertices in 3d space onto the xy plane.\nThis function assumes that the vertices are co-planar.\nReturns a set of three Vectors that represent points on the xy plane."},"parameters":[{"id":289,"name":"points","kind":32768,"kindString":"Parameter","flags":{},"type":{"type":"array","elementType":{"type":"reference","name":"Vector3"}}}],"type":{"type":"array","elementType":{"type":"reference","name":"Vector3"}}}],"sources":[{"fileName":"libs/triangulate/triangulate.ts","line":15,"character":24}]},{"id":290,"name":"triangulate","kind":64,"kindString":"Function","flags":{"isExported":true,"isExternal":true},"signatures":[{"id":291,"name":"triangulate","kind":4096,"kindString":"Call signature","flags":{},"comment":{"shortText":"Triangulates a polygon"},"parameters":[{"id":292,"name":"coords","kind":32768,"kindString":"Parameter","flags":{},"comment":{"text":"\n"},"type":{"type":"array","elementType":{"type":"reference","name":"TCoord","id":32}}}],"type":{"type":"array","elementType":{"type":"array","elementType":{"type":"intrinsic","name":"number"}}}}],"sources":[{"fileName":"libs/triangulate/triangulate.ts","line":44,"character":27}]}],"groups":[{"title":"Functions","kind":64,"children":[287,290]}],"sources":[{"fileName":"libs/triangulate/triangulate.ts","line":1,"character":0}]}],"groups":[{"title":"External modules","kind":1,"children":[674,730,741,719,725,250,491,528,554,45,293,1,649,642,69,99,286]}]};

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

/***/ "./src/libs/arr/arr.ts":
/*!*****************************!*\
  !*** ./src/libs/arr/arr.ts ***!
  \*****************************/
/*! exports provided: Arr */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Arr", function() { return Arr; });
/**
 * A set of static methods for working with arrays of simple types.
 * The arrays can be nested, but they do not contain any objects.
 */
var Arr = /** @class */ (function () {
    function Arr() {
    }
    /**
     * Make an array of numbers. All elements in the array will have the same value.
     * @param length The length of the new array. If length is 0, then an empty array is returned.
     * @param value The values in the array.
     * @returns The resulting array.
     */
    Arr.make = function (length, value) {
        if (length === 0) {
            return [];
        }
        return Array.apply(0, new Array(length)).map(function (v, i) { return value; });
    };
    /**
     * Make an array of numbers. All elements in the array will be a numerical sequence, 0, 1, 2, 3....
     * @param length  The length of the new array. If length is 0, then an empty array is returned.
     * @returns The resulting array.
     */
    Arr.makeSeq = function (length) {
        if (length === 0) {
            return [];
        }
        return Array.apply(0, new Array(length)).map(function (v, i) { return i; });
    };
    /**
     * Check if two nD arrays are equal (i.e. that all elements in the array are equal, ===.).
     * If the arrays are unequal in length, false is returned.
     * Elements in the array can have any value.
     * @param arr1 The first value.
     * @param arr2 The second values.
     * @returns True or false.
     */
    Arr.equal = function (arr1, arr2) {
        if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
            return arr1 === arr2;
        }
        if (arr1.length !== arr2.length) {
            return false;
        }
        for (var i = 0; i < arr1.length; i++) {
            if (!this.equal(arr1[i], arr2[i])) {
                return false;
            }
        }
        return true;
    };
    /**
     * Find the position of the first occurrence of a specified value in an array.
     * The value can be an array (which is not the case for Array.indexOf()).
     * If the value is not found or is undefined, return -1.
     * If the array is null or undefined, return -1.
     * @param value The value, can be a value or a 1D array of values.
     * @returns The index in the array of the first occurance of the value.
     */
    Arr.indexOf = function (arr, value) {
        if (!Array.isArray(arr)) {
            throw new Error('First argument must be a array.');
        }
        if (!Array.isArray(value)) {
            return arr.indexOf(value);
        }
        for (var i = 0; i < arr.length; i++) {
            if (Array.isArray(arr[i]) && this.equal(value, arr[i])) {
                return i;
            }
        }
        return -1;
    };
    /**
     * Replace all occurrences of a specified value in an array.
     * The input array is changed.
     * The value can be an array.
     * If the value is not found or is undefined, return -1.
     * @param old_value The old value to replace.
     * @param new_value The new value.
     * @param arr The array.
     */
    Arr.replace = function (arr, old_value, new_value) {
        if (!Array.isArray(arr)) {
            throw new Error('First argument must be a array.');
        }
        for (var i = 0; i < arr.length; i++) {
            if (this.equal(arr[i], old_value)) {
                arr[i] = new_value;
            }
        }
    };
    /**
     * Take an nD array and flattens it.
     * A new array is returned. The input array remains unchanged.
     * For example, [1, 2, [3, 4], [5, 6]] will become [1, 2, 3, 4, 5, 6].
     * If the input array is undefined, an empty array is returned.
     * @param arr The multidimensional array to flatten.
     * @returns A new 1D array.
     */
    Arr.flatten = function (arr, depth) {
        if (arr === undefined) {
            return [];
        }
        return arr.reduce(function (flat, toFlatten) {
            if (depth === undefined) {
                return flat.concat(Array.isArray(toFlatten) ? Arr.flatten(toFlatten) : toFlatten);
            }
            else {
                return flat.concat((Array.isArray(toFlatten) && (depth !== 0)) ?
                    Arr.flatten(toFlatten, depth - 1) : toFlatten);
            }
        }, []);
    };
    /**
     * Make a copy of an nD array.
     * If the input is not an array, then just return the same thing.
     * A new array is returned. The input array remains unchanged.
     * If the input array is undefined, an empty array is returned.
     * If the input is s sparse array, then the output will alos be a sparse array.
     * @param arr The nD array to copy.
     * @returns The new nD array.
     */
    Arr.deepCopy = function (arr) {
        if (arr === undefined) {
            return [];
        }
        if (!Array.isArray(arr)) {
            return arr;
        }
        var arr2 = [];
        for (var i = 0; i < arr.length; i++) {
            if (Array.isArray(arr[i])) {
                arr2[i] = (Arr.deepCopy(arr[i]));
            }
            else {
                if (arr[i] !== undefined) {
                    arr2[i] = (arr[i]);
                }
            }
        }
        return arr2;
    };
    /**
     * Fills an nD array with new values (all the same value).
     * The input array is changed.
     * If the input array is undefined, an empty array is returned.
     * The input can be a sparse array.
     * @param arr The nD array to fill.
     * @param value The value to insert into the array.
     */
    Arr.deepFill = function (arr, value) {
        if (arr === undefined) {
            return;
        }
        for (var i = 0; i < arr.length; i++) {
            if (Array.isArray(arr[i])) {
                Arr.deepFill(arr[i], value);
            }
            else {
                if (arr[i] !== undefined) {
                    arr[i] = value;
                }
            }
        }
    };
    /**
     * Counts the number of values in an nD array .
     * The input array remains unchanged.
     * If the input array is undefined, 0 is returned.
     * The input can be a sparse array. Undefined values are ignored.
     * For example, for [1, 2, , , 3], the count will be 3.
     * @param arr The nD array to count.
     * @return The number of elements in the nD array.
     */
    Arr.deepCount = function (arr) {
        if (arr === undefined) {
            return 0;
        }
        var a = 0;
        for (var i in arr) {
            if (Array.isArray(arr[i])) {
                a = a + Arr.deepCount(arr[i]);
            }
            else {
                if (arr[i] !== undefined) {
                    a = a + 1;
                }
            }
        }
        return a;
    };
    return Arr;
}());



/***/ }),

/***/ "./src/libs/geo-info/BiMap.ts":
/*!************************************!*\
  !*** ./src/libs/geo-info/BiMap.ts ***!
  \************************************/
/*! exports provided: BiMapManyToOne */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BiMapManyToOne", function() { return BiMapManyToOne; });
/**
 * A bi-directional map that stores many-to-one key value mappings.
 * Multiple keys point to the same value.
 * Both the keys and values must be unique.
 * The keys are integers, the values can be any type.
 */
var BiMapManyToOne = /** @class */ (function () {
    /**
     * Creates a new bi-directional many-to-one map.
     * If the data is provided, it will be added to the map.
     * @param data
     */
    function BiMapManyToOne(data) {
        this.kv_map = new Map();
        this.vk_map = new Map();
        if (data) {
            this.addData(data);
        }
    }
    /**
     * Populate the data in this map with an array.
     * For example, [[1,3], 'a'],[[0,4], 'b']
     * @param data
     */
    BiMapManyToOne.prototype.addData = function (data) {
        var _this = this;
        data.forEach(function (keys_value) {
            keys_value[0].forEach(function (key) { return _this.set(key, keys_value[1]); });
        });
    };
    /**
     * Set a single key-value pair.
     * @param key
     * @param value
     */
    BiMapManyToOne.prototype.set = function (key, value) {
        var value_str = JSON.stringify(value);
        if (!this.vk_map.has(value_str)) {
            this.vk_map.set(value_str, [key]);
        }
        else {
            if (this.vk_map.get(value_str).indexOf(key) === -1) {
                this.vk_map.get(value_str).push(key);
            }
        }
        this.kv_map.set(key, value);
    };
    /**
     * Returns an array of all values.
     */
    BiMapManyToOne.prototype.values = function () {
        return Array.from(this.kv_map.values());
    };
    /**
     * Returns an array of all keys.
     */
    BiMapManyToOne.prototype.keys = function () {
        return Array.from(this.kv_map.keys());
    };
    /**
     * Returns an array of keys that point to this value.
     * @param value
     */
    BiMapManyToOne.prototype.getKeys = function (value) {
        var value_str = JSON.stringify(value);
        return this.vk_map.get(value_str);
    };
    /**
     * Returns the value to which this key points.
     * @param key
     */
    BiMapManyToOne.prototype.getValue = function (key) {
        return this.kv_map.get(key);
    };
    /**
     * Returns true if the map contains the key.
     * @param key
     */
    BiMapManyToOne.prototype.hasKey = function (key) {
        return this.kv_map.has(key);
    };
    /**
     * Returns true if the map contains the value.
     * @param value
     */
    BiMapManyToOne.prototype.hasValue = function (value) {
        var value_str = JSON.stringify(value);
        return this.vk_map.has(value_str);
    };
    /**
     * Total number of keys.
     */
    BiMapManyToOne.prototype.numKeys = function () {
        return this.kv_map.size;
    };
    /**
     * Total number of values.
     */
    BiMapManyToOne.prototype.numValues = function () {
        return this.vk_map.size;
    };
    /**
     * Return a a data array.
     * For example, [[1,3], 'a'],[[0,4], 'b']
     */
    BiMapManyToOne.prototype.getData = function () {
        var data = [];
        this.vk_map.forEach(function (keys, value_str) {
            var value = JSON.parse(value_str); // TODO This is not good <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            data.push([keys, value]);
        });
        return data;
    };
    return BiMapManyToOne;
}());



/***/ }),

/***/ "./src/libs/geo-info/GIAttribMap.ts":
/*!******************************************!*\
  !*** ./src/libs/geo-info/GIAttribMap.ts ***!
  \******************************************/
/*! exports provided: GIAttribMap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GIAttribMap", function() { return GIAttribMap; });
/* harmony import */ var _BiMap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BiMap */ "./src/libs/geo-info/BiMap.ts");

//  ===============================================================================================================
//  Classes
//  ===============================================================================================================
/**
 * Geo-info attribute class.
 * The attributs are stores as key-value pairs.
 * Multiple keys point to the same values.
 * So for example, [[1,3], "a"],[[0,4], "b"] can be converted into sequentia arrays.
 * The sequential values would be ["a", "b"]
 * The sequentail keys would be [1,0,,0,1] (Note the undefined value in the middle.)
 *
 */
var GIAttribMap = /** @class */ (function () {
    /**
     * Creates an attribute.
     * @param attrib_data
     */
    function GIAttribMap(attrib_data) {
        this.name = attrib_data.name;
        this.data_type = attrib_data.data_type;
        this.data_size = attrib_data.data_size;
        this.bi_map = new _BiMap__WEBPACK_IMPORTED_MODULE_0__["BiMapManyToOne"](attrib_data.data);
    }
    /**
     * Returns the JSON data for this attribute.
     */
    GIAttribMap.prototype.getData = function () {
        return {
            name: this.name,
            data_type: this.data_type,
            data_size: this.data_size,
            data: this.bi_map.getData()
        };
    };
    /**
     * Adds data to this attribute from JSON data.
     * The existing data in the model is not deleted.
     * @param attrib_data The JSON data.
     */
    GIAttribMap.prototype.addData = function (attrib_data, offset) {
        if (this.name !== attrib_data.name ||
            this.data_type !== attrib_data.data_type ||
            this.data_size !== attrib_data.data_size) {
            throw Error('Attributes do not match.');
        }
        attrib_data.data.forEach(function (keys_value) {
            keys_value[0] = keys_value[0].map(function (key) { return key + offset; });
        });
        this.bi_map.addData(attrib_data.data);
    };
    /**
     * Sets a single attribute value.
     * @param key
     * @param value
     */
    GIAttribMap.prototype.set = function (key, value) {
        this.bi_map.set(key, value);
    };
    /**
     * Gets a single attribute value.
     * @param key
     */
    GIAttribMap.prototype.get = function (key) {
        return this.bi_map.getValue(key);
    };
    /**
     * Gets a list of all the attribute keys, in sequential order.
     * The key vaues are mapped.
     * The key value gets maped to the new list position.
     * The key index gets mapped to the new value.
     * So for example, for [[1,3], 'a'],[[0,4], 'b'], the sequentail keys would be [1,0,,0,1].
     */
    GIAttribMap.prototype.getSeqKeys = function () {
        var seqKeys = [];
        this.bi_map.getData().forEach(function (keys_value, index) { return keys_value[0].forEach(function (key) { return seqKeys[key] = index; }); });
        return seqKeys;
    };
    /**
     * Gets a list of all the attribute values, in sequential order.
     * So for example, for [[1,3], 'a'],[[0,4], 'b'], the sequentail values would be ['a', 'b']
     */
    GIAttribMap.prototype.getSeqValues = function () {
        return this.bi_map.values();
    };
    return GIAttribMap;
}());



/***/ }),

/***/ "./src/libs/geo-info/GIAttribs.ts":
/*!****************************************!*\
  !*** ./src/libs/geo-info/GIAttribs.ts ***!
  \****************************************/
/*! exports provided: GIAttribs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GIAttribs", function() { return GIAttribs; });
/* harmony import */ var _GIAttribMap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GIAttribMap */ "./src/libs/geo-info/GIAttribMap.ts");
/* harmony import */ var _GICommon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./GICommon */ "./src/libs/geo-info/GICommon.ts");


/**
 * Class for attributes.
 */
var GIAttribs = /** @class */ (function () {
    /**
      * Creates an object to store the attribute data.
      * @param model The JSON data
      */
    function GIAttribs(model) {
        // maps, the key is the name, the value is the map
        this.posis = new Map();
        this.verts = new Map();
        this.edges = new Map();
        this.wires = new Map();
        this.faces = new Map();
        this.colls = new Map();
        // all maps
        this.attrib_maps = {
            po: this.posis,
            _v: this.verts,
            _e: this.edges,
            _w: this.wires,
            _f: this.faces,
            co: this.colls
        };
        this.model = model;
    }
    /**
     * Returns the JSON data for this model.
     */
    GIAttribs.prototype.getData = function () {
        return {
            positions: Array.from(this.posis.values()).map(function (attrib) { return attrib.getData(); }),
            vertices: Array.from(this.verts.values()).map(function (attrib) { return attrib.getData(); }),
            edges: Array.from(this.edges.values()).map(function (attrib) { return attrib.getData(); }),
            wires: Array.from(this.wires.values()).map(function (attrib) { return attrib.getData(); }),
            faces: Array.from(this.faces.values()).map(function (attrib) { return attrib.getData(); }),
            collections: Array.from(this.colls.values()).map(function (attrib) { return attrib.getData(); })
        };
    };
    /**
     * Adds data to this model from JSON data.
     * The existing data in the model is not deleted.
     * @param attribs_data The JSON data
     */
    GIAttribs.prototype.addData = function (attribs_data) {
        // Helper function to ddd attributes to model
        function _addAttribsData(exist_attribs_map, new_attribs_data, offset) {
            new_attribs_data.forEach(function (new_attrib_data) {
                if (!exist_attribs_map.has(new_attrib_data.name)) {
                    exist_attribs_map.set(new_attrib_data.name, new _GIAttribMap__WEBPACK_IMPORTED_MODULE_0__["GIAttribMap"](new_attrib_data));
                }
                else {
                    exist_attribs_map.get(new_attrib_data.name).addData(new_attrib_data, offset);
                }
            });
        }
        _addAttribsData(this.posis, attribs_data.positions, this.model.geom().numPosis());
        _addAttribsData(this.verts, attribs_data.vertices, this.model.geom().numVerts());
        _addAttribsData(this.edges, attribs_data.edges, this.model.geom().numEdges());
        _addAttribsData(this.wires, attribs_data.wires, this.model.geom().numWires());
        _addAttribsData(this.faces, attribs_data.faces, this.model.geom().numFaces());
        _addAttribsData(this.colls, attribs_data.collections, this.model.geom().numColls());
    };
    // ============================================================================
    // Private methods
    // ============================================================================
    /**
     * Creates a new attribte.
     * @param type_str The level at which to create the attribute.
     * @param name The name of the attribute.
     * @param data_type The data type of the attribute.
     * @param data_size The data size of the attribute. For example, an XYZ vector has size=3.
     */
    GIAttribs.prototype._addAttrib = function (type_str, name, data_type, data_size) {
        var attribs = this.attrib_maps[type_str];
        if (!attribs.has(name)) {
            var attrib = new _GIAttribMap__WEBPACK_IMPORTED_MODULE_0__["GIAttribMap"]({ name: name, data_type: data_type, data_size: data_size, data: [] });
            attribs.set(name, attrib);
        }
        return attribs[name];
    };
    // ============================================================================
    // Public methods
    // ============================================================================
    /**
     * Set an entity attrib value
     * @param id
     * @param name
     * @param value
     */
    GIAttribs.prototype.setAttribValue = function (id, name, value) {
        var _a = Object(_GICommon__WEBPACK_IMPORTED_MODULE_1__["idBreak"])(id), type_str = _a[0], index = _a[1];
        var attribs = this.attrib_maps[type_str];
        if (attribs.get(name) === undefined) {
            throw new Error('Attribute does not exist.');
        }
        attribs.get(name).set(index, value);
    };
    /**
     * Get an entity attrib value
     * @param id
     * @param name
     */
    GIAttribs.prototype.getAttribValue = function (id, name) {
        var _a = Object(_GICommon__WEBPACK_IMPORTED_MODULE_1__["idBreak"])(id), type_str = _a[0], index = _a[1];
        var attribs = this.attrib_maps[type_str];
        if (attribs.get(name) === undefined) {
            throw new Error('Attribute does not exist.');
        }
        return attribs.get(name).get(index);
    };
    /**
     * Shortcut for getting coordinates from a numeric index (i.e. this is not an ID)
     * @param posi_i
     */
    GIAttribs.prototype.getPosiCoord = function (posi_i) {
        return this.posis.get('coordinates').get(posi_i);
    };
    // ============================================================================
    // Get entity attrib names
    // ============================================================================
    GIAttribs.prototype.getPosiAttribNames = function () {
        return Array.from(this.posis.keys());
    };
    GIAttribs.prototype.getVertAttribNames = function () {
        return Array.from(this.verts.keys());
    };
    GIAttribs.prototype.getEdgeAttribNames = function () {
        return Array.from(this.edges.keys());
    };
    GIAttribs.prototype.getWireAttribNames = function () {
        return Array.from(this.wires.keys());
    };
    GIAttribs.prototype.getFaceAttribNames = function () {
        return Array.from(this.faces.keys());
    };
    GIAttribs.prototype.getCollAttribNames = function () {
        return Array.from(this.colls.keys());
    };
    // ============================================================================
    // Add an entity attrib
    // ============================================================================
    GIAttribs.prototype.addPosiAttrib = function (name, data_type, data_size) {
        return this._addAttrib(_GICommon__WEBPACK_IMPORTED_MODULE_1__["EEntityTypeStr"].POSI, name, data_type, data_size);
    };
    GIAttribs.prototype.addVertAttrib = function (name, data_type, data_size) {
        return this._addAttrib(_GICommon__WEBPACK_IMPORTED_MODULE_1__["EEntityTypeStr"].VERT, name, data_type, data_size);
    };
    GIAttribs.prototype.addEdgeAttrib = function (name, data_type, data_size) {
        return this._addAttrib(_GICommon__WEBPACK_IMPORTED_MODULE_1__["EEntityTypeStr"].EDGE, name, data_type, data_size);
    };
    GIAttribs.prototype.addWireAttrib = function (name, data_type, data_size) {
        return this._addAttrib(_GICommon__WEBPACK_IMPORTED_MODULE_1__["EEntityTypeStr"].WIRE, name, data_type, data_size);
    };
    GIAttribs.prototype.addFaceAttrib = function (name, data_type, data_size) {
        return this._addAttrib(_GICommon__WEBPACK_IMPORTED_MODULE_1__["EEntityTypeStr"].FACE, name, data_type, data_size);
    };
    GIAttribs.prototype.addCollAttrib = function (name, data_type, data_size) {
        return this._addAttrib(_GICommon__WEBPACK_IMPORTED_MODULE_1__["EEntityTypeStr"].COLL, name, data_type, data_size);
    };
    // ============================================================================
    // Threejs
    // For methods to get the array of edges and triangles, see the geom class
    // get3jsTris() and get3jsEdges()
    // ============================================================================
    /**
     * Get a flat array of all the coordinates of all the vertices.
     * @param verts An array of vertex indicies pointing to the coordinates.
     */
    GIAttribs.prototype.get3jsSeqVertsCoords = function (verts) {
        var coords_attrib = this.posis.get('coordinates');
        var coords_keys = coords_attrib.getSeqKeys();
        var coords_values = coords_attrib.getSeqValues();
        var verts_cords_values = [];
        verts.forEach(function (coords_i) { return verts_cords_values.push.apply(verts_cords_values, coords_values[coords_keys[coords_i]]); });
        return verts_cords_values;
    };
    /**
     * Get a flat array of attribute values for all the vertices.
     * @param attrib_name The name of the vertex attribute. Either NORMAL or COLOR.
     */
    GIAttribs.prototype.get3jsSeqVertsAttrib = function (attrib_name) {
        if (!this.verts.has(attrib_name)) {
            return null;
        }
        var attrib_map = this.verts.get(attrib_name);
        var attrib_keys = attrib_map.getSeqKeys();
        var attrib_values = attrib_map.getSeqValues();
        var result = [].concat.apply([], attrib_keys.map(function (attrib_key) { return attrib_values[attrib_key]; }));
        return result;
    };
    return GIAttribs;
}());



/***/ }),

/***/ "./src/libs/geo-info/GICommon.ts":
/*!***************************************!*\
  !*** ./src/libs/geo-info/GICommon.ts ***!
  \***************************************/
/*! exports provided: EEntityTypeStr, EAttribNames, idBreak, idIndex, idIndicies, idEntityTypeStr */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EEntityTypeStr", function() { return EEntityTypeStr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EAttribNames", function() { return EAttribNames; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "idBreak", function() { return idBreak; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "idIndex", function() { return idIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "idIndicies", function() { return idIndicies; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "idEntityTypeStr", function() { return idEntityTypeStr; });
// Enum
var EEntityTypeStr;
(function (EEntityTypeStr) {
    EEntityTypeStr["POSI"] = "po";
    EEntityTypeStr["TRI"] = "_t";
    EEntityTypeStr["VERT"] = "_v";
    EEntityTypeStr["EDGE"] = "_e";
    EEntityTypeStr["WIRE"] = "_w";
    EEntityTypeStr["FACE"] = "_f";
    EEntityTypeStr["POINT"] = "pt";
    EEntityTypeStr["LINE"] = "ls";
    EEntityTypeStr["PGON"] = "pg";
    EEntityTypeStr["COLL"] = "co";
})(EEntityTypeStr || (EEntityTypeStr = {}));
// Names of attributes
var EAttribNames;
(function (EAttribNames) {
    EAttribNames["COORDS"] = "coordinates";
    EAttribNames["NORMAL"] = "normal";
    EAttribNames["COLOR"] = "color";
})(EAttribNames || (EAttribNames = {}));
// ============================================================================
// Each entity in the model can be accessed using an ID string.
// Below are functions for breaking ID strings into the component parts
// IDs start with two characters followed by numeric digits.
// For example '_v22' is vertex number 22.
// ============================================================================
function idBreak(id) {
    return [idEntityTypeStr(id), idIndex(id)];
}
function idIndex(id) {
    return Number(id.slice(2));
}
function idIndicies(ids) {
    return ids.map(function (id) { return Number(id.slice(2)); });
}
function idEntityTypeStr(id) {
    return id.slice(0, 2);
}


/***/ }),

/***/ "./src/libs/geo-info/GIGeom.ts":
/*!*************************************!*\
  !*** ./src/libs/geo-info/GIGeom.ts ***!
  \*************************************/
/*! exports provided: GIGeom */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GIGeom", function() { return GIGeom; });
/* harmony import */ var _GICommon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GICommon */ "./src/libs/geo-info/GICommon.ts");
/* harmony import */ var _triangulate_triangulate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../triangulate/triangulate */ "./src/libs/triangulate/triangulate.ts");


/**
 * Class for geometry.
 */
var GIGeom = /** @class */ (function () {
    /**
     * Creates an object to store the geometry data.
     * @param geom_data The JSON data
     */
    function GIGeom(model) {
        // positions
        this.num_posis = 0; // The total number of positions in the model.
        this.rev_posis_verts = []; // 1 position -> many vertices
        // triangles
        this.tris = []; // 1 triangles -> 3 vertices
        this.rev_tris_faces = []; // 1 tri -> 1 face
        // vertices
        this.verts = []; // many vertices -> 1 position
        this.rev_verts_edges = []; // 1 vertex -> 1 edge
        this.rev_verts_tris = []; // 1 vertex -> 1 tri // TODO add code to update this
        this.rev_verts_points = []; // 1 vertex -> 1 point
        // edges
        this.edges = []; // 1 edge -> 2 vertices
        this.rev_edges_wires = []; // 1 edge -> 1 wire
        // wires
        this.wires = []; // 1 wire -> many edges
        this.rev_wires_faces = []; // 1 wire -> 1 face
        this.rev_wires_lines = []; // 1 wire -> 1 line
        // faces
        this.faces = []; // 1 face -> many wires
        this.rev_faces_pgons = []; // 1 face -> 1 pgon
        // points
        this.points = []; // 1 point -> 1 vertex
        this.rev_points_colls = []; // 1 point -> 1 collection
        // polylines
        this.lines = []; // 1 polyline -> 1 wire
        this.rev_lines_colls = []; // 1 line -> 1 collection
        // polygons
        this.pgons = []; // 1 polygon -> 1 face
        this.rev_pgons_colls = []; // 1 pgon -> 1 collection
        // collections
        this.colls = []; // 1 collection -> many points, many polylines, many polygons
        // all arrays
        this.geom_arrs = {
            _t: this.tris,
            _v: this.verts,
            _e: this.edges,
            _w: this.wires,
            _f: this.faces,
            pt: this.points,
            ls: this.lines,
            pg: this.pgons,
            co: this.colls
        };
        this.model = model;
    }
    /**
     * Returns the JSON data for this model.
     */
    GIGeom.prototype.getData = function () {
        return {
            num_positions: this.num_posis,
            triangles: this.tris,
            vertices: this.verts,
            edges: this.edges,
            wires: this.wires,
            faces: this.faces,
            points: this.points,
            linestrings: this.lines,
            polygons: this.pgons,
            collections: this.colls
        };
    };
    /**
     * Adds data to this model from JSON data.
     * The existing data in the model is not deleted.
     * @param geom_data The JSON data
     */
    GIGeom.prototype.addData = function (geom_data) {
        var _this = this;
        var _a, _b, _c, _d, _g, _h, _j, _k, _l;
        // get lengths before we start adding stuff
        var num_tris = this.tris.length;
        var num_verts = this.verts.length;
        var num_edges = this.edges.length;
        var num_wires = this.wires.length;
        var num_faces = this.faces.length;
        var num_points = this.points.length;
        var num_lines = this.lines.length;
        var num_pgons = this.pgons.length;
        var num_colls = this.colls.length;
        // Add triangles to model
        var new_triangles = geom_data.triangles.map(function (t) { return t.map(function (p) { return p + _this.num_posis; }); });
        (_a = this.tris).push.apply(_a, new_triangles);
        // Add vertices to model
        var new_verts = geom_data.vertices.map(function (p) { return p + _this.num_posis; });
        (_b = this.verts).push.apply(_b, new_verts);
        // Add edges to model
        var new_edges = geom_data.edges.map(function (e) { return e.map(function (v) { return v + num_verts; }); });
        (_c = this.edges).push.apply(_c, new_edges);
        // Add wires to model
        var new_wires = geom_data.wires.map(function (w) { return w.map(function (e) { return e + num_edges; }); });
        (_d = this.wires).push.apply(_d, new_wires);
        // Add faces to model
        var new_faces = geom_data.faces.map(function (f) { return [
            f[0].map(function (w) { return w + num_wires; }),
            f[1].map(function (t) { return t + num_tris; })
        ]; });
        (_g = this.faces).push.apply(_g, new_faces);
        // Add points to model
        var new_points = geom_data.points.map(function (v) { return v + num_verts; });
        (_h = this.points).push.apply(_h, new_points);
        // Add lines to model
        var new_lines = geom_data.linestrings.map(function (w) { return w + num_wires; });
        (_j = this.lines).push.apply(_j, new_lines);
        // Add pgons to model
        var new_pgons = geom_data.polygons.map(function (f) { return f + num_faces; });
        (_k = this.pgons).push.apply(_k, new_pgons);
        // Add collections to model
        var new_colls = geom_data.collections.map(function (c) { return [
            c[0] === -1 ? -1 : c[0] + num_colls,
            c[1].map(function (point) { return point + num_points; }),
            c[2].map(function (line) { return line + num_lines; }),
            c[3].map(function (pgon) { return pgon + num_pgons; })
        ]; });
        (_l = this.colls).push.apply(_l, new_colls);
        // Update the reverse arrays
        this._updateRevArrays();
        // update the positions array
        this.num_posis += geom_data.num_positions;
    };
    // ============================================================================
    // Private methods
    // ============================================================================
    /**
     * Updates the rev arrays the create the reveres links.
     */
    GIGeom.prototype._updateRevArrays = function () {
        var _this = this;
        // positions
        this.rev_posis_verts = [];
        this.verts.forEach(function (pos_i, vert_i) {
            if (_this.rev_posis_verts[pos_i] === undefined) {
                _this.rev_posis_verts[pos_i] = [];
            }
            _this.rev_posis_verts[pos_i].push(vert_i);
        });
        // tris, edges, wires, faces
        this.rev_verts_tris = [];
        this.tris.forEach(function (vert_i_arr, tri_i) {
            vert_i_arr.forEach(function (vert_i) {
                _this.rev_verts_tris[vert_i] = tri_i;
            });
        });
        this.rev_verts_edges = [];
        this.edges.forEach(function (vert_i_arr, edge_i) {
            vert_i_arr.forEach(function (vert_i) {
                _this.rev_verts_edges[vert_i] = edge_i;
            });
        });
        this.rev_edges_wires = [];
        this.wires.forEach(function (edge_i_arr, wire_i) {
            edge_i_arr.forEach(function (edge_i) {
                _this.rev_edges_wires[edge_i] = wire_i;
            });
        });
        this.rev_wires_faces = [];
        this.rev_tris_faces = [];
        this.faces.forEach(function (_a, face_i) {
            var wire_i_arr = _a[0], tri_i_arr = _a[1];
            wire_i_arr.forEach(function (wire_i) {
                _this.rev_wires_faces[wire_i] = face_i;
            });
            tri_i_arr.forEach(function (tri_i) {
                _this.rev_tris_faces[tri_i] = face_i;
            });
        });
        // points, lines, polygons
        this.rev_verts_points = [];
        this.points.forEach(function (vert_i, point_i) {
            _this.rev_verts_points[vert_i] = point_i;
        });
        this.rev_wires_lines = [];
        this.lines.forEach(function (wire_i, line_i) {
            _this.rev_wires_lines[wire_i] = line_i;
        });
        this.rev_faces_pgons = [];
        this.pgons.forEach(function (face_i, pgon_i) {
            _this.rev_faces_pgons[face_i] = pgon_i;
        });
        // collections of points, linestrings, polygons
        this.rev_points_colls = [];
        this.rev_lines_colls = [];
        this.rev_pgons_colls = [];
        this.colls.forEach(function (_a, coll_i) {
            var parent = _a[0], point_i_arr = _a[1], line_i_arr = _a[2], pgon_i_arr = _a[3];
            point_i_arr.forEach(function (point_i) {
                _this.rev_points_colls[point_i] = coll_i;
            });
            line_i_arr.forEach(function (line_i) {
                _this.rev_lines_colls[line_i] = coll_i;
            });
            pgon_i_arr.forEach(function (pgon_i) {
                _this.rev_pgons_colls[pgon_i] = coll_i;
            });
        });
    };
    // ============================================================================
    // Navigate down the hierarchy
    // ============================================================================
    GIGeom.prototype._navVertToPosi = function (vert) {
        return this.verts[vert];
    };
    GIGeom.prototype._navEdgeToVert = function (edge) {
        return this.edges[edge];
    };
    GIGeom.prototype._navWireToEdge = function (wire) {
        return this.wires[wire];
    };
    GIGeom.prototype._navFaceToWire = function (face) {
        return this.faces[face][0];
    };
    GIGeom.prototype._navFaceToTri = function (face) {
        return this.faces[face][1];
    };
    GIGeom.prototype._navPointToVert = function (point) {
        return this.points[point];
    };
    GIGeom.prototype._navLineToVert = function (line) {
        return this.lines[line];
    };
    GIGeom.prototype._navPgonToVert = function (pgon) {
        return this.pgons[pgon];
    };
    GIGeom.prototype._navCollToPoint = function (coll) {
        return this.colls[coll][1]; // coll points
    };
    GIGeom.prototype._navCollToLine = function (coll) {
        return this.colls[coll][2]; // coll lines
    };
    GIGeom.prototype._navCollToPgon = function (coll) {
        return this.colls[coll][3]; // coll pgons
    };
    GIGeom.prototype._navCollToColl = function (coll) {
        return coll[0]; // coll parent
    };
    // ============================================================================
    // Navigate up the hierarchy
    // ============================================================================
    GIGeom.prototype._navPosiToVert = function (posi) {
        return this.rev_posis_verts[posi];
    };
    GIGeom.prototype._navVertToTri = function (vert) {
        return this.rev_verts_tris[vert];
    };
    GIGeom.prototype._navVertToEdge = function (vert) {
        return this.rev_verts_edges[vert];
    };
    GIGeom.prototype._navTriToFace = function (tri) {
        return this.rev_tris_faces[tri];
    };
    GIGeom.prototype._navEdgeToWire = function (edge) {
        return this.rev_edges_wires[edge];
    };
    GIGeom.prototype._navWireToFace = function (wire) {
        return this.rev_wires_faces[wire];
    };
    GIGeom.prototype._navVertToPoint = function (vert) {
        return this.rev_verts_points[vert];
    };
    GIGeom.prototype._navWireToLine = function (wire) {
        return this.rev_wires_lines[wire];
    };
    GIGeom.prototype._navFaceToPgon = function (face) {
        return this.rev_faces_pgons[face];
    };
    GIGeom.prototype._navPointToColl = function (point) {
        return this.rev_points_colls[point];
    };
    GIGeom.prototype._navLineToColl = function (line) {
        return this.rev_lines_colls[line];
    };
    GIGeom.prototype._navPgonToColl = function (pgon) {
        return this.rev_pgons_colls[pgon];
    };
    // ============================================================================
    // Create the topological entities, these methods are never public
    // ============================================================================
    /**
     * Adds a vertex and updates the rev array.
     * @param posi_i
     */
    GIGeom.prototype._addVertex = function (posi_i) {
        var vert_i = this.verts.push(posi_i) - 1;
        if (this.rev_posis_verts[posi_i] === undefined) {
            this.rev_posis_verts[posi_i] = [];
        }
        this.rev_posis_verts[posi_i].push(vert_i);
        return vert_i;
    };
    /**
     * Adds an edge and updates the rev array.
     * @param vert_i1
     * @param vert_i2
     */
    GIGeom.prototype._addEdge = function (vert_i1, vert_i2) {
        var edge_i = this.edges.push([vert_i1, vert_i2]) - 1;
        this.rev_verts_edges[vert_i1] = edge_i;
        this.rev_verts_edges[vert_i2] = edge_i;
        return edge_i;
    };
    /**
     * Adds a wire and updates the rev array.
     * Edges are assumed to be sequential!
     * @param edges_i
     */
    GIGeom.prototype._addWire = function (edges_i, close) {
        var _this = this;
        if (close === void 0) { close = false; }
        var wire_i = this.wires.push(edges_i) - 1;
        edges_i.forEach(function (edge_i) { return _this.rev_edges_wires[edge_i] = wire_i; });
        return wire_i;
    };
    /**
     * Adds a face and updates the rev array.
     * Wires are assumed to be closed!
     * No holes yet... TODO
     * @param wire_i
     */
    GIGeom.prototype._addFace = function (wire_i) {
        var _this = this;
        // create the triangles
        var wire_verts_i = this._getWireVerts(wire_i);
        var wire_posis_i = wire_verts_i.map(function (vert_i) { return _this.verts[vert_i]; });
        var wire_coords = wire_posis_i.map(function (posi_i) { return _this.model.attribs().getPosiCoord(posi_i); });
        var tris_corners = Object(_triangulate_triangulate__WEBPACK_IMPORTED_MODULE_1__["triangulate"])(wire_coords);
        var tris_posis_i = tris_corners.map(function (tri_corners) { return tri_corners.map(function (corner) { return wire_verts_i[corner]; }); });
        var tris_i = tris_posis_i.map(function (tri_posis_i) { return _this.tris.push(tri_posis_i) - 1; });
        // create the face
        var face = [[wire_i], tris_i];
        var face_i = this.faces.push(face);
        return face_i;
    };
    /**
     * Helper function to get check if wire is closed
     */
    GIGeom.prototype._istWireClosed = function (wire_i) {
        var edges_i = this.wires[wire_i];
        return this.edges[edges_i[0]][0] === this.edges[edges_i[edges_i.length - 1]][1];
    };
    /**
     * Helper function to get the vertices of a wire
     * The function check is the wire is closed and returns correct number of vertices.
     * For a cloased wire, #vertices = #edges
     * For an open wire, #vertices = #edges + 1
     */
    GIGeom.prototype._getWireVerts = function (wire_i) {
        var _this = this;
        var edges_i = this.wires[wire_i];
        var verts_i = edges_i.map(function (edge_i) { return _this.edges[edge_i][0]; });
        if (this.edges[edges_i[0]][0] !== this.edges[edges_i[edges_i.length - 1]][1]) {
            verts_i.push(this.edges[edges_i[edges_i.length - 1]][1]);
        }
        return verts_i;
    };
    // ============================================================================
    // Create geometry, all these public methods return an string ID
    // ============================================================================
    /**
     * Adds a new position to the model and returns the index to that position.
     */
    GIGeom.prototype.addPosition = function () {
        this.num_posis += 1;
        var i = this.num_posis - 1;
        return _GICommon__WEBPACK_IMPORTED_MODULE_0__["EEntityTypeStr"].POSI + i;
    };
    /**
     * Adds a new point entity to the model.
     * @param posi_id The position for the point.
     */
    GIGeom.prototype.addPoint = function (posi_id) {
        var posi_i = Object(_GICommon__WEBPACK_IMPORTED_MODULE_0__["idIndex"])(posi_id);
        // create verts
        var vert_i = this._addVertex(posi_i);
        // create point
        var point_i = this.points.push(vert_i) - 1;
        this.rev_verts_points[vert_i] = point_i;
        return _GICommon__WEBPACK_IMPORTED_MODULE_0__["EEntityTypeStr"].POINT + point_i;
    };
    /**
     * Adds a new linestring entity to the model.
     * @param posis_id
     */
    GIGeom.prototype.addLine = function (posis_id, close) {
        var _this = this;
        if (close === void 0) { close = false; }
        var posis_i = Object(_GICommon__WEBPACK_IMPORTED_MODULE_0__["idIndicies"])(posis_id);
        // create verts, edges, wires
        var vert_i_arr = posis_i.map(function (posi_i) { return _this._addVertex(posi_i); });
        var edges_i_arr = [];
        for (var i = 0; i < vert_i_arr.length - 1; i++) {
            edges_i_arr.push(this._addEdge(vert_i_arr[i], vert_i_arr[i + 1]));
        }
        if (close) {
            edges_i_arr.push(this._addEdge(vert_i_arr[vert_i_arr.length - 1], vert_i_arr[0]));
        }
        var wire_i = this._addWire(edges_i_arr, close);
        // create line
        var line_i = this.lines.push(wire_i) - 1;
        this.rev_wires_lines[wire_i] = line_i;
        return _GICommon__WEBPACK_IMPORTED_MODULE_0__["EEntityTypeStr"].LINE + line_i;
    };
    /**
     * Adds a new polygon entity to the model.
     * @param posis_id
     */
    GIGeom.prototype.addPgon = function (posis_id) {
        var _this = this;
        var posis_i = Object(_GICommon__WEBPACK_IMPORTED_MODULE_0__["idIndicies"])(posis_id);
        // create verts, edges, wires, faces
        var vert_i_arr = posis_i.map(function (posi_i) { return _this._addVertex(posi_i); });
        var edges_i_arr = [];
        for (var i = 0; i < vert_i_arr.length - 1; i++) {
            edges_i_arr.push(this._addEdge(vert_i_arr[i], vert_i_arr[i + 1]));
        }
        edges_i_arr.push(this._addEdge(vert_i_arr[vert_i_arr.length - 1], vert_i_arr[0]));
        var wire_i = this._addWire(edges_i_arr, true);
        var face_i = this._addFace(wire_i);
        // create polygon
        var pgon_i = this.pgons.push(face_i) - 1;
        this.rev_faces_pgons[face_i] = pgon_i;
        return _GICommon__WEBPACK_IMPORTED_MODULE_0__["EEntityTypeStr"].PGON + pgon_i;
    };
    /**
     * Adds a collection and updates the rev array.
     * @param parent_id
     * @param points_id
     * @param lines_id
     * @param pgons_id
     */
    GIGeom.prototype.addColl = function (parent_id, points_id, lines_id, pgons_id) {
        var _this = this;
        var parent_i = Object(_GICommon__WEBPACK_IMPORTED_MODULE_0__["idIndex"])(parent_id);
        var points_i = Object(_GICommon__WEBPACK_IMPORTED_MODULE_0__["idIndicies"])(points_id);
        var lines_i = Object(_GICommon__WEBPACK_IMPORTED_MODULE_0__["idIndicies"])(lines_id);
        var pgons_i = Object(_GICommon__WEBPACK_IMPORTED_MODULE_0__["idIndicies"])(pgons_id);
        // create collection
        var coll_i = this.colls.push([parent_i, points_i, lines_i, pgons_i]) - 1;
        points_i.forEach(function (point_i) { return _this.rev_points_colls[point_i] = coll_i; });
        lines_i.forEach(function (line_i) { return _this.rev_points_colls[line_i] = coll_i; });
        pgons_i.forEach(function (pgon_i) { return _this.rev_points_colls[pgon_i] = coll_i; });
        return _GICommon__WEBPACK_IMPORTED_MODULE_0__["EEntityTypeStr"].COLL + coll_i;
    };
    // ============================================================================
    // Check if entity exists
    // ============================================================================
    GIGeom.prototype.has = function (id) {
        var _a = Object(_GICommon__WEBPACK_IMPORTED_MODULE_0__["idBreak"])(id), type_str = _a[0], index = _a[1];
        return (this.geom_arrs[type_str][index] !== undefined);
    };
    // ============================================================================
    // Get arrays of entities, these retrun arrays of string IDs
    // ============================================================================
    GIGeom.prototype.getPosis = function () {
        return Array(this.num_posis).map(function (_, index) { return _GICommon__WEBPACK_IMPORTED_MODULE_0__["EEntityTypeStr"].POSI + index; });
    };
    GIGeom.prototype.getVerts = function () {
        return this.verts.map(function (_, index) { return _GICommon__WEBPACK_IMPORTED_MODULE_0__["EEntityTypeStr"].VERT + index; });
    };
    GIGeom.prototype.getTris = function () {
        return this.tris.map(function (_, index) { return _GICommon__WEBPACK_IMPORTED_MODULE_0__["EEntityTypeStr"].TRI + index; });
    };
    GIGeom.prototype.getEdges = function () {
        return this.edges.map(function (_, index) { return _GICommon__WEBPACK_IMPORTED_MODULE_0__["EEntityTypeStr"].EDGE + index; });
    };
    GIGeom.prototype.getWires = function () {
        return this.wires.map(function (_, index) { return _GICommon__WEBPACK_IMPORTED_MODULE_0__["EEntityTypeStr"].WIRE + index; });
    };
    GIGeom.prototype.getFaces = function () {
        return this.faces.map(function (_, index) { return _GICommon__WEBPACK_IMPORTED_MODULE_0__["EEntityTypeStr"].FACE + index; });
    };
    GIGeom.prototype.getPoints = function () {
        return this.points.map(function (_, index) { return _GICommon__WEBPACK_IMPORTED_MODULE_0__["EEntityTypeStr"].POINT + index; });
    };
    GIGeom.prototype.getLines = function () {
        return this.lines.map(function (_, index) { return _GICommon__WEBPACK_IMPORTED_MODULE_0__["EEntityTypeStr"].LINE + index; });
    };
    GIGeom.prototype.getPgons = function () {
        return this.pgons.map(function (_, index) { return _GICommon__WEBPACK_IMPORTED_MODULE_0__["EEntityTypeStr"].PGON + index; });
    };
    GIGeom.prototype.getColls = function () {
        return this.colls.map(function (_, index) { return _GICommon__WEBPACK_IMPORTED_MODULE_0__["EEntityTypeStr"].COLL + index; });
    };
    // ============================================================================
    // Get array lengths
    // ============================================================================
    GIGeom.prototype.numPosis = function () {
        return this.num_posis;
    };
    GIGeom.prototype.numVerts = function () {
        return this.verts.length;
    };
    GIGeom.prototype.numEdges = function () {
        return this.edges.length;
    };
    GIGeom.prototype.numWires = function () {
        return this.wires.length;
    };
    GIGeom.prototype.numFaces = function () {
        return this.faces.length;
    };
    GIGeom.prototype.numCollections = function () {
        return this.colls.length;
    };
    GIGeom.prototype.numPoints = function () {
        return this.points.length;
    };
    GIGeom.prototype.numLines = function () {
        return this.lines.length;
    };
    GIGeom.prototype.numPgons = function () {
        return this.pgons.length;
    };
    GIGeom.prototype.numColls = function () {
        return this.colls.length;
    };
    // ============================================================================
    // ThreeJS
    // Get arrays for threejs, these retrun arrays of indexes to positions
    // For a method to get the array of positions, see the attrib class
    // getSeqCoords()
    // ============================================================================
    /**
     * Returns a flat list of all vertices.
     * The indices in the list point to the sequential coordinates.
     */
    GIGeom.prototype.get3jsVerts = function () {
        return this.verts;
    };
    /**
     * Returns a flat list of the sequence of verices for all the triangles.
     * This list will be assumed to be in pairs.
     * The indices in the list point to the vertices.
     */
    GIGeom.prototype.get3jsTris = function () {
        return [].concat.apply([], this.tris);
    };
    /**
     * Returns a flat list of the sequence of verices for all the edges.
     * This list will be assumed to be in pairs.
     * The indices in the list point to the vertices.
     */
    GIGeom.prototype.get3jsEdges = function () {
        return [].concat.apply([], this.edges);
    };
    /**
     * Returns a flat list of the sequence of verices for all the points.
     * The indices in the list point to the vertices.
     */
    GIGeom.prototype.get3jsPoints = function () {
        return this.points;
    };
    return GIGeom;
}());



/***/ }),

/***/ "./src/libs/geo-info/GIJson.ts":
/*!*************************************!*\
  !*** ./src/libs/geo-info/GIJson.ts ***!
  \*************************************/
/*! exports provided: EAttribDataTypeStrs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EAttribDataTypeStrs", function() { return EAttribDataTypeStrs; });
// enums
var EAttribDataTypeStrs;
(function (EAttribDataTypeStrs) {
    EAttribDataTypeStrs["INT"] = "Int";
    EAttribDataTypeStrs["FLOAT"] = "Float";
    EAttribDataTypeStrs["STRING"] = "String";
})(EAttribDataTypeStrs || (EAttribDataTypeStrs = {}));


/***/ }),

/***/ "./src/libs/geo-info/GIModel.ts":
/*!**************************************!*\
  !*** ./src/libs/geo-info/GIModel.ts ***!
  \**************************************/
/*! exports provided: GIModel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GIModel", function() { return GIModel; });
/* harmony import */ var _GIGeom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GIGeom */ "./src/libs/geo-info/GIGeom.ts");
/* harmony import */ var _GIAttribs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./GIAttribs */ "./src/libs/geo-info/GIAttribs.ts");
/* harmony import */ var _GICommon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./GICommon */ "./src/libs/geo-info/GICommon.ts");



/**
 * Geo-info model class.
 */
var GIModel = /** @class */ (function () {
    /**
     * Creates a model.
     * @param model_data The JSON data
     */
    function GIModel(model_data) {
        this._geom = new _GIGeom__WEBPACK_IMPORTED_MODULE_0__["GIGeom"](this);
        this._attribs = new _GIAttribs__WEBPACK_IMPORTED_MODULE_1__["GIAttribs"](this);
        if (model_data) {
            this.addData(model_data);
        }
    }
    // Getters and setters
    GIModel.prototype.geom = function () { return this._geom; };
    GIModel.prototype.attribs = function () { return this._attribs; };
    /**
     * Sets the data in this model from JSON data.
     * The existing data in the model is deleted.
     * @param model_data The JSON data
     */
    GIModel.prototype.addData = function (model_data) {
        this._geom.addData(model_data.geometry);
        this._attribs.addData(model_data.attributes);
    };
    /**
     * Adds data to this model from JSON data.
     * The existing data in the model is not deleted.
     * @param model_data The JSON data
     */
    GIModel.prototype.merge = function (model) {
        this._attribs.addData(model.getAttribsData()); // must be before addGeomData()
        this._geom.addData(model.getGeomData());
    };
    /**
     * Returns the JSON data for this model.
     */
    GIModel.prototype.getData = function () {
        return {
            geometry: this._geom.getData(),
            attributes: this._attribs.getData()
        };
    };
    /**
     * Returns the JSON data for the geometry in this model.
     */
    GIModel.prototype.getGeomData = function () {
        return this._geom.getData();
    };
    /**
     * Returns the JSON data for the attributes in this model.
     */
    GIModel.prototype.getAttribsData = function () {
        return this._attribs.getData();
    };
    /**
     * Generate a default color if none exists.
     */
    GIModel.prototype._generateColors = function () {
        var colors = [];
        for (var index = 0; index < this._geom.numVerts(); index++) {
            colors.push(1, 1, 1);
        }
        return colors;
    };
    /**
     * Generate default normals if non exist.
     */
    GIModel.prototype._generateNormals = function () {
        var normals = [];
        for (var index = 0; index < this._geom.numVerts(); index++) {
            normals.push(0, 0, 0);
        }
        return normals;
    };
    /**
     * Returns arrays for visualization in Threejs.
     */
    GIModel.prototype.get3jsData = function () {
        // get the attrbs at the vertex level
        var coords_values = this._attribs.get3jsSeqVertsCoords(this._geom.get3jsVerts());
        var normals_values = this._attribs.get3jsSeqVertsAttrib(_GICommon__WEBPACK_IMPORTED_MODULE_2__["EAttribNames"].NORMAL);
        var colors_values = this._attribs.get3jsSeqVertsAttrib(_GICommon__WEBPACK_IMPORTED_MODULE_2__["EAttribNames"].COLOR);
        // add normals and colours
        if (!normals_values) {
            normals_values = this._generateNormals();
        }
        if (!colors_values) {
            colors_values = this._generateColors();
        }
        // get the indices of the vertices for edges, points and triangles
        var tris_verts_i = this._geom.get3jsTris();
        var edges_verts_i = this._geom.get3jsEdges();
        var points_verts_i = this._geom.get3jsPoints();
        // return an object containing all the data
        return {
            positions: coords_values,
            normals: normals_values,
            colors: colors_values,
            point_indices: points_verts_i,
            edge_indices: edges_verts_i,
            triangle_indices: tris_verts_i
        };
    };
    return GIModel;
}());



/***/ }),

/***/ "./src/libs/threex/threex.ts":
/*!***********************************!*\
  !*** ./src/libs/threex/threex.ts ***!
  \***********************************/
/*! exports provided: multVectorMatrix, xformMatrix, matrixInv, subVectors, addVectors, crossVectors */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "multVectorMatrix", function() { return multVectorMatrix; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xformMatrix", function() { return xformMatrix; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "matrixInv", function() { return matrixInv; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "subVectors", function() { return subVectors; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addVectors", function() { return addVectors; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "crossVectors", function() { return crossVectors; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");

var EPS = 1e-6;
/**
 * Utility functions for threejs.
 */
// Matrices ======================================================================================================
function multVectorMatrix(v, m) {
    var v2 = v.clone();
    v2.applyMatrix4(m);
    return v2;
}
function xformMatrix(o, x, y, z) {
    x.normalize();
    y.normalize();
    z.normalize();
    var m1 = new three__WEBPACK_IMPORTED_MODULE_0__["Matrix4"]();
    var o_neg = o.clone().negate();
    m1.setPosition(o_neg);
    var m2 = new three__WEBPACK_IMPORTED_MODULE_0__["Matrix4"]();
    m2.makeBasis(x, y, z);
    m2.getInverse(m2);
    var m3 = new three__WEBPACK_IMPORTED_MODULE_0__["Matrix4"]();
    m3.multiplyMatrices(m2, m1);
    return m3;
}
function matrixInv(m) {
    var m2 = new three__WEBPACK_IMPORTED_MODULE_0__["Matrix4"]();
    return m2.getInverse(m);
}
//  Vectors =======================================================================================================
function subVectors(v1, v2, norm) {
    if (norm === void 0) { norm = false; }
    var v3 = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]();
    v3.subVectors(v1, v2);
    if (norm) {
        v3.normalize();
    }
    return v3;
}
function addVectors(v1, v2, norm) {
    if (norm === void 0) { norm = false; }
    var v3 = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]();
    v3.addVectors(v1, v2);
    if (norm) {
        v3.normalize();
    }
    return v3;
}
function crossVectors(v1, v2, norm) {
    if (norm === void 0) { norm = false; }
    var v3 = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]();
    v3.crossVectors(v1, v2);
    if (norm) {
        v3.normalize();
    }
    return v3;
}


/***/ }),

/***/ "./src/libs/triangulate/earcut.ts":
/*!****************************************!*\
  !*** ./src/libs/triangulate/earcut.ts ***!
  \****************************************/
/*! exports provided: Earcut */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Earcut", function() { return Earcut; });
/**
 * @author Mugen87 / https://github.com/Mugen87
 * Port from https://github.com/mapbox/earcut (v2.1.2)
 */
var Earcut = {
    triangulate: function (data, holeIndices, dim) {
        dim = dim || 2;
        var hasHoles = holeIndices && holeIndices.length;
        var outerLen = hasHoles ? holeIndices[0] * dim : data.length;
        var outerNode = linkedList(data, 0, outerLen, dim, true);
        var triangles = [];
        if (!outerNode) {
            return triangles;
        }
        var minX, minY, maxX, maxY, x, y, invSize;
        if (hasHoles) {
            outerNode = eliminateHoles(data, holeIndices, outerNode, dim);
        }
        // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
        if (data.length > 80 * dim) {
            minX = maxX = data[0];
            minY = maxY = data[1];
            for (var i = dim; i < outerLen; i += dim) {
                x = data[i];
                y = data[i + 1];
                if (x < minX) {
                    minX = x;
                }
                if (y < minY) {
                    minY = y;
                }
                if (x > maxX) {
                    maxX = x;
                }
                if (y > maxY) {
                    maxY = y;
                }
            }
            // minX, minY and invSize are later used to transform coords into integers for z-order calculation
            invSize = Math.max(maxX - minX, maxY - minY);
            invSize = invSize !== 0 ? 1 / invSize : 0;
        }
        earcutLinked(outerNode, triangles, dim, minX, minY, invSize);
        return triangles;
    }
};
// create a circular doubly linked list from polygon points in the specified winding order
function linkedList(data, start, end, dim, clockwise) {
    var i, last;
    if (clockwise === (signedArea(data, start, end, dim) > 0)) {
        for (i = start; i < end; i += dim) {
            last = insertNode(i, data[i], data[i + 1], last);
        }
    }
    else {
        for (i = end - dim; i >= start; i -= dim) {
            last = insertNode(i, data[i], data[i + 1], last);
        }
    }
    if (last && equals(last, last.next)) {
        removeNode(last);
        last = last.next;
    }
    return last;
}
// eliminate colinear or duplicate points
function filterPoints(start, end) {
    if (!start) {
        return start;
    }
    if (!end) {
        end = start;
    }
    var p = start, again;
    do {
        again = false;
        if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
            removeNode(p);
            p = end = p.prev;
            if (p === p.next) {
                break;
            }
            again = true;
        }
        else {
            p = p.next;
        }
    } while (again || p !== end);
    return end;
}
// main ear slicing loop which triangulates a polygon (given as a linked list)
function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
    if (!ear) {
        return;
    }
    // interlink polygon nodes in z-order
    if (!pass && invSize) {
        indexCurve(ear, minX, minY, invSize);
    }
    var stop = ear, prev, next;
    // iterate through ears, slicing them one by one
    while (ear.prev !== ear.next) {
        prev = ear.prev;
        next = ear.next;
        if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
            // cut off the triangle
            triangles.push(prev.i / dim);
            triangles.push(ear.i / dim);
            triangles.push(next.i / dim);
            removeNode(ear);
            // skipping the next vertice leads to less sliver triangles
            ear = next.next;
            stop = next.next;
            continue;
        }
        ear = next;
        // if we looped through the whole remaining polygon and can't find any more ears
        if (ear === stop) {
            // try filtering points and slicing again
            if (!pass) {
                earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);
                // if this didn't work, try curing all small self-intersections locally
            }
            else if (pass === 1) {
                ear = cureLocalIntersections(ear, triangles, dim);
                earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);
                // as a last resort, try splitting the remaining polygon into two
            }
            else if (pass === 2) {
                splitEarcut(ear, triangles, dim, minX, minY, invSize);
            }
            break;
        }
    }
}
// check whether a polygon node forms a valid ear with adjacent nodes
function isEar(ear) {
    var a = ear.prev, b = ear, c = ear.next;
    if (area(a, b, c) >= 0) {
        return false;
    } // reflex, can't be an ear
    // now make sure we don't have other points inside the potential ear
    var p = ear.next.next;
    while (p !== ear.prev) {
        if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0) {
            return false;
        }
        p = p.next;
    }
    return true;
}
function isEarHashed(ear, minX, minY, invSize) {
    var a = ear.prev, b = ear, c = ear.next;
    if (area(a, b, c) >= 0) {
        return false;
    } // reflex, can't be an ear
    // triangle bbox; min & max are calculated like this for speed
    var minTX = a.x < b.x ? (a.x < c.x ? a.x : c.x) : (b.x < c.x ? b.x : c.x), minTY = a.y < b.y ? (a.y < c.y ? a.y : c.y) : (b.y < c.y ? b.y : c.y), maxTX = a.x > b.x ? (a.x > c.x ? a.x : c.x) : (b.x > c.x ? b.x : c.x), maxTY = a.y > b.y ? (a.y > c.y ? a.y : c.y) : (b.y > c.y ? b.y : c.y);
    // z-order range for the current triangle bbox;
    var minZ = zOrder(minTX, minTY, minX, minY, invSize), maxZ = zOrder(maxTX, maxTY, minX, minY, invSize);
    // first look for points inside the triangle in increasing z-order
    var p = ear.nextZ;
    while (p && p.z <= maxZ) {
        if (p !== ear.prev && p !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) {
            return false;
        }
        p = p.nextZ;
    }
    // then look for points in decreasing z-order
    p = ear.prevZ;
    while (p && p.z >= minZ) {
        if (p !== ear.prev && p !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) {
            return false;
        }
        p = p.prevZ;
    }
    return true;
}
// go through all polygon nodes and cure small local self-intersections
function cureLocalIntersections(start, triangles, dim) {
    var p = start;
    do {
        var a = p.prev, b = p.next.next;
        if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {
            triangles.push(a.i / dim);
            triangles.push(p.i / dim);
            triangles.push(b.i / dim);
            // remove two nodes involved
            removeNode(p);
            removeNode(p.next);
            p = start = b;
        }
        p = p.next;
    } while (p !== start);
    return p;
}
// try splitting polygon into two and triangulate them independently
function splitEarcut(start, triangles, dim, minX, minY, invSize) {
    // look for a valid diagonal that divides the polygon into two
    var a = start;
    do {
        var b = a.next.next;
        while (b !== a.prev) {
            if (a.i !== b.i && isValidDiagonal(a, b)) {
                // split the polygon in two by the diagonal
                var c = splitPolygon(a, b);
                // filter colinear points around the cuts
                a = filterPoints(a, a.next);
                c = filterPoints(c, c.next);
                // run earcut on each half
                earcutLinked(a, triangles, dim, minX, minY, invSize);
                earcutLinked(c, triangles, dim, minX, minY, invSize);
                return;
            }
            b = b.next;
        }
        a = a.next;
    } while (a !== start);
}
// link every hole into the outer loop, producing a single-ring polygon without holes
function eliminateHoles(data, holeIndices, outerNode, dim) {
    var queue = [], i, len, start, end, list;
    for (i = 0, len = holeIndices.length; i < len; i++) {
        start = holeIndices[i] * dim;
        end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
        list = linkedList(data, start, end, dim, false);
        if (list === list.next) {
            list.steiner = true;
        }
        queue.push(getLeftmost(list));
    }
    queue.sort(compareX);
    // process holes from left to right
    for (i = 0; i < queue.length; i++) {
        eliminateHole(queue[i], outerNode);
        outerNode = filterPoints(outerNode, outerNode.next);
    }
    return outerNode;
}
function compareX(a, b) {
    return a.x - b.x;
}
// find a bridge between vertices that connects hole with an outer ring and and link it
function eliminateHole(hole, outerNode) {
    outerNode = findHoleBridge(hole, outerNode);
    if (outerNode) {
        var b = splitPolygon(outerNode, hole);
        filterPoints(b, b.next);
    }
}
// David Eberly's algorithm for finding a bridge between hole and outer polygon
function findHoleBridge(hole, outerNode) {
    var p = outerNode;
    var hx = hole.x;
    var hy = hole.y;
    var qx = -Infinity;
    var m;
    // find a segment intersected by a ray from the hole's leftmost point to the left;
    // segment's endpoint with lesser x will be potential connection point
    do {
        if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
            var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
            if (x <= hx && x > qx) {
                qx = x;
                if (x === hx) {
                    if (hy === p.y) {
                        return p;
                    }
                    if (hy === p.next.y) {
                        return p.next;
                    }
                }
                m = p.x < p.next.x ? p : p.next;
            }
        }
        p = p.next;
    } while (p !== outerNode);
    if (!m) {
        return null;
    }
    if (hx === qx) {
        return m.prev;
    } // hole touches outer segment; pick lower endpoint
    // look for points inside the triangle of hole point, segment intersection and endpoint;
    // if there are no points found, we have a valid connection;
    // otherwise choose the point of the minimum angle with the ray as connection point
    var stop = m;
    var mx = m.x;
    var my = m.y;
    var tanMin = Infinity;
    var tan;
    p = m.next;
    while (p !== stop) {
        if (hx >= p.x && p.x >= mx && hx !== p.x &&
            pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {
            tan = Math.abs(hy - p.y) / (hx - p.x); // tangential
            if ((tan < tanMin || (tan === tanMin && p.x > m.x)) && locallyInside(p, hole)) {
                m = p;
                tanMin = tan;
            }
        }
        p = p.next;
    }
    return m;
}
// interlink polygon nodes in z-order
function indexCurve(start, minX, minY, invSize) {
    var p = start;
    do {
        if (p.z === null) {
            p.z = zOrder(p.x, p.y, minX, minY, invSize);
        }
        p.prevZ = p.prev;
        p.nextZ = p.next;
        p = p.next;
    } while (p !== start);
    p.prevZ.nextZ = null;
    p.prevZ = null;
    sortLinked(p);
}
// Simon Tatham's linked list merge sort algorithm
// http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
function sortLinked(list) {
    var i, p, q, e, tail, numMerges, pSize, qSize, inSize = 1;
    do {
        p = list;
        list = null;
        tail = null;
        numMerges = 0;
        while (p) {
            numMerges++;
            q = p;
            pSize = 0;
            for (i = 0; i < inSize; i++) {
                pSize++;
                q = q.nextZ;
                if (!q) {
                    break;
                }
            }
            qSize = inSize;
            while (pSize > 0 || (qSize > 0 && q)) {
                if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
                    e = p;
                    p = p.nextZ;
                    pSize--;
                }
                else {
                    e = q;
                    q = q.nextZ;
                    qSize--;
                }
                if (tail) {
                    tail.nextZ = e;
                }
                else {
                    list = e;
                }
                e.prevZ = tail;
                tail = e;
            }
            p = q;
        }
        tail.nextZ = null;
        inSize *= 2;
    } while (numMerges > 1);
    return list;
}
// z-order of a point given coords and inverse of the longer side of data bbox
function zOrder(x, y, minX, minY, invSize) {
    // coords are transformed into non-negative 15-bit integer range
    x = 32767 * (x - minX) * invSize;
    y = 32767 * (y - minY) * invSize;
    x = (x | (x << 8)) & 0x00FF00FF;
    x = (x | (x << 4)) & 0x0F0F0F0F;
    x = (x | (x << 2)) & 0x33333333;
    x = (x | (x << 1)) & 0x55555555;
    y = (y | (y << 8)) & 0x00FF00FF;
    y = (y | (y << 4)) & 0x0F0F0F0F;
    y = (y | (y << 2)) & 0x33333333;
    y = (y | (y << 1)) & 0x55555555;
    return x | (y << 1);
}
// find the leftmost node of a polygon ring
function getLeftmost(start) {
    var p = start, leftmost = start;
    do {
        if (p.x < leftmost.x) {
            leftmost = p;
        }
        p = p.next;
    } while (p !== start);
    return leftmost;
}
// check if a point lies within a convex triangle
function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
    return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 &&
        (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 &&
        (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
}
// check if a diagonal between two polygon nodes is valid (lies in polygon interior)
function isValidDiagonal(a, b) {
    return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) &&
        locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b);
}
// signed area of a triangle
function area(p, q, r) {
    return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
}
// check if two points are equal
function equals(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
}
// check if two segments intersect
function intersects(p1, q1, p2, q2) {
    if ((equals(p1, q1) && equals(p2, q2)) ||
        (equals(p1, q2) && equals(p2, q1))) {
        return true;
    }
    return area(p1, q1, p2) > 0 !== area(p1, q1, q2) > 0 &&
        area(p2, q2, p1) > 0 !== area(p2, q2, q1) > 0;
}
// check if a polygon diagonal intersects any polygon segments
function intersectsPolygon(a, b) {
    var p = a;
    do {
        if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
            intersects(p, p.next, a, b)) {
            return true;
        }
        p = p.next;
    } while (p !== a);
    return false;
}
// check if a polygon diagonal is locally inside the polygon
function locallyInside(a, b) {
    return area(a.prev, a, a.next) < 0 ?
        area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 :
        area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
}
// check if the middle point of a polygon diagonal is inside the polygon
function middleInside(a, b) {
    var p = a;
    var inside = false;
    var px = (a.x + b.x) / 2;
    var py = (a.y + b.y) / 2;
    do {
        if (((p.y > py) !== (p.next.y > py)) && p.next.y !== p.y &&
            (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x)) {
            inside = !inside;
        }
        p = p.next;
    } while (p !== a);
    return inside;
}
// link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
// if one belongs to the outer ring and another to a hole, it merges it into a single ring
function splitPolygon(a, b) {
    var a2 = new Node(a.i, a.x, a.y), b2 = new Node(b.i, b.x, b.y), an = a.next, bp = b.prev;
    a.next = b;
    b.prev = a;
    a2.next = an;
    an.prev = a2;
    b2.next = a2;
    a2.prev = b2;
    bp.next = b2;
    b2.prev = bp;
    return b2;
}
// create a node and optionally link it with previous one (in a circular doubly linked list)
function insertNode(i, x, y, last) {
    var p = new Node(i, x, y);
    if (!last) {
        p.prev = p;
        p.next = p;
    }
    else {
        p.next = last.next;
        p.prev = last;
        last.next.prev = p;
        last.next = p;
    }
    return p;
}
function removeNode(p) {
    p.next.prev = p.prev;
    p.prev.next = p.next;
    if (p.prevZ) {
        p.prevZ.nextZ = p.nextZ;
    }
    if (p.nextZ) {
        p.nextZ.prevZ = p.prevZ;
    }
}
function Node(i, x, y) {
    // vertice index in coordinates array
    this.i = i;
    // vertex coordinates
    this.x = x;
    this.y = y;
    // previous and next vertice nodes in a polygon ring
    this.prev = null;
    this.next = null;
    // z-order curve value
    this.z = null;
    // previous and next nodes in z-order
    this.prevZ = null;
    this.nextZ = null;
    // indicates whether this is a steiner point
    this.steiner = false;
}
function signedArea(data, start, end, dim) {
    var sum = 0;
    for (var i = start, j = end - dim; i < end; i += dim) {
        sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
        j = i;
    }
    return sum;
}



/***/ }),

/***/ "./src/libs/triangulate/triangulate.ts":
/*!*********************************************!*\
  !*** ./src/libs/triangulate/triangulate.ts ***!
  \*********************************************/
/*! exports provided: triangulate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "triangulate", function() { return triangulate; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _threex_threex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../threex/threex */ "./src/libs/threex/threex.ts");
/* harmony import */ var _earcut__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./earcut */ "./src/libs/triangulate/earcut.ts");
/* harmony import */ var _arr_arr__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../arr/arr */ "./src/libs/arr/arr.ts");



 // TODO remove dependence on this
//  3D to 2D ======================================================================================================
/**
 * Function to transform a set of vertices in 3d space onto the xy plane.
 * This function assumes that the vertices are co-planar.
 * Returns a set of three Vectors that represent points on the xy plane.
 */
function _makeVertices2D(points) {
    var o = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]();
    for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
        var v = points_1[_i];
        o.add(v);
    }
    o.divideScalar(points.length);
    var vx;
    var vz;
    var got_vx = false;
    for (var i = 0; i < points.length; i++) {
        if (!got_vx) {
            vx = _threex_threex__WEBPACK_IMPORTED_MODULE_1__["subVectors"](points[i], o).normalize();
            if (vx.lengthSq() !== 0) {
                got_vx = true;
            }
        }
        else {
            vz = _threex_threex__WEBPACK_IMPORTED_MODULE_1__["crossVectors"](vx, _threex_threex__WEBPACK_IMPORTED_MODULE_1__["subVectors"](points[i], o).normalize()).normalize();
            if (vz.lengthSq() !== 0) {
                break;
            }
        }
        if (i === points.length - 1) {
            return null;
        }
    }
    var vy = _threex_threex__WEBPACK_IMPORTED_MODULE_1__["crossVectors"](vz, vx);
    var m = _threex_threex__WEBPACK_IMPORTED_MODULE_1__["xformMatrix"](o, vx, vy, vz);
    var points_2d = points.map(function (v) { return _threex_threex__WEBPACK_IMPORTED_MODULE_1__["multVectorMatrix"](v, m); });
    return points_2d;
}
/**
 * Triangulates a polygon
 * @param coords
 */
function triangulate(coords) {
    var vects = _makeVertices2D(coords.map(function (coord) {
        var _a;
        return new ((_a = three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]).bind.apply(_a, [void 0].concat(coord)))();
    }));
    var flat_vert_xys = _arr_arr__WEBPACK_IMPORTED_MODULE_3__["Arr"].flatten(vects.map(function (v) { return [v.x, v.y]; })); // TODO remove dependency
    var flat_tris_i = _earcut__WEBPACK_IMPORTED_MODULE_2__["Earcut"].triangulate(flat_vert_xys);
    var tris_i = [];
    for (var i = 0; i < flat_tris_i.length; i += 3) {
        tris_i.push([flat_tris_i[i], flat_tris_i[i + 1], flat_tris_i[i + 2]]);
    }
    return tris_i;
}


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

module.exports = __webpack_require__(/*! F:\Dev\mobius-parametric-modeller\src\main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map