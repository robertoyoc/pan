module.exports = function() {
	let _ = require('underscore')
	let Promise = require('promise')
	let path = require('path')
	let rootPath = path.resolve('')
	const db = require('../config/admin').db;


	return {
		load: loadData
	}


	function loadData(corteSnap) {
		//console.log("cargando Data")

		return new Promise((resolve, reject) => {

			// Definicion de Objeto de Venta
			let corte = corteSnap.val();
			let corteObj = {};
			corte.key = corteSnap.key;
			return db.ref(`sucursals/${corte.sucursal}`).once('value').then((sucursalSnap)=>{
				let sucursal = sucursalSnap.val()
				sucursal.key = sucursalSnap.key;
				corte.sucursal = sucursal;
				return resolve(corte)

			})
			

			


		})


	}
}()
