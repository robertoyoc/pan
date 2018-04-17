'use strict';
let path = require('path')



module.exports = {
  generateTicket: function (ventaSnap) {
  	console.log("Inicia Proceso de generacion de ticket")
  	let exportable = require('../exportable')

  	return exportable.buildTicket(ventaSnap).then((url)=>{
  		return ventaSnap.ref.update({ticketUrl: url}).then(()=>{
  			return ventaSnap.ref.once('value')
  		})
  	})



  }
}