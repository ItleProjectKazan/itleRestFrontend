const HalalInfo = () => (
    <section className='section-page halal-info'>
        <div className='container'>
            <div className='halal-info__inner d-flex items-center'>
                <div className='halal-info__info'>
                    <h2 className='halal-info__info-title section-title'>
                        <span>Halal 360°</span> днк наших брендов
                    </h2>
                    <div className='halal-info__info-description'>
                        <p>
                            Принцип Halal 360° – это образ жизни и движущая сила компании. <br/>
                            В своей работе мы придерживаемся правил Всевышнего, правил дозволенности и разрешенности во всех процессах и на всех этапах.<br/>
                            В заведениях вы не встретите алкоголя, дыма кальянов, громкой музыки и нетрезвых компаний.<br/>
                            Во всех проектах ИТLE осуществляется шариатский контроль сырья, а для блюд используются только свежие и качественные продукты от надежных поставщиков.<br/>
                            В ИТLЕ соблюдается принцип справедливости по отношению ко всем участникам — и к сотрудникам, и к поставщикам, и к гостям, и к партнерам.<br/>
                            Насквозь, на 360° мы придерживаемся принципов Halal.
                        </p>
                    </div>
                </div>
                <div className='halal-info__image d-flex justify-center items-center'>
                    <img src='/images/halal-info-image.png' alt='about halal image' className='halal-info__image-img' />
                    <img
                        src='/images/halal-info-bg.svg'
                        alt='about halal background image'
                        className='halal-info__image-bg'
                    />
                </div>
            </div>
        </div>
    </section>
)
export default HalalInfo
