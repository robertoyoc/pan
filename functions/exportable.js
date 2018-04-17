let Promise = require('promise')
  let moment = require('moment')

  let config = {
      action: 'read',
      expires: moment().add(5, 'years').format()
    }

module.exports = {



  buildTicket: function(ventaSnap){
    console.log("cargando datos")
    return new Promise(function (resolve, reject) {
      try {
        let Venta = require('./models/venta')
        return Venta.load(ventaSnap).then( function (venta) {
          console.log("venta cargada")
          let admin = require("./config/admin").app
          let bucket = admin.storage().bucket()

          let fileName = generateFilename(ventaSnap)
          let file = bucket.file(`${fileName}.pdf`)

          let uploadStream = file.createWriteStream()

          uploadStream.on('error', function (err) {
            reject(err)
          }).on('finish', function ( /*file, path*/ ) {
            console.log("creado filestream")
            return file.getSignedUrl(config).then(function (data) {
              console.log('getSignedUrl')
              let template = 'ticket'
              let pdfDoc

              if (template == 'ticket') {
                let pdfBuilder = require('./pdf-builder')
                return pdfBuilder(venta, template).then((result)=>{
                  console.log("pdf-builder result")
                  pdfDoc = result
                  pdfDoc.pipe(uploadStream)
                  pdfDoc.end()
                   let url = data[0]
                   return resolve(url)

                })
                
              }



             
            })
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

