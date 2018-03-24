import Controller from '@ember/controller';
import { inject as service } from "@ember/service";
import { computed } from '@ember/object';

export default Controller.extend({
	store: service(),
	
	myCategorias: computed(function() {
		return this.get('store').findAll('categoria')
    }),

	actions: {
		guardar(producto) {
			producto.save().then(()=>{
				window.swal("Guardado!", "El producto ha sido guardado!", "success");
			}).then(()=>{
				this.transitionToRoute('admin.productos');
			})	
		}
	}

});