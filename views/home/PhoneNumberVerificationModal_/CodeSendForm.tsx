import { useEffect, useState, useCallback } from 'react'

import VerificationInput from 'react-verification-input'

import styles from './CodeSendForm.module.scss'

const CodeSendForm = () => {
    const VERIFICATION_CODE_LENGTH = 4

    const [resendRemainingTime, setResendRemainingTime] = useState(60)
    const [resendTimerExecuted, setResendTimerExecuted] = useState(false)

    const [verificationCode, setVerificationCode] = useState('')
    const [isValidCode, setIsValidCode] = useState(false)

    useEffect(() => {
        if (resendRemainingTime > 0 && ! resendTimerExecuted) {
            setResendTimerExecuted(true)
        }
    }, [resendRemainingTime, resendTimerExecuted])


    useEffect(() => {
        if ( ! resendTimerExecuted) {
            return
        }

        const interval = setInterval(() => {
            setResendRemainingTime(value => {
                if (value === 1) {
                    setResendTimerExecuted(false)
                }

                return value - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [resendTimerExecuted])

    const handleChange = useCallback((value: string) => {
        setVerificationCode(value)
    }, [])

    useEffect(() => {
        if (verificationCode.length < VERIFICATION_CODE_LENGTH) {
            return
        }

        try {
            alert(`Valid Code ${ verificationCode }`)
        } catch (error: any) {
            alert(`inValid Code ${ verificationCode }`)
            setIsValidCode(true)
        }
    }, [verificationCode])

    return (
        <>
            <VerificationInput
                autoFocus
                classNames={{
                    container: styles.codeInputs,
                    character: [
                        styles.codeInput,
                        isValidCode ? styles.incorrectCodeInput : null,
                    ].join(' '),
                    characterSelected: styles.codeInputSelected,
                }}
                length={ VERIFICATION_CODE_LENGTH }
                onChange={ handleChange }
                placeholder=""
                removeDefaultStyles
            />


            { isValidCode ?  <p className={ styles.incorrectCodeText }>Неверный код</p> : null }

            <button
                className={ [
                    styles.btnGetNewCode,
                    resendTimerExecuted ?  styles.btnCounter : null,
                ].join(' ') }
                type="submit"
            >
                {
                    resendTimerExecuted && ! isValidCode? `Получи новый код через ${ resendRemainingTime } сек` : 'Получить новый код'
                }
            </button>
        </>
    )
}

export { CodeSendForm }
