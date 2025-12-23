import { types } from 'mobx-state-tree'

export const RestaurantSelectModal = types
    .model('RestaurantSelectModal', {
        isOpen: types.boolean,
        deliveryType: types.string,
    })
    .actions(self => ({
        open(deliveryType: string) {
            self.isOpen = true
            self.deliveryType = deliveryType
        },
        close() {
            self.isOpen = false
        },
    }))
