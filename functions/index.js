
const keys = require('object-keys');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const config = functions.config();

const db = require('./config/admin').db;

//	Router para API
// if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'api') {
//   exports.api = functions.https.onRequest(require('./config/router'));
// }


//	Workers
// addToExports(require('./workers/summarize-factura'))


//	General triggers

exports.processReparto = functions.database.ref('/repartos/{repartoId}').onCreate(function (event) {
	db.ref(`/repartos/${event.params.repartoId}`).once('value').then((repartoSnap)=>{
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
					switch(path){
						case "receta":
							path = "receta"
							break;
						case "distribuido":
							path = "distribuidos"
							break;
					}
					return db.ref(`/${path}/${producto_id}`)

					return distribucion
				})
			)
		}

		Promise.all(promises).then((result)=>{
			console.log(result)
		})
	})
	// console.log(event.data.val())
	// console.log(event.params)
	return db.ref(`/facturas/${event.params.repartoId}`).set({ path: `asdasdssad` });
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
