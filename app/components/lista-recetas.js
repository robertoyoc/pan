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
		    // lte: alias('model.cantidadMax')
		})
	]
})

export default Component.extend(Validations, {
    store: service(),
    
    init(){
        this._super(...arguments);
		this.set('cantidad', 1);
	},
    
    listRecetas: computed(function() {
		let recetasList = [];
			return this.get('store').findAll('receta').then((recetas)=>{ 
				recetas.forEach((receta)=>{
					recetasList.pushObject(receta)
				})
				return recetasList;
		})
    }),   

    disabledAgregar: computed('cantidad', function () {
		return Ember.isBlank(this.get('cantidad'));
	}),

	plural: computed('cantidad', function(){
		return this.get('cantidad') > 1;
	}),

	valid: computed('cantidad', function () {
		return (this.get('validations.attrs.cantidad.isValid')||this.get('disabledAgregar'))?' ': ' invalid';
	}),

    actions: {
        agregar(producto, cantidad){
			this.get('produccion.maquilas').createRecord({
				producto: producto,
				cantidad: cantidad
			})
			this.set('cantidad', 1)
			// producto.set('cantidad', producto.get('cantidad')-cantidad)
		},
 
        changePrima() {
            this.set('selectedProducto', undefined)
        }
    }

});