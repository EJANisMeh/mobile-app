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


Database setup for local pgAdmin:
right click database table
open psql tool
link console the exported database file to console: 
``
\i /[path to file]
``
Make sure username to be used by the app is in the login roles. If not add it.
