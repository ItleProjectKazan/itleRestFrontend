import { FC, useState, MouseEvent } from 'react'
import Picker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import cn from 'classnames'
import { ru } from 'date-fns/locale'
import 'react-datepicker/dist/react-datepicker.css'

registerLocale('ru', ru)
setDefaultLocale('ru')

interface IDatePicker {
    date?: Date | null
    label?: string
    error?: boolean
    disabled?: boolean
    minDate?: Date
    maxDate?: Date
    openToDate?: Date
    onChange?: (d: Date | null) => void
}

export const DatePicker: FC<IDatePicker> = ({
    date,
    openToDate,
    minDate,
    maxDate,
    label,
    error,
    onChange,
    disabled = false,
}) => {
    const [pikerType, setPikerType] = useState<'month' | 'year' | null>()

    const onChangeHandler = (date: Date | null): void => {
        if (pikerType === 'year') {
            setPikerType('month')
        } else {
            setPikerType(null)
        }
        if (onChange) {
            onChange(date)
        }
    }

    const onClick = (e: MouseEvent<HTMLLabelElement>) => {
        e.preventDefault()
        const isMonth = (e.target as HTMLLabelElement).classList?.contains('react-datepicker__current-month')
        if (isMonth) {
            setPikerType('month')
            return
        }
        const isYear = (e.target as HTMLLabelElement).classList?.contains('react-datepicker-year-header')
        if (isYear) {
            setPikerType('year')
        }
    }

    return (
        <label className={cn('calendar-field', { error })} onClick={onClick}>
            {label && <div className={cn('calendar-field__label')}>{label}</div>}
            <Picker
                onChange={onChangeHandler}
                selected={date}
                locale={ru}
                dateFormat='d MMMM yyyy'
                shouldCloseOnSelect={!(pikerType === 'month' || pikerType === 'year')}
                showMonthYearPicker={pikerType === 'month'}
                showYearPicker={pikerType === 'year'}
                disabled={disabled}
                minDate={minDate}
                maxDate={maxDate}
                openToDate={openToDate}
            />
        </label>
    )
}
