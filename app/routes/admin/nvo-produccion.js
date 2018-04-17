import Route from '@ember/routing/route';
import {inject as service} from "@ember/service";

export default Route.extend({
	currentUser: service(),

	model(){
		return this.get('currentUser.account').then((account)=>{
			let produccion = this.store.createRecord('produccion', {
				sucursal: account.get('sucursal'), 
			});
			return produccion;
		})
		
	}
});
