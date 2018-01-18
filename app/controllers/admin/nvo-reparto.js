import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
	'cantidad': [
		validator('presence', true),
		validator('number', {
		  allowString: true,
		  integer: true,
		  gt: 0,
		  lte: alias('model.cantidadMax')
		})
	]
})

export default Controller.extend(Validations, {
	disabledAgregar: computed('cantidad', function () {
		return Ember.isBlank(this.get('cantidad'));
	}),
	cantidadMax: computed('selectedProducto', function(){
		return this.get('selectedProducto.cantidad')
	}),
	actions: {
		foo(){
			
		},
		changePrima(){
			this.set('selectedProducto', undefined)
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
