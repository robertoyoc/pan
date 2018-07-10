import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import {inject as service} from "@ember/service";

export default Route.extend({
  	currentUser: service(),

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
      return this.get('currentUser.account').then((account)=>{
        	return account.get('vendedorDe').then((sucursal)=>{
        		  return this.store.createRecord('venta', {
		              	propietario: account,
		              	sucursal: sucursal
		          })
        	})
      })
    }

});
