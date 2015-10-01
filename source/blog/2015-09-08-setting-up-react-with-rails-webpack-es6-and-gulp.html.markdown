---
title: "Setting Up React With Rails: Webpack, ES6, and Gulp"
date: 2015-09-08 23:41 UTC
tags: ruby, rails, react, tutorials
published: false
---

The goal of this tutorial is to explain how to set up React with Rails in a
sustainable way that you can use in production.  My co-workers and I spent a few
days in frustration trying to figure out the best way to integrate React into
our Rails app.  Hopefully this helps others avoid that pain.

READMORE

### Create new rails app
My rails generator of choice is `make_it_so`.  It comes packaged with
Foundation, RSpec, Postgres, and a few tests already written.  To see what
`make_it_so` comes with check out the [repository](https://github.com/LaunchAcademy/make_it_so).


`gem install make_it_so`  
`make_it_so rails react_on_rails`  
`cd react_on_rails`  

Now run the typical commands to set a Rails app up:  

```terminal  
rake db:create db:migrate db:test:prepare  
rspec spec    # to confirm all tests are passing
```

If you run into any DB errors make sure you have Postgres running (big elephant
in your topbar)












