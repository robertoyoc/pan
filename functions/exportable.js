let Promise = require('promise')
let moment = require('moment')


module.exports = {



  buildTicket: function(ventaSnap, res) {
    console.log("cargando datos")
    return new Promise(function(resolve, reject) {
      try {
        let Venta = require('./models/venta')
        return Venta.load(ventaSnap).then(function(venta) {
          let filename = generateFilename(ventaSnap);
          let template = 'ticket'
          res.setHeader('Content-type', 'application/pdf')


          let pdfBuilder = require(global.rootPath('pdf-builder'))
          return pdfBuilder(venta, template).then((pdfDoc) => {
            pdfDoc.pipe(res)
            pdfDoc.end()
            return resolve(`https://us-central1-panlavillitamx.cloudfunctions.net/api/ventas/${ventaSnap.key}.pdf`)

          })


        }).catch(reject)
      } catch (e) {
        reject(e)
      }
    })


  }
}


function generateFilename(ventaSnap) {
  console.log("generando nombre")

  filename = [
    'sucursal', ventaSnap.val().sucursal,
    'ticket', ventaSnap.key,
  ].join('/')

  return filename
}
