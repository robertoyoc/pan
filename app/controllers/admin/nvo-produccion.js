import Controller from '@ember/controller';
import { isBlank } from '@ember/utils'
import { computed } from '@ember/object';

export default Controller.extend({
	disabledEnviar: computed('model.maquilas', 'selectedSucursal', function() {
		return this.get('model.maquilas.length')>0;
    }),

	actions: {
		delete(maquila){
			maquila.destroyRecord()
		}, 

		enviar(produccion){
			let error =false;
			
			//reparto.set('fecha', Date.now())
			produccion.set('fecha', moment().format())
			all(reparto.get('maquilas').map((maquila)=>{
				if(maquila.get('producto.cantidad') < maquila.get('cantidad')){
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
