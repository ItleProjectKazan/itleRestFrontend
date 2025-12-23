import React, { useRef, useState } from 'react'
import { useStore } from '~/hooks'
import { useForm } from 'react-hook-form'
import { UserService } from '~/services/userService/userService'
import { InlineInput /*, InlineDatePicker*/ } from '~/components'
import { TUpdateUserRequest } from '~/services/userService/types'
// import cn from 'classnames'

const normalizePhone = (phoneNumber: string) => {
    return phoneNumber.replace(/[^0-9+]/g, '')
}

const denormalizePhone = (phoneNumber: string) => {
    const matches = phoneNumber.match(/^(\+7)(\d{3})(\d{3})(\d{2})(\d{2})$/)
    const denormalizedPhone = matches
        ? '+7 ' + '(' + matches[2] + ')' + ' ' + matches[3] + ' - ' + matches[4] + ' - ' + matches[5]
        : ''

    return denormalizedPhone
}

const ProfileEdit = () => {
    const store = useStore()
    const { user } = useStore()
    const [saved, setSaved] = useState(0)
    // const [savingBirthday, setSavingBirthday] = useState(false)
    const [editingNow, setEditingNow] = useState(false)
    const [saveError, setSaveError] = useState('')

    // const [selectedDate, setSelectedDate] = useState(user?.birthday ? new Date(user.birthday) : null)

    const {
        formState: { errors: formErrors },
        getFieldState,
        getValues,
        register: registerField,
        trigger: triggerValidation,
    } = useForm({
        defaultValues: {
            name: user?.name ?? '',
            email: user?.email ?? '',
            phone_number: user?.phone_number ? denormalizePhone(user?.phone_number) : '',
        },
    })

    const formData = getValues()
    const fields: Record<keyof typeof formData, any> = {
        name: registerField('name', {
            pattern: /.{1,32}/,
            required: true,
        }),
        email: registerField('email', {
            pattern:
                // eslint-disable-next-line
                /^[a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i,
        }),
        phone_number: registerField('phone_number', {
            pattern: /^\+7\s\(\d\d\d\)\s\d\d\d\s-\s\d\d\s-\s\d\d$/g,
            required: true,
        }),
    }
    const inputRefs = useRef<Record<keyof typeof formData, HTMLElement | null>>({
        email: null,
        name: null,
        phone_number: null,
    })

    const validateForms = async () => {
        // eslint-disable-next-line
        return new Promise(async (resolve) => {
            await triggerValidation()

            const invalidFieldRefs: HTMLElement[] = [
                ...(Object.keys(inputRefs.current)
                    .map((nameStr: any) => {
                        const name = nameStr as keyof typeof formData
                        return getFieldState(name).invalid ? inputRefs.current[name] : null
                    })
                    .filter((el) => el !== null) as HTMLElement[]),
            ]

            resolve(invalidFieldRefs.length === 0)
        })
    }

    const saveData = async () => {
        setSaveError('')
        const formData = getValues()
        const isValid = await validateForms()

        if (!isValid) {
            return
        }
        // setSavingBirthday(true)
        try {
            await UserService.updateProfile({
                name: formData.name,
                email: formData.email,
                phone_number: normalizePhone(formData.phone_number),
                // birthday: selectedDate?.toDateString() || '',
            } as TUpdateUserRequest)

            setSaved(+new Date())
            store.fetchUser()
        } catch (error: any) {
            setSaveError('Ошибка при записи')
            setSaved(+new Date())
        }
        // finally {
        // setSavingBirthday(false)
        // }
    }

    // const onChangeDatePicker = (d: Date | null) => {
    //     setSelectedDate(d)
    // }

    return (
        <div className='edit-profile'>
            <div className='edit-profile__field'>
                <InlineInput
                    {...fields.name}
                    ref={(ref) => {
                        inputRefs.current.name = ref
                        fields.name.ref(ref)
                    }}
                    dataSaved={saved}
                    defaultValue={formData.name}
                    editable
                    editingNow={editingNow}
                    error={saveError.length ? true : formErrors.name !== undefined}
                    errorMessage={!saveError.length ? 'Некорректное имя' : saveError}
                    label='Ваше имя'
                    setEditingNow={setEditingNow}
                    submitData={saveData}
                />
            </div>
            <div className='edit-profile__field'>
                <InlineInput
                    {...fields.phone_number}
                    ref={(ref) => {
                        inputRefs.current.phone_number = ref
                        fields.phone_number.ref(ref)
                    }}
                    dataSaved={saved}
                    defaultValue={formData.phone_number}
                    editable={false}
                    editingNow={editingNow}
                    error={saveError.length ? true : formErrors.phone_number !== undefined}
                    errorMessage={!saveError.length ? 'Некорректный телефон' : saveError}
                    label='Телефон'
                    setEditingNow={setEditingNow}
                    submitData={saveData}
                />
            </div>
            {/* <div className='edit-profile__field'>
                <InlineDatePicker
                    submitData={saveData}
                    onChange={onChangeDatePicker}
                    date={selectedDate}
                    editable={true}
                    openToDate={selectedDate || new Date(2000, 0)}
                    label='Дата рождения'
                    saving={savingBirthday}
                />
            </div> */}
            <div className='edit-profile__field'>
                <InlineInput
                    {...fields.email}
                    ref={(ref) => {
                        inputRefs.current.email = ref
                        fields.email.ref(ref)
                    }}
                    dataSaved={saved}
                    defaultValue={formData.email}
                    editable
                    editingNow={editingNow}
                    error={saveError.length ? true : formErrors.email !== undefined}
                    errorMessage={!saveError.length ? 'Некорректный адрес' : saveError}
                    label='E-mail'
                    setEditingNow={setEditingNow}
                    submitData={saveData}
                />
            </div>
        </div>
    )
}

ProfileEdit.displayName = 'ProfileEdit'

export default ProfileEdit
