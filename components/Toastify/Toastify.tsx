import React, { FC } from 'react'
import { toast, ToastContainer, ToastContainerProps } from 'react-toastify'

const Toastify: FC<ToastContainerProps> = ({
    position= toast.POSITION.TOP_RIGHT,
}) => {
    return (
        <ToastContainer
            autoClose={ 5000 }
            closeOnClick
            draggable
            hideProgressBar={ false }
            newestOnTop={ false }
            pauseOnHover
            position={ position }
            rtl={ false }
        />
    )
}

export { Toastify }
