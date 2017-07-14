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

/**
 * Main application
 *
 */

var Main = function () {
  function Main() {
    classCallCheck(this, Main);

    this.init();
  }

  createClass(Main, [{
    key: 'init',
    value: function init() {
      this.csv = [];
      this.metaKeys = [['post_title', 'Last Name'], ['first_name', 'First Name'], ['job_title', 'Job Title'], ['company_name', 'Company Name'], ['email', 'Email'], ['phone', 'Phone'], ['session_title', 'Session Title'], ['session_abstract', 'Session Abstract'], ['post_content', 'Bio']];
      this.initUploadListener();
    }

    /**
     * handle file upload select
     */

  }, {
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

      var file = e.target.files[0];
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onloadend = function () {
        _this2.xmlString = reader.result;
        var xml = $.parseXML(reader.result);
        _this2.$xml = $(xml);
        _this2.createCSV();
        _this2.saveCSV();
        _this2.showOutput();
      };
    }
  }, {
    key: 'createCSV',
    value: function createCSV() {
      var _this3 = this;

      this.createTitles();
      var parser = new DOMParser();
      var xml = parser.parseFromString(this.xmlString, "text/xml");
      var items = xml.getElementsByTagName("item");

      // firefox and safari should have namespaces
      // chrome should not
      var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      var namespace = isChrome ? "" : "wp:";

      var _loop = function _loop(i) {
        var csvItem = [];
        var item = items[i];
        var metas = item.getElementsByTagName(namespace + "postmeta");

        _this3.metaKeys.forEach(function (key) {
          var metaValue = '';
          for (var j = 0; j < metas.length; j++) {
            var meta = metas[j];
            var metaKey = meta.getElementsByTagName(namespace + "meta_key")[0].childNodes[0].nodeValue;

            if (key[0] == metaKey) {
              metaValue = meta.getElementsByTagName(namespace + "meta_value")[0].childNodes[0].nodeValue;
            }
          }
          csvItem.push('"' + metaValue + '"');
        });

        var attachment = item.getElementsByTagName(namespace + "attachment_url")[0];
        var attachment_url = !attachment ? "" : attachment.childNodes[0].nodeValue;
        csvItem.push(attachment_url);
        _this3.csv.push(csvItem);
      };

      for (var i = 0; i < items.length; i++) {
        _loop(i);
      }
    }
  }, {
    key: 'createTitles',
    value: function createTitles() {
      var titles = [];
      this.metaKeys.forEach(function (key) {
        titles.push('"' + key[1] + '"');
      });
      titles.push("Photo");
      this.csv.push(titles);
    }
  }, {
    key: 'saveCSV',
    value: function saveCSV() {
      var _this4 = this;

      var csvContent = "";

      this.csv.forEach(function (infoArray, index) {
        var dataString = infoArray.join(",");
        csvContent += index < _this4.csv.length ? dataString + "\n" : dataString;
      });

      if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }), "speakers.csv");
      } else {
        var encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "speakers.csv");
        document.body.appendChild(link); // Required for FF
        link.click();
      }
    }
  }, {
    key: 'showOutput',
    value: function showOutput() {
      var _this5 = this;

      var $output = $("#output");
      $output.show();
      var $content = $output.find(".content");
      $content.empty();

      this.csv.forEach(function (item, i) {
        if (i > 0) {
          var $item = $('<div class="item mt-5 mb-3"><h3>Speaker</h3></div>');
          item.forEach(function (value, n) {
            var key = _this5.csv[0][n].replace(new RegExp('"', 'g'), "");
            value = value.replace(new RegExp('"', 'g'), "");
            var $line = $('<p><strong>' + key + ': </strong><span>' + value + '</span></p>');
            if (n == item.length - 1) {
              $line = $('<p><strong>' + key + ': </strong></p><div><img style="display:block; max-width: 800px;" src="' + value + '" alt="Speaker Photo" title="Speaker Photo"></div>');
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
