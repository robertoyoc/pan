import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import moment from 'moment';
import {inject as service} from "@ember/service";

export default Route.extend({
	currentUser: service(),
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
		 }).save()
		 */
		/*
		this.store.createRecord('distribuido', {
			nombre: "pepsi 600ml",
			precio: 8,
			categoria: "bebidas",
			unidad: "botella",
			cantidad: 20
		 }).save()
		 this.store.createRecord('receta', {
			nombre: "cuernito",
			precio: 5,
			categoria: "panes",
			unidad: "pieza",
			cantidad: 45
		 }).save()
		 */
	},
	model(){
		return this.get('currentUser.account').then((account)=>{
			let reparto = this.store.createRecord('reparto', {
				origin: account.get('sucursal'), 
			});
			return reparto;
		})
		
	}
});
