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

function findCorte(id) {
	return db.ref('boxCuts').child(id).once('value').then(function(snap) {
		let val = snap.val()
		if (val) return snap
		return Promise.reject('Not found by id')
	})
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
			return exportable.buildTicket(ventaSnap, res).then((url) => {
				return ventaSnap.ref.update({ ticketUrl: url }).then(() => {
					return ventaSnap.ref.once('value')
				})
			})

		})
	},
	generateCorte: function(req, res) {
		console.log("Inicia Proceso de generacion de corte")
		let id = req.params.id
		if (!id) {
			console.log('corte not found')
			return false
		}

		let exportable = require('../exportable')
		return findCorte(id).then((corteSnap) => {
			return exportable.buildCorte(corteSnap, res).then((url) => {
				return corteSnap.ref.update({ fileUrl: url }).then(() => {
					return corteSnap.ref.once('value')
				})
			})

		})

	}
}
