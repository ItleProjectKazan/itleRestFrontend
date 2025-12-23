# ITLE Frontend

## Getting started

```bash
# install dependencies
$ npm install
```

Copy `.env.example` file to `.env.local`. Change the API URL if it's required.

Run the development server:

```bash
# serve with hot reload at localhost:3000
$ npm run dev
```

## Local domain + HTTPS

1. Generate self-signed certificate: [manual](https://stackoverflow.com/a/41366949).
   Do not forget replace `example.com` with your actual address, like `itle.dev` or `localhost`.
2. Add `example.crt` onto local trust store. For Chrome: Settings → Security → Security → Manage certificates → add and trust.
3. If domain differs from `localhost` then also add it to [hosts file](https://www.howtogeek.com/howto/27350/beginner-geek-how-to-edit-your-hosts-file/).
4. Start:
   ```shell
   $ npm run dev-ssl
   ```
Now dev server accessible via https at 8443 port.

## Деплой на сервер

### Девелопмент

```bash
npm run deploy:dev
```

Загружает на сервер `itle@188.120.231.216`.

### Продакшен

```bash
npm run deploy:prod
```

Загружает на сервер `itle@91.107.121.196`.

### Требования

- SSH-доступ к серверам (рекомендуется настроить SSH-ключи)
- После деплоя необходимо перезапустить Next.js на сервере

