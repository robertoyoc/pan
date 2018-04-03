import Route from '@ember/routing/route';
import {inject as service} from "@ember/service";

export default Route.extend({
	currentUser: service(),
	model(){

		return this.get('currentUser.account').then((account)=>{

			let sucursal_id = account.get('sucursal.id');
			return this.store.query('reparto', {
				orderBy: 'origin',
		      	equalTo: sucursal_id
		    });
		})
		
	}
});
