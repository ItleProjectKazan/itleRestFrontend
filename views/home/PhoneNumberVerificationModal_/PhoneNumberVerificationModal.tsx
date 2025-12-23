import { useCallback, useState } from 'react'

import { Modal } from '~/components/Modal/Modal'
import { PhoneVerificationForm } from './PhoneVerificationForm'
import { CodeSendForm } from './CodeSendForm'

import styles from './PhoneNumberVerificationModal.module.scss'
import { PageLinks } from '~/constants/pageLinks'

const PhoneNumberVerificationModal = () => {
    const [showCodeForm, setShowCodeForm] = useState(false)

    const [phoneNumber, setPhoneNumber] = useState('')

    const setShow = (show: boolean) => {
        setShowCodeForm(show)
    }

    const getPhoneNumber = (phoneNumber: string) => {
        setPhoneNumber(phoneNumber)
    }

    const handleEditPhoneNumber = useCallback(() => {
        setShowCodeForm(false)
    }, [])

    return (
        <Modal className={styles.phoneVerifacationModal} open>
            <div className={styles.phoneVerifacation}>
                <h2 className={styles.title}>Подтвердите свой номер</h2>
                <div className={styles.EditPhoneNumber}>
                    <span className={styles.subTitle}>
                        {showCodeForm ? 'Код отправлен на номер' : 'Это поможет быстрее оформить заказ'}
                    </span>

                    {showCodeForm ? (
                        <div>
                            <span className={styles.phoneNumber}>&nbsp;{`+${phoneNumber}`}&nbsp;</span>
                            <a className={styles.edit} href='#' onClick={handleEditPhoneNumber}>
                                Изменить
                            </a>
                        </div>
                    ) : null}
                </div>

                <form action=''>
                    {showCodeForm ? (
                        <CodeSendForm />
                    ) : (
                        <PhoneVerificationForm getPhoneNumber={getPhoneNumber} showCode={setShow} />
                    )}
                </form>

                <div className={styles.agreementText}>
                    Продолжая вы соглашаетесь со{' '}
                    <a href={PageLinks.INFO_LEGAL} rel='noreferrer' target='_blank'>
                        сбором и обработкой персональных данных и пользовательским соглашением
                    </a>
                </div>
            </div>
        </Modal>
    )
}

export { PhoneNumberVerificationModal }
