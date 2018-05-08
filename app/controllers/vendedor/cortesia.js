import Controller from '@ember/controller';
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import { isBlank } from '@ember/utils'; 
import FindQuery from 'ember-emberfire-find-query/mixins/find-query';

export default Controller.extend(FindQuery, {
	/*
		//productList: service(),
		productos: computed(function() {
			debugger
       	return this.get('productList.productos')
      	}), 
	*/
 	
	selectedCategoria: "all",

	store: service(),
	
	init(){
		this.set('cantProduct',0);
	},

	venta: computed('cortesia_id', function(){
		return this.store.peekRecord('cortesia', this.get('cortesia_id'))
	}),

	myCategorias: computed(function() {
		return this.get('store').findAll('categoria')
    }),

	myProductos: computed('selectedCategoria', function() {
		if (this.get('selectedCategoria')=="all"){
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
			let context = this;
			return new Promise(function (resolve, reject){
				context.filterEqual(context.get('store'), 'categoria', { 'nombre': context.get('selectedCategoria')}, function(categoria){
					let idProductos = categoria[0].get('productosId')
					let productList = [];
					idProductos.forEach((producto)=>{
						productList.pushObject(context.store.findRecord(producto.tipo, producto.id))
					})
					return resolve(productList)
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
						this.transitionToRoute('vendedor.procesando-cortesia', this.get('cortesia_id'))
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

		changeCategoria(nomCategoria){
			this.set('selectedCategoria', nomCategoria);
			this.send('changeProducto')
		},

		changeProducto(){
			this.set('selectedProducto', undefined)
		}
	}

});
