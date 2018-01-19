import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
	beforeModel(){
		// this.store.createRecord('distribuido', {
		// 	nombre: "Coca-cola",
		// 	categoria: "bebidas",
		// 	unidad: 'unidad'
		// }).save()	
		// this.store.createRecord('sucursal', {
		// 	nombre: "villita",
		// }).save()
	},
	model(){
		let productos = [];
		return this.store.findAll('receta').then((recetas)=>{
			this.store.findAll('distribuido').then((distribuidos)=>{
				recetas.forEach((receta)=>{
					productos.pushObject(receta)
				})
				distribuidos.forEach((distribuido)=>{
					productos.pushObject(distribuido)
				})
			})
		}).then(()=>{
			return hash({
				productos: productos,
				reparto: this.store.createRecord('reparto'),
				sucursales: this.store.findAll('sucursal')
			})
		})

		
	}
});
