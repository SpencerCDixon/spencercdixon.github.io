---
title: Test Driven React Tutorial
date: 2016-01-12 21:55 UTC
tags: tutorial, testing, react, javascript
---

Testing is an important part of the development cycle.  There is a name for code
without tests: legacy code.  When I first started learning React and JavaScript
it was overwhelming to say the least.  If you're new to the JS/React community you're 
probably feeling super overwhelmed as well.  Thinking things like: which build tool should I use?  
Which testing framework is right?  What flux pattern should I be learning?  Do I even need to
use flux?

That's why I decided to write this post.  After hours of reading blog posts,
looking through source of good JS developers, and one JSConf in Florida I've
finally found my testing 'groove'.  In the beginning I felt so naked and dirty for
programming React code without tests.  I want to live in a world where no
developer ever needs to feel that way.  It's just not right.  

All the code for this tutorial is available on my [github located here.](https://github.com/SpencerCDixon/react-testing-starter-kit)

Enjoy... 

## Setting Up Webpack
This isn't a tutorial on how to use webpack so I won't go into great detail but
it's important to understand the basics.  Webpack is like the Rails Asset
pipeline on crack.  On a basic level it lets you pre/post process all your code
and serve just one `bundle.js` to the client which will run your react app.

It's an extremely powerful tool which is why we'll be using it.  Webpack is one
of those tools that scares the shit out of you at first, and that's okay, but
once you start understanding how it works you feel like a God among men.  Stick
with it and give it a chance before you judge.  

Here are some more resources to learn more:

1.  [Webpack Cookbook](https://christianalfoni.github.io/react-webpack-cookbook/Getting-started.html)  
2.  [Webpack Beginner Blog Post](http://blog.madewithlove.be/post/webpack-your-bags/)  
3.  [Pete Hunts Infamous Webpack How-to](https://github.com/petehunt/webpack-howto)  

> **NOTE**: I recommend using node `v5.1.0` if you're going to follow along with
> this tutorial.  Anything `>4` should be fine though.

First, lets install all webpack and babel dependencies.  Babel is a JavaScript
transpiler which allows us to write ES6 (es2015) and ES7 code and make sure it all gets
compiled down to ES5 which the browser can use.

```
npm init # follow along with normal npm init to set up project

npm i babel-loader babel-core webpack --save-dev
```

> `npm i` is an alias for npm install.  

Next lets set up our project directory and create a `webpack.config.js` file:

```unix  
mkdir src                  # where all our source code will live
touch src/main.js          # this will be the entry point for our webpack bundling
mkdir test                 # place to store all our tests
mkdir dist                 # this is where the bundled javascript from webpack will go
touch webpack.config.js    # our webpack configuration file
```

Our initial webpack config will be super minimal.  Read through comments to
understand what's going on:  

```javascript  
var webpack = require('webpack'); 
var path = require('path');                // a useful node path helper library

var config = {
  entry: ['./src/main.js'],                // the entry point for our app
  output: {
    path: path.resolve(__dirname, 'dist'), // store the bundled output in dist/bundle.js
    filename: 'bundle.js'                  // specifying file name for our compiled assets
  },
  module: {
    loaders: [
      // telling webpack which loaders we want to use.  For now just run the
      // code through the babel-loader.  'babel' is an alias for babel-loader
      { test: /\.js$/, loaders: ['babel'], exclude: /node_modules/ }   
    ]
  }
}

module.exports = config;
```

In order for babel to do its job properly we need to tell it what `presets` we
want to use.  Let's go ahead and install the React and ES6 presets since we're
going to need those:

```
npm i babel-preset-react babel-preset-es2015 --save-dev
```

Now we have a couple options.  Some people will tell babel to use the presets in
the loader file like this:  

```javascript
loaders: [
  { 
    test: /\.js$/, 
    loaders: ['babel'], 
    exclude: /node_modules/,
    query: {
      presets: ['react', 'es2015'] 
    }
  }   
]
```

Another approach is to store them in a `.babelrc` which is what I'm going to do
for this project.  

```  
touch .babelrc
```  

Paste in the presets:  

```javascript
# .babelrc
{
  "presets": ["react", "es2015"]
}
```

To confirm it works lets put some react code in `main.js` and see if it bundles
everything properly.  Install React and React DOM:  

```javascript
npm i react react-dom -S
```

> Using the `-S` flag is an alias for `--save`.  

Now for creating our first React component:  

```javascript
# src/main.js
import React, { Component } from 'react';
import { render } from 'react-dom';

class Root extends Component {
  render() {
    return <h1> Hello World </h1>;
  }
}

render(<Root />, document.getElementById('root'));
```

The astute reader will have noticed we have not yet created an `index.html` file
with our root.  Lets do that next and put it in our `/dist` folder since that is
where our `bundle.js` will get compiled to:  

```html
# /dist/index.html

<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8"/>
  </head>
  <body>
    <div id='root'></div>
    <script src="bundle.js"></script>
  </body>
</html>
```

Awesome.  Making progress.  Finally we can run webpack and see if everything
worked properly.  If you don't have webpack installed globally (`npm i webpack
-g`) then you can run it from your node modules like so:  

```javascript
./node_modules/.bin/webpack
```

Webpack will by default look for a config with the name `webpack.config.js`.
You could also pass in a different webpack config as an argument.  

Let's create an alias for doing the build inside our package.json:  

```javascript
# package.json
... other stuff
scripts: {
  "build": "webpack"
}
```

Next lets wire up `webpack-dev-server` for a more enjoyable dev experience:  

```javascript
npm i webpack-dev-server --save-dev
```

Add a script to our `index.html` inside the dist folder:  

```html
# /dist/index.html

<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8"/>
  </head>
  <body>
    <div id='root'></div>

    <script src="http://localhost:3000/webpack-dev-server.js"></script>
    <script src="bundle.js"></script>
  </body>
</html>
```

Add webpack dev server entry points to our `webpack.config.js`  

```javascript
... rest of config
  entry: [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:3000',
    './src/main.js'
  ],
... rest of config
```

Make script for running the dev server:  

```
# package.json
... other stuff
scripts: {
  "dev": "webpack-dev-server --port 3000 --devtool eval --progress --colors --hot --content-base dist",
  "build": "webpack"
}
```  

The script uses the `--content-base` flag to tell webpack we want to serve our
`/dist` folder.  We're also explicitly using port 3000 to provide a more
familiar Rails experience.

Finally, lets add a resolve flag to webpack to make importing files a little
easier.  Here is the final config with comments, read through them:  

```javascript
var webpack = require('webpack');
var path = require('path');

var config = {
  entry: [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:3000',
    './src/main.js'
  ],
  resolve: {
    root: [
      // allows us to import modules as if /src was the root.
      // so I can do: import Comment from 'components/Comment'
      // instead of:  import Comment from '../components/Comment' or whatever relative path would be
      path.resolve(__dirname, './src')
    ],
    // allows you to require without the .js at end of filenames
    // import Component from 'component' vs. import Component from 'component.js'
    extensions: ['', '.js', '.json', '.jsx']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        // dont run node_modules or bower_components through babel loader
        exclude: /(node_modules|bower_components)/,
        // babel is alias for babel-loader
        // npm i babel-core babel-loader --save-dev
        loader: 'babel'
      }
    ],
  }
}

module.exports = config;
```

## Setting Up Mocha, Chai, Sinon, and Enzyme

**Mocha**: will be used for running our tests.  
**Chai**: will be used as our expectation library.  Very versatile and lets us
use RSpec like syntax.  
**Sinon**: will be used for mocks/stubs/spys.  
**Enzyme**: will be used for testing our React components.  It's a beautiful
testing library written by AirBnB.  

Install packages:  

```
npm i mocha chai sinon --save-dev
```

If we want to be able to write tests in ES6 we will need to compile the tests
before running.  To do that we can use babel-register:  

```
npm i babel-register --save-dev
```

Some npm scripts to make testing life easier:  

```
# inside package.json script section
  "test": "mocha --compilers js:babel-register --recursive",
  "test:watch": "npm test -- --watch",
```

Our test script says to run mocha using the `babel-register` compiler and look
recursively through our `/test` directory.

Eventually we're going to set up Karma so these npm scripts will be useless but
if Karma isn't your thing then those should work fine.  `test:watch` will watch
for file changes and re-run your suite.  Hooray productivity!

To confirm it works lets create a hello world test in `/tests/helloWorld.spec.js`  

```javascript
# /tests/helloWorld.spec.js
import { expect } from 'chai';

describe('hello world', () => {
  it('works!', () => {
    expect(true).to.be.true;
  });
});
```

Pretty chill... almost looks like RSpec!

Importing `expect` for every test is kind of a bummer though so lets create a
`test_helper` file to save keystrokes.  

```javascript
# /tests/test_helper.js
import { expect } from 'chai';
import sinon from 'sinon';

global.expect = expect;
global.sinon = sinon;
```  

Then include it in the npm script that runs the suite:  

```javascript
# package.json script section
  "test": "mocha --compilers js:babel-register --require ./test/test_helper.js --recursive",
```

I also added sinon so it would be available globally.


### Enzyme
Now that our more 'universal' testing tools are set up (mocha, chai, sinon)
let's install Enzyme and start testing some React components!

Install deps:
```
npm i enzyme react-addons-test-utils --save-dev
```

Enzyme has great documentation which can be [found here](http://airbnb.io/enzyme/).  I recommend reading
through the Shallow Rendering section when you have the time.

> *What is Shallow Rendering you ask?*  

Well, it's a way for us to call the `render` method of our components and get
back React elements which we can make assertions on without having to actually
mount our component to the DOM.  For more on React Elements [see here](https://facebook.github.io/react/blog/2015/12/18/react-components-elements-and-instances.html).

Enzyme will wrap the shallow rendered component in a special `wrapper` which we
can then test.  Think of it like the `page` object in Capybara if you come from
Rails.

Lets do some TDD to drive the development of a proper `<Root />` component.

This Root component will be a `container` meaning that it will be in charge of
handling the state of our application.  Learning the difference between smart
and dumb components in React is very important for good application
architecture.  [Here is a great blog post explaining what they are.](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.8cnl19w8l)

```javascript
# /tests/containers/Root.spec.js

import React from 'react';                     // required to get test to work.  we can get around this later with more configuration
import { shallow } from 'enzyme';              // method from enzyme which allows us to do shallow render
import Root from '../../src/containers/Root';  // import our soon to be component

describe('(Container) Root', () => {
  it('renders as a <div>', () => {
    const wrapper = shallow(<Root />);
    expect(wrapper.type()).to.eql('div');
  });

  it('has style with height 100%', () => {
    const wrapper = shallow(<Root />);
    const expectedStyles = {
      height: '100%',
      background: '#333'
    }
    expect(wrapper.prop('style')).to.eql(expectedStyles);
  });

  it('contains a header explaining the app', () => {
    const wrapper = shallow(<Root />);
    expect(wrapper.find('.welcome-header')).to.have.length(1);
  });
});
```

If we run the tests with `npm test` they should fail.  It makes sense since we
havn't actually created a Root component in the proper location.  So lets do
that:  

> If at any point you want to see the source for this code it is all available 
> [on github here](https://github.com/SpencerCDixon/react-testing-starter-kit)

```javascript
# /src/containers/Root.js
import React, { Component } from 'react';

const styles = {
  height: '100%',
  background: '#333'
}

class Root extends Component {
  render() {
    return (
      <div style={styles}>
        <h1 className='welcome-header'>Welcome to testing React!</h1>
      </div>
    )
  }
}

export default Root;
```  
If you re-run the tests they should all pass now.  

There was a lot of duplication in our tests so lets go back and do some
refactoring.  Since we're never passing any props to the `Root`, we can just
shallow render it once and then make all our assertions.  Often times I find myself
wrapping a section of tests in sub describe blocks that pass in a certain set of
props and then make a bunch of assertions given those props.  

```javascript
describe('(Container) Root', () => {
  const wrapper = shallow(<Root />);

  it('renders as a <div>', () => {
    expect(wrapper.type()).to.eql('div');
  });

  it('has style with height 100%', () => {
    const expectedStyles = {
      height: '100%',
      background: '#333'
    }
    expect(wrapper.prop('style')).to.eql(expectedStyles);
  });

  it('contains a header explaining the app', () => {
    expect(wrapper.find('.welcome-header')).to.have.length(1);
  });
});
```  

Stick to using `shallow` as
much as you possibly can in your tests.  Occasionally it's not possible
though.  For example, if you need to test the React lifecycle methods then you
need the component to actually mount.  

Next lets test a component mounting and calling a function when it mounts so we can
get some exposure to `sinon` and using spys.

We can pretend that the `Root` component has a child called `CommentList` which
will call some arbitrary callback when it mounts.  The function it calls when it
mounts will be given via props so we can practice testing that scenario.  Let's also
conditionally render some styles on the comment list so we can see how to deal
with styling in shallow renders:

```javascript
import React from 'react';

// Once we set up Karma to run our tests through webpack
// we will no longer need to have these long relative paths
import CommentList from '../../src/components/CommentList';
import {
  describeWithDOM,
  mount,
  shallow,
  spyLifecycle
} from 'enzyme';

describe('(Component) CommentList', () => {

  // using special describeWithDOM helper that enzyme
  // provides so if other devs on my team don't have JSDom set up
  // properly or are using old version of node it won't bork their test suite
  //
  // All of our tests that depend on mounting should go inside one of these
  // special describe blocks
  describeWithDOM('Lifecycle methods', () => {
    it('calls componentDidMount', () => {
      spyLifecyle(CommentList);

      const props = {
        onMount: () => {},  // an anonymous function in ES6 arrow syntax
        isActive: false
      }

      // using destructuring to pass props down
      // easily and then mounting the component
      mount(<CommentList {...props} />);

      // CommentList's componentDidMount should have been
      // called once.  spyLifecyle attaches sinon spys so we can
      // make this assertion
      expect(
        CommentList.prototype.componentDidMount.calledOnce
      ).to.be.true;
    });

    it('calls onMount prop once it mounts', () => {
      // create a spy for the onMount function
      const props = { onMount: sinon.spy() };

      // mount our component
      mount(<CommentList {...props} />);

      // expect that onMount was called
      expect(props.onMount.calledOnce).to.be.true;
    });
  });
});
```

There is a lot going on there.  Read through the comments to get a better
understanding.  Look at the implementation that makes the tests pass then go back
and look at the tests again to confirm you understand.

```javascript
# /src/components/CommentList.js
import React, { Component, PropTypes } from 'react';

const propTypes = {
  onMount: PropTypes.func.isRequired,
  isActive: PropTypes.bool
};

class CommentList extends Component {
  componentDidMount() {
    this.props.onMount();
  }

  render() {
    return (
      <ul>
        <li> Comment One </li>
      </ul>
    )
  }
}

CommentList.propTypes = propTypes;
export default CommentList;
```

The suite should now pass.  Next lets add some shallow rendered tests to make sure
our component is applying the proper CSS classes given its `isActive` prop.

```javascript
... previous tests

  it('should render as a <ul>', () => {
    const props = { onMount: () => {} };
    const wrapper = shallow(<CommentList  {...props} />);
    expect(wrapper.type()).to.eql('ul');
  });

  describe('when active...', () => {
    const wrapper = shallow(
      // just passing isActive is an alias for true
      <CommentList onMount={() => {}} isActive />
    )
    it('should render with className active-list', () => {
      expect(wrapper.prop('className').to.eql('active-list');
    });
  });

  describe('when inactive...', () => {
    const wrapper = shallow(
      // just passing isActive is an alias for true
      <CommentList onMount={() => {}} isActive={false} />
    )
    it('should render with className inactive-list', () => {
      expect(wrapper.prop('className').to.eql('inactive-list');
    });
  });
});
```

To make them pass:

```javascript
class CommentList extends Component {
  componentDidMount() {
    this.props.onMount();
  }

  render() {
    const { isActive } = this.props;  // uses ES6 destructuring to get the isActive value
    const classes = isActive ? 'active-list' : 'inactive-list';

    return (
      <ul>
        <li> Comment One </li>
      </ul>
    )
  }
}
```

At this point you should have a good understanding on how to go about testing
your react components.  Remember to read through the amazing Enzyme
documentation to get some inspiration.

## Setting Up Karma

