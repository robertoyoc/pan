import Controller from '@ember/controller';
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";

export default Controller.extend({
	productList: service(),
	store: service(),
	
	init(){
		this.set('cantidad',1);
	},

    productos: computed(function() {
		debugger
       return this.get('productList.productos')
      }), 

	actions: {
		finalizar(){
			all(
				venta.get('pedidos').invoke('save')
			).then(()=>{
				venta.save()
			})

		}
	}

});
