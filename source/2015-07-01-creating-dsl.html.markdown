---
title: Creating a DSL in Ruby
date: 2015-07-01
tags: ruby
---

Recently I built a small DSL for work that allows users to sync data to MongoDB
from any external API.  It was my first time making a DSL so I decided to
document a few things that helped me get started:

1.  Using Ruby's `included` hook to extend class methods

```ruby
module CustomDsl
  def included(base_class)
    base_class.extend(DslClassMethods)
  end

  def instance_method_here
    self.class.get_class_method
  end
end

module DslClassMethods
  def class_method_name(conn)
    @_class_method_name = conn
  end

  def get_class_method
    @_class_method_name
  end
end
```

Now we can define a class macro when we include our DSL and access the attribute
on the instance level.  For example:

```ruby
class Example
  include CustomDsl

  class_method_name :apple
end

foo = Example.new

foo.instance_method_here # => :apple
```

### To Be Continued...
