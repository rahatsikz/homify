## Developer Management System - Backend

## Deployed Link

## Technology Used

- Node.js
- Express
- TypeScript
- Prisma (as ORM)
- Postgresql (as Database)
- Zod (for data validation)

## ERD Diagram

## Procedure to run the project

At First, Clone the Repository

Then, install the dependencies

```bash
npm install
```

after that, add the `.env` file in the root folder and add these environment variables with additional values

```bash
DATABASE_URL= "Your database url"

PORT=5000
NODE_ENV=development


JWT_SECRET= "Secret for Access Token"
JWT_EXPIRES_IN= "Access Token expire time"
JWT_REFRESH_SECRET= "Secret for Refresh Token"
JWT_REFRESH_EXPIRES_IN= "Refresh Token expire time"
```

Then, Create table in your database with this command

```bash
npx prisma migrate dev
```

Finally, run the development server

```bash
npm run dev
```

Server will run in your desired port number mentioned above.
You can check [http://localhost:5000](http://localhost:5000) to see the result.
