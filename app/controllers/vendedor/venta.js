import Controller from '@ember/controller';
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";

export default Controller.extend({
	//productList: service(),
	/*
		 productos: computed(function() {
		debugger
       return this.get('productList.productos')
      }), 
	*/
 	
	store: service(),
	
	init(){
		this.set('cantProduct',0);
	},

	venta: computed('venta_id', function(){
		return this.store.peekRecord('venta', this.get('venta_id'))
	}),

	myCategorias: computed(function() {
		return this.get('store').findAll('categoria')
    }),

	myProductos: computed(function() {
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
    }),

	tipoProducto: computed('selectedProducto', function(){
		return this.get('selectedProducto.constructor.modelName')	
	}),

	actions: {
		agregarPedido(model){
			if (model.get('cantidad') > 0){
				if (this.get('selectedProducto.id') != null) {
					model.set('productoId', this.get('selectedProducto.id'));
					model.set('tipo', this.get('selectedProducto.constructor.modelName'));
					model.save().then(()=>{
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

		// changeCategoria(nomCategoria){

		// }
	}

});
