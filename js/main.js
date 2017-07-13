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
 */

var Main = function () {
  function Main() {
    classCallCheck(this, Main);

    Polyfills.init();
    //new Scene();
    this.metaKeys = [['post_title', 'Last Name'], ['first_name', 'First Name'], ['job_title', 'Job Title'], ['company_name', 'Company Name'], ['email', 'Email'], ['phone', 'Phone'], ['session_title', 'Session Title'], ['session_abstract', 'Session Abstract'], ['post_content', 'Bio']];
    this.initUploadListener();
  }

  createClass(Main, [{
    key: 'initUploadListener',
    value: function initUploadListener() {
      var _this = this;

      var inputElement = document.getElementById("file-input");
      inputElement.addEventListener("change", function (event) {
        return _this.handleFiles(event);
      }, true);
    }
  }, {
    key: 'handleFiles',
    value: function handleFiles(e) {
      var _this2 = this;

      console.log('handle');
      var file = e.target.files[0]; /* now you can work with the file list */

      this.csv = [];

      var reader = new FileReader();
      reader.readAsText(file);
      reader.onloadend = function () {
        var xml = $.parseXML(reader.result);
        _this2.$xml = $(xml);
        _this2.parseXML();

        _this2.saveCSV();
        _this2.showOutput();
      };
    }
  }, {
    key: 'parseXML',
    value: function parseXML() {
      var _this3 = this;

      var $items = this.$xml.find("item");

      // set titles
      var titles = [];
      this.metaKeys.forEach(function (key) {
        titles.push('"' + key[1] + '"');
      });
      titles.push("Photo");
      this.csv.push(titles);

      $items.each(function (i, item) {

        var csvItem = [];
        var $item = $(item);
        var $postmeta = $item.find("postmeta");

        _this3.metaKeys.forEach(function (key) {

          var metaValue = '';
          $postmeta.each(function (j, meta) {
            var $meta = $(meta);
            var metaKey = $meta.find("meta_key").text();

            if (key[0] == metaKey) {
              metaValue = $meta.find("meta_value").text();
            }
          });
          csvItem.push('"' + metaValue + '"');
        });

        var attachment_url = $item.find("attachment_url").text();
        csvItem.push(attachment_url);

        _this3.csv.push(csvItem);
      });
    }
  }, {
    key: 'saveCSV',
    value: function saveCSV() {
      var _this4 = this;

      //var data = [["name1", "city1", "some other info"], ["name2", "city2", "more info"]];
      var csvContent = "data:text/csv;charset=utf-8,";
      this.csv.forEach(function (infoArray, index) {
        var dataString = infoArray.join(",");
        csvContent += index < _this4.csv.length ? dataString + "\n" : dataString;
      });

      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "speakers.csv");
      document.body.appendChild(link); // Required for FF
      link.click();
    }
  }, {
    key: 'showOutput',
    value: function showOutput() {
      var _this5 = this;

      var $output = $("#output");
      var $content = $output.find(".content");

      this.csv.forEach(function (item, i) {
        if (i > 0) {
          var $item = $('<div class="item mt-5 mb-3"><h3>Speaker</h3></div>');
          item.forEach(function (value, n) {
            var key = _this5.csv[0][n].replace(new RegExp('"', 'g'), "");
            value = value.replace(new RegExp('"', 'g'), "");
            var $line = $('<p><strong>' + key + ': </strong><span>' + value + '</span></p>');
            if (n == item.length - 1) {
              $line = $('<p><strong>' + key + ': </strong></p><div><img style="display:block; max-width: 800px;" src="' + value + '"></div>');
            }
            $item.append($line);
          });
          $content.append($item);
        }
      });
    }
  }]);
  return Main;
}();

document.addEventListener('DOMContentLoaded', function (event) {
  return new Main();
});

})));
//# sourceMappingURL=main.js.map
