import { TProduct } from '~/types/catalog'
import { TOrderItemModifier } from '~/types/cart'

export const calculateProductPrice = (product: TProduct, modifiers: TOrderItemModifier[]) => {
    let price = product.price

    const modifiersMap = modifiers.reduce<Record<number, number>>((result, modifier) => {
        result[modifier.id] = modifier.amount

        return result
    }, {})

    product.group_modifiers.map(modifierGroup => {
        modifierGroup.modifiers.map(modifier => {
            if (modifiersMap[modifier.id] !== undefined) {
                price += modifier.price * modifiersMap[modifier.id]
            }
        })
    })

    product.modifiers.map(modifier => {
        if (modifiersMap[modifier.id] !== undefined) {
            price += modifier.price * modifiersMap[modifier.id]
        }
    })

    return price
}
