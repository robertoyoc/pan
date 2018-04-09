import Route from '@ember/routing/route';
import {hash} from 'rsvp';
import {inject as service} from "@ember/service";
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';

export default Route.extend(FindQuery, {
	currentUser: service(),
	model(params) {
		this.set('idProducto', params.id)
        return this.store.peekRecord('mprima', params.id)
    },
	afterModel(model){
		return this.get('currentUser.account').then((account)=>{
			let sucursal = account.get('sucursal')

			let context = this;
			return new Promise(function (resolve, reject){
				context.filterEqual(context.store, 'existence', { 'tipo': 'mprima', 'productoId': context.get('idProducto'),'sucursalId': sucursal.get('id')}, function(mprima){
					//console.log(mprima[0])
					context.set('existencia', mprima[0])
					return resolve()
				})
			})
		})
	},
	setupController(controller){
		this._super(...arguments)
		controller.set('existencia', this.get('existencia'))
	}
});
