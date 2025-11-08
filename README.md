Local server installation Steps:

install method: using git clone or manual installation to VSCode
local database: pgAdmin4

terminal (if manual installation):
npm i

add .env to root
DATABASE_URL="postgresql://[username]:[userPass]@[hostname]:[server port]/[databaseName]"
port=3000

service/api/api.ts
localIp = [computer/phoneIp]

terminal 1:
npx prisma generate
npm run server

terminal 2:
npm start
