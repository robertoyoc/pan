import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({

    beforeModel(){
        /* 
		this.store.createRecord('producto', {
			nombre: "Coca-cola 1l",
			precio: 15,
			categoria: "bebidas",
			unidad: "botella",
			cantidad: 34
		 }).save()
		 this.store.createRecord('producto', {
			nombre: "Galletas Animalitos",
			precio: 10,
			categoria: "alimentos",
			unidad: "paquete",
			cantidad: 16
		 }).save()
		 */
    },

    model() {
		// return hash() this.store.createRecord('venta');
		return hash({
              venta: this.store.createRecord('venta'),
              cortesia: this.store.createRecord('courtesy')
        });
    }

});
