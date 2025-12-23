import { FC, useCallback, useEffect, useState } from 'react'
import VerificationInput from 'react-verification-input'
import { serialize } from 'cookie'
import { addDays } from 'date-fns'

import { setAuthToken } from '~/core/auth'
import { useApiRequest } from '~/hooks'
import { CartService } from '~/services/cart'

import { Button, Typography } from '~/components'

import { ApiEndpoints } from '~/constants/apiEndpoints'

import styles from './SendCodeForm.module.scss'

const VERIFICATION_CODE_LENGTH = 4

interface Props {
    onSuccess: (isNewUser?: boolean) => void
    resendCode: () => void
    verificationId: string
}

const SendCodeForm: FC<Props> = ({ onSuccess, resendCode, verificationId }) => {
    const [resendRemainingTime, setResendRemainingTime] = useState(60)
    const [resendTimerExecuted, setResendTimerExecuted] = useState(false)
    const [verificationCode, setVerificationCode] = useState('')
    const [isCodeInvalid, setIsCodeInvalid] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        if (resendRemainingTime > 0 && !resendTimerExecuted) {
            setResendTimerExecuted(true)
        }
    }, [resendRemainingTime, resendTimerExecuted])

    useEffect(() => {
        if (!resendTimerExecuted) {
            return
        }

        const interval = setInterval(() => {
            setResendRemainingTime((value) => {
                if (value === 1) {
                    setResendTimerExecuted(false)
                }

                return value - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [resendTimerExecuted])

    const sendCode = useApiRequest((verificationCode) => {
        return async (http) => {
            setIsCodeInvalid(false)

            try {
                const response = await http.post<{
                    token: string
                    is_new?: boolean
                }>(ApiEndpoints.LOG_IN, {
                    verification_id: verificationId,
                    code: verificationCode,
                    cart_id: CartService.getId(),
                })
                setAuthToken(response.data.token)
                // set cookie to be available for SSR
                if (typeof document !== 'undefined') {
                    document.cookie = serialize('token', response.data.token, {
                        path: '/',
                        sameSite: 'lax',
                        expires: addDays(new Date(), 365),
                    })
                }
                onSuccess(response.data?.is_new)
            } catch (error: any) {
                if (error.response.status === 422) {
                    setIsCodeInvalid(true)
                    setErrorMessage(error.response.data.validation_errors.code)

                    setTimeout(() => {
                        setVerificationCode('')
                        setIsCodeInvalid(false)
                        setErrorMessage(null)
                    }, 4000)

                    return
                }

                throw error
            }
        }
    })

    const handleCodeChange = useCallback(
        (value: string) => {
            if (value.length > 0 && !/^[0-9]+$/.test(value)) {
                return
            }

            setVerificationCode(value)

            if (value.length === VERIFICATION_CODE_LENGTH) {
                sendCode(value)
            }
        },
        [sendCode],
    )

    const handleResendCode = useCallback(() => {
        setVerificationCode('')
        setResendRemainingTime(60)

        resendCode()
    }, [resendCode])

    return (
        <>
            <VerificationInput
                autoFocus
                classNames={{
                    container: styles.codeInputs,
                    character: [styles.codeInput, isCodeInvalid ? styles.incorrectCodeInput : null].join(' '),
                    characterSelected: styles.codeInputSelected,
                }}
                length={VERIFICATION_CODE_LENGTH}
                onChange={handleCodeChange}
                placeholder=''
                removeDefaultStyles
                value={verificationCode}
            />

            {isCodeInvalid && (
                <Typography className='mt-12' color='error' lineHeight={20} size={16} weight='semi-bold'>
                    {errorMessage ?? 'Ошибка'}
                </Typography>
            )}

            <Button className={styles.submitBtn} disabled={resendTimerExecuted} onClick={handleResendCode} size='large'>
                {resendTimerExecuted && !isCodeInvalid
                    ? `Получи новый код через ${resendRemainingTime} сек`
                    : 'Получить новый код по смс'}
            </Button>
        </>
    )
}

export { SendCodeForm }
