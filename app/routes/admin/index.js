import Route from '@ember/routing/route';
import { inject as service } from "@ember/service"

export default Route.extend({
	store: service(),
	beforeModel(){
		// let sucursal = this.store.createRecord('sucursal')
		// sucursal.get('properties').createRecord({
		// 	nombre: 'central'
		// }).save()
		// sucursal.save()
	}
});
