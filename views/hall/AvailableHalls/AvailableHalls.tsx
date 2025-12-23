import React, { FC } from 'react'
// import { types } from 'mobx-state-tree'
import styles from './AvailableHalls.module.scss'
import classNames from 'classnames'
import {} from '~/hooks'
import { TLocality, TRestaurant } from '~/types/misc'
// import { ContactsMap } from '../ContactsMap/ContactsMap'
// import { toJS } from 'mobx'
import { Button } from '~/components'
import { /*HallPhotos,*/ SmallHallPhotos } from '../HallPhotos/HallPhotos'
import Image from 'next/legacy/image'

interface Props {
    selectedRestaurant: TRestaurant | null
    locality: TLocality
    setSelectedRestaurant: (restaurant: TRestaurant | null) => void
}

type DaySchedule = {
    name: string
    from: string
    to: string
}

const Day: FC<{ day: DaySchedule }> = ({ day }) => {
    //добавить выходные
    return (
        <div className={classNames('container', styles.day)}>
            <div className={styles.name}>{day.name}</div>
            <div className={styles.from}>{day.from}</div>
            <div className={styles.to}>{day.to}</div>

            {/* <div className={ styles.free }>Выходной день</div> */}
        </div>
    )
}

const Hall: FC<{ restaurant: TRestaurant }> = ({ restaurant }) => {
    const images: JSX.Element[] = [
        <Image key='1' alt='' layout='fill' objectFit='cover' src={'/images/hall/amirhana/1.jpg'} />,
        <Image key='2' alt='' layout='fill' objectFit='cover' src={'/images/hall/amirhana/2.jpg'} />,
        <Image key='3' alt='' layout='fill' objectFit='cover' src={'/images/hall/amirhana/3.jpg'} />,
        <Image key='4' alt='' layout='fill' objectFit='cover' src={'/images/hall/amirhana/4.jpg'} />,
        <Image key='5' alt='' layout='fill' objectFit='cover' src={'/images/hall/amirhana/5.jpg'} />,
        <Image key='6' alt='' layout='fill' objectFit='cover' src={'/images/hall/amirhana/6.jpg'} />,
        <Image key='7' alt='' layout='fill' objectFit='cover' src={'/images/hall/amirhana/7.jpg'} />,
        <Image key='8' alt='' layout='fill' objectFit='cover' src={'/images/hall/amirhana/8.jpg'} />,
        <Image key='9' alt='' layout='fill' objectFit='cover' src={'/images/hall/amirhana/9.jpg'} />,
        <Image key='10' alt='' layout='fill' objectFit='cover' src={'/images/hall/amirhana/10.jpg'} />,
        <Image key='11' alt='' layout='fill' objectFit='cover' src={'/images/hall/amirhana/11.jpg'} />,
        <Image key='12' alt='' layout='fill' objectFit='cover' src={'/images/hall/amirhana/12.jpg'} />,
        <Image key='13' alt='' layout='fill' objectFit='cover' src={'/images/hall/amirhana/13.jpg'} />,
    ]

    const images2: JSX.Element[] = [
        <Image key='1' alt='' layout='fill' objectFit='cover' src={'/images/hall/zorge/1.jpeg'} />,
        <Image key='2' alt='' layout='fill' objectFit='cover' src={'/images/hall/zorge/2.jpeg'} />,
        <Image key='3' alt='' layout='fill' objectFit='cover' src={'/images/hall/zorge/3.jpeg'} />,
        <Image key='4' alt='' layout='fill' objectFit='cover' src={'/images/hall/zorge/4.jpeg'} />,
        <Image key='5' alt='' layout='fill' objectFit='cover' src={'/images/hall/zorge/5.jpeg'} />,
        <Image key='6' alt='' layout='fill' objectFit='cover' src={'/images/hall/zorge/6.jpeg'} />,
        <Image key='7' alt='' layout='fill' objectFit='cover' src={'/images/hall/zorge/7.jpeg'} />,
        <Image key='8' alt='' layout='fill' objectFit='cover' src={'/images/hall/zorge/8.jpeg'} />,
        <Image key='9' alt='' layout='fill' objectFit='cover' src={'/images/hall/zorge/9.jpeg'} />,
        <Image key='10' alt='' layout='fill' objectFit='cover' src={'/images/hall/zorge/10.jpeg'} />,
        <Image key='11' alt='' layout='fill' objectFit='cover' src={'/images/hall/zorge/11.jpeg'} />,
        <Image key='12' alt='' layout='fill' objectFit='cover' src={'/images/hall/zorge/12.jpeg'} />,
        <Image key='13' alt='' layout='fill' objectFit='cover' src={'/images/hall/zorge/13.jpeg'} />,
        <Image key='14' alt='' layout='fill' objectFit='cover' src={'/images/hall/zorge/14.jpeg'} />,
        <Image key='15' alt='' layout='fill' objectFit='cover' src={'/images/hall/zorge/15.jpeg'} />,
    ]

    const scrollToBron = () => {
        if (document == null) return
        const newLocal = document.getElementById('reserve_section')
        newLocal?.scrollIntoView({ block: 'start', behavior: 'smooth' })
    }

    return (
        <div className={classNames('container', styles.hall)}>
            <div className={styles.left}>
                {/* <div className={styles.spaciousness}>{restaurant.kitchen_diff} гостей</div> */}
                <div className={styles.address}>{restaurant.address}</div>
                {/* <Button className={styles.openMapBtn}>Проложить маршрут на карте</Button> */}
                <div className={styles.shedule}>
                    <Day day={{ name: 'Пн', ...restaurant.opening_hours.monday }} />
                    <Day day={{ name: 'Вт', ...restaurant.opening_hours.tuesday }} />
                    <Day day={{ name: 'Ср', ...restaurant.opening_hours.wednesday }} />
                    <Day day={{ name: 'Чт', ...restaurant.opening_hours.thursday }} />
                    <Day day={{ name: 'Пт', ...restaurant.opening_hours.friday }} />
                    <Day day={{ name: 'Сб', ...restaurant.opening_hours.saturday }} />
                    <Day day={{ name: 'Вс', ...restaurant.opening_hours.sunday }} />
                </div>
                <Button className={styles.reserveBtn} onClick={() => scrollToBron()}>
                    Забронировать зал
                </Button>
            </div>

            <div className={styles.right}>
                <SmallHallPhotos images={restaurant.id == 11 ? images2 : images} id={restaurant.id} />
            </div>
        </div>
    )
}

const AvailableHalls: FC<Props> = ({ selectedRestaurant, locality, setSelectedRestaurant }) => {
    return (
        <div className={classNames('container', styles.availableHalls)}>
            <div className={styles.header}>
                доступные <span>залы</span>
            </div>

            {locality.restaurants.map((restaurant) => (
                <Hall restaurant={restaurant} key={restaurant.id} />
            ))}

            {/* <ContactsMap
                locality={ locality }
                selectedRestaurant={ selectedRestaurant }
                setSelectedRestaurant={ setSelectedRestaurant }
            /> */}
        </div>
    )
}

export { AvailableHalls }
