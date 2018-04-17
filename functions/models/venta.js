module.exports = function () {
	let _ = require('underscore')
	let Promise = require('promise')
	let path = require('path')
	let rootPath = path.resolve('')

	return {
		load: loadData
	}


	function loadData(snap) {
		//console.log("cargando Data")
		console.log("cargando Data")
		return new Promise(function (resolve, reject) {
			
			let	venta = snap.val()

			venta.ref = snap.ref
			venta.id = snap.key
			resolve(venta)
		})
	}
}()