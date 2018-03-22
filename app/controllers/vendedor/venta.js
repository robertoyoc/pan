import Controller from '@ember/controller';
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";

export default Controller.extend({
	store: service(),
	
	init(){
		this.set('cantidad',1);
	},

    productos: computed(function() {
        return this.get('store').findAll('producto');
      }), 

	actions: {
		mas(){
			this.set('cantidad', this.get('cantidad')+1);
		},
		menos(){
			if(this.get('cantidad')>1)
				this.set('cantidad', this.get('cantidad')-1);

		},
		finalizar(){
			all(
				venta.get('pedidos').invoke('save')
			).then(()=>{
				venta.save()
			})

		}
	}

});
