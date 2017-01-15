# Classtrophobic ES5 [![build status](https://secure.travis-ci.org/WebReflection/classtrophobic-es5.svg)](http://travis-ci.org/WebReflection/classtrophobic-es5)

Project [Classtrophobic](https://github.com/WebReflection/classtrophobic) can work on older browsers too.

No `class` or `Proxy` used in here, and the only caveat is that subclasses with a constructor must return the `super` instance.

```js
var List = Class({
  extends: Array,
  constructor: function () {
    // super might promote current instance
    var self = this.super();
    // be sure you use the right reference
    self.push.apply(self, arguments);
    // and remember to return it
    return self;
  },
  push: function () {
    // constructor a part, everything else is the same
    this.super.push.apply(this, arguments);
    // make push chainable for demo purpose
    return this;
  }
});
```



### Which Version For My Targets?

You can test live both [classtrophobic](https://webreflection.github.io/classtrophobic/test.html) and [classtrophobic-es5](https://webreflection.github.io/classtrophobic-es5/test.html).
If the page turns out green, you're good to go!

The main difference is that ES5 version has a greedy runtime when it comes to `super` usage,
while this original version uses real classes and delegate to Proxy access the `super` resolution,
working only when a method is accessed and per single method, as opposite of runtime setup for all methods in the es5 case.

<sup><sub>Luckily overrides are not the most frequent thing ever.</sub></sup>



## Requirements
At least the annex B `__proto__` accessor should be there.
This means pretty much every Mobile browser and every Desktop one, starting from IE11.

