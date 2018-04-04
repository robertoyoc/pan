import Route from '@ember/routing/route';

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
        return this.store.createRecord('venta');
    }

});
