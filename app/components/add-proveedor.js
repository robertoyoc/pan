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

		mutRadio(texto){
			this.set('radioSelect', texto);
			//myModel.get('diasVisita')
		},

		guardar(proveedor){
			proveedor.save().then(()=>{
                this.sendAction('nuevoProveedor');
            })
        }, 
          // agregar(selectedProducto, cantidad) {  this.sendAction('agregar', selectedProducto, cantidad); },
 
		debug(){
			debugger
		}
	}
});