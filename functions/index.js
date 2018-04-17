
const keys = require('object-keys');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const config = functions.config();

const db = require('./config/admin').db;

exports.api = functions.https.onRequest(require('./config/router'));

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
	return db.ref(`/venta/${event.params.ventaId}`).once('value').then((ventaSnap)=>{
		console.log('ventaSnap', ventaSnap.val())
		return true
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
