import { PageLinks } from '~/constants/pageLinks'

export const AgreementText = () => {

    return (
        <p className="text-content">
            Нажимая «Оформить заказ»,
            Вы даёте <a href={ PageLinks.INFO_AGREEMENT } rel="noreferrer" target="_blank">Согласие на обработку</a> персональных данных
            и принимаете <a href={ PageLinks.INFO_RULES } rel="noreferrer" target="_blank">Пользовательское соглашение</a>.
        </p>
    )
}
