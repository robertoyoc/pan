import Component from '@ember/component';
import { computed } from "@ember/object"

import { inject as service } from "@ember/service";

const dias = ["Lunes", "Martes"]

export default Component.extend({
    store: service(),
    dias,
	disabledInput: computed('radioSelect', function () {
		if(this.get('radioSelect')=='otro')
			return false
		else
			return true
    }),
    
    listaProductos: computed(function() {
		let productosList = [];
		
			return this.get('store').findAll('distribuido').then((distribuidos)=>{
					distribuidos.forEach((distribuido)=>{
						productosList.pushObject(distribuido)
					})
					return productosList;
			})
    }),   

	actions: {
		addProducto(producto) {
			this.get('myModel.productos').pushObject(producto);
		},

		deleteProducto(producto){
			producto.destroyRecord();
		},
		setRadioSelect(texto){
			this.set('radioSelect', texto)
		},

		guardar(proveedor){
			proveedor.save().then(()=>{
                this.sendAction('nuevoProveedor');
            })
        },
        addDay(day){
        	debugger
        	let dias = this.get('myModel.diasVisita');
        	dias.push(day)
        	console.log(dias)
        	console.log(day)
        },	
        removeDay(day){
        	debugger
        	console.log(day)
        },


          // agregar(selectedProducto, cantidad) {  this.sendAction('agregar', selectedProducto, cantidad); },
 
		debug(){
			debugger
		}
	}
});