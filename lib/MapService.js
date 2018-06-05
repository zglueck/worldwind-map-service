'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _worldwind = require('@nasaworldwind/worldwind');

var _worldwind2 = _interopRequireDefault(_worldwind);

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

var _urlParse = require('url-parse');

var _urlParse2 = _interopRequireDefault(_urlParse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MapService = function () {
    function MapService() {
        _classCallCheck(this, MapService);
    }

    _createClass(MapService, [{
        key: 'queryService',


        /**
         * Queries the provided URL for WMS and WMTS data sources returning a Promise to an array of WMS and WMTS layers.
         * 
         * @param {String} url 
         */
        value: function queryService(url) {
            var wmsUrl = this.buildWmsUrl(url);
            var wmtsUrl = this.buildWmtsUrl(url);

            return Promise.all(this.retrieveWms(wmsUrl), this.retrieveWmts(wmtsUrl));
        }
    }, {
        key: 'buildWmsUrl',
        value: function buildWmsUrl(url) {
            var parsedUrl = new _urlParse2.default(url);
            var parameters = _queryString2.default.parse(parsedUrl.query);

            parameters.service = "WMS";
            parameters.request = "GetCapabilities";

            parsedUrl.query = parameters;

            return parsedUrl.toString();
        }
    }, {
        key: 'buildWmtsUrl',
        value: function buildWmtsUrl(url) {
            var parsedUrl = new _urlParse2.default(url);
            var parameters = _queryString2.default.parse(parsedUrl.query);

            parameters.service = "WMTS";
            parameters.request = "GetCapabilities";

            parsedUrl.query = parameters;

            return parsedUrl.toString();
        }
    }, {
        key: 'retrieveWms',
        value: function retrieveWms(url) {
            return new Promise(function (resolve, reject) {
                fetch(url).then(function (response) {
                    return new DOMParser().parseFromString(response.text, 'text/xml');
                }).then(function (xml) {
                    try {
                        var wmsCapabilities = new _worldwind2.default.WmsCapabilities(xml);
                        var namedLayers = wmsCapabilities.getNamedLayers();
                        var wmsLayers = namedLayers.map(function (layer) {
                            var wmsConfig = _worldwind2.default.WmsLayer.formLayerConfiguration(layer);
                            return new _worldwind2.default.WmsLayer(wmsConfig);
                        });
                        resolve(wmsLayers);
                    } catch (e) {
                        resolve("no WMS layers found");
                    }
                }).catch(function (e) {
                    resolve("no WMS layers found");
                });
            });
        }
    }, {
        key: 'retrieveWmts',
        value: function retrieveWmts(url) {
            return new Promise(function (resolve, reject) {
                fetch(url).then(function (response) {
                    return new DOMParser().parseFromString(response.text, 'text/xml');
                }).then(function (xml) {
                    try {
                        var wmtsCapabilities = new _worldwind2.default.WmtsCapabilities(xml);
                        var layers = wmtsCapabilities.getLayers();
                        var wmtsLayers = layers.map(function (layer) {
                            try {
                                var wmsConfig = _worldwind2.default.WmtsLayer.formLayerConfiguration(layer);
                                return new _worldwind2.default.WmtsLayer(wmsConfig);
                            } catch (e) {
                                // ignore for now
                            }
                        });
                        resolve(wmtsLayers.filter(function (wmtsLayer) {
                            return wmtsLayer;
                        }));
                    } catch (e) {
                        resolve("no WMS layers found");
                    }
                }).catch(function (e) {
                    resolve("no WMS layers found");
                });
            });
        }
    }]);

    return MapService;
}();

exports.default = MapService;