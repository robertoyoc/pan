import Component from '@ember/component';
import { computed } from "@ember/object";

import { inject as service } from "@ember/service";
import { alias } from '@ember/object/computed';
import { validator, buildValidations } from 'ember-cp-validations';

import { singularize, pluralize} from 'ember-inflector';
import Inflector from 'ember-inflector';

import FindQuery from 'ember-emberfire-find-query/mixins/find-query';

import {Promise, resolve} from "rsvp";
import DS from "ember-data";


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

export default Component.extend(Validations, FindQuery,{
    store: service(),
    currentUser: service(),
    
    init(){
        this._super(...arguments);
		this.set('cantidad', 1);
	},
    
    productos: computed(function() {
		let productosList = [];
		return this.get('store').findAll('mprima').then((mprimas)=>{
		
			return this.get('store').findAll('distribuido').then((distribuidos)=>{
				return this.get('store').findAll('receta').then((recetas)=>{ 
					mprimas.forEach((mprima)=>{
						productosList.pushObject(mprima);
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
	cantidadMax: computed('selectedProducto', 'selectedExistencia.cantidad', function(){
		return this.get('selectedExistencia.cantidad');
	}),
	selectedExistenciaPr: computed('selectedProducto', function(){
		let tipo = this.get('selectedProducto.constructor.modelName')	
		let productoId = this.get('selectedProducto.id')
		//debugger
		if(!productoId)
			return null

		let context = this;

		return DS.PromiseObject.create({
			promise: this.get('currentUser.account').then((account)=>{
				let sucursal = account.get('sucursal')

			
				return new Promise(function (resolve, reject){
					context.filterEqual(context.get('store'), 'existence', { 'tipo': tipo, 'productoId': productoId,'sucursalId': sucursal.get('id')}, function(existencia){
						//console.log(mprima[0])
						return resolve(existencia[0])
					})
				})
			})
		})	
	}),
	selectedExistencia: computed('selectedExistenciaPr.content',function(){
		return this.get('selectedExistenciaPr.content')
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

        changePrima() {
            this.set('selectedProducto', undefined)
        }
    }

});
