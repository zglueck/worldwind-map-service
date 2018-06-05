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
            var self = this;
            var wmsUrl = self.buildWmsUrl(url);

            return self.retrieveXml(wmsUrl).then(self.getWmsLayers);
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
        key: 'retrieveXml',
        value: function retrieveXml(url) {
            return fetch(url).then(function (response) {
                return response.text();
            }).then(function (text) {
                return new DOMParser().parseFromString(text, 'text/xml');
            });
        }
    }, {
        key: 'getWmsLayers',
        value: function getWmsLayers(xml) {
            var wmsCapabilities = new _worldwind2.default.WmsCapabilities(xml);
            var namedLayers = wmsCapabilities.getNamedLayers();
            return namedLayers.map(function (layer) {
                var layerConfig = layer.formLayerConfiguration(layer);
                return new _worldwind2.default.WmsLayer(layerConfig);
            });
        }
    }]);

    return MapService;
}();

exports.default = MapService;