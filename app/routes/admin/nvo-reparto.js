import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
	beforeModel(){
		/*
		this.store.createRecord('sucursal', {
		 	nombre: "Palmar",
		 }).save()	
		*/
		/*
		this.store.createRecord('producto', {
			nombre: "Coca-cola 600ml",
			precio: 10,
			categoria: "bebidas",
			unidad: "botella",
			cantidad: 10
		 }).save()
		 this.store.createRecord('producto', {
			nombre: "Galletas Marías",
			precio: 15,
			categoria: "alimentos",
			unidad: "paquete",
			cantidad: 15
		 }).save()*/
		
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
