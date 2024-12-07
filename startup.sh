#!/bin/sh

npx prisma init
npx prisma generate
npx prisma migrate dev
npx prisma db pull
npx prisma db push

npm run build

npx nestjs-command create:admin

npm run start:dev