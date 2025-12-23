import { TAddressComponents } from '~/types/misc'

export const convertLocationSuggestions = (data: any) => {
    const geoObjects = data.response.GeoObjectCollection.featureMember

    return geoObjects.filter((object: any) => {
        const kind = object.GeoObject.metaDataProperty.GeocoderMetaData.kind

        return ['entrance', 'locality', 'street', 'house'].includes(kind)
    }).map((object: any) => {
        const [longitude, latitude] = object.GeoObject.Point.pos.split(' ').map(Number)
        const componentsArr = object.GeoObject.metaDataProperty.GeocoderMetaData.Address.Components as any[]
        const components = componentsArr.reduce<Record<keyof TAddressComponents, string>>((result, component: {
            kind: keyof TAddressComponents
            name: string
        }) => {
            result[component.kind] = component.name

            return result
        }, {} as any)
        const text = object.GeoObject.metaDataProperty.GeocoderMetaData.text
        const precision = object.GeoObject.metaDataProperty.GeocoderMetaData.precision

        return {
            text,
            components,
            latitude,
            longitude,
            precision,
        }
    })
}
