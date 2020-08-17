# WHATS UP

Modern Swagger JSON Management Tool 


# Getting Started 

First, you need to get a json file supported by swagger.

Then put the downloaded file in the src/data/ directory.

```js
// package.json 
"script": {
    ...
    "download:pet": "curl https://petstore.swagger.io/v2/swagger.json > src/data/pet.json",
    "download": "npm run download:pet"
    ...
}


```

And add the downloaded json file to the src/data/index.ts file.

```js
// src/data/index.ts 
import pet from './pet.json';

export default {
    pet,            // add json file 
} as {[key: string]: any}

```

### Start - `yarn start`


```sh
yarn 
yarn start 
```

### Change HOST and PORT

To prevent CORS problems, please Add `HOST` and `PORT` to the start script.

```js
  "scripts": {
    "start": "HOST=local.your-test-domaina.com PORT=5300 react-scripts start --progress",
  }
```

And you can edit the hosts file.

```sh
vi /etc/hosts

127.0.0.1   local.your-test-domain.com 

```

### Build - `yarn build`

```sh
yarn build
```

After executing yarn build, SPA related files are created in the build directory.

Use this output if you want to deploy to a specific static server.

### License - MIT 