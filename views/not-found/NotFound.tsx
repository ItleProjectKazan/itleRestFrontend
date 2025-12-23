import React from 'react'
import type { NextPage } from 'next'
import { Layout } from '~/components'

const NotFound: NextPage = () => {
    const title = '404 - Страница не найдена'
    return (
        <Layout description={title} recommendedProducts={[]} title={title}>
            <div className='container'>
                <div className='error-page'>
                    <h1 className='error-page__title'>
                        Страница, которую Вы ищете, <br />
                        <span>не может быть найдена</span>
                    </h1>

                    <div className='error-page__info d-flex items-end'>
                        <div className='error-page__info-column d-flex flex-column items-start'>
                            <p className='error-page__info-text'>
                                Возможно, вы перешли по ссылке, в которой была допущена ошибка, или ресурс был удален.
                                Попробуйте перейти на главную страницу
                            </p>

                            <a href='/' className='error-page__info-btn d-flex items-center transition'>
                                Перейти на главную
                            </a>
                        </div>

                        <img alt='error page image' src='/images/404.svg' className='error-page__info-image' />
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default NotFound
