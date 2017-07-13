(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var Scene = function () {
  function Scene() {
    classCallCheck(this, Scene);

    this.init();
  }

  createClass(Scene, [{
    key: 'init',
    value: function init() {
      this.initMouseEvents();
      this.initWindowEvents();
    }
  }, {
    key: 'initMouseEvents',
    value: function initMouseEvents() {
      var _this = this;

      document.addEventListener('mousedown', function (event) {
        return _this.onMouseDown(event);
      }, true);
      //document.addEventListener( 'click', (event) => this.onClick(event), true );
      document.addEventListener('mouseup', function (event) {
        return _this.onMouseUp(event);
      }, true);
    }
  }, {
    key: 'initWindowEvents',
    value: function initWindowEvents() {
      window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }
  }, {
    key: 'onWindowResize',
    value: function onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(event) {}
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(event) {}
  }]);
  return Scene;
}();

/**
 * Various js polyfills
 */

var PolyfillsSingleton = function () {
  function PolyfillsSingleton() {
    classCallCheck(this, PolyfillsSingleton);
  }

  createClass(PolyfillsSingleton, [{
    key: "init",
    value: function init() {
      this.initCustomEventPolyfill();
    }
  }, {
    key: "initCustomEventPolyfill",
    value: function initCustomEventPolyfill() {
      if (typeof window.CustomEvent === "function") return false;

      function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
      }

      CustomEvent.prototype = window.Event.prototype;

      window.CustomEvent = CustomEvent;
    }
  }]);
  return PolyfillsSingleton;
}();

var Polyfills = new PolyfillsSingleton();

/**
 * Main application
 *
 * Creates 2 views: 3D and 2D
 */

var Main = function Main() {
  classCallCheck(this, Main);

  Polyfills.init();
  new Scene();
};

document.addEventListener('DOMContentLoaded', function (event) {
  return new Main();
});

})));
//# sourceMappingURL=main.js.map
