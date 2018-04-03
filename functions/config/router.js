module.exports = function () {
  let express = require("express")
  let app = express()



  // let exportablesController = require('../controllers/exportables')
  // let recargasController = require('../controllers/recargas')
  // // GET /facturas/:id
  // app.get('/facturas/:id.pdf', exportablesController.pdf)
  // app.get('/facturas/:id.xml', exportablesController.xml)
  // app.post('/recargas', recargasController.recarga)
  return app
}()
