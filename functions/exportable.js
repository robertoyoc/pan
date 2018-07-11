let Promise = require('promise')
let moment = require('moment')


module.exports = {



  buildTicket: function(ventaObj, res) {
    console.log("cargando datos")
    return new Promise(function(resolve, reject) {
      try {
        let Venta = require('./models/venta')
        return Venta.load(ventaObj).then(function(venta) {
          let filename = generateFilename(ventaObj);
          let template = 'ticket'
          res.setHeader('Content-type', 'application/pdf')

          let pdfBuilder = require(global.rootPath('pdf-builder'))
          return pdfBuilder(venta, template).then((pdfDoc) => {
            pdfDoc.pipe(res)
            pdfDoc.end()
            return resolve(`https://us-central1-panlavillitamx.cloudfunctions.net/api/ventas/${ventaObj.idVenta}.pdf`)

          })


        }).catch(reject)
      } catch (e) {
        reject(e)
      }
    })


  }
}


function generateFilename(ventaObj) {
  console.log("generando nombre")

  filename = [
    'sucursal', ventaObj.idSucursal,
    'ticket', ventaObj.idVenta,
  ].join('/')

  return filename
}
