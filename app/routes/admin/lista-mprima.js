import Route from '@ember/routing/route';
import {inject as service} from "@ember/service";
import { isEmpty } from '@ember/utils';
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';

export default Route.extend(FindQuery, {
	currentUser: service(),

	model(){
		return this.get('currentUser.account').then((account)=>{
			let sucursal = account.get('sucursal')
			// return this.store.query('existence', {		
			// 	orderBy: 'sucursal',
			// 	equalTo: sucursal.get('id')
			// })
			
			let context = this;
			
			return new Promise(function (resolve, reject){

				context.filterEqual(context.store, 'existence', { 'tipo': 'mprima', 'sucursalId': sucursal.get('id')}, function(mprimas){
					console.log(mprimas)
					debugger
					return resolve(mprimas)
					
				})
				debugger
				//return resolve()

			})
		})
	}
});
