import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { validator, buildValidations } from 'ember-cp-validations';
import { all } from 'rsvp'

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
	plural: computed('cantidad', function(){
		return this.get('cantidad')>1
	}),
	valid: computed('cantidad', function () {
		return (this.get('validations.attrs.cantidad.isValid')||this.get('disabledAgregar'))?'validate': 'validate invalid';
	}),
	disabledEnviar: computed('model.reparto.distribuciones', function() {
		return this.get('model.reparto.distribuciones.length')>0
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
		enviar(reparto){
			let date = Date.now()
			let formatDate= Date.parse(date);
			reparto.set('fecha', date)
			let day = formatDate.getDate();
			let month = formatDate.getMonth()+1;
			let year = formatDate.getFullYear();

			let emberDate= year + month + year;

			// all(reparto.get('distribuciones').invoke('save')).then(()=>{
			// 	reparto.save();
			// }).then(()=>{
			// 	window.swal("Guardado!", "El reparto ha sido enviado!", "success");
			// }).then(()=>{
			// 	this.transitionToRoute('admin.inv-produccion')
			// })

		}
	}
});
