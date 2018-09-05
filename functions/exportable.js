let Promise = require('promise')
let moment = require('moment')


module.exports = {
  buildTicket: function(ventaSnap, res) {
    console.log("cargando datos")
    return new Promise(function(resolve, reject) {
      try {
        let Venta = require('./models/venta')
        return Venta.load(ventaSnap).then(function(ventaObj) {
          let filename = generateFilename(ventaObj);
          let template = 'ticket'
          res.setHeader('Content-type', 'application/pdf')

          let pdfBuilder = require(global.rootPath('pdf-builder'))
          return pdfBuilder(ventaObj, template).then((pdfDoc) => {
            pdfDoc.pipe(res)
            pdfDoc.end()
            return resolve(`https://us-central1-panlavillitamx.cloudfunctions.net/api/ventas/${ventaObj.idVenta}.pdf`)

          })


        }).catch(reject)
      } catch (e) {
        reject(e)
      }
    })


  },
  buildCorte: function(corteSnap, res) {
    console.log("cargando datos")
    return new Promise(function(resolve, reject) {
      try {
        let Corte = require('./models/corte');
        return Corte.load(corteSnap).then(function(corteObj) {
          let filename = `corte-${corteObj.key}`;
          let template = 'corte'
          res.setHeader('Content-type', 'application/pdf')

          let pdfBuilder = require(global.rootPath('pdf-builder'))
          return pdfBuilder(corteObj, template).then((pdfDoc) => {
            pdfDoc.pipe(res)
            pdfDoc.end()
            return resolve(`https://us-central1-panlavillitamx.cloudfunctions.net/api/cortes/${corteObj.key}.pdf`)

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
    'ticket', ventaObj.idVenta, '.pdf'
  ].join('/')

  return filename
}
