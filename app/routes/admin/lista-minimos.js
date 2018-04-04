import Route from '@ember/routing/route';
import {inject as service} from "@ember/service";

export default Route.extend({
	currentUser: service(),
	model(){
		return this.get('currentUser.account').then((account)=>{
			let sucursal = account.get('sucursal')
			return this.store.query('existence', {
				orderBy: 'sucursal',
				equalTo: sucursal.get('id')
			})

		})
	}
});
