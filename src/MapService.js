import worldwind from '@nasaworldwind/worldwind';
import queryString from 'query-string';
import URL from 'url-parse';

export default class MapService {

    /**
     * Queries the provided URL for WMS and WMTS data sources returning a Promise to an array of WMS and WMTS layers.
     * 
     * @param {String} url 
     */
    queryService (url) {
        const self = this;
        const wmsUrl = self.buildWmsUrl(url);
        
        return self.retrieveXml(wmsUrl)
                    .then(self.getWmsLayers)
    }

    buildWmsUrl (url) {
        const parsedUrl = new URL(url);
        const parameters = queryString.parse(parsedUrl.query);

        parameters.service = "WMS";
        parameters.request = "GetCapabilities";

        parsedUrl.query = parameters;

        return parsedUrl.toString();
    }

    retrieveXml (url) {
        return fetch(url)
                .then(response => response.text())
                .then(text => new DOMParser().parseFromString(text, 'text/xml'));
    }

    getWmsLayers (xml) {
        const wmsCapabilities = new worldwind.WmsCapabilities(xml);
        const namedLayers = wmsCapabilities.getNamedLayers();
        return namedLayers.map(layer => {
            const layerConfig = WorldWind.WmsLayer.formLayerConfiguration(layer);
            return new worldwind.WmsLayer(layerConfig);
        });
    }
}
