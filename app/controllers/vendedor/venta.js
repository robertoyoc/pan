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

	actions: {

		agregarPedido(model){
			if (model.get('cantidad') > 0){
				this.transitionToRoute('vendedor.procesando-venta', this.get('venta_id'))
			} else {
				window.Materialize.toast('La cantidad no puede ser 0', 4000)
			}
		},

		finalizar(){
			all(venta.get('pedidos').invoke('save')).then(()=>{
				venta.save();
			})
		}, 
		
		selectNull() {
            this.set('mySelectedProduct', undefined)
        }
	}

});
