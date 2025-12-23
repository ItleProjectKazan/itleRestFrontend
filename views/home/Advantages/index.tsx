const Advantages = () => (
    <section className='section-page advantages'>
        <div className='container'>
            <div className='advantages__inner d-flex flex-wrap items-center'>
                <div className='advantages__image noselect'>
                    <img src='/images/advantages-image.png' className='advantages__image-img' alt='advantages image' />
                </div>

                <div className='advantages__info d-flex flex-column noselect'>
                    <h2 className='advantages__info-title'>
                        <span>HALAL 360°,</span>на всех этапах
                    </h2>

                    <span className='advantages__info-text'>
                        В своей деятельности мы придерживаемся принципа Halal 360° – принцип, сформированный на честности, справедливости и общечеловеческих ценностях.
                    </span>

                    <img
                        src='/images/advantages-image-mobile1.png'
                        alt='advantages image'
                        className='advantages__info-image'
                    />

                    <span className='advantages__info-text'>Кормим более</span>

                    <h3 className='advantages__info-subtitle'>20 000 гостей <br/><span>в месяц</span></h3>

                    <span className='advantages__info-text'>Готовим более</span>

                    <h3 className='advantages__info-subtitle'>
                        5 000 <span>стейков</span>
                        <br />и авторских <span>бургеров в месяц</span>
                    </h3>

                    <img
                        src='/images/advantages-image-mobile2.png'
                        alt='advantages image'
                        className='advantages__info-image'
                    />
                </div>

                <div className='advantages-list d-flex flex-wrap'>
                    <div className='advantages-list__item d-flex'>
                        <div className='advantages-list__item-inner d-flex flex-column'>
                            <span className='advantages-list__item-icon icon-bbq'></span>
                            <span className='advantages-list__item-text'>
                                Готовим на угольном гриле
                            </span>
                        </div>
                    </div>

                    <div className='advantages-list__item d-flex'>
                        <div className='advantages-list__item-inner d-flex flex-column'>
                            <span className='advantages-list__item-icon icon-bear'></span>
                            <span className='advantages-list__item-text'>
                                Детская комната <br/>и меню
                            </span>
                        </div>
                    </div>

                    {/*<div className='advantages-list__item d-flex'>
                        <div className='advantages-list__item-inner d-flex flex-column'>
                            <span className='advantages-list__item-icon icon-meat-grinder'></span>
                            <span className='advantages-list__item-text'>
                                Собственный мясной <br />
                                цех
                            </span>
                        </div>
                    </div>*/}

                    <div className='advantages-list__item d-flex'>
                        <div className='advantages-list__item-inner d-flex flex-column'>
                            <span className='advantages-list__item-icon icon-medal'></span>
                            <span className='advantages-list__item-text'>
                                Сертификация <br />
                                ISO 22000, HACCP, HALAL
                            </span>
                        </div>
                    </div>

                    {/*<div className='advantages-list__item d-flex'>
                        <div className='advantages-list__item-inner d-flex flex-column'>
                            <span className='advantages-list__item-icon icon-diversity'></span>
                            <span className='advantages-list__item-text'>
                                Более 500 сотрудников <br />в группе компаний
                            </span>
                        </div>
                    </div>*/}

                    <div className='advantages-list__item d-flex'>
                        <div className='advantages-list__item-inner d-flex flex-column'>
                            <span className='advantages-list__item-icon icon-steak'></span>
                            <span className='advantages-list__item-text'>
                                Камера вызревания <br />
                                стейков
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
)

export default Advantages
