import { useState, useEffect } from 'react'
import cn from 'classnames'
import CloseIcon from '~/public/images/close-icon.svg'

const Confirm = () => {
    const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false)
    const [isAgree, setIsAgree] = useState(true)

    useEffect(() => {
        const isConfirm = localStorage.getItem('confPolitinc')
        if (!isConfirm) {
            setIsAgree(false)
        }
    }, [])

    const onOpenConfirm = () => {
        setConfirmModalIsOpen(true)
    }

    const onCloseConfirm = () => {
        setConfirmModalIsOpen(false)
    }

    const onConfirm = () => {
        localStorage.setItem('confPolitinc', '1')
        setConfirmModalIsOpen(false)
        setIsAgree(true)
    }

    return (
        <>
            <div className={cn('confirmFon', { open: confirmModalIsOpen })}>
                <div className='fon' onClick={onCloseConfirm}></div>
                <div className='confirmModal'>
                    <CloseIcon onClick={onCloseConfirm} className='closeBtb' height={18} width={18} />
                    Продолжая использовать наш сайт, вы даете согласие на обработку файлов cookie (пользовательских
                    данных, содержащих сведения о местоположении; тип, язык и версию ОС; тип, язык и версию браузера;
                    сайт или рекламный сервис, с которого пришел пользователь; тип, язык и разрешение экрана устройства,
                    с которого пользователь обращается к сайту; ip-адрес, с которого пользователь обращается к сайту;
                    сведения о взаимодействии пользователя с web-интерфейсом и службами сайта) в целях аутентификации
                    пользователя на сайте, проведения ретаргетинга, статистических исследований и обзоров. Если вы не
                    хотите, чтобы ваши данные обрабатывались, покиньте сайт.
                </div>
            </div>
            {!isAgree ? (
                <div className='coockieConfirm'>
                    <div className='containerConfirm'>
                        <div className='confirmText'>
                            <span>
                                Мы используем файлы cookie для вашего удобства. Продолжая пользоваться сайтом, вы
                                соглашаетесь с политикой использования cookie.
                            </span>
                            <span className='confirmMoreBtn' onClick={onOpenConfirm}>
                                Подробнее
                            </span>
                        </div>
                        <div className='confirmBtn' onClick={onConfirm}>
                            Я согласен
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    )
}
export default Confirm
