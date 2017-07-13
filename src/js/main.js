/**
 * Main application
 *
 * Creates 2 views: 3D and 2D
 */

import { Scene } from './scene';
import { Polyfills } from './utils/polyfills';

class Main {
  constructor() {
    Polyfills.init();
    new Scene();

    this.initUploadListener();
  }

  initUploadListener() {
    var inputElement = document.getElementById("file-input");
    inputElement.addEventListener("change", (event) => this.handleFiles(event), true);

  }

  handleFiles(e) {
    console.log('handle');
    var file = e.target.files[0]; /* now you can work with the file list */

    var reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = ()=>{
      //console.log($(reader.result));
      this.parseXML($.parseXML(reader.result));
      //var xmlData = $(reader.result);
    };
  }

  parseXML(xml) {
    console.log('parsing..');
    console.log(xml);
  }

}

document.addEventListener('DOMContentLoaded', event => new Main());
