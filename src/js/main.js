/**
 * Main application
 *
 */

import { Polyfills } from './utils/polyfills';

class Main {
  constructor() {
    Polyfills.init();
    this.metaKeys = [ [ 'post_title', 'Last Name'], ['first_name', 'First Name'], ['job_title', 'Job Title'], ['company_name', 'Company Name'], ['email', 'Email'], ['phone', 'Phone'], ['session_title', 'Session Title'], ['session_abstract', 'Session Abstract'], ['post_content', 'Bio'] ];
    this.initUploadListener();
  }

  initUploadListener() {
    var inputElement = document.getElementById("file-input");
    inputElement.addEventListener("change", (event) => this.handleFiles(event), true);
  }

  handleFiles(e) {
    var file = e.target.files[0];
    this.csv = [];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = ()=>{
      let xml = $.parseXML(reader.result);
      this.$xml = $(xml)
      this.createCSV();
      this.saveCSV();
      this.showOutput();
    };
  }

  createCSV() {

    let $items = this.$xml.find("item");

    // set titles
    let titles = [];
    this.metaKeys.forEach((key)=> {
      titles.push('"' + key[1] + '"');
    });
    titles.push("Photo");
    this.csv.push(titles);

    $items.each((i, item) => {

      let csvItem = [];
      let $item = $(item);
      let $postmeta = $item.find("postmeta");

      this.metaKeys.forEach((key)=> {

        let metaValue = '';
        $postmeta.each((j, meta)=> {
          let $meta = $(meta);
          let metaKey = $meta.find("meta_key").text();

          if (key[0] == metaKey) {
            metaValue = $meta.find("meta_value").text();
          }
        });
        csvItem.push('"' + metaValue + '"');
      });

      let attachment_url = $item.find("attachment_url").text();
      csvItem.push(attachment_url);

      this.csv.push(csvItem);
    });
  }

  saveCSV() {
    var csvContent = "data:text/csv;charset=utf-8,";
    this.csv.forEach((infoArray, index)=>{
      let dataString = infoArray.join(",");
      csvContent += index < this.csv.length ? dataString+ "\n" : dataString;
    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "speakers.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
  }

  showOutput() {
    let $output = $("#output");
    $output.show();
    let $content = $output.find(".content");
    $content.empty();

    this.csv.forEach((item, i) => {
      if (i > 0) {
        let $item = $('<div class="item mt-5 mb-3"><h3>Speaker</h3></div>');
        item.forEach((value, n) => {
          let key = this.csv[0][n].replace(new RegExp('"', 'g'), "");
          value = value.replace(new RegExp('"', 'g'), "");
          let $line = $('<p><strong>' + key + ': </strong><span>' + value + '</span></p>');
          if (n == item.length - 1) {
            $line = $('<p><strong>' + key + ': </strong></p><div><img style="display:block; max-width: 800px;" src="' + value + '"></div>');
          }
          $item.append($line);
        });
        $content.append($item);
      }
    });

  }

}

document.addEventListener('DOMContentLoaded', event => new Main());
