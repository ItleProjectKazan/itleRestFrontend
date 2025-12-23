#!/bin/bash
echo 'Запуск обновления';
rsync -Pav ./* root@217.28.222.56:/home/itle/websites/itle_rest/current/frontend/
echo 'Конец обновления';

ssh root@217.28.222.56 << EOF
cd /home/itle/websites/itle_rest/current/frontend;
source ~/.nvm/nvm.sh
nvm use v20.16.0
npm run build;
pm2 restart itle-frontend-rest;
EOF