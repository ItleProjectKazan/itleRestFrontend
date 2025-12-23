import React, { FC } from 'react'
import Image from 'next/legacy/image'
import { add, format, isAfter, isBefore, parse } from 'date-fns'
import classNames from 'classnames'

import { getDayOfWeek } from '~/helpers'

import { Button, Typography } from '~/components'
import { RestaurantClosedMessage } from './RestaurantClosedMessage'

import { TOpeningHours } from '~/types/misc'

import commonStyles from './Common.module.scss'
import styles from './RestaurantClosed.module.scss'

interface Props {
    onClose: () => void
    openingHours: TOpeningHours
}

const RestaurantClosed: FC<Props> = ({ onClose, openingHours }) => {
    const currentTime = new Date()
    const tomorrowTime = add(currentTime, {
        days: 1,
    })
    const todaySchedule = openingHours[getDayOfWeek()]
    const tomorrowSchedule = openingHours[getDayOfWeek(tomorrowTime)]
    const startTime = parse(todaySchedule.from, 'HH:mm', currentTime)
    const endTime = parse(todaySchedule.to, 'HH:mm', currentTime)
    const tomorrowStartTimeStr = format(parse(tomorrowSchedule.from, 'HH:mm', currentTime), 'H:mm')
    const todayStartTimeStr = format(parse(todaySchedule.from, 'HH:mm', currentTime), 'H:mm')
    const startTimeStr = format(startTime, 'H:mm')
    const endTimeStr = format(endTime, 'H:mm')

    return (
        <div className={classNames(commonStyles.container, styles.root)}>
            <Image alt='' height={50} src='/images/dish-clock.svg' width={64} />
            <Typography align='center' className='mt-20' lineHeight={34} size={28} weight='normal'>
                Мы работаем с {startTimeStr} до {endTimeStr}
            </Typography>
            <Typography align='center' className='mt-12' lineHeight={26} size={20} weight='normal'>
                {isBefore(currentTime, startTime) && (
                    <RestaurantClosedMessage
                        message={'Ваш заказ будет обработан сегодня с ' + todayStartTimeStr + '.'}
                    />
                )}
                {isAfter(currentTime, endTime) && (
                    <RestaurantClosedMessage
                        message={'Ваш заказ будет обработан завтра с ' + tomorrowStartTimeStr + '.'}
                    />
                )}
            </Typography>
            <div className={styles.buttons}>
                <Button color='primary' onClick={onClose} size='large'>
                    Хорошо
                </Button>
            </div>
        </div>
    )
}

export { RestaurantClosed }
