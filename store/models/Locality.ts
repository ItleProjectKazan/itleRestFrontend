import { Instance, types } from 'mobx-state-tree'

import { Restaurant } from '~/store/models/Restaurant'

export type TLocality = Instance<typeof Locality>

export const Locality = types.model('Locality', {
    id: types.identifierNumber,
    name: types.string,
    slug: types.string,
    latitude: types.number,
    longitude: types.number,
    border_box_lower_corner: types.array(types.number),
    border_box_upper_corner: types.array(types.number),
    support_phone_number: types.maybeNull(types.string),
    seo_title: types.maybeNull(types.string),
    is_default: types.boolean,
    region: types.maybeNull(types.string),
    restaurants: types.array(Restaurant),
})
