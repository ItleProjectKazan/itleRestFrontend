import { ChangeEvent, FC, KeyboardEvent, useState, useEffect } from 'react'
import InputMask from 'react-input-mask'
import { Button, Typography } from '~/components'
import styles from './PhoneVerificationForm.module.scss'

const normalizePhone = (phoneNumber: string) => {
    return phoneNumber.replace(/[^0-9+]/g, '')
}

interface IPhoneNumberForm {
    onSubmit: (phoneNumber: string) => void
    validationError?: string
}

const PhoneNumberForm: FC<IPhoneNumberForm> = ({ onSubmit, validationError }) => {
    const [phoneNumber, setPhoneNumber] = useState('')

    const normalizedPhoneNumber = normalizePhone(phoneNumber)
    useEffect(() => {
        if (typeof document !== 'undefined') {
            // для автофокуса.
            setTimeout(() => {
                const input = document.querySelector('#phone_input_mask') as HTMLInputElement
                input?.focus()
            }, 0)
        }
    }, [])

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(event.target?.value || '')
    }

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            onSubmit(normalizedPhoneNumber)
        }
    }

    const handleClick = () => {
        onSubmit(normalizedPhoneNumber)
    }

    return (
        <>
            <div className={styles.root}>
                <InputMask
                    id='phone_input_mask'
                    alwaysShowMask
                    // autoFocus
                    className={styles.input}
                    formatChars={{
                        '*': '[0-9]',
                    }}
                    mask='+7 (***) *** - ** - **'
                    maskChar='_'
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    value={phoneNumber}
                />

                <Button className={styles.button} disabled={normalizedPhoneNumber.length <= 11} onClick={handleClick}>
                    Выслать код
                </Button>
            </div>
            {validationError !== undefined && (
                <Typography align='start' className='mt-12' color='error'>
                    {validationError}
                </Typography>
            )}
        </>
    )
}

export { PhoneNumberForm }
