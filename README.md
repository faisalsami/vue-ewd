# vue-ewd: [Vue.js](https://vuejs.org/) & [Nuxt.js](https://nuxtjs.org/) WebSocket client plugin for [EWD.js](https://www.npmjs.com/package/ewdjs)

This plugin integrates [Vue.js](https://vuejs.org/) & [Nuxt.js](https://nuxtjs.org/) applications with a multi-process [ewd (EWD.js)](https://www.npmjs.com/package/ewdjs) [Express](https://expressjs.com/) or [Koa](http://koajs.com/) back-end server using [WebSockets](https://socket.io/) (or Ajax calls). Exposes the [ewdjs-client](https://www.npmjs.com/package/ewdjs-client) module as a `this.$ewd` built-in Vue.js service inside your Vue.js components.

[EWD.js](https://www.npmjs.com/package/ewdjs) is a unique web framework allowing you to concentrate on your application code, without worrying about system infrastructure, featuring:
- a WebSockets server, allowing your application to connect via this `vue-ewd` module using [ewdjs-client](https://www.npmjs.com/package/ewdjs-client)
- a [GraphQL](http://graphql.org/) server to write & process your GraphQL queries & mutations
- an application router to orchestrate all your different application endpoint(s)/handler(s)
- a master/worker multi-process queue architecture, high-performance and very scalable
- session management/cache allowing you to write stateful applications
- response customization: combine responses from different servers, return responses in different formats, intercept an re-route requests, ...
- built-in JSON database abstraction: make your application data persistent using the [InterSystems Caché multi-model database](https://www.intersystems.com/products/cache/) or the [InterSystems IRIS Data platform](https://www.intersystems.com/products/intersystems-iris/) (unified data access as a document/NoSQL store or using SQL or objects), [Redis](https://redis.io/), [YottaDB](https://yottadb.com), ...

## Installing

    npm install vue-ewd

```javascript
import io from 'socket.io-client'

let ewd = EWD({
  application: 'ewd-test-app', // application name
  log: true,
  url: 'http://localhost:8080',
  io,
})
```
## Options

  Options you can pass to the `EWD({ ... })` instance (see examples) with  their default values and a short description:

    {
      // application module name
      application: 'unknown',
      // socket.io-client module (optional, required for WebSockets communication)
      io: undefined,
      // jquery module (optional, required for Ajax communication using jQuery's $.ajax)
      url: null,
      // runtime mode for ewd-client (optional)
      log: true,
      // specify custom cookie name to restart the current WebSockets session between page refreshes (optional)
    }

## Use with [Vue.js](https://vuejs.org/)

Below is a small example using [Vue.js](https://vuejs.org/) components.

First, create a new startup app template with [vue-cli](https://www.npmjs.com/package/vue-cli) (or with the most recent [@vue/cli](https://www.npmjs.com/package/@vue/cli) version 3.x). This example is just a modification of the standard app template code. If necessary, adjust the `url` property inside the `var ewd` to your local settings.

This module adds a `$ewd` service to the Vue instance. You can then simply communicate with your back-end by invoking `this.$ewd.sockets.sendMessage()` in your Vue component methods. Btw, you'll need to define a `let self = this` to make the Vue component instance available in the `send` callback because it's not proxied yet inside the callback.

While EWD.js is starting the WebSocket connection with the back-end, you can also use conditional rendering to hide (parts of) the app view using `this.$ewd.vRegistrationCallback(cb)`. See below, where the App component installs a callback function which EWD calls when the WebSocket connection state changes. This sets the reactive `ewdReady` data property and re-renders the view.

Press the "EWD message test" button to see the plugin back-end communication in action.

```javascript
import Vue from 'vue'
import App from './App.vue'
import io from 'socket.io-client'
// import both the EWD class and VueEWD plugin
import { EWD, VueEWD } from 'vue-ewd'

// instantiate EWD with your parameters
var ewd = EWD({
  application: 'ewd-test', // application name
  log: true,
  url: 'http://localhost:8080', // adjust this to your local environment
  io, // use WebSocket communication
});

// let Vue know you want to use the plugin
Vue.use(VueEWD, { ewd });

// create your Vue instance
new Vue({
  el: '#app',
  render: h => h(App)
})
```

Next, create a default App.vue component:

```html
<template>
  <div id="app">
    <template v-if="ewdReady">
      <img src="./assets/logo.png">
      <h1>{{ msg }}</h1>
      <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://gitter.im/vuejs/vue" target="_blank">Gitter Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
    <button @click="testing">EWD message test</button>
  </template>
  <template v-else>
    <img src="./assets/logo.png">
    <h2>Starting application, please wait ...</h2>
  </template>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted: function() {
    var self = this;
    // monitor when EWD is ready
    this.$ewd.vRegistrationCallback(function(registered) {
      self.ewdReady = registered; //
    });
    // start the EWD WebSockets connection ...
    this.$ewd.vueStart();
  },
  data () {
    return {
      ewdReady: false,
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    testing: function() {
      let messageObj = {
        type: 'test',
        params: {
          text: 'a Vue.js test message for EWD'
        }
      };
      let self = this;
      this.$ewd.send(messageObj, function(messageObj) {
        self.msg = messageObj.message.text;
      });
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
```

Next, create a `ewd-test.js` module in your EWD back-end server with a `test` handler returning a simple test message (see below).

```javascript
module.exports = {
  handlers: {
    test: function (params, ewd) {
      var incomingText = params.text;
      var d = new Date();
      return {text: 'You sent: ' + incomingText + ' at ' + d.toUTCString()};
    }
  }
};
```
Next, you'll need to install one dependency the EWDJS client needs to build it's WebSockets connection to the EWD.js server back-end:
```batchfile
npm i socket.io-client --save
```
Finally, run your Vue.js test app with:
```batchfile
npm run dev
```
## Use with [Nuxt.js](https://nuxtjs.org/)

If you want to build Vue.js apps using SSR (server-side rendering), you can use `vue-ewd` inside a `Nuxt.js` project (template). You need to define `vue-ewd` first as a plugin for your `Nuxt.js` project.

Create a `vue-ewd.js` file inside your `/plugins` directory:

```javascript
import Vue from 'vue'
import io from 'socket.io-client'
// import both the EWD class and VueEWD plugin
import { EWD, VueEWD } from 'vue-ewd'

// instantiate EWD with your parameters
var ewd = EWD({
  application: 'ewd-test', // application name
  log: true,
  // adjust this to your local environment
  // using environment vars defined in nuxt.config.js
  url: 'http://' + process.env.ewdHost + ':' + process.env.ewdPort,
  io,
});

// let Vue know you want to use the plugin
Vue.use(VueEWD, { ewd })
```
Inside your `nuxt.config.js`, add `vue-ewd.js` to the plugins array, e.g.:
```javascript
module.exports = {
  env: {
    ewdHost: process.env.EWD_HOST || 'localhost',
    ewdPort: process.env.EWD_PORT || '8080'
  },
  server: {
    port: 3000, // default: 3000
    host: '0.0.0.0' // default: localhost
  },

  ...

  plugins: [
    '~/plugins/vuetify.js',
    '~/plugins/vue-ewd.js'
  ],

  ...
```
It's recommended to launch the EWD.js client from the `mounted` hook in an Application layout file, e.g. inside `/layouts/default.vue` you can add EWD like this:
```html
<template>
  <v-app dark>
  ...
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        ewdReady: false,
        sessionExpired: false,
        ...
      }
    },
    mounted: function () {
      var self = this
      // monitor when EWD is ready
      this.$ewd.vRegistrationCallback(function (registered, msgType) {
        console.log('registration callback: ', registered, msgType)
        self.ewdReady = registered
        // preserve session across page refreshes & switches
        if (registered) {
          self.sessionExpired = false
          if (msgType === 'ewd-registered') {
            
          }
        } else {
          if (msgType === 'socketDisconnected') {
            self.sessionExpired = true
          }
        }
      })
      // start the EWD WebSockets connection ...
      this.$ewd.vueStart()
    },
    methods: {
      ...
    }
  }
</script>
```
Btw, this example uses the [Vuetify](https://vuetifyjs.com) framework to build a nice UI very easily using components.

Next, you can use `this.$ewd` in all your page methods as usual.

## License

 Copyright (c) 2020 Faisal Sami,
 All rights reserved

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
