module.exports = function() {
  let path = require('path')
  let rootPath = path.resolve('')



  function getTemplate(name) {
    console.log("obteniendo template")
    return require('./views/pdf/templates/' + name)
  }





  return function(venta, templateName) {
    console.log("enviando a renderizar")
    // process.chdir(path.resolve(rootPath, './'));
    let fonts = {
      HelveticaNeue: {
        normal: global.rootPath('./views/pdf/fonts/HelveticaNeue-01.ttf'),
        bold: global.rootPath('./views/pdf/fonts/HelveticaNeue-Bold-02.ttf'),
        italics: global.rootPath('./views/pdf/fonts/HelveticaNeue-Italic-03.ttf'),
        bolditalics: global.rootPath('./views/pdf/fonts/HelveticaNeue-BoldItalic-04.ttf')
      }
    }

    // Utils
    let _ = require('underscore')
    let PdfPrinter = require('pdfmake')
    let printer = new PdfPrinter(fonts)

    // Firebase Admin
    let admin = require("./config/admin").app
    let db = require("./config/admin").db

    let template = getTemplate(templateName)
    let defaultDd = {}


    return template.render(venta, defaultDd).then((result) => {
      return printer.createPdfKitDocument(result)

    })

  };
}();
