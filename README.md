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

<table>
  <tr>
    <th>/src/index.html</th>
    <td>
      Starting point of the app. During the build process,
      the CSS files get combined using <a href="https://github.com/yeoman/grunt-usemin">grunt usemin</a>
      and the <code>&lt;script&gt;</code> tag referencing requirements get replaced with
      two combined files, app.js & vendor.js
    </td>
  </tr>
  <tr>
    <th>/src/app</th>
    <td>
      All JavaScript source files & templates of the app are here.
      See table below for details
    </td>
  </tr>
  <tr>
    <th>/src/assets</th>
    <td>
      All static assets go here (Icons, Images, Stylesheets, ...)
    </td>
  </tr>
  <tr>
    <th>/src/data</th>
    <td>
      <a href="http://geojson.org/">GeoJson</a> files for the map. The current quiz only
      supports world countrys, but we might add other data for new quiz modes
      in the future, like capitals, federal states, rivers & cities of countries
    </td>
  </tr>
  <tr>
    <th>/src/vendor</th>
    <td>
      All 3rd party dependencies go hear. Add / remove using <a href="http://bower.io/">bower</a>.
    </td>
  </tr>
</table>

The `/src/app` files & folders en detail

<table>
  <tr>
    <th>app.js</th>
    <td>
      Main app file controlling the app's initialization on startup
      and coordinates behavior accross modules
    </td>
  </tr>
  <tr>
    <th>config.js</th>
    <td>
      The <a href="http://requirejs.org/">require.js</a> config file, loaded in <code>/src/index.html</code>.
      It makes all 3rd party vendor packages available via <code>require('modulename')</code>, by
      specifiying their paths and shimming their exported variables & functions.
      At the end, it opens `start.js`
    </td>
  </tr>
  <tr>
    <th>start.js</th>
    <td>
      Starts the app as defined in <code>app.js</code> & initializes the routing (not yet used).
    </td>
  </tr>
  <tr>
    <th>vendor.js</th>
    <td>
      Defines vendor modules to be bundled during build process. Not used in development
    </td>
  </tr>
  <tr>
    <th>collections</th>
    <td>
      The app is using 2 Collections: CountryList holds all Countries from <code>data/countries.js</code>
      that are used be render be the MapView. OptionList is a subset that is used by ControlsView,
      to render the buttons to guess what country is currently highlighted.
    </td>
  </tr>
  <tr>
    <th>controllers</th>
    <td>
      not used yet.
    </td>
  </tr>
  <tr>
    <th>entities</th>
    <td>
      Manages access to the data across the modules. Initializes the two collections
      only once and keeps them up to date when the app state changes.
    </td>
  </tr>
  <tr>
    <th>models</th>
    <td>Holds the Country Model, but has not custom behavior yet.</td>
  </tr>
  <tr>
    <th>routers</th>
    <td>not used yet.</td>
  </tr>
  <tr>
    <th>templates</th>
    <td>
      <a href="http://handlebarsjs.com/">Handlebars</a> Templates. The Application template gets rendered
      in the <code>&lt;body&gt;</code> tag and holds the main structure of the application
    </td>
  </tr>
  <tr>
    <th>views</th>
    <td>
      Manages the interaction of the user with the DOM and renders the templates
    </td>
  </tr>
</table>

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

---

**© 2013 Gregor Martynus**  
MIT Licensed