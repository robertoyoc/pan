import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { computed } from '@ember/object';

export default Component.extend({

    store: service(),
	
	myCategorias: computed(function() {
		return this.get('store').findAll('categoria')
    }),

	actions: {
        // finalizar(venta){
		// 	all(venta.get('pedidos').invoke('save')).then(()=>{
		// 		venta.save();
        //         this.sendAction('nuevaVenta');
		// 	})
        // }, 
        guardar(producto) {
			producto.save().then(()=>{
                window.swal("Guardado!", "El producto ha sido guardado!", "success");
            }).then(()=>{
                this.sendAction('nuevaVenta');
            })
        }
    }
});
