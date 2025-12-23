import { FC, ChangeEvent, useReducer, useState } from 'react'
import InputMask from 'react-input-mask'
import cn from 'classnames'
import { normalizePhone } from '~/helpers'
import { useStore } from '~/hooks'

interface TFacancyForm {
    vacancyId: number
}

type TFormData = {
    name: string
    phone_number: string
}

const VacancyForm: FC<TFacancyForm> = ({ vacancyId }: TFacancyForm) => {
    const [isRule, setIsRule] = useState<boolean>(false)
    const { user, textModal } = useStore()

    const [formData, setFormData] = useReducer(
        (state: TFormData, action: Partial<TFormData>) => ({ ...state, ...action }),
        {
            name: user?.name || '',
            phone_number: user?.phone_number || '',
        },
    )

    const [errors, setErrors] = useReducer((state: Partial<TFormData> | null, action: Partial<TFormData> | null) => {
        if (!action) return null
        return { ...state, ...action }
    }, {})

    const validate = () => {
        let error = null
        if (formData?.name?.trim().length < 2) {
            error = { name: 'Некорректное имя' }
        }

        if (formData.phone_number) {
            const phone = normalizePhone(formData.phone_number)
            if (phone.length !== 12) {
                error = { ...error, phone_number: 'Некорректный номер телефона' }
            }
        } else {
            error = { ...error, phone_number: 'Некорректный номер телефона' }
        }
        if (error) {
            setErrors(error)
        }
        return !error
    }
    const onChange = (name: string) => (e: ChangeEvent<HTMLInputElement>) => {
        setErrors(null)
        setFormData({ [name]: e.target.value })
    }

    const onSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        const isValid = validate()
        if (!isValid) return
        const response = await fetch(process.env.NEXT_PUBLIC_HR_API_URL + '/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                name: formData.name,
                phone: formData.phone_number,
                vacancy_id: vacancyId,
                email: 'no@no.no',
            }),
        })
        const responseJson = await response.json()

        if (responseJson?.data?.errors) {
            textModal.open('Ошибка', 'Попробуйте отправить заявку позднее')
        } else {
            textModal.open('Заявка отправлена', 'Ваша заявка успешно отправлена')
        }
    }

    const onChangeRule = () => {
        setIsRule(!isRule)
    }

    return (
        <form className='vacancy__form d-flex flex-wrap' action='' onSubmit={onSubmit}>
            <h3 className='vacancy__form-title'>Откликнуться</h3>
            <div className='vacancy__fields d-flex flex-wrap'>
                <div className={cn('vacancy__field  d-flex', { error: errors?.name })}>
                    <label className='vacancy__field-inner'>
                        <span className='vacancy__field-label'>Ваше имя</span>
                        <input
                            value={formData.name}
                            type='text'
                            className='vacancy__field-input transition'
                            placeholder='Имя'
                            onChange={onChange('name')}
                        />
                    </label>
                </div>
                <div className={cn('vacancy__field  d-flex', { error: errors?.phone_number })}>
                    <label className='vacancy__field-inner'>
                        <span className='vacancy__field-label'>Номер телефона</span>
                        <InputMask
                            id='phone_input_mask'
                            alwaysShowMask
                            className='vacancy__field-input transition'
                            formatChars={{
                                '*': '[0-9]',
                            }}
                            mask='+7 (***) *** - ** - **'
                            maskChar='_'
                            onChange={onChange('phone_number')}
                            value={formData?.phone_number}
                        />
                    </label>
                </div>
            </div>

            <div className='vacancy__form-bottom d-flex items-center'>
                <button disabled={!isRule} className='vacancy__form-btn d-flex items-center transition'>
                    Отправить
                </button>
                <label className='vacancy__form-policy d-flex noselect'>
                    <input type='checkbox' onChange={onChangeRule} />
                    <div className='policy-block d-flex items-center'>
                        <div className='policy-block__check circle-center transition'>
                            <span className='icon-check'></span>
                        </div>
                        <div className='policy-block__text'>
                            Я соглашаюсь с условиями{' '}
                            <a href='' className='transition'>
                                Пользовательского cоглашения
                            </a>
                        </div>
                    </div>
                </label>
            </div>
        </form>
    )
}
export default VacancyForm
