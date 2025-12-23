import { FC, useState } from 'react'
import InputMask from 'react-input-mask'

import styles from './PhoneVerificationForm.module.scss'

interface Props {
    getPhoneNumber: (show: string) => void
    showCode: (show: boolean) => void
}

const normalizePhone = (phoneNumber: string) => {
    return parseInt(phoneNumber.replace(/[^0-9]/g, ''))
}

const PhoneVerificationForm: FC<Props> = ({ showCode, getPhoneNumber }) => {
    const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true)
    const [phoneNumber, setPhoneNumber] = useState('')

    const handleClick = (event: any) => {
        event.preventDefault()
        showCode(true)
        getPhoneNumber(normalizePhone(phoneNumber).toString())
    }

    const handleChange = (event: any) => {
        const value = event.target.value
        setPhoneNumber(value)

        const phoneNumberLength = normalizePhone(value).toString().length
        const validPhoneNumberLength = 11

        if (phoneNumberLength === validPhoneNumberLength) {
            setIsPhoneNumberValid(false)
        }
    }

    const inputMaskProps = {
        mask: '+7(999)999-99-99',
        maskChar: '_',
        alwaysShowMask: true,
        formatChars: {
            '9': '[0-9]',
        },
    }

    return (
        <>
            <InputMask
                { ...inputMaskProps }
                className={ styles.phoneInput }
                onChange={ handleChange }
                value={ phoneNumber }
            />

            <button
                className={ styles.btnGetCode }
                disabled={ isPhoneNumberValid }
                onClick={ handleClick }
                type="submit"
            >
                Выслать код
            </button>
        </>
    )
}

export { PhoneVerificationForm }
