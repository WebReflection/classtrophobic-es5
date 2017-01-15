# Classtrophobic ES5

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

## Requirements
At least the annex B `__proto__` accessor should be there.
This means pretty much every Mobile browser and every Desktop one, starting from IE11.

