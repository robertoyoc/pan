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
    var fonts = {
      Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf'
      }
    };

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
