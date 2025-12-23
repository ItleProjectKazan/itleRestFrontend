import { memo } from 'react'
import Link from 'next/link'
import { useStore } from '~/hooks'
import { getMenuLink } from '~/constants/pageLinks'

const AboutHalal = () => {
    const { bookingModal, orderParams } = useStore()
    const doBooking = () => {
        bookingModal.open()
    }
    return (
        <section className='section-page about-halal'>
            <div className='container'>
                <div className='about-halal__inner d-flex items-center'>
                    <div className='about-halal__image'>
                        <img
                            src='/images/about-halal-image.png'
                            alt='about halal image'
                            className='about-halal__image-img'
                        />
                    </div>

                    <div className='about-halal__info'>
                        <h2 className='about-halal__info-title section-title'>
                            <span>
                                HALAL <br />
                                еда
                            </span>{' '}
                            – это осознанный выбор
                        </h2>

                        <div className='about-halal__info-description'>
                            <p>
                                Дозволенная пища – это прежде всего залог чистоты и пользы для вашего здоровья, гарантия
                                соблюдения сроков хранения и правил приготовления продуктов, отсутствие вредных и
                                опасных веществ в составе.
                            </p>
                            <p>
                                Халяльные продукты могут употребляться в пищу людьми любой национальности и
                                вероисповедания. Все, кто заботится о своем здоровье могут использовать продукты,
                                сертифицированные Халяль.
                            </p>
                            <img
                                src='/images/about-halal-image-mob.png'
                                alt='about halal image'
                                className='about-halal__info-image'
                            />
                            <p>
                                Основная задача ИTLE — кормить людей благой и дозволенной пищей. Мы облегчаем жизнь,
                                делая потребление халяльной еды более доступным и удобным в любое время благодаря
                                различным форматам, онлайн- и офлайн-сетям.
                            </p>
                        </div>

                        <div className='about-halal__info-buttons d-flex flex-wrap'>
                            <Link
                                href={getMenuLink(orderParams.restaurantId)}
                                className='about-halal__info-btn about-halal__info-btn--primary d-flex items-center justify-center transition'
                            >
                                Заказать доставку
                            </Link>
                            <div
                                className='about-halal__info-btn about-halal__info-btn--border d-flex items-center justify-center transition'
                                onClick={doBooking}
                            >
                                Забронировать стол
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default memo(AboutHalal)
