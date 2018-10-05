"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_service_1 = require("./data.service");
var DataSubscriber = /** @class */ (function () {
    function DataSubscriber(injector) {
        var _this = this;
        this.dataService = injector.get(data_service_1.DataService);
        this._subscription = this.dataService.getMessage().subscribe(function (message) {
            _this._message = message;
            _this.notify(message.text);
        });
    }
    DataSubscriber.prototype.notify = function () {
        console.warn("Notify function not Implemented");
    };
    return DataSubscriber;
}());
exports.DataSubscriber = DataSubscriber;
