# Conceptor Dev

## Install

**NOTE:** You need to have node.js, mongodb and [imagemagick](http://www.imagemagick.org/script/index.php) installed and running.

```sh
  $ git clone git://github.com/luiza-cicone/conceptor.git
  $ npm install
  $ cp config/config.example.js config/config.js
  $ cp config/imager.example.js config/imager.js
  $ npm start
```

**NOTE:** Do not forget to update your facebook twitter and github APP_ID and APP_SECRET in `config/config.js`. Also if you want to use image uploads, don't forget to replace the S3 and Rackspace keys in `config/imager.js`.

Then visit [http://localhost:3000/](http://localhost:3000/)

## Info

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