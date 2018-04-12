module.exports = function () {
  let express = require("express")
  let app = express()

	app.get('/recargas', function(req, res){
		console.log(req)

		res.header("Access-Control-Allow-Origin", "*");
		res.send("Hola")
	})



  // let exportablesController = require('../controllers/exportables')
  // let recargasController = require('../controllers/recargas')
  // // GET /facturas/:id
  // app.get('/facturas/:id.pdf', exportablesController.pdf)
  // app.get('/facturas/:id.xml', exportablesController.xml)
  // app.post('/recargas', recargasController.recarga)
  return app
}()
