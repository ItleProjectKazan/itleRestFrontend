import { useEffect, useMemo, useState } from 'react'

import { loadWidget } from './loadWidget'
import { pay } from './pay'

import { CloudPaymentsWidget } from '~/types/cloudpayments'

/**
 * Загрузка библиотеки виджета CloudPayments только один раз при жизни SPA.
 * Хук возвращает promise с объектом CloudPayments
 *
 * Документация по виджету: https://developers.cloudpayments.ru/#ustanovka-vidzheta
 */
export const useCloudPaymentsWidget = (...args: ConstructorParameters<CloudPaymentsWidget>) => {
    const [widget, setWidget] = useState<CloudPaymentsWidget | null>(null)

    useEffect(() => {
        if (widget !== null) {
            return
        }

        loadWidget().then(() => {
            const widgetClass = window.cp?.CloudPayments

            if (widgetClass !== undefined) {
                setWidget(new widgetClass(...args))
            }
        })
    }, [args, widget])

    return useMemo(() => {
        if (widget === null) {
            return null
        }

        return {
            pay: pay(widget),
        }
    }, [widget])
}
