import Component from '@ember/component';
import { computed } from "@ember/object";

import { inject as service } from "@ember/service";
import { alias } from '@ember/object/computed';
import { validator, buildValidations } from 'ember-cp-validations';

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

export default Component.extend(Validations, {
    store: service(),
    
    init(){
        this._super(...arguments);
		this.set('cantidad', 1);
	},
    
    productos: computed(function() {
		let productosList = [];
		return this.get('store').findAll('producto').then((productos)=>{
		
			return this.get('store').findAll('distribuido').then((distribuidos)=>{
				return this.get('store').findAll('receta').then((recetas)=>{ 
					productos.forEach((producto)=>{
						productosList.pushObject(producto);
					}) 
					distribuidos.forEach((distribuido)=>{
						productosList.pushObject(distribuido)
					})
					recetas.forEach((receta)=>{
						productosList.pushObject(receta)
					})
					return productosList;
				
				})
			})
		})
    }),   

    disabledAgregar: computed('cantidad', function () {
		return Ember.isBlank(this.get('cantidad'));
	}),
	cantidadMax: computed('selectedProducto', 'selectedProducto.cantidad', function(){
		return this.get('selectedProducto.cantidad');
	}),
	plural: computed('cantidad', function(){
		return this.get('cantidad') > 1;
	}),
	valid: computed('cantidad', 'cantidadMax', function () {
		return (this.get('validations.attrs.cantidad.isValid')||this.get('disabledAgregar'))?' ': ' invalid';
	}),

    actions: {

        agregar(producto, cantidad){
        	
			this.get('myReparto.distribuciones').createRecord({
				producto: producto,
				cantidad: cantidad,
				tipo: producto.get('constructor.modelName')
			})
			this.set('cantidad', 1)
			// producto.set('cantidad', producto.get('cantidad')-cantidad)
		},
        // agregar(selectedProducto, cantidad) {  this.sendAction('agregar', selectedProducto, cantidad); },

        changePrima() {
            this.set('selectedProducto', undefined)
        }
    }

});
