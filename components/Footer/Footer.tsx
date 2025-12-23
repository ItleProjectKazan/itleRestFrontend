import React, { FC } from 'react'
import Link from 'next/link'
import { findLocalityByRestaurant, normalizePhone } from '~/helpers'
import { useCurrentLocality, useStore } from '~/hooks'
import { PageLinks, getMenuLink } from '~/constants/pageLinks'
import { getRestaurantOpeningTime } from '~/helpers/getRestaurantOpeningTime'
import { getRestaurantClosingTime } from '~/helpers/getRestaurantClosingTime'
import Confirm from './Confirm'
import { getPagePreview } from '~/services/queries'
import { TPagePreview } from '~/types/pages/page'
import { TCategoryPageMenuItem } from '~/types/pages/category'
import { useQuery } from 'react-query'
import { QUERY_KEYS } from '~/views/home/constants'

type Props = {
    className?: string
}

const Footer: FC<Props> = () => {
    const { localities, orderParams, bookingModal } = useStore()

    const currentLocalityFromHook = useCurrentLocality()
    const restaurantId = orderParams !== null ? orderParams.restaurantId : null
    const locality = restaurantId ? findLocalityByRestaurant(localities, restaurantId) : currentLocalityFromHook

    const doBooking = (restaurantId: number) => () => {
        bookingModal.open(restaurantId)
    }

    const categories = useQuery<TPagePreview<TCategoryPageMenuItem[]>, TCategoryPageMenuItem[]>(
        QUERY_KEYS.PAGES_PREVIEW('category'),
        () => getPagePreview<TPagePreview<TCategoryPageMenuItem[]>, TCategoryPageMenuItem[]>('category'),
        {
            refetchOnWindowFocus: false,
        },
    ).data

    return (
        <>
            <footer className='footer'>
                <div className='container'>
                    <div className='footer__inner d-flex flex-wrap'>
                        <div className='footer__columns d-flex'>
                            <div className='footer__column d-flex flex-column'>
                                <h2 className='footer__title'>
                                    <span>приходите</span>
                                    <br />в наши
                                    <br />
                                    стейк-кафе
                                </h2>

                                <div className='footer__menus justify-between'>
                                    <div className='footer__menus-column d-flex flex-column items-start'>
                                        <h3 className='footer__menus-title'>итLе</h3>
                                        <nav className='footer__menu d-flex flex-column items-starts'>
                                            <Link
                                                className='footer__menu-item transition'
                                                as={PageLinks.ABOUT}
                                                href={PageLinks.ABOUT}
                                            >
                                                О проекте
                                            </Link>
                                            <Link
                                                className='footer__menu-item transition'
                                                as={PageLinks.INTERIOR}
                                                href={PageLinks.INTERIOR}
                                            >
                                                Локации
                                            </Link>
                                            {/*<Link href={PageLinks.OUR_CAFES} className='footer__menu-item transition'>
                                                Наши стейк-кафе
                                            </Link>*/}
                                            {/* <Link
                                                className='footer__menu-item transition'
                                                as=''
                                                href='https://yandex.ru/maps/org/itle_bistro/31153346453/reviews/?ll=49.214976%2C55.745443&z=13'
                                                rel='noreferrer'
                                                target='_blank'
                                            >
                                                Отзывы
                                            </Link> */}
                                            <Link
                                                className='footer__menu-item transition'
                                                as='/contacts'
                                                href={PageLinks.CONTACTS}
                                            >
                                                Контакты
                                            </Link>
                                        </nav>
                                    </div>
                                    {categories?.content_pages?.length && (
                                        <div className='footer__menus-column d-flex flex-column items-start'>
                                            <h3 className='footer__menus-title'>Меню</h3>
                                            <nav className='footer__menu menu d-flex flex-column items-starts'>
                                                {categories?.content_pages?.map(({ code, name }) => (
                                                    <Link
                                                        key={code}
                                                        as={`/category/${code}`}
                                                        href={`/category/${code}`}
                                                        className='footer__menu-item transition'
                                                    >
                                                        {name}
                                                    </Link>
                                                ))}

                                                {/* <Link
                                                as='/promos'
                                                href={PageLinks.PROMOS}
                                                className='footer__menu-item transition'
                                            >
                                                Акции
                                            </Link> */}
                                                {/* <Link
                                                href={getMenuLink(orderParams.restaurantId)}
                                                className='footer__menu-item transition'
                                            >
                                                Блюда
                                            </Link>
                                            <Link
                                                href={getMenuLink(orderParams.restaurantId) + '#tatar_menu'}
                                                className='footer__menu-item transition'
                                            >
                                                Татарское
                                            </Link>
                                            <Link
                                                href={getMenuLink(orderParams.restaurantId) + '#child'}
                                                className='footer__menu-item transition'
                                            >
                                                Детское меню
                                            </Link>
                                            <Link
                                                href={getMenuLink(orderParams.restaurantId) + '#mangal'}
                                                className='footer__menu-item transition'
                                            >
                                                Гриль
                                            </Link> */}
                                            </nav>
                                        </div>
                                    )}

                                    <div className='footer__menus-column d-flex flex-column items-start'>
                                        <h3 className='footer__menus-title'>Еще</h3>
                                        <nav className='footer__menu d-flex flex-column items-starts'>
                                            {/* <Link href={PageLinks.PROMOS} className='footer__menu-item transition'>
                                                Бонусы
                                            </Link> */}
                                            <Link href={PageLinks.NEWS} className='footer__menu-item transition'>
                                                События
                                            </Link>
                                            <Link href={PageLinks.VACANCY} className='footer__menu-item transition'>
                                                Вакансии
                                            </Link>
                                            <Link className='footer__menu-item transition' href={PageLinks.DELIVERY}>
                                                Доставка
                                            </Link>
                                        </nav>
                                    </div>
                                </div>

                                {/* <div className='footer__socials d-flex'>
                                    <a
                                        aria-label='whatsapp'
                                        href='https://wa.me/+79172874647'
                                        className='footer__socials-item'
                                        rel='noreferrer'
                                        target='_blank'
                                    >
                                        <span className='icon-whatsapp-color'>
                                            <span className='path1'></span>
                                            <span className='path2'></span>
                                            <span className='path3'></span>
                                        </span>
                                    </a>
                                    <a
                                        aria-label='telegramm'
                                        className='footer__socials-item'
                                        href='https://t.me/s/ITLE_pro'
                                        rel='noreferrer'
                                        target='_blank'
                                    >
                                        <span className='icon-telegram-color'>
                                            <span className='path1'></span>
                                            <span className='path2'></span>
                                        </span>
                                    </a>
                                    <a
                                        aria-label='vk'
                                        className='footer__socials-item'
                                        href='https://vk.com/itle_pro'
                                        rel='noreferrer'
                                        target='_blank'
                                    >
                                        <span className='icon-vk-color'>
                                            <span className='path1'></span>
                                            <span className='path2'></span>
                                        </span>
                                    </a>
                                    <a
                                        aria-label='youtube'
                                        className='footer__socials-item'
                                        href='https://www.youtube.com/channel/UCUqnKxOrpUlEO47R9s4Rerg'
                                        rel='noreferrer'
                                        target='_blank'
                                    >
                                        <span className='icon-youtube-color'>
                                            <span className='path1'></span>
                                            <span className='path2'></span>
                                        </span>
                                    </a>
                                </div> */}
                            </div>
                            {!!locality && (
                                <div className='footer__column d-flex flex-column'>
                                    <h2 className='footer__title'>
                                        <span>приходите</span>
                                        <br />в наши
                                        <br />
                                        стейк-кафе
                                    </h2>

                                    {locality.restaurants.map((restaurant, index) => (
                                        <div key={restaurant.id} className='footer__restaurant d-flex items-center'>
                                            <img
                                                src={`/images/rest_${index + 1}.png`}
                                                className='footer__restaurant-image'
                                                alt='restaurant image'
                                            />

                                            <div className='footer__restaurant-info d-flex flex-column items-start'>
                                                <a
                                                    href={`tel:${normalizePhone(restaurant.phone_number || '')}`}
                                                    className='footer__restaurant-phone'
                                                >
                                                    {restaurant.phone_number}
                                                </a>
                                                <div className='footer__restaurant-address'>{restaurant.address}</div>
                                                <div className='footer__restaurant-schedule'>
                                                    Сегодня с {getRestaurantOpeningTime(locality, restaurant.id)} до{' '}
                                                    {getRestaurantClosingTime(locality, restaurant.id)}
                                                </div>
                                                <div className='footer__restaurant-buttons d-flex '>
                                                    <button
                                                        className='footer__restaurant-btn d-flex items-center transition'
                                                        onClick={doBooking(restaurant.id)}
                                                    >
                                                        Забронировать стол
                                                    </button>
                                                    <Link
                                                        href={getMenuLink(orderParams.restaurantId)}
                                                        className='footer__restaurant-btn d-flex items-center transition'
                                                    >
                                                        Доставка
                                                        <span className='icon-cart'></span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className='footer__links d-flex justify-start'>
                            <a
                                href='https://itle-bistro.ru'
                                className='footer__link d-flex items-center'
                                target='_blank'
                                rel='noreferrer'
                            >
                                <svg
                                    className='footer__link-icon'
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='68'
                                    height='68'
                                    viewBox='0 0 68 68'
                                    fill='none'
                                >
                                    <g clipPath='url(#clip0_685_2030)'>
                                        <path
                                            d='M48.8342 19.1438C41.4146 11.7128 33.9837 6.29822 33.9837 6.29822C33.9837 6.29822 26.564 11.7128 19.1331 19.1438C11.7135 26.5747 6.29883 34.0057 6.29883 34.0057C6.29883 34.0057 11.7135 41.4366 19.1331 48.8676C26.5527 56.2985 33.9837 61.7132 33.9837 61.7132C33.9837 61.7132 41.4033 56.2985 48.8342 48.8676C56.2538 41.4366 61.6685 34.0057 61.6685 34.0057C61.6685 34.0057 56.2652 26.5747 48.8342 19.1438Z'
                                            fill='white'
                                        />
                                        <path
                                            d='M52.2092 15.7681C43.1018 6.64934 33.983 0 33.983 0C33.983 0 24.8642 6.64934 15.7568 15.7681C6.63801 24.8869 0 34.0057 0 34.0057C0 34.0057 6.63801 43.1244 15.7568 52.2432C24.8756 61.362 33.983 68.0113 33.983 68.0113C33.983 68.0113 43.1018 61.3733 52.2092 52.2432C61.328 43.1244 67.966 34.0057 67.966 34.0057C67.966 34.0057 61.328 24.8869 52.2092 15.7681ZM34.9459 35.2404C34.9459 35.2404 32.9862 35.5462 30.3808 35.6708V46.8739H26.0763V35.6708C23.4369 35.5462 21.4433 35.2291 21.4433 35.2291C21.4433 35.2291 20.9562 32.1026 20.9449 28.4778C20.9449 24.8529 21.432 21.7265 21.432 21.7265C21.432 21.7265 22.4628 21.5905 23.8334 21.4546V26.7446H26.1329V21.296C26.8466 21.262 27.3903 21.2394 28.1719 21.2394C28.9649 21.2394 29.6445 21.262 30.3582 21.296V26.7446H32.6577V21.4546C34.0283 21.5905 34.9119 21.7265 34.9119 21.7265C34.9119 21.7265 35.4103 24.8529 35.4103 28.4778C35.4103 32.1026 34.9232 35.2291 34.9232 35.2291M42.7959 33.9604C42.7959 33.9604 42.694 34.0623 42.6373 34.1076V46.8399H38.3328V21.1827C38.3328 21.1827 38.4348 21.2394 38.4574 21.262C38.718 21.4546 40.7683 22.9838 42.8412 25.0681C45.0501 27.2997 46.6587 29.5312 46.6587 29.5312C46.6587 29.5312 45.0275 31.7515 42.7959 33.9604Z'
                                            fill='#FA7305'
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id='clip0_685_2030'>
                                            <rect width='67.966' height='68' fill='white' />
                                        </clipPath>
                                    </defs>
                                </svg>

                                <span className='footer__link-info d-flex flex-column'>
                                    <span className='footer__link-title transition'>ИTLe BISTRO</span>
                                    <span className='footer__link-text'>Семейное бистро</span>
                                </span>
                            </a>

                            <a
                                href='https://itle-kitchen.ru'
                                className='footer__link d-flex items-center'
                                target='_blank'
                                rel='noreferrer'
                            >
                                <svg
                                    className='footer__link-icon'
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='68'
                                    height='68'
                                    viewBox='0 0 68 68'
                                    fill='none'
                                >
                                    <g clipPath='url(#clip0_685_2036)'>
                                        <path
                                            d='M48.836 19.1307C41.4126 11.696 33.978 6.27869 33.978 6.27869C33.978 6.27869 26.5546 11.696 19.12 19.1307C11.6966 26.5654 6.2793 34 6.2793 34C6.2793 34 11.6966 41.4347 19.12 48.8694C26.5433 56.304 33.978 61.7214 33.978 61.7214C33.978 61.7214 41.4013 56.304 48.836 48.8694C56.2593 41.4347 61.6766 34 61.6766 34C61.6766 34 56.2706 26.5654 48.836 19.1307Z'
                                            fill='white'
                                        />
                                        <path
                                            d='M52.2127 15.7647C43.0893 6.64133 33.9773 0 33.9773 0C33.9773 0 24.8653 6.64133 15.7533 15.7647C6.64133 24.8767 0 34 0 34C0 34 6.64133 43.1233 15.7533 52.2353C24.8653 61.3587 33.9773 68 33.9773 68C33.9773 68 43.0893 61.3587 52.2013 52.2353C61.3133 43.112 67.9547 34 67.9547 34C67.9547 34 61.3133 24.8767 52.2013 15.7647M45.2653 39.7573C45.0387 43.3387 44.642 45.9113 44.642 45.9113C44.642 45.9113 39.6893 46.6933 33.9547 46.682C28.22 46.682 23.2673 45.9 23.2673 45.9C23.2673 45.9 22.8707 43.3613 22.644 39.814C19.3913 38.8507 16.966 35.904 16.83 32.334C16.66 27.846 20.1507 24.072 24.6387 23.902C25.3527 23.8793 26.044 23.936 26.7013 24.0833C27.9933 21.5333 30.5887 19.7427 33.6487 19.618C36.9127 19.4933 39.7913 21.3067 41.1853 24.0267C41.6613 23.9247 42.1487 23.8567 42.6473 23.834C47.1353 23.664 50.9093 27.1547 51.0793 31.6427C51.2267 35.428 48.756 38.7147 45.2767 39.746'
                                            fill='#3AAA35'
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id='clip0_685_2036'>
                                            <rect width='67.966' height='68' fill='white' />
                                        </clipPath>
                                    </defs>
                                </svg>

                                <span className='footer__link-info d-flex flex-column'>
                                    <span className='footer__link-title transition'>ИTLe Kitchen</span>
                                    <span className='footer__link-text'>Фабрика готовой еды</span>
                                </span>
                            </a>

                            <a
                                href={getMenuLink(orderParams.restaurantId)}
                                className='footer__link d-flex items-center'
                                target='_blank'
                                rel='noreferrer'
                            >
                                <svg
                                    className='footer__link-icon'
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='68'
                                    height='68'
                                    viewBox='0 0 68 68'
                                    fill='none'
                                >
                                    <g clipPath='url(#clip0_685_2042)'>
                                        <path
                                            d='M48.836 19.1307C41.4126 11.696 33.978 6.27869 33.978 6.27869C33.978 6.27869 26.5546 11.696 19.12 19.1307C11.6966 26.5654 6.2793 34 6.2793 34C6.2793 34 11.6966 41.4347 19.12 48.8694C26.5433 56.304 33.978 61.7214 33.978 61.7214C33.978 61.7214 41.4013 56.304 48.836 48.8694C56.2593 41.4347 61.6766 34 61.6766 34C61.6766 34 56.2706 26.5654 48.836 19.1307Z'
                                            fill='white'
                                        />
                                        <path
                                            d='M52.2127 15.7647C43.0893 6.64133 33.9773 0 33.9773 0C33.9773 0 24.8653 6.64133 15.7533 15.7647C6.64133 24.8767 0 34 0 34C0 34 6.64133 43.1233 15.7533 52.2353C24.8653 61.3587 33.9773 68 33.9773 68C33.9773 68 43.0893 61.3587 52.2013 52.2353C61.3133 43.112 67.9547 34 67.9547 34C67.9547 34 61.3133 24.8767 52.2013 15.7647M42.3867 42.4773C38.1253 46.75 33.8527 49.8553 33.8527 49.8553V45.5147C28.084 45.5147 23.052 44.7327 23.052 44.7327C23.052 44.7327 22.27 39.7347 22.27 33.9433C22.27 28.1633 23.0633 23.154 23.0633 23.154C23.0633 23.154 28.0613 22.372 33.8527 22.3607V18.02C33.8527 18.02 38.114 21.1253 42.3867 25.398C46.648 29.6707 49.7647 33.932 49.7647 33.932C49.7647 33.932 46.6593 38.2047 42.398 42.466'
                                            fill='#3598DB'
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id='clip0_685_2042'>
                                            <rect width='67.966' height='68' fill='white' />
                                        </clipPath>
                                    </defs>
                                </svg>

                                <span className='footer__link-info d-flex flex-column'>
                                    <span className='footer__link-title transition'>ИTLe доставка</span>
                                    <span className='footer__link-text'>Быстрая доставка Halal</span>
                                </span>
                            </a>
                        </div>

                        <div className='footer__bottom d-flex flex-wrap'>
                            <span className='footer__bottom-item'>© Стейк-кафе ИТLE - {new Date().getFullYear()}</span>
                            <a
                                href={PageLinks.INFO_LEGAL}
                                className='footer__bottom-item mb-12 footer__bottom-item--link transition'
                                target='_blank'
                                rel='noreferrer'
                            >
                                Политика конфиденциальности
                            </a>
                            <div className='d-flex footer__bottom-item flex-wrap'>
                                <div className='footer__bottom-item'>ИП Салаев Заур Шайахметович</div>
                                <div className='footer__bottom-item'>ИНН 161603370886</div>
                                <div className='footer__bottom-item'>ОГРН 322169000178331</div>
                                <div className='footer__bottom-item'>
                                    Адрес: 422701, Татарстан Респ, р-н Высокогорский, с Высокая Гора, ул. Молодежная
                                    2-я, д. 3К
                                </div>
                                <u>
                                    <a className='footer__bottom-item' href='tel:+78432023320'>
                                        +7 (843) 202-33-20
                                    </a>
                                </u>
                                <u>
                                    <a className='footer__bottom-item' href='mailto:buh1@itle.pro'>
                                        buh1@itle.pro
                                    </a>
                                </u>
                            </div>
                            {/* <a
                                href=''
                                className='footer__bottom-item footer__bottom-item--link transition'
                                target='_blank'
                                rel='noreferrer'
                            >
                                Карта сайта
                            </a>*/}
                        </div>
                    </div>
                </div>
                <Confirm />
            </footer>
        </>
    )
}

export { Footer }
