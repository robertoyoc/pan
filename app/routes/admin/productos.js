import Route from '@ember/routing/route';
import {hash} from 'rsvp';
import {inject as service} from "@ember/service";
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';

export default Route.extend(FindQuery, {
	currentUser: service(),
	beforeModel(){
		return this.get('currentUser.account').then((account)=>{
			this.set('fixR', this.store.createRecord('existence', {
				tipo:'receta',
				sucursal: account.get('sucursal.id')

			}))

			this.set('fixD', this.store.createRecord('existence', {
				tipo:'distribuido',
				sucursal: account.get('sucursal.id')

			}))

		})
		

	},
	model(){
		
		return hash({
			recetas: this.get('currentUser.account').then((account)=>{
				let sucursal = account.get('sucursal');
				let recetasG = null

				let context = this;
				return new Promise(function (resolve, reject){

					context.filterEqual(context.store, 'existence', { 'tipo': 'receta', 'sucursalId': sucursal.get('id')}, function(recetas){
						recetasG = recetas
						return resolve(recetas)

					}).then(()=>{

					})
				}).then((recetas)=>{
					console.log(recetas)
				}).catch((error)=>{
				})
			}),
			distribuidos: this.get('currentUser.account').then((account)=>{
				let sucursal = account.get('sucursal');

				let context = this;
				return new Promise(function (resolve, reject){
					return context.filterEqual(context.store, 'existence', { 'tipo': 'distribuido', 'sucursalId': sucursal.get('id')}, function(distribuidos){
						return resolve(distribuidos)
					})
				})
			}),
		})	
	},
	afterModel(){
		this.get('fixR').destroyRecord()
		this.get('fixD').destroyRecord()
	}
});
