---
title: Test Driven React - Part 2
date: 2016-01-17 17:04 UTC
tags:
published: false
---

Introduction...

Table of Contents
*  setting up starter kit
*  workflow discussion
*  adding bootstrap and font awesome
*  reddit container
*  async testing

Lets reuse the starter kit...

```
git clone git@github.com:SpencerCDixon/react-testing-starter-kit.git tdd-react-2
cd tdd-react-2
npm install
```

> Note: recommended versions of node and npm

* recommend tracking progress via git
* if you don't want to thats totally fine just disregard this step
Let's remove the previous git folder and init our own so we can track progress:

```
rm -rf .git
git init
git add -A
git commit -m"Initial commit"
```

Running `npm test` should show 9 passing tests.

![Tests passing](http://i.imgur.com/I4YRxBK.png)

Next let's delete the tests that were from the previous post that don't apply
anymore.  We can leave the `Root` tests and just delete all the comment list and
hello world tests.

```
# delete the tests
rm test/components/CommentList.spec.js
rm test/helloWorld.spec.js

# delete the CommentList component
rm src/components/CommentList.js
```

Rerunning the suite with `npm test` should now just show three passing for
`(Container) Root`.

* explain what app we'll be building

* Adjsut our Root tests to remove styling and update text

```javascript
import React from 'react';
import { shallow } from 'enzyme';
import Root from '../../src/containers/Root';

describe('(Container) Root', () => {
  const wrapper = shallow(<Root />);

  it('renders as a <div>', () => {
    expect(wrapper.type()).to.eql('div');
  });

  it('has style with height 100%', () => {
    const expectedStyles = { height: '100%' }; 
    expect(wrapper.prop('style')).to.eql(expectedStyles);
  });

  it('contains a header explaining the app', () => {
    expect(wrapper.find('.welcome-header')).to.have.length(1);
  });

  it('has correct header text', () => {
    const expected = 'Welcome To React News!';
    const node = wrapper.find('.welcome-header');
    expect(node.text()).to.eql(expected);
  });
});
```

I removed the background styling on the container since that looked terrible and
also added a test to assert our header text now properly represents the app
we're goint to build...

This should give us two failing tests that look like this:

![Failing test](http://i.imgur.com/DA5ydlQ.png)

You can see we have two nice assertion errors which can guide us to fix our root
component.  Namely these two lines: `AssertionError: expected { height: '100%',
background: '#333' } to deeply equal { height: '100%' }` and `AssertionError:
expected 'Welcome to testing React!' to deeply equal 'Welcome To React News!'`

Lets head over to the `Root` component and make those changes:

> Note if tests stop working after switching tabs make sure you're still
> using node v 5.1.0 or 4.0

This will be the same pattern we use to build the entire application.

1.  Think about what we want the app to do and look like.
2.  Write a test to make those assertions.  Watch the test fail.
3.  Write the code that makes the tests pass.
4.  Go back and see if we can do any refactoring while maintaining the test
pass.

So let's go ahead and update our `Root` container to make the tests pass. 
```javascript
// src/containers/Root.js
import React, { Component } from 'react';

const styles = { height: '100%' };

class Root extends Component {
  render() {
    return (
      <div style={styles}>
        <h1 className='welcome-header'>Welcome To React News!</h1>
      </div>
    )
  }
}

export default Root;
```

Running `npm test` should show 4 successful tests now!

> **Note** for the rest of the tutorial I will assume that you know to either
> run npm test or use the npm run test:dev to get tests passing

If you're using source control now would be a good time to commit our changes.
```
git add -A
git commit -m"Removed boilerplate tests and adjusted Root component to have
correct header"
```

Before getting into the weeds with creating our react components lets add some
flavor to the site.  In order to avoid making this into a webpack tutorial let's
just grab the Bootstrap and FontAwesome CDN's and include them in our
`dist/index.html` file like so:

```
# /dist/index.html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8"/>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/css/bootstrap.min.css" rel="stylesheet" integrity="sha256-xWeRKjzyg6bep9D1AsHzUPEWHbWMzlRc84Z0aG+tyms= sha512-mGIRU0bcPaVjr7BceESkC37zD6sEccxE+RJyQABbbKNe83Y68+PyPM5nrE1zvbQZkSHDCJEtnAcodbhlq2/EkQ==" crossorigin="anonymous">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
  </head>
  <body>
    <div id="root"></div>

    <script src="bundle.js"></script>
  </body>
</html>
```

With the addition of bootstrap let's wrap all our content inside the `Root` in a
container to keep it centered.  Test first:

```javascript
// test/containers/Root.spec.js

  ... the rest of our Root tests

  it('wraps content inside of a bootstrap container', () => {
    expect(wrapper.prop('className')).to.eql('container');
  });
});
```

`npm test` should show another failing test.  Go ahead and make this one pass
yourself by adding the `container` className to the `Root` component.  Check in
your changes to git once you have the tests passing.

## Adding News Source
The first news source we'll add to the app will be from Reddit.  Following React
best practices we should have a `container` component that wraps all the data
fetching logic.  Then we can create our `dumb` (_pure_) components to render the
views.  We'll name this container `RedditContainer`.  First, let's start with
the test:

Our first test will be somewhat of a sanity check.  The assertion will be that
there `RedditContainer` exists and that is renders a `<div>`.

```
// test/containers/RedditContainer.spec.js
import React from 'react';
import RedditContainer from 'containers/RedditContainer';
import { shallow } from 'enzyme';

describe('(Container) RedditContainer', () => {
  const wrapper = shallow(<RedditContainer />);

  it('should render as a <div>', () => {
    expect(wrapper.type()).to.eql('div');
  });
});
```

Of course after running this test it should fail since we havn't actually
created the component yet.  You should see a useful error message that looks
like this: `Error: Cannot find module "containers/RedditContainer"`

Let's go ahead and create the component and re-run our tests.  We'll just write
the minimum required to get the test passing:

```javascript
import React, { Component } from 'react';

class RedditContainer extends Component {
  render() {
    return (
      <div>
      </div>
    )
  }
}

export default RedditContainer;
```

At this point I'd like to share a workflow tip and justify all that work setting
up karma in the last post.  What I like to do at this point is split my screen
with half being my terminal, with tests running in dev mode, and the other half
with my text editor.  Inside my Vim editor I'll split the screen to have the
component tests and the actual component.  This allows me to iterate quickly and
get fast feedback in the testing process.  A visual will probably be best:

![Testing workflow](http://i.imgur.com/uKiVHag.png)

Now it's time to think about what functionality the `RedditContainer` should
have.  As a container it's primary concern is with fetching the appropriate data
and passing callbacks down to its children.  

*  Should make API request on mount to get Reddit data
*  Should manage state such as an array of posts 
*  Should manage filter state with a default to 'list'.
*  Should manage some sort of loading state

Let's write some tests to make those assertions:

```javascript
// test/containers/RedditContainer.spec.js
// same imports from previous example

describe('(Container) RedditContainer', () => {
  const wrapper = shallow(<RedditContainer />);

  it('should render as a <div>', () => {
    expect(wrapper.type()).to.eql('div');
  });

  it('should set initial state', () => {
    expect(wrapper.state('posts')).to.eql([]);
    expect(wrapper.state('filter')).to.eql('list');
    expect(wrapper.state('loading')).to.eql(false);
  });
});
```

With our live reload going we can see the tests fail in real time.  Move over to
our actual component and make updates to pass tests:

```javascript
import React, { Component } from 'react';

class RedditContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      filter: 'list',
      loading: false
    };
  }

  render() {
    return (
      <div>
      </div>
    )
  }
}

export default RedditContainer;
```

On save you should see all green!  We're on a roll now.  Our next
tests are going to be a little more advanced.  We are going to assert that when
this component mounts it fetches reddit posts.  Before we write those tests I
think it makes sense to separate the tests into two main categories: shallow
rendered tests and mounted tests.  We can use a describe block to namespace our
tests and make them more descriptive. 

```javascript
import React from 'react';
import RedditContainer from 'containers/RedditContainer';
import { shallow } from 'enzyme';

describe('(Container) RedditContainer', () => {
  describe('shallow...', () => {
    const wrapper = shallow(<RedditContainer />);

    it('should render as a <div>', () => {
      expect(wrapper.type()).to.eql('div');
    });

    it('should set initial state', () => {
      expect(wrapper.state('posts')).to.eql([]);
      expect(wrapper.state('filter')).to.eql('list');
      expect(wrapper.state('loading')).to.eql(false);
    });
  });

  describe('mounted... ', () => {

  });
});
```

Just like in the previous post we will wrap our mounted assertions in a call to
Enzyme's `describeWithDOM`

```
import React from 'react';
import RedditContainer from 'containers/RedditContainer';
import {
  shallow,
  mount,
  describeWithDOM,
  spyLifecycle
} from 'enzyme';

describe('(Container) RedditContainer', () => {
  describe('shallow...', () => {
    const wrapper = shallow(<RedditContainer />);

    it('should render as a <div>', () => {
      expect(wrapper.type()).to.eql('div');
    });

    it('should set initial state', () => {
      expect(wrapper.state('posts')).to.eql([]);
      expect(wrapper.state('filter')).to.eql('list');
      expect(wrapper.state('loading')).to.eql(false);
    });
  });

  describeWithDOM('mounted... ', () => {
    it('calls componentDidMount', () => {
      spyLifecycle(RedditContainer);

      mount(<RedditContainer />);
      expect(
        RedditContainer.prototype.componentDidMount.calledOnce
      ).to.be.true;
    });
  });
});
```

> Note: describeWithDOM will most likely be deprecated in Enzyme 2.0.  If you're
> having issues with it try just using a normal describe block.

Code to make test pass:
```javascript
import React, { Component } from 'react';

class RedditContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      filter: 'list',
      loading: false
    };
  }

  // Add in the lifecycle method
  componentDidMount() {
    console.log('mounted');
  }

  render() {
    return (
      <div>
      </div>
    )
  }
}

export default RedditContainer;
```

Next we want to assert that when the component mounts it sets the `loading`
state to true.  After that it should fetch the posts and if successful update
our `posts` state with the new data.

```javascript
describeWithDOM('mounted... ', () => {
  it('calls componentDidMount', () => {
    spyLifecycle(RedditContainer);

    mount(<RedditContainer />);
    expect(
      RedditContainer.prototype.componentDidMount.calledOnce
    ).to.be.true;
  });

  it('sets loading state on mounting to true', () => {
    const wrapper = mount(<RedditContainer />);
    expect(wrapper.state('loading')).to.be.true;
  });
});
```

To make pass:  

```javascript
  componentDidMount() {
    this.setState({loading: true});
  }
```

To test the API request we're going to need to install some packages.  First,
`isomoprhic-fetch` for actually making the request and second `nock` which is an
easy to use mocking library for mocking out the ajax request.

```unix
npm i isomorphic-fetch -S  // this is a hard dependency
npm i nock --save-dev      // this will be saved as a dev dependency since just used in tests
```

Adding nock is going to bork our karma tests with an error that looks like:
```
Error: Cannot find module "fs"
```

To fix that we can add a line to our `karma.config.js` file:
```
// karma.config.js

webpack: {
   devtool: 'inline-source-map',
   resolve: {
    root: path.resolve(__dirname, './src'),
    extensions: ['', '.js', '.jsx'],
    alias: {
      'sinon': 'sinon/pkg/sinon'
    }
  },
  // FIX HERE
  node: {
    fs: "empty"
  },
  module: {
    noParse: [
      /node_modules\/sinon\//
    ],
    loaders: [
      { test: /\.js?$/, exclude: /node_modules/, loader: 'babel' },
    ],
  },
  externals: {
    'jsdom': 'window',
    'cheerio': 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': 'window'
  },
},
```

Adding the `node: { fs: "empty" }` line into the webpack section of our karma
config should fix the issue and allow us to continue writing tests.

```javascript
import React from 'react';
import RedditContainer from 'containers/RedditContainer';
import {
  shallow,
  mount,
  describeWithDOM,
  spyLifecycle
} from 'enzyme';
import nock from 'nock';  // Added nock for testing api's

describe('(Container) RedditContainer', () => {
  describe('shallow...', () => {
    ... omitted ...
  });

  describeWithDOM('mounted... ', () => {
    ... omitted ...

    // note the addition of 'done' as an argument in this async 
    // test which we use to finish any async events like the api request

    it('fetches reddit posts on mount', (done) => {
      // simulate reddit json response
      const fakePosts = {
        data:  {
          children: [
            'post 1',
            'post 2',
          ]
        }
      };
      // mock the reddit request to return our fakePosts
      const getReddit = nock('https://www.reddit.com')
        .get('/r/reactjs.json')
        .reply(200, fakePosts);

      // mount our container
      const wrapper = mount(<RedditContainer />);

      // finish any async requests
      done();

      // container should now have the posts!
      expect(wrapper.state('posts')).to.eql(fakePosts.data.children);
    });
  });
});
```

To get the test passing:

```javascript
import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';

class RedditContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      filter: 'list',
      loading: false
    };
  }

  componentDidMount() {
    this.setState({loading: true});
    fetch('https://www.reddit.com/r/reactjs.json')
      .then(response => response.json())
      .then(json => {
        this.setState({posts: json.data.children})
      })
  }

  render() {
    return (
      <div>
      </div>
    )
  }
}

export default RedditContainer;
```

If the API request is successful we should also switch our `loading` flag to be
false.  Test first!

```javascript
```


