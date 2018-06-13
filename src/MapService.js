import worldwind from '@nasaworldwind/worldwind'
import queryString from 'query-string'
import URL from 'url-parse'

export default class MapService {

    constructor (serviceAddress) {
        this.serviceAddress = serviceAddress
        this.requests = {
            wmsStatus: 'in progress',
            wmtsStatus: 'in progress'
        }
        this.layers = {
            serviceAddress: serviceAddress,
            wms: [],
            wmts: []
        }
    }

    processComplete () {
        if (this.requests.wmsStatus === 'complete' && this.requests.wmtsStatus === 'complete') {
            return true
        } else if (this.requests.wmsStatus === 'error' && this.requests.wmtsStatus === 'error') {
            return true
        } else if (this.requests.wmsStatus !== 'in progress' && this.requests.wmtsStatus !== 'in progress') {
            return true
        } else {
            return false
        }
    }

    /**
     * Queries the provided URL for WMS and WMTS data sources returning a Promise to an object with an 
     * array of WorldWind WMS and WMTS layers.
     */
    queryService () {
        
        return new Promise((resolve, reject) => {
            
            this.retrieveXml(this.buildWmsUrl(this.serviceAddress))
                .then(this.getWmsLayers)
                .then(wmsLayers => {
                    console.log('successful wms retrieval')

                    if (wmsLayers) {
                        for (let layer in wmsLayers) {
                            this.layers.wms.push(layer)
                        }
                    }
            
                    this.requests.wmsStatus = 'complete'
                    
                    if (this.processComplete()) {
                        resolve(this.layers)
                    }
                })
                .catch(e => {
                    console.log('error retreiving wms' + e)
                    this.requests.wmsStatus = 'error'

                    if (this.processComplete()) {
                        resolve(this.layers);
                    }
                })
            
            this.retrieveXml(this.buildWmtsUrl(this.serviceAddress))
                .then(this.getWmtsLayers)
                .then(wmtsLayers => {
                    console.log('successful wmts retrieval')
                
                    if (wmtsLayers) {
                        for (let layer in wmtsLayer) {
                            this.layers.wmts.push(layer)
                        }
                    }

                    this.requests.wmtsStatus = 'complete'
                    
                    if (this.processComplete()) {
                        resolve(this.layers)
                    }
                })
                .catch(e => {
                    console.log('error retreiving wmts' + e)
                    this.requests.wmtsStatus = 'error'

                    if (this.processComplete()) {
                        resolve(this.layers)
                    }
                })
        })
    }

    buildWmsUrl (url) {
        const parsedUrl = new URL(url)
        const parameters = queryString.parse(parsedUrl.query)

        parameters.service = 'WMS'
        parameters.request = 'GetCapabilities'

        parsedUrl.query = parameters

        return parsedUrl.toString()
    }

    buildWmtsUrl (url) {
        const parsedUrl = new URL(url)
        const parameters = queryString.parse(parsedUrl.query)

        parameters.service = 'WMTS'
        parameters.request = 'GetCapabilities'

        parsedUrl.query = parameters

        return parsedUrl.toString()
    }

    retrieveXml (url) {
        return fetch(url)
                .then(response => response.text())
                .then(text => new DOMParser().parseFromString(text, 'text/xml'))
    }

    getWmsLayers (xml) {
        const wmsCapabilities = new worldwind.WmsCapabilities(xml)
        const namedLayers = wmsCapabilities.getNamedLayers()
        return namedLayers.map(layer => {
            const layerConfig = worldwind.WmsLayer.formLayerConfiguration(layer)
            return new worldwind.WmsLayer(layerConfig)
        })
    }

    getWmtsLayers (xml) {
        const wmtsCapabilities = new worldwind.WmtsCapabilities(xml)

        if (wmtsCapabilities.contents && wmtsCapabilities.contents.layers) {
            const layers = wmtsCapabilities.getLayers()

            return layers.map(layer => {
                const layerConfig = worldwind.WmtsLayer.formLayerConfiguration(layer)
                return new worldwind.WmtsLayer(layerConfig)
            })
        } else {
            return null
        }
    }
}
