import { FC, useCallback, useState } from 'react'
import { useApiRequest, useStore } from '~/hooks'
import { phoneEncoder } from '~/helpers'
import { Modal, Typography } from '~/components'
import { PhoneNumberForm } from './PhoneNumberForm'
import { SendCodeForm } from './SendCodeForm'
import RegisterForm from './RegisterForm'
import { PageLinks } from '~/constants/pageLinks'
import styles from './LoginModal.module.scss'

interface Props {
    mainMessage: string
    onClose: () => void
    open: boolean
    subMessage: string
}

const LoginModal: FC<Props> = ({ mainMessage, onClose, open, subMessage }) => {
    const [phoneNumber, setPhoneNumber] = useState('')
    const [phoneNumberValidationError, setPhoneNumberValidationError] = useState<string | null>(null)
    const [verificationId, setVerificationId] = useState('')
    const [showCodeForm, setShowCodeForm] = useState(false)
    const [showRegisterForm, setShowRegisterForm] = useState(false)

    const store = useStore()

    const handleEditPhoneNumberSubmit = useCallback(() => {
        setShowCodeForm(false)
        setVerificationId('')
    }, [])

    const sendVoiceCode = useApiRequest((phoneNumber: string) => {
        return async (http, endpoints) => {
            setPhoneNumber(phoneNumber)
            setPhoneNumberValidationError(null)

            try {
                const response = await http.post<{
                    resend_timeout: number
                    verification_id: string
                }>(endpoints.SEND_CALL_CODE, {
                    phone_number: phoneNumber,
                    token: phoneEncoder(phoneNumber),
                })

                setShowCodeForm(true)
                setVerificationId(response.data.verification_id)
            } catch (error: any) {
                if (error.response?.status === 422) {
                    setPhoneNumberValidationError(error.response.data.validation_errors.phone_number)

                    return
                }

                throw error
            }
        }
    })

    const sendVerificationCode = useApiRequest((phoneNumber: string) => {
        return async (http, endpoints) => {
            setPhoneNumber(phoneNumber)
            setPhoneNumberValidationError(null)

            try {
                const response = await http.post<{
                    resend_timeout: number
                    verification_id: string
                }>(endpoints.SEND_VERIFICATION_CODE, {
                    phone_number: phoneNumber,
                    token: phoneEncoder(phoneNumber),
                })

                setShowCodeForm(true)
                setVerificationId(response.data.verification_id)
            } catch (error: any) {
                if (error.response?.status === 422) {
                    setPhoneNumberValidationError(error.response.data.validation_errors.phone_number)

                    return
                }

                throw error
            }
        }
    })

    const handleResendVerificationCode = useCallback(() => {
        sendVerificationCode(phoneNumber)
    }, [phoneNumber, sendVerificationCode])

    const handleSuccessfullyLogin = useCallback(
        async (isNewUser?: boolean) => {
            await store.fetchUser()
            if (isNewUser) {
                setShowCodeForm(false)
                setShowRegisterForm(true)
                return
            }
            onClose()
        },
        [onClose, store],
    )

    return (
        <Modal className={styles.modal} onClose={onClose} open={open}>
            {!showRegisterForm ? (
                <>
                    <Typography className={styles.title}>{mainMessage}</Typography>
                    <div className={styles.subTitle}>
                        {!showCodeForm && <Typography>{subMessage}</Typography>}
                        {showCodeForm && (
                            <Typography className={styles.editPhoneNumber}>
                                {/* Мы отправили вам сообщение с кодом для ввода в поле ниже на номер &nbsp; */}
                                <div className={styles.text}>
                                    Сейчас вам поступит телефонный звонок
                                    <br />
                                    Последние 4 цифры входящего звонка,
                                    <br />
                                    является кодом
                                </div>
                                <br />
                                {/* <Typography className={styles.phoneNumber} element='span'>
                                    {phoneNumber}
                                </Typography> */}
                                <Typography
                                    className={styles.edit}
                                    color='primary'
                                    element='span'
                                    onClick={handleEditPhoneNumberSubmit}
                                >
                                    Изменить мой номер
                                </Typography>
                            </Typography>
                        )}
                    </div>

                    {!showCodeForm && (
                        <PhoneNumberForm
                            onSubmit={sendVoiceCode}
                            validationError={phoneNumberValidationError ?? undefined}
                        />
                    )}

                    {showCodeForm && (
                        <SendCodeForm
                            onSuccess={handleSuccessfullyLogin}
                            resendCode={handleResendVerificationCode}
                            verificationId={verificationId}
                        />
                    )}
                </>
            ) : (
                <RegisterForm onClose={onClose} />
            )}

            <Typography className={styles.agreementText}>
                Продолжая вы соглашаетесь со сбором и обработкой персональных данных и{' '}
                <a className='transition' href={PageLinks.INFO_LEGAL} rel='noreferrer' target='_blank'>
                    пользовательским соглашением
                </a>
            </Typography>
        </Modal>
    )
}

export { LoginModal }
