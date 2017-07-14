/**
 * Main application
 *
 */

class Main {
  constructor() {
    this.init();
  }

  init() {
    this.csv = [];
    this.metaKeys = [ [ 'post_title', 'Last Name'], ['first_name', 'First Name'], ['job_title', 'Job Title'], ['company_name', 'Company Name'], ['email', 'Email'], ['phone', 'Phone'], ['session_title', 'Session Title'], ['session_abstract', 'Session Abstract'], ['post_content', 'Bio'] ];
    this.initUploadListener();
  }

  /**
   * handle file upload select
   */
  initUploadListener() {
    var inputElement = document.getElementById("file-input");
    inputElement.addEventListener("change", (event) => this.handleFiles(event), true);
  }

  handleFiles(e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = ()=> {
      this.xmlString = reader.result;
      let xml = $.parseXML(reader.result);
      this.$xml = $(xml);
      this.createCSV();
      this.saveCSV();
      this.showOutput();
    };
  }

  createCSV() {
    this.createTitles();
    var parser = new DOMParser();
    var xml = parser.parseFromString(this.xmlString, "text/xml");
    let items = xml.getElementsByTagName("item");

    // firefox and safari should have namespaces
    // chrome should not
    let isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    let namespace = (isChrome) ? "" : "wp:";

    for (let i=0; i<items.length; i++)
    {
      let csvItem = [];
      let item = items[i];
      let metas = item.getElementsByTagName(namespace + "postmeta");

      this.metaKeys.forEach((key)=> {
        let metaValue = '';
        for (let j=0; j<metas.length; j++) {
          let meta = metas[j];
          let metaKey = meta.getElementsByTagName(namespace + "meta_key")[0].childNodes[0].nodeValue;

          if (key[0] == metaKey) {
            metaValue = meta.getElementsByTagName(namespace + "meta_value")[0].childNodes[0].nodeValue;
          }
        }
        csvItem.push('"' + metaValue + '"');
      });

      let attachment = item.getElementsByTagName(namespace + "attachment_url")[0];
      let attachment_url = (!attachment) ? "" : attachment.childNodes[0].nodeValue;
      csvItem.push(attachment_url);
      this.csv.push(csvItem);
    }

  }

  createTitles() {
    let titles = [];
    this.metaKeys.forEach((key)=> {
      titles.push('"' + key[1] + '"');
    });
    titles.push("Photo");
    this.csv.push(titles);
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