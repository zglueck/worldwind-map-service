import MapService from '../src/MapService'
import 'isomorphic-fetch'

let mapServiceLayers

beforeAll( done => {
    const mapService = new MapService('https://worldwind25.arc.nasa.gov/wms');
    mapService.queryService()
        .then(layers => {
            mapServiceLayers = layers
            done()
        })
})

describe('Query Service', () => {
    it ('should contain sixteen wms layers', () => {
        expect(mapServiceLayers.wms.length).toBe(16)
    })
})

describe('WMS URL Builder', () => {

    const serviceAddress = 'https://worldwind25.arc.nasa.gov/wms'

    it('should create a standard WMS query from a standard service address', () => {
        const mapService = new MapService(serviceAddress)
        const url = mapService.buildWmsUrl(serviceAddress)
        
        expect(url).toBe(`${serviceAddress}?service=WMS&request=GetCapabilities`)
    })

    it('should create a standard WMS query from a populated service address', () => {
        const mapService = new MapService(serviceAddress)
        const url = mapService.buildWmsUrl(`${serviceAddress}?request=GetCapabilities&service=WMS`)
        
        expect(url).toBe(`${serviceAddress}?request=GetCapabilities&service=WMS`)
    })

    it('should create a standard WMS query from a service address with prepopulated key', () => {
        const mapService = new MapService()
        const keyString = '?key=1234'
        const url = mapService.buildWmsUrl(`${serviceAddress}${keyString}`)
        
        expect(url).toBe(`${serviceAddress}${keyString}&service=WMS&request=GetCapabilities`)
    })
})

describe('WMTS URL Builder', () => {

    const serviceAddress = 'https://tiles.maps.eox.at/wmts'

    it('should create a standard WMS query from a standard service address', () => {
        const mapService = new MapService()
        const url = mapService.buildWmtsUrl(serviceAddress)
        
        expect(url).toBe(`${serviceAddress}?service=WMTS&request=GetCapabilities`)
    })

    it('should create a standard WMS query from a populated service address', () => {
        const mapService = new MapService()
        const url = mapService.buildWmtsUrl(`${serviceAddress}?request=GetCapabilities&service=WMTS`)
        
        expect(url).toBe(`${serviceAddress}?request=GetCapabilities&service=WMTS`)
    })

    it('should create a standard WMS query from a service address with prepopulated key', () => {
        const mapService = new MapService()
        const keyString = '?key=1234'
        const url = mapService.buildWmtsUrl(`${serviceAddress}${keyString}`)
        
        expect(url).toBe(`${serviceAddress}${keyString}&service=WMTS&request=GetCapabilities`)
    })
})
