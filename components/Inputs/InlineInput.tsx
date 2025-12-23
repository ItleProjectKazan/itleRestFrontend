import React, { forwardRef, useEffect, useState } from 'react'
import classNames from 'classnames'
import { Typography } from '~/components'
import { usePrevious } from '~/hooks'
import Pencil from '~/public/images/pencil.svg'
import Check from '~/public/images/circle-check-24.svg'
import Error from '~/public/images/error-cancel.svg'
import Loader from '~/public/images/inner-loader.svg'
import styles from './InlineInput.module.scss'

type Props = {
    dataSaved: number
    editable: boolean
    error?: boolean
    errorMessage: string
    label?: string
    submitData: () => void
    defaultValue?: string
    [key: string]: any
}

const InlineInput = forwardRef<HTMLInputElement, Props>(
    ({ dataSaved, defaultValue, editable, error, errorMessage, label, submitData, ...props }, ref) => {
        const [editing, startEditing] = useState(false)
        const [saving, startSaving] = useState(false)

        const prevError = usePrevious(error)
        const prevDataSaved = usePrevious(dataSaved)

        useEffect(() => {
            if (prevDataSaved !== null) {
                if (prevDataSaved !== dataSaved || prevError !== error) {
                    startSaving(false)
                }

                if (prevDataSaved !== dataSaved) {
                    if (!error) {
                        startEditing(false)
                    }
                }
            }
        }, [prevDataSaved, dataSaved, error, prevError])

        const saveData = () => {
            startSaving(true)

            if (typeof submitData !== 'undefined') {
                submitData()
            }
        }

        const onKeyPress = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
                saveData()
            }
        }

        const input = (
            <input
                ref={ref}
                autoFocus
                className={classNames(styles.input, {
                    [styles.error]: error,
                })}
                onKeyPress={onKeyPress}
                {...props}
            />
        )

        const button = (
            <a
                className={classNames(styles.editButton, {
                    [styles.saving]: saving && !error,
                })}
                onClick={() => (saving ? false : !editing ? startEditing(true) : saveData())}
            >
                {error && editing ? <Error /> : saving ? <Loader /> : editing ? <Check /> : <Pencil />}
            </a>
        )

        return (
            <div className={styles.inlineInput}>
                <Typography className={styles.inputLabel}>{label}</Typography>
                <div
                    className={classNames(styles.inputDataHolder, {
                        [styles.editing]: editing,
                        [styles.error]: error,
                    })}
                >
                    {editing ? (
                        input
                    ) : (
                        <>
                            {defaultValue && defaultValue.length && <Typography>{defaultValue}</Typography>}
                            {!defaultValue ||
                                (!defaultValue.length && (
                                    <a onClick={() => startEditing(true)}>
                                        <Typography color='primary'>Указать</Typography>
                                    </a>
                                ))}
                        </>
                    )}
                    {editable ? button : null}
                </div>
                {error && editing && <Typography className={styles.inputError}>{errorMessage}</Typography>}
            </div>
        )
    },
)

InlineInput.displayName = 'InlineInput'

export { InlineInput }
