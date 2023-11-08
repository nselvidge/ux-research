#!/bin/bash
npm run db:generate
npm run build
cp -r ./src/global/generated/prisma ./dist/src/global/generated/prisma
cp -r ./src/domains/pages/assets ./dist/src/domains/pages/assets
cp -r ./src/domains/interview/templates ./dist/src/domains/interview/templates
cp -r ./src/domains/auth/templates ./dist/src/domains/auth/templates

