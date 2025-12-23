import { CloudPaymentsWidget, TOnCompleteParameters } from '~/types/cloudpayments'

export type TPayParameters = {
    restaurantId: number
    amount: number
    autoClose?: number
    clientName: string
    clientPhone: string
    description: string
    orderId: string
    onSuccess: () => void
}

export function pay(widget: CloudPaymentsWidget) {
    return (params: TPayParameters) => {
        return new Promise<TOnCompleteParameters>((resolve, reject) => {
            let key = null
            if (process.env.NEXT_PUBLIC_CLOUDPAYMENTS_SITE_ID) {
                const keys = JSON.parse(process.env.NEXT_PUBLIC_CLOUDPAYMENTS_SITE_ID)
                if (keys[params.restaurantId]) {
                    key = keys[params.restaurantId].key
                }
            }

            widget.pay('charge', {
                publicId: key,
                amount: params.amount,
                autoClose: params.autoClose,
                currency: 'RUB',
                description: params.description,
                accountId: params.clientPhone,
                invoiceId: params.orderId,
                skin: 'modern',
                retryPayment: true,
                data: {
                    name: params.clientName,
                    phone: params.clientPhone,
                    orderId: params.orderId,
                },
            }, {
                onFail: (reason) => {
                    reject('Не удалось оплатить, попробуйте еще раз. Причина: ' + reason)
                },
                onComplete: result => {
                    resolve(result)
                },
                onSuccess: () => params.onSuccess(),
            })
        })
    }
}
