export const loadWidget = () => {
    return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script')

        script.src = 'https://widget.cloudpayments.ru/bundles/cloudpayments.js'
        script.async = true

        script.onload = () => {
            if (window.cp?.CloudPayments !== undefined) {
                resolve()
            } else {
                reject('Error loading CloudPayments widget.')
            }
        }

        script.onerror = (error: any) => {
            reject(error)
        }

        document.body.appendChild(script)
    })
}
