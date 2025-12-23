import { TFormDataError, TFormData } from './index'

export const validate = (formData: TFormData): TFormDataError => {
    let err: TFormDataError = {}
    if (!formData?.name || (formData.name && formData.name.length < 2)) {
        err = { name: 'Не корректно имя' }
    }
    //eslint-disable-next-line
    const phonePattern = /\+7 \s?[\(]{0,1}[0-9]{3}[\)]{0,1} \s?\d{3} [-] {0,1}\d{2} [-] {0,1}\d{2}/i
    const phonePattern1 = /\+7[0-9]{0,10}/i
    const phoneIsValid =
        phonePattern.test(formData?.phone_number || '') || phonePattern1.test(formData?.phone_number || '')

    if (!phoneIsValid) {
        err = { ...err, phone_number: 'Не корректный номер телефона' }
    }
    if (!(formData?.person_count && formData.person_count > 0)) {
        err = { ...err, person_count: 'Не корректно количество персон' }
    }
    if (!formData?.restaurant) {
        err = { ...err, restaurant: 'Не указан ресторан' }
    }
    if (!formData?.person_count || (formData.person_count && formData.person_count < 1)) {
        err = { ...err, person_count: 'Не указано количество персон' }
    }
    if (!formData?.order_time) {
        err = { ...err, order_time: 'Не указано время' }
    }
    if (!formData?.order_date) {
        err = { ...err, order_date: 'Не указана дата' }
    }

    return err
}
