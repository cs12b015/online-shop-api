# Online Shop Implementation
Implementation of Online shop with product search and checkout


## Installation
To create the project, follow these steps:

Clone the repo:

```bash
git clone https://github.com/cs12b015/online-shop-api.git
cd online-shop-api
```

Install the dependencies:

```bash
npm install
```

Set the environment variables:

```bash
cp .env.example .env

# open .env and modify the environment variables (if needed)
```

## Table of Contents

- [Features](#features)
- [Docker](#docker)
- [Commands](#commands)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [GraphQL Queries and Mutations](#GraphQL-Queries-and-Mutations)
- [Error Handling](#error-handling)
- [Validation](#validation)
- [Logging](#logging)
- [Linting](#linting)

## Features
- **SQL database**: [PostgreSQL](https://www.postgresql.org/) object data modeling using [TypeORM](https://typeorm.io/)
- **Docker**: using [Docker](https://docs.docker.com/)
- **Logging**: using [winston](https://github.com/winstonjs/winston)
- **Testing**: unit and integration tests using [Jest](https://jestjs.io)
- **Error handling**: centralized error handling mechanism
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv)
- **Security**: set security HTTP headers using [helmet](https://helmetjs.github.io)
- **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)
- **Git hooks**: with [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged)
- **Linting**: with [ESLint](https://eslint.org) and [Prettier](https://prettier.io)
- **Editor config**: consistent editor configuration using [EditorConfig](https://editorconfig.org)


## Docker
Docker is a platform for developers and sysadmins to build, run, and share applications with containers.
```bash
# open .env and modify the DB_HOST environment variable to postgres container
DB_HOST = pg
```

```bash
# starts the containers in the background and leaves them running
docker-compose up -d

# Stops containers and removes containers, networks, volumes, and images
docker-compose down
```

## Commands

Running locally:

```bash
npm run dev
```

Running in production:

```bash
npm start
```

Testing:

```bash
# run all tests
npm run test
```


Linting:

```bash
# run ESLint
npm run lint

# fix ESLint errors
npm run lint:fix

# run prettier
npm run format
```

Building with [SWC (super-fast JavaScript / TypeScript compiler)](https://swc.rs/)
```bash
npm run build
```

Advanced, Production process manager [PM2](https://pm2.keymetrics.io/)
```bash
# deploying in prod
npm run deploy:prod

# deploying in dev
npm run deploy:dev
```

## Environment Variables

The environment variables can be found and modified in the `.env` file. They come with these default values:

```bash
# PORT
PORT = 3000

# DATABASE
DB_HOST = localhost
DB_PORT = 5432
DB_USER = root
DB_PASSWORD = password
DB_DATABASE = online_shop

# LOG
LOG_FORMAT = dev
LOG_DIR = ../logs

# CORS
ORIGIN = true
CREDENTIALS = true
```

## Project Structure

```
src\
 |--config\         # Environment variables
 |--databases\      # Database configuration
 |--dtos\           # Data Transfer Objects
 |--entities\       # DB Schema models (data layer)
 |--exceptions\     # Error Handling
 |--interfaces\     # Interfaces
 |--middlewares\    # Custom express middlewares
 |--migration\      # SQL Data migrations to create tables
 |--repositories\   # typeorm DB repositories (data layer)
 |--resolvers\      # GraphQl Resolvers
 |--seeds\          # SQL Data Seeders
 |--tests\          # Test cases
 |--typedefs\       # GraphQl Type Definitions
 |--utils\          # Utility classes and functions
 |--app.ts          # Express app
 |--server.ts       # App entry point
```

### GraphQL Queries and Mutations
List of available Queries And Mutations:

**Queries**:\
`Query to get products by search`
```
query GetProductsBySearch($search: ProductSearchDto!) {
  getProductsBySearch(search: $search) {
    id
    title
    description
    imageUrl
    price
    quantity
    createdAt
    updatedAt
  }
}
```
**Mutations**:
`Mutation to create order`
```
mutation CreateOrder($orderData: [CheckoutItemDto!]!) {
  createOrder(orderData: $orderData) {
    id
    totalPrice
    totalQuantity
    orderItems {
      id
      productId
      title
      imageUrl
      description
      quantity
      price
    }
    createdAt
    updatedAt
  }
}
```


## Error Handling
The app has a centralized error handling mechanism. Controllers should try to catch the errors and forward them to the error handling middleware (by calling `next(error)`).

The error handling middleware sends an error response, which has the following format:
```json
{
  "status": 400
  "message": "Error message"
}
```

## Logging

Import the logger from `src/utils/logger.ts`. It is using the [Winston](https://github.com/winstonjs/winston) logging library.

Logging should be done according to the following severity levels (ascending order from most important to least important):

```javascript
import { logger } from '@utils/logger';

logger.error('message'); // level 0
logger.warn('message'); // level 1
logger.info('message'); // level 2
logger.http('message'); // level 3
logger.verbose('message'); // level 4
logger.debug('message'); // level 5
```

In development mode, log messages of all severity levels will be printed to the console.
In production mode, only `info`, `warn`, and `error` logs will be printed to the console.


## Linting

Linting is done using [ESLint](https://eslint.org/) and [Prettier](https://prettier.io).

In this app, ESLint is configured to follow the [@typescript-eslint/recommended] with some modifications. It also extends [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) to turn off all rules that are unnecessary or might conflict with Prettier.

To modify the ESLint configuration, update the `.eslintrc.json` file. To modify the Prettier configuration, update the `.prettierrc.json` file.

To prevent a certain file or directory from being linted, add it to `.eslintignore` and `.prettierignore`.

To maintain a consistent coding style across different IDEs, the project contains `.editorconfig`
