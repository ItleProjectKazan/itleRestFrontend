const NEXT_TYPE = process.env.NEXT_TYPE
const domain = NEXT_TYPE == 'bistro' ? 'https://itle-bistro.ru' : 'https://itle.pro'
const SERVER = process.env.NEXT_SERVER

const development = `User-agent: *
Disallow: /
`

let production = `User-agent: *
Disallow: /?
Disallow: /admin
Disallow: /checkout
Disallow: /cart
Disallow: *utm*=
Disallow: /readme.html 

User-agent: GoogleBot 
Disallow: /?
Disallow: /admin
Disallow: /checkout
Disallow: /cart
Disallow: *utm*=

User-agent: Yandex 
Disallow: /?
Disallow: /admin
Disallow: /checkout
Disallow: /cart
Disallow: *utm*=

`
production += 'Host: ' + domain

const robots = (req: any, res: any) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')

    if (SERVER == 'development') {
        res.send(development)
    } else {
        res.send(production)
    }

    res.end()

    return
}

export default robots
