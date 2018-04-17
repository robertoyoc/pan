import Route from '@ember/routing/route';
import {inject as service} from "@ember/service";
import { isEmpty } from '@ember/utils';
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';

export default Route.extend(FindQuery, {
	currentUser: service(),
	beforeModel(){
		return this.get('currentUser.account').then((account)=>{
			this.set('fixM', this.store.createRecord('existence', {
				tipo:'mprima',
				sucursal: account.get('sucursal.id')

			}))

		})

	},

	model(){
		return this.get('currentUser.account').then((account)=>{
			let sucursal = account.get('sucursal')
			
			let context = this;
			return new Promise(function (resolve, reject){
				context.filterEqual(context.store, 'existence', { 'tipo': 'mprima', 'sucursalId': sucursal.get('id')}, function(mprimas){
					// console.log(mprimas)
					return resolve(mprimas)
				})
				//debugger
				//return resolve()
			})
		})
	},
	afterModel(){
		this.get('fixM').destroyRecord()
	}
});
