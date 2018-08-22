import Controller from '@ember/controller';
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';
import { inject as service } from "@ember/service";
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';
import DS from 'ember-data';

export default Controller.extend(FindQuery, {
	store: service(),
	currentUser: service(),

	selectedPrecio: "all",
	precios: [1.5, 2.0, 5.0, 6.0, 7.0, 7.5, 8.0, 8.5, 10.0],
	// Fuente: http://www3.inegi.org.mx/sistemas/inp/preciospromedio/
	// Tulancingo, CDMX

	init(){
		this.set('cantProduct',0);
	},

	sucursalActual: computed(function(){
			return DS.PromiseObject.create({
					promise: this.get('currentUser.account').then((account)=>{
							return account.get('vendedorDe')
					})
			})
	}),
	currentSucursal: computed('sucursalActual.content', function(){
		return this.get('sucursalActual.content')
	}),

	venta: computed('venta_id', function(){
		return this.store.peekRecord('venta', this.get('venta_id'))
	}),

	myProducts: computed('selectedPrecio', function() {
		if (this.get('selectedPrecio')=="all"){
			let productosList = [];
					return DS.PromiseArray.create({
						promise: this.get('store').findAll('distribuido').then((distribuidos)=>{
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
					});
		} else {
			let productList = [];
			let context = this;
			return DS.PromiseArray.create({
				promise: new Promise(function (resolve, reject){
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
								return resolve(productList)
							})
					})
				})
			});
		}
    }),
		myProductos: computed('myProducts.content', function(){
			return this.get('myProducts.content');
		}),
		dir: 'asc',
		sort: 'nombre',
		sortBy: computed('dir', 'sort', function() {
	    return [`${this.get('sort')}:${this.get('dir')}`];
	  }).readOnly(),
		sortedProductos: computed.sort('myProductos', 'sortBy'),

	tipoProducto: computed('selectedProducto', function(){
		return this.get('selectedProducto.constructor.modelName')
	}),

	existenceProm: computed('selectedProducto', function(){
		let context = this;
		let baseModel = this.get('tipoProducto');
		let productoId = this.get('selectedProducto.id');
		let sucursalId = this.get('currentSucursal.id');

		return DS.PromiseObject.create({
			promise: new Promise(function (resolve, reject){
				context.filterEqual(context.get('store'), 'existence',
			  (baseModel == 'receta') ?
				{	'tipo': baseModel, 'receta.id': productoId, 'sucursal.id': sucursalId } :
				{	'tipo': baseModel, 'distribuido.id': productoId, 'sucursal.id': sucursalId }
				, function(existence){
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

	 alreadyProductt: computed('model', 'selectedProducto', 'venta_id', function(){
 		let pedido_id = this.get('model.id');
 		let venta_id = this.get('venta_id');
 		let producto_id = this.get('selectedProducto.id');
		let courtesy_pd = this.get('model.isCourtesy');
 		let context = this;
     return DS.PromiseObject.create({
     	promise: new Promise(function (resolve, reject){
         context.filterCustom(context.store, 'pedido', {
         	'venta.id': ['==', context.get('venta_id')],
         }, function(pedidos){
					 pedidos.forEach((pedido)=>{
						 if(pedido.get('id') != pedido_id && pedido.get('productoId') == producto_id && pedido.get('isCourtesy') == courtesy_pd) {
							 // console.log('Expected: ', courtesy_pd, 'Obtained: ', pedido.get('isCourtesy'));
							 return resolve(pedido);
						 }
					 });
					 return resolve(null);
				 })
 	      })
       })
     }),
    alreadyProduct: computed('alreadyProductt.content', function(){
 		 return this.get('alreadyProductt.content')
 	 }),

	actions: {
		agregarPedido(model, venta, pedidoExistente){
			if (model.get('cantidad') > 0){
				if (this.get('selectedProducto.id') != null) {

					if(!isBlank(pedidoExistente)) {
						if(pedidoExistente.get('isCourtesy')){
							if(model.get('isCourtesy')) {
								// AGREGANDO CORTESIA A CORTESIA EXISTENTE
								pedidoExistente.set('cantidad', pedidoExistente.get('cantidad') + model.get('cantidad'));
								pedidoExistente.save().then(()=>{
									this.send('changeProducto');
									venta.save().then(()=>{
										model.destroyRecord();
										this.transitionToRoute('vendedor.procesando-venta', this.get('venta_id'));
									});
								});
							} else {
								// NUEVO PEDIDO, CORTESIA EXISTENTE
								model.set('productoId', this.get('selectedProducto.id'));
								model.set('tipo', this.get('selectedProducto.constructor.modelName'));
								model.save().then(()=>{
									this.send('changeProducto');
									venta.save().then(()=>{
										this.transitionToRoute('vendedor.procesando-venta', this.get('venta_id'));
									});
								});
							}
						} else {
							if(model.get('isCourtesy')) {
								// PEDIDO EXISTENTE, NUEVA CORTESIA
								model.set('productoId', this.get('selectedProducto.id'));
								model.set('tipo', this.get('selectedProducto.constructor.modelName'));
								model.save().then(()=>{
									this.send('changeProducto');
									venta.save().then(()=>{
										this.transitionToRoute('vendedor.procesando-venta', this.get('venta_id'));
									});
								});
							} else {
								// AGREGANDO PEDIDO A PEDIDO EXISTENTE
								pedidoExistente.set('cantidad', pedidoExistente.get('cantidad') + model.get('cantidad'));
								pedidoExistente.save().then(()=>{
									this.send('changeProducto');
									venta.save().then(()=>{
										model.destroyRecord();
										this.transitionToRoute('vendedor.procesando-venta', this.get('venta_id'));
									});
								});
							}
						}
					} else {
						// LA COMPRA NO INCLUYE UN PEDIDO CON EL PRODUCTO
						model.set('productoId', this.get('selectedProducto.id'));
						model.set('tipo', this.get('selectedProducto.constructor.modelName'));
						model.save().then(()=>{
							this.send('changeProducto');
							venta.save().then(()=>{
								this.transitionToRoute('vendedor.procesando-venta', this.get('venta_id'));
							});
						});
					}
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
			this.send('changeProducto');
		},

		changeProducto(){
			this.set('selectedProducto', null);
		}
	}

});
