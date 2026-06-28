## Configuration

1. Create a `.env` file
   - Rename the [.env.sample](.env.sample) file to `.env` to fix it.
2. Edit env config
   - Edit the file in the [config](src/config) folder.
   - `default`, `development`, `production`, `test`

## Installation

```sh
# 1. node_modules
npm ci
# 1-1. npm < v7 or Node.js <= v14
npm i
# 2. Generate entity migration
npm run migration:generate
# 2-1. Run migration generate database (check migration file before run)
npm run migration:run
```

## Development

```sh
npm run start:dev
# add new module with template
nest g res modules/module-name
# add new module without test file
nest g res modules/module-name --no-spec
```

Run [http://localhost:3000](http://localhost:3000)

## Test

```sh
npm test # exclude e2e
npm run test:e2e
```

## Production

```sh
npm run lint
npm run build
# define environment variable yourself.
# NODE_ENV=production PORT=8000 NO_COLOR=true node dist/app
node dist/app
# OR
npm start
```

## Features

We create this boilerplate using NestJS's default boilerplate with the following add-on features:

- **_Authentication & Authorization_**: JWT & Passport
- **_API Documentation_**: Swagger
- **_Object–relational mapping_**: TypeORM
- **_Environment Variables_**: dotenv
- **_Database_**: mySQL
- **_Code Style_**: ESlint + Prettier (with `eslint-config-airbnb-typescript`)
- **_TypeScript_** supported

Please check the `package.json` for more details.

## Folders

```js
src/ // the source code of the application
│  ├─ modules/ // the directory that contains all modules
│  │  ├─ feature/ // a module for feature functionality
│  │  │  ├─ dto/ // folder define dto files for validate request input
│  │  │  ├─ types/ // folder for module interface, enums, constant,...
│  │  │  ├─ entities/ // folder define database schema
│  │  │  ├─ response/ // folder define request response interface for docs
│  │  │  ├─ feature.controller.ts
│  │  │  ├─ feature.module.ts
│  │  │  ├─ feature.service.ts
│  ├─ shared/ // share modules public for all feature modules
│  │  ├─ middlewares/ // module define middlewares module
│  │  ├─ api/ // module define api services
│  │  │  ├─ types/ // folder for define interface, enums, constant,... for api services
│  │  │  ├─ services/ // folder for define api services
│  │  │  ├─ api.module.ts // module import api services as module
│  │  ├─ auth/ // module for auth feature, define guards, strategies
│  │  │  ├─ guards/ // folder define guard service
│  │  │  ├─ strategies/ // folder define guard strategy (canActive, passport.///)
│  │  │  ├─ auth.module.ts // module import auth services as module
│  │  │  ├─ auth.service.ts // module handle method process auth data
│  │  ├─ cron/ // module cron services
│  │  │  ├─ types/ // folder for define interface, enums, constant,... for cron services
│  │  │  ├─ services/ // folder define cron services
│  │  │  ├─ cron.module.ts // module import cron services as module
│  │  ├─ logger/ // module for log services
│  │  │  ├─ services/ // folder define logger services
│  │  │  ├─ logger.module.ts // module import logger services as module
│  │  ├─ queue/ // module for queue services
│  │  │  ├─ types/ // folder define interface, enums, constant,... for queue services
│  │  │  ├─ processors/ // folder define queue processor
│  │  │  ├─ queue.module.ts // module import queue services as module
│  │  ├─ common/ // module for queue services
│  │  │  ├─ types/ // folder define interface, enums, constant,... for shared services
│  │  │  ├─ decorators/ // folder define shared decorators
│  │  │  ├─ utils/ // folder define custom functions
│  │  │  │  ├─ functions.ts // public functions
│  │  ├─ shared.module.ts // module import internal services and export global
│  ├─ docs/ // modules for docs config and default request response docs template
│  │  ├─ default/ // default request response template
│  │  │  ├─ default-request.swagger.ts // default request template
│  │  │  ├─ default-response.swagger.ts // default response template
│  │  ├─ swagger.config.ts // swagger docs config
│  │  ├─ swagger.ts // swagger create function
│  ├─ app.module.ts
│  ├─ main.ts
├─ db/
│  ├─ data-source.ts // database configs
├─ logs/
│  ├─ log-file.log // service log
├─ tests/
│  ├─ app/ // end-to-end tests of the application
│  │  ├─ app.e2e-spec.ts
│  ├─ jest-e2e.json
├─ package.json
├─ README.md
├─ .env
├─ .env.example
├─ .gitignore
├─ tsconfig.json
├─ nest-cli.json
```
