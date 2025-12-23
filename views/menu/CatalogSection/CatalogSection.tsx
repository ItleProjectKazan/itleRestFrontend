import { forwardRef, useMemo, useState, useEffect } from 'react'
import { add, isAfter, parse } from 'date-fns'
import { isAvailableBySchedule, getDayOfWeek, getWhenDayView, getTimeFromDate } from '~/helpers'
import { ProductCard } from '../ProductCard/ProductCard'
import Clock from '~/public/images/clock.svg'
import Flash from '~/public/images/flash.svg'
import { TCategory, TProduct } from '~/types/catalog'
import styles from './CatalogSection.module.scss'
import cn from 'classnames'

interface Props {
    category: TCategory
    onProductClick: (product: TProduct) => void
    products: TProduct[]
    showTitle?: boolean
}

const CatalogSection = forwardRef<any, Props>(({ category, onProductClick, products, showTitle = true }, ref) => {
    const date = new Date()
    const minutes = date.getMinutes()
    const [currentMinutes, setMinutes] = useState(minutes)
    const [hideBloks, setHideBloks] = useState(true)

    const productsSorted = useMemo(() => {
        return [...products].sort((a, b) => {
            return a.sort - b.sort
        })
    }, [products])

    const getAvailableTimeAndDate = (category: TCategory) => {
        const currentTime = new Date()

        for (let i = 0; i < 8; i++) {
            let SKIP = false
            const date_to_select = add(currentTime, {
                days: i,
            })

            const this_date_worktime = category.availability_schedule[getDayOfWeek(date_to_select)]

            if (this_date_worktime !== null) {
                const day = getWhenDayView(date_to_select)
                const startTime = getTimeFromDate(parse(this_date_worktime[0].from, 'HH:mm', currentTime))
                const endTime = getTimeFromDate(parse(this_date_worktime[0].to, 'HH:mm', currentTime))

                if (currentTime.toISOString() === date_to_select.toISOString()) {
                    if (isAfter(currentTime, parse(this_date_worktime[0].to, 'HH:mm', currentTime))) {
                        SKIP = true
                    }
                }

                if (!SKIP) {
                    return {
                        day: day,
                        startTime: startTime,
                        endTime: endTime,
                    }
                }
            }
        }

        return false
    }

    const availableForOrderTime = (category: TCategory) => {
        if (category.availability_schedule === null) {
            return false
        }

        const dateAndTimes = getAvailableTimeAndDate(category)

        if (!dateAndTimes) {
            return false
        }

        return (
            <div key='notAvailableMessage' className={styles.notAvailableMessageHolder}>
                <Clock height={18} width={18} />
                <div className={styles.notAvailableMessageText}>
                    Доступен для заказа {dateAndTimes.day} с {dateAndTimes.startTime} до {dateAndTimes.endTime}
                </div>
            </div>
        )
    }

    useEffect(() => {
        const interval = setInterval(() => {
            const date = new Date()
            const minutes = date.getMinutes()
            setMinutes(minutes)
        }, 60000)

        return () => clearInterval(interval)
    }, [setMinutes])

    const availableBySchedule = useMemo(() => {
        currentMinutes

        return isAvailableBySchedule(category)
    }, [category, currentMinutes])

    const notAvailableMessage = !availableBySchedule ? availableForOrderTime(category) : null

    const hideBlockClick = () => {
        setHideBloks(!hideBloks)
    }

    return (
        <div ref={ref} id={category.code} className='category-block'>
            <div className='category-block__title d-flex content-start flex-wrap'>
                {/*<h2>{ category.name }</h2>*/}
                {showTitle && <h2>{category.category_name}</h2>}
                {category.text ? (
                    <div className='category-block__title-notion d-flex items-center'>
                        <Flash height={16} width={16} />
                        <span>{category.text}</span>
                    </div>
                ) : null}
            </div>

            <div>{notAvailableMessage}</div>
            <div className='products-list d-flex flex-wrap'>
                {!productsSorted.length && (
                    <div className='no-products d-flex justify-center'>
                        На данный момент товаров в этой категории нет, но вы можете подобрать что-нибудь другое
                    </div>
                )}
                {productsSorted.map((product, index) => {
                    return (
                        <ProductCard
                            hidden={index > 7 && hideBloks}
                            key={product.id}
                            availableBySchedule={availableBySchedule}
                            category={category}
                            onClick={onProductClick}
                            product={product}
                        />
                    )
                })}
                {productsSorted.length > 8 ? (
                    <div className='products-list__button d-flex'>
                        <div
                            onClick={hideBlockClick}
                            className='products-list__button-btn d-flex items-center transition'
                        >
                            <span
                                className={cn('transition', {
                                    'icon-angle-bottom': hideBloks,
                                    'icon-angle-top': !hideBloks,
                                })}
                            ></span>
                            {hideBloks ? 'Показать все' : 'Скрыть'}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
})

CatalogSection.displayName = 'CatalogSection'

export { CatalogSection }
