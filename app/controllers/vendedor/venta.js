import Controller from '@ember/controller';
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import { isBlank } from '@ember/utils';
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';

export default Controller.extend(FindQuery, {
	selectedPrecio: "all",

	store: service(),

	init(){
		this.set('cantProduct',0);
	},

	venta: computed('venta_id', function(){
		return this.store.peekRecord('venta', this.get('venta_id'))
	}),

	precios: [1.5, 2.0, 5.0, 6.0, 7.0, 7.5, 8.0, 8.5, 10.0],
	// Fuente: http://www3.inegi.org.mx/sistemas/inp/preciospromedio/
	// Tulancingo, CDMX

	myProductos: computed('selectedPrecio', function() {
		if (this.get('selectedPrecio')=="all"){
			let productosList = [];
			return this.get('store').findAll('distribuido').then((distribuidos)=>{
				return this.get('store').findAll('receta').then((recetas)=>{
					distribuidos.forEach((distribuido)=>{
						productosList.pushObject(distribuido)
					})
					recetas.forEach((receta)=>{
						productosList.pushObject(receta)
				})
					return productosList;
				})
			})
		} else {
			let productList = [];
			let context = this;
			return new Promise(function (resolve, reject){
				context.filterEqual(context.get('store'), 'distribuido', {
						'precio': context.get('selectedPrecio')
					}, function(distribuidos){
						context.filterEqual(context.get('store'), 'receta', {
								'precio': context.get('selectedPrecio')
							}, function(recetas){
								distribuidos.forEach((distribuido)=>{
									productList.pushObject(distribuido)
								})
								recetas.forEach((receta)=>{
									productList.pushObject(receta)
							})
							//console.log(productList)
							// debugger
							return resolve(productList)
						})
				})
			})
		}

    }),

	tipoProducto: computed('selectedProducto', function(){
		return this.get('selectedProducto.constructor.modelName')
	}),

	existenceProm: computed('selectedProducto', function(){
		let context = this;
		return DS.PromiseObject.create({
			promise: new Promise(function (resolve, reject){
				context.filterEqual(context.get('store'), 'existence', { 'productoId': context.get('selectedProducto.id')}, function(existence){
					return resolve(existence[0])
			})
		})
		})
	}),

	existenceProducto: computed('existenceProm.content', function(){
		return this.get('existenceProm.content')
	}),

	disabledAgregar: computed('selectedProducto', function() {
		return isBlank(this.get('selectedProducto'));
    }),

	actions: {
		agregarPedido(model){
			if (model.get('cantidad') > 0){
				if (this.get('selectedProducto.id') != null) {
					model.set('productoId', this.get('selectedProducto.id'));
					model.set('tipo', this.get('selectedProducto.constructor.modelName'));
					model.save().then(()=>{
						this.send('changeProducto')
						this.transitionToRoute('vendedor.procesando-venta', this.get('venta_id'))
					})
				} else {
					window.Materialize.toast('Selecciona un producto', 4000)
				}
			} else {
				window.Materialize.toast('La cantidad no puede ser 0', 4000)
			}
		},

		delete(pedido){
			pedido.destroyRecord()
		},

		changePrecio(precio){
			this.set('selectedPrecio', precio);
			// this.send('changeProducto')
		},

		changeProducto(){
			this.set('selectedProducto', undefined)
		}
	}

});
