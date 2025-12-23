import { memo, FC } from 'react'
import VacancyForm from './VacancyForm'

interface IVacancy {
    vacancyName: string
    address: string
    responsibilities: string
    salary: number
    experience_from: number
    experience_to: number
    employmentName: string
    scheduleName: string
    vacancyId: number
}

const Vacancy: FC<IVacancy> = ({
    vacancyId,
    vacancyName,
    address,
    responsibilities,
    salary,
    experience_from,
    experience_to,
    employmentName,
    scheduleName,
}) => (
    <div className='vacancy d-flex flex-wrap items-center'>
        <div className='vacancy__info d-flex flex-wrap'>
            {address ? <div className='vacancy__info-address d-flex items-center'>{address}</div> : null}

            <h2 className='vacancy__info-title'>{vacancyName}</h2>

            {responsibilities ? <div className='vacancy__info-description'>{responsibilities}</div> : null}

            <div className='vacancy__details d-flex flex-wrap items-start justify-between'>
                {salary ? (
                    <div className='vacancy__details-column d-flex flex-column'>
                        <span className='vacancy__details-text'>Зарплата</span>
                        <span className='vacancy__details-salary'>{salary} ₽</span>
                    </div>
                ) : null}

                {experience_from || experience_to ? (
                    <div className='vacancy__details-column d-flex flex-column'>
                        <span className='vacancy__details-text'>Опыт работы</span>
                        <span className='vacancy__details-value'>
                            {experience_from ? `От ${experience_from}` : null}
                            {experience_to ? ` до ${experience_to}` : null} лет
                        </span>
                    </div>
                ) : null}
                {employmentName ? (
                    <div className='vacancy__details-column d-flex flex-column'>
                        <span className='vacancy__details-text'>Тип занятости</span>
                        <span className='vacancy__details-value'>{employmentName}</span>
                    </div>
                ) : null}
                {scheduleName ? (
                    <div className='vacancy__details-column d-flex flex-column'>
                        <span className='vacancy__details-text'>График работы</span>
                        <span className='vacancy__details-value'>{scheduleName}</span>
                    </div>
                ) : null}
                {/* <div className='vacancy__details-column d-flex flex-column'>
                                                    <span className='vacancy__details-text'>Город</span>
                                                    <span className='vacancy__details-value'>Казань</span>
                                                </div> */}
            </div>
        </div>

        <VacancyForm vacancyId={vacancyId} />
    </div>
)

export default memo(Vacancy)
