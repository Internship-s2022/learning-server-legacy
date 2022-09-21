# Getting started with ${App Name}

## Domains

- https://{url}.radiumrocket.com Production (master)
- https://{url}.radiumrocket.com UAT (uat)
- https://{url}.radiumrocket.com Test (test)
- https://{url}.radiumrocket.com Develop (develop)

## Features

**TODO**: Add libraries when they are fully integrated

- 🏗 Built with [Express](http://expressjs.com/)
- 🚨 Testing powered by [jest](https://jestjs.io/docs/getting-started)

## Set up environment

Before installing the dependencies and running start the project, follow the next steps:

1. Install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) in case of not have it
2. Run `nvm install && nvm use && node -v` to use the node version defined on `.nvmrc` file
3. Run `yarn` to install all the node dependencies

## Available Scripts

In the project directory, you can run:

- Run `yarn start` to run the app in the development mode. Open [http://localhost:4000](http://localhost:4000) to check the server status.
- Run `yarn test` to run all tests.
- Run `yarn build` to create a production build.
- Run `yarn lint` to check the lint.
- Run `yarn lint:fix` to fix all the lint issues and format with prettier.

## Basic structure and configurations

```
src/                          // container to other folders with the source code of the app
  config/                     // configuration files
  constants/                  // global constants
  interfaces/                 // global interfaces
  middlewares/                // functions that should run on before some requests
    validations.ts            // validation that are being used on the middlewares
  models/                     // mongoose model schemes
  routes/                     // server routes
    public/                   // routes that can be request by anyone
    resource/                 // resource folder
      controllers.ts          // functions that are being used on the routes
      index.ts                // routes of the resource
      types.ts                // types that are needed on the resource
      resource.test.ts        // test of the resource
      validations.ts          // validate schemes
    index.ts                  // all the defined routes for the server
  seeds/                      // seeds for the testing
  utils/                      // reusable functions
  app.ts                      // server app
  index.ts                    // main file
.env                          // environment variables
package.json                  // deps and workspace scripts
tsconfig.json                 // typescript configuration
nodemon.json                  // nodemon configuration
README.md                     // docs are important
```

## Resource structure

**Note**: Consider that is not required to have on all cases the `routes` folder

Each Resource must follow the next structure and the name of it must be in `kebab-case`:

```
example/
  sub-route-a/
    sub-route-c/
    controllers.ts
    index.ts
    types.ts
    validations.ts
    sub-route-a.test.ts
  sub-route-b/
    controllers.ts
    index.ts
    types.ts
    validations.ts
    sub-route-b.test.ts
  controllers.ts          // functions that are being used on the routes
  index.ts                // routes of example
  types.ts                // types that are needed on example
  example.test.ts
  validations.ts
```
