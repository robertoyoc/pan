import Route from '@ember/routing/route';
import {hash} from 'rsvp';
import {inject as service} from "@ember/service";
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';
import {all} from 'rsvp';

export default Route.extend(FindQuery, {
	currentUser: service(),
	beforeModel(){
		/*
		// this.get('currentUser.account').then((account)=>{
		this.get('store').findAll('sucursal').then((sucursales)=>{
			this.get('store').findAll('receta').then((recetas)=>{
				//this.get('store').findAll('distribuido').then((distribuidos)=>{
					all(
						sucursales.map((sucursal)=>{
								return sucursal.get('existencias').then((recetasExs)=>{
									return recetas.map((receta)=>{
										return this.get('store').createRecord('existence', {
											tipo: 'receta',
											cantidad: 1000,
											limite: 100,
											sucursal: sucursal,
											receta: receta
										}).save().then((recetaExist)=>{
											recetasExs.pushObject(recetaExist)
											return recetasExs.save().then(()=>{
												return sucursal.save().then(()=>{
													return receta.get('existencias').then((existenciasList)=>{
														existenciasList.pushObject(recetaExist)
														return existenciasList.save().then(()=>{
															return receta.save();
														})
													})
												})
											})
										})
									})
								})
						})
					)
			//	})
			})
			})
	//	})
	*/
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
					context.filterEqual(context.store, 'existence', { 'tipo': 'distribuido', 'sucursa.id': sucursal.get('id')}, function(distribuidos){
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
