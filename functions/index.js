
const keys = require('object-keys');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const config = functions.config();

const db = require('./config/admin').db;

exports.api = functions.https.onRequest(require('./config/router'));


let exportablesController = require('./controllers/exportables')


//	Router para API
// if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'api') {
//   
// }


//	Workers
// addToExports(require('./workers/summarize-factura'))


//	General triggers

exports.processReparto = functions.database.ref('/repartos/{repartoId}').onCreate(function (event) {
	return db.ref(`/repartos/${event.params.repartoId}`).once('value').then((repartoSnap)=>{
		let promises = []
		let reparto = repartoSnap.val()

		let sucursal = reparto.sucursal;
		let origin = reparto.origin;

		for(var distribucion_id in reparto.distribuciones){
			promises.push(
				db.ref(`/distribucions/${distribucion_id}`).once('value').then((snap)=>{
					let distribucion = snap.val()
					let tipo = distribucion.tipo
					let cantidad = distribucion.cantidad
					let producto_id = distribucion.producto
					let path = null;
					switch(tipo){
						case "receta":
							path = "receta"
							break;
						case "distribuido":
							path = "distribuidos"
							break;
					}
					return db.ref(`/existences`).orderByChild('productoId').equalTo(producto_id).once('value').then((existencesSnap)=>{

						let existencias = existencesSnap.val()

						let originRef = null;
						let sucursalRef = null;

						for(var existencia_id in existencias){

							switch(existencias[existencia_id].sucursalId){
								case sucursal:
									sucursalRef = existencia_id
									break;
								case origin: 
									originRef = existencia_id
									break
							}
								
						}
						let existencesPromises = []

						existencesPromises.push(
							db.ref(`/existences/${originRef}`).transaction(function(existencia){
								if(existencia){
									existencia.cantidad = existencia.cantidad -cantidad
								}

								return existencia
							})
						)
						existencesPromises.push(
							db.ref(`/existences/${sucursalRef}`).transaction(function(existencia){

								if(existencia){
									existencia.cantidad = existencia.cantidad +cantidad
								}

								return existencia
							})
						)


						return Promise.all(existencesPromises)


					})
					return distribucion
				})
			)
		}

		return Promise.all(promises).then((result)=>{

			console.log("Reparto procesado")
			return true
		})
	})
});

exports.processVenta = functions.database.ref('/venta/{ventaId}').onCreate(function (event) {
	let ventaSnapGeneral = null
	return db.ref(`/venta/${event.params.ventaId}`).once('value').then((ventaSnap)=>{
		let venta = ventaSnap.val()
		ventaSnapGeneral = ventaSnap
		let promises = []
		let sucursal = venta.sucursal;
		for(var pedido_id in venta.pedidos){
			promises.push(
				db.ref(`pedidos/${pedido_id}`).once('value').then((pedidoSnap)=>{
					let pedido = pedidoSnap.val()
					let producto = pedido.productoId
					let cantidad = pedido.cantidad
					return db.ref(`existences`).orderByChild(producto).once('value').then((existencesSnap)=>{
						let existencias = existencesSnap.val()
						let existenciaRef = null
						for(var existencia_id in existencias){
							if(existencias[existencia_id].sucursalId==sucursal){
								existenciaRef = existencia_id
							}		
						}
						return db.ref(`existences/${existenciaRef}`).transaction((existencia)=>{
							if(existencia){
								existencia.cantidad = existencia.cantidad - cantidad
							}
							return existencia
						})

					})
				})
			)
		}

		return Promise.all(promises).then(()=>{
			var PDFDocument = require('pdfkit');;
			var fs = require('fs');
			var	doc = new PDFDocument({
  				layout: 'landscape',
  				size: [350, 200] // a smaller document for small badge printers
			});
			
			doc.pipe(fs.createWriteStream('new-file.pdf'));
				// lógica para crear el documento PDF va aquí
				// TITULO
				doc.fontSize(14).text('PAN LA VILLITA', 25, 25);
				// CONTENIDO
				
				for(var id_pedido in venta.pedidos){
					db.ref(`pedidos/${id_pedido}`).once('value').then((pedidoSnap)=>{
						let pedido = pedidoSnap.val()

						doc.fontSize(10).text('Producto: ' + pedido.productoid+ ', Cantidad: ' + pedido.cantidad, {
	  						width: 100, // anchura en px
	  						align: 'left', // tipo de alineación (left, center, right o justify)
						});
						doc.fontSize(10).text('Precio unitario: ' + pedido.producto.precio + ', Importe: $' + pedido.total, {
	  						width: 100, 
	  						align: 'right', 
						});
					})
				}
				// TOTAL
				doc.fontSize(12).text('TOTAL: $' + venta.importeTotal, {
	  				width: 100, 
	  				align: 'right',
				});

			doc.end();

			let file =  doc;
			var ventaRef = ventaSnapGeneral.ref()
			return ventaRef.put(doc).then(function(snapshot){

			})

			console.log("Venta procesada")
			
		})
	})
});

// if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'processReparto') {
	
// }

// function addToExports(obj) {
//   keys(obj).forEach((k) => {
//     if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === k) {
//       module.exports[k] = obj[k]
//     }
//   })
// }
