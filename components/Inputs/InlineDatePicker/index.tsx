import React, { FC, useEffect, useState } from 'react'
import { DatePicker } from '~/components'
import Pencil from '~/public/images/pencil.svg'
import Check from '~/public/images/circle-check-24.svg'
import Error from '~/public/images/error-cancel.svg'
import Loader from '~/public/images/inner-loader.svg'

import { addYears } from 'date-fns'

interface IInlineDatePicker {
    submitData: () => void
    onChange: (d: Date | null) => void
    saving: boolean
    editable?: boolean
    date?: Date | null
    openToDate?: Date
    label?: string
    error?: string
}

export const InlineDatePicker: FC<IInlineDatePicker> = ({
    date,
    openToDate,
    error,
    saving,
    label,
    editable = true,
    onChange,
    submitData,
}) => {
    const [editMode, setEditMode] = useState(false)

    useEffect(() => {
        if (error) {
            setEditMode(true)
        }
    }, [error])

    const onChangeDate = (d: Date | null) => {
        onChange(d)
    }
    const onCheck = () => {
        setEditMode(true)
    }
    const onSave = () => {
        submitData()
        setEditMode(false)
    }
    return (
        <div style={{ position: 'relative' }}>
            <DatePicker
                minDate={new Date(1900, 0, 1)}
                maxDate={addYears(new Date(), -4)}
                date={date}
                label={label}
                disabled={!editMode}
                onChange={onChangeDate}
                openToDate={openToDate}
            />
            <div className='edit-profile__field-icon'>
                {saving ? (
                    <Loader />
                ) : error ? (
                    <div onClick={onSave}>
                        <Error />
                    </div>
                ) : editMode ? (
                    <div onClick={onSave}>
                        <Check />
                    </div>
                ) : (
                    editable && (
                        <div onClick={onCheck}>
                            <Pencil />
                        </div>
                    )
                )}
            </div>
            {error && (
                <div
                    style={{
                        fontSize: '12px',
                        color: 'red',
                        fontWeight: 400,
                        marginTop: '2px',
                    }}
                >
                    {error}
                </div>
            )}
        </div>
    )
}
