import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
	disabledAgregar: computed('cantidad', function () {
		return Ember.isBlank(this.get('cantidad'));
	}),
	actions: {
		foo(){
			
		},
		changePrima(){
			this.set('selectedPrima', undefined)
		},
		agregar(producto, cantidad){
			this.get('model.reparto.distribuciones').createRecord({
				producto: producto,
				cantidad: cantidad
			})
			this.set('cantidad', undefined)

		},
		delete(distribucion){
			distribucion.destroyRecord()
		}, 
		enviar(){

		}
	}
});
