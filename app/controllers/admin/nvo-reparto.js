import Controller from '@ember/controller';
import { computed } from '@ember/object';
import moment from 'moment';
import { all, reject, resolve } from 'rsvp';
import {inject as service} from '@ember/service'
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';

export default Controller.extend(FindQuery, {
	currentUser: service(),
	disabledEnviar: computed('model.distribuciones', 'selectedSucursal', function() {
		return this.get('model.distribuciones.length')>0 && !Ember.isBlank(this.get('selectedSucursal'));
    }),

	actions: {
		delete(distribucion){
			let context =this
			this.get('currentUser.account').then((account)=>{
				let sucursal = account.get('sucursal')
				return new Promise(function (resolve, reject){
					context.filterEqual(context.get('store'), 'existence', { 'tipo': distribucion.get('tipo'), 'productoId': distribucion.get('productoId'),'sucursalId': sucursal.get('id')}, function(existencia){
						//console.log(mprima[0])
						return resolve(existencia[0])
					})
				}).then((existencia)=>{
					existencia.set('cantidad', parseInt(existencia.get('cantidad'))+parseInt(distribucion.get('cantidad')))
					distribucion.destroyRecord()
				})
			})
			
		}, 
		
		enviar(reparto){
			let error =false;
			
			//reparto.set('fecha', Date.now())
			reparto.set('fecha', moment().format())
			reparto.set('sucursal', this.get('selectedSucursal'))

			all(reparto.get('distribuciones').map((distribucion)=>{
				if(distribucion.get('producto.cantidad') < distribucion.get('cantidad')){
					error = true;
					reject();
				}
				else {
					resolve();
				}
			})).then((error)=>{
				
				if(!error[0]){
					all(reparto.get('distribuciones').invoke('save')).then(()=>{
						reparto.save();
					}).then(()=>{
						window.swal("Guardado!", "El reparto ha sido enviado!", "success");
					}).then(()=>{
						this.transitionToRoute('admin.inv-produccion')
					})	
				}	else {
					console.log(error);
				}				
				
			})

		}
	}
});
