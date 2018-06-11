import MapService from '../src/MapService';

describe('WMS URL Builder', () => {

    const serviceAddress = 'https://worldwind25.arc.nasa.gov/wms'

    it('should create a standard WMS query from a standard service address', () => {
        const mapService = new MapService()
        const url = mapService.buildWmsUrl(serviceAddress)
        
        expect(url).toBe(`${serviceAddress}?service=WMS&request=GetCapabilities`)
    })

    it('should create a standard WMS query from a populated service address', () => {
        const mapService = new MapService()
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



