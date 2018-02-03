import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { validator, buildValidations } from 'ember-cp-validations';
import { all, reject, resolve } from 'rsvp';

import { singularize, pluralize} from 'ember-inflector';
import Inflector from 'ember-inflector';

const inflector = Inflector.inflector;

 inflector.irregular('unidad', 'unidades');
 inflector.irregular('costal', 'costales');

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
	cantidadMax: computed('selectedProducto', 'selectedProducto.cantidad', function(){
		return this.get('selectedProducto.cantidad')
	}),
	plural: computed('cantidad', function(){
		return this.get('cantidad')>1
	}),
	valid: computed('cantidad', 'cantidadMax', function () {
		return (this.get('validations.attrs.cantidad.isValid')||this.get('disabledAgregar'))?' ': ' invalid';
	}),
	disabledEnviar: computed('model.reparto.distribuciones', 'selectedSucursal', function() {
		return this.get('model.reparto.distribuciones.length')>0 && !Ember.isBlank(this.get('selectedSucursal'))
	}),
	init(){
		this.set('cantidad', 1)
		
	},
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
			this.set('cantidad', 1)
			producto.set('cantidad', producto.get('cantidad')-cantidad)

		},
		delete(distribucion){
			distribucion.destroyRecord()
		}, 
		enviar(reparto){
			let error =false;
			reparto.set('fecha', Date.now())
			reparto.set('sucursal', this.get('selectedSucursal'))


			all(reparto.get('distribuciones').map((distribucion)=>{
				if(distribucion.get('producto.cantidad')<distribucion.get('cantidad')){
					error = true;
					reject();
				}
				else resolve();
			})).then((error)=>{
				if(!error){
					all(reparto.get('distribuciones').invoke('save')).then(()=>{
						reparto.save();
					}).then(()=>{
						window.swal("Guardado!", "El reparto ha sido enviado!", "success");
					}).then(()=>{
						this.transitionToRoute('admin.inv-produccion')
					})	
				}
					
				
			})

			

		}
	}
});
