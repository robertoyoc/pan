'use strict';
let path = require('path')
const db = require('../config/admin').db;

function findVenta(id) {
	function findById(id) {
		return db.ref('venta').child(id).once('value').then(function(snap) {
			let val = snap.val()
			if (val) return snap
			return Promise.reject('Not found by id')
		})
	}
	return findById(id)
}

module.exports = {
	generateTicket: function(req, res) {

		console.log("Inicia Proceso de generacion de ticket")
		let id = req.params.id
		if (!id) {
			console.log('ticket not found')
			return false
		}

		let exportable = require('../exportable')
		return findVenta(id).then((ventaSnap) => {
			// Definicion de Objeto de Venta
			let venta = ventaSnap.val();
			let ventaObj= {};

			ventaObj.idVenta = ventaSnap.key;
			console.log('Venta: ', ventaObj.idVenta)
			ventaObj.importeT =  ventaSnap.val().importeTotal;
			ventaObj.importeC =  ventaSnap.val().importeCortesia;
			ventaObj.fecha = ventaSnap.val().fechaUnix;

			let promisesVenta = [];
			for(var id_pedido in venta.pedidos){
				promisesVenta.push(
					db.ref(`pedidos/${id_pedido}`).once('value').then((pedidoSnap)=>{
						let pedido = pedidoSnap.val()
						//console.log('Pedido: ', pedido)
						let path = null;
						switch(pedido.tipo){
							case "receta":
								path = "receta"
								break;
							case "distribuido":
								path = "distribuidos"
								break;
						}
						return db.ref(`${path}/${pedido.productoId}`).once('value').then((productoSnap)=>{
							//console.log('Producto: ', productoSnap.val())
							return {
								cantidad: pedido.cantidad,
								producto: productoSnap.val()
							}
						})
					})
				)
			}
			let sucursal_id = ventaSnap.val().sucursal;
			ventaObj.idSucursal = nVenta;
			console.log('Sucursal: ', sucursal_id);
			let vendedor_id = ventaSnap.val().propietario;
			return db.ref(`sucursals/${sucursal_id}`).once('value').then((sucursalSnap)=>{
				ventaObj.nombreSucursal = sucursalSnap.val().nombre;
				return db.ref(`accounts/${vendedor_id}`).once('value').then((propietarioSnap)=>{
					ventaObj.nombreVendedor = propietarioSnap.val().nombre;

					return Promise.all(promisesVenta).then((nVenta)=>{
							ventaObj.pedidos = nVenta;

							// Info. Lista, Construyendo Ticket
							return exportable.buildTicket(ventaObj, res).then((url) => {
								console.log('url', url)
								return ventaSnap.ref.update({ ticketUrl: url }).then(() => {
									return ventaSnap.ref.once('value')
								})
							})

					})

				})
			})

		})
	}
}
