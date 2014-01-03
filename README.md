Jana's Map Quiz
=================

A simple map-based quiz to get to know our world a little
better, every day. It's open source, build with web technologies
and works on any device.


## Keyboard-Shortcuts

The game is optimized for both, touch & keyboard usage. The
following keybord shortcuts are supported:

`+` / `-`: zoom in / out
`1` - `4`: select answer 1 - 4
`a` - `z`: select answer by first letter


## Download & Install requirements

1. download and open the mapquiz folder in your terminal
2. Install [Grunt](http://gruntjs.com/)
   `npm install -g grunt-cli`
3. Install app dependencies
   `npm install`


## Starting & Building App

```
# start local dev server serving source files in /src
grunt server

# build app into /build
grunt build

# start local server serving build files from /build
grunt connect:build
```

## Code Architecture

The app is overengineer on purpose. I wanted dive deeper into

* [Backbone.Marionette](http://marionettejs.com/) for overall code architecture
* [require.js](http://requirejs.org/) for module management
* [Grunt](http://gruntjs.com/) for local development & building the app for production

My goal is to get a better undestranding on best practises to
make better decisions in the future on when to break them :)

But above all, I want to make it fun to extend the app in the future
and encoure you to fork and build upon it.

### Folder / File Structure

---
/src/index.html: Starting point of the app. During the build process,
                 the CSS files get combined using [grunt usemin](https://github.com/yeoman/grunt-usemin)
                 and the `<script>` tag referencing requirements get replaced with
                 two combined files, app.js & vendor.js
/src/app:        All JavaScript source files & templates of the app are here.
                 See table below for details
/src/assets:     All static assets go here (Icons, Images, Stylesheets, ...)
/src/data:       [GeoJson](http://geojson.org/) files for the map. The current quiz only
                 supports world countrys, but we might add other data for new quiz modes
                 in the future, like capitals, federal states, rivers & cities of countries
/src/vendor:     All 3rd party dependencies go hear. Add / remove using [bower](http://bower.io/).
---

The `/src/app` files & folders en detail

---
app.js:          Main app file controlling the app's initialization on startup
                 and coordinates behavior accross modules
config.js:       The [require.js](http://requirejs.org/) config file, loaded in `/src/index.html`.
                 It makes all 3rd party vendor packages available via `require('modulename')`, by
                 specifiying their paths and shimming their exported variables & functions.
                 At the end, it opens `start.js`
start.js:        Starts the app as defined in `app.js` & initializes the routing (not yet used).
vendor.js:       Defines vendor modules to be bundled during build process. Not used in development
collections:     The app is using 2 Collections: CountryList holds all Countries from `data/countries.js`
                 that are used be render be the MapView. OptionList is a subset that is used by ControlsView,
                 to render the buttons to guess what country is currently highlighted.
controllers:     not used yet.
entities:        Manages access to the data across the modules. Initializes the two collections
                 only once and keeps them up to date when the app state changes.
models:          Holds the Country Model, but has not custom behavior yet.
routers:         not used yet.
templates:       [Handlebars](http://handlebarsjs.com/) Templates. The Application template gets rendered
                 in the `<body>` tag and holds the main structure of the application
views:           Manages the interaction of the user with the DOM and renders the templates
---

### Ideas / next steps

* Add a custom view that renders the Answer if a country has been
  guessed correctly. The logic currently lives in ControlsView
* Add a tip feature: Show a `?` button next to the four letters.
  When clicked, show the First letter of the country on top of the
  screen + underlines for the remaining letters. The four letters
  on bottom change to guess the second letter of the country, etc
* Add statistics. Don't count time, but count number of turns,
  guesses, wrong guesses, tips, etc
* Add other modes / quizzes, e.g. for federal states of USA
* Allow to click on countries in the map to put them in the queue
  so that they get asked next.
* Make the algorithm on what country gets shown smarter: take number
  of wrong guesses into account etc.


## Changelog





**© 2013 Gregor Martynus  **
MIT Licensed