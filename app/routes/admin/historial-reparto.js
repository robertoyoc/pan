import Route from '@ember/routing/route';
import {inject as service} from "@ember/service";
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';

export default Route.extend(FindQuery, {
	currentUser: service(),
	
	queryParams: {
		day: {
			refreshModel: true
		},
		month: {
			refreshModel: true
		},
		year: {
			refreshModel: true
		},
	},


	model(){
		return this.get('currentUser.account').then((account)=>{
			let sucursal_id = account.get('sucursal.id');
			let context = this;
			return new Promise(function (resolve, reject){
				context.filterEqual(context.store, 'reparto', { 'sucursal.id': sucursal_id}, function(repartos){
					return resolve(repartos)
				})
			})
		})
	}
});
