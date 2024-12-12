#!/bin/sh

npx prisma generate
npx prisma migrate deploy
npx prisma db push

npm run build

npx nestjs-command create:admin

npm run seed

npm run start:dev