# ideal-fiesta

Ideal fiesta is a set of tools for your remote meetings

**demo:** https://ideal-fiesta.corentinfiloche.xyz/

### Motivation

At my work we are working with the `agile` method and we are using some tools to make our organization. About the user story's cost, we use the [Fibonacci scale](https://en.wikipedia.org/wiki/Fibonacci_scale_(agile)) method throught a [planning poker](https://en.wikipedia.org/wiki/Planning_poker) session.

To make these meeting more easy and crazy, I decided to make a project for it.

Objectifs are:

  - Make powerful and fun website, regrouping several type of tools for the work and agile meeting
  - Gain experience with websocket
  - Learn to work with Nest.js

### FAQ

#### How it works ?

Nuxt.js is used to generate the front (developed with Vue.js) to static html files. Then, these files are served as static resources by the Node.js server performed by the Framework Nest.js. Moreover, the server handles all the websocket request and it ensures good communications between all the clients.

### Roadmap

* [x] Add a room system (with administrator)
* [x] Add a chat
* [x] Add a planning poker tool
* [x] Clean room when it is deleted or leaved by admin
* [] Add a time/cost vistualizer tool
* [] Protect the room with a password
* [] Restrict data to user who are targeted

#### Built with

* [Node.js (v15)](https://nodejs.org/en/) - Javascript runtime
* [Nuxt.js](https://nuxtjs.org/) - Vue.js framework
* [Tailwindcss](https://tailwindcss.com/) - Utility-first CSS framework
* [Nest.js](https://nestjs.com/) - A progressive Node.js framework
