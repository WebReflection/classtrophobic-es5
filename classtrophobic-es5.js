var Class = (function (Object) {'use strict';
  /*! (C) 2017 Andrea Giammarchi - MIT Style License */
  var
    reserved = ['constructor', 'extends', 'static'],
    ObjectProto = Object.prototype,
    gPO = Object.getPrototypeOf ||
          function (o) { return o.__proto__; },
    sPO = Object.setPrototypeOf ||
          function (o, p) { o.__proto__ = p; return o; },
    gOPD = Object.getOwnPropertyDescriptor,
    ownKeys = Object.getOwnPropertySymbols ?
          function ownKeys(o) {
            return Object.getOwnPropertySymbols(o)
                   .concat(Object.getOwnPropertyNames(o));
          } :
          Object.getOwnPropertyNames,
    defineProperty = Object.defineProperty,
    defProps = Object.defineProperties,
    superPropertyDescriptor = {
      get: function () {
        var
          Super = function () {
            var result;
            sPO(self, gPO(proto));
            try { result = self.constructor.apply(self, arguments); }
            finally { sPO(self, proto); }
            return result ? sPO(result, proto) : self;
          },
          self = this,
          proto = gPO(self),
          parent = proto
        ;
        if (proto) {
          sPO(Super, proto);
          do {
            ownKeys(parent).forEach(function (prop) {
              if (Super.hasOwnProperty(prop)) return;
              var
                descriptor = gOPD(parent, prop),
                method = descriptor.value
              ;
              if (typeof method === 'function') {
                descriptor.value = function () {
                  var result, parent = proto;
                  do { parent = gPO(parent); }
                  while ((method === parent[prop]));
                  try { result = parent[prop].apply(sPO(self, parent), arguments); }
                  finally { sPO(self, proto); }
                  return result;
                };
                defineProperty(Super, prop, descriptor);
              }
            });
          } while ((parent = gPO(parent)) && parent !== ObjectProto);
        }
        return Super;
      }
    },
    superStaticDescriptor = {
      get: function () {
        var Super = {}, self = this, parent = self;
        do {
          ownKeys(parent).forEach(function (prop) {
            var
              descriptor = gOPD(parent, prop),
              method = descriptor.value
            ;
            if (typeof method === 'function') {
              descriptor.value = function () {
                var
                  proto = gPO(self), method = self[prop],
                  result, parent = proto
                ;
                while ((method === parent[prop])) parent = gPO(parent);
                self.method = parent[prop];
                try { result = self.method.apply(sPO(self, gPO(parent)), arguments); }
                finally { sPO(self, proto).method = method; }
                return result;
              };
              defineProperty(Super, prop, descriptor);
            }
          });
        } while((parent = gPO(parent)) && parent !== Function);
        return Super;
      }
    }
  ;
  return function Classtrophobic(definition) {
    var
      Constructor = definition.constructor,
      Statics = definition['static'],
      Super = definition['extends'],
      Class = definition.hasOwnProperty('constructor') ?
        function () {
          return Constructor.apply(this, arguments) || this;
        } :
        (Super ?
          function () {
            var result = Super.apply(this, arguments);
            return result ? sPO(result, Class.prototype) : this;
          } :
          function () {}
        ),
      Static = {
        'super': superStaticDescriptor
      },
      Prototype = {
        'super': superPropertyDescriptor
      }
    ;
    if (Super) {
      sPO(Class, Super);
      sPO(Class.prototype, Super.prototype);
    }
    ownKeys(definition)
      .forEach(function (key) {
        if (reserved.indexOf(key) < 0) {
          Prototype[key] = gOPD(definition, key);
          Prototype[key].enumerable = false;
        }
      });
    defProps(Class.prototype, Prototype);
    if (Statics) ownKeys(Statics).forEach(function (key) {
      Static[key] = gOPD(Statics, key);
      Static[key].enumerable = false;
    });
    return defProps(Class, Static);
  };
})(Object);
try { module.exports = Class; } catch(o_O) {}
