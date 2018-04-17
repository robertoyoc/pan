import Route from '@ember/routing/route';
import {hash} from 'rsvp';
import {inject as service} from "@ember/service";
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';

export default Route.extend(FindQuery, {
	currentUser: service(),
	model(){
		return hash({
			recetas: this.get('currentUser.account').then((account)=>{
				let sucursal = account.get('sucursal');
				let recetasG = null

				let context = this;
				return new Promise(function (resolve, reject){
					debugger

					context.filterEqual(context.store, 'existence', { 'tipo': 'receta', 'sucursalId': sucursal.get('id')}, function(recetas){
						recetasG = recetas
						return resolve(recetas)
						debugger
					}).then(()=>{
						debugger
					})
				}).then((recetas)=>{
					debugger
					console.log(recetas)
				}).catch((error)=>{
					debugger
				})
			}),
			distribuidos: this.get('currentUser.account').then((account)=>{
				let sucursal = account.get('sucursal');

				let context = this;
				return new Promise(function (resolve, reject){
					debugger
					return context.filterEqual(context.store, 'existence', { 'tipo': 'distribuido', 'sucursalId': sucursal.get('id')}, function(distribuidos){
						return resolve(distribuidos)
					})
				})
			}),
		})	
	}
});
