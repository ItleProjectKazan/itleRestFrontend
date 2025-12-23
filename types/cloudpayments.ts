declare global {
    interface Window {
        cp?: {
            CloudPayments: CloudPaymentsWidget
        }
    }
}

export interface CloudPaymentsWidget {
    new(parameters?: {
        language?: string
    }): CloudPaymentsWidget

    pay(paymentType: 'auth' | 'charge', parameters: any, handlers?: {
        onSuccess?: (options: any) => void
        onFail?: (reason: string, options: any) => void
        onComplete?: (paymentResult: TOnCompleteParameters, options: any) => void
    }): void
}

export type TOnCompleteParameters = {
    code: string
    email: string
    message: string | null
    success: boolean
}
