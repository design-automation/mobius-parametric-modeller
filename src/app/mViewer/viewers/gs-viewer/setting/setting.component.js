"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = require("three");
var core_1 = require("@angular/core");
var SettingComponent = /** @class */ (function () {
    function SettingComponent(dataService) {
        this.dataService = dataService;
        this.scene = this.dataService.getScene();
        this.alight = [];
        this.alight = this.dataService.getalight();
        this.hue = this.dataService.hue;
        this.saturation = this.dataService.saturation;
        this.lightness = this.dataService.lightness;
    }
    SettingComponent.prototype.ngOnInit = function () {
        if (this.hue == undefined) {
            this.hue = 160;
        }
        else {
            this.hue = this.dataService.hue;
        }
        if (this.saturation == undefined) {
            this.saturation = 0;
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
    };
    SettingComponent.prototype.changegrid = function () {
        this.gridVisible = !this.gridVisible;
        console.log(this.scene.children[1].children[0].children[0].geometry);
        var max = 0;
        for (var i = 0; i < this.scene.children[1].children.length; i++) {
            var axisX = this.scene.children[1].children[i].children[0].geometry.boundingSphere.center.x;
            var axisY = this.scene.children[1].children[i].children[0].geometry.boundingSphere.center.y;
            var axis = this.scene.children[1].children[i].children[0].geometry.boundingSphere.radius;
            var calcuate = Math.max(Math.abs(axisX + axis), Math.abs(axisX - axis), Math.abs(axisY + axis), Math.abs(axisY - axis));
            max = Math.ceil(Math.max(calcuate, max));
        }
        if (this.gridVisible) {
            var gridhelper = new THREE.GridHelper(max, max);
            gridhelper.name = "GridHelper";
            this.scene.add(gridhelper);
        }
        else {
            this.scene.remove(this.scene.getObjectByName("GridHelper"));
        }
    };
    SettingComponent.prototype.changeaxis = function () {
        this.axisVisible = !this.axisVisible;
        var max = 0;
        for (var i = 0; i < this.scene.children[1].children.length; i++) {
            var axisX = this.scene.children[1].children[i].children[0].geometry.boundingSphere.center.x;
            var axisY = this.scene.children[1].children[i].children[0].geometry.boundingSphere.center.y;
            var axis = this.scene.children[1].children[i].children[0].geometry.boundingSphere.radius;
            var calcuate = Math.max(Math.abs(axisX + axis), Math.abs(axisX - axis), Math.abs(axisY + axis), Math.abs(axisY - axis));
            max = Math.ceil(Math.max(calcuate, max));
        }
        if (this.axisVisible) {
            var axishelper = new THREE.AxisHelper(max);
            axishelper.name = "AxisHelper";
            this.scene.add(axishelper);
        }
        else {
            this.scene.remove(this.scene.getObjectByName("AxisHelper"));
        }
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
    };
    SettingComponent.prototype.changelight = function (_hue, _saturation, _lightness) {
        this.hue = _hue;
        this.saturation = _saturation;
        this.lightness = _lightness;
        var alight = this.alight;
        this.dataService.gethue(_hue);
        this.dataService.getsaturation(_saturation);
        this.dataService.getlightness(_lightness);
        for (var i = 0; i < alight.length; i++) {
            var ambientLight = alight[i];
            ambientLight.color.setHSL(_hue, _saturation, _lightness);
        }
    };
    SettingComponent = __decorate([
        core_1.Component({
            selector: 'app-setting',
            templateUrl: './setting.component.html',
            styleUrls: ['./setting.component.css']
        })
    ], SettingComponent);
    return SettingComponent;
}());
exports.SettingComponent = SettingComponent;
