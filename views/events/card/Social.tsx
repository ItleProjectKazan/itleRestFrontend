import { FC, memo } from 'react'

interface ISocial {
    text: string
    url: string
}

const Social: FC<ISocial> = ({ url, text }: ISocial) => (
    <div className='share-block d-flex items-center'>
        <span className='share-block__text'>Поделиться</span>

        <div className='share-block__socials d-flex'>
            <a
                // href='https://wa.me/+79172874647'
                href={`whatsapp://send?text=${text}`}
                data-action='share/whatsapp/share'
                target='_blank'
                className='share-block__socials-item d-flex block-center transition'
                rel='noreferrer'
            >
                <span className='icon-whatsapp'></span>
            </a>
            <a
                // href='https://tele.click/+79172874647'
                href={`https://telegram.me/share/url?url=${url}&text=${text}`}
                rel='noreferrer'
                className='share-block__socials-item d-flex block-center transition'
                target='_blank'
            >
                <span className='icon-telegram'></span>
            </a>
            <a
                // href='https://vk.com/itle_pro'
                href={`https://vk.com/share.php?url=${url}`}
                className='share-block__socials-item d-flex block-center transition'
                target='_blank'
                rel='noreferrer'
            >
                <span className='icon-vkontakte'></span>
            </a>
            {/* <a
                href='https://www.instagram.com/meatstore_kzn/?igsh=M3M4bGttZmpueWF4#'
                className='share-block__socials-item d-flex block-center transition'
                target='_blank'
                rel='noreferrer'
            >
                <span className='icon-instagram'></span>
            </a> */}
        </div>
    </div>
)

export default memo(Social)
