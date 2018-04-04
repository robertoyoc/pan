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
		return this.get('store').findAll('producto').then((productos)=>{
		
			return this.get('store').findAll('distribuido').then((distribuidos)=>{
				return this.get('store').findAll('receta').then((recetas)=>{ 
					productos.forEach((producto)=>{
						productosList.pushObject(producto);
					}) 
					distribuidos.forEach((distribuido)=>{
						productosList.pushObject(distribuido)
					})
					recetas.forEach((receta)=>{
						productosList.pushObject(receta)
					})
					return productosList;
				
				})
			})
		})
    }),   

	actions: {
		mutRadio(texto){
			this.set('radioSelect', texto)
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
