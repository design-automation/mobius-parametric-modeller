"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var THREE = require("three");
var Subject_1 = require("rxjs/Subject");
var DataService = /** @class */ (function () {
    function DataService() {
        this.selecting = [];
        // ---- 
        // Subscription Handling
        // 
        this.subject = new Subject_1.Subject();
        this._alight = [];
        this.scenechange = this._data;
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
    //  Normal functions
    //
    DataService.prototype.getGsModel = function () {
        return this._gsModel;
    };
    DataService.prototype.setGsModel = function (model) {
        this._gsModel = model;
        this.sendMessage();
    };
    DataService.prototype.addScene = function (scene) {
        this._data = scene;
    };
    DataService.prototype.getScene = function () {
        return this._data;
    };
    DataService.prototype.addRender = function (renderer) {
        this._renderer = renderer;
    };
    DataService.prototype.getRender = function () {
        return this._renderer;
    };
    DataService.prototype.addAmbientLight = function () {
        this._hueValue = 160;
        this._saturationValue = 0;
        this._lightnessValue = 0.47;
        var light = new THREE.HemisphereLight(0xffffff, 0.5);
        this._data.add(light);
        this._alight.push(light);
        var alight = this._alight;
        for (var i = 0; i < alight.length; i++) {
            var ambientLight = alight[i];
            ambientLight.color.setHSL(this._hueValue, this._saturationValue, this._lightnessValue);
        }
    };
    DataService.prototype.getalight = function () {
        return this._alight;
    };
    DataService.prototype.addlightvalue = function (hue, saturation, lightness) {
        this._hueValue = hue;
        this._saturationValue = saturation;
        this._lightnessValue = lightness;
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
    DataService.prototype.getselecting = function () {
        return this.selecting;
    };
    DataService = __decorate([
        core_1.Injectable()
    ], DataService);
    return DataService;
}());
exports.DataService = DataService;
