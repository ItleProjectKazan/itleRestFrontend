import { ChangeEvent, FC, memo, useCallback, useEffect, useReducer } from 'react'
import { Button, Typography, TextInput /*, DatePicker*/ } from '~/components'
import { useStore } from '~/hooks'
import styles from './LoginModal.module.scss'
import { UserService } from '~/services/userService/userService'
import { TUpdateUserRequest } from '~/services/userService/types'

interface IRegisterForm {
    onClose: () => void
}

type TFormData = {
    name?: string | null
    email?: string | null
    birthday?: Date | null
}

const RegisterForm: FC<IRegisterForm> = ({ onClose }) => {
    const store = useStore()
    const { user } = useStore()
    const [formData, setFormData] = useReducer((state: TFormData, action: TFormData) => ({ ...state, ...action }), {})
    const [errors, setErrors] = useReducer((state: TFormData | null, action: TFormData | null) => {
        if (!action) return null
        return { ...state, ...action }
    }, {})

    useEffect(() => {
        setErrors(null)
    }, [formData])

    useEffect(() => {
        setFormData({
            name: user?.name,
            email: user?.email,
            birthday: user?.birthday ? new Date(user.birthday) : new Date(Date.UTC(2000, 0, 1, 3, 0, 0)),
        })
    }, [])

    const validate = () => {
        let error = null
        if (!formData?.name?.trim()) {
            error = { name: 'Некорректное имя' }
        }
        const emailPattern =
            /^[a-zA-Z0-9][-_.+!#$%&'*/=?^`{|]{0,1}([a-zA-Z0-9][-_.+!#$%&'*/=?^`{|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-.]{0,1}([a-zA-Z][-.]{0,1})*[a-zA-Z0-9].[a-zA-Z0-9]{1,}([.-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i

        const emailIsValid = emailPattern.test(formData?.email || '')
        if (!emailIsValid) {
            error = { ...error, email: 'Некорректный адрес' }
        }
        if (error) {
            setErrors(error)
        }
        return Boolean(error)
    }

    const onRegisterUser = useCallback(
        async (e: ChangeEvent<HTMLFormElement>) => {
            e.preventDefault()
            if (!user) return
            const isNotValid = validate()
            if (isNotValid) {
                return
            }
            try {
                await UserService.updateProfile({
                    name: formData.name,
                    email: formData.email,
                    birthday: formData.birthday,
                    phone_number: user.phone_number,
                } as TUpdateUserRequest)

                store.fetchUser()
                onClose()
            } catch (error) {
                console.error(error)
            }
        },
        [errors, formData, user],
    )

    const onChange = (name: string) => (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ [name]: e.target.value })
    }
    // const onChangeDate = (name: string) => (date: Date | null) => {
    //     if (!date) return
    //     setFormData({ [name]: date.toDateString() })
    // }

    return (
        <>
            <Typography className={styles.title}>Регистрация</Typography>
            <Typography className={styles.description}>
                Заполните ваши данные, для регистрациии в личном кабинете.
            </Typography>
            <form onSubmit={onRegisterUser}>
                <TextInput
                    placeholder='Ваше имя'
                    showLabel
                    value={formData.name}
                    error={errors?.name}
                    onChange={onChange('name')}
                />
                {/* <DatePicker label='День рождения' onChange={onChangeDate('birthday')} date={formData.birthday} /> */}
                <TextInput
                    placeholder='Электронная почта'
                    showLabel
                    value={formData.email}
                    error={errors?.email}
                    onChange={onChange('email')}
                />
                <Button className={styles.button}>Сохрантить</Button>
            </form>
        </>
    )
}

export default memo(RegisterForm)
