# Conceptor Dev

## Install

**NOTE:** You need to have node.js and mongodb installed and running.

```sh
  $ git clone git://github.com/luiza-cicone/conceptor.git
  $ npm install
  $ cp config/config.example.js config/config.js
  $ npm start
```

**NOTE:** Do not forget to update your facebook twitter and github APP_ID and APP_SECRET in `config/config.js`.

Then visit [http://localhost:3000/](http://localhost:3000/)

## Related modules

1. [node-genem](https://github.com/madhums/node-genem) A module to generate the MVC skeleton using this approach.
2. [node-notifier](http://github.com/madhums/node-notifier) - used for notifications via emails and push notificatiions
3. [node-view-helpers](http://github.com/madhums/node-view-helpers) - some common view helpers

## Directory structure
```
-app/
  |__controllers/
  |__models/
  |__mailer/
  |__views/
-config/
  |__routes.js
  |__config.js
  |__passport.js (auth config)
  |__sockets.js (sockets config)
  |__express.js (express.js configs)
  |__middlewares/ (custom middlewares)
-public/
```

## Tests

```sh
$ npm test
```