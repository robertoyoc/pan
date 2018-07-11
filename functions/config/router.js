module.exports = function() {
  let express = require("express")
  let app = express()
  let exportablesController = require('../controllers/exportables');
  const bodyParser = require('body-parser');

  app.use(bodyParser.json()); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies



  app.get('/recargas', function(req, res) {
    console.log(req)

    res.header("Access-Control-Allow-Origin", "*");
    res.send("Hola")
  })
  app.get('/ventas/:id.pdf', exportablesController.generateTicket)




  // let exportablesController = require('../controllers/exportables')
  // let recargasController = require('../controllers/recargas')
  // // GET /facturas/:id
  // app.get('/facturas/:id.pdf', exportablesController.pdf)
  // app.get('/facturas/:id.xml', exportablesController.xml)
  // app.post('/recargas', recargasController.recarga)
  return app
}()
