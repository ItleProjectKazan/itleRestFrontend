import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useCart } from '~/hooks'
import { useStore } from '~/hooks/useStore'
import { useProductModifiers, useProductPrice, useProductWeight } from '~/hooks/product'
import { rawImageLoader } from '~/services/rawImageLoader'
import { ImageWithFallback, ProductCounter } from '~/components'
import { Button } from '~/components'
import { TCategory, TModifierControlType, TModifierGroup, TProduct } from '~/types/catalog'
import { TCartItem, TSimpleOrderItemModifierWithGroup } from '~/types/cart'
import { smoothScrollToElement } from '~/helpers/smoothScroll'
import { addYm } from '~/helpers'

// import styles from './ProductCard.module.scss'

const MAX_PRODUCT_QUANTITY = 30

const visibleModifierControlTypes = [
    TModifierControlType.STEPPER,
    TModifierControlType.STEPPER_OUTLINED,
    TModifierControlType.SELECT,
]

interface Props {
    availableBySchedule: boolean
    category: TCategory
    onClick: (product: TProduct) => void
    product: TProduct
    hidden?: boolean
}

const ProductCard = observer<Props>(({ availableBySchedule, category, onClick, product, hidden = false }) => {
    const [adding, setAdding] = useState(false)

    const { handleModifierChange, selectedModifiers, selectedModifiersMap } = useProductModifiers(product)
    const { orderParams, restaurantSelectModal, addProductQuery } = useStore()
    const cart = useCart()

    const price = useProductPrice(product, selectedModifiers)

    const weight = Math.ceil(useProductWeight(product, selectedModifiers) * 1000)

    const visibleModifierGroup = useMemo(() => {
        let result: TModifierGroup | undefined

        if (product.group_modifiers.length > 1) {
            return null
        }

        product.group_modifiers.forEach((modifierGroup) => {
            const controlType = modifierGroup.control_type ?? TModifierControlType.STEPPER_OUTLINED

            if (
                result === undefined &&
                visibleModifierControlTypes.includes(controlType) &&
                modifierGroup.min_amount > 0
            ) {
                result = modifierGroup
            }
        })

        return result ?? null
    }, [product])

    const hasHiddenRequiredModifiers = useMemo(() => {
        let result = false

        product.group_modifiers.forEach((modifierGroup) => {
            let hasPrice = false

            modifierGroup.modifiers.forEach((modifier) => {
                if (modifier.price > 0) {
                    hasPrice = true
                }
            })

            if (hasPrice) {
                const selected = selectedModifiers.find((selected_modifier) => {
                    return selected_modifier.group_id == modifierGroup.id ? true : false
                })

                if (selected == undefined || product.group_modifiers.length > 1) {
                    result = true
                }
            }

            if (modifierGroup.is_required == true) {
                result = true
            }
        })

        if (visibleModifierGroup == null && product.group_modifiers.length > 0) {
            result = true
        }

        return result
    }, [product, selectedModifiers, visibleModifierGroup])

    const handleUpdateItemQuantity = (item: TCartItem, quantity: number) => {
        addYm('reachGoal', 'add')
        cart.updateItem({
            itemId: item.id,
            modifiers: item.modifiers,
            quantity,
        })
    }

    const handleRemoveItem = (itemId: number) => {
        cart.removeItem(itemId)
    }

    const handleChange = (item: TCartItem) => (value: number) => {
        if (value === 0 && handleRemoveItem !== undefined) {
            handleRemoveItem(item.id)

            return
        }

        if (handleUpdateItemQuantity !== undefined) {
            handleUpdateItemQuantity(item, value)
        }
    }

    const handleProductClick = () => onClick(product)

    const handleAddProduct = () => {
        if (orderParams.restaurant !== null) {
            // if a user should select another required modifiers

            if (hasHiddenRequiredModifiers) {
                onClick(product)

                return
            }

            try {
                setAdding(true)
                addYm('reachGoal', 'add')
                cart.add({
                    productId: product.id,
                    modifiers: selectedModifiers,
                })
            } finally {
                setAdding(false)
            }
        } else {
            if (hasHiddenRequiredModifiers) {
                onClick(product)

                return
            }

            const selectedModifiersIds = selectedModifiers.map((modifier) => {
                return modifier.id
            })
            addProductQuery.add(product.id, selectedModifiersIds)

            restaurantSelectModal.open('')
        }
    }

    useEffect(() => {
        if (
            addProductQuery.product !== null &&
            addProductQuery.product == product.id &&
            orderParams.restaurant !== null
        ) {
            const currentModifers: TSimpleOrderItemModifierWithGroup[] = []
            if (addProductQuery.modifiers !== null && addProductQuery.modifiers.length) {
                product.group_modifiers.forEach((modifierGroup) => {
                    modifierGroup.modifiers.forEach((modifier) => {
                        if (addProductQuery.modifiers !== null && addProductQuery.modifiers.includes(modifier.id)) {
                            currentModifers.push({
                                id: modifier.id,
                                amount: 1,
                                group_id: modifierGroup.id,
                                weight: modifier.weight,
                                energy_amount: modifier.energy_amount,
                                protein_amount: modifier.protein_amount,
                                fat_amount: modifier.fat_amount,
                                carbohydrate_amount: modifier.carbohydrate_amount,
                                fiber_amount: modifier.fiber_amount,
                                name: modifier.name,
                            })
                        }
                    })
                })
            }

            addProductQuery.clear()

            setTimeout(() => {
                try {
                    setAdding(true)
                    addYm('reachGoal', 'add')
                    cart.add({
                        productId: product.id,
                        modifiers: currentModifers,
                    })
                } finally {
                    setAdding(false)
                }
            }, 150)
        }
    }, [product, addProductQuery, cart, handleAddProduct, orderParams])

    const selectedModifier = useMemo(() => {
        return visibleModifierGroup !== null ? (selectedModifiersMap[visibleModifierGroup.id] ?? []) : []
    }, [visibleModifierGroup, selectedModifiersMap])

    const { inCartAmount, item } = useMemo(() => {
        const foundItems = cart.items.filter((cartItem) => {
            if (cartItem.product.id == product.id) {
                const selectedModifiersIds: any = []
                for (const i in selectedModifiersMap) {
                    for (const j in selectedModifiersMap[i]) {
                        selectedModifiersIds.push(selectedModifiersMap[i][j].id)
                    }
                }
                if (selectedModifiersIds.length) {
                    const inCartModifiersIds: any = []
                    cartItem.modifiers.forEach((item) => {
                        inCartModifiersIds.push(item.id)
                    })

                    if (JSON.stringify(inCartModifiersIds.sort()) == JSON.stringify(selectedModifiersIds.sort())) {
                        return cartItem
                    }
                } else {
                    return cartItem
                }
            }
        })

        if (foundItems.length) {
            return {
                inCartAmount: foundItems[0].quantity,
                item: foundItems[0],
            }
        }

        const item: TCartItem = {
            has_replacement: false,
            id: 0,
            product: product,
            modifiers: [],
            quantity: 0,
            is_available: 0,
            total_price: 0,
            subtotal_price: 0,
            updated_at: '',
            discount: null,
            dont_apply_discount: false,
            product_id: 0,
        }

        return {
            inCartAmount: 0,
            item: item,
        }
    }, [cart, product, selectedModifier, selectedModifiersMap])

    const scrollToGroup = useCallback(() => {
        if (!availableBySchedule) {
            const categoryBlock = document.getElementById(category.code)
            if (categoryBlock !== null) {
                smoothScrollToElement(categoryBlock)
            }
        }
    }, [availableBySchedule, category])

    if (hidden) {
        return null
    }

    return (
        <div key={product.id} className='product-card'>
            {/*<ProductLabel className={styles.label} product={product} />*/}
            <div className='product-card__image d-flex'>
                <ImageWithFallback
                    alt={product.name}
                    fallbackSrc={
                        product.image_url !== null
                            ? product.image_url + '.jpg'
                            : '/images/product-image-placeholder.svg'
                    }
                    layout='fill'
                    loader={rawImageLoader}
                    objectFit='contain'
                    objectPosition='center'
                    onClick={handleProductClick}
                    src={
                        product.image_url !== null
                            ? product.image_url + '.webp'
                            : '/images/product-image-placeholder.svg'
                    }
                    unoptimized
                />
                <div className='product-card__buttons'>
                    {/* {inCartAmount > 0 && availableBySchedule ? ( */}
                    {!hasHiddenRequiredModifiers && inCartAmount > 0 && availableBySchedule ? (
                        <div className='product-card__counter d-flex items-center'>
                            <ProductCounter
                                disableIncrement={inCartAmount === MAX_PRODUCT_QUANTITY}
                                max={MAX_PRODUCT_QUANTITY}
                                onChange={handleChange(item)}
                                value={inCartAmount}
                            />
                        </div>
                    ) : (
                        <a onClick={scrollToGroup}>
                            <Button
                                className='product-card__buttons-btn d-flex block-center transition'
                                disabled={!availableBySchedule}
                                loading={adding}
                                onClick={handleAddProduct}
                            >
                                {/*{hasHiddenRequiredModifiers ? 'Добавить' : 'В корзину'}*/}
                                <span className='icon-cart'></span>
                            </Button>
                        </a>
                    )}
                </div>
            </div>
            <div className='product-card__content d-flex flex-column items-start'>
                <h3 className='product-card__content-title' onClick={handleProductClick}>
                    {product.name}
                </h3>
                {/*{product.description && <div className={styles.description}>{product.description}</div>}*/}
                <span className='product-card__content-weight'>{weight} гр.</span>
                <span className='product-card__content-price'>
                    {price} <span>₽</span>
                </span>

                {/*<div className={styles.footer}>
                    {
                        visibleModifierGroup !== null &&
                        <GroupModifier
                            modifierGroup={visibleModifierGroup}
                            notSelectedRequiredModifiers={[]}
                            onChange={handleModifierChange(visibleModifierGroup.id)}
                            selectedModifiers={selectedModifier}
                        />
                    }
                </div>*/}
            </div>
        </div>
    )
})

export { ProductCard }
