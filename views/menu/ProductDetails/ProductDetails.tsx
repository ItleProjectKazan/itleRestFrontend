import React, { FC, useState, useMemo } from 'react'
import { useCart } from '~/hooks'
import { useStore } from '~/hooks/useStore'
import { useProductPrice, useProductWeight, useProductModifiers, useProductFoodValues } from '~/hooks/product'
import { rawImageLoader } from '~/services/rawImageLoader'
import { Button, Modal } from '~/components'
import { GroupModifier } from '../GroupModifier/GroupModifier'
// import { FoodValueInfo } from './FoodValueInfo'
import { ImageWithFallback, ProductCounter } from '~/components'
import { TCategory, TModifierGroup, TProduct } from '~/types/catalog'
import { TCartItem } from '~/types/cart'
import { foodValuePropertyKeys, propertyNotEmpty } from './foodValueProperties'
import styles from './ProductDetails.module.scss'
import { isAvailableBySchedule, addYm } from '~/helpers'
import { formatPrice, formatWeight } from '~/helpers/formatters'

const MAX_PRODUCT_QUANTITY = 30

interface Props {
    category: TCategory
    onClose: () => void
    product: TProduct
}

const ProductDetails: FC<Props> = ({ category, onClose, product }) => {
    const [notSelectedRequiredModifiers, setNotSelectedRequiredModifiers] = useState<TModifierGroup[]>([])
    const { handleModifierChange, selectedModifiers, selectedModifiersMap } = useProductModifiers(product)
    const { orderParams, restaurantSelectModal, addProductQuery } = useStore()
    const cart = useCart()

    // Инициализация выбранных пунктов
    // useEffect(() => {
    //     const selectedProduct = cart.items.find((item) => item.product.id === product.id)
    //     if (!selectedProduct) return
    //     const modifiers = selectedProduct.modifiers
    //     const groupModifiers = selectedProduct?.product?.group_modifiers
    //     const modifierIds = modifiers.map(({ id }) => id)
    //     groupModifiers.map((item) => {
    //         item.modifiers.map((modifier) => {
    //             const isExist = modifierIds.includes(modifier.id)
    //             if (isExist) {
    //                 handleModifierChange(item.id)([{ ...modifier, amount: 1 }])
    //             }
    //         })
    //     })
    // }, [])

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

    const scrollToModifier = (id: string) => {
        const modifierBlock = document.getElementById(id)

        if (modifierBlock !== null) {
            const topPos = modifierBlock.offsetTop
            // const productDetailsContent = document.getElementById('product_details')
            const productDetailsContent = document.querySelector('.ReactModal__Overlay')
            if (productDetailsContent !== null) {
                // productDetailsContent.scrollTop = topPos
                productDetailsContent.scroll({
                    top: topPos,
                    behavior: 'smooth',
                })
            }
        }
    }

    const allRequiredModifiersAreSelected = () => {
        let totalModifiers: TModifierGroup[] = []
        // Проверка если есть обязательные поля
        const requiredModifiersExist = product.group_modifiers.filter((modifier) => modifier.is_required == true)
        if (requiredModifiersExist.length) {
            const notFoundModifiers = requiredModifiersExist.filter((modifier) => {
                const leftModifiersToSelect = selectedModifiers.filter(
                    (selectedModifier) => selectedModifier.group_id == modifier.id,
                )
                return !leftModifiersToSelect.length
            })
            if (notFoundModifiers.length) {
                totalModifiers = notFoundModifiers
            }
        }

        // Проверка если указанно количество
        const countModifiersExist = product.group_modifiers.filter(
            (modifier) => modifier.min_amount || modifier.max_amount,
        )

        if (countModifiersExist.length) {
            const notFoundModifiers = countModifiersExist.filter((modifier) => {
                const leftModifiersToSelect = selectedModifiers.filter(
                    (selectedModifier) => selectedModifier.group_id == modifier.id,
                )
                const selectedCount = leftModifiersToSelect.length
                return selectedCount < modifier.min_amount || selectedCount > modifier.max_amount
            })
            if (notFoundModifiers.length) {
                totalModifiers = [...totalModifiers, ...notFoundModifiers]
            }
        }

        if (totalModifiers.length) {
            setNotSelectedRequiredModifiers(totalModifiers)
            scrollToModifier('modifier_' + totalModifiers[0].id)
            return false
        }
        setNotSelectedRequiredModifiers([])
        return true
    }

    const addToCart = () => {
        if (orderParams.restaurant !== null) {
            if (allRequiredModifiersAreSelected()) {
                onClose()
                addYm('reachGoal', 'add')
                cart.add({
                    productId: product.id,
                    modifiers: selectedModifiers,
                })
            }
        } else {
            if (!allRequiredModifiersAreSelected()) {
                return
            }

            onClose()
            const selectedModifiersIds = selectedModifiers.map((modifier) => {
                return modifier.id
            })
            addProductQuery.add(product.id, selectedModifiersIds)
            restaurantSelectModal.open('')
        }
    }

    const { inCartAmount, item } = useMemo(() => {
        const foundItems = cart.items.filter((cartItem) => {
            if (cartItem.product.id == product.id) {
                const selectedModifiersIds: number[] = []

                for (const i in selectedModifiersMap) {
                    for (const j in selectedModifiersMap[i]) {
                        selectedModifiersIds.push(selectedModifiersMap[i][j].id)
                    }
                }
                if (selectedModifiersIds.length) {
                    const inCartModifiersIds: number[] = []
                    cartItem.modifiers.forEach((item) => {
                        inCartModifiersIds.push(item.id)
                    })
                    if (JSON.stringify(inCartModifiersIds.sort()) == JSON.stringify(selectedModifiersIds.sort())) {
                        return cartItem
                    }
                } else {
                    return cartItem.modifiers.length ? null : cartItem
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
    }, [cart, product, selectedModifiersMap])

    const foodValues = useProductFoodValues(product, selectedModifiers)
    const price = useProductPrice(product, selectedModifiers)
    const weight = useProductWeight(product, selectedModifiers)
    const isAvailableByScheduleBool = isAvailableBySchedule(category)

    const hasFoodValueInfo = foodValuePropertyKeys.some((key) => {
        return propertyNotEmpty(foodValues[key])
    })

    const actionButton =
        inCartAmount > 0 && isAvailableByScheduleBool ? (
            <div className={styles.counterHolder}>
                <ProductCounter
                    disableIncrement={inCartAmount === MAX_PRODUCT_QUANTITY}
                    max={MAX_PRODUCT_QUANTITY}
                    onChange={handleChange(item)}
                    value={inCartAmount}
                />
            </div>
        ) : (
            <Button className={styles.addButton} disabled={!isAvailableByScheduleBool} fullWidth onClick={addToCart}>
                Добавить в корзину · {formatPrice(price)}
            </Button>
        )

    const modifiersGroupsSorted = useMemo(() => {
        return [...product.group_modifiers].sort((a, b) => {
            return b.id - a.id
        })
    }, [product.group_modifiers])

    return (
        <Modal
            afterContainer={
                <div className={styles.stickyFooter}>
                    <div className={styles.actionButtonHolder}>{actionButton}</div>
                </div>
            }
            className='product-modal'
            containerClass={styles.modalContainer}
            id='product_details'
            onClose={onClose}
            open
        >
            <div className='product-modal__inner d-flex flex-wrap'>
                <div className='product-modal__image'>
                    {
                        <ImageWithFallback
                            alt={product.name}
                            fallbackSrc={
                                product.image_url !== null
                                    ? product.image_url + '.jpg'
                                    : '/images/product-image-placeholder.svg'
                            }
                            height={312}
                            loader={rawImageLoader}
                            objectFit='contain'
                            src={
                                product.image_url !== null
                                    ? product.image_url + '.webp'
                                    : '/images/product-image-placeholder.svg'
                            }
                            unoptimized
                            width={344}
                        />
                    }
                </div>
                <div className='product-modal__content d-flex flex-column items-start'>
                    {weight > 0 && <span className='product-modal__content-weight'>{formatWeight(weight)}</span>}
                    <h2 className='product-modal__content-title'>{product.name}</h2>
                    <div className='product-modal__content-description'>{product.description}</div>
                    {/*<div className="product-modal__content-text">Добавить по вкусу</div>*/}
                    <div className='modifiers-wrapper'>
                        {modifiersGroupsSorted.map((modifierGroup) => (
                            <GroupModifier
                                key={modifierGroup.id}
                                modifierGroup={modifierGroup}
                                notSelectedRequiredModifiers={notSelectedRequiredModifiers}
                                onChange={handleModifierChange(modifierGroup.id)}
                                selectedModifiers={selectedModifiersMap[modifierGroup.id] ?? []}
                            />
                        ))}
                    </div>
                    <div className='product-modal__content-button'>{actionButton}</div>
                    {hasFoodValueInfo ? (
                        <div className='energy-info d-flex flex-wrap'>
                            {foodValues.fat_amount > 0 ? (
                                <div className='energy-info__item d-flex items-center'>
                                    Жиры · {Math.round(foodValues.fat_amount * 10) / 10} г
                                </div>
                            ) : null}
                            {foodValues.carbohydrate_amount > 0 ? (
                                <div className='energy-info__item d-flex items-center'>
                                    Углеводы · {Math.round(foodValues.carbohydrate_amount * 10) / 10} г
                                </div>
                            ) : null}
                            {foodValues.energy_amount > 0 ? (
                                <div className='energy-info__item d-flex items-center'>
                                    Энерг. ценность · {Math.round(foodValues.energy_amount * 10) / 10} ккал
                                </div>
                            ) : null}
                            {foodValues.protein_amount > 0 ? (
                                <div className='energy-info__item d-flex items-center'>
                                    Белки · {Math.round(foodValues.protein_amount * 10) / 10} г
                                </div>
                            ) : null}
                            {foodValues.fiber_amount > 0 ? (
                                <div className='energy-info__item d-flex items-center'>
                                    Клечатка · {Math.round(foodValues.fiber_amount * 10) / 10} г
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                    {product?.additional_info ? (
                        <div className='product-modal__content-description'>{product.additional_info}</div>
                    ) : null}
                </div>
            </div>
        </Modal>
    )
}

export { ProductDetails }
