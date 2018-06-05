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
        const wmsUrl = this.buildWmsUrl(url);
        const wmtsUrl = this.buildWmtsUrl(url);

        return Promise.all(this.retrieveWms(wmsUrl), this.retrieveWmts(wmtsUrl));
    }

    buildWmsUrl (url) {
        const parsedUrl = new URL(url);
        const parameters = queryString.parse(parsedUrl.query);

        parameters.service = "WMS";
        parameters.request = "GetCapabilities";

        parsedUrl.query = parameters;

        return parsedUrl.toString();
    }

    buildWmtsUrl (url) {
        const parsedUrl = new URL(url);
        const parameters = queryString.parse(parsedUrl.query);

        parameters.service = "WMTS";
        parameters.request = "GetCapabilities";

        parsedUrl.query = parameters;

        return parsedUrl.toString();
    }

    retrieveWms (url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => new DOMParser().parseFromString(response.text(), 'text/xml'))
                .then(xml => {
                    try {
                        const wmsCapabilities = new worldwind.WmsCapabilities(xml);
                        const namedLayers = wmsCapabilities.getNamedLayers();
                        const wmsLayers = namedLayers.map(layer => {
                            const wmsConfig = worldwind.WmsLayer.formLayerConfiguration(layer);
                            return new worldwind.WmsLayer(wmsConfig);
                        });
                        resolve(wmsLayers);
                    } catch (e) {
                        resolve("no WMS layers found");
                    }
                    
                })
                .catch(e => {
                    resolve("no WMS layers found");
                });
        });
    }

    retrieveWmts (url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => new DOMParser().parseFromString(response.text(), 'text/xml'))
                .then(xml => {
                    try {
                        const wmtsCapabilities = new worldwind.WmtsCapabilities(xml);
                        const layers = wmtsCapabilities.getLayers();
                        const wmtsLayers = layers.map(layer => {
                            try {
                                const wmsConfig = worldwind.WmtsLayer.formLayerConfiguration(layer);
                                return new worldwind.WmtsLayer(wmsConfig);
                            } catch (e) {
                                // ignore for now
                            }
                        });
                        resolve(wmtsLayers.filter(wmtsLayer => wmtsLayer));
                    } catch (e) {
                        resolve("no WMS layers found");
                    }
                    
                })
                .catch(e => {
                    resolve("no WMS layers found");
                });
        });
    }
}
