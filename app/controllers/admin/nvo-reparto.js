import Controller from '@ember/controller';
import { computed } from '@ember/object';

import { all, reject, resolve } from 'rsvp';

export default Controller.extend({
	disabledEnviar: computed('model.distribuciones', 'selectedSucursal', function() {
		return this.get('model.distribuciones.length')>0 && !Ember.isBlank(this.get('selectedSucursal'));
    }),

	actions: {
		foo(){
			
		},

		delete(distribucion){
			distribucion.destroyRecord()
		}, 
		enviar(reparto){
			let error =false;
			reparto.set('fecha', Date.now())
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
