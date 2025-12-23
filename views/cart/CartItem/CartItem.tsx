import React, { FC, useEffect, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import classNames from 'classnames'
import { getDefaultSelectedModifiers } from '~/helpers/product'
import { ImageWithFallback } from '~/components'
import { Counter, Price, ProductsSlider, Tooltip, Typography } from '~/components'
import { TCartItem, TOrderItemModifier } from '~/types/cart'
import { TModifierGroup } from '~/types/catalog'
import { TProduct } from '~/types/catalog'
import styles from './CartItem.module.scss'
import CloseCircleIcon from '~/public/images/close-circle.svg'
import ReplaceCircleIcon from '~/public/images/replace_circle.svg'

type TModifierSortGroup = {
    group_id: number
    name: string
    modifiers: { id: number; name: string }[]
}

const MAX_PRODUCT_QUANTITY = 30

type Props = {
    item: TCartItem
    getReplacements?: () => Promise<TProduct[]>
    onRemove?: () => void
    onReplace?: (replacementId: number, modifiers: TOrderItemModifier[]) => void
    onUpdateQuantity?: (quantity: number) => void
    summaryMode?: boolean
}

export const CartItem: FC<Props> = observer(
    ({ item, getReplacements, onRemove, onReplace, onUpdateQuantity, summaryMode }) => {
        const [orderButtonRef, setOrderButtonRef] = useState<HTMLElement | null>(null)
        const [replacements, setReplacements] = useState<TProduct[] | null>(null)
        const [replacementsShown, showReplacements] = useState<boolean>(false)
        const handleChange = (value: number) => {
            if (value === 0 && onRemove !== undefined) {
                onRemove()

                return
            }

            if (onUpdateQuantity !== undefined) {
                onUpdateQuantity(value)
            }
        }

        const prepareReplacements = () => {
            if (summaryMode && !item.is_available && getReplacements !== undefined) {
                getReplacements().then((replacements) => {
                    setReplacements(replacements)
                })
            }
        }

        useEffect(() => {
            if (!item.is_available && !item.has_replacement) {
                prepareReplacements()
            }
        }, [item])

        const hasDiscount = item.subtotal_price !== item.total_price

        const priceComponent = (
            <div
                className={classNames(styles.priceContainer, {
                    [styles.priceContainerWithDiscount]: hasDiscount,
                })}
            >
                {hasDiscount && (
                    <Price
                        className={summaryMode ? styles.subtotalPriceSmall : styles.subtotalPrice}
                        color='primary'
                        strikethrough
                        value={item.subtotal_price}
                    />
                )}
                <Price
                    className={summaryMode ? styles.totalPriceSmall : styles.totalPrice}
                    color={item.subtotal_price === item.total_price ? 'secondary' : 'primary'}
                    value={item.subtotal_price}
                />
                {summaryMode && item.is_available && <div className={styles.quantity}>{item.quantity} шт</div>}
                {!summaryMode && item.is_available && (
                    <div className={styles.actions}>
                        {onUpdateQuantity !== undefined && (
                            <Counter
                                disableIncrement={item.quantity === MAX_PRODUCT_QUANTITY}
                                max={MAX_PRODUCT_QUANTITY}
                                onChange={handleChange}
                                value={item.quantity}
                            />
                        )}

                        {/* {
                            onRemove !== undefined &&
                            <button className={ styles.removeButton } onClick={ onRemove }>
                                <CloseIcon />
                            </button>
                        } */}
                    </div>
                )}
            </div>
        )

        const handleReplaceProductClick = (product: TProduct) => {
            const modifiers = getDefaultSelectedModifiers(product)
            onReplace?.(product.id, modifiers)
            setReplacements(null)
        }

        // const modifiersMap = useMemo(() => {
        //     const result: Record<
        //         number,
        //         {
        //             name: string
        //         }
        //     > = {}

        //     item.product.group_modifiers.map((modifierGroup) => {
        //         modifierGroup.modifiers.map((modifier) => {
        //             result[modifier.id] = {
        //                 name: modifier.name,
        //             }
        //         })
        //     })

        //     return result
        // }, [item])

        // Группировака модифаеров по группам
        const modifiers = useMemo(
            () =>
                item.modifiers.reduce((cur: TModifierSortGroup[], next: TOrderItemModifier) => {
                    const groupModifiers: TModifierGroup | undefined = item.product.group_modifiers.find(
                        ({ id }) => id === next.group_id,
                    )
                    if (!groupModifiers) return cur
                    const newGr = cur.find(({ group_id }: TModifierSortGroup) => group_id === groupModifiers.id)
                    const mod = groupModifiers.modifiers.find(({ id }) => id === next.id)
                    if (!newGr) {
                        cur.push({ group_id: groupModifiers.id, name: groupModifiers.name || '', modifiers: [] })
                    }
                    if (!mod) return cur
                    return cur.map((item) =>
                        item.group_id === next.group_id
                            ? {
                                  ...item,
                                  modifiers: [...item.modifiers, { id: mod.id, name: mod.name }],
                              }
                            : item,
                    )
                }, []),
            [item],
        )

        return (
            <li
                className={classNames(styles.root, {
                    [styles.rootCart]: !summaryMode,
                    [styles.rootCheckout]: summaryMode,
                })}
                data-error={!item.is_available && !item.has_replacement}
            >
                {!summaryMode && (
                    <div className={styles.image}>
                        <ImageWithFallback
                            alt='product image'
                            fallbackSrc={
                                item.product.image_url
                                    ? item.product.image_url + '.jpg'
                                    : '/images/product-image-placeholder.svg'
                            }
                            layout='fill'
                            objectFit='contain'
                            src={
                                item.product.image_url
                                    ? item.product.image_url + '.webp'
                                    : '/images/product-image-placeholder.svg'
                            }
                            unoptimized
                        />
                    </div>
                )}

                <div className={styles.content}>
                    <Typography className={summaryMode ? styles.productNameSmall : styles.productName}>
                        {item.product.name}
                    </Typography>
                    <Typography className={styles.weight}>{(item.product.weight * 1000).toFixed(0)} гр.</Typography>
                    {!summaryMode && priceComponent}
                    <div>
                        {/* {item.modifiers.map((modifier) => (
                            <Typography key={modifier.id} className={styles.modifierItem}>
                                {modifiersMap[modifier.id]?.name}
                            </Typography>
                        ))} */}
                        {modifiers.map((modifier) => (
                            <Typography key={modifier.group_id} className={styles.modifierItem}>
                                <div>{modifier.name}</div>
                                <ul>
                                    {modifier.modifiers.map((item) => (
                                        <li key={item.name}>{item.name}</li>
                                    ))}
                                </ul>
                            </Typography>
                        ))}
                        {item.product?.dont_apply_discount && summaryMode && (
                            <div className={styles.notDiscountable}>Скидки на товар не распространяются</div>
                        )}
                    </div>
                    {summaryMode && (
                        <>
                            {!item.is_available && !item.has_replacement && (
                                <Typography className='mt-8' color='error'>
                                    Позиции недоступны в данной локации.
                                    <br />
                                    Пожалуйста, замените позиции или вернитесь к прошлой локации.
                                </Typography>
                            )}
                            {!item.is_available && item.has_replacement && (
                                <Typography className='mt-8' color='error'>
                                    К сожалению, нет в наличии
                                </Typography>
                            )}
                        </>
                    )}

                    {orderButtonRef !== null && false && (
                        <Tooltip
                            anchorEl={orderButtonRef}
                            className={classNames(styles.unavailableTooltip)}
                            placement='top-end'
                        >
                            <Typography color='white' weight='semi-bold'>
                                К сожалению одного из товаров нет в наличии
                            </Typography>
                        </Tooltip>
                    )}
                    {summaryMode && (
                        <>
                            {item.is_available && priceComponent}
                            {!item.is_available && !item.has_replacement && (
                                <div ref={setOrderButtonRef} className='d-flex flex-column mt-8'>
                                    <div className={styles.unavailableButton} onClick={onRemove}>
                                        <Typography className='mr-8'>Удалить</Typography>
                                        <CloseCircleIcon />
                                    </div>
                                    {replacements !== null && replacements.length ? (
                                        <div
                                            className={styles.unavailableButton}
                                            onClick={() => showReplacements(true)}
                                        >
                                            <Typography className='mr-8'>Заменить</Typography>
                                            <ReplaceCircleIcon />
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </>
                    )}
                </div>
                {replacements !== null && replacements.length && replacementsShown ? (
                    <ProductsSlider
                        autoplay={false}
                        onProductClick={handleReplaceProductClick}
                        products={replacements}
                        title=''
                    />
                ) : null}
            </li>
        )
    },
)
