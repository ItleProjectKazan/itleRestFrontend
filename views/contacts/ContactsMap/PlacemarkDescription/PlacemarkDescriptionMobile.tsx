import React, { FC, useMemo } from 'react'
import classNames from 'classnames'

import { Typography } from '~/components'

import { TDayOfWeek, TRestaurant } from '~/types/misc'

import { daysOfWeekShortLabels } from '~/constants/daysOfWeek'

import styles from './PlacemarkDescriptionMobile.module.scss'

import CloseIcon from '~/public/images/close-icon.svg'

type TDaySchedule = {
    startDay: TDayOfWeek
    endDay: TDayOfWeek
    startTime: string
    endTime: string
}

interface Props {
    doShowModal: (value: boolean) => void
    selectedRestaurant: TRestaurant | null
    showModal: boolean
}

export const PlacemarkDescriptionMobile: FC<Props> = ({
    doShowModal,
    selectedRestaurant,
    showModal,
}) => {

    const getDayLabel = (daySchedule: TDaySchedule) => {
        if (daySchedule.startDay === daySchedule.endDay) {
            return daysOfWeekShortLabels[daySchedule.startDay]
        }

        return `${ daysOfWeekShortLabels[daySchedule.startDay] }-${ daysOfWeekShortLabels[daySchedule.endDay] }`
    }

    const schedule = useMemo(() => {
        if (selectedRestaurant === null) {
            return null
        }

        const openingHours = selectedRestaurant.opening_hours
        const daysOfWeek = Object.keys(openingHours) as TDayOfWeek[]
        const firstDay = daysOfWeek.shift() as TDayOfWeek
        const result: TDaySchedule[] = []

        const addDay = (day: TDayOfWeek) => {
            result.push({
                startDay: day,
                endDay: day,
                startTime: openingHours[day].from,
                endTime: openingHours[day].to,
            })
        }

        addDay(firstDay)

        daysOfWeek.forEach(dayOfWeek => {
            const lastIndex = result.length - 1

            if (
                openingHours[dayOfWeek].from === result[lastIndex].startTime &&
                openingHours[dayOfWeek].to === result[lastIndex].endTime
            ) {
                result[lastIndex].endDay = dayOfWeek

                return
            }

            addDay(dayOfWeek)
        })

        return result
    }, [selectedRestaurant])

    if (selectedRestaurant === null || schedule === null) {
        return null
    }

    return (
        <div
            className={ classNames(styles.locationData, {
                [styles.shown]: showModal,
            }) }
        >
            <a className={ styles.invicibleCloser } onClick={ () => doShowModal(false) }></a>
            <div className={ styles.selectedLocation }>
                <a className={ styles.closer } onClick={ () => doShowModal(false) }>
                    <CloseIcon height="16" width="16" />
                </a>
                <div>
                    <Typography className={ styles.blockHeader } color="brown" lineHeight={ 20 } size={ 16 }>
                        Адрес:
                    </Typography>
                    <Typography className={ styles.blockData } lineHeight={ 20 } size={ 16 }>
                        { selectedRestaurant.address }
                    </Typography>
                    <Typography className={ styles.blockHeader } color="brown" lineHeight={ 20 } size={ 16 }>
                        Телефон:
                    </Typography>
                    <Typography className={ styles.blockData } lineHeight={ 20 } size={ 16 }>
                        { selectedRestaurant.phone_number }
                    </Typography>
                    <Typography className={ styles.blockHeader } color="brown" lineHeight={ 20 } size={ 16 }>
                        Время работы:
                    </Typography>
                    <Typography lineHeight={ 26 } size={ 16 } weight="normal">
                        {
                            schedule.map(daySchedule => (
                                <div key={ daySchedule.startDay } className={ styles.workTimeRow }>
                                    <Typography className={ styles.blockDataDay } lineHeight={ 20 } size={ 16 }>
                                        { getDayLabel(daySchedule) }
                                    </Typography>
                                    <Typography className={ styles.blockDataTime } lineHeight={ 20 } size={ 16 }>
                                        { daySchedule.startTime } - { daySchedule.endTime }
                                    </Typography>
                                </div>
                            ))
                        }
                    </Typography>
                </div>
            </div>
        </div>

    )
}
