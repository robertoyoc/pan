import Route from '@ember/routing/route';
import {hash} from 'rsvp';
import {inject as service} from "@ember/service";
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';
import {all} from 'rsvp';

export default Route.extend(FindQuery, {
	currentUser: service(),
	beforeModel(){
		
	},
	model(){
		return hash({
			recetas: this.get('currentUser.account').then((account)=>{
				let sucursal = account.get('administradorDe');
				this.set('sucursal', sucursal.get('id'));

				let context = this;
				return new Promise(function (resolve, reject){
					// debugger
					context.filterEqual(context.store, 'existence', { 'tipo': 'receta', 'sucursal.id': sucursal.get('id')}, function(recetas){
						// console.log(recetas)
						return resolve(recetas)
					})
				})
			}),
			distribuidos: this.get('currentUser.account').then((account)=>{
				let sucursal = account.get('administradorDe');
				let context = this;
				return new Promise(function (resolve, reject){
					context.filterEqual(context.store, 'existence', { 'tipo': 'distribuido', 'sucursal.id': sucursal.get('id')}, function(distribuidos){
						return resolve(distribuidos)
					})
				})
			}),
		})
	},

	setupController(controller, model){
		this._super(...arguments);
	}
});
