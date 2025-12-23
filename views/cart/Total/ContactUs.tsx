import { Section } from '~/components'
import { ContactPhone } from '~/components/ContactPhone/ContactPhone'

export const ContactUs = () => {
    return (
        <Section className={ 'text-content' } title="Есть вопросы?">
            <span style={{ fontSize: '22px', fontWeight: 700, marginRight: '10px' }}>Звоните по телефону:</span>
            <ContactPhone />
        </Section>
    )
}
